# PRD: Sampah Butuh Teman

**Product Requirements Document**
**Tema PjBL:** Sistem Pengelolaan Sampah Berbasis Komunitas
**Jurusan:** Sistem Informasi
**Platform:** Web App (dibangun menggunakan Antigravity)
**Cakupan Wilayah:** Lingkungan Kampus
**Jenis Limbah:** Limbah Kertas

---

## 1. Ringkasan Produk (Apa Aplikasi Ini?)

**Sampah Butuh Teman** adalah aplikasi web kampus yang menyalurkan **limbah kertas** dari unit-unit kampus (biro, fakultas, prodi, dll) ke pihak eksternal yang membutuhkannya (perusahaan daur ulang, produsen kemasan, dll) — lewat **satu drop point terpusat** di kampus yang berisi tong-tong bernomor & bernama per unit, dilengkapi sistem matching dan papan peringkat unit paling aktif menyalurkan.

**Cara kerja inti:**
- **Penyalur** bukan individu, tapi **unit kampus** (biro, fakultas, prodi, dll) yang mengumpulkan limbah kertas dari kegiatan operasional mereka
- **Penerima** adalah **pihak eksternal** — perusahaan daur ulang, produsen kemasan, atau industri lain yang butuh kertas bekas sebagai bahan baku
- **Drop point-nya cuma satu untuk seluruh kampus** — tapi di dalamnya ada beberapa tong yang masing-masing diberi nama & nomor sesuai unit asalnya (contoh: "FTD No. 1" untuk tong milik Fakultas Teknik dan Desain). Jadi limbah kertas dari tiap unit tetap teridentifikasi meski dikumpulkan di satu lokasi fisik yang sama
- Saat perusahaan datang mengambil, sistem cukup mengarahkan ke **nomor tong** yang sesuai (misal "ambil di tong FTD No. 1") — tidak perlu berpindah lokasi drop point
- **Sistem matching tetap berlaku** — mencocokkan limbah kertas yang tersedia dari suatu unit dengan permintaan dari perusahaan
- Ada **papan peringkat (leaderboard)** yang menampilkan unit kampus mana yang paling banyak menyalurkan limbah kertas — jadi ada unsur kompetisi sehat antar bagian kampus

## 2. Masalah yang Diselesaikan

1. Limbah kertas dari kegiatan operasional kampus (biro, fakultas, dll) menumpuk tanpa jalur penyaluran yang jelas ke pihak yang bisa memanfaatkannya
2. Unit-unit kampus tidak tahu ke mana atau ke siapa limbah kertas mereka bisa disalurkan
3. Perusahaan daur ulang/produsen kemasan kesulitan menemukan sumber kertas bekas yang stabil dan terlokalisasi
4. Tidak ada insentif atau pengakuan bagi unit kampus yang aktif memilah dan menyalurkan limbah kertasnya

## 3. Siapa yang Pakai Aplikasi Ini (User Roles)

| Peran | Siapa | Yang Dilakukan di App |
|---|---|---|
| **Penyalur** | Unit kampus — biro, fakultas, prodi, dll | Posting limbah kertas yang tersedia dari unit mereka; limbah ditaruh di tong bernama unit mereka pada drop point pusat kampus |
| **Penerima** | Pihak eksternal — perusahaan daur ulang, produsen kemasan, dll | Posting permintaan kebutuhan kertas bekas, memilih/menerima hasil matching dari unit-unit yang sesuai, menjadwalkan pengambilan di drop point sesuai nomor tong yang diarahkan |
| **Admin** | Pengelola sistem (tim proyek) | Kelola data unit & tong di drop point pusat, kelola matching, kelola papan peringkat, tangani laporan, pantau dampak |

## 4. Tujuan Produk (Goals)

- Menyalurkan limbah kertas kampus ke pihak eksternal yang membutuhkan secara terstruktur per unit
- Memudahkan perusahaan menemukan & menjadwalkan pengambilan kertas bekas dari unit kampus yang sesuai
- Mendorong partisipasi unit kampus lewat papan peringkat yang menampilkan kontribusi masing-masing
- Menyediakan data terukur tentang dampak lingkungan (kg kertas tersalurkan, estimasi pohon/air terselamatkan, dll) untuk pelaporan proyek

## 5. Yang HARUS Ada di Prototipe (In Scope)

### Wajib (MVP — harus jalan untuk demo)
1. **Registrasi Unit & Perusahaan** — unit kampus daftar sebagai Penyalur, perusahaan daftar sebagai Penerima
2. **Drop Point Pusat dengan Tong per Unit** — satu lokasi drop point untuk seluruh kampus, berisi beberapa tong yang masing-masing diberi nama & nomor sesuai unit asal (mis. "FTD No. 1")
3. **Posting Limbah Kertas (Unit)** — unit input jumlah/berat, kondisi kertas, foto — otomatis tertaut ke tong bernama unit tersebut di drop point pusat
4. **Posting Permintaan (Perusahaan)** — jenis/jumlah kertas yang dibutuhkan
5. **Sistem Matching + Pilih Manual** — sistem menyarankan pasangan otomatis antara limbah kertas yang tersedia dari unit dengan permintaan perusahaan, TAPI perusahaan tetap bisa menjelajah semua listing yang ada dan memilih sendiri secara manual, tidak harus mengikuti saran sistem
6. **Jadwal Pengambilan (Perusahaan)** — setelah matching, perusahaan pilih tanggal/jam datang ke drop point pusat, sistem tunjukkan nomor tong yang harus dituju
7. **Konfirmasi Status Manual** — unit konfirmasi "kertas sudah ditaruh", perusahaan konfirmasi "sudah diambil" — tanpa perlu koordinasi langsung antar individu
8. **Papan Peringkat (Leaderboard)** — ranking unit kampus berdasarkan total limbah kertas yang berhasil disalurkan
9. **Admin Dashboard** — kelola unit & drop point, pantau matching, leaderboard, laporan, dan analisis dampak (detail lihat section 5.1)

### Penting, tapi bisa menyusul (Should Have)
10. **Self-Checklist saat Posting + Lapor/Flag** — checklist singkat saat posting; listing langsung tampil tanpa approval admin, bisa dilaporkan kalau bermasalah
11. **Eco-Points untuk Unit** — poin berdasarkan jumlah kertas berhasil disalurkan — **benefit poin masih dalam pembahasan tim, lihat Catatan Terbuka di section 11**
12. **Dashboard Eco-Impact** — total limbah kertas tersalurkan & estimasi dampak lingkungan

### Nice to Have (kalau waktu masih cukup)
13. **Rating & Review** — penilaian dari perusahaan terhadap kualitas kertas dari suatu unit
14. **Keuangan & Transaksi** — pencatatan nilai/biaya (kalau ada)

### 5.1 Detail Isi Admin Dashboard

**Kelola Unit & Tong:**
- Daftar unit kampus terdaftar (biro/fakultas/prodi) beserta status tong masing-masing di drop point pusat (kosong/terisi)
- Tambah/nonaktifkan unit atau tong

**Matching & Moderasi:**
- Daftar hasil matching yang sedang berjalan/menunggu konfirmasi
- Daftar laporan/flag dari user

**Papan Peringkat:**
- Ranking unit kampus berdasarkan total kg kertas tersalurkan (mingguan/bulanan/akumulatif)

**Analisis Dampak:**
- Total limbah kertas berhasil disalurkan (akumulatif & per periode)
- Breakdown per unit kampus
- Estimasi dampak lingkungan (mis. estimasi pohon/air terselamatkan dari daur ulang kertas)
- Tren dari waktu ke waktu

## 6. Yang TIDAK Perlu Dibuat (Out of Scope)

- Pertemuan langsung terjadwal antar individu dari unit dan perusahaan — cukup lewat drop point per unit
- QR Code untuk serah terima — digantikan konfirmasi status manual
- Sistem pembayaran digital sungguhan
- Aplikasi mobile native (cukup web app responsif)
- Validasi manual admin untuk setiap listing sebelum tampil
- Penanganan jenis limbah lain selain kertas (organik, plastik, dll) untuk versi ini

## 7. Alur Utama Pengguna (User Flow Singkat)

**Sebagai Unit Kampus (Penyalur):**
1. Daftar unit & login → posting limbah kertas yang tersedia (jumlah, kondisi, foto)
2. Sistem menautkan listing ke tong bernama unit tersebut di drop point pusat kampus
3. Taruh kertas di tong sesuai nama unit → konfirmasi "sudah ditaruh"
4. Setelah perusahaan mengambil, unit dapat eco-points & kontribusinya masuk ke papan peringkat

**Sebagai Perusahaan (Penerima):**
1. Daftar & login → posting permintaan kebutuhan kertas
2. Punya 2 opsi: (a) lihat saran matching dari sistem berdasarkan permintaan yang diposting, atau (b) langsung jelajah semua listing kertas yang tersedia dan pilih sendiri secara manual
3. Pilih listing yang sesuai (baik dari saran sistem maupun pilihan sendiri) → buat jadwal pengambilan (tanggal/jam)
4. Datang ke drop point pusat sesuai jadwal, menuju nomor tong yang diarahkan sistem → ambil kertas → konfirmasi "sudah diambil"

**Sebagai Admin:**
1. Login ke Admin Dashboard
2. Kelola data unit kampus & tong di drop point pusat
3. Pantau matching yang berjalan dan tangani laporan
4. Lihat papan peringkat dan data dampak lingkungan

## 8. Kriteria Sukses / Definisi "Selesai" untuk Demo

Prototipe dianggap siap didemokan kalau bisa menunjukkan skenario end-to-end berikut tanpa error:
1. Minimal 2 unit kampus contoh terdaftar, masing-masing dengan tong bernama sendiri di drop point pusat
2. Salah satu unit berhasil posting limbah kertas yang tersedia
3. Sebuah akun perusahaan berhasil posting permintaan
4. Sistem menampilkan hasil matching antara unit dan perusahaan tersebut
5. Perusahaan berhasil membuat jadwal pengambilan
6. Status transaksi bisa diubah: Menunggu Diambil → Sudah Diambil
7. Papan peringkat menampilkan unit dengan kontribusi terbanyak
8. Admin bisa melihat ringkasan semuanya di dashboard

## 9. Spesifikasi Teknis untuk Build (Web App)

**Tech stack:**
- Frontend: React.js (Vite) + TypeScript + Tailwind CSS
- Backend: Express.js (Node.js) — atau langsung Supabase client di frontend untuk MVP
- Database & Auth: Supabase (PostgreSQL + Supabase Auth, role-based: unit/penyalur, perusahaan/penerima, admin)

**Halaman/route yang perlu dibuat (MVP):**

| Route | Peran | Fungsi |
|---|---|---|
| `/login`, `/register` | Semua | Autentikasi + pilih peran (Unit/Perusahaan) saat daftar |
| `/leaderboard` | Semua | Papan peringkat unit kampus paling banyak menyalurkan |
| `/unit/kertas/baru` | Penyalur (Unit) | Form posting limbah kertas tersedia |
| `/unit/status` | Penyalur (Unit) | Lihat status listing, konfirmasi "sudah ditaruh" |
| `/perusahaan/permintaan/baru` | Penerima (Perusahaan) | Form posting permintaan kertas |
| `/perusahaan/matching` | Penerima (Perusahaan) | Lihat hasil matching / jelajah listing manual |
| `/perusahaan/jadwal/:transaksiId` | Penerima (Perusahaan) | Pilih tanggal/jam pengambilan |
| `/perusahaan/riwayat` | Penerima (Perusahaan) | Lihat status transaksi, konfirmasi "sudah diambil" |
| `/admin/dashboard` | Admin | Ringkasan transaksi, leaderboard, & analisis dampak |
| `/admin/unit` | Admin | Kelola unit kampus & drop point |
| `/admin/laporan` | Admin | Daftar laporan/flag dari user |

**Referensi entitas data (ERD):** lihat file `sampah-butuh-teman-spec.md`.

### Instruksi Build (bisa langsung dipakai sebagai prompt di Antigravity)

> Bangun web app bernama "Sampah Butuh Teman" menggunakan React + Vite + TypeScript + Tailwind CSS untuk frontend, dan Supabase (PostgreSQL + Auth) sebagai backend/database. Fokus: penyaluran limbah kertas dari unit kampus (biro/fakultas/prodi) ke perusahaan eksternal (daur ulang/produsen kemasan). Mulai dari MVP berikut secara berurutan:
> 1. Setup autentikasi dengan role: unit (penyalur), perusahaan (penerima), admin
> 2. Buat skema database: units, drop_point (satu record saja untuk seluruh kampus), tong (banyak, masing-masing tertaut ke drop_point dan diberi nama+nomor sesuai unit), listing_kertas, permintaan, matching, transaksi
> 3. Bangun halaman posting limbah kertas untuk Unit, tertaut otomatis ke tong bernama unit tersebut di drop point pusat
> 4. Bangun halaman posting permintaan untuk Perusahaan, dengan hasil matching otomatis terhadap listing yang tersedia
> 5. Bangun alur jadwal pengambilan dan status transaksi: Menunggu Diambil → Sudah Diambil, dengan konfirmasi manual di kedua sisi
> 6. Bangun halaman papan peringkat (leaderboard) unit berdasarkan total kg kertas tersalurkan
> 7. Bangun Admin Dashboard: kelola unit & drop point, pantau matching, leaderboard, laporan, dan analisis dampak
> 8. Setelah MVP jalan, tambahkan: eco-points untuk unit (mekanisme reward masih perlu didefinisikan tim), dashboard eco-impact detail, rating & review

## 10. Ringkasan Satu Kalimat

> Aplikasi web kampus yang menyalurkan limbah kertas dari unit-unit kampus ke perusahaan daur ulang/produsen kemasan lewat satu drop point pusat berisi tong bernomor per unit, dilengkapi sistem matching dan papan peringkat unit paling aktif menyalurkan.

## 11. Catatan Terbuka (Masih Perlu Dibahas Tim)

- **Benefit Eco-Points:** belum diputuskan poin dari unit yang menyalurkan limbah kertas ini bisa ditukar/digunakan untuk apa. Ini perlu didiskusikan lebih lanjut oleh tim sebelum masuk ke pengembangan fitur eco-points.
