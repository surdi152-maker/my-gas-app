# my-gas-app

Absensi Guru — Sistem Presensi Wajah, Gaji & Laporan
Aplikasi web absensi guru/pegawai berbasis Google Apps Script + Google Sheets, dengan presensi menggunakan pengenalan wajah (face recognition) langsung dari browser, perhitungan gaji otomatis berdasarkan keterlambatan, dan laporan yang bisa difilter per guru.
✨ Fitur
·	Absensi wajah — deteksi & pencocokan wajah dilakukan di browser (face-api.js), waktu absen dicatat dari server agar tidak bisa dimanipulasi dari client.
·	Multi-role — akun Admin (kelola semua data & pengaturan) dan Guru/Staff (self-service: absen sendiri, lihat riwayat & slip gaji sendiri).
·	Data Guru/Pegawai — kelola NIP, nama, jabatan, mapel, status kerja, gaji pokok, tunjangan, akun login, dan pendaftaran wajah.
·	Perhitungan Gaji otomatis — Gaji Bersih = Gaji Pokok + Tunjangan − (Total Menit Terlambat × Tarif Potongan/menit), dengan toleransi keterlambatan yang bisa diatur.
·	Filter per guru — tabel Perhitungan Gaji dan Laporan Absensi bisa difilter per guru; laporan "Semua Guru" otomatis dikelompokkan per nama guru agar rapi.
·	Export Excel & PDF — untuk laporan absensi maupun slip/rekap gaji, per guru atau seluruh guru.
·	Nama sekolah/instansi terkunci — hanya bisa diubah lewat kode/Sheet langsung oleh admin teknis, tidak bisa diubah dari UI aplikasi (mencegah perubahan tidak sengaja/tidak sah).
🛠️ Tech Stack
·	Backend: Google Apps Script (Code.gs) — REST-like JSON API via doGet/doPost.
·	Database: Google Sheets (6 sheet: Data_Guru, Data_Mapel, Rekap_Absensi_Guru, Pengaturan, Rekap_Gaji, Data_User).
·	Frontend: HTML + TailwindCSS (CDN) + vanilla JS (Index.html).
·	Face Recognition: face-api.js (via CDN).
·	Export: SheetJS (Excel) & jsPDF + AutoTable (PDF), keduanya via CDN.
·	UI Alert: SweetAlert2.
📂 Struktur Sheet Database
Sheet	Kolom Utama
Data_Guru	NIP, Nama, Jabatan, Mapel, Status Kerja, Gaji Pokok, Tunjangan, Face Descriptor
Data_Mapel	Nama Mapel
Rekap_Absensi_Guru	Waktu, NIP, Nama, Jabatan, Status, Menit Terlambat
Pengaturan	Parameter, Nilai (Nama Instansi, Jam Masuk, Toleransi, Tarif Potongan)
Rekap_Gaji	Periode, NIP, Nama, Jabatan, Total Hadir, Total Terlambat, Total Menit Terlambat, Gaji Pokok, Tunjangan, Potongan, Gaji Bersih, Tanggal Dihitung
Data_User	Username, Password (hash), Role, NIP Terkait, Nama, Status

🚀 Setup Awal
1.	Buat Google Sheet baru (ini akan jadi database).
2.	Buka Ekstensi → Apps Script.
3.	Buat/timpa file Code.gs dan Index.html dengan isi dari repo ini.
4.	Simpan project, lalu refresh halaman Google Sheet.
5.	Di Google Sheet akan muncul menu ⚙️ Setup Sistem → Setup Database Awal — jalankan sekali untuk membuat seluruh sheet & kolom yang dibutuhkan.
6.	Akun admin default akan dibuat otomatis:
o	Username: admin
o	Password: admin123
7.	⚠️ Segera login dan ganti password ini setelah setup berhasil.
8.	Deploy → New deployment → Web app:
o	Execute as: Me
o	Who has access: sesuaikan kebutuhan (mis. Anyone jika diakses publik oleh guru/staff)
9.	Salin URL web app yang dihasilkan — inilah alamat aplikasi absensi.
Reset Password Admin (jika terkunci)
Jika akun admin tidak bisa login, buka Apps Script Editor → pilih fungsi resetAdminPassword di dropdown fungsi → klik Run. Ini akan membuat ulang akun admin dengan password admin123. Segera ganti password setelah berhasil login.
🔄 Update Deployment
Setiap kali ada perubahan kode (Code.gs / Index.html):
1.	Paste kode terbaru ke Apps Script Editor, simpan.
2.	Deploy → Manage deployments → klik ikon pensil (Edit).
3.	Version: pilih New version.
4.	Klik Deploy.
Mengedit kode saja tidak otomatis memperbarui web app yang sedang live — wajib deploy ulang versi baru seperti di atas.
👤 Panduan Singkat Peran
Admin
·	Data Guru: tambah/edit/hapus guru & pegawai, daftarkan wajah, buat akun login (role Guru atau Admin).
·	Perhitungan Gaji: pilih periode (bulan), hitung gaji, filter per guru, export Excel/PDF.
·	Laporan: pilih rentang tanggal, filter per guru (otomatis dikelompokkan jika "Semua Guru"), export Excel/PDF.
·	Pengaturan: atur jam masuk kerja, toleransi keterlambatan (menit), tarif potongan per menit.
Guru / Staff
·	Absen wajah lewat kiosk/halaman absensi.
·	Login untuk melihat riwayat absensi & slip gaji milik sendiri.
🔒 Catatan Keamanan
·	Password disimpan dalam bentuk hash SHA-256, bukan teks polos.
·	Sesi login (token) berlaku 6 jam, disimpan di CacheService (bukan di database).
·	Setiap guru hanya bisa absen & melihat data atas nama sendiri (NIP diambil dari sesi login, bukan input client).
·	Nama sekolah/instansi tidak bisa diubah dari UI — hanya lewat perubahan langsung di kode/Sheet oleh admin teknis, untuk mencegah penyalahgunaan.
📌 Changelog Terbaru
·	Field "Nama Sekolah/Instansi" dihapus dari halaman Pengaturan (dikunci, hanya bisa diubah lewat kode).
·	Tambah dropdown Role Akun (Admin/Guru) saat menambah/mengedit data guru.
·	Tambah dropdown filter Pilih Guru di tab Perhitungan Gaji & Laporan.
·	Tabel Laporan Absensi otomatis dikelompokkan per guru (dengan sub-header) saat filter "Semua Guru" dipilih.
·	Export Excel/PDF menyesuaikan nama file otomatis (per guru atau rekap semua).
📄 Lisensi
Tambahkan lisensi sesuai kebutuhan (mis. MIT) di sini.


https://script.google.com/macros/s/AKfycbyudbj-mNTw_rtjtHmQaVHHAikawPsXGPV_KmewIsu-udArOxBixrg8jG-Nmn1zXGjk/exec
