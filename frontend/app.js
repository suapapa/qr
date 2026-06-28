document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Constants & State Variables
    // Use localhost:8000 for local files/dev-servers, or relative paths for Nginx reverse-proxying.
    const API_BASE = (window.location.port === '5500' || window.location.port === '3000' || window.location.port === '5173' || window.location.protocol === 'file:')
        ? 'http://localhost:8000'
        : '';
    let currentQrType = 'url';
    let uploadedLogoFile = null;
    let currentQrBlobUrl = null;
    let currentQrBlob = null;
    let currentQrPayload = 'https://homin.dev';

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

    // Password visibility toggle
    const toggleWifiPass = document.getElementById('toggle-wifi-pass');
    const inputWifiPass = document.getElementById('input-wifi-pass');

    // Toast notifications container
    const toastContainer = document.getElementById('toast-container');

    // 4. Toast Notification Helper
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
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

    // 5. Tab Switching Logic (with keyboard navigation)
    function updateTabFocusability(activeButton) {
        tabButtons.forEach((btn) => {
            btn.setAttribute('tabindex', btn === activeButton ? '0' : '-1');
        });
    }

    function selectQrType(selectedType) {
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

    // 6. Wi-Fi Password Toggle
    toggleWifiPass.addEventListener('click', () => {
        const isPassword = inputWifiPass.getAttribute('type') === 'password';
        inputWifiPass.setAttribute('type', isPassword ? 'text' : 'password');
        toggleWifiPass.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
        
        // Update Icon
        toggleWifiPass.innerHTML = isPassword ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
        lucide.createIcons();
    });

    // 7. Logo Upload / Drag and Drop handlers
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
            showToast('이미지 파일만 업로드할 수 있습니다.', 'error');
            return;
        }

        uploadedLogoFile = file;

        // Size Formatting
        const sizeKB = (file.size / 1024).toFixed(1);
        logoFileName.textContent = file.name;
        logoFileSize.textContent = `${sizeKB} KB`;

        // Render Preview Thumbnail
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedLogoImg.src = e.target.result;
            uploadPromptView.classList.add('hidden');
            uploadPreviewView.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
        
        showToast('로고 이미지가 추가되었습니다.');
    }

    btnRemoveLogo.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent triggering dropzone click
        removeUploadedLogo();
    });

    function removeUploadedLogo() {
        uploadedLogoFile = null;
        logoFileInput.value = '';
        uploadedLogoImg.src = '';
        uploadPreviewView.classList.add('hidden');
        uploadPromptView.classList.remove('hidden');
        showToast('로고 이미지가 제거되었습니다.');
    }

    // 8. Default Logo Toggle Mutual Exclusion
    checkDefaultLogo.addEventListener('change', () => {
        syncDropzoneState();
        if (checkDefaultLogo.checked) {
            if (uploadedLogoFile) {
                uploadPreviewView.classList.add('hidden');
                uploadPromptView.classList.remove('hidden');
            }
            showToast('기본 로고(logo.png) 사용이 활성화되었습니다.');
        } else if (uploadedLogoFile) {
            uploadPromptView.classList.add('hidden');
            uploadPreviewView.classList.remove('hidden');
        }
    });

    syncDropzoneState();

    // 9. Slider values live synchronization
    rangeLogoFraction.addEventListener('input', (e) => {
        logoFractionVal.textContent = `${Math.round(e.target.value * 100)}%`;
    });

    // 10. Form input validation helper
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
                document.getElementById('error-url').textContent = 'URL 주소를 입력해주세요.';
                isValid = false;
            } else {
                // Basic pattern verify
                try {
                    // Prepend http if missing just for validation constructor
                    const testUrl = urlInput.value.includes('://') ? urlInput.value : 'https://' + urlInput.value;
                    new URL(testUrl);
                } catch (_) {
                    document.getElementById('error-url').textContent = '올바른 형식의 URL 주소를 입력해주세요. (예: example.com)';
                    isValid = false;
                }
            }
        } else if (currentQrType === 'wifi') {
            const ssidInput = document.getElementById('input-wifi-ssid');
            if (!ssidInput.value.trim()) {
                document.getElementById('error-wifi-ssid').textContent = 'WiFi 네트워크 이름(SSID)을 입력해주세요.';
                isValid = false;
            }
        } else if (currentQrType === 'text') {
            const textInput = document.getElementById('input-text');
            if (!textInput.value.trim()) {
                document.getElementById('error-text').textContent = '텍스트 내용을 입력해주세요.';
                isValid = false;
            }
        } else if (currentQrType === 'phone') {
            const phoneInput = document.getElementById('input-phone');
            if (!phoneInput.value.trim()) {
                document.getElementById('error-phone').textContent = '전화번호를 입력해주세요.';
                isValid = false;
            }
        } else if (currentQrType === 'sms') {
            const smsPhoneInput = document.getElementById('input-sms-phone');
            if (!smsPhoneInput.value.trim()) {
                document.getElementById('error-sms-phone').textContent = '수신자 전화번호를 입력해주세요.';
                isValid = false;
            }
        } else if (currentQrType === 'email') {
            const emailInput = document.getElementById('input-email-to');
            if (!emailInput.value.trim()) {
                document.getElementById('error-email-to').textContent = '이메일 주소를 입력해주세요.';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
                document.getElementById('error-email-to').textContent = '올바른 이메일 주소를 입력해주세요.';
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
        
        if (!validateActiveInputs()) {
            showToast('입력 값을 확인해 주세요.', 'error');
            focusFirstValidationError();
            return;
        }

        // Show Loading state
        qrPlaceholderView.classList.add('hidden');
        qrResultImage.classList.add('hidden');
        qrLoadingView.classList.remove('hidden');
        setQrFrameBusy(true);
        btnGenerate.disabled = true;
        btnGenerate.querySelector('.btn-text').textContent = 'QR 코드 생성 중...';
        btnDownload.disabled = true;
        btnCopy.disabled = true;

        // Build Payload string for metadata check later
        resolvePayloadForMetadata();

        // Construct Form Data
        const formData = new FormData();
        formData.append('qr_type', currentQrType);
        
        // Append panel specific fields
        if (currentQrType === 'url') {
            formData.append('url', document.getElementById('input-url').value);
        } else if (currentQrType === 'wifi') {
            formData.append('wifi_ssid', document.getElementById('input-wifi-ssid').value);
            formData.append('wifi_pass', document.getElementById('input-wifi-pass').value);
            formData.append('wifi_security', document.getElementById('select-wifi-security').value);
        } else if (currentQrType === 'text') {
            formData.append('text', document.getElementById('input-text').value);
        } else if (currentQrType === 'phone') {
            formData.append('phone', document.getElementById('input-phone').value);
        } else if (currentQrType === 'sms') {
            formData.append('sms_phone', document.getElementById('input-sms-phone').value);
            formData.append('sms_message', document.getElementById('input-sms-message').value);
        } else if (currentQrType === 'email') {
            formData.append('email_to', document.getElementById('input-email-to').value);
            formData.append('email_subject', document.getElementById('input-email-subject').value);
            formData.append('email_body', document.getElementById('input-email-body').value);
        }

        // Append Advanced Configurations
        formData.append('logo_fraction', rangeLogoFraction.value);
        formData.append('box_size', DEFAULT_BOX_SIZE);
        formData.append('version_bump', DEFAULT_VERSION_BUMP);
        formData.append('trim_logo', checkTrimLogo.checked);
        formData.append('use_default_logo', checkDefaultLogo.checked);
        formData.append('fill_color', DEFAULT_FILL_COLOR);
        formData.append('back_color', DEFAULT_BACK_COLOR);

        // Append File if uploaded and default logo is NOT checked
        if (uploadedLogoFile && !checkDefaultLogo.checked) {
            formData.append('logo_file', uploadedLogoFile);
        }

        try {
            const response = await fetch(`${API_BASE}/api/generate`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'QR 코드 생성에 실패했습니다.');
            }

            // Read binary PNG response
            currentQrBlob = await response.blob();
            
            // Revoke older object URL to free memory
            if (currentQrBlobUrl) {
                URL.revokeObjectURL(currentQrBlobUrl);
            }
            
            currentQrBlobUrl = URL.createObjectURL(currentQrBlob);

            // Render Result Image
            qrResultImage.src = currentQrBlobUrl;
            qrResultImage.classList.remove('hidden');
            
            // Enable Actions & Details
            btnDownload.disabled = false;
            btnCopy.disabled = false;
            renderMetadataDisplay();
            showToast('성공적으로 QR 코드가 생성되었습니다!');

        } catch (error) {
            console.error('Error generating QR:', error);
            showToast(error.message || '서버 연결에 실패했습니다. 백엔드가 실행 중인지 확인하세요.', 'error');
            qrPlaceholderView.classList.remove('hidden');
        } finally {
            qrLoadingView.classList.add('hidden');
            setQrFrameBusy(false);
            btnGenerate.disabled = false;
            btnGenerate.querySelector('.btn-text').textContent = 'QR 코드 생성';
        }
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
            url: '웹 링크 (URL)',
            wifi: '와이파이 (Wi-Fi)',
            text: '텍스트 (Raw Text)',
            phone: '전화 (Phone Call)',
            sms: '문자 (SMS 메시지)',
            email: '이메일 (E-mail)'
        };
        
        metaType.textContent = typeMap[currentQrType] || currentQrType;
        metaLength.textContent = `${currentQrPayload.length} 자`;
        qrMetadataView.classList.remove('hidden');
    }

    // 13. Download Button Trigger
    btnDownload.addEventListener('click', () => {
        if (!currentQrBlobUrl) return;

        const downloadLink = document.createElement('a');
        downloadLink.href = currentQrBlobUrl;
        
        // Generate nice timestamped filename
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        downloadLink.download = `qr-code-${currentQrType}-${timestamp}.png`;
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        showToast('다운로드가 시작되었습니다.');
    });

    // 14. Copy Button Trigger (PNG Image directly to clipboard, fallback to payload string)
    btnCopy.addEventListener('click', async () => {
        if (!currentQrBlob) return;

        try {
            // Check browser capability for writing Image Blobs to Clipboard
            if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
                const item = new ClipboardItem({ 'image/png': currentQrBlob });
                await navigator.clipboard.write([item]);
                showToast('클립보드에 QR 코드가 이미지로 복사되었습니다!');
            } else {
                throw new Error('ClipboardImageNotSupported');
            }
        } catch (err) {
            // Fallback: Copy raw payload text
            try {
                await navigator.clipboard.writeText(currentQrPayload);
                showToast('클립보드에 QR 데이터 텍스트가 복사되었습니다! (이미지 복사 미지원 브라우저)');
            } catch (fallbackErr) {
                showToast('복사에 실패했습니다.', 'error');
            }
        }
    });
});
