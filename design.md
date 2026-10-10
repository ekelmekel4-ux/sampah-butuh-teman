# Design Specification — Sampah Butuh Teman

> **Untuk Stitch AI:** Dokumen ini berisi spesifikasi desain lengkap untuk web app **Sampah Butuh Teman** — platform penyaluran limbah kertas kampus ke industri daur ulang. Setiap layar dijelaskan dengan detail konten, komponen UI, dan interaksi. Gunakan spesifikasi ini untuk menghasilkan desain yang konsisten di semua layar.

---

## Design System

### Brand & Identity
- **Nama Produk:** Sampah Butuh Teman
- **Tagline:** "Kertas Bekasmu, Bahan Baku Mereka"
- **Tone:** Ramah lingkungan, bersih, profesional namun hangat
- **Platform:** Web App responsif (mobile-first, max-width 448px utama)

### Palet Warna
| Token | Hex | Penggunaan |
|---|---|---|
| Primary | `#2D6A4F` | CTA utama, elemen aktif, header |
| Primary Dark | `#1A4235` | Hover / pressed state |
| Primary Light | `#52B788` | Accent hijau segar, badge sukses |
| Primary Pale | `#D8F3DC` | Badge/tag background, highlight ringan |
| Background | `#FAFAF7` | Background halaman utama |
| Surface | `#F2F7F4` | Input background, sub-card |
| Card | `#FFFFFF` | Card putih |
| Border | `rgba(45,106,79,0.12)` | Outline ringan |
| Text Dark | `#1A2E22` | Teks utama |
| Text Mid | `#52645A` | Teks sekunder |
| Text Light | `#8CA090` | Placeholder / hint |
| Warning | `#F4A261` | Amber — peringatan |
| Error | `#E76F51` | Merah terakota — error |
| Success | `#52B788` | Konfirmasi sukses |

### Tipografi
- **Font:** Plus Jakarta Sans (Google Fonts)
- **Heading besar:** 24–28px, font-weight 800 (ExtraBold)
- **Heading sekunder:** 18–20px, font-weight 700
- **Body:** 14–15px, font-weight 400–500
- **Caption/label kecil:** 11–12px, font-weight 600

### Komponen Umum
- **Button Primer:** Rounded-full, background `#2D6A4F`, teks putih, padding `12px 24px`, shadow ringan
- **Button Sekunder:** Rounded-full, border `#2D6A4F`, teks `#2D6A4F`, background transparan
- **Card:** Rounded-2xl (`16px`), background putih, shadow `0 1px 4px rgba(26,46,34,0.06), 0 4px 16px rgba(26,46,34,0.04)`
- **Input Field:** Rounded-xl, background `#F2F7F4`, border `rgba(45,106,79,0.12)`, padding `12px 16px`
- **Badge/Chip:** Rounded-full, padding `4px 10px`, background `#D8F3DC`, teks `#2D6A4F`, font-size 11px
- **Bottom Navigation:** Fixed di bawah, floating pill (rounded-full), background `white/95` dengan backdrop blur, 3 item tab per role

### Ikon
- Gunakan **Material Symbols Outlined** (Google Icons)
- Icon ukuran 20–24px
- Icon aktif: `FILL 1` (solid), tidak aktif: `FILL 0` (outline)

---

## Struktur Navigasi

```
App
├── [Publik] Onboarding (1 layar)
├── [Publik] Auth Gate — pilih cara masuk
├── [Auth] Login Penyalur (Unit Kampus)
├── [Auth] Register Penyalur (Unit Kampus)
├── [Auth] Login Penerima (Mitra Industri)
├── [Auth] Register Penerima (Mitra Industri)
├── [Auth] Login Admin
│
├── [Unit Kampus] Tab: Beranda → UnitBerandaView / UnitSetorKertasView
├── [Unit Kampus] Tab: Status Tong → UnitStatusView
├── [Unit Kampus] Tab: Peringkat → LeaderboardView
│
├── [Perusahaan] Tab: Pasokan Kertas → PerusahaanMatchingView
├── [Perusahaan]   → PerusahaanListingDetailView (detail 1 listing)
├── [Perusahaan]   → PerusahaanJadwalView (jadwal pickup)
├── [Perusahaan] Tab: Buat Kebutuhan → PerusahaanPermintaanView
├── [Perusahaan] Tab: Riwayat Pickup → PerusahaanRiwayatView
├── [Perusahaan] Tab: Profil → PerusahaanProfilView
│
├── [Admin] Tab: Dashboard → AdminDashboardView
├── [Admin] Tab: Unit & Tong → AdminUnitTongView
└── [Admin] Tab: Laporan & Flag → AdminLaporanView
```

---

## Layar 1 — Onboarding

**File:** `OnboardingView.tsx`
**Route:** Layar pertama saat app dibuka

### Konten
- **Latar belakang:** Hijau gradien dari `#2D6A4F` ke `#1A4235`
- **Logo app:** Ikon daun/tumbuhan + teks "Sampah Butuh Teman" (putih), besar di tengah
- **3 slide carousel onboarding:**
  1. "Kertas Menumpuk di Kampus?" — ilustrasi tong/kotak berisi kertas
  2. "Hubungkan ke Industri Daur Ulang" — ilustrasi matching/handshake
  3. "Kampus Lebih Hijau, Bersama!" — ilustrasi papan peringkat / pohon
- **Dot indicator** di bawah carousel (active dot = putih solid, inactive = putih transparan)
- **Tombol "Mulai Sekarang"** di paling bawah: pill button putih, teks hijau gelap
- **Tombol "Lewati"** kecil di pojok kanan atas: teks putih semi-transparan

---

## Layar 2 — Auth Gate (Pilih Peran)

**File:** `AuthGateView.tsx`
**Route:** Setelah onboarding, sebelum login

### Konten
- **Header:** Logo kecil + "Selamat Datang!" + tagline
- **Background:** `#FAFAF7` dengan ornamen daun samar
- **3 card pilihan peran** (vertical stack):
  1. **Unit Kampus (Penyalur)** — icon `corporate_fare`, deskripsi singkat "Biro, Fakultas, Prodi — salurkan limbah kertas unit Anda"
  2. **Mitra Industri (Penerima)** — icon `factory`, deskripsi "Perusahaan daur ulang & produsen kemasan — temukan pasokan kertas"
  3. **Admin** — icon `admin_panel_settings`, deskripsi "Pengelola sistem & drop point"
- Setiap card: rounded-2xl, border tipis, arrow ke kanan, hover efek hijau
- Di bawah card: teks kecil "Sudah punya akun? Login langsung"

---

## Layar 3 — Login Penyalur (Unit Kampus)

**File:** `auth/LoginPenyalurView.tsx`

### Konten
- **Header:** Back button + badge "Unit Kampus" (chip hijau)
- **Logo kecil** + heading "Masuk sebagai Unit Kampus"
- **Form:**
  - Field Email/ID Unit (icon `alternate_email`)
  - Field Password (icon `lock`, toggle show/hide)
  - Tombol "Lupa Password?" (link kecil)
- **Tombol "Masuk"** — primary button penuh lebar
- **Divider "atau"**
- **Tombol "SSO Kampus"** — secondary button dengan icon `school`
- **Link:** "Belum terdaftar? **Daftar sekarang**"

---

## Layar 4 — Register Penyalur (Unit Kampus)

**File:** `auth/RegisterPenyalurView.tsx`

### Konten
- **Header:** Back button + badge "Daftar Unit Kampus"
- **Form multi-field:**
  - Nama Unit (dropdown/text: Biro, Fakultas, Prodi, Lembaga)
  - Nama PIC (Person in Charge)
  - Email Unit
  - Nomor Kontak
  - Password + Konfirmasi Password
  - Checkbox "Saya setuju dengan syarat & ketentuan"
  - *Catatan: Lokasi default (fix) adalah Universitas Pembangunan Jaya, tidak perlu set alamat.*
- **Tombol "Daftar"** — primary button
- **Link:** "Sudah punya akun? **Masuk**"

---

## Layar 5 — Login Penerima (Mitra Industri)

**File:** `auth/LoginPenerimaView.tsx`

### Konten
- Identik dengan Login Penyalur tapi badge "Mitra Industri" warna biru-hijau teal
- Heading: "Masuk sebagai Mitra Industri"
- Tidak ada tombol SSO Kampus

---

## Layar 6 — Register Penerima (Mitra Industri)

**File:** `auth/RegisterPenerimaView.tsx`

### Konten
- **Form:**
  - Nama Perusahaan
  - Jenis Perusahaan (Daur Ulang / Produsen Kemasan / Lainnya)
  - Email Perusahaan
  - Nomor Kontak
  - Password + Konfirmasi Password
  - Checkbox persetujuan

---

## Layar 7 — Login Admin

**File:** `auth/LoginAdminView.tsx`

### Konten
- **Tampilan lebih sederhana/minimal**
- Badge "Admin" dengan warna ungu/abu gelap
- Heading: "Admin Panel"
- Form: Username + Password
- Tidak ada pilihan SSO atau daftar

---

## Layar 8 — Unit Beranda (Setor Kertas)

**File:** `UnitBerandaView.tsx` / `UnitSetorKertasView.tsx`
**Tab:** Beranda (unit)
**Bottom Nav:** Icon `home` aktif

### Konten
- **Header Section:**
  - Greeting: "Halo, [Nama Unit]!"
  - Sub-teks: "Tong: FTD No. 1 — Drop Point Utama"
  - Badge status tong: `TERISI 12 kg` atau `KOSONG`
- **Eco Points Card** (horizontal banner):
  - Icon daun besar, "**450 Eco Points**", "Peringkat #2 bulan ini"
  - Background: gradient hijau
- **Section "Posting Limbah Kertas Baru":**
  - Sub-heading: "Apa yang ingin kamu setor?"
  - **Form Setor:**
    - **Pilih Kategori Kertas** (4 chip selectable):
      - HVS/Fotokopi | Kardus/Karton | Koran/Majalah | Kertas Campur
    - **Estimasi Berat** — stepper / input angka (kg)
    - **Kondisi Kertas** — multi-select checklist:
      - Kering | Bersih (tidak berminyak) | Sudah dipisah | Ada sedikit basah | Masih ada staples
    - **Foto** — area upload foto (kotak dashed, icon `photo_camera`, teks "Tambah Foto")
    - **Catatan tambahan** — textarea opsional
  - **Tombol "Kirim ke Drop Point"** — primary button penuh lebar, icon `send`
- **Info Card** "Tong kamu ada di:"
  - Icon `location_on`
  - "Drop Point Pusat Kampus — Gedung Rektorat Lt. Dasar"
  - "Tong **FTD No. 1** — bawa kertas ke sana setelah konfirmasi"

---

## Layar 9 — Status Tong (Unit)

**File:** `UnitStatusView.tsx`
**Tab:** Status Tong
**Bottom Nav:** Icon `inventory_2` aktif

### Konten
- **Header:** "Status Tong Saya"
- **Tong Status Card** (besar, di atas):
  - Visual tong dengan % isi (progress bar vertikal atau lingkaran)
  - Nama: "FTD No. 1"
  - Status badge: `SIAP PICKUP` (hijau) / `TERISI` (kuning) / `KOSONG` (abu)
  - Berat saat ini: "**18 kg** dari 50 kg kapasitas"
- **Tombol "Konfirmasi Kertas Sudah Ditaruh"** — jika ada listing menunggu konfirmasi
  - Tampil sebagai banner kuning dengan icon `check_circle`
- **Riwayat Listing** (list card):
  - Setiap card: kategori kertas, berat, tanggal post, status chip
  - Status chip: `Menunggu Mitra` (abu) / `Siap Pickup` (kuning) / `Sudah Diambil` (hijau)
- **Empty state** jika belum ada listing: ilustrasi tong kosong + teks motivasi + tombol "Setor Sekarang"

---

## Layar 10 — Leaderboard (Papan Peringkat)

**File:** `LeaderboardView.tsx`
**Tab:** Peringkat (semua role bisa akses)
**Bottom Nav:** Icon `leaderboard` aktif

### Konten
- **Header Section:**
  - Heading: "Papan Peringkat Unit"
  - Sub-teks: "Unit paling aktif menyalurkan limbah kertas"
  - **Filter tab:** Mingguan | Bulanan | Akumulatif (pill tab selector)
- **Podium Top 3** (visual dominan):
  - Posisi 2 (kiri), Posisi 1 (tengah, lebih tinggi), Posisi 3 (kanan)
  - Setiap podium: avatar/inisial unit, nama unit disingkat, total kg
  - Podium 1: mahkota emas + latar kuning
- **Statistik Banner** (horizontal scroll chips):
  - "Total 1,240 kg tersalurkan" | "Setara 12 pohon diselamatkan" | "Hemat 6,200 liter air"
- **Daftar Ranking** (#4 ke bawah):
  - Setiap row: nomor rank, inisial unit (avatar bulat), nama unit, total kg, eco points
  - Row user sendiri: di-highlight dengan border hijau
- **Bagian bawah:** "Kamu di posisi #7 — Setor lebih banyak untuk naik peringkat!"

---

## Layar 11 — Pasokan Kertas / Matching (Perusahaan)

**File:** `PerusahaanMatchingView.tsx`
**Tab:** Pasokan Kertas
**Bottom Nav:** Icon `handshake` aktif

### Konten
- **Header:** "Temukan Pasokan Kertas"
- **Filter & Pencarian:**
  - Search bar: "Cari unit atau jenis kertas..."
  - Filter chips (horizontal scroll): `Semua` | `HVS` | `Kardus` | `Koran` | `Campur`
  - Tombol Filter lanjutan (icon `tune`)
- **Saran Matching Sistem** (section khusus jika ada permintaan aktif):
  - Banner kuning kecil: "Cocok dengan permintaan kamu"
  - 1–2 listing highlighted dengan badge "DISARANKAN SISTEM" + skor kecocokan (mis. 94%)
- **Semua Listing Tersedia** (list card):
  - Setiap card listing:
    - Foto kertas (thumbnail kiri)
    - Nama unit + inisial badge
    - Kategori kertas + berat (kg)
    - Tanggal post
    - Kondisi chips: `Kering` `Bersih` `Sudah dipisah`
    - Nama tong: "FTD No. 1"
    - Tombol "Lihat Detail"
- **Empty state:** ilustrasi kosong + "Belum ada listing tersedia saat ini"

---

## Layar 12 — Detail Listing Kertas (Perusahaan)

**File:** `PerusahaanListingDetailView.tsx`
**Diakses dari:** Matching View

### Konten
- **Header:** Back button + "Detail Listing"
- **Foto kertas** — full width, rounded, bisa swipe jika multi-foto
- **Info Utama:**
  - Nama Unit: "Fakultas Teknik & Desain"
  - Tong: "FTD No. 1 — Drop Point Pusat"
  - Kategori: chip `HVS/Fotokopi`
  - Berat: "**24 kg**"
  - Tanggal tersedia: "Diposting 2 hari lalu"
- **Kondisi Kertas** (checklist icons): Kering | Bersih | Sudah dipisah
- **Skor Kecocokan** (jika ada permintaan aktif):
  - Progress bar / donut chart: "**92% cocok** dengan permintaan Anda"
- **Info Drop Point:**
  - Icon `location_on`
  - "Gedung Rektorat Lt. Dasar — Tong FTD No. 1"
- **Tombol Aksi:** "Jadwalkan Pickup dari Listing Ini" — primary button besar

---

## Layar 13 — Jadwal Pickup (Perusahaan)

**File:** `PerusahaanJadwalView.tsx`
**Diakses dari:** Listing Detail

### Konten
- **Header:** Back button + "Atur Jadwal Pickup"
- **Ringkasan Listing** (card kecil di atas):
  - Nama unit, kategori, berat, nomor tong
- **Form Jadwal:**
  - **Pilih Tanggal** — date picker calendar (inline atau modal)
  - **Pilih Jam Kedatangan** — time picker atau slot waktu (mis. 08:00 | 09:00 | 10:00...)
  - **Pilih Armada & Driver** — dropdown mengambil data dari profil (Nomor Polisi Armada & Nama Driver)
  - **Nomor Surat Jalan** — input text (opsional)
- **Info Lokasi Pickup** (card info):
  - Icon `local_shipping`
  - "Datang ke: **Drop Point Pusat Kampus**"
  - "Tuju: **Tong FTD No. 1**"
  - "Alamat: Gedung Rektorat Lt. Dasar"
- **Tombol "Konfirmasi Jadwal"** — primary button

---

## Layar 14 — Buat Kebutuhan Kertas (Perusahaan)

**File:** `PerusahaanPermintaanView.tsx`
**Tab:** Buat Kebutuhan
**Bottom Nav:** Icon `post_add` aktif

### Konten
- **Header:** "Posting Kebutuhan Kertas"
- **Form:**
  - **Jenis Kertas yang Dibutuhkan** — multi-select checklist: HVS/Fotokopi | Kardus/Karton | Koran/Majalah | Campur
  - **Jumlah yang Dibutuhkan** — input angka + unit "kg"
  - **Toleransi Kadar Air** — slider 0–30%
  - **Syarat QC** — multi-checklist (Kering, Bersih, Sudah dipisah, dll)
  - **Hari Pickup yang Tersedia** — multi-select hari (Senin–Minggu chips)
  - **Jam Operasional** — input "07:00 – 17:00"
  - **Estimasi Dana Riset (Rp)** — input nominal (opsional)
- **Tombol "Posting Permintaan"** — primary button
- **Info card:** "Setelah posting, sistem akan otomatis mencarikan listing kertas yang cocok dari unit-unit kampus"

---

## Layar 15 — Riwayat Pickup (Perusahaan)

**File:** `PerusahaanRiwayatView.tsx`
**Tab:** Riwayat Pickup
**Bottom Nav:** Icon `history` aktif

### Konten
- **Header:** "Riwayat Transaksi Pickup"
- **Filter Tab:** Menunggu Diambil | Sudah Diambil | Semua
- **Daftar Transaksi** (card list):
  - Setiap card:
    - Header card: nama unit + tong + tanggal jadwal
    - Kategori kertas + berat + nilai (Rp)
    - Status badge: `MENUNGGU DIAMBIL` (kuning) / `SUDAH DIAMBIL` (hijau)
    - Jika "Menunggu Diambil": Tombol **"Konfirmasi Sudah Diambil"** (prominent, hijau)
    - Jika "Sudah Diambil": Tombol "Beri Rating" (outline) + foto timbangan (thumbnail)
- **Empty state:** "Belum ada transaksi" + tombol "Cari Pasokan Kertas"

---

## Layar 16 — Admin Dashboard

**File:** `AdminDashboardView.tsx`
**Tab:** Dashboard
**Bottom Nav:** Icon `analytics` aktif

### Konten
- **Header:** "Admin Dashboard" + tanggal hari ini
- **Summary Stats** (grid 2x2 card kecil):
  - Total Kertas Tersalurkan: "**1,240 kg**"
  - Transaksi Aktif: "**8**"
  - Unit Terdaftar: "**14**"
  - Laporan Pending: "**3**" (merah)
- **Grafik Tren** (line chart sederhana):
  - "Volume Penyaluran Kertas" — per minggu/bulan
  - Sumbu X: waktu, Sumbu Y: kg
- **Eco Impact Banner:**
  - Background hijau gradien
  - "Setara **12 pohon** diselamatkan" | "**6,200 liter** air terhemat" | "**1,240 kg** CO2 dikurangi"
- **Matching Aktif** (list card 3 item):
  - Setiap row: nama unit dan nama perusahaan, status, tanggal jadwal
  - Tombol "Lihat Semua"
- **Top 3 Leaderboard** (mini leaderboard card):
  - 3 unit teratas dengan icon mahkota
- **Shortcut aksi cepat:**
  - Tombol "Kelola Unit & Tong" | Tombol "Lihat Laporan (3)"

---

## Layar 17 — Admin: Kelola Unit & Tong

**File:** `AdminUnitTongView.tsx`
**Tab:** Unit & Tong
**Bottom Nav:** Icon `inventory_2` aktif

### Konten
- **Header:** "Kelola Unit & Tong"
- **Tombol "Tambah Unit Baru"** — secondary button di kanan atas
- **Search bar:** "Cari unit kampus..."
- **Daftar Unit Kampus** (accordion/card expandable):
  - Setiap unit card:
    - Header: inisial badge (berwarna), nama unit, jenis (chip: Fakultas/Biro/Prodi)
    - Detail (expandable): PIC, kontak, lokasi
    - **Status Tong:**
      - Nama tong (mis. "FTD No. 1")
      - Status badge: `KOSONG` (abu) / `TERISI` (kuning) / `SIAP PICKUP` (hijau)
      - Berat saat ini / kapasitas
    - Aksi: `Edit` | `Nonaktifkan`
- **Modal Tambah/Edit Unit** (slide-up atau modal):
  - Form: Nama Unit, Jenis, PIC, Kontak, Nama Tong, Nomor Tong, Kapasitas

---

## Layar 18 — Admin: Laporan & Flag

**File:** `AdminLaporanView.tsx`
**Tab:** Laporan & Flag
**Bottom Nav:** Icon `flag` aktif

### Konten
- **Header:** "Laporan & Masalah"
- **Filter Tab:** Menunggu Tindakan | Sudah Selesai | Semua
- **Summary chips:**
  - Kritis: 1 (merah) | Sedang: 2 (kuning) | Selesai: 14 (hijau)
- **Daftar Laporan** (card list):
  - Setiap card:
    - Level badge: `KRITIS` (merah) / `SEDANG` (kuning) / `SELESAI` (hijau)
    - Nama pelapor + tanggal
    - Tong yang dilaporkan (mis. "Tong FTD No. 1")
    - Alasan singkat + detail (truncated, bisa expand)
    - Foto laporan (thumbnail jika ada)
    - Tombol aksi: "Tandai Selesai" (jika belum selesai)
- **Empty state:** "Tidak ada laporan saat ini"

---

## Layar 19 — Profil Mitra Industri (Penerima)

**File:** `PerusahaanProfilView.tsx`
**Tab:** Profil
**Bottom Nav:** Icon `person` aktif

### Konten
- **Header:** "Profil Perusahaan"
- **Info Perusahaan:**
  - Nama Perusahaan, Email, Jenis Perusahaan
- **Pengaturan Alamat:**
  - Alamat Lengkap (Textarea)
  - Kota/Kabupaten, Kode Pos
- **Data Armada & Driver:**
  - Daftar kendaraan operasional (Plat Nomor) & Nama Driver
  - Tombol "Tambah Armada"
- **Tombol "Simpan Perubahan"**

---

## Komponen Global

### Navbar (Top Bar)
- **Fixed** di atas
- Kiri: Logo + nama app "Sampah Butuh Teman" (kecil)
- Kanan: Badge role user (chip: `UNIT` hijau / `MITRA` biru-teal / `ADMIN` ungu) + tombol logout (icon `logout`)
- Background: `white/95` dengan backdrop blur + border bawah tipis

### Bottom Navigation
- **Fixed** di bawah, floating pill (rounded-full)
- Background: `white/95` + backdrop blur + shadow
- **Unit role:** Beranda | Status Tong | Peringkat
- **Perusahaan role:** Pasokan Kertas | Buat Kebutuhan | Riwayat Pickup | Profil
- **Admin role:** Dashboard | Unit & Tong | Laporan & Flag
- Tab aktif: background `#2D6A4F`, teks putih, label muncul, sedikit scale-up
- Tab tidak aktif: hanya icon, teks `#52645A`

### Demo Role Banner
- Banner kuning di bawah Navbar (saat mode demo)
- "Mode Demo — Login sebagai: [Nama Unit/Perusahaan]"
- Tombol ganti role untuk testing

### Toast / Notification
- Muncul di atas, slide down
- Success: background `#D8F3DC`, border hijau, icon `check_circle`
- Error: background `#FDECEA`, border merah terakota, icon `error`
- Auto dismiss 3 detik

---

## Catatan Desain Penting untuk Stitch

1. **Mobile-first:** Desain utama untuk lebar 375–430px. Max-width konten 448px, center di layar lebih lebar.
2. **Hierarki warna:** Gunakan hijau (`#2D6A4F`) hanya untuk elemen paling penting per layar.
3. **Whitespace:** Beri ruang yang cukup antar elemen — tidak sesak.
4. **State empty selalu ada:** Setiap list/feed harus punya ilustrasi empty state yang ramah dan motivatif.
5. **Konsistensi card:** Semua card pakai `rounded-2xl` dengan shadow ringan, tidak ada shadow keras.
6. **Bottom nav clearance:** Konten utama harus punya padding bawah minimal 100px agar tidak tertutup bottom nav.
7. **Bahasa:** Semua teks UI dalam **Bahasa Indonesia**.
8. **Eco-theme:** Gunakan ikon dan elemen visual yang berkaitan dengan alam, daur ulang, dan keberlanjutan.
