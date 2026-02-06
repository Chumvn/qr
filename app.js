// ========================================
// VietQR Clone - Main Application
// ========================================

// Bank Data - Vietnamese Banks with BIN codes
const BANKS = [
    { code: "970436", bin: "970436", name: "Vietcombank", shortName: "VCB", logo: "https://api.vietqr.io/img/VCB.png" },
    { code: "970418", bin: "970418", name: "BIDV", shortName: "BIDV", logo: "https://api.vietqr.io/img/BIDV.png" },
    { code: "970415", bin: "970415", name: "VietinBank", shortName: "CTG", logo: "https://api.vietqr.io/img/ICB.png" },
    { code: "970405", bin: "970405", name: "Agribank", shortName: "AGR", logo: "https://api.vietqr.io/img/VBA.png" },
    { code: "970407", bin: "970407", name: "Techcombank", shortName: "TCB", logo: "https://api.vietqr.io/img/TCB.png" },
    { code: "970423", bin: "970423", name: "TPBank", shortName: "TPB", logo: "https://api.vietqr.io/img/TPB.png" },
    { code: "970422", bin: "970422", name: "MBBank", shortName: "MB", logo: "https://api.vietqr.io/img/MB.png" },
    { code: "970416", bin: "970416", name: "ACB", shortName: "ACB", logo: "https://api.vietqr.io/img/ACB.png" },
    { code: "970432", bin: "970432", name: "VPBank", shortName: "VPB", logo: "https://api.vietqr.io/img/VPB.png" },
    { code: "970403", bin: "970403", name: "Sacombank", shortName: "STB", logo: "https://api.vietqr.io/img/STB.png" },
    { code: "970437", bin: "970437", name: "HDBank", shortName: "HDB", logo: "https://api.vietqr.io/img/HDB.png" },
    { code: "970448", bin: "970448", name: "OCB", shortName: "OCB", logo: "https://api.vietqr.io/img/OCB.png" },
    { code: "970426", bin: "970426", name: "MSB", shortName: "MSB", logo: "https://api.vietqr.io/img/MSB.png" },
    { code: "970414", bin: "970414", name: "OceanBank", shortName: "OCEAN", logo: "https://api.vietqr.io/img/OCEANBANK.png" },
    { code: "970431", bin: "970431", name: "Eximbank", shortName: "EIB", logo: "https://api.vietqr.io/img/EIB.png" },
    { code: "970443", bin: "970443", name: "SHB", shortName: "SHB", logo: "https://api.vietqr.io/img/SHB.png" },
    { code: "970406", bin: "970406", name: "DongA Bank", shortName: "DAB", logo: "https://api.vietqr.io/img/DOB.png" },
    { code: "970441", bin: "970441", name: "VIB", shortName: "VIB", logo: "https://api.vietqr.io/img/VIB.png" },
    { code: "970429", bin: "970429", name: "SCB", shortName: "SCB", logo: "https://api.vietqr.io/img/SCB.png" },
    { code: "970427", bin: "970427", name: "VietABank", shortName: "VAB", logo: "https://api.vietqr.io/img/VAB.png" },
    { code: "970433", bin: "970433", name: "VietBank", shortName: "VIETBANK", logo: "https://api.vietqr.io/img/VIETBANK.png" },
    { code: "970454", bin: "970454", name: "VietCapital Bank", shortName: "VCCB", logo: "https://api.vietqr.io/img/BVB.png" },
    { code: "970439", bin: "970439", name: "PVcomBank", shortName: "PVC", logo: "https://api.vietqr.io/img/PVCB.png" },
    { code: "970412", bin: "970412", name: "PGBank", shortName: "PGB", logo: "https://api.vietqr.io/img/PGB.png" },
    { code: "970409", bin: "970409", name: "BacABank", shortName: "BAB", logo: "https://api.vietqr.io/img/BAB.png" },
    { code: "970424", bin: "970424", name: "ShinhanBank", shortName: "SHBVN", logo: "https://api.vietqr.io/img/SHBVN.png" },
    { code: "970400", bin: "970400", name: "Saigonbank", shortName: "SGB", logo: "https://api.vietqr.io/img/SAIGONBANK.png" },
    { code: "970446", bin: "970446", name: "CIMB", shortName: "CIMB", logo: "https://api.vietqr.io/img/CIMB.png" },
    { code: "970440", bin: "970440", name: "SeABank", shortName: "SEAB", logo: "https://api.vietqr.io/img/SEAB.png" },
    { code: "970452", bin: "970452", name: "KienLongBank", shortName: "KLB", logo: "https://api.vietqr.io/img/KLB.png" },
    { code: "970449", bin: "970449", name: "LienVietPostBank", shortName: "LPB", logo: "https://api.vietqr.io/img/LPB.png" },
    { code: "970425", bin: "970425", name: "ABBank", shortName: "ABB", logo: "https://api.vietqr.io/img/ABB.png" },
    { code: "970434", bin: "970434", name: "IndovinaBank", shortName: "IVB", logo: "https://api.vietqr.io/img/IVB.png" }
];

// State
let selectedBank = null;

// DOM Elements
const bankSelect = document.getElementById('bankSelect');
const bankDropdown = document.getElementById('bankDropdown');
const bankList = document.getElementById('bankList');
const bankSearchInput = document.getElementById('bankSearchInput');
const bankCodeInput = document.getElementById('bankCode');
const qrForm = document.getElementById('qrForm');
const qrPlaceholder = document.getElementById('qrPlaceholder');
const qrResult = document.getElementById('qrResult');
const qrCanvas = document.getElementById('qrCanvas');
const qrBankLogo = document.getElementById('qrBankLogo');
const qrAccountInfo = document.getElementById('qrAccountInfo');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderBankList(BANKS);
    setupEventListeners();
});

// Render bank list
function renderBankList(banks) {
    bankList.innerHTML = banks.map(bank => `
        <div class="bank-item" data-code="${bank.code}" data-bin="${bank.bin}" data-name="${bank.name}" data-short="${bank.shortName}" data-logo="${bank.logo}">
            <img src="${bank.logo}" alt="${bank.name}" onerror="this.src='https://via.placeholder.com/36?text=${bank.shortName}'">
            <div class="bank-item-info">
                <div class="bank-item-name">${bank.name}</div>
                <div class="bank-item-short">${bank.shortName}</div>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Bank select toggle
    bankSelect.addEventListener('click', (e) => {
        e.stopPropagation();
        bankSelect.classList.toggle('active');
        bankDropdown.classList.toggle('show');
        if (bankDropdown.classList.contains('show')) {
            bankSearchInput.focus();
        }
    });

    // Bank search
    bankSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = BANKS.filter(bank =>
            bank.name.toLowerCase().includes(query) ||
            bank.shortName.toLowerCase().includes(query)
        );
        renderBankList(filtered);
    });

    // Bank selection
    bankList.addEventListener('click', (e) => {
        const item = e.target.closest('.bank-item');
        if (item) {
            selectedBank = {
                code: item.dataset.code,
                bin: item.dataset.bin,
                name: item.dataset.name,
                shortName: item.dataset.short,
                logo: item.dataset.logo
            };

            bankCodeInput.value = selectedBank.bin;
            bankSelect.querySelector('.bank-select-display').innerHTML = `
                <img src="${selectedBank.logo}" alt="${selectedBank.name}">
                <span class="bank-name">${selectedBank.name}</span>
            `;

            bankSelect.classList.remove('active');
            bankDropdown.classList.remove('show');
        }
    });

    // Close dropdown on outside click
    document.addEventListener('click', () => {
        bankSelect.classList.remove('active');
        bankDropdown.classList.remove('show');
    });

    // Prevent dropdown close when clicking inside
    bankDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Amount formatting
    const amountInput = document.getElementById('amount');
    amountInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value) {
            e.target.value = Number(value).toLocaleString('vi-VN');
        }
    });

    // Form submit
    qrForm.addEventListener('submit', handleFormSubmit);

    // Download button
    downloadBtn.addEventListener('click', downloadQR);

    // Copy button  
    copyBtn.addEventListener('click', copyQRData);
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault();

    if (!selectedBank) {
        showToast('Vui lòng chọn ngân hàng');
        return;
    }

    const accountNo = document.getElementById('accountNo').value.trim();
    if (!accountNo) {
        showToast('Vui lòng nhập số tài khoản');
        return;
    }

    const accountName = document.getElementById('accountName').value.trim().toUpperCase();
    const amountRaw = document.getElementById('amount').value.replace(/\D/g, '');
    const description = removeVietnameseTones(document.getElementById('description').value.trim());

    // Generate VietQR EMVCo string
    const qrString = generateVietQRString(selectedBank.bin, accountNo, amountRaw, description);

    // Generate QR code
    QRCode.toCanvas(qrCanvas, qrString, {
        width: 180,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' }
    }, (error) => {
        if (error) {
            console.error('QR generation error:', error);
            showToast('Lỗi tạo mã QR');
            return;
        }

        // Update UI
        qrBankLogo.innerHTML = `<img src="${selectedBank.logo}" alt="${selectedBank.name}">`;
        qrAccountInfo.innerHTML = `
            <div class="account-no">${accountNo}</div>
            ${accountName ? `<div class="account-name">${accountName}</div>` : ''}
        `;

        qrPlaceholder.style.display = 'none';
        qrResult.style.display = 'flex';
    });
}

// Generate VietQR EMVCo string (Standard format)
function generateVietQRString(bankBin, accountNo, amount, description) {
    // EMVCo QR format for VietQR
    let data = '';

    // Payload Format Indicator (ID 00)
    data += tlv('00', '01');

    // Point of Initiation Method (ID 01) - 12 = Dynamic QR
    data += tlv('01', amount ? '12' : '11');

    // Merchant Account Information (ID 38) - VietQR
    let merchantInfo = '';
    merchantInfo += tlv('00', 'A000000727'); // NAPAS AID
    merchantInfo += tlv('01', bankBin + accountNo); // Bank BIN + Account
    merchantInfo += tlv('02', 'QRIBFTTA'); // Service code
    data += tlv('38', merchantInfo);

    // Transaction Currency (ID 53) - VND = 704
    data += tlv('53', '704');

    // Transaction Amount (ID 54)
    if (amount && amount !== '0') {
        data += tlv('54', amount);
    }

    // Country Code (ID 58)
    data += tlv('58', 'VN');

    // Additional Data (ID 62)
    if (description) {
        let additionalData = '';
        additionalData += tlv('08', description.substring(0, 25));
        data += tlv('62', additionalData);
    }

    // CRC (ID 63) - placeholder, will be calculated
    data += '6304';

    // Calculate CRC16-CCITT
    const crc = calculateCRC16(data);
    data = data.slice(0, -4) + '6304' + crc;

    return data;
}

// TLV (Tag-Length-Value) helper
function tlv(tag, value) {
    const length = value.length.toString().padStart(2, '0');
    return tag + length + value;
}

// CRC16-CCITT calculation
function calculateCRC16(str) {
    let crc = 0xFFFF;
    const polynomial = 0x1021;

    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ polynomial;
            } else {
                crc = crc << 1;
            }
        }
        crc &= 0xFFFF;
    }

    return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Remove Vietnamese tones
function removeVietnameseTones(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .toUpperCase();
}

// Download QR code
function downloadQR() {
    const link = document.createElement('a');
    link.download = `VietQR_${selectedBank.shortName}_${document.getElementById('accountNo').value}.png`;
    link.href = qrCanvas.toDataURL('image/png');
    link.click();
    showToast('Đã tải mã QR về máy');
}

// Copy QR data
function copyQRData() {
    const accountNo = document.getElementById('accountNo').value;
    const accountName = document.getElementById('accountName').value;
    const amount = document.getElementById('amount').value;

    const text = `Ngân hàng: ${selectedBank.name}\nSố tài khoản: ${accountNo}\nChủ tài khoản: ${accountName}\nSố tiền: ${amount} VND`;

    navigator.clipboard.writeText(text).then(() => {
        showToast('Đã sao chép thông tin');
    });
}

// Toast notification
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}
