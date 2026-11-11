# PRD — Redesign UI Sampah Butuh Teman

**Status:** Draft untuk acuan desain dan implementasi

**Tanggal:** 7 November 2026

**Platform:** Web responsif

**Cakupan:** Redesign seluruh layar aktif tanpa mengubah tujuan produk atau perilaku bisnis yang sudah ada
**Design brief:** [`design.md`](./design.md)

## 1. Ringkasan Produk

Sampah Butuh Teman menghubungkan unit kampus yang mengumpulkan limbah kertas dengan mitra industri
yang membutuhkan pasokan kertas daur ulang. Unit mencatat kertas dan tong asalnya, mitra mencari
pasokan melalui rekomendasi atau penelusuran manual, lalu pickup dijadwalkan di drop point pusat
kampus. Admin memantau unit, tong, aktivitas, dan laporan.

Redesign bertujuan membuat alur tersebut mudah dipahami dan dijalankan pada ponsel maupun desktop.
Dokumen ini membatasi pekerjaan pada pengalaman visual dan interaksi layar; perubahan data,
perhitungan matching, autentikasi, pembayaran, atau kebijakan insentif bukan bagian dari redesign.

## 2. Masalah Pengalaman Pengguna

- Pengguna perlu memahami tugas utama dan status kertas tanpa harus menafsirkan istilah atau angka
  yang tersebar di beberapa kartu.
- Unit harus dapat mencatat berat, kategori, kondisi, foto, dan tong asal tanpa salah input.
- Mitra perlu membandingkan listing, membedakan rekomendasi dari pilihan manual, dan melihat lokasi
  tong sebelum menyimpan jadwal pickup.
- Admin perlu menemukan unit/tong bermasalah serta laporan yang belum ditangani dengan cepat.
- Perbedaan antara saldo/transaksi, eco-points, berat tersalurkan, dan estimasi dampak harus jelas.

## 3. Sasaran dan Ukuran Keberhasilan

### Sasaran

1. Memastikan pengguna dapat mengidentifikasi peran dan tugas utama pada setiap layar.
2. Mempermudah alur unit untuk membuat listing dan memantau status tong.
3. Mempermudah alur mitra untuk menemukan listing, membuat permintaan, melihat detail, dan
   menjadwalkan pickup.
4. Mempermudah admin memantau operasi serta menindaklanjuti laporan.
5. Menjaga desain konsisten, aksesibel, dan responsif tanpa menghilangkan informasi penting.

### Kriteria keberhasilan

- Seluruh **19 layar aktif** pada inventaris di bawah memiliki desain final yang ditinjau pada
  viewport ponsel dan desktop yang relevan.
- Pengguna uji dari setiap peran dapat menyelesaikan tugas utama tanpa bantuan: unit membuat listing
  dan menemukan status tong; mitra mencari listing dan membuat jadwal; admin menemukan unit/tong dan
  menyelesaikan peninjauan laporan.
- Tidak ada route aktif, aksi utama, field wajib, atau status transaksi yang hilang dibandingkan
  baseline sebelum redesign.
- Semua status dan formulir dapat dipahami tanpa hanya mengandalkan warna; alur utama dapat
  dijalankan dengan keyboard.
- Tidak ada overflow horizontal pada viewport 320 px ke atas, serta target kontras warna teks
  memenuhi WCAG 2.2 AA.
- Desain tidak menyajikan metrik, partner, lokasi, atau kemampuan yang belum didukung data/produk.

**Catatan pengukuran:** persentase keberhasilan dan waktu penyelesaian belum memiliki baseline.
Ukur dengan sesi uji kegunaan setelah prototipe tersedia; jangan mengklaim peningkatan kuantitatif
sebelum dibandingkan dengan baseline.

## 4. Pengguna dan Kebutuhan

| Peran | Kebutuhan utama | Keberhasilan bagi pengguna |
|---|---|---|
| Unit kampus / penyalur | Memasukkan listing yang benar, mengetahui tong yang terkait, memantau status dan kontribusi unit. | Listing tercatat dengan berat/kategori yang benar dan pengguna tahu tindakan berikutnya. |
| Mitra industri / penerima | Mencari pasokan yang sesuai, memilih rekomendasi atau listing manual, mengatur pickup. | Mitra dapat mengidentifikasi kertas, unit, tong, jadwal, dan status transaksi yang dipilih. |
| Admin | Memantau ringkasan operasi, unit/tong, dan laporan yang membutuhkan tindakan. | Admin dapat menemukan item bermasalah dan memahami status penanganannya. |

## 5. Alur Produk yang Harus Dipertahankan

### Unit kampus

Masuk/daftar sebagai unit → buat listing kertas dengan jumlah, kategori, kondisi, foto, serta tong
terkait → lihat status tong/listing → lihat kontribusi, dompet, atau peringkat sesuai data yang
tersedia.

### Mitra industri

Masuk/daftar sebagai mitra → buat permintaan bila diperlukan → lihat rekomendasi atau jelajah listing
manual → buka detail listing → jadwalkan pickup pada drop point dan tong terkait → pantau riwayat
serta konfirmasi pengambilan bila aksi itu tersedia.

### Admin

Masuk sebagai admin → lihat ringkasan → kelola unit dan tong → tinjau laporan/flag → tandai laporan
selesai bila ditangani.

Drop point adalah satu lokasi pusat kampus dengan tong yang ditandai per unit. Jangan menggambar
beberapa drop point kampus atau lokasi pickup yang tidak didukung data aktual. Nama/nomor tong dan
lokasi spesifik yang tersedia harus tetap menonjol di detail pickup.

## 6. Inventaris Layar dan Kebutuhan UI

Route berikut dibaca dari `src/App.tsx`, `src/components/BottomNav.tsx`, dan
`src/components/AdminLayout.tsx`. Route alias dihitung sebagai satu layar bila saat ini
menampilkan komponen yang sama.

| # | Peran / layar | Route atau tahap | Informasi dan aksi yang harus dipertahankan |
|---:|---|---|---|
| 1 | Publik — onboarding | `onboarding` | Slide pengenalan produk, indikator slide, lewati/lanjut/mulai. |
| 2 | Publik — pilih peran | `gate` | Pilih unit kampus, mitra industri, atau admin; arah ke autentikasi sesuai pilihan. |
| 3 | Autentikasi — login | `login` | Email/kata sandi, validasi, loading, error, dan navigasi daftar/kembali. |
| 4 | Unit — registrasi | `register-penyalur` | Nama unit, inisial, jenis, PIC, email, kontak, serta lokasi jika diminta. |
| 5 | Mitra — registrasi | `register-penerima` | Nama perusahaan, NIB, email, dan kontak dispatcher. |
| 6 | Unit — beranda | `/unit/beranda` | Ringkasan unit, kontribusi/tong, status terbaru, dan pintasan ke aksi unit. |
| 7 | Unit — setor kertas | `/unit/setor-kertas`, `/unit/posting-baru` | Jumlah kg, kategori, kondisi, foto, tong terkait, validasi, dan hasil submit. |
| 8 | Unit — status tong | `/unit/status` | Nama/nomor tong, berat, kapasitas, lokasi, jadwal, status, serta aksi yang tersedia. |
| 9 | Unit — dompet | `/unit/dompet` | Saldo dan riwayat nominal, jenis, tanggal, serta status transaksi. |
| 10 | Unit — peringkat | `/leaderboard` | Ranking dan kontribusi unit; konteks periode bila datanya tersedia. |
| 11 | Mitra — pasokan/matching | `/perusahaan/dashboard`, `/perusahaan/pasokan`, `/perusahaan/matching` | Tab saran/manual, filter, listing aktif, unit/tong, kategori, jumlah, dan aksi detail/jadwal. |
| 12 | Mitra — permintaan baru | `/perusahaan/permintaan-baru` | Jenis/jumlah, toleransi QC, syarat, hari dan waktu pickup; status permintaan. |
| 13 | Mitra — detail listing | `/perusahaan/listing-detail` | Foto, kategori/kondisi, jumlah, unit/tong, status, dan aksi yang sesuai status. |
| 14 | Mitra — jadwal pickup | `/perusahaan/jadwal` | Listing terpilih, tanggal/jam, lokasi pusat, tong tujuan, serta konfirmasi penyimpanan. |
| 15 | Mitra — riwayat pickup | `/perusahaan/riwayat` | Daftar transaksi, berat/nilai jika ada, status, jadwal, dan bukti yang tersimpan. |
| 16 | Mitra — profil | `/perusahaan/profil` | Identitas/kontak perusahaan, edit jika didukung, simpan, dan status perubahan. |
| 17 | Admin — dashboard | `/admin/dashboard` | Ringkasan transaksi/dampak, tren berperiode, perhatian operasional, dan navigasi admin. |
| 18 | Admin — unit & tong | `/admin/unit-tong` | Daftar dan pencarian unit, relasi tong, status/kapasitas, tambah/nonaktifkan sesuai izin. |
| 19 | Admin — laporan | `/admin/laporan` | Daftar laporan, alasan/tingkat, item terkait, bukti, status, dan tindak lanjut. |

### View ada di source, tetapi belum menjadi layar aktif

`LandingAuthView`, `UnitPostingView`, dan `PerusahaanMatchingView` tidak dirutekan oleh switch utama
di `src/App.tsx`. Jangan memasukkannya sebagai layar baru dalam desain final sebelum ada keputusan
produk dan route yang bisa diuji. `UnitDompetView` berbeda: route-nya aktif meskipun tidak menjadi
tab bawah.

## 7. Persyaratan Fungsional untuk Redesign

1. Desain mempertahankan navigasi role-aware dan route aktif; tombol kembali membawa pengguna ke
   konteks sebelumnya yang sesuai.
2. Form memperlihatkan label, satuan, field wajib, validasi, loading, dan pesan error per field.
   Nilai yang sudah dimasukkan tetap tersedia setelah validasi gagal.
3. Berat selalu memiliki satuan kg; nilai uang selalu memiliki format rupiah; angka yang dibandingkan
   menggunakan format konsisten.
4. Rekomendasi matching dibedakan secara visual dari listing yang dipilih manual. Jangan menjanjikan
   kecocokan atau pasokan tersedia jika tidak ada di data.
5. Jadwal pickup mengulang konteks listing serta identitas tong sebelum pengguna mengonfirmasi.
6. Aksi perubahan status dan penyelesaian laporan menunjukkan status baru hanya setelah operasi
   berhasil; tampilkan pesan gagal dan jalur coba lagi.
7. Tombol tarik dana/top up, rating, QR, atau aksi pembayaran tidak boleh terlihat seolah aktif
   kecuali implementasinya benar-benar mendukungnya.
8. Empty state menjelaskan kondisi dan menawarkan aksi yang memang tersedia. Jangan membuat data
   contoh terlihat seperti transaksi nyata.

## 8. Persyaratan Nonfungsional

- **Responsif:** ponsel 320 px+, tablet, desktop; admin memiliki pola sidebar/drawer tersendiri.
- **Aksesibilitas:** target WCAG 2.2 AA, kontras memadai, semantik heading/form, fokus keyboard,
  label screen reader, dan alternatif non-warna untuk status.
- **Keterbacaan:** gunakan Bahasa Indonesia yang lugas, istilah konsisten, rupiah/berat/tanggal
  terformat sesuai lokal Indonesia.
- **Konsistensi:** gunakan satu design system bersama dan satu token warna sumber.
- **Kinerja interaksi:** berikan feedback saat loading/submit, cegah submit berulang, dan jangan
  menyembunyikan error backend.
- **Integrasi:** hasil desain diterapkan pada React + TypeScript + Vite + Tailwind yang sudah ada.
  Pertahankan integrasi `AppContext`, route, dan data; redesign bukan alasan mengganti framework atau
  menambah dependency.

## 9. Di Luar Cakupan

- Mengubah model bisnis, algoritma/skor matching, skema Supabase, aturan role, atau autentikasi.
- Menambah jenis limbah selain kertas atau banyak drop point kampus.
- Pembayaran digital sungguhan, pencairan dana, top up, atau manfaat tukar eco-points yang belum
  disepakati.
- QR handoff, rating/review, notifikasi baru, maupun fitur yang tidak tersedia pada baseline.
- Membuat data, statistik dampak, partner, testimoni, lokasi, ataupun aksi yang tidak bersumber dari
  sistem.
- Mengganti stack atau melakukan redesign branding/logo tanpa keputusan terpisah.

## 10. Konteks Teknis Saat Ini

- Frontend: React 19, TypeScript, Vite 6, Tailwind CSS 4.
- Data dan alur UI dikelola melalui `src/context/AppContext.tsx`; akses backend berada di
  `src/lib/` dan Supabase dipakai untuk sumber data yang tersedia.
- Shell pengguna: `src/components/Navbar.tsx` dan `src/components/BottomNav.tsx`.
- Shell admin: `src/components/AdminLayout.tsx`.
- Komponen utama layar berada di `src/views/`; sumber route adalah `src/App.tsx`.
- Design tokens/font saat ini didefinisikan di `src/index.css`. PRD ini tidak menganggap setiap tombol
  atau nilai contoh sudah terhubung ke operasi backend.

## 11. Verifikasi dan Kriteria Penerimaan

Sebelum redesign dinyatakan selesai:

- [ ] 19 layar aktif telah dicocokkan dengan tabel inventaris; layar tak terhubung tetap dicatat
  sebagai tidak aktif.
- [ ] Ketiga alur peran dapat ditelusuri pada prototipe dari masuk sampai tugas utama selesai.
- [ ] Semua CTA dan tab mempunyai tujuan yang benar; alias route tetap menghasilkan pengalaman
  yang konsisten.
- [ ] Listing, tong, permintaan, jadwal, dompet, leaderboard, transaksi, dan laporan mempertahankan
  makna data/status saat ini.
- [ ] Setiap form memperlihatkan valid, invalid, submit/loading, dan error/sukses yang relevan.
- [ ] Empty/loading/error state dirancang untuk halaman data.
- [ ] Layout diperiksa pada ukuran 320/360 px, tablet, dan desktop; fokus keyboard serta kontras
  warna ditinjau.
- [ ] Tidak ada aksi atau klaim baru yang hanya dibuat agar desain terlihat lengkap.

## 12. Keputusan yang Masih Perlu Pemilik Produk

Pertanyaan berikut tidak menghalangi pembuatan brief, tetapi harus diputuskan sebelum desain final
menampilkan perilaku terkait:

1. Apakah `LandingAuthView`, `UnitPostingView`, atau `PerusahaanMatchingView` akan diaktifkan, atau
   tetap menjadi komponen lama yang tidak dirutekan?
2. Apakah penarikan saldo/top up benar-benar fitur yang akan tersedia? Jika tidak, tombolnya harus
   dihilangkan atau dijadikan informasi non-aksi.
3. Apa dasar dan periode resmi perhitungan eco-points/leaderboard serta rumus estimasi pohon/air?
   Jangan menampilkan nilai sebagai fakta sebelum sumbernya disepakati.
4. Apakah peta admin diperlukan untuk mengelola satu drop point pusat, dan sumber lokasi mana yang
   dianggap resmi?
5. Aksi konfirmasi penempatan kertas oleh unit harus berstatus seperti apa? Model listing saat ini
   memiliki status `menunggu_mitra`, `siap_pickup`, dan `sudah_diambil`; perubahan state tambahan
   perlu disepakati sebelum dijadikan bagian desain.
