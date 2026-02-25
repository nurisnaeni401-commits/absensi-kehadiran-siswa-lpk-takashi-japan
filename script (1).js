// 1. URL Web App dari Google Apps Script
const webAppUrl = "https://script.google.com/macros/s/AKfycbx6RBrr9fPvNC-PVaw0eAeJIHrz_RZ_Kc8Uae-EhIo9Up6UVc-bbgfvvN1nEZfNBHLN/exec" ; 

const resultBox = document.getElementById('result-box');
const statusText = document.getElementById('status-text');
const studentNameDisplay = document.getElementById('student-name');
const studentIdDisplay = document.getElementById('student-id'); // Pastikan ID ini ada di HTML

function onScanSuccess(decodedText, decodedResult) {
    // 2. Hentikan scanner sementara agar tidak terjadi double scan
    html5QrcodeScanner.clear();

    // 3. Memproses Data (Format QR: ID - NAMA)
    // Contoh isi QR: TKS001 - BUDI SANTOSO
    const dataSiswa = decodedText.split(" - ");
    const idSiswa = dataSiswa[0];
    const namaSiswa = dataSiswa[1] || "Tanpa Nama";

    // Tampilkan UI Loading
    resultBox.classList.remove('hidden');
    statusText.innerText = "Mengirim data ke pusat...";
    if(studentIdDisplay) studentIdDisplay.innerText = idSiswa;
    studentNameDisplay.innerText = namaSiswa;

    // 4. Proses pengiriman data ke Google Sheets menggunakan fetch GET
    // Ini disesuaikan dengan fungsi doGet(e) di Apps Script
    const finalUrl = `${webAppUrl}?id=${encodeURIComponent(idSiswa)}&nama=${encodeURIComponent(namaSiswa)}`;

    fetch(finalUrl, {
        method: 'GET'
    })
    .then(() => {
        // Tampilan jika absensi berhasil
        statusText.innerText = "✅ ABSENSI BERHASIL DICATAT";
        statusText.style.color = "#28a745";
        
        // Refresh halaman otomatis setelah 3 detik untuk scan siswa berikutnya
        setTimeout(() => {
            location.reload();
        }, 3000);
    })
    .catch(error => {
        // Tampilan jika terjadi gangguan koneksi atau error
        statusText.innerText = "❌ Gagal mengirim data";
        statusText.style.color = "red";
        console.error('Error:', error);
        
        // Refresh otomatis untuk mencoba lagi setelah 5 detik
        setTimeout(() => {
            location.reload();
        }, 5000);
    });
}

// 5. Pengaturan Scanner (Kecepatan dan Ukuran Kotak Scan)
let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", 
    { 
        fps: 20, // Lebih cepat lebih baik
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0 
    }
);
html5QrcodeScanner.render(onScanSuccess);