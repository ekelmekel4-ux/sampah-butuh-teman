export type UserRole = 'unit' | 'perusahaan' | 'admin';

export interface User {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  kontak: string;
  unit_id?: string;
  perusahaan_id?: string;
  avatar_url?: string;
}

export interface UnitKampus {
  id: string;
  nama_unit: string;
  inisial: string;
  jenis: 'fakultas' | 'biro' | 'prodi' | 'lembaga';
  lokasi_detail: string;
  pic_nama: string;
  kontak_pic: string;
  tong_id: string;
  tong_nama: string;
  total_kg_tersalurkan: number;
  eco_points: number;
}

export interface Tong {
  id: string;
  unit_id: string;
  unit_nama: string;
  nama_tong: string;
  nomor: string;
  lokasi_spesifik: string;
  status: 'kosong' | 'terisi' | 'siap_pickup';
  berat_kg: number;
  kapasitas_max_kg: number;
  tipe_kertas?: string;
  jadwal_pickup?: string;
  catatan?: string;
}

export type KategoriKertas = 'hvs' | 'kardus' | 'koran' | 'campur';

export interface ListingKertas {
  id: string;
  unit_id: string;
  unit_nama: string;
  tong_id: string;
  tong_nama: string;
  jumlah_kg: number;
  kategori: KategoriKertas;
  kategori_label: string;
  kondisi: string[];
  foto: string;
  status: 'menunggu_mitra' | 'siap_pickup' | 'sudah_diambil';
  tanggal_post: string;
  matching_id?: string;
}

export interface PermintaanKertas {
  id: string;
  perusahaan_id: string;
  perusahaan_nama: string;
  jenis_kertas: string[];
  jumlah_kg: number;
  toleransi_kadar_air: number;
  syarat_qc: string[];
  hari_pickup: string[];
  waktu_operasional: string;
  estimasi_dana_riset: number;
  estimasi_eco_points: number;
  status_aktif: boolean;
  tanggal_dibuat: string;
}

export interface MatchingTransaksi {
  id: string;
  listing_kertas_id: string;
  permintaan_id?: string;
  unit_id: string;
  unit_nama: string;
  tong_id: string;
  tong_nama: string;
  perusahaan_id: string;
  perusahaan_nama: string;
  jenis_kertas: string;
  jumlah_kg: number;
  nilai_rupiah: number;
  eco_points: number;
  skor_kecocokan: number;
  status: 'menunggu_diambil' | 'sudah_diambil';
  nopol_armada?: string;
  driver_nama?: string;
  tanggal_jemput?: string;
  jam_jemput?: string;
  surat_jalan_kode?: string;
  tanggal_selesai?: string;
  rating?: number;
  komentar?: string;
  foto_timbangan?: string;
  foto_struk?: string;
}

export interface LaporanMasalah {
  id: string;
  listing_kertas_id?: string;
  matching_id?: string;
  tong_id?: string;
  tong_nama: string;
  unit_nama: string;
  pelapor_id: string;
  pelapor_nama: string;
  alasan: string;
  detail: string;
  level: 'kritis' | 'sedang' | 'selesai';
  foto?: string[];
  status: 'menunggu_tindakan' | 'sudah_selesai';
  tanggal: string;
}

export interface EcoPointRecord {
  id: string;
  unit_id: string;
  unit_nama: string;
  jumlah_poin: number;
  sumber_transaksi_id: string;
  tanggal: string;
  keterangan: string;
}
