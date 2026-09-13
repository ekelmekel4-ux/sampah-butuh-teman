import { UnitKampus, Tong, ListingKertas, PermintaanKertas, MatchingTransaksi, LaporanMasalah, User } from '../types';

export const APP_BRAND = {
  name: 'Sampah Butuh Teman',
  tagline: 'Sampah yang menemukan temannya.',
  subtitle: 'Platform Sirkular Sampah Kertas Terintegrasi Kampus',
  logoUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1UabS9bvIkz4USj6H8_38592dgm7VlaHnGmKVCLCEjyIkW8r9y9eZz3VTvF6bdUPziVvTOeZP0-eKIT-XAylnmQx66K-jPbaRHMJmB27E_9WvRZ2xo6p5ofL-K6U2L1zrMx4pnr6s724W_U_C9D3szvvSUww1eXx3nBQSn3xL-lZqYxhr0q-xkm-xuWHIjhq9zZrAE0a1fq2RPZU-2lS_JduADCycIPTUN7uWYbNk__ZJmmtW6Q_9PtOyw',
  avatarUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WEdLkpj-nbbsYLqTeFwXcCLRWXKdvaza1OMw6UhmH2URuL2NTCUYOT-46cAsaKyJuyPwbKknYEaudeC09DqrtQipL2uvFR4eco58s1auK2nKA_pVzKksfTJgyM3X2UmTASUs73cL2qsTjZejtJXKDCKRH5bOFa2ccaV_hjW7Eb7RYu5ozEhOVbS2v0ohmiYFWIrnNtX7WMxKmxrgqk2I2ubIEy7EkuQuslKH9iZjOIG4jOFtn1hZM_NoBY',
  dropPointUtama: {
    nama: 'Drop Point Gedung Serbaguna Kampus Hijau',
    lokasiSingkat: 'Gedung Serbaguna Kampus (Sayap Barat)',
    deskripsi: 'Sentra logistik tunggal kampus terpusat berisi tong bernomor per unit. Dilengkapi ramp truk 6-roda & timbangan digital.',
    mapImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmviIiiVahgnvhO_El-huson9J5-9mLv6s0NQKjrLHCL5_VDkgxtYr-uWRy1XeDI3jI0NEmhvp80WPZYTmS4b7171z821fB_qByVHWOM6pE5LBP4bXbyCFeYnW0hvwAFNRCwn5pODD6p-aBUrM4ZvGEmaVYFRamzn0-FqR7i8-LkRYKr2sraGUSuU_CrVENPUpymUBvnY5IR9CRbhV4B3Do5vyR20weTyWCYQC848V84BjAmHKzQio1A'
  }
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user-unit-ftd',
    nama: 'Dr. Ir. Hendra Saputra, M.T.',
    email: 'penyalur@ft.univ.ac.id',
    role: 'unit',
    kontak: '081234567890',
    unit_id: 'unit-ftd',
    avatar_url: APP_BRAND.avatarUrl
  },
  {
    id: 'user-perusahaan-mdl',
    nama: 'Pak Joko Susilo (Dispatcher)',
    email: 'logistik@daurlestari.co.id',
    role: 'perusahaan',
    kontak: '081987654321',
    perusahaan_id: 'perusahaan-mdl',
    avatar_url: APP_BRAND.avatarUrl
  },
  {
    id: 'user-admin-pusat',
    nama: 'Siti Rahmawati, S.T. (Admin Drop Point)',
    email: 'admin.kampushijau@univ.ac.id',
    role: 'admin',
    kontak: '081122334455',
    avatar_url: APP_BRAND.avatarUrl
  }
];

export const INITIAL_UNITS: UnitKampus[] = [
  {
    id: 'unit-ftd',
    nama_unit: 'Fakultas Teknik & Desain (FTD)',
    inisial: 'FTD',
    jenis: 'fakultas',
    lokasi_detail: 'Gedung B Lt. 2, Biro Administrasi & Inventaris Ruang 204',
    pic_nama: 'Dr. Ir. Hendra Saputra, M.T.',
    kontak_pic: '081234567890',
    tong_id: 'tong-ftd-1',
    tong_nama: 'Tong FTD No. 1 (Slot FTD 1-5)',
    total_kg_tersalurkan: 0,
    eco_points: 0
  },
  {
    id: 'unit-feb',
    nama_unit: 'Fakultas Ekonomi & Bisnis (FEB)',
    inisial: 'FEB',
    jenis: 'fakultas',
    lokasi_detail: 'Selasar Barat Gedung FEB Lt. 1',
    pic_nama: 'Ibu Ratna Kumala, S.E.',
    kontak_pic: '081398765432',
    tong_id: 'tong-feb-1',
    tong_nama: 'Tong FEB No. 1 (Slot FEB 1-5)',
    total_kg_tersalurkan: 485,
    eco_points: 970
  },
  {
    id: 'unit-fikom',
    nama_unit: 'Fakultas Ilmu Komunikasi (FIKom)',
    inisial: 'FIKom',
    jenis: 'fakultas',
    lokasi_detail: 'Gedung C Lt. 1 Ruang Sekprodi',
    pic_nama: 'Ibu Annisa Pratiwi, M.I.Kom',
    kontak_pic: '081822334455',
    tong_id: 'tong-fikom-1',
    tong_nama: 'Tong FIKom No. 1 (Slot FIKom 1-5)',
    total_kg_tersalurkan: 210,
    eco_points: 420
  },
  {
    id: 'unit-baa',
    nama_unit: 'Biro Administrasi Akademik (BAA)',
    inisial: 'BAA',
    jenis: 'biro',
    lokasi_detail: 'Gedung Pusat Rektorat Sayap Timur',
    pic_nama: 'Bpk. Bambang Sutrisno',
    kontak_pic: '081512345678',
    tong_id: 'tong-baa-1',
    tong_nama: 'Tong BAA No. 1 (Slot BAA 1-5)',
    total_kg_tersalurkan: 390,
    eco_points: 780
  },
  {
    id: 'unit-fk',
    nama_unit: 'Fakultas Kedokteran & Kesehatan (FK)',
    inisial: 'FK',
    jenis: 'fakultas',
    lokasi_detail: 'Gedung Anatomi Lantai 2',
    pic_nama: 'dr. Wahyu Pratama, Sp.A',
    kontak_pic: '081299887766',
    tong_id: 'tong-fk-1',
    tong_nama: 'Tong FK No. 1',
    total_kg_tersalurkan: 280,
    eco_points: 560
  },
  {
    id: 'unit-fasilkom',
    nama_unit: 'Fakultas Ilmu Komputer (FASILKOM)',
    inisial: 'FASILKOM',
    jenis: 'fakultas',
    lokasi_detail: 'Gedung Lab Komputer Lt. 3',
    pic_nama: 'Ahmad Faisal, M.Kom',
    kontak_pic: '081377665544',
    tong_id: 'tong-fasilkom-1',
    tong_nama: 'Tong FASILKOM No. 1',
    total_kg_tersalurkan: 195,
    eco_points: 390
  },
  {
    id: 'unit-perpus',
    nama_unit: 'Perpustakaan Pusat Kampus',
    inisial: 'PERPUS',
    jenis: 'biro',
    lokasi_detail: 'Gedung Perpustakaan Utama Lt. 1',
    pic_nama: 'Siti Aminah, S.Sos',
    kontak_pic: '081544332211',
    tong_id: 'tong-perpus-1',
    tong_nama: 'Tong PERPUS No. 1',
    total_kg_tersalurkan: 145,
    eco_points: 290
  },
  {
    id: 'unit-lppm',
    nama_unit: 'Lembaga Riset & Pengabdian (LPPM)',
    inisial: 'LPPM',
    jenis: 'biro',
    lokasi_detail: 'Gedung Riset Terpadu Lt. 2',
    pic_nama: 'Prof. Dr. Ir. Gunawan',
    kontak_pic: '081622334455',
    tong_id: 'tong-lppm-1',
    tong_nama: 'Tong LPPM No. 1',
    total_kg_tersalurkan: 90,
    eco_points: 180
  }
];

export const INITIAL_TONG: Tong[] = [
  // BARIS 1: FAKULTAS TEKNIK & DESAIN (FTD) — TONG 1 S/D 5
  {
    id: 'tong-ftd-1',
    unit_id: 'unit-ftd',
    unit_nama: 'Fakultas Teknik & Desain',
    nama_tong: 'Tong FTD No. 1',
    nomor: 'FTD-01',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Barat • Baris 1 Kotak 1',
    status: 'kosong',
    berat_kg: 0,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Standby Siap Diisi',
    catatan: 'Wadah resmi standby siap menerima setoran kertas unit (min. 10 Kg)'
  },
  {
    id: 'tong-ftd-2',
    unit_id: 'unit-ftd',
    unit_nama: 'Fakultas Teknik & Desain',
    nama_tong: 'Tong FTD No. 2',
    nomor: 'FTD-02',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Barat • Baris 1 Kotak 2',
    status: 'kosong',
    berat_kg: 0,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Standby Siap Diisi',
    catatan: 'Slot kosong standby penyaluran cadangan'
  },
  {
    id: 'tong-ftd-3',
    unit_id: 'unit-ftd',
    unit_nama: 'Fakultas Teknik & Desain',
    nama_tong: 'Tong FTD No. 3',
    nomor: 'FTD-03',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Barat • Baris 1 Kotak 3',
    status: 'kosong',
    berat_kg: 0,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Standby Siap Diisi',
    catatan: 'Slot kosong standby penyaluran cadangan'
  },
  {
    id: 'tong-ftd-4',
    unit_id: 'unit-ftd',
    unit_nama: 'Fakultas Teknik & Desain',
    nama_tong: 'Tong FTD No. 4',
    nomor: 'FTD-04',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Barat • Baris 1 Kotak 4',
    status: 'kosong',
    berat_kg: 0,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Standby Siap Diisi',
    catatan: 'Slot kosong standby penyaluran cadangan'
  },
  {
    id: 'tong-ftd-5',
    unit_id: 'unit-ftd',
    unit_nama: 'Fakultas Teknik & Desain',
    nama_tong: 'Tong FTD No. 5',
    nomor: 'FTD-05',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Barat • Baris 1 Kotak 5',
    status: 'kosong',
    berat_kg: 0,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Standby Siap Diisi',
    catatan: 'Slot kosong standby penyaluran cadangan'
  },

  // BARIS 2: FAKULTAS EKONOMI & BISNIS (FEB) — TONG 1 S/D 5
  {
    id: 'tong-feb-1',
    unit_id: 'unit-feb',
    unit_nama: 'Fakultas Ekonomi & Bisnis',
    nama_tong: 'Tong FEB No. 1',
    nomor: 'FEB-01',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Barat • Baris 2 Kotak 1',
    status: 'terisi',
    berat_kg: 45,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Kertas HVS / Arsip',
    catatan: '45 Kg HVS dokumen bersih siap jemput'
  },
  {
    id: 'tong-feb-2',
    unit_id: 'unit-feb',
    unit_nama: 'Fakultas Ekonomi & Bisnis',
    nama_tong: 'Tong FEB No. 2',
    nomor: 'FEB-02',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Barat • Baris 2 Kotak 2',
    status: 'terisi',
    berat_kg: 20,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Kardus Box Corrugated',
    catatan: '20 Kg kemasan karton akuntansi dilipat rapi'
  },
  {
    id: 'tong-feb-3',
    unit_id: 'unit-feb',
    unit_nama: 'Fakultas Ekonomi & Bisnis',
    nama_tong: 'Tong FEB No. 3',
    nomor: 'FEB-03',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Barat • Baris 2 Kotak 3',
    status: 'kosong',
    berat_kg: 0,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Standby Siap Diisi',
    catatan: 'Slot kosong standby penyaluran cadangan'
  },
  {
    id: 'tong-feb-4',
    unit_id: 'unit-feb',
    unit_nama: 'Fakultas Ekonomi & Bisnis',
    nama_tong: 'Tong FEB No. 4',
    nomor: 'FEB-04',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Barat • Baris 2 Kotak 4',
    status: 'kosong',
    berat_kg: 0,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Standby Siap Diisi',
    catatan: 'Slot kosong standby penyaluran cadangan'
  },
  {
    id: 'tong-feb-5',
    unit_id: 'unit-feb',
    unit_nama: 'Fakultas Ekonomi & Bisnis',
    nama_tong: 'Tong FEB No. 5',
    nomor: 'FEB-05',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Barat • Baris 2 Kotak 5',
    status: 'kosong',
    berat_kg: 0,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Standby Siap Diisi',
    catatan: 'Slot kosong standby penyaluran cadangan'
  },

  // BARIS 3: FAKULTAS ILMU KOMUNIKASI (FIKOM) — TONG 1 S/D 5
  {
    id: 'tong-fikom-1',
    unit_id: 'unit-fikom',
    unit_nama: 'Fakultas Ilmu Komunikasi',
    nama_tong: 'Tong FIKom No. 1',
    nomor: 'FIKOM-01',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Timur • Baris 3 Kotak 1',
    status: 'terisi',
    berat_kg: 35,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Majalah & Pamflet Kampus',
    catatan: '35 Kg majalah edisi lama & pamflet pameran'
  },
  {
    id: 'tong-fikom-2',
    unit_id: 'unit-fikom',
    unit_nama: 'Fakultas Ilmu Komunikasi',
    nama_tong: 'Tong FIKom No. 2',
    nomor: 'FIKOM-02',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Timur • Baris 3 Kotak 2',
    status: 'kosong',
    berat_kg: 0,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Standby Siap Diisi',
    catatan: 'Slot kosong standby penyaluran cadangan'
  },
  {
    id: 'tong-fikom-3',
    unit_id: 'unit-fikom',
    unit_nama: 'Fakultas Ilmu Komunikasi',
    nama_tong: 'Tong FIKom No. 3',
    nomor: 'FIKOM-03',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Timur • Baris 3 Kotak 3',
    status: 'kosong',
    berat_kg: 0,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Standby Siap Diisi',
    catatan: 'Slot kosong standby penyaluran cadangan'
  },
  {
    id: 'tong-fikom-4',
    unit_id: 'unit-fikom',
    unit_nama: 'Fakultas Ilmu Komunikasi',
    nama_tong: 'Tong FIKom No. 4',
    nomor: 'FIKOM-04',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Timur • Baris 3 Kotak 4',
    status: 'kosong',
    berat_kg: 0,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Standby Siap Diisi',
    catatan: 'Slot kosong standby penyaluran cadangan'
  },
  {
    id: 'tong-fikom-5',
    unit_id: 'unit-fikom',
    unit_nama: 'Fakultas Ilmu Komunikasi',
    nama_tong: 'Tong FIKom No. 5',
    nomor: 'FIKOM-05',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Timur • Baris 3 Kotak 5',
    status: 'kosong',
    berat_kg: 0,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Standby Siap Diisi',
    catatan: 'Slot kosong standby penyaluran cadangan'
  },

  // BARIS 4: BIRO ADMINISTRASI AKADEMIK (BAA) — TONG 1 S/D 5
  {
    id: 'tong-baa-1',
    unit_id: 'unit-baa',
    unit_nama: 'Biro Administrasi Akademik',
    nama_tong: 'Tong BAA No. 1',
    nomor: 'BAA-01',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Utara • Baris 4 Kotak 1',
    status: 'terisi',
    berat_kg: 120,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Kardus Box Corrugated (PENUH)',
    jadwal_pickup: 'Hari ini, 16:00 WIB',
    catatan: '120 Kg Kardus Tebal siap angkut armada mitra'
  },
  {
    id: 'tong-baa-2',
    unit_id: 'unit-baa',
    unit_nama: 'Biro Administrasi Akademik',
    nama_tong: 'Tong BAA No. 2',
    nomor: 'BAA-02',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Utara • Baris 4 Kotak 2',
    status: 'terisi',
    berat_kg: 25,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Kertas Formulir Arsip',
    catatan: '25 Kg arsip formulir lama terikat rapi'
  },
  {
    id: 'tong-baa-3',
    unit_id: 'unit-baa',
    unit_nama: 'Biro Administrasi Akademik',
    nama_tong: 'Tong BAA No. 3',
    nomor: 'BAA-03',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Utara • Baris 4 Kotak 3',
    status: 'kosong',
    berat_kg: 0,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Standby Siap Diisi',
    catatan: 'Slot kosong standby penyaluran cadangan'
  },
  {
    id: 'tong-baa-4',
    unit_id: 'unit-baa',
    unit_nama: 'Biro Administrasi Akademik',
    nama_tong: 'Tong BAA No. 4',
    nomor: 'BAA-04',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Utara • Baris 4 Kotak 4',
    status: 'kosong',
    berat_kg: 0,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Standby Siap Diisi',
    catatan: 'Slot kosong standby penyaluran cadangan'
  },
  {
    id: 'tong-baa-5',
    unit_id: 'unit-baa',
    unit_nama: 'Biro Administrasi Akademik',
    nama_tong: 'Tong BAA No. 5',
    nomor: 'BAA-05',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Utara • Baris 4 Kotak 5',
    status: 'kosong',
    berat_kg: 0,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Standby Siap Diisi',
    catatan: 'Slot kosong standby penyaluran cadangan'
  },
  {
    id: 'tong-fk-1',
    unit_id: 'unit-fk',
    unit_nama: 'Fakultas Kedokteran & Kesehatan',
    nama_tong: 'Tong FK No. 1',
    nomor: 'FK-01',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Timur • Baris 5 Kotak 1',
    status: 'terisi',
    berat_kg: 40,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Arsip Rekam Medis Kering',
    catatan: '40 Kg arsip berkas seminar kesehatan'
  },
  {
    id: 'tong-fasilkom-1',
    unit_id: 'unit-fasilkom',
    unit_nama: 'Fakultas Ilmu Komputer',
    nama_tong: 'Tong FASILKOM No. 1',
    nomor: 'FASILKOM-01',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Timur • Baris 5 Kotak 2',
    status: 'terisi',
    berat_kg: 25,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Kertas HVS & Laporan Praktikum',
    catatan: '25 Kg bundel skripsi dan laporan'
  },
  {
    id: 'tong-perpus-1',
    unit_id: 'unit-perpus',
    unit_nama: 'Perpustakaan Pusat Kampus',
    nama_tong: 'Tong PERPUS No. 1',
    nomor: 'PERPUS-01',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Selatan • Baris 5 Kotak 3',
    status: 'terisi',
    berat_kg: 50,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Koran & Majalah Lama',
    catatan: '50 Kg koran retur & majalah terbitan lama'
  },
  {
    id: 'tong-lppm-1',
    unit_id: 'unit-lppm',
    unit_nama: 'Lembaga Riset & Pengabdian (LPPM)',
    nama_tong: 'Tong LPPM No. 1',
    nomor: 'LPPM-01',
    lokasi_spesifik: 'Gedung Serbaguna - Sayap Selatan • Baris 5 Kotak 4',
    status: 'kosong',
    berat_kg: 0,
    kapasitas_max_kg: 120,
    tipe_kertas: 'Standby Siap Diisi',
    catatan: 'Slot kosong standby penyaluran proposal riset'
  }
];

export const INITIAL_LISTINGS: ListingKertas[] = [
  {
    id: 'list-baa-01',
    unit_id: 'unit-baa',
    unit_nama: 'Biro Administrasi Akademik (BAA)',
    tong_id: 'tong-baa-1',
    tong_nama: 'Tong BAA No. 1 & 2',
    jumlah_kg: 55,
    kategori: 'kardus',
    kategori_label: 'Kardus Box Corrugated Tebal',
    kondisi: ['Kering & bebas minyak', 'Karton dilipat gepeng & diikat tali'],
    foto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpMDjLNhyE5tFuddhterSSd_DLlHeL8Eb0lQqxIm5PpCmXjHNQypJDlPAMqtCDcB0ATyO3YLxVgnPKjncpqWzPTa61rAw6ilSlq4Tl6Xf89eCKkElOv_KdyNHnmS1TEU7q_V1kUTMH75t-_w2qgIhe24CaXl78VBfrH4zMEw_CtGeZMXr4bSQKx-AGI0jhgyK1c7WFuqZ7WPm5GhnBjGl9V_UeoJVI22ECvGCUN0mezS0u9_lT_O1sBQ',
    status: 'siap_pickup',
    tanggal_post: 'Kemarin, 16:00 WIB'
  }
];

export const INITIAL_PERMINTAAN: PermintaanKertas[] = [
  {
    id: 'req-mdl-01',
    perusahaan_id: 'perusahaan-mdl',
    perusahaan_nama: 'PT Mandiri Daur Lestari',
    jenis_kertas: ['HVS / Arsip', 'Kardus Box Corrugated'],
    jumlah_kg: 100,
    toleransi_kadar_air: 12,
    syarat_qc: [
      'Kertas sudah terikat rapi per tumpukan',
      'Bebas kotoran minyak, cairan, & sisa makanan',
      'Bebas klip kawat tebal & lakban jilid plastik'
    ],
    hari_pickup: ['Senin', 'Selasa', 'Rabu', 'Kamis'],
    waktu_operasional: '13:00 - 16:00 WIB',
    estimasi_dana_riset: 150000,
    estimasi_eco_points: 200,
    status_aktif: true,
    tanggal_dibuat: '24 Okt 2024'
  }
];

export const INITIAL_MATCHINGS: MatchingTransaksi[] = [
  {
    id: 'trx-2024-1024',
    listing_kertas_id: 'list-ftd-01',
    permintaan_id: 'req-mdl-01',
    unit_id: 'unit-ftd',
    unit_nama: 'Fakultas Teknik & Desain (FTD)',
    tong_id: 'tong-ftd-1',
    tong_nama: 'Tong FTD No. 1',
    perusahaan_id: 'perusahaan-mdl',
    perusahaan_nama: 'PT Mandiri Daur Lestari',
    jenis_kertas: '60 Kg HVS Putih (Kering 70-80 gsm)',
    jumlah_kg: 60,
    nilai_rupiah: 90000,
    eco_points: 120,
    skor_kecocokan: 98,
    status: 'menunggu_diambil',
    nopol_armada: 'B 9821 PQL',
    driver_nama: 'Pak Joko Susilo',
    tanggal_jemput: 'Kamis, 24 Oktober 2024',
    jam_jemput: '14:30 WIB',
    surat_jalan_kode: '#SJ-2024-1024-FTD1'
  },
  {
    id: 'trx-2024-1018',
    listing_kertas_id: 'list-prev-02',
    unit_id: 'unit-baa',
    unit_nama: 'Biro Administrasi Akademik (BAA)',
    tong_id: 'tong-baa-1',
    tong_nama: 'Tong BAA No. 2',
    perusahaan_id: 'perusahaan-mdl',
    perusahaan_nama: 'PT Mandiri Daur Lestari',
    jenis_kertas: '55 Kg Kardus Box Tebal Double-Wall',
    jumlah_kg: 55,
    nilai_rupiah: 82500,
    eco_points: 110,
    skor_kecocokan: 92,
    status: 'sudah_diambil',
    nopol_armada: 'B 9821 PQL',
    driver_nama: 'Pak Joko Susilo',
    tanggal_jemput: '18 Okt 2024',
    jam_jemput: '15:10 WIB',
    surat_jalan_kode: '#SJ-2024-1018-BAA2',
    tanggal_selesai: '18 Okt, 15:10 WIB',
    rating: 5.0,
    komentar: 'Kardus sangat rapi & bebas kontaminan.',
    foto_timbangan: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpMDjLNhyE5tFuddhterSSd_DLlHeL8Eb0lQqxIm5PpCmXjHNQypJDlPAMqtCDcB0ATyO3YLxVgnPKjncpqWzPTa61rAw6ilSlq4Tl6Xf89eCKkElOv_KdyNHnmS1TEU7q_V1kUTMH75t-_w2qgIhe24CaXl78VBfrH4zMEw_CtGeZMXr4bSQKx-AGI0jhgyK1c7WFuqZ7WPm5GhnBjGl9V_UeoJVI22ECvGCUN0mezS0u9_lT_O1sBQ',
    foto_struk: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpB1iJs3KW51EVCKrYLKaiooV8Bs7AWkfYVcrB0NcCWpn-OJPyDGryqtg38DBJL8utmg69q6KkgFkIE_b32hxfQPQlacYQCcLqBCaSwlSL6Wjd0wFtiEcB0Qw_z0gv0KXAm01cyBrAGmafazKbg1DsZue4KuePncEq87DpyQQq2E7H5LZlpOLc1W-kDmURnBBgmDZwOljDb8epfkTuAKQay4BlDZvf682C5qAq4A5GmGqK6Dr1fek6gg'
  },
  {
    id: 'trx-2024-1011',
    listing_kertas_id: 'list-prev-03',
    unit_id: 'unit-feb',
    unit_nama: 'Fakultas Ekonomi & Bisnis (FEB)',
    tong_id: 'tong-feb-1',
    tong_nama: 'Tong FEB No. 1',
    perusahaan_id: 'perusahaan-mdl',
    perusahaan_nama: 'PT Mandiri Daur Lestari',
    jenis_kertas: '80 Kg Kertas Arsip & Buku Bekas',
    jumlah_kg: 80,
    nilai_rupiah: 120000,
    eco_points: 160,
    skor_kecocokan: 95,
    status: 'sudah_diambil',
    tanggal_selesai: '11 Okt, 14:00 WIB',
    rating: 4.8,
    komentar: 'Batch sortir B-3 terkonfirmasi sangat baik.'
  }
];

export const INITIAL_LAPORAN: LaporanMasalah[] = [
  {
    id: 'flag-08',
    tong_nama: 'Tong Cadangan Rektorat Lt. 1',
    unit_nama: 'Gedung Pusat Rektorat',
    pelapor_id: 'user-perusahaan-mdl',
    pelapor_nama: 'Pak Joko (Driver PT Mandiri Daur)',
    alasan: 'Kontaminasi Basah / Minyak',
    detail: 'Terdapat 2 kantong kertas tercampur sedotan & tumpahan kopi di dalam wadah kardus, berisiko merusak seluruh muatan arsip kering lainnya.',
    level: 'kritis',
    status: 'menunggu_tindakan',
    tanggal: '18 mnt lalu',
    foto: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCY4uGvil61yN9HONFwgAh-52jvV3VHJu8_xJ-GoXNbiOYJA5oNvyV-_R7QJDO8ml-akknWzHAhlAbTY1QZyEaRkZiBlrBaNr_9unCpFtJvi_VzEladBx4EPprHeQfYqBVVrGdEbm-JcfEamc3aSyNNFLGiwzHXs92NGujm4EMUNgBoifevgLrxrlOZ-MsWVRIXXHRusI1lIdsl7wOwlPKYGux__0hQbi2ehMrDpY7Vi2bbOb9AH0cdAA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAZcTVyJ_eOctEGLBGnLWbTuaSPz0n80IRvOH8oMJ7EJksC0ZvEeril66R2EcuxUo9QLPhD0zwY0_oErwzndwD-skv0dk43bPhcwhp3k5UVAunmT__umzMzUWWHWMTcn505OdCk5i1A6owuH98dsd84s5oGsqKfjZKLnOJaBOL0VChsNhH30CeZyqwd6-vS0cAps8dh_LPie_KA6CYSEIvMulbNtWLHSDypJMRdvZu8M44ecU5PkoKNVw'
    ]
  },
  {
    id: 'flag-07',
    tong_nama: 'Tong FIKom No. 1',
    unit_nama: 'Fakultas Ilmu Komunikasi (FIKom)',
    pelapor_id: 'user-admin-pusat',
    pelapor_nama: 'Bpk. Suwardi (Petugas GSG Drop Point)',
    alasan: 'Kardus Belum Dilipat & Belum Diikat Tali',
    detail: 'Tumpukan 14 kardus karton tidak di-press. Sudah dirapikan dan diikat tali oleh tim operasional relawan.',
    level: 'selesai',
    status: 'sudah_selesai',
    tanggal: '2 jam lalu'
  }
];
