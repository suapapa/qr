use wasm_bindgen::prelude::*;
use qrcode::{QrCode, EcLevel, Version};
use image::{DynamicImage, RgbaImage, Rgba, ImageOutputFormat, GenericImageView, GenericImage, imageops};
use std::io::Cursor;

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

fn hex_to_rgba(hex: &str) -> Rgba<u8> {
    let hex = hex.trim_start_matches('#');
    let r = u8::from_str_radix(&hex.get(0..2).unwrap_or("00"), 16).unwrap_or(0);
    let g = u8::from_str_radix(&hex.get(2..4).unwrap_or("00"), 16).unwrap_or(0);
    let b = u8::from_str_radix(&hex.get(4..6).unwrap_or("00"), 16).unwrap_or(0);
    Rgba([r, g, b, 255])
}

fn make_odd(v: u32) -> u32 {
    if v % 2 == 1 { v } else { v + 1 }
}

fn compute_logo_layout(module_count: u32, logo_fraction: f32, padding_modules: u32) -> (u32, u32) {
    let max_clear = std::cmp::max(5, (module_count as f32 * 0.25) as u32);
    let max_clear = make_odd(max_clear);

    let mut requested_logo = std::cmp::max(3, (module_count as f32 * logo_fraction) as u32);
    requested_logo = make_odd(requested_logo);
    let requested_clear = make_odd(requested_logo + padding_modules * 2);

    let mut clear_modules = std::cmp::min(requested_clear, max_clear);
    let mut logo_modules = if clear_modules > padding_modules * 2 { clear_modules - padding_modules * 2 } else { 3 };
    
    if logo_modules < 3 {
        logo_modules = 3;
        clear_modules = make_odd(logo_modules + padding_modules * 2);
        if clear_modules > max_clear {
            let p = std::cmp::max(0, (max_clear as i32 - logo_modules as i32) / 2) as u32;
            clear_modules = make_odd(logo_modules + p * 2);
        }
    }
    
    (logo_modules, clear_modules)
}

fn trim_logo(logo: &DynamicImage, threshold: u8) -> DynamicImage {
    let mut min_x = logo.width();
    let mut min_y = logo.height();
    let mut max_x = 0;
    let mut max_y = 0;
    let mut found = false;

    for y in 0..logo.height() {
        for x in 0..logo.width() {
            let pixel = logo.get_pixel(x, y);
            if pixel[3] > threshold {
                found = true;
                if x < min_x { min_x = x; }
                if y < min_y { min_y = y; }
                if x > max_x { max_x = x; }
                if y > max_y { max_y = y; }
            }
        }
    }

    if found && min_x <= max_x && min_y <= max_y {
        logo.crop_imm(min_x, min_y, max_x - min_x + 1, max_y - min_y + 1)
    } else {
        logo.clone()
    }
}

#[wasm_bindgen]
pub fn generate_qr_wasm(
    data: &str,
    logo_bytes: Option<Vec<u8>>,
    logo_fraction: f32,
    box_size: u32,
    border: u32,
    version_bump: i32,
    do_trim_logo: bool,
    fill_color: &str,
    back_color: &str,
) -> Result<Vec<u8>, JsValue> {
    
    let mut min_version = match QrCode::with_error_correction_level(data, EcLevel::H) {
        Ok(qr) => qr.version(),
        Err(e) => return Err(JsValue::from_str(&format!("QR Code data error: {:?}", e))),
    };
    
    let mut target_v = match min_version {
        Version::Normal(v) => v,
        Version::Micro(_) => 1,
    };
    
    target_v += version_bump as i16;
    if target_v > 40 {
        target_v = 40;
    }
    
    let target_version = Version::Normal(target_v);
    
    let qr = match QrCode::with_version(data, target_version, EcLevel::H) {
        Ok(q) => q,
        Err(_) => QrCode::with_error_correction_level(data, EcLevel::H).map_err(|e| JsValue::from_str(&e.to_string()))?
    };

    let module_count = qr.width() as u32;
    let matrix: Vec<bool> = qr.into_colors().into_iter().map(|c| c == qrcode::Color::Dark).collect();
    
    let mut has_logo = false;
    let mut logo_img = None;
    if let Some(bytes) = logo_bytes {
        if !bytes.is_empty() {
            has_logo = true;
            logo_img = Some(image::load_from_memory(&bytes).map_err(|e| JsValue::from_str(&e.to_string()))?);
        }
    }

    let mut clear_modules = 0;
    let mut logo_modules = 0;

    let mut render_matrix = vec![vec![false; module_count as usize]; module_count as usize];
    for y in 0..module_count {
        for x in 0..module_count {
            render_matrix[y as usize][x as usize] = matrix[(y * module_count + x) as usize];
        }
    }

    if has_logo {
        let (lm, cm) = compute_logo_layout(module_count, logo_fraction, 1);
        logo_modules = lm;
        clear_modules = cm;
        
        let center = module_count as f32 / 2.0;
        let radius_sq = (clear_modules as f32 / 2.0).powi(2);

        for y in 0..module_count {
            let dr = (y as f32 + 0.5) - center;
            let dr_sq = dr * dr;
            for x in 0..module_count {
                let dc = (x as f32 + 0.5) - center;
                let dist_sq = dr_sq + dc * dc;
                if dist_sq <= radius_sq {
                    render_matrix[y as usize][x as usize] = false;
                }
            }
        }
    }

    let grid = module_count + border * 2;
    let fill_rgba = hex_to_rgba(fill_color);
    let back_rgba = hex_to_rgba(back_color);

    let mut img = RgbaImage::from_pixel(grid * box_size, grid * box_size, back_rgba);

    for y in 0..module_count {
        for x in 0..module_count {
            if render_matrix[y as usize][x as usize] {
                let px_x = (x + border) * box_size;
                let px_y = (y + border) * box_size;
                for dy in 0..box_size {
                    for dx in 0..box_size {
                        img.put_pixel(px_x + dx, px_y + dy, fill_rgba);
                    }
                }
            }
        }
    }

    if has_logo {
        let mut logo_dynamic = logo_img.unwrap();
        
        let center_px_x = (module_count as f32 / 2.0 + border as f32) * box_size as f32;
        let center_px_y = (module_count as f32 / 2.0 + border as f32) * box_size as f32;
        let outer_radius_px = (clear_modules as f32 / 2.0) * box_size as f32;
        let inner_radius_px = (logo_modules as f32 / 2.0) * box_size as f32;

        // Draw center white circle
        for y in 0..img.height() {
            for x in 0..img.width() {
                let dx = x as f32 + 0.5 - center_px_x;
                let dy = y as f32 + 0.5 - center_px_y;
                if dx * dx + dy * dy <= outer_radius_px * outer_radius_px {
                    img.put_pixel(x, y, Rgba([255, 255, 255, 255]));
                }
            }
        }

        let logo_max_px = (inner_radius_px * 2.0 * 0.92) as u32;
        
        if do_trim_logo {
            logo_dynamic = trim_logo(&logo_dynamic, 10);
        }

        let aspect_ratio = logo_dynamic.width() as f32 / logo_dynamic.height() as f32;
        let new_width;
        let new_height;
        if aspect_ratio > 1.0 {
            new_width = logo_max_px;
            new_height = (new_width as f32 / aspect_ratio) as u32;
        } else {
            new_height = logo_max_px;
            new_width = (new_height as f32 * aspect_ratio) as u32;
        }

        let logo_resized = imageops::resize(&logo_dynamic, new_width, new_height, imageops::FilterType::Lanczos3);

        let logo_pos_x = (center_px_x - new_width as f32 / 2.0) as i64;
        let logo_pos_y = (center_px_y - new_height as f32 / 2.0) as i64;

        // Paste with mask
        for y in 0..logo_resized.height() {
            for x in 0..logo_resized.width() {
                let logo_px = logo_resized.get_pixel(x, y);
                if logo_px[3] > 0 {
                    let out_x = logo_pos_x + x as i64;
                    let out_y = logo_pos_y + y as i64;
                    if out_x >= 0 && out_x < img.width() as i64 && out_y >= 0 && out_y < img.height() as i64 {
                        let mut base_px = img.get_pixel(out_x as u32, out_y as u32).clone();
                        let alpha = logo_px[3] as f32 / 255.0;
                        base_px[0] = ((logo_px[0] as f32 * alpha) + (base_px[0] as f32 * (1.0 - alpha))) as u8;
                        base_px[1] = ((logo_px[1] as f32 * alpha) + (base_px[1] as f32 * (1.0 - alpha))) as u8;
                        base_px[2] = ((logo_px[2] as f32 * alpha) + (base_px[2] as f32 * (1.0 - alpha))) as u8;
                        base_px[3] = 255; // output is solid
                        img.put_pixel(out_x as u32, out_y as u32, base_px);
                    }
                }
            }
        }
    }

    let mut buf = Cursor::new(Vec::new());
    img.write_to(&mut buf, ImageOutputFormat::Png).map_err(|e| JsValue::from_str(&e.to_string()))?;

    Ok(buf.into_inner())
}
