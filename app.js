// ========================================
// VietQR Clone - Using VietQR API
// ========================================

// Vietnamese Banks Data (matching VietQR.io bank codes)
const BANKS = [
    { bin: "970436", code: "VCB", name: "Vietcombank", logo: "https://api.vietqr.io/img/VCB.png" },
    { bin: "970418", code: "BIDV", name: "BIDV", logo: "https://api.vietqr.io/img/BIDV.png" },
    { bin: "970415", code: "ICB", name: "VietinBank", logo: "https://api.vietqr.io/img/ICB.png" },
    { bin: "970405", code: "VBA", name: "Agribank", logo: "https://api.vietqr.io/img/VBA.png" },
    { bin: "970407", code: "TCB", name: "Techcombank", logo: "https://api.vietqr.io/img/TCB.png" },
    { bin: "970423", code: "TPB", name: "TPBank", logo: "https://api.vietqr.io/img/TPB.png" },
    { bin: "970422", code: "MB", name: "MBBank", logo: "https://api.vietqr.io/img/MB.png" },
    { bin: "970416", code: "ACB", name: "ACB", logo: "https://api.vietqr.io/img/ACB.png" },
    { bin: "970432", code: "VPB", name: "VPBank", logo: "https://api.vietqr.io/img/VPB.png" },
    { bin: "970403", code: "STB", name: "Sacombank", logo: "https://api.vietqr.io/img/STB.png" },
    { bin: "970437", code: "HDB", name: "HDBank", logo: "https://api.vietqr.io/img/HDB.png" },
    { bin: "970448", code: "OCB", name: "OCB", logo: "https://api.vietqr.io/img/OCB.png" },
    { bin: "970426", code: "MSB", name: "MSB", logo: "https://api.vietqr.io/img/MSB.png" },
    { bin: "970431", code: "EIB", name: "Eximbank", logo: "https://api.vietqr.io/img/EIB.png" },
    { bin: "970443", code: "SHB", name: "SHB", logo: "https://api.vietqr.io/img/SHB.png" },
    { bin: "970441", code: "VIB", name: "VIB", logo: "https://api.vietqr.io/img/VIB.png" },
    { bin: "970440", code: "SEAB", name: "SeABank", logo: "https://api.vietqr.io/img/SEAB.png" },
    { bin: "970449", code: "LPB", name: "LienVietPostBank", logo: "https://api.vietqr.io/img/LPB.png" },
    { bin: "970424", code: "SHBVN", name: "ShinhanBank", logo: "https://api.vietqr.io/img/SHBVN.png" },
    { bin: "970439", code: "PVCB", name: "PVcomBank", logo: "https://api.vietqr.io/img/PVCB.png" }
];

// DOM Elements
const bankSelect = document.getElementById('bankSelect');
const qrForm = document.getElementById('qrForm');
const qrResult = document.getElementById('qrResult');
const qrCodeDiv = document.getElementById('qrCode');
const bankLogo = document.getElementById('bankLogo');
const accountInfo = document.getElementById('accountInfo');
const downloadBtn = document.getElementById('downloadBtn');
const newBtn = document.getElementById('newBtn');

// State
let currentBank = null;
let currentQRUrl = null;

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Populate bank select
    BANKS.forEach(bank => {
        const option = document.createElement('option');
        option.value = bank.code;
        option.textContent = bank.name;
        option.dataset.logo = bank.logo;
        option.dataset.bin = bank.bin;
        bankSelect.appendChild(option);
    });

    // Event listeners
    bankSelect.addEventListener('change', (e) => {
        const opt = e.target.selectedOptions[0];
        if (opt && opt.value) {
            currentBank = {
                code: opt.value,
                name: opt.textContent,
                logo: opt.dataset.logo,
                bin: opt.dataset.bin
            };
        } else {
            currentBank = null;
        }
    });

    qrForm.addEventListener('submit', generateQR);
    downloadBtn.addEventListener('click', downloadQR);
    newBtn.addEventListener('click', resetForm);

    // Format amount
    document.getElementById('amount').addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val) e.target.value = Number(val).toLocaleString('vi-VN');
    });

    console.log('VietQR App ready!');
}

// Generate QR using VietQR.io API (free, no CORS issues with images)
function generateQR(e) {
    e.preventDefault();

    if (!currentBank) {
        showToast('Vui lòng chọn ngân hàng');
        return;
    }

    const accountNo = document.getElementById('accountNo').value.trim();
    if (!accountNo) {
        showToast('Vui lòng nhập số tài khoản');
        return;
    }

    const accountName = document.getElementById('accountName').value.trim().toUpperCase();
    const amount = document.getElementById('amount').value.replace(/\D/g, '') || '0';
    const desc = removeVnTones(document.getElementById('description').value.trim());

    // Use VietQR.io image API
    // Format: https://img.vietqr.io/image/{BANK_CODE}-{ACCOUNT_NO}-{TEMPLATE}.png?amount={AMOUNT}&addInfo={DESC}&accountName={NAME}
    let qrUrl = `https://img.vietqr.io/image/${currentBank.code}-${accountNo}-compact2.png`;

    const params = new URLSearchParams();
    if (amount && amount !== '0') params.append('amount', amount);
    if (desc) params.append('addInfo', desc);
    if (accountName) params.append('accountName', accountName);

    if (params.toString()) {
        qrUrl += '?' + params.toString();
    }

    currentQRUrl = qrUrl;

    // Show loading
    qrCodeDiv.innerHTML = '<div style="padding:40px;color:#666">Đang tạo mã QR...</div>';
    qrForm.style.display = 'none';
    qrResult.style.display = 'flex';

    // Create image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        qrCodeDiv.innerHTML = '';
        img.style.maxWidth = '200px';
        img.style.borderRadius = '8px';
        qrCodeDiv.appendChild(img);

        bankLogo.src = currentBank.logo;
        bankLogo.alt = currentBank.name;
        bankLogo.style.display = 'none'; // VietQR API already includes logo

        accountInfo.innerHTML = `
            <div class="acc-number">${accountNo}</div>
            ${accountName ? `<div class="acc-name">${accountName}</div>` : ''}
        `;

        showToast('Tạo mã QR thành công!');
    };

    img.onerror = () => {
        qrCodeDiv.innerHTML = '<div style="padding:20px;color:#ff6b6b">Lỗi tạo mã QR. Vui lòng thử lại.</div>';
        showToast('Lỗi tạo mã QR');
    };

    img.src = qrUrl;
}

// Download QR
function downloadQR() {
    if (!currentQRUrl) return;

    // Open in new tab for download (workaround for cross-origin)
    const link = document.createElement('a');
    link.href = currentQRUrl;
    link.target = '_blank';
    link.click();
    showToast('Đang mở hình ảnh QR');
}

// Reset form
function resetForm() {
    qrForm.reset();
    qrForm.style.display = 'block';
    qrResult.style.display = 'none';
    currentBank = null;
    currentQRUrl = null;
}

// Remove Vietnamese tones
function removeVnTones(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .toUpperCase();
}

// Toast notification
function showToast(msg) {
    const old = document.querySelector('.toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
