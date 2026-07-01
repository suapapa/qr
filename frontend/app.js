import init, { generate_qr_wasm } from './wasm/wasm_qr.js';

const translations = {
    ko: {
        title: "QR Studio",
        tagline: "중앙 로고 삽입을 지원하는 실시간 QR 생성기",
        skip_to_content: "본문으로 건너뛰기",
        qr_settings: "QR 코드 설정",
        qr_type: "QR 코드 종류",
        qr_type_aria: "QR 코드 종류 선택",
        tab_url: "URL",
        tab_wifi: "Wi-Fi",
        tab_text: "텍스트",
        tab_phone: "전화",
        tab_sms: "SMS",
        tab_email: "이메일",
        
        // URL panel
        url_label: "연결할 URL 주소",
        
        // Wi-Fi panel
        wifi_ssid_label: "네트워크 이름 (SSID)",
        wifi_ssid_placeholder: "WiFi SSID 입력",
        wifi_pass_label: "비밀번호",
        wifi_pass_placeholder: "비밀번호 입력",
        wifi_pass_toggle_aria: "비밀번호 보기 토글",
        wifi_security_label: "보안 설정",
        wifi_security_wpa: "WPA/WPA2",
        wifi_security_wep: "WEP",
        wifi_security_open: "암호 없음 (Open)",
        
        // Text panel
        text_label: "입력할 텍스트",
        text_placeholder: "QR 코드에 담을 텍스트 내용을 입력하세요...",
        
        // Phone panel
        phone_label: "전화번호",
        phone_placeholder: "010-1234-5678",
        
        // SMS panel
        sms_phone_label: "수신자 전화번호",
        sms_phone_placeholder: "010-1234-5678",
        sms_message_label: "메시지 내용",
        sms_message_placeholder: "전송할 문자 메시지를 입력하세요...",
        
        // Email panel
        email_to_label: "수신 이메일 주소",
        email_to_placeholder: "recipient@example.com",
        email_subject_label: "메일 제목",
        email_subject_placeholder: "이메일 제목 입력",
        email_body_label: "메일 본문",
        email_body_placeholder: "이메일 내용 입력...",
        
        // Logo settings
        logo_settings_title: "중앙 로고 설정",
        use_default_logo_label: "기본 로고 사용",
        use_default_logo_desc: "시스템 기본 로고(logo.png)를 QR 중앙에 올립니다.",
        upload_zone_aria: "로고 이미지 업로드: 드래그하거나 Enter로 파일 선택",
        upload_zone_primary: "여기에 로고 이미지 드래그 또는 <span>파일 선택</span>",
        upload_zone_secondary: "PNG, JPG (투명 배경 PNG 권장)",
        upload_preview_alt: "업로드된 로고 프리뷰",
        remove_logo_aria: "로고 삭제",
        logo_size_label: "로고 크기 비율",
        logo_size_desc: "QR 코드 손상 한계 대비 안전한 로고 지름 크기 (권장: 20%)",
        qr_border_label: "테두리(여백) 크기",
        qr_border_desc: "QR 주변 여백 모듈 수 (표준: 4칸, 최신 기기: 1~2칸 권장)",
        trim_logo_label: "로고 여백 자동 제거",
        
        // Buttons
        btn_generate: "QR 코드 생성",
        btn_generating: "QR 코드 생성 중...",
        
        // Preview
        preview_title: "QR 코드 프리뷰",
        placeholder_text: "설정을 변경하고 <strong>QR 코드 생성</strong>을 클릭하세요.",
        loading_text: "QR 코드를 렌더링하는 중...",
        qr_result_alt: "생성된 QR 코드 이미지",
        meta_type_label: "인코딩 타입",
        meta_length_label: "데이터 길이",
        btn_download: "PNG 다운로드",
        btn_copy: "복사하기",
        
        // ECC
        ecc_title: "오류 복구 수준 (ECC)",
        ecc_option_l: "L (낮음 - 약 7% 복구)",
        ecc_option_m: "M (보통 - 약 15% 복구)",
        ecc_option_q: "Q (높음 - 약 25% 복구)",
        ecc_option_h: "H (최고 - 약 30% 복구)",
        ecc_desc: "오류 복구 수준이 높을수록 QR 코드가 일부 가려지거나 훼손되어도 인식률이 향상됩니다.",
        ecc_desc_logo: "중앙 로고 삽입 시 H 레벨(최고 수준) 오류 복구가 자동으로 적용되며, 짧은 데이터라도 로고가 잘리지 않도록 QR 해상도(버전)가 자동 보정됩니다.",
        
        // Toast notifications & Dynamic Strings
        toast_check_input: "입력 값을 확인해 주세요.",
        toast_wasm_not_loaded: "WASM 모듈이 아직 로드되지 않았습니다.",
        toast_err_default_logo: "기본 로고를 불러올 수 없습니다.",
        toast_success: "성공적으로 QR 코드가 생성되었습니다!",
        toast_image_only: "이미지 파일만 업로드할 수 있습니다.",
        toast_logo_added: "로고 이미지가 추가되었습니다.",
        toast_logo_removed: "로고 이미지가 제거되었습니다.",
        toast_default_logo_enabled: "기본 로고(logo.png) 사용이 활성화되었습니다.",
        toast_download_started: "다운로드가 시작되었습니다.",
        toast_copied_image: "클립보드에 QR 코드가 이미지로 복사되었습니다!",
        toast_copied_text: "클립보드에 QR 데이터 텍스트가 복사되었습니다! (이미지 복사 미지원 브라우저)",
        toast_copy_failed: "복사에 실패했습니다.",
        toast_generation_failed: "QR 코드 생성에 실패했습니다. 올바른 데이터를 입력했는지 확인하세요.",
        
        unit_blocks: "칸",
        unit_chars: " 자",
        
        meta_type_url: "웹 링크 (URL)",
        meta_type_wifi: "와이파이 (Wi-Fi)",
        meta_type_text: "텍스트 (Raw Text)",
        meta_type_phone: "전화 (Phone Call)",
        meta_type_sms: "문자 (SMS 메시지)",
        meta_type_email: "이메일 (E-mail)",
        
        err_url_empty: "URL 주소를 입력해주세요.",
        err_url_invalid: "올바른 형식의 URL 주소를 입력해주세요. (예: example.com)",
        err_wifi_ssid_empty: "WiFi 네트워크 이름(SSID)을 입력해주세요.",
        err_text_empty: "텍스트 내용을 입력해주세요.",
        err_phone_empty: "전화번호를 입력해주세요.",
        err_sms_phone_empty: "수신자 전화번호를 입력해주세요.",
        err_email_empty: "이메일 주소를 입력해주세요.",
        err_email_invalid: "올바른 이메일 주소를 입력해주세요."
    },
    en: {
        title: "QR Studio",
        tagline: "Real-time QR generator with custom center logo support",
        skip_to_content: "Skip to content",
        qr_settings: "QR Code Settings",
        qr_type: "QR Code Type",
        qr_type_aria: "Select QR Code Type",
        tab_url: "URL",
        tab_wifi: "Wi-Fi",
        tab_text: "Text",
        tab_phone: "Phone",
        tab_sms: "SMS",
        tab_email: "Email",
        
        url_label: "URL Address to Link",
        
        wifi_ssid_label: "Network Name (SSID)",
        wifi_ssid_placeholder: "Enter WiFi SSID",
        wifi_pass_label: "Password",
        wifi_pass_placeholder: "Enter Password",
        wifi_pass_toggle_aria: "Toggle password visibility",
        wifi_security_label: "Security Setting",
        wifi_security_wpa: "WPA/WPA2",
        wifi_security_wep: "WEP",
        wifi_security_open: "No Password (Open)",
        
        text_label: "Text to Enter",
        text_placeholder: "Enter the text content for the QR code...",
        
        phone_label: "Phone Number",
        phone_placeholder: "e.g., +1-234-567-890",
        
        sms_phone_label: "Recipient Phone Number",
        sms_phone_placeholder: "e.g., +1-234-567-890",
        sms_message_label: "Message Content",
        sms_message_placeholder: "Enter the text message to send...",
        
        email_to_label: "Recipient Email Address",
        email_to_placeholder: "recipient@example.com",
        email_subject_label: "Email Subject",
        email_subject_placeholder: "Enter email subject",
        email_body_label: "Email Body",
        email_body_placeholder: "Enter email body content...",
        
        logo_settings_title: "Center Logo Settings",
        use_default_logo_label: "Use Default Logo",
        use_default_logo_desc: "Place the system default logo (logo.png) in the center of the QR.",
        upload_zone_aria: "Upload logo image: drag & drop or press Enter to select a file",
        upload_zone_primary: "Drag logo image here or <span>select file</span>",
        upload_zone_secondary: "PNG, JPG (Transparent PNG recommended)",
        upload_preview_alt: "Uploaded logo preview",
        remove_logo_aria: "Remove logo",
        logo_size_label: "Logo Size Ratio",
        logo_size_desc: "Safe logo diameter relative to the QR code damage limit (Recommended: 20%)",
        qr_border_label: "Quiet Zone (Margin) Size",
        qr_border_desc: "Number of modules for the margin around the QR (Standard: 4, Recommended for modern devices: 1~2)",
        trim_logo_label: "Auto Trim Logo Margin",
        
        btn_generate: "Generate QR Code",
        btn_generating: "Generating QR Code...",
        
        preview_title: "QR Code Preview",
        placeholder_text: "Adjust settings and click <strong>Generate QR Code</strong>.",
        loading_text: "Rendering QR Code...",
        qr_result_alt: "Generated QR Code Image",
        meta_type_label: "Encoding Type",
        meta_length_label: "Data Length",
        btn_download: "Download PNG",
        btn_copy: "Copy Image",
        
        ecc_title: "Error Correction Level (ECC)",
        ecc_option_l: "L (Low - approx. 7% recovery)",
        ecc_option_m: "M (Medium - approx. 15% recovery)",
        ecc_option_q: "Q (High - approx. 25% recovery)",
        ecc_option_h: "H (Highest - approx. 30% recovery)",
        ecc_desc: "Higher error correction improves readability even if the QR code is partially covered or damaged.",
        ecc_desc_logo: "Inserting a center logo automatically applies H level (highest recovery) error correction, and dynamically adjusts the QR resolution (version) to prevent the logo from cropping.",
        
        toast_check_input: "Please check your inputs.",
        toast_wasm_not_loaded: "WASM module is not loaded yet.",
        toast_err_default_logo: "Unable to load default logo.",
        toast_success: "QR Code successfully generated!",
        toast_image_only: "Only image files can be uploaded.",
        toast_logo_added: "Logo image added.",
        toast_logo_removed: "Logo image removed.",
        toast_default_logo_enabled: "Default logo (logo.png) enabled.",
        toast_download_started: "Download started.",
        toast_copied_image: "QR code copied to clipboard as an image!",
        toast_copied_text: "QR data text copied to clipboard! (Image copy not supported by browser)",
        toast_copy_failed: "Copy failed.",
        toast_generation_failed: "Failed to generate QR Code. Please check if you entered valid data.",
        
        unit_blocks: " block(s)",
        unit_chars: " chars",
        
        meta_type_url: "Web Link (URL)",
        meta_type_wifi: "WiFi (Wi-Fi)",
        meta_type_text: "Raw Text",
        meta_type_phone: "Phone Call",
        meta_type_sms: "SMS Message",
        meta_type_email: "E-mail",
        
        err_url_empty: "Please enter a URL address.",
        err_url_invalid: "Please enter a valid URL address. (e.g., example.com)",
        err_wifi_ssid_empty: "Please enter a WiFi network name (SSID).",
        err_text_empty: "Please enter text content.",
        err_phone_empty: "Please enter a phone number.",
        err_sms_phone_empty: "Please enter recipient phone number.",
        err_email_empty: "Please enter an email address.",
        err_email_invalid: "Please enter a valid email address."
    },
    ja: {
        title: "QR Studio",
        tagline: "ロゴ中央挿入対応のリアルタイムQRコード生成ツール",
        skip_to_content: "本文へスキップ",
        qr_settings: "QRコード設定",
        qr_type: "QRコードの種類",
        qr_type_aria: "QRコードの種類の選択",
        tab_url: "URL",
        tab_wifi: "Wi-Fi",
        tab_text: "テキスト",
        tab_phone: "電話",
        tab_sms: "SMS",
        tab_email: "メール",
        
        url_label: "リンク先URLアドレス",
        
        wifi_ssid_label: "ネットワーク名 (SSID)",
        wifi_ssid_placeholder: "WiFi SSIDを入力",
        wifi_pass_label: "パスワード",
        wifi_pass_placeholder: "パスワードを入力",
        wifi_pass_toggle_aria: "パスワード表示切り替え",
        wifi_security_label: "セキュリティ設定",
        wifi_security_wpa: "WPA/WPA2",
        wifi_security_wep: "WEP",
        wifi_security_open: "パスワードなし (Open)",
        
        text_label: "入力テキスト",
        text_placeholder: "QRコードに含めるテキスト内容を入力してください...",
        
        phone_label: "電話番号",
        phone_placeholder: "例：090-1234-5678",
        
        sms_phone_label: "宛先電話番号",
        sms_phone_placeholder: "例：090-1234-5678",
        sms_message_label: "メッセージ内容",
        sms_message_placeholder: "送信するテキストメッセージを入力してください...",
        
        email_to_label: "宛先メールアドレス",
        email_to_placeholder: "recipient@example.com",
        email_subject_label: "件名",
        email_subject_placeholder: "メール件名を入力",
        email_body_label: "本文",
        email_body_placeholder: "メール本文を入力...",
        
        logo_settings_title: "中央ロゴ設定",
        use_default_logo_label: "デフォルトロゴを使用",
        use_default_logo_desc: "システムのデフォルトロゴ(logo.png)をQR中央に配置します。",
        upload_zone_aria: "ロゴ画像のアップロード：ドラッグ＆ドロップまたはEnterキーでファイルを選択",
        upload_zone_primary: "ロゴ画像をドラッグ＆ドロップするか <span>ファイルを選択</span>",
        upload_zone_secondary: "PNG、JPG (背景透明のPNG推奨)",
        upload_preview_alt: "アップロードされたロゴプレビュー",
        remove_logo_aria: "ロゴを削除",
        logo_size_label: "ロゴサイズ比率",
        logo_size_desc: "QRコードの損傷限度に対する安全なロゴ直径サイズ (推奨: 20%)",
        qr_border_label: "クワイエットゾーン（余白）サイズ",
        qr_border_desc: "QRコードの周囲の余白モジュール数 (標準: 4マス、推奨: 1〜2マス)",
        trim_logo_label: "ロゴの余白を自動カット",
        
        btn_generate: "QRコード生成",
        btn_generating: "QRコード生成中...",
        
        preview_title: "QRコードプレビュー",
        placeholder_text: "設定を変更し、<strong>QRコード生成</strong>をクリックしてください。",
        loading_text: "QRコードをレンダリング中...",
        qr_result_alt: "生成されたQRコード画像",
        meta_type_label: "エンコードタイプ",
        meta_length_label: "データ文字数",
        btn_download: "PNGダウンロード",
        btn_copy: "コピーする",
        
        ecc_title: "誤り訂正レベル (ECC)",
        ecc_option_l: "L (低い - 約7%修復可能)",
        ecc_option_m: "M (標準 - 約15%修復可能)",
        ecc_option_q: "Q (高い - 約25%修復可能)",
        ecc_option_h: "H (最高 - 約30%修復可能)",
        ecc_desc: "誤り訂正レベルを高くすると、QRコードの一部が汚れたり隠れたりしても読み取りやすくなります。",
        ecc_desc_logo: "中央ロゴを挿入すると、自動的にHレベル（最高）の誤り訂正が適用され、データ量が少なくてもロゴが切れないようにQRの解像度（バージョン）が自動調整されます。",
        
        toast_check_input: "入力値を確認してください。",
        toast_wasm_not_loaded: "WASMモジュールがまだ読み込まれていません。",
        toast_err_default_logo: "デフォルトのロゴを読み込めません。",
        toast_success: "QRコードが正常に生成されました！",
        toast_image_only: "画像ファイルのみアップロードできます。",
        toast_logo_added: "ロゴ画像が追加されました。",
        toast_logo_removed: "ロゴ画像が削除されました。",
        toast_default_logo_enabled: "デフォルトロゴ(logo.png)の使用が有効になりました。",
        toast_download_started: "ダウンロードを開始しました。",
        toast_copied_image: "クリップボードにQRコード画像がコピーされました！",
        toast_copied_text: "QRコードのテキストデータをクリップボードにコピーしました！ (画像コピー非対応ブラウザ)",
        toast_copy_failed: "コピーに失敗しました。",
        toast_generation_failed: "QRコードの生成に失敗しました。正しいデータが入力されているか確認してください。",
        
        unit_blocks: "マス",
        unit_chars: " 文字",
        
        meta_type_url: "ウェブリンク (URL)",
        meta_type_wifi: "WiFi (Wi-Fi)",
        meta_type_text: "テキスト (Raw Text)",
        meta_type_phone: "電話 (Phone Call)",
        meta_type_sms: "ショートメッセージ (SMS)",
        meta_type_email: "メール (E-mail)",
        
        err_url_empty: "URLアドレスを入力してください。",
        err_url_invalid: "正しい形式のURLアドレスを入力してください。(例: example.com)",
        err_wifi_ssid_empty: "WiFiのネットワーク名(SSID)を入力してください。",
        err_text_empty: "テキスト内容を入力してください。",
        err_phone_empty: "電話番号を入力してください。",
        err_sms_phone_empty: "宛先の電話番号を入力してください。",
        err_email_empty: "メールアドレスを入力してください。",
        err_email_invalid: "正しいメールアドレスを入力してください。"
    },
    zh: {
        title: "QR Studio",
        tagline: "支持在中心插入自定义 Logo 的实时 QR 码生成器",
        skip_to_content: "跳过并转到正文",
        qr_settings: "QR 码设置",
        qr_type: "QR 码类型",
        qr_type_aria: "选择 QR 码类型",
        tab_url: "URL",
        tab_wifi: "Wi-Fi",
        tab_text: "文本",
        tab_phone: "电话",
        tab_sms: "短信",
        tab_email: "电子邮件",
        
        url_label: "要链接的 URL 地址",
        
        wifi_ssid_label: "网络名称 (SSID)",
        wifi_ssid_placeholder: "输入 WiFi SSID",
        wifi_pass_label: "密码",
        wifi_pass_placeholder: "输入密码",
        wifi_pass_toggle_aria: "切换密码显示状态",
        wifi_security_label: "安全设置",
        wifi_security_wpa: "WPA/WPA2",
        wifi_security_wep: "WEP",
        wifi_security_open: "无密码 (Open)",
        
        text_label: "输入文本",
        text_placeholder: "请输入要在 QR 码中包含的文本内容...",
        
        phone_label: "电话号码",
        phone_placeholder: "例如：138-1234-5678",
        
        sms_phone_label: "接收方电话号码",
        sms_phone_placeholder: "例如：138-1234-5678",
        sms_message_label: "短信内容",
        sms_message_placeholder: "请输入要发送的短信内容...",
        
        email_to_label: "接收方邮箱地址",
        email_to_placeholder: "recipient@example.com",
        email_subject_label: "邮件主题",
        email_subject_placeholder: "输入邮件主题",
        email_body_label: "邮件正文",
        email_body_placeholder: "输入邮件正文内容...",
        
        logo_settings_title: "中心 Logo 设置",
        use_default_logo_label: "使用默认 Logo",
        use_default_logo_desc: "将系统默认 Logo (logo.png) 放在 QR 码中央。",
        upload_zone_aria: "上传 Logo 图片：拖拽或按 Enter 键选择文件",
        upload_zone_primary: "将 Logo 图片拖拽到此处，或 <span>选择文件</span>",
        upload_zone_secondary: "PNG、JPG (推荐背景透明的 PNG 格式)",
        upload_preview_alt: "已上传 Logo 预览",
        remove_logo_aria: "删除 Logo",
        logo_size_label: "Logo 尺寸比例",
        logo_size_desc: "相对于 QR 码损坏限制的安全 Logo 直径尺寸 (推荐: 20%)",
        qr_border_label: "静区（边距）尺寸",
        qr_border_desc: "QR 码周围的边距模块数 (标准: 4格，推荐: 1~2格)",
        trim_logo_label: "自动裁剪 Logo 边距",
        
        btn_generate: "生成 QR 码",
        btn_generating: "正在生成 QR 码...",
        
        preview_title: "QR 码预览",
        placeholder_text: "调整设置并点击<strong>生成 QR 码</strong>。",
        loading_text: "正在渲染 QR 码...",
        qr_result_alt: "生成的 QR 码图片",
        meta_type_label: "编码类型",
        meta_length_label: "数据长度",
        btn_download: "下载 PNG",
        btn_copy: "复制图片",
        
        ecc_title: "容错级别 (ECC)",
        ecc_option_l: "L (低 - 约可恢复 7% 的数据)",
        ecc_option_m: "M (中等 - 约可恢复 15% 的数据)",
        ecc_option_q: "Q (高 - 约可恢复 25% 的数据)",
        ecc_option_h: "H (最高 - 约可恢复 30% 的数据)",
        ecc_desc: "容错级别越高，即使 QR 码被部分遮挡或污损，也能保持可读性。",
        ecc_desc_logo: "插入中心 Logo 时，会自动应用 H 级别（最高容错）并自动调整 QR 分辨率（版本），以防止 Logo 被截断。",
        
        toast_check_input: "请检查您的输入项。",
        toast_wasm_not_loaded: "WASM 模块尚未加载完成。",
        toast_err_default_logo: "无法加载默认 Logo。",
        toast_success: "QR 码已成功生成！",
        toast_image_only: "只能上传图片文件。",
        toast_logo_added: "Logo 图片已添加。",
        toast_logo_removed: "Logo 图片已移除。",
        toast_default_logo_enabled: "已启用默认 Logo (logo.png)。",
        toast_download_started: "下载已开始。",
        toast_copied_image: "QR 码已成功作为图片复制到剪贴板！",
        toast_copied_text: "QR 码文本数据已复制到剪贴板！(浏览器不支持复制图片)",
        toast_copy_failed: "复制失败。",
        toast_generation_failed: "生成 QR 码失败。请检查是否输入了有效数据。",
        
        unit_blocks: "格",
        unit_chars: " 字",
        
        meta_type_url: "网址链接 (URL)",
        meta_type_wifi: "无线网络 (Wi-Fi)",
        meta_type_text: "纯文本 (Raw Text)",
        meta_type_phone: "电话呼叫 (Phone Call)",
        meta_type_sms: "短信 (SMS)",
        meta_type_email: "电子邮件 (E-mail)",
        
        err_url_empty: "请输入 URL 地址。",
        err_url_invalid: "请输入有效格式的 URL 地址。(例如: example.com)",
        err_wifi_ssid_empty: "请输入 WiFi 网络名称 (SSID)。",
        err_text_empty: "请输入文本内容。",
        err_phone_empty: "请输入电话号码。",
        err_sms_phone_empty: "请输入接收方的电话号码。",
        err_email_empty: "请输入邮箱地址。",
        err_email_invalid: "请输入有效的邮箱地址。"
    },
    pl: {
        title: "QR Studio",
        tagline: "Generator kodów QR w czasie rzeczywistym z opcją wstawiania własnego logo",
        skip_to_content: "Przejdź do zawartości",
        qr_settings: "Ustawienia kodu QR",
        qr_type: "Typ kodu QR",
        qr_type_aria: "Wybierz typ kodu QR",
        tab_url: "URL",
        tab_wifi: "Wi-Fi",
        tab_text: "Tekst",
        tab_phone: "Telefon",
        tab_sms: "SMS",
        tab_email: "E-mail",
        
        url_label: "Adres URL do powiązania",
        
        wifi_ssid_label: "Nazwa sieci (SSID)",
        wifi_ssid_placeholder: "Wpisz SSID sieci WiFi",
        wifi_pass_label: "Hasło",
        wifi_pass_placeholder: "Wpisz hasło",
        wifi_pass_toggle_aria: "Przełącz widoczność hasła",
        wifi_security_label: "Ustawienia zabezpieczeń",
        wifi_security_wpa: "WPA/WPA2",
        wifi_security_wep: "WEP",
        wifi_security_open: "Brak hasła (Otwarte)",
        
        text_label: "Tekst do wpisania",
        text_placeholder: "Wpisz treść tekstu dla kodu QR...",
        
        phone_label: "Numer telefonu",
        phone_placeholder: "np. +48 123 456 789",
        
        sms_phone_label: "Numer telefonu odbiorcy",
        sms_phone_placeholder: "np. +48 123 456 789",
        sms_message_label: "Treść wiadomości",
        sms_message_placeholder: "Wpisz wiadomość tekstową do wysłania...",
        
        email_to_label: "Adres e-mail odbiorcy",
        email_to_placeholder: "recipient@example.com",
        email_subject_label: "Temat wiadomości",
        email_subject_placeholder: "Wpisz temat wiadomości",
        email_body_label: "Treść wiadomości",
        email_body_placeholder: "Wpisz treść wiadomości e-mail...",
        
        logo_settings_title: "Ustawienia logo",
        use_default_logo_label: "Użyj domyślnego logo",
        use_default_logo_desc: "Umieść domyślne logo systemowe (logo.png) na środku kodu QR.",
        upload_zone_aria: "Prześlij obraz logo: przeciągnij i upuść lub naciśnij Enter, aby wybrać plik",
        upload_zone_primary: "Przeciągnij obraz logo tutaj lub <span>wybierz plik</span>",
        upload_zone_secondary: "PNG, JPG (Zalecany format PNG z przezroczystym tłem)",
        upload_preview_alt: "Podgląd przesłanego logo",
        remove_logo_aria: "Usuń logo",
        logo_size_label: "Proporcja rozmiaru logo",
        logo_size_desc: "Bezpieczna średnica logo w stosunku do limitu uszkodzeń kodu QR (Zalecane: 20%)",
        qr_border_label: "Rozmiar marginesu (Quiet Zone)",
        qr_border_desc: "Liczba modułów marginesu wokół kodu QR (Standard: 4, Zalecane na nowoczesnych urządzeniach: 1~2)",
        trim_logo_label: "Automatycznie przycinaj marginesy logo",
        
        btn_generate: "Generuj kod QR",
        btn_generating: "Generowanie kodu QR...",
        
        preview_title: "Podgląd kodu QR",
        placeholder_text: "Dostosuj ustawienia i kliknij <strong>Generuj kod QR</strong>.",
        loading_text: "Renderowanie kodu QR...",
        qr_result_alt: "Generowany obraz kodu QR",
        meta_type_label: "Typ kodowania",
        meta_length_label: "Długość danych",
        btn_download: "Pobierz PNG",
        btn_copy: "Skopiuj obraz",
        
        ecc_title: "Poziom korekcji błędów (ECC)",
        ecc_option_l: "L (Niski - ok. 7% odzyskiwania)",
        ecc_option_m: "M (Średni - ok. 15% odzyskiwania)",
        ecc_option_q: "Q (Wysoki - ok. 25% odzyskiwania)",
        ecc_option_h: "H (Najwyższy - ok. 30% odzyskiwania)",
        ecc_desc: "Wyższy poziom korekcji poprawia czytelność, nawet jeśli kod QR jest częściowo zasłonięty lub uszkodzony.",
        ecc_desc_logo: "Wstawienie logo na środku automatycznie wymusza poziom H (najwyższy) korekcji oraz dynamicznie dopasowuje rozdzielczość (wersję) kodu QR, zapobiegając ucięciu logo.",
        
        toast_check_input: "Sprawdź poprawność wprowadzonych danych.",
        toast_wasm_not_loaded: "Moduł WASM nie został jeszcze załadowany.",
        toast_err_default_logo: "Nie można załadować domyślnego logo.",
        toast_success: "Kod QR wygenerowany pomyślnie!",
        toast_image_only: "Można przesyłać wyłącznie pliki graficzne.",
        toast_logo_added: "Dodano obraz logo.",
        toast_logo_removed: "Usunięto obraz logo.",
        toast_default_logo_enabled: "Włączono domyślne logo (logo.png).",
        toast_download_started: "Rozpoczęto pobieranie.",
        toast_copied_image: "Skopiowano obraz kodu QR do schowka!",
        toast_copied_text: "Skopiowano tekst danych kodu QR do schowka! (Kopiowanie obrazu nieobsługiwane przez przeglądarkę)",
        toast_copy_failed: "Kopiowanie nie powiodło się.",
        toast_generation_failed: "Nie udało się wygenerować kodu QR. Sprawdź, czy wprowadzono poprawne dane.",
        
        unit_blocks: " moduł(y)",
        unit_chars: " znaków",
        
        meta_type_url: "Link internetowy (URL)",
        meta_type_wifi: "Sieć bezprzewodowa (Wi-Fi)",
        meta_type_text: "Zwykły tekst (Raw Text)",
        meta_type_phone: "Połączenie telefoniczne",
        meta_type_sms: "Wiadomość SMS",
        meta_type_email: "E-mail",
        
        err_url_empty: "Wpisz adres URL.",
        err_url_invalid: "Wpisz poprawny adres URL (np. example.com).",
        err_wifi_ssid_empty: "Wpisz nazwę sieci WiFi (SSID).",
        err_text_empty: "Wpisz treść tekstu.",
        err_phone_empty: "Wpisz numer telefonu.",
        err_sms_phone_empty: "Wpisz numer telefonu odbiorcy.",
        err_email_empty: "Wpisz adres e-mail.",
        err_email_invalid: "Wpisz poprawny adres e-mail."
    }
};

let wasmReady = false;
init().then(() => {
    wasmReady = true;
    console.log("WASM module loaded.");
    if (window.triggerInitialGeneration) {
        window.triggerInitialGeneration();
    }
}).catch(console.error);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Constants & State Variables
    const API_BASE = (window.location.port === '5500' || window.location.port === '3000' || window.location.port === '5173' || window.location.protocol === 'file:')
        ? 'http://localhost:8000'
        : '';
    let currentQrType = 'url';
    let uploadedLogoFile = null;
    let currentQrBlobUrl = null;
    let currentQrBlob = null;
    let currentQrPayload = 'https://homin.dev';

    // Language state
    function getBrowserLanguage() {
        const langs = navigator.languages || [navigator.language || 'ko'];
        const supportedLangs = ['ko', 'en', 'ja', 'zh', 'pl'];
        
        for (const lang of langs) {
            const cleanLang = lang.split('-')[0].toLowerCase();
            if (supportedLangs.includes(cleanLang)) {
                return cleanLang;
            }
        }
        return 'en';
    }
    
    let currentLang = localStorage.getItem('preferred_language') || getBrowserLanguage();

    // 3. DOM Elements
    const form = document.getElementById('qr-generator-form');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const typeSelect = document.getElementById('select-qr-type');
    const inputPanels = document.querySelectorAll('.input-panel');
    const btnGenerate = document.getElementById('btn-generate');
    
    // Preview panel elements
    const qrFrame = document.getElementById('qr-frame');
    const qrPlaceholderView = document.getElementById('qr-placeholder-view');
    const qrLoadingView = document.getElementById('qr-loading-view');
    const qrResultImage = document.getElementById('qr-result-image');
    const qrMetadataView = document.getElementById('qr-metadata-view');
    const metaType = document.getElementById('meta-type');
    const metaLength = document.getElementById('meta-length');
    const btnDownload = document.getElementById('btn-download');
    const btnCopy = document.getElementById('btn-copy');

    // Logo settings elements
    const checkDefaultLogo = document.getElementById('check-default-logo');
    const logoDropzone = document.getElementById('logo-dropzone');
    const logoFileInput = document.getElementById('logo-file-input');
    const uploadPromptView = document.getElementById('upload-prompt-view');
    const uploadPreviewView = document.getElementById('upload-preview-view');
    const uploadedLogoImg = document.getElementById('uploaded-logo-img');
    const logoFileName = document.getElementById('logo-file-name');
    const logoFileSize = document.getElementById('logo-file-size');
    const btnRemoveLogo = document.getElementById('btn-remove-logo');
    
    const DEFAULT_BOX_SIZE = 12;
    const DEFAULT_VERSION_BUMP = 0;
    const DEFAULT_FILL_COLOR = '#000000';
    const DEFAULT_BACK_COLOR = '#ffffff';

    // Sliders
    const rangeLogoFraction = document.getElementById('range-logo-fraction');
    const logoFractionVal = document.getElementById('logo-fraction-val');
    const checkTrimLogo = document.getElementById('check-trim-logo');
    const rangeQrBorder = document.getElementById('range-qr-border');
    const qrBorderVal = document.getElementById('qr-border-val');

    // Error correction elements & state
    const selectErrorCorrection = document.getElementById('select-error-correction');
    const eccDesc = document.getElementById('ecc-desc');
    let userSelectedEcc = 'M';

    // Password visibility toggle
    const toggleWifiPass = document.getElementById('toggle-wifi-pass');
    const inputWifiPass = document.getElementById('input-wifi-pass');

    // Toast notifications container
    const toastContainer = document.getElementById('toast-container');

    // 4. Translation Helper Function
    function setLanguage(lang) {
        if (!translations[lang]) lang = 'en';
        currentLang = lang;
        localStorage.setItem('preferred_language', lang);
        document.documentElement.lang = lang;
        
        // HTML select element update
        const selectLanguage = document.getElementById('select-language');
        if (selectLanguage && selectLanguage.value !== lang) {
            selectLanguage.value = lang;
        }
        
        // Select all elements with [data-i18n]
        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                if (translations[lang][key].includes('<') && translations[lang][key].includes('>')) {
                    el.innerHTML = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });
        
        // Select all elements with [data-i18n-placeholder]
        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                el.setAttribute('placeholder', translations[lang][key]);
            }
        });

        // Select all elements with [data-i18n-aria-label]
        document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
            const key = el.getAttribute('data-i18n-aria-label');
            if (translations[lang][key]) {
                el.setAttribute('aria-label', translations[lang][key]);
            }
        });

        // Select all elements with [data-i18n-alt]
        document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
            const key = el.getAttribute('data-i18n-alt');
            if (translations[lang][key]) {
                el.setAttribute('alt', translations[lang][key]);
            }
        });
        
        // Update range slider displays using unit variables
        if (rangeQrBorder) {
            qrBorderVal.textContent = `${rangeQrBorder.value}${translations[lang].unit_blocks}`;
        }
        
        // ECC description updates
        syncEccState();
        
        // Metadata block updates if visible
        if (qrMetadataView && !qrMetadataView.classList.contains('hidden')) {
            renderMetadataDisplay();
        }
    }

    // 5. Toast Notification Helper
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
        
        const iconName = type === 'success' ? 'check-circle' : 'alert-circle';
        toast.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        lucide.createIcons({ attrs: { class: 'toast-icon' } });

        // Auto dismiss after 3.5s
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity var(--transition-normal)';
            toast.addEventListener('transitionend', () => {
                toast.remove();
            }, { once: true });
        }, 3500);
    }

    // Debounce Helper
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function resetQrView() {
        if (currentQrBlobUrl) {
            URL.revokeObjectURL(currentQrBlobUrl);
            currentQrBlobUrl = null;
        }
        currentQrBlob = null;
        qrResultImage.src = '';
        qrResultImage.classList.add('hidden');
        qrPlaceholderView.classList.remove('hidden');
        qrLoadingView.classList.add('hidden');
        
        btnDownload.disabled = true;
        btnCopy.disabled = true;
        
        if (qrMetadataView) {
            qrMetadataView.classList.add('hidden');
        }
        setQrFrameBusy(false);
    }

    // QR Code Generation function (common)
    async function generateQR(isSilent = false) {
        if (!validateActiveInputs()) {
            resetQrView();
            if (!isSilent) {
                showToast(translations[currentLang].toast_check_input, 'error');
                focusFirstValidationError();
            }
            return;
        }

        // Show/Update loading state
        if (!isSilent) {
            qrPlaceholderView.classList.add('hidden');
            qrResultImage.classList.add('hidden');
            qrLoadingView.classList.remove('hidden');
        } else {
            qrResultImage.style.opacity = '0.5';
        }
        
        setQrFrameBusy(true);
        btnGenerate.disabled = true;
        btnGenerate.setAttribute('aria-busy', 'true');
        btnGenerate.querySelector('.btn-text').textContent = translations[currentLang].btn_generating;
        btnDownload.disabled = true;
        btnCopy.disabled = true;

        resolvePayloadForMetadata();

        try {
            if (!wasmReady) {
                throw new Error(translations[currentLang].toast_wasm_not_loaded);
            }

            let logoBytes = null;
            if (uploadedLogoFile && !checkDefaultLogo.checked) {
                const arrayBuffer = await uploadedLogoFile.arrayBuffer();
                logoBytes = new Uint8Array(arrayBuffer);
            } else if (checkDefaultLogo.checked) {
                try {
                    const res = await fetch('logo.png');
                    if (res.ok) {
                        const arrayBuffer = await res.arrayBuffer();
                        logoBytes = new Uint8Array(arrayBuffer);
                    }
                } catch(e) {
                    console.warn("Unable to load default logo.", e);
                }
            }

            const logoFraction = parseFloat(rangeLogoFraction.value);
            const qrBorder = parseInt(rangeQrBorder.value, 10);
            const trimLogo = checkTrimLogo.checked;

            const pngBytes = generate_qr_wasm(
                currentQrPayload,
                logoBytes,
                logoFraction,
                DEFAULT_BOX_SIZE,
                qrBorder,
                DEFAULT_VERSION_BUMP,
                trimLogo,
                DEFAULT_FILL_COLOR,
                DEFAULT_BACK_COLOR,
                selectErrorCorrection.value
            );

            currentQrBlob = new Blob([pngBytes.buffer], { type: 'image/png' });
            
            if (currentQrBlobUrl) {
                URL.revokeObjectURL(currentQrBlobUrl);
            }
            
            currentQrBlobUrl = URL.createObjectURL(currentQrBlob);

            qrResultImage.src = currentQrBlobUrl;
            qrPlaceholderView.classList.add('hidden');
            qrLoadingView.classList.add('hidden');
            qrResultImage.classList.remove('hidden');
            qrResultImage.style.opacity = '1';
            
            btnDownload.disabled = false;
            btnCopy.disabled = false;
            renderMetadataDisplay();
            
            if (!isSilent) {
                showToast(translations[currentLang].toast_success);
            }

        } catch (error) {
            console.error('Error generating QR:', error);
            if (!isSilent) {
                showToast(error.message || translations[currentLang].toast_generation_failed, 'error');
            }
            resetQrView();
        } finally {
            qrLoadingView.classList.add('hidden');
            setQrFrameBusy(false);
            btnGenerate.disabled = false;
            btnGenerate.setAttribute('aria-busy', 'false');
            btnGenerate.querySelector('.btn-text').textContent = translations[currentLang].btn_generate;
        }
    }

    const debouncedGenerateQR = debounce(() => {
        generateQR(true);
    }, 250);

    // 6. Tab Switching Logic (with keyboard navigation)
    function updateTabFocusability(activeButton) {
        tabButtons.forEach((btn) => {
            btn.setAttribute('tabindex', btn === activeButton ? '0' : '-1');
        });
    }

    function selectQrType(selectedType, skipGenerate = false) {
        tabButtons.forEach((btn) => {
            const isActive = btn.getAttribute('data-type') === selectedType;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            if (isActive) {
                updateTabFocusability(btn);
            }
        });

        if (typeSelect && typeSelect.value !== selectedType) {
            typeSelect.value = selectedType;
        }

        inputPanels.forEach((panel) => {
            panel.classList.remove('active');
        });
        const activePanel = document.getElementById(`panel-${selectedType}`);
        if (activePanel) {
            activePanel.classList.add('active');
        }

        currentQrType = selectedType;
        clearValidationErrors();
        if (!skipGenerate) {
            generateQR(true);
        }
    }

    function applyQueryParams() {
        const params = new URLSearchParams(window.location.search);
        if (params.toString() === '') return false;

        const TYPE_ALIASES = {
            txt: 'text',
            tel: 'phone',
        };
        const VALID_TYPES = new Set(['url', 'wifi', 'text', 'phone', 'sms', 'email']);

        const get = (...keys) => {
            for (const key of keys) {
                if (!params.has(key)) continue;
                const value = params.get(key);
                if (value !== null && value !== '') return value;
            }
            return null;
        };

        let qrType = get('type');
        if (qrType) {
            qrType = TYPE_ALIASES[qrType.toLowerCase()] || qrType.toLowerCase();
        }

        if (!qrType || !VALID_TYPES.has(qrType)) {
            if (get('ssid') !== null) qrType = 'wifi';
            else if (get('to', 'email') !== null) qrType = 'email';
            else if (get('message', 'msg') !== null && get('phone', 'tel', 'number') !== null) qrType = 'sms';
            else if (get('phone', 'tel', 'number') !== null) qrType = 'phone';
            else if (get('url') !== null) qrType = 'url';
            else if (get('content', 'text') !== null) qrType = 'text';
        }

        if (!qrType || !VALID_TYPES.has(qrType)) return false;

        switch (qrType) {
            case 'url': {
                const url = get('url', 'content');
                if (url) document.getElementById('input-url').value = url;
                break;
            }
            case 'wifi': {
                const ssid = get('ssid');
                if (ssid) document.getElementById('input-wifi-ssid').value = ssid;
                const pass = get('pass', 'password');
                if (pass !== null) document.getElementById('input-wifi-pass').value = pass;
                const sec = get('security', 'sec');
                if (sec) {
                    const secUpper = sec.toUpperCase();
                    const select = document.getElementById('select-wifi-security');
                    if (secUpper === 'NOPASS' || secUpper === 'OPEN') {
                        select.value = 'nopass';
                    } else if (secUpper === 'WPA' || secUpper === 'WEP') {
                        select.value = secUpper;
                    }
                }
                break;
            }
            case 'text': {
                const text = get('content', 'text');
                if (text) document.getElementById('input-text').value = text;
                break;
            }
            case 'phone': {
                const phone = get('phone', 'tel', 'number', 'content');
                if (phone) document.getElementById('input-phone').value = phone;
                break;
            }
            case 'sms': {
                const phone = get('phone', 'tel', 'number');
                if (phone) document.getElementById('input-sms-phone').value = phone;
                const msg = get('message', 'msg', 'body', 'content');
                if (msg) document.getElementById('input-sms-message').value = msg;
                break;
            }
            case 'email': {
                const to = get('to', 'email');
                if (to) document.getElementById('input-email-to').value = to;
                const subject = get('subject', 'sub');
                if (subject) document.getElementById('input-email-subject').value = subject;
                const body = get('body');
                if (body) document.getElementById('input-email-body').value = body;
                break;
            }
        }

        selectQrType(qrType, true);
        return true;
    }

    function selectTab(button) {
        selectQrType(button.getAttribute('data-type'));
    }

    if (typeSelect) {
        typeSelect.addEventListener('change', () => {
            selectQrType(typeSelect.value);
        });
    }

    tabButtons.forEach((button, index) => {
        if (button.classList.contains('active')) {
            button.setAttribute('tabindex', '0');
        } else {
            button.setAttribute('tabindex', '-1');
        }

        button.addEventListener('click', () => {
            selectTab(button);
        });

        button.addEventListener('keydown', (e) => {
            let targetIndex = index;

            if (e.key === 'ArrowRight') {
                targetIndex = (index + 1) % tabButtons.length;
            } else if (e.key === 'ArrowLeft') {
                targetIndex = (index - 1 + tabButtons.length) % tabButtons.length;
            } else if (e.key === 'Home') {
                targetIndex = 0;
            } else if (e.key === 'End') {
                targetIndex = tabButtons.length - 1;
            } else {
                return;
            }

            e.preventDefault();
            const targetButton = tabButtons[targetIndex];
            selectTab(targetButton);
            targetButton.focus();
        });
    });

    // 7. Wi-Fi Password Toggle
    toggleWifiPass.addEventListener('click', () => {
        const isPassword = inputWifiPass.getAttribute('type') === 'password';
        inputWifiPass.setAttribute('type', isPassword ? 'text' : 'password');
        toggleWifiPass.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
        
        toggleWifiPass.innerHTML = isPassword ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
        lucide.createIcons();
    });

    function syncEccState() {
        const hasLogo = (uploadedLogoFile !== null && !checkDefaultLogo.checked) || checkDefaultLogo.checked;
        if (hasLogo) {
            selectErrorCorrection.value = 'H';
            selectErrorCorrection.disabled = true;
            selectErrorCorrection.setAttribute('aria-disabled', 'true');
            eccDesc.textContent = translations[currentLang].ecc_desc_logo;
        } else {
            selectErrorCorrection.disabled = false;
            selectErrorCorrection.setAttribute('aria-disabled', 'false');
            selectErrorCorrection.value = userSelectedEcc;
            eccDesc.textContent = translations[currentLang].ecc_desc;
        }
    }

    selectErrorCorrection.addEventListener('change', () => {
        if (!selectErrorCorrection.disabled) {
            userSelectedEcc = selectErrorCorrection.value;
        }
        debouncedGenerateQR();
    });

    // 8. Logo Upload / Drag and Drop handlers
    function syncDropzoneState() {
        const disabled = checkDefaultLogo.checked;
        logoDropzone.classList.toggle('is-disabled', disabled);
        logoDropzone.setAttribute('aria-disabled', disabled ? 'true' : 'false');
        logoDropzone.setAttribute('tabindex', disabled ? '-1' : '0');
    }

    logoDropzone.addEventListener('click', () => {
        if (!checkDefaultLogo.checked) {
            logoFileInput.click();
        }
    });

    logoDropzone.addEventListener('keydown', (e) => {
        if (checkDefaultLogo.checked) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            logoFileInput.click();
        }
    });

    logoDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (checkDefaultLogo.checked) return;
        logoDropzone.classList.add('dragover');
    });

    logoDropzone.addEventListener('dragleave', () => {
        logoDropzone.classList.remove('dragover');
    });

    logoDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        logoDropzone.classList.remove('dragover');
        if (checkDefaultLogo.checked) return;

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleLogoFile(files[0]);
        }
    });

    logoFileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleLogoFile(files[0]);
        }
    });

    function handleLogoFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast(translations[currentLang].toast_image_only, 'error');
            return;
        }

        uploadedLogoFile = file;
        syncEccState();

        const sizeKB = (file.size / 1024).toFixed(1);
        logoFileName.textContent = file.name;
        logoFileSize.textContent = `${sizeKB} KB`;

        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedLogoImg.src = e.target.result;
            uploadPromptView.classList.add('hidden');
            uploadPreviewView.classList.remove('hidden');
            generateQR(true);
        };
        reader.readAsDataURL(file);
        
        showToast(translations[currentLang].toast_logo_added);
    }

    btnRemoveLogo.addEventListener('click', (e) => {
        e.stopPropagation();
        removeUploadedLogo();
    });

    function removeUploadedLogo() {
        uploadedLogoFile = null;
        logoFileInput.value = '';
        uploadedLogoImg.src = '';
        uploadPreviewView.classList.add('hidden');
        uploadPromptView.classList.remove('hidden');
        showToast(translations[currentLang].toast_logo_removed);
        syncEccState();
        generateQR(true);
    }

    // 9. Default Logo Toggle Mutual Exclusion
    checkDefaultLogo.addEventListener('change', () => {
        syncDropzoneState();
        syncEccState();
        if (checkDefaultLogo.checked) {
            if (uploadedLogoFile) {
                uploadPreviewView.classList.add('hidden');
                uploadPromptView.classList.remove('hidden');
            }
            showToast(translations[currentLang].toast_default_logo_enabled);
        } else if (uploadedLogoFile) {
            uploadPromptView.classList.add('hidden');
            uploadPreviewView.classList.remove('hidden');
        }
        generateQR(true);
    });

    syncDropzoneState();
    syncEccState();

    // 10. Slider values live synchronization
    rangeLogoFraction.addEventListener('input', (e) => {
        logoFractionVal.textContent = `${Math.round(e.target.value * 100)}%`;
        debouncedGenerateQR();
    });

    rangeQrBorder.addEventListener('input', (e) => {
        qrBorderVal.textContent = `${e.target.value}${translations[currentLang].unit_blocks}`;
        debouncedGenerateQR();
    });

    // 11. Form input validation helper
    function clearValidationErrors() {
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    }

    function focusFirstValidationError() {
        const firstError = document.querySelector('.error-msg:not(:empty)');
        if (!firstError) return;

        const fieldId = firstError.id.replace(/^error-/, '');
        const field = document.getElementById(`input-${fieldId}`) || document.getElementById(`select-${fieldId}`);
        if (field) {
            field.focus();
        }
    }

    function validateActiveInputs() {
        clearValidationErrors();
        let isValid = true;

        if (currentQrType === 'url') {
            const urlInput = document.getElementById('input-url');
            if (!urlInput.value) {
                document.getElementById('error-url').textContent = translations[currentLang].err_url_empty;
                isValid = false;
            } else {
                try {
                    const testUrl = urlInput.value.includes('://') ? urlInput.value : 'https://' + urlInput.value;
                    new URL(testUrl);
                } catch (_) {
                    document.getElementById('error-url').textContent = translations[currentLang].err_url_invalid;
                    isValid = false;
                }
            }
        } else if (currentQrType === 'wifi') {
            const ssidInput = document.getElementById('input-wifi-ssid');
            if (!ssidInput.value.trim()) {
                document.getElementById('error-wifi-ssid').textContent = translations[currentLang].err_wifi_ssid_empty;
                isValid = false;
            }
        } else if (currentQrType === 'text') {
            const textInput = document.getElementById('input-text');
            if (!textInput.value.trim()) {
                document.getElementById('error-text').textContent = translations[currentLang].err_text_empty;
                isValid = false;
            }
        } else if (currentQrType === 'phone') {
            const phoneInput = document.getElementById('input-phone');
            if (!phoneInput.value.trim()) {
                document.getElementById('error-phone').textContent = translations[currentLang].err_phone_empty;
                isValid = false;
            }
        } else if (currentQrType === 'sms') {
            const smsPhoneInput = document.getElementById('input-sms-phone');
            if (!smsPhoneInput.value.trim()) {
                document.getElementById('error-sms-phone').textContent = translations[currentLang].err_sms_phone_empty;
                isValid = false;
            }
        } else if (currentQrType === 'email') {
            const emailInput = document.getElementById('input-email-to');
            if (!emailInput.value.trim()) {
                document.getElementById('error-email-to').textContent = translations[currentLang].err_email_empty;
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
                document.getElementById('error-email-to').textContent = translations[currentLang].err_email_invalid;
                isValid = false;
            }
        }

        return isValid;
    }

    function setQrFrameBusy(isBusy) {
        qrFrame.setAttribute('aria-busy', isBusy ? 'true' : 'false');
    }

    // 12. Submit & AJAX Generate Call
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await generateQR(false);
    });

    // 12-2. Real-time Auto-generation
    form.addEventListener('input', () => {
        debouncedGenerateQR();
    });

    form.addEventListener('change', () => {
        debouncedGenerateQR();
    });

    // Determine target payload length for details
    function resolvePayloadForMetadata() {
        if (currentQrType === 'url') {
            currentQrPayload = document.getElementById('input-url').value;
        } else if (currentQrType === 'wifi') {
            const ssid = document.getElementById('input-wifi-ssid').value;
            const pass = document.getElementById('input-wifi-pass').value;
            const sec = document.getElementById('select-wifi-security').value;
            currentQrPayload = `WIFI:S:${ssid};T:${sec};P:${pass};;`;
        } else if (currentQrType === 'text') {
            currentQrPayload = document.getElementById('input-text').value;
        } else if (currentQrType === 'phone') {
            currentQrPayload = `tel:${document.getElementById('input-phone').value}`;
        } else if (currentQrType === 'sms') {
            const phone = document.getElementById('input-sms-phone').value;
            const msg = document.getElementById('input-sms-message').value;
            currentQrPayload = `SMSTO:${phone}:${msg}`;
        } else if (currentQrType === 'email') {
            const to = document.getElementById('input-email-to').value;
            const sub = document.getElementById('input-email-subject').value;
            const body = document.getElementById('input-email-body').value;
            currentQrPayload = `mailto:${to}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;
        }
    }

    function renderMetadataDisplay() {
        const typeMap = {
            url: translations[currentLang].meta_type_url,
            wifi: translations[currentLang].meta_type_wifi,
            text: translations[currentLang].meta_type_text,
            phone: translations[currentLang].meta_type_phone,
            sms: translations[currentLang].meta_type_sms,
            email: translations[currentLang].meta_type_email
        };
        
        metaType.textContent = typeMap[currentQrType] || currentQrType;
        metaLength.textContent = `${currentQrPayload.length}${translations[currentLang].unit_chars}`;
        qrMetadataView.classList.remove('hidden');
    }

    // 13. Download Button Trigger
    btnDownload.addEventListener('click', () => {
        if (!currentQrBlobUrl) return;

        const downloadLink = document.createElement('a');
        downloadLink.href = currentQrBlobUrl;
        
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        downloadLink.download = `qr-code-${currentQrType}-${timestamp}.png`;
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        showToast(translations[currentLang].toast_download_started);
    });

    // 14. Copy Button Trigger
    btnCopy.addEventListener('click', async () => {
        if (!currentQrBlob) return;

        try {
            if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
                const item = new ClipboardItem({ 'image/png': currentQrBlob });
                await navigator.clipboard.write([item]);
                showToast(translations[currentLang].toast_copied_image);
            } else {
                throw new Error('ClipboardImageNotSupported');
            }
        } catch (err) {
            try {
                await navigator.clipboard.writeText(currentQrPayload);
                showToast(translations[currentLang].toast_copied_text);
            } catch (fallbackErr) {
                showToast(translations[currentLang].toast_copy_failed, 'error');
            }
        }
    });

    // Language Selector Bindings
    const selectLanguage = document.getElementById('select-language');
    if (selectLanguage) {
        selectLanguage.value = currentLang;
        selectLanguage.addEventListener('change', (e) => {
            setLanguage(e.target.value);
            debouncedGenerateQR();
        });
    }

    // Initialize translations
    setLanguage(currentLang);

    applyQueryParams();

    window.triggerInitialGeneration = () => {
        if (wasmReady) {
            generateQR(true);
        }
    };

    window.triggerInitialGeneration();
});
