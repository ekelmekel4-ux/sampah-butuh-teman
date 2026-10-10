-- =============================================
-- MIGRATION: Sampah Butuh Teman - Full Database
-- Jalankan SQL ini di Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- =============================================

-- 1. PROFILES (User authentication & role)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'unit' CHECK (role IN ('unit', 'perusahaan', 'admin')),
  kontak TEXT,
  unit_id TEXT,
  perusahaan_id TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. UNIT KAMPUS
CREATE TABLE IF NOT EXISTS unit_kampus (
  id TEXT PRIMARY KEY,
  nama_unit TEXT NOT NULL,
  inisial TEXT NOT NULL,
  jenis TEXT NOT NULL DEFAULT 'fakultas' CHECK (jenis IN ('fakultas', 'biro', 'prodi', 'lembaga')),
  lokasi_detail TEXT,
  pic_nama TEXT,
  kontak_pic TEXT,
  tong_id TEXT,
  tong_nama TEXT,
  total_kg_tersalurkan NUMERIC DEFAULT 0,
  eco_points NUMERIC DEFAULT 0,
  saldo NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TONG (Wadah per Unit)
CREATE TABLE IF NOT EXISTS tong (
  id TEXT PRIMARY KEY,
  unit_id TEXT REFERENCES unit_kampus(id) ON DELETE CASCADE,
  unit_nama TEXT,
  nama_tong TEXT NOT NULL,
  nomor TEXT,
  lokasi_spesifik TEXT,
  status TEXT DEFAULT 'kosong' CHECK (status IN ('kosong', 'terisi', 'siap_pickup')),
  berat_kg NUMERIC DEFAULT 0,
  kapasitas_max_kg NUMERIC DEFAULT 120,
  tipe_kertas TEXT,
  jadwal_pickup TEXT,
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LISTING KERTAS
CREATE TABLE IF NOT EXISTS listing_kertas (
  id TEXT PRIMARY KEY,
  unit_id TEXT REFERENCES unit_kampus(id) ON DELETE CASCADE,
  unit_nama TEXT,
  tong_id TEXT REFERENCES tong(id) ON DELETE SET NULL,
  tong_nama TEXT,
  jumlah_kg NUMERIC NOT NULL DEFAULT 0,
  kategori TEXT NOT NULL DEFAULT 'campur' CHECK (kategori IN ('hvs', 'kardus', 'koran', 'campur')),
  kategori_label TEXT,
  kondisi TEXT[] DEFAULT '{}',
  foto TEXT,
  status TEXT DEFAULT 'menunggu_mitra' CHECK (status IN ('menunggu_mitra', 'siap_pickup', 'sudah_diambil')),
  tanggal_post TEXT,
  matching_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PERMINTAAN KERTAS
CREATE TABLE IF NOT EXISTS permintaan_kertas (
  id TEXT PRIMARY KEY,
  perusahaan_id TEXT,
  perusahaan_nama TEXT,
  jenis_kertas TEXT[] DEFAULT '{}',
  jumlah_kg NUMERIC NOT NULL DEFAULT 0,
  toleransi_kadar_air NUMERIC DEFAULT 0,
  syarat_qc TEXT[] DEFAULT '{}',
  hari_pickup TEXT[] DEFAULT '{}',
  waktu_operasional TEXT,
  estimasi_dana_riset NUMERIC DEFAULT 0,
  estimasi_eco_points NUMERIC DEFAULT 0,
  status_aktif BOOLEAN DEFAULT true,
  tanggal_dibuat TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MATCHING TRANSAKSI
CREATE TABLE IF NOT EXISTS matching_transaksi (
  id TEXT PRIMARY KEY,
  listing_kertas_id TEXT,
  permintaan_id TEXT,
  unit_id TEXT,
  unit_nama TEXT,
  tong_id TEXT,
  tong_nama TEXT,
  perusahaan_id TEXT,
  perusahaan_nama TEXT,
  jenis_kertas TEXT,
  jumlah_kg NUMERIC NOT NULL DEFAULT 0,
  nilai_rupiah NUMERIC DEFAULT 0,
  eco_points NUMERIC DEFAULT 0,
  skor_kecocokan NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'menunggu_diambil' CHECK (status IN ('menunggu_diambil', 'sudah_diambil')),
  nopol_armada TEXT,
  driver_nama TEXT,
  tanggal_jemput TEXT,
  jam_jemput TEXT,
  surat_jalan_kode TEXT,
  tanggal_selesai TEXT,
  rating NUMERIC,
  komentar TEXT,
  foto_timbangan TEXT,
  foto_struk TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. LAPORAN MASALAH
CREATE TABLE IF NOT EXISTS laporan_masalah (
  id TEXT PRIMARY KEY,
  listing_kertas_id TEXT,
  matching_id TEXT,
  tong_id TEXT,
  tong_nama TEXT,
  unit_nama TEXT,
  pelapor_id TEXT,
  pelapor_nama TEXT,
  alasan TEXT,
  detail TEXT,
  level TEXT DEFAULT 'sedang' CHECK (level IN ('kritis', 'sedang', 'selesai')),
  foto TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'menunggu_tindakan' CHECK (status IN ('menunggu_tindakan', 'sudah_selesai')),
  tanggal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SALDO (Sistem Pembayaran)
CREATE TABLE IF NOT EXISTS saldo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL,
  owner_type TEXT NOT NULL CHECK (owner_type IN ('unit', 'perusahaan')),
  owner_nama TEXT NOT NULL,
  jumlah NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. RIWAYAT PEMBAYARAN
CREATE TABLE IF NOT EXISTS riwayat_pembayaran (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matching_transaksi_id TEXT,
  dari_id TEXT,
  dari_nama TEXT,
  ke_id TEXT,
  ke_nama TEXT,
  jumlah NUMERIC NOT NULL DEFAULT 0,
  jenis TEXT DEFAULT 'pembayaran_kertas' CHECK (jenis IN ('pembayaran_kertas', 'penarikan', 'topup')),
  status TEXT DEFAULT 'berhasil' CHECK (status IN ('menunggu', 'berhasil', 'gagal')),
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DISABLE RLS (untuk demo PjBL / MVP)
-- Aktifkan RLS untuk production!
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_kampus ENABLE ROW LEVEL SECURITY;
ALTER TABLE tong ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_kertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE permintaan_kertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE laporan_masalah ENABLE ROW LEVEL SECURITY;
ALTER TABLE saldo ENABLE ROW LEVEL SECURITY;
ALTER TABLE riwayat_pembayaran ENABLE ROW LEVEL SECURITY;

-- Permissive policies (allow all for demo)
CREATE POLICY "Allow all on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on unit_kampus" ON unit_kampus FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on tong" ON tong FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on listing_kertas" ON listing_kertas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on permintaan_kertas" ON permintaan_kertas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on matching_transaksi" ON matching_transaksi FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on laporan_masalah" ON laporan_masalah FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on saldo" ON saldo FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on riwayat_pembayaran" ON riwayat_pembayaran FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- SEED DATA: Data awal untuk demo
-- =============================================

-- SEED: Profiles (Demo Users)
INSERT INTO profiles (id, nama, email, password_hash, role, kontak, unit_id, perusahaan_id, avatar_url) VALUES
  ('user-unit-ftd', 'Dr. Ir. Hendra Saputra, M.T.', 'penyalur@ft.univ.ac.id', 'demo1234', 'unit', '081234567890', 'unit-ftd', NULL, '/logo-sbt.png'),
  ('user-perusahaan-mdl', 'Pak Joko Susilo (Dispatcher)', 'logistik@daurlestari.co.id', 'demo1234', 'perusahaan', '081987654321', NULL, 'perusahaan-mdl', '/logo-sbt.png'),
  ('user-admin-pusat', 'Siti Rahmawati, S.T. (Admin Drop Point)', 'admin.kampushijau@univ.ac.id', 'demo1234', 'admin', '081122334455', NULL, NULL, '/logo-sbt.png')
ON CONFLICT (id) DO NOTHING;

-- SEED: Unit Kampus
INSERT INTO unit_kampus (id, nama_unit, inisial, jenis, lokasi_detail, pic_nama, kontak_pic, tong_id, tong_nama, total_kg_tersalurkan, eco_points, saldo) VALUES
  ('unit-ftd', 'Fakultas Teknik & Desain (FTD)', 'FTD', 'fakultas', 'Gedung B Lt. 2, Biro Administrasi & Inventaris Ruang 204', 'Dr. Ir. Hendra Saputra, M.T.', '081234567890', 'tong-ftd-1', 'Tong FTD No. 1 (Slot FTD 1-5)', 0, 0, 0),
  ('unit-feb', 'Fakultas Ekonomi & Bisnis (FEB)', 'FEB', 'fakultas', 'Selasar Barat Gedung FEB Lt. 1', 'Ibu Ratna Kumala, S.E.', '081398765432', 'tong-feb-1', 'Tong FEB No. 1 (Slot FEB 1-5)', 485, 970, 727500),
  ('unit-fikom', 'Fakultas Ilmu Komunikasi (FIKom)', 'FIKom', 'fakultas', 'Gedung C Lt. 1 Ruang Sekprodi', 'Ibu Annisa Pratiwi, M.I.Kom', '081822334455', 'tong-fikom-1', 'Tong FIKom No. 1 (Slot FIKom 1-5)', 210, 420, 315000),
  ('unit-baa', 'Biro Administrasi Akademik (BAA)', 'BAA', 'biro', 'Gedung Pusat Rektorat Sayap Timur', 'Bpk. Bambang Sutrisno', '081512345678', 'tong-baa-1', 'Tong BAA No. 1 (Slot BAA 1-5)', 390, 780, 585000),
  ('unit-fk', 'Fakultas Kedokteran & Kesehatan (FK)', 'FK', 'fakultas', 'Gedung Anatomi Lantai 2', 'dr. Wahyu Pratama, Sp.A', '081299887766', 'tong-fk-1', 'Tong FK No. 1', 280, 560, 420000),
  ('unit-fasilkom', 'Fakultas Ilmu Komputer (FASILKOM)', 'FASILKOM', 'fakultas', 'Gedung Lab Komputer Lt. 3', 'Ahmad Faisal, M.Kom', '081377665544', 'tong-fasilkom-1', 'Tong FASILKOM No. 1', 195, 390, 292500),
  ('unit-perpus', 'Perpustakaan Pusat Kampus', 'PERPUS', 'biro', 'Gedung Perpustakaan Utama Lt. 1', 'Siti Aminah, S.Sos', '081544332211', 'tong-perpus-1', 'Tong PERPUS No. 1', 145, 290, 217500),
  ('unit-lppm', 'Lembaga Riset & Pengabdian (LPPM)', 'LPPM', 'biro', 'Gedung Riset Terpadu Lt. 2', 'Prof. Dr. Ir. Gunawan', '081622334455', 'tong-lppm-1', 'Tong LPPM No. 1', 90, 180, 135000)
ON CONFLICT (id) DO NOTHING;

-- SEED: Tong
INSERT INTO tong (id, unit_id, unit_nama, nama_tong, nomor, lokasi_spesifik, status, berat_kg, kapasitas_max_kg, tipe_kertas, jadwal_pickup, catatan) VALUES
  -- FTD (5 tong)
  ('tong-ftd-1', 'unit-ftd', 'Fakultas Teknik & Desain', 'Tong FTD No. 1', 'FTD-01', 'Gedung Serbaguna - Sayap Barat • Baris 1 Kotak 1', 'kosong', 0, 120, 'Standby Siap Diisi', NULL, 'Wadah resmi standby siap menerima setoran kertas unit (min. 10 Kg)'),
  ('tong-ftd-2', 'unit-ftd', 'Fakultas Teknik & Desain', 'Tong FTD No. 2', 'FTD-02', 'Gedung Serbaguna - Sayap Barat • Baris 1 Kotak 2', 'kosong', 0, 120, 'Standby Siap Diisi', NULL, 'Slot kosong standby penyaluran cadangan'),
  ('tong-ftd-3', 'unit-ftd', 'Fakultas Teknik & Desain', 'Tong FTD No. 3', 'FTD-03', 'Gedung Serbaguna - Sayap Barat • Baris 1 Kotak 3', 'kosong', 0, 120, 'Standby Siap Diisi', NULL, 'Slot kosong standby penyaluran cadangan'),
  ('tong-ftd-4', 'unit-ftd', 'Fakultas Teknik & Desain', 'Tong FTD No. 4', 'FTD-04', 'Gedung Serbaguna - Sayap Barat • Baris 1 Kotak 4', 'kosong', 0, 120, 'Standby Siap Diisi', NULL, 'Slot kosong standby penyaluran cadangan'),
  ('tong-ftd-5', 'unit-ftd', 'Fakultas Teknik & Desain', 'Tong FTD No. 5', 'FTD-05', 'Gedung Serbaguna - Sayap Barat • Baris 1 Kotak 5', 'kosong', 0, 120, 'Standby Siap Diisi', NULL, 'Slot kosong standby penyaluran cadangan'),
  -- FEB (5 tong)
  ('tong-feb-1', 'unit-feb', 'Fakultas Ekonomi & Bisnis', 'Tong FEB No. 1', 'FEB-01', 'Gedung Serbaguna - Sayap Barat • Baris 2 Kotak 1', 'terisi', 45, 120, 'Kertas HVS / Arsip', NULL, '45 Kg HVS dokumen bersih siap jemput'),
  ('tong-feb-2', 'unit-feb', 'Fakultas Ekonomi & Bisnis', 'Tong FEB No. 2', 'FEB-02', 'Gedung Serbaguna - Sayap Barat • Baris 2 Kotak 2', 'terisi', 20, 120, 'Kardus Box Corrugated', NULL, '20 Kg kemasan karton akuntansi dilipat rapi'),
  ('tong-feb-3', 'unit-feb', 'Fakultas Ekonomi & Bisnis', 'Tong FEB No. 3', 'FEB-03', 'Gedung Serbaguna - Sayap Barat • Baris 2 Kotak 3', 'kosong', 0, 120, 'Standby Siap Diisi', NULL, 'Slot kosong standby penyaluran cadangan'),
  ('tong-feb-4', 'unit-feb', 'Fakultas Ekonomi & Bisnis', 'Tong FEB No. 4', 'FEB-04', 'Gedung Serbaguna - Sayap Barat • Baris 2 Kotak 4', 'kosong', 0, 120, 'Standby Siap Diisi', NULL, 'Slot kosong standby penyaluran cadangan'),
  ('tong-feb-5', 'unit-feb', 'Fakultas Ekonomi & Bisnis', 'Tong FEB No. 5', 'FEB-05', 'Gedung Serbaguna - Sayap Barat • Baris 2 Kotak 5', 'kosong', 0, 120, 'Standby Siap Diisi', NULL, 'Slot kosong standby penyaluran cadangan'),
  -- FIKom (5 tong)
  ('tong-fikom-1', 'unit-fikom', 'Fakultas Ilmu Komunikasi', 'Tong FIKom No. 1', 'FIKOM-01', 'Gedung Serbaguna - Sayap Timur • Baris 3 Kotak 1', 'terisi', 35, 120, 'Majalah & Pamflet Kampus', NULL, '35 Kg majalah edisi lama & pamflet pameran'),
  ('tong-fikom-2', 'unit-fikom', 'Fakultas Ilmu Komunikasi', 'Tong FIKom No. 2', 'FIKOM-02', 'Gedung Serbaguna - Sayap Timur • Baris 3 Kotak 2', 'kosong', 0, 120, 'Standby Siap Diisi', NULL, 'Slot kosong standby penyaluran cadangan'),
  ('tong-fikom-3', 'unit-fikom', 'Fakultas Ilmu Komunikasi', 'Tong FIKom No. 3', 'FIKOM-03', 'Gedung Serbaguna - Sayap Timur • Baris 3 Kotak 3', 'kosong', 0, 120, 'Standby Siap Diisi', NULL, 'Slot kosong standby penyaluran cadangan'),
  ('tong-fikom-4', 'unit-fikom', 'Fakultas Ilmu Komunikasi', 'Tong FIKom No. 4', 'FIKOM-04', 'Gedung Serbaguna - Sayap Timur • Baris 3 Kotak 4', 'kosong', 0, 120, 'Standby Siap Diisi', NULL, 'Slot kosong standby penyaluran cadangan'),
  ('tong-fikom-5', 'unit-fikom', 'Fakultas Ilmu Komunikasi', 'Tong FIKom No. 5', 'FIKOM-05', 'Gedung Serbaguna - Sayap Timur • Baris 3 Kotak 5', 'kosong', 0, 120, 'Standby Siap Diisi', NULL, 'Slot kosong standby penyaluran cadangan'),
  -- BAA (5 tong)
  ('tong-baa-1', 'unit-baa', 'Biro Administrasi Akademik', 'Tong BAA No. 1', 'BAA-01', 'Gedung Serbaguna - Sayap Utara • Baris 4 Kotak 1', 'terisi', 120, 120, 'Kardus Box Corrugated (PENUH)', 'Hari ini, 16:00 WIB', '120 Kg Kardus Tebal siap angkut armada mitra'),
  ('tong-baa-2', 'unit-baa', 'Biro Administrasi Akademik', 'Tong BAA No. 2', 'BAA-02', 'Gedung Serbaguna - Sayap Utara • Baris 4 Kotak 2', 'terisi', 25, 120, 'Kertas Formulir Arsip', NULL, '25 Kg arsip formulir lama terikat rapi'),
  ('tong-baa-3', 'unit-baa', 'Biro Administrasi Akademik', 'Tong BAA No. 3', 'BAA-03', 'Gedung Serbaguna - Sayap Utara • Baris 4 Kotak 3', 'kosong', 0, 120, 'Standby Siap Diisi', NULL, 'Slot kosong standby penyaluran cadangan'),
  ('tong-baa-4', 'unit-baa', 'Biro Administrasi Akademik', 'Tong BAA No. 4', 'BAA-04', 'Gedung Serbaguna - Sayap Utara • Baris 4 Kotak 4', 'kosong', 0, 120, 'Standby Siap Diisi', NULL, 'Slot kosong standby penyaluran cadangan'),
  ('tong-baa-5', 'unit-baa', 'Biro Administrasi Akademik', 'Tong BAA No. 5', 'BAA-05', 'Gedung Serbaguna - Sayap Utara • Baris 4 Kotak 5', 'kosong', 0, 120, 'Standby Siap Diisi', NULL, 'Slot kosong standby penyaluran cadangan'),
  -- FK, FASILKOM, PERPUS, LPPM (1 tong each)
  ('tong-fk-1', 'unit-fk', 'Fakultas Kedokteran & Kesehatan', 'Tong FK No. 1', 'FK-01', 'Gedung Serbaguna - Sayap Timur • Baris 5 Kotak 1', 'terisi', 40, 120, 'Arsip Rekam Medis Kering', NULL, '40 Kg arsip berkas seminar kesehatan'),
  ('tong-fasilkom-1', 'unit-fasilkom', 'Fakultas Ilmu Komputer', 'Tong FASILKOM No. 1', 'FASILKOM-01', 'Gedung Serbaguna - Sayap Timur • Baris 5 Kotak 2', 'terisi', 25, 120, 'Kertas HVS & Laporan Praktikum', NULL, '25 Kg bundel skripsi dan laporan'),
  ('tong-perpus-1', 'unit-perpus', 'Perpustakaan Pusat Kampus', 'Tong PERPUS No. 1', 'PERPUS-01', 'Gedung Serbaguna - Sayap Selatan • Baris 5 Kotak 3', 'terisi', 50, 120, 'Koran & Majalah Lama', NULL, '50 Kg koran retur & majalah terbitan lama'),
  ('tong-lppm-1', 'unit-lppm', 'Lembaga Riset & Pengabdian (LPPM)', 'Tong LPPM No. 1', 'LPPM-01', 'Gedung Serbaguna - Sayap Selatan • Baris 5 Kotak 4', 'kosong', 0, 120, 'Standby Siap Diisi', NULL, 'Slot kosong standby penyaluran proposal riset')
ON CONFLICT (id) DO NOTHING;

-- SEED: Listing Kertas
INSERT INTO listing_kertas (id, unit_id, unit_nama, tong_id, tong_nama, jumlah_kg, kategori, kategori_label, kondisi, foto, status, tanggal_post, matching_id) VALUES
  ('list-baa-01', 'unit-baa', 'Biro Administrasi Akademik (BAA)', 'tong-baa-1', 'Tong BAA No. 1 & 2', 55, 'kardus', 'Kardus Box Corrugated Tebal', ARRAY['Kering & bebas minyak', 'Karton dilipat gepeng & diikat tali'], 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpMDjLNhyE5tFuddhterSSd_DLlHeL8Eb0lQqxIm5PpCmXjHNQypJDlPAMqtCDcB0ATyO3YLxVgnPKjncpqWzPTa61rAw6ilSlq4Tl6Xf89eCKkElOv_KdyNHnmS1TEU7q_V1kUTMH75t-_w2qgIhe24CaXl78VBfrH4zMEw_CtGeZMXr4bSQKx-AGI0jhgyK1c7WFuqZ7WPm5GhnBjGl9V_UeoJVI22ECvGCUN0mezS0u9_lT_O1sBQ', 'siap_pickup', 'Kemarin, 16:00 WIB', NULL)
ON CONFLICT (id) DO NOTHING;

-- SEED: Permintaan Kertas
INSERT INTO permintaan_kertas (id, perusahaan_id, perusahaan_nama, jenis_kertas, jumlah_kg, toleransi_kadar_air, syarat_qc, hari_pickup, waktu_operasional, estimasi_dana_riset, estimasi_eco_points, status_aktif, tanggal_dibuat) VALUES
  ('req-mdl-01', 'perusahaan-mdl', 'PT Mandiri Daur Lestari', ARRAY['HVS / Arsip', 'Kardus Box Corrugated'], 100, 12, ARRAY['Kertas sudah terikat rapi per tumpukan', 'Bebas kotoran minyak, cairan, & sisa makanan', 'Bebas klip kawat tebal & lakban jilid plastik'], ARRAY['Senin', 'Selasa', 'Rabu', 'Kamis'], '13:00 - 16:00 WIB', 150000, 200, true, '24 Okt 2024')
ON CONFLICT (id) DO NOTHING;

-- SEED: Matching Transaksi
INSERT INTO matching_transaksi (id, listing_kertas_id, permintaan_id, unit_id, unit_nama, tong_id, tong_nama, perusahaan_id, perusahaan_nama, jenis_kertas, jumlah_kg, nilai_rupiah, eco_points, skor_kecocokan, status, nopol_armada, driver_nama, tanggal_jemput, jam_jemput, surat_jalan_kode, tanggal_selesai, rating, komentar, foto_timbangan, foto_struk) VALUES
  ('trx-2024-1024', 'list-ftd-01', 'req-mdl-01', 'unit-ftd', 'Fakultas Teknik & Desain (FTD)', 'tong-ftd-1', 'Tong FTD No. 1', 'perusahaan-mdl', 'PT Mandiri Daur Lestari', '60 Kg HVS Putih (Kering 70-80 gsm)', 60, 90000, 120, 98, 'menunggu_diambil', 'B 9821 PQL', 'Pak Joko Susilo', 'Kamis, 24 Oktober 2024', '14:30 WIB', '#SJ-2024-1024-FTD1', NULL, NULL, NULL, NULL, NULL),
  ('trx-2024-1018', 'list-prev-02', NULL, 'unit-baa', 'Biro Administrasi Akademik (BAA)', 'tong-baa-1', 'Tong BAA No. 2', 'perusahaan-mdl', 'PT Mandiri Daur Lestari', '55 Kg Kardus Box Tebal Double-Wall', 55, 82500, 110, 92, 'sudah_diambil', 'B 9821 PQL', 'Pak Joko Susilo', '18 Okt 2024', '15:10 WIB', '#SJ-2024-1018-BAA2', '18 Okt, 15:10 WIB', 5.0, 'Kardus sangat rapi & bebas kontaminan.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpMDjLNhyE5tFuddhterSSd_DLlHeL8Eb0lQqxIm5PpCmXjHNQypJDlPAMqtCDcB0ATyO3YLxVgnPKjncpqWzPTa61rAw6ilSlq4Tl6Xf89eCKkElOv_KdyNHnmS1TEU7q_V1kUTMH75t-_w2qgIhe24CaXl78VBfrH4zMEw_CtGeZMXr4bSQKx-AGI0jhgyK1c7WFuqZ7WPm5GhnBjGl9V_UeoJVI22ECvGCUN0mezS0u9_lT_O1sBQ', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpB1iJs3KW51EVCKrYLKaiooV8Bs7AWkfYVcrB0NcCWpn-OJPyDGryqtg38DBJL8utmg69q6KkgFkIE_b32hxfQPQlacYQCcLqBCaSwlSL6Wjd0wFtiEcB0Qw_z0gv0KXAm01cyBrAGmafazKbg1DsZue4KuePncEq87DpyQQq2E7H5LZlpOLc1W-kDmURnBBgmDZwOljDb8epfkTuAKQay4BlDZvf682C5qAq4A5GmGqK6Dr1fek6gg'),
  ('trx-2024-1011', 'list-prev-03', NULL, 'unit-feb', 'Fakultas Ekonomi & Bisnis (FEB)', 'tong-feb-1', 'Tong FEB No. 1', 'perusahaan-mdl', 'PT Mandiri Daur Lestari', '80 Kg Kertas Arsip & Buku Bekas', 80, 120000, 160, 95, 'sudah_diambil', NULL, NULL, NULL, NULL, NULL, '11 Okt, 14:00 WIB', 4.8, 'Batch sortir B-3 terkonfirmasi sangat baik.', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- SEED: Laporan Masalah
INSERT INTO laporan_masalah (id, tong_nama, unit_nama, pelapor_id, pelapor_nama, alasan, detail, level, foto, status, tanggal) VALUES
  ('flag-08', 'Tong Cadangan Rektorat Lt. 1', 'Gedung Pusat Rektorat', 'user-perusahaan-mdl', 'Pak Joko (Driver PT Mandiri Daur)', 'Kontaminasi Basah / Minyak', 'Terdapat 2 kantong kertas tercampur sedotan & tumpahan kopi di dalam wadah kardus, berisiko merusak seluruh muatan arsip kering lainnya.', 'kritis', ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuCY4uGvil61yN9HONFwgAh-52jvV3VHJu8_xJ-GoXNbiOYJA5oNvyV-_R7QJDO8ml-akknWzHAhlAbTY1QZyEaRkZiBlrBaNr_9unCpFtJvi_VzEladBx4EPprHeQfYqBVVrGdEbm-JcfEamc3aSyNNFLGiwzHXs92NGujm4EMUNgBoifevgLrxrlOZ-MsWVRIXXHRusI1lIdsl7wOwlPKYGux__0hQbi2ehMrDpY7Vi2bbOb9AH0cdAA', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZcTVyJ_eOctEGLBGnLWbTuaSPz0n80IRvOH8oMJ7EJksC0ZvEeril66R2EcuxUo9QLPhD0zwY0_oErwzndwD-skv0dk43bPhcwhp3k5UVAunmT__umzMzUWWHWMTcn505OdCk5i1A6owuH98dsd84s5oGsqKfjZKLnOJaBOL0VChsNhH30CeZyqwd6-vS0cAps8dh_LPie_KA6CYSEIvMulbNtWLHSDypJMRdvZu8M44ecU5PkoKNVw'], 'menunggu_tindakan', '18 mnt lalu'),
  ('flag-07', 'Tong FIKom No. 1', 'Fakultas Ilmu Komunikasi (FIKom)', 'user-admin-pusat', 'Bpk. Suwardi (Petugas GSG Drop Point)', 'Kardus Belum Dilipat & Belum Diikat Tali', 'Tumpukan 14 kardus karton tidak di-press. Sudah dirapikan dan diikat tali oleh tim operasional relawan.', 'selesai', '{}', 'sudah_selesai', '2 jam lalu')
ON CONFLICT (id) DO NOTHING;

-- SEED: Saldo awal untuk unit yang sudah ada transaksi
INSERT INTO saldo (owner_id, owner_type, owner_nama, jumlah) VALUES
  ('unit-feb', 'unit', 'Fakultas Ekonomi & Bisnis (FEB)', 120000),
  ('unit-baa', 'unit', 'Biro Administrasi Akademik (BAA)', 82500),
  ('perusahaan-mdl', 'perusahaan', 'PT Mandiri Daur Lestari', 0)
ON CONFLICT DO NOTHING;

-- SEED: Riwayat Pembayaran dari transaksi yang sudah selesai
INSERT INTO riwayat_pembayaran (matching_transaksi_id, dari_id, dari_nama, ke_id, ke_nama, jumlah, jenis, status, catatan) VALUES
  ('trx-2024-1018', 'perusahaan-mdl', 'PT Mandiri Daur Lestari', 'unit-baa', 'Biro Administrasi Akademik (BAA)', 82500, 'pembayaran_kertas', 'berhasil', 'Pembayaran otomatis - 55 Kg Kardus Box Tebal Double-Wall'),
  ('trx-2024-1011', 'perusahaan-mdl', 'PT Mandiri Daur Lestari', 'unit-feb', 'Fakultas Ekonomi & Bisnis (FEB)', 120000, 'pembayaran_kertas', 'berhasil', 'Pembayaran otomatis - 80 Kg Kertas Arsip & Buku Bekas');
