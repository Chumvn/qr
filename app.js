// ========================================
// VietQR Clone - Glassmorphism Version
// ========================================

// Vietnamese Banks Data
const BANKS = [
    { bin: "970436", name: "Vietcombank", shortName: "VCB", logo: "https://api.vietqr.io/img/VCB.png" },
    { bin: "970418", name: "BIDV", shortName: "BIDV", logo: "https://api.vietqr.io/img/BIDV.png" },
    { bin: "970415", name: "VietinBank", shortName: "CTG", logo: "https://api.vietqr.io/img/ICB.png" },
    { bin: "970405", name: "Agribank", shortName: "AGR", logo: "https://api.vietqr.io/img/VBA.png" },
    { bin: "970407", name: "Techcombank", shortName: "TCB", logo: "https://api.vietqr.io/img/TCB.png" },
    { bin: "970423", name: "TPBank", shortName: "TPB", logo: "https://api.vietqr.io/img/TPB.png" },
    { bin: "970422", name: "MBBank", shortName: "MB", logo: "https://api.vietqr.io/img/MB.png" },
    { bin: "970416", name: "ACB", shortName: "ACB", logo: "https://api.vietqr.io/img/ACB.png" },
    { bin: "970432", name: "VPBank", shortName: "VPB", logo: "https://api.vietqr.io/img/VPB.png" },
    { bin: "970403", name: "Sacombank", shortName: "STB", logo: "https://api.vietqr.io/img/STB.png" },
    { bin: "970437", name: "HDBank", shortName: "HDB", logo: "https://api.vietqr.io/img/HDB.png" },
    { bin: "970448", name: "OCB", shortName: "OCB", logo: "https://api.vietqr.io/img/OCB.png" },
    { bin: "970426", name: "MSB", shortName: "MSB", logo: "https://api.vietqr.io/img/MSB.png" },
    { bin: "970431", name: "Eximbank", shortName: "EIB", logo: "https://api.vietqr.io/img/EIB.png" },
    { bin: "970443", name: "SHB", shortName: "SHB", logo: "https://api.vietqr.io/img/SHB.png" },
    { bin: "970441", name: "VIB", shortName: "VIB", logo: "https://api.vietqr.io/img/VIB.png" },
    { bin: "970440", name: "SeABank", shortName: "SEAB", logo: "https://api.vietqr.io/img/SEAB.png" },
    { bin: "970449", name: "LienVietPostBank", shortName: "LPB", logo: "https://api.vietqr.io/img/LPB.png" },
    { bin: "970424", name: "ShinhanBank", shortName: "SHBVN", logo: "https://api.vietqr.io/img/SHBVN.png" },
    { bin: "970439", name: "PVcomBank", shortName: "PVCB", logo: "https://api.vietqr.io/img/PVCB.png" }
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

// Current selected bank
let currentBank = null;

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Populate bank select
    BANKS.forEach(bank => {
        const option = document.createElement('option');
        option.value = bank.bin;
        option.textContent = `${bank.name} (${bank.shortName})`;
        option.dataset.logo = bank.logo;
        option.dataset.name = bank.name;
        option.dataset.short = bank.shortName;
        bankSelect.appendChild(option);
    });

    // Event listeners
    bankSelect.addEventListener('change', (e) => {
        const opt = e.target.selectedOptions[0];
        if (opt && opt.value) {
            currentBank = {
                bin: opt.value,
                name: opt.dataset.name,
                shortName: opt.dataset.short,
                logo: opt.dataset.logo
            };
        } else {
            currentBank = null;
        }
    });

    qrForm.addEventListener('submit', generateQR);
    downloadBtn.addEventListener('click', downloadQR);
    newBtn.addEventListener('click', resetForm);

    // Format amount input
    document.getElementById('amount').addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val) e.target.value = Number(val).toLocaleString('vi-VN');
    });

    console.log('VietQR App initialized');
}

// Generate QR Code
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
    const amount = document.getElementById('amount').value.replace(/\D/g, '');
    const desc = removeVnTones(document.getElementById('description').value.trim());

    // Generate EMVCo QR string
    const qrData = buildVietQRString(currentBank.bin, accountNo, amount, desc);
    console.log('QR Data:', qrData);

    // Check if QRCode library is loaded
    if (typeof QRCode === 'undefined') {
        showToast('Lỗi: Thư viện QR chưa sẵn sàng. Vui lòng refresh trang.');
        return;
    }

    // Clear previous QR
    qrCodeDiv.innerHTML = '';

    // Generate QR using library
    QRCode.toCanvas(qrData, {
        width: 180,
        margin: 1,
        color: { dark: '#000', light: '#fff' }
    }, (err, canvas) => {
        if (err) {
            console.error('QR Error:', err);
            showToast('Lỗi tạo mã QR');
            return;
        }

        qrCodeDiv.appendChild(canvas);
        bankLogo.src = currentBank.logo;
        bankLogo.alt = currentBank.name;

        accountInfo.innerHTML = `
            <div class="acc-number">${accountNo}</div>
            ${accountName ? `<div class="acc-name">${accountName}</div>` : ''}
        `;

        qrForm.style.display = 'none';
        qrResult.style.display = 'flex';
        showToast('Tạo mã QR thành công!');
    });
}

// Build VietQR EMVCo string
function buildVietQRString(bankBin, accountNo, amount, desc) {
    let s = '';

    // 00 - Payload Format
    s += tlv('00', '01');

    // 01 - Point of Initiation (11=static, 12=dynamic)
    s += tlv('01', amount ? '12' : '11');

    // 38 - Merchant Account Info (VietQR)
    let merchant = '';
    merchant += tlv('00', 'A000000727');        // NAPAS
    merchant += tlv('01', bankBin + accountNo);  // BIN + Account
    merchant += tlv('02', 'QRIBFTTA');           // Service
    s += tlv('38', merchant);

    // 53 - Currency (704 = VND)
    s += tlv('53', '704');

    // 54 - Amount (optional)
    if (amount && amount !== '0') {
        s += tlv('54', amount);
    }

    // 58 - Country
    s += tlv('58', 'VN');

    // 62 - Additional Data (optional description)
    if (desc) {
        s += tlv('62', tlv('08', desc.substring(0, 25)));
    }

    // 63 - CRC placeholder
    s += '6304';

    // Calculate CRC
    const crc = crc16(s);
    return s.slice(0, -4) + '6304' + crc;
}

// TLV helper
function tlv(tag, value) {
    return tag + String(value.length).padStart(2, '0') + value;
}

// CRC16-CCITT
function crc16(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
        }
        crc &= 0xFFFF;
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Remove Vietnamese tones
function removeVnTones(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .toUpperCase();
}

// Download QR
function downloadQR() {
    const canvas = qrCodeDiv.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `VietQR_${currentBank.shortName}_${document.getElementById('accountNo').value}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Đã tải mã QR');
}

// Reset form
function resetForm() {
    qrForm.reset();
    qrForm.style.display = 'block';
    qrResult.style.display = 'none';
    currentBank = null;
}

// Toast
function showToast(msg) {
    const old = document.querySelector('.toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
