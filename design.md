# Design System & Screen Brief — Sampah Butuh Teman

Dokumen ini adalah acuan desain kanonis untuk redesign UI aplikasi. Dokumen PRD ada di
[`sampah-butuh-teman-prd (1).md`](./sampah-butuh-teman-prd%20%281%29.md). Cakupan aktif mengikuti
route di `src/App.tsx`; file view yang belum dirutekan dicatat terpisah agar redesign tidak
menciptakan layar yang tidak dapat dibuka pengguna.

## 1. Arah Desain

**Gagasan visual: kertas kampus kembali menjadi sumber daya.** Antarmuka terasa seperti ruang kerja
sirkular yang tertata: informasi bergerak dari unit kampus, ke tong bernomor, ke proses pencocokan,
lalu ke pengambilan dan dampak. Krem kertas menjadi kanvas utama; hijau hutan menandai aksi dan
kemajuan tanpa mengubah struktur tugas yang sudah ada.

- **Karakter:** bersih, tepercaya, hangat, operasional, dan berorientasi komunitas kampus.
- **Bahasa:** Bahasa Indonesia yang jelas dan langsung; gunakan istilah "unit kampus", "mitra
  industri", "tong", "listing", "permintaan", dan "jadwal pickup" secara konsisten.
- **Prioritas:** tugas utama dan status transaksi terlihat lebih dahulu daripada dekorasi, jargon,
  atau ilustrasi.
- **Kepadatan:** layar dashboard boleh padat oleh data yang berguna. Form dan onboarding lebih lega.
  Jangan menyamakan semua layar menjadi grid kartu yang seragam.
- **Prinsip:** satu tindakan utama per layar; tampilkan konteks unit/tong pada setiap perpindahan
  material; angka, status, dan aksi tidak boleh hanya dibedakan oleh warna.

Gunakan logo, ilustrasi onboarding, dan maskot yang sudah tersedia hanya jika mendukung pesan:
`public/logo-full.png`, `public/logo-sbt.png`, `public/mina.png`, `public/moni.png`, dan
`public/onboarding-1.jpg` sampai `public/onboarding-3.jpg`. Jangan mengganti foto atau membuat
testimoni, mitra, angka dampak, maupun data operasional fiktif sebagai bukti produk.

## 2. Design Tokens

Pertahankan peran warna yang sudah didefinisikan di `src/index.css`. Jika nilai token berubah,
perbarui satu sumber token tersebut; jangan menambah warna ad hoc per halaman.

| Peran | Token saat ini | Pemakaian |
|---|---|---|
| Aksi utama / identitas | `#2D6A4F` | Tombol primer, tautan aktif, indikator proses |
| Hijau gelap | `#1A4235` | Kontras pada hover/pressed dan teks di atas hijau muda |
| Hijau pendamping | `#52B788` | Grafik atau variasi data, bukan tombol primer kedua |
| Hijau pucat | `#D8F3DC` | Latar penanda sukses/aktif yang lembut |
| Latar aplikasi | `#FAFAF7` | Krem lembut untuk latar halaman |
| Permukaan | `#FFFFFF` | Panel utama, form, tabel, dan dialog |
| Permukaan sekunder | `#F2F7F4` | Area kontrol dan panel sekunder |
| Garis | `rgba(45,106,79,0.12)` | Batas input, tabel, dan pemisah yang diperlukan |
| Teks utama | `#1A2E22` | Judul dan isi utama |
| Teks sekunder | `#52645A` | Deskripsi dan metadata |
| Teks tersier | `#8CA090` | Metadata/hint; gunakan warna yang lolos kontras pada ukuran teks kecil |
| Peringatan | `#F4A261` | Aksen peringatan |
| Bahaya | `#E76F51` | Error, tindakan destruktif, laporan kritis |
| Sukses | `#52B788` | Konfirmasi proses selesai |

### Tipografi, bentuk, dan jarak

- **Font:** Plus Jakarta Sans, dengan fallback sans-serif sistem.
- **Palet permukaan:** gunakan krem lembut `#FAFAF7` sebagai latar aplikasi, putih untuk permukaan
  utama, dan hijau hutan `#2D6A4F` sebagai aksen produk. Merah dan amber tetap khusus untuk status
  bahaya/peringatan, bukan aksen dekoratif.
- **Ukuran:** body utama 14-16 px (utamakan 16 px untuk paragraf/form), label 12-14 px,
  judul halaman 22-30 px sesuai viewport, judul bagian 17-22 px. Jangan mengandalkan teks 10-11 px
  untuk informasi penting.
- **Angka:** gunakan angka tabular untuk berat, saldo, poin, tanggal, dan statistik.
- **Hierarki:** bedakan judul, isi, dan metadata melalui ukuran, bobot, serta jarak; jangan membuat
  semua teks tebal atau uppercase.
- **Radius:** 4, 6, 10, 14, dan 20 px mengikuti peran komponen. Radius pill hanya untuk chip/status
  yang ringkas, bukan semua tombol dan panel.
- **Jarak:** gunakan kelipatan 4 px (4, 8, 12, 16, 24, 32, 48, 64). Grup informasi terkait lebih
  rapat daripada jarak antarbagian.
- **Elevation:** bidang datar dan border tonal sebagai default. Bayangan ringan hanya untuk elemen
  yang benar-benar mengambang, seperti menu dan dialog.

## 3. Grid, Navigasi, dan Responsif

- Bangun mobile-first pada lebar 360 px ke atas. Pastikan layout tetap bekerja pada 320 px tanpa
  scroll horizontal; tablet sekitar 640-1023 px; desktop mulai 1024 px.
- Layar unit dan mitra memakai konten terpusat dengan lebar baca yang nyaman. Form panjang tidak
  melebar penuh pada desktop.
- Admin adalah ruang kerja desktop: sidebar navigasi, header kontekstual, dan area konten lebar.
  Pada mobile sidebar menjadi drawer yang bisa dibuka/ditutup dan kontennya menjadi satu kolom.
- Jangan memaksakan layout admin desktop ke layar unit/mitra. Jangan menyusutkan tabel desktop
  menjadi kolom tak terbaca: ubah menjadi daftar/ringkasan per baris pada layar sempit.
- Sediakan ruang aman untuk header tetap dan navigasi bawah; konten tidak boleh tertutup.
- Navigasi pengguna unit dan mitra: pertahankan tiga tab yang saat ini tersedia pada
  `src/components/BottomNav.tsx`. Halaman dompet dan profil tetap dapat dicapai melalui aksi/menu
  kontekstual; jangan menambahkan tab keempat tanpa keputusan produk. Admin menggunakan
  `src/components/AdminLayout.tsx`, bukan bottom navigation.
- Tampilkan peran dan identitas akun secara cukup jelas agar pengguna tidak salah mengelola akun
  unit/perusahaan.

## 4. Pola Komponen

| Komponen | Aturan desain dan perilaku |
|---|---|
| Header halaman | Judul spesifik, konteks singkat bila membantu, lalu satu aksi utama yang relevan. Hindari greeting besar yang menggeser tugas. |
| Tombol primer | Satu aksi paling penting; teks berupa kata kerja konkret ("Buat listing", "Jadwalkan pickup"). Tinggi target minimal 44 px. |
| Tombol sekunder | Aksi pendamping beroutline atau tonal. Aksi destruktif menggunakan gaya bahaya dan konfirmasi bila perlu. |
| Form | Label tetap terlihat di atas field; placeholder bukan pengganti label. Tampilkan format, satuan, validasi, dan pesan error di dekat field. Jangan menghapus isian saat error. |
| Panel dan kartu | Gunakan panel untuk mengelompokkan data yang punya hubungan. Hindari kartu dekoratif berulang; KPI hanya ditampilkan jika membantu keputusan. |
| Status | Teks status selalu eksplisit, dapat disertai ikon dan warna semantik. Konsisten antara listing, tong, jadwal, transaksi, dan laporan. |
| Tabel/daftar | Judul kolom jelas, angka rata kanan, tanggal konsisten, baris dapat dipindai, dan tindakan terkait dekat dengan itemnya. Di mobile gunakan ringkasan/row card yang mempertahankan label data. |
| Grafik | Tampilkan satuan, rentang waktu, label/legend dan nilai yang bisa diakses tanpa hover. Grafik tidak boleh menjadi satu-satunya cara memahami angka. Hindari metrik atau tren yang tidak berasal dari data aplikasi. |
| Dialog/konfirmasi | Jelaskan akibat tindakan, beri pilihan batal yang jelas, dan jangan mengonfirmasi sukses sebelum aksi benar-benar berhasil. |
| Notifikasi | Pesan singkat, spesifik, dapat ditindaklanjuti; gunakan live region untuk hasil aksi penting. |
| Maskot/ilustrasi | Gunakan secukupnya pada onboarding atau empty/success state. Jangan bersaing dengan data operasional. |

### Status yang perlu dibedakan

Gunakan label yang sesuai data, jangan menambah status seolah-olah sudah tersedia di backend.

- Tong: kosong, terisi, siap pickup.
- Listing: menunggu mitra, siap pickup, sudah diambil.
- Matching/transaksi: menunggu diambil, sudah diambil.
- Laporan: menunggu tindakan, sudah selesai; tingkat laporan kritis/sedang ditampilkan terpisah
  dari status penanganannya.

## 5. Brief Seluruh Layar Aktif

Ada 19 layar/alur aktif di bawah ini. Nama komponen adalah acuan implementasi, bukan keharusan
mengubah kontrak route atau nama file.

### Publik dan autentikasi

| Layar | Komponen / route | Fokus hierarki dan aksi |
|---|---|---|
| Onboarding | `OnboardingView` / tahap onboarding | Ceritakan alur kertas kampus dalam tiga langkah singkat; satu ilustrasi relevan per slide, indikator yang dapat diakses, "Lewati" dan "Mulai sekarang". |
| Pilih peran | `AuthGateView` / tahap gate | Jelaskan perbedaan Unit Kampus, Mitra Industri, dan Admin; berikan aksi masuk/daftar yang sesuai. Jangan membuat peran baru. |
| Login | `LoginView` / tahap login | Email dan kata sandi, tampil/sembunyikan kata sandi, validasi, loading, error autentikasi, serta jalur kembali/pilih peran. |
| Daftar unit kampus | `RegisterPenyalurView` / tahap register-penyalur | Nama unit, inisial, jenis unit, PIC, email/kontak, dan lokasi jika diminta; jelaskan data wajib dan hasil setelah daftar. |
| Daftar mitra industri | `RegisterPenerimaView` / tahap register-penerima | Nama perusahaan, NIB, email, kontak dispatcher; jaga keterbacaan form panjang dan jelaskan error spesifik. |

### Unit kampus

| Layar | Komponen / route | Fokus hierarki dan aksi |
|---|---|---|
| Beranda unit | `UnitBerandaView` / `/unit/beranda` | Ringkas kontribusi dan kondisi tong unit, tampilkan aksi utama setor/posting, status terbaru, dan pintasan ke dompet serta peringkat jika tersedia. |
| Setor kertas | `UnitSetorKertasView` / `/unit/setor-kertas`, `/unit/posting-baru` | Alur/form jumlah kg, kategori, kondisi, foto, dan tong yang terkait; tunjukkan review ringkas sebelum submit serta validasi yang mempertahankan isian. |
| Status tong | `UnitStatusView` / `/unit/status` | Status, kapasitas, berat, nama/nomor tong, lokasi spesifik, jadwal pickup, dan tindakan yang didukung saat ini. Bedakan keadaan kosong, terisi, dan siap pickup. |
| Dompet unit | `UnitDompetView` / `/unit/dompet` | Saldo dan riwayat transaksi dengan tanda masuk/keluar, tanggal, status, nominal rupiah; jangan menampilkan tombol tarik/top up sebagai berfungsi bila belum tersambung. |
| Peringkat | `LeaderboardView` / `/leaderboard` | Periode/peringkat, identitas unit, kg tersalurkan, dan posisi unit saat ini. Jangan mempermalukan unit dengan data kosong atau mengklaim poin bisa ditukar tanpa keputusan produk. |

### Mitra industri

| Layar | Komponen / route | Fokus hierarki dan aksi |
|---|---|---|
| Pasokan dan matching | `PerusahaanDashboardView` / `/perusahaan/dashboard`, `/perusahaan/pasokan`, `/perusahaan/matching` | Dua cara menemukan pasokan (saran dan jelajah manual), filter kategori, kuantitas, unit/tong, status, dan aksi detail/jadwalkan. Labeli sumber saran secara jujur. |
| Buat permintaan | `PerusahaanPermintaanView` / `/perusahaan/permintaan-baru` | Jenis/jumlah kertas, toleransi QC, syarat dan hari/jam pickup; kelompokkan field dan tunjukkan rangkuman sebelum kirim. |
| Detail listing | `PerusahaanListingDetailView` / `/perusahaan/listing-detail` | Foto, kategori/kondisi, jumlah, unit asal, tong dan status; aksi menuju penjadwalan hanya jika listing dapat dipilih. |
| Jadwal pickup | `PerusahaanJadwalView` / `/perusahaan/jadwal` | Listing/matching terpilih, tanggal/jam yang tersedia, arahan drop point pusat dan nama/nomor tong; konfirmasi sebelum menyimpan. |
| Riwayat pickup | `PerusahaanRiwayatView` / `/perusahaan/riwayat` | Daftar transaksi dan status, berat/nilai jika tersedia, jadwal, detail bukti yang tersimpan; filter sederhana bila data mendukung. |
| Profil mitra | `PerusahaanProfilView` / `/perusahaan/profil` | Identitas perusahaan dan kontak yang bisa ditinjau/dikelola; pisahkan simpan perubahan dari keluar akun. |

### Admin

| Layar | Komponen / route | Fokus hierarki dan aksi |
|---|---|---|
| Dashboard admin | `AdminDashboardView` / `/admin/dashboard` | Ringkasan volume/status, tren dengan periode jelas, unit/tong yang perlu perhatian, dan pintasan ke pengelolaan. Peta hanya ditampilkan jika lokasi valid dan berguna bagi tugas admin. |
| Unit dan tong | `AdminUnitTongView` / `/admin/unit-tong` | Cari/filter unit, relasi unit-tong, status dan kapasitas tong, aksi tambah/nonaktifkan yang tersedia; tampilkan dampak aksi dan konfirmasi. |
| Laporan dan flag | `AdminLaporanView` / `/admin/laporan` | Prioritaskan laporan yang menunggu tindakan, alasan, tingkat, detail, bukti foto jika ada, item terkait, dan aksi penyelesaian. Pertahankan jejak status. |

### View yang belum aktif

`LandingAuthView`, `UnitPostingView`, dan `PerusahaanMatchingView` tersedia di source tree tetapi
tidak dipilih oleh switch route utama `src/App.tsx`. Jangan menggambar atau menghubungkannya sebagai
layar tambahan hanya berdasarkan keberadaan file. Jika produk memutuskan mengaktifkannya, tambahkan
route, alur, dan kriteria penerimaan ke PRD lebih dahulu. `/unit/dompet` juga tidak ada di tab bawah
saat ini, tetapi route-nya aktif dan layar dompet harus tetap didesain.

## 6. Interaksi dan Kondisi Layar

Setiap layar yang memuat data atau aksi harus punya desain untuk keadaan yang relevan:

- **Loading:** indikator dekat konten yang dimuat; pertahankan struktur halaman dan cegah aksi ganda.
- **Kosong:** jelaskan mengapa belum ada data dan berikan satu langkah berikutnya yang memang tersedia.
- **Error:** jelaskan bagian yang gagal dan cara mencoba lagi; jangan menampilkan data lama sebagai hasil
  sukses tanpa penanda.
- **Sukses:** konfirmasi aksi dan status baru secara nyata; gunakan toast hanya untuk hasil singkat,
  bukan mengganti detail penting.
- **Disabled:** jelaskan sebab tombol belum tersedia jika sebabnya tidak jelas dari konteks.
- **Data parsial:** tampilkan data yang ada dengan label yang jelas; jangan mengarang nilai atau
  menyamarkan `0` sebagai data yang hilang.
- **Mobile:** aksi utama mudah dijangkau, form tetap dapat digunakan dengan keyboard, dan modal tidak
  memotong konten/CTA.

Animasi singkat dan fungsional saja (misalnya perpindahan slide atau feedback tombol). Hormati
`prefers-reduced-motion`; jangan gunakan animasi berulang yang mengalihkan perhatian.

## 7. Aksesibilitas dan Kualitas

- Targetkan WCAG 2.2 AA: kontras teks normal minimal 4.5:1 dan teks besar minimal 3:1.
- Token teks tersier yang lebih terang di stylesheet lama (`#8A9E94`) tidak dipakai untuk teks
  kecil di atas putih; selaraskan token tersebut ke `#65766D` saat menerapkan redesign.
- Seluruh aksi harus dapat dioperasikan dengan keyboard, memiliki focus indicator terlihat, nama
  aksesibel, serta urutan fokus yang masuk akal.
- Gunakan label form eksplisit, hubungkan error dengan field, dan umumkan hasil async penting kepada
  screen reader.
- Gunakan heading semantik berurutan; tabel memiliki header; grafik memiliki ringkasan teks.
- Jangan mengandalkan warna, hover, ikon tanpa label, atau placeholder sebagai satu-satunya pembawa
  informasi.
- Target area sentuh sekurangnya 44 x 44 px untuk aksi utama dan navigasi.

## 8. Handoff Redesign

Sebelum implementasi, artefak desain harus menunjukkan:

1. Semua 19 layar aktif, dengan versi mobile dan desktop yang sesuai peran/layout.
2. Komponen bersama dan token warna, type, jarak, radius, status, serta fokus.
3. Keadaan loading, kosong, error, disabled, sukses, dan konfirmasi untuk flow yang relevan.
4. Prototipe alur onboarding → autentikasi → posting listing → pilih pasokan/matching → jadwalkan
   pickup → konfirmasi pengambilan, serta alur admin memantau unit/tong dan laporan.
5. Semua konten menggunakan bahasa dan status yang konsisten dengan PRD serta model data yang ada.
6. Komponen hasil alat desain (termasuk Stitch/Figma) diperlakukan sebagai referensi visual; sebelum
   dipakai, pastikan route, state, aksesibilitas, dan integrasinya mengikuti aplikasi React yang ada.

### Checklist review

- [ ] Tidak ada layar aktif yang terlewat atau route yang berubah tanpa keputusan.
- [ ] Layout terbaca pada 320/360 px, tablet, dan desktop; tidak ada scroll horizontal yang tidak perlu.
- [ ] Hierarki visual memprioritaskan pekerjaan dan status, bukan dekorasi.
- [ ] Status, nominal, satuan, pesan error, serta aksi sesuai konteks dan konsisten di semua peran.
- [ ] Tidak ada angka dampak, fasilitas, testimoni, atau fitur pembayaran yang tidak bersumber dari data.
- [ ] Navigasi, keyboard, fokus, form, dialog, dan reduced motion sudah dipertimbangkan.
- [ ] Semua aset yang digunakan memang tersedia dan tidak menyiratkan mitra/aktivitas yang belum nyata.
