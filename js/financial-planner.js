// ==========================================================================
// 1. LOGIKA NAVIGASI TAB
// ==========================================================================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const resultDisplayArea = document.getElementById('result-display-area');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        const targetTabId = button.getAttribute('data-tab');
        document.getElementById(targetTabId).classList.add('active');
        
        resetResultArea();
    });
});

function resetResultArea() {
    resultDisplayArea.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-calculator"></i>
            <p>Silakan masukkan data keuangan kamu di formulir sebelah kiri, lalu klik tombol <strong>Hitung Tabungan Bulanan</strong> untuk melihat kalkulasi.</p>
        </div>
    `;
}

// ==========================================================================
// 2. FUNGSI LIVE FORMATTING (Thousands Separator dengan Koma saat Mengetik)
// ==========================================================================
const inputNominals = document.querySelectorAll('.input-nominal');

inputNominals.forEach(input => {
    input.addEventListener('input', (e) => {
        let nilaiMentah = e.target.value.replace(/\D/g, '');
        
        if (nilaiMentah) {
            e.target.value = Number(nilaiMentah).toLocaleString('en-US');
        } else {
            e.target.value = '';
        }
    });
});

function ambilAngkaMentah(idElemen) {
    const elemen = document.getElementById(idElemen);
    if (!elemen || !elemen.value) return 0;
    
    const angkaMurni = elemen.value.replace(/,/g, '');
    return parseFloat(angkaMurni) || 0;
}

function formatKeRupiah(angka) {
    const angkaBulat = Math.round(angka);
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angkaBulat);
}

// ==========================================================================
// 3. LOGIKA UTAMA: HITUNG JARAK BULAN TERPADU
// ==========================================================================
function hitungSisaBulan(bulanTarget, tahunTarget) {
    const waktuSekarang = new Date();
    const bulanSekarang = waktuSekarang.getMonth(); 
    const tahunSekarang = waktuSekarang.getFullYear(); 
    
    let totalSisaBulan = (tahunTarget - tahunSekarang) * 12 + (bulanTarget - bulanSekarang);
    
    if (totalSisaBulan <= 0) {
        totalSisaBulan = 1;
    }
    
    return totalSisaBulan;
}

// ==========================================================================
// 4. GENERATOR SHOWCASE OUTPUT KARTU HASIL (Menggunakan CSS Class Clean)
// ==========================================================================
function tampilkanHasilKeLayar(judul, totalTarget, danaAda, sisaSiap, sisaBulan, tabunganBulanan, teksBulan, teksTahun) {
    resultDisplayArea.innerHTML = `
        <div class="result-success-box fadeInUp">
            <div class="result-title-badge">
                <i class="fa-solid fa-chart-line"></i> ${judul}
            </div>
            
            <div class="stat-item">
                <span class="stat-label">1. Dana yang Harus Dikumpulkan:</span>
                <span class="stat-value">${formatKeRupiah(totalTarget)}</span>
            </div>
            
            <div class="stat-item">
                <span class="stat-label">2. Tabungan yang Sudah Ada:</span>
                <span class="stat-value green">${formatKeRupiah(danaAda)}</span>
            </div>
            
            <div class="stat-item">
                <span class="stat-label">3. Target Kekurangan Dana:</span>
                <span class="stat-value red">${formatKeRupiah(sisaSiap)}</span>
            </div>
            
            <div class="result-divider"></div>
            
            <div class="monthly-highlight">
                <span class="stat-label">4. Tabungan Per Bulan Wajib:</span>
                <div class="monthly-value">${formatKeRupiah(tabunganBulanan)} <span>/ bulan</span></div>
            </div>
            
            <div class="result-note-box">
                * Untuk mencapai target pada <strong>${teksBulan} ${teksTahun}</strong>, kamu memiliki sisa waktu <strong>${sisaBulan} bulan</strong> dari sekarang.
            </div>
        </div>
    `;
}

// ==========================================================================
// 5. TRIGGER EVENT LISTENER UNTUK EKSEKUSI HITUNG
// ==========================================================================

// --- KALKULATOR PENDIDIKAN ANAK ---
const btnCalcEdu = document.getElementById('btn-calc-edu');
if (btnCalcEdu) {
    btnCalcEdu.addEventListener('click', () => {
        const targetDana = ambilAngkaMentah('edu-target');
        const danaSudahAda = ambilAngkaMentah('edu-saved');
        
        const selectBulan = document.getElementById('edu-month');
        const bulanTarget = parseInt(selectBulan.value);
        const namaBulanTarget = selectBulan.options[selectBulan.selectedIndex].text;
        const tahunTarget = parseInt(document.getElementById('edu-year').value) || 2027;
        
        if (targetDana <= 0) {
            alert("Silakan isi target budget awal dana sekolah anak terlebih dahulu!");
            return;
        }
        
        const sisaKekurangan = targetDana - danaSudahAda;
        const jumlahBulanSisa = hitungSisaBulan(bulanTarget, tahunTarget);
        
        const tabunganBulananWajib = sisaKekurangan > 0 ? (sisaKekurangan / jumlahBulanSisa) : 0;
        const hasilSisaSiap = sisaKekurangan > 0 ? sisaKekurangan : 0;

        tampilkanHasilKeLayar("Analisis Dana Pendidikan", targetDana, danaSudahAda, hasilSisaSiap, jumlahBulanSisa, tabunganBulananWajib, namaBulanTarget, tahunTarget);
    });
}

// --- KALKULATOR DANA DARURAT ---
const btnCalcEmergency = document.getElementById('btn-calc-emergency');
if (btnCalcEmergency) {
    btnCalcEmergency.addEventListener('click', () => {
        const targetDana = ambilAngkaMentah('emergency-target');
        const danaSudahAda = ambilAngkaMentah('emergency-saved');
        
        const selectBulan = document.getElementById('emergency-month');
        const bulanTarget = parseInt(selectBulan.value);
        const namaBulanTarget = selectBulan.options[selectBulan.selectedIndex].text;
        const tahunTarget = parseInt(document.getElementById('emergency-year').value) || 2027;
        
        if (targetDana <= 0) {
            alert("Silakan isi target dana darurat terlebih dahulu!");
            return;
        }
        
        const sisaKekurangan = targetDana - danaSudahAda;
        const jumlahBulanSisa = hitungSisaBulan(bulanTarget, tahunTarget);
        
        const tabunganBulananWajib = sisaKekurangan > 0 ? (sisaKekurangan / jumlahBulanSisa) : 0;
        const hasilSisaSiap = sisaKekurangan > 0 ? sisaKekurangan : 0;

        tampilkanHasilKeLayar("Analisis Dana Darurat", targetDana, danaSudahAda, hasilSisaSiap, jumlahBulanSisa, tabunganBulananWajib, namaBulanTarget, tahunTarget);
    });
}

// --- KALKULATOR RUMAH IMPIAN ---
const btnCalcHouse = document.getElementById('btn-calc-house');
if (btnCalcHouse) {
    btnCalcHouse.addEventListener('click', () => {
        const targetDana = ambilAngkaMentah('house-target');
        const danaSudahAda = ambilAngkaMentah('house-saved');
        
        const selectBulan = document.getElementById('house-month');
        const bulanTarget = parseInt(selectBulan.value);
        const namaBulanTarget = selectBulan.options[selectBulan.selectedIndex].text;
        const tahunTarget = parseInt(document.getElementById('house-year').value) || 2027;
        
        if (targetDana <= 0) {
            alert("Silakan isi target DP rumah terlebih dahulu!");
            return;
        }
        
        const sisaKekurangan = targetDana - danaSudahAda;
        const jumlahBulanSisa = hitungSisaBulan(bulanTarget, tahunTarget);
        
        const tabunganBulananWajib = sisaKekurangan > 0 ? (sisaKekurangan / jumlahBulanSisa) : 0;
        const hasilSisaSiap = sisaKekurangan > 0 ? sisaKekurangan : 0;

        tampilkanHasilKeLayar("Analisis DP Rumah Impian", targetDana, danaSudahAda, hasilSisaSiap, jumlahBulanSisa, tabunganBulananWajib, namaBulanTarget, tahunTarget);
    });
}