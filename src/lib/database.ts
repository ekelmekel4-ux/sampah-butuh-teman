/**
 * Database Service Layer
 * Semua operasi CRUD ke Supabase PostgreSQL
 */
import { supabase } from './supabase';
import type {
  User,
  UnitKampus,
  Tong,
  ListingKertas,
  PermintaanKertas,
  MatchingTransaksi,
  LaporanMasalah,
  Saldo,
  RiwayatPembayaran,
} from '../types';

// ============================================
// HELPER: Error logger
// ============================================
function logError(context: string, error: any) {
  console.error(`[DB ${context}]`, error?.message || error);
}

// ============================================
// PROFILES (User Auth)
// ============================================
export async function getProfileByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();
  if (error) { logError('getProfileByEmail', error); return null; }
  if (!data) return null;
  return mapProfile(data);
}

export async function getProfileById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) { logError('getProfileById', error); return null; }
  if (!data) return null;
  return mapProfile(data);
}

export async function upsertProfile(user: User & { password_hash?: string }): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      nama: user.nama,
      email: user.email.trim().toLowerCase(),
      password_hash: user.password_hash || 'demo1234',
      role: user.role,
      kontak: user.kontak,
      unit_id: user.unit_id || null,
      perusahaan_id: user.perusahaan_id || null,
      avatar_url: user.avatar_url || null,
    }, { onConflict: 'id' });
  if (error) logError('upsertProfile', error);
}

function mapProfile(row: any): User {
  return {
    id: row.id,
    nama: row.nama,
    email: row.email,
    role: row.role,
    kontak: row.kontak || '',
    unit_id: row.unit_id || undefined,
    perusahaan_id: row.perusahaan_id || undefined,
    avatar_url: row.avatar_url || undefined,
  };
}

// ============================================
// UNIT KAMPUS
// ============================================
export async function fetchUnits(): Promise<UnitKampus[]> {
  const { data, error } = await supabase
    .from('unit_kampus')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) { logError('fetchUnits', error); return []; }
  return (data || []).map(mapUnit);
}

export async function upsertUnit(unit: UnitKampus): Promise<void> {
  const { error } = await supabase
    .from('unit_kampus')
    .upsert({
      id: unit.id,
      nama_unit: unit.nama_unit,
      inisial: unit.inisial,
      jenis: unit.jenis,
      lokasi_detail: unit.lokasi_detail,
      pic_nama: unit.pic_nama,
      kontak_pic: unit.kontak_pic,
      tong_id: unit.tong_id,
      tong_nama: unit.tong_nama,
      total_kg_tersalurkan: unit.total_kg_tersalurkan,
      eco_points: unit.eco_points,
      saldo: (unit as any).saldo || 0,
    }, { onConflict: 'id' });
  if (error) logError('upsertUnit', error);
}

export async function updateUnitFields(id: string, fields: Partial<UnitKampus & { saldo: number }>): Promise<void> {
  const { error } = await supabase
    .from('unit_kampus')
    .update(fields)
    .eq('id', id);
  if (error) logError('updateUnitFields', error);
}

function mapUnit(row: any): UnitKampus {
  return {
    id: row.id,
    nama_unit: row.nama_unit,
    inisial: row.inisial,
    jenis: row.jenis,
    lokasi_detail: row.lokasi_detail || '',
    pic_nama: row.pic_nama || '',
    kontak_pic: row.kontak_pic || '',
    tong_id: row.tong_id || '',
    tong_nama: row.tong_nama || '',
    total_kg_tersalurkan: Number(row.total_kg_tersalurkan) || 0,
    eco_points: Number(row.eco_points) || 0,
  };
}

// ============================================
// TONG
// ============================================
export async function fetchTong(): Promise<Tong[]> {
  const { data, error } = await supabase
    .from('tong')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) { logError('fetchTong', error); return []; }
  return (data || []).map(mapTong);
}

export async function upsertTong(tong: Tong): Promise<void> {
  const { error } = await supabase
    .from('tong')
    .upsert({
      id: tong.id,
      unit_id: tong.unit_id,
      unit_nama: tong.unit_nama,
      nama_tong: tong.nama_tong,
      nomor: tong.nomor,
      lokasi_spesifik: tong.lokasi_spesifik,
      status: tong.status,
      berat_kg: tong.berat_kg,
      kapasitas_max_kg: tong.kapasitas_max_kg,
      tipe_kertas: tong.tipe_kertas || null,
      jadwal_pickup: tong.jadwal_pickup || null,
      catatan: tong.catatan || null,
    }, { onConflict: 'id' });
  if (error) logError('upsertTong', error);
}

export async function upsertTongBatch(tongList: Tong[]): Promise<void> {
  const rows = tongList.map(t => ({
    id: t.id,
    unit_id: t.unit_id,
    unit_nama: t.unit_nama,
    nama_tong: t.nama_tong,
    nomor: t.nomor,
    lokasi_spesifik: t.lokasi_spesifik,
    status: t.status,
    berat_kg: t.berat_kg,
    kapasitas_max_kg: t.kapasitas_max_kg,
    tipe_kertas: t.tipe_kertas || null,
    jadwal_pickup: t.jadwal_pickup || null,
    catatan: t.catatan || null,
  }));
  const { error } = await supabase
    .from('tong')
    .upsert(rows, { onConflict: 'id' });
  if (error) logError('upsertTongBatch', error);
}

export async function updateTongFields(id: string, fields: Partial<Tong>): Promise<void> {
  const { error } = await supabase
    .from('tong')
    .update(fields)
    .eq('id', id);
  if (error) logError('updateTongFields', error);
}

function mapTong(row: any): Tong {
  return {
    id: row.id,
    unit_id: row.unit_id,
    unit_nama: row.unit_nama || '',
    nama_tong: row.nama_tong,
    nomor: row.nomor || '',
    lokasi_spesifik: row.lokasi_spesifik || '',
    status: row.status || 'kosong',
    berat_kg: Number(row.berat_kg) || 0,
    kapasitas_max_kg: Number(row.kapasitas_max_kg) || 120,
    tipe_kertas: row.tipe_kertas || undefined,
    jadwal_pickup: row.jadwal_pickup || undefined,
    catatan: row.catatan || undefined,
  };
}

// ============================================
// LISTING KERTAS
// ============================================
export async function fetchListings(): Promise<ListingKertas[]> {
  const { data, error } = await supabase
    .from('listing_kertas')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { logError('fetchListings', error); return []; }
  return (data || []).map(mapListing);
}

export async function upsertListing(listing: ListingKertas): Promise<void> {
  const { error } = await supabase
    .from('listing_kertas')
    .upsert({
      id: listing.id,
      unit_id: listing.unit_id,
      unit_nama: listing.unit_nama,
      tong_id: listing.tong_id,
      tong_nama: listing.tong_nama,
      jumlah_kg: listing.jumlah_kg,
      kategori: listing.kategori,
      kategori_label: listing.kategori_label,
      kondisi: listing.kondisi,
      foto: listing.foto,
      status: listing.status,
      tanggal_post: listing.tanggal_post,
      matching_id: listing.matching_id || null,
    }, { onConflict: 'id' });
  if (error) logError('upsertListing', error);
}

export async function updateListingFields(id: string, fields: Partial<ListingKertas>): Promise<void> {
  const { error } = await supabase
    .from('listing_kertas')
    .update(fields)
    .eq('id', id);
  if (error) logError('updateListingFields', error);
}

export async function updateListingsByTong(tongId: string, fields: Partial<ListingKertas>): Promise<void> {
  const { error } = await supabase
    .from('listing_kertas')
    .update(fields)
    .eq('tong_id', tongId)
    .neq('status', 'sudah_diambil');
  if (error) logError('updateListingsByTong', error);
}

function mapListing(row: any): ListingKertas {
  return {
    id: row.id,
    unit_id: row.unit_id,
    unit_nama: row.unit_nama || '',
    tong_id: row.tong_id,
    tong_nama: row.tong_nama || '',
    jumlah_kg: Number(row.jumlah_kg) || 0,
    kategori: row.kategori,
    kategori_label: row.kategori_label || '',
    kondisi: row.kondisi || [],
    foto: row.foto || '',
    status: row.status,
    tanggal_post: row.tanggal_post || '',
    matching_id: row.matching_id || undefined,
  };
}

// ============================================
// PERMINTAAN KERTAS
// ============================================
export async function fetchPermintaan(): Promise<PermintaanKertas[]> {
  const { data, error } = await supabase
    .from('permintaan_kertas')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { logError('fetchPermintaan', error); return []; }
  return (data || []).map(mapPermintaan);
}

export async function upsertPermintaan(req: PermintaanKertas): Promise<void> {
  const { error } = await supabase
    .from('permintaan_kertas')
    .upsert({
      id: req.id,
      perusahaan_id: req.perusahaan_id,
      perusahaan_nama: req.perusahaan_nama,
      jenis_kertas: req.jenis_kertas,
      jumlah_kg: req.jumlah_kg,
      toleransi_kadar_air: req.toleransi_kadar_air,
      syarat_qc: req.syarat_qc,
      hari_pickup: req.hari_pickup,
      waktu_operasional: req.waktu_operasional,
      estimasi_dana_riset: req.estimasi_dana_riset,
      estimasi_eco_points: req.estimasi_eco_points,
      status_aktif: req.status_aktif,
      tanggal_dibuat: req.tanggal_dibuat,
    }, { onConflict: 'id' });
  if (error) logError('upsertPermintaan', error);
}

function mapPermintaan(row: any): PermintaanKertas {
  return {
    id: row.id,
    perusahaan_id: row.perusahaan_id || '',
    perusahaan_nama: row.perusahaan_nama || '',
    jenis_kertas: row.jenis_kertas || [],
    jumlah_kg: Number(row.jumlah_kg) || 0,
    toleransi_kadar_air: Number(row.toleransi_kadar_air) || 0,
    syarat_qc: row.syarat_qc || [],
    hari_pickup: row.hari_pickup || [],
    waktu_operasional: row.waktu_operasional || '',
    estimasi_dana_riset: Number(row.estimasi_dana_riset) || 0,
    estimasi_eco_points: Number(row.estimasi_eco_points) || 0,
    status_aktif: row.status_aktif !== false,
    tanggal_dibuat: row.tanggal_dibuat || '',
  };
}

// ============================================
// MATCHING TRANSAKSI
// ============================================
export async function fetchMatchings(): Promise<MatchingTransaksi[]> {
  const { data, error } = await supabase
    .from('matching_transaksi')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { logError('fetchMatchings', error); return []; }
  return (data || []).map(mapMatching);
}

export async function upsertMatching(m: MatchingTransaksi): Promise<void> {
  const { error } = await supabase
    .from('matching_transaksi')
    .upsert({
      id: m.id,
      listing_kertas_id: m.listing_kertas_id,
      permintaan_id: m.permintaan_id || null,
      unit_id: m.unit_id,
      unit_nama: m.unit_nama,
      tong_id: m.tong_id,
      tong_nama: m.tong_nama,
      perusahaan_id: m.perusahaan_id,
      perusahaan_nama: m.perusahaan_nama,
      jenis_kertas: m.jenis_kertas,
      jumlah_kg: m.jumlah_kg,
      nilai_rupiah: m.nilai_rupiah,
      eco_points: m.eco_points,
      skor_kecocokan: m.skor_kecocokan,
      status: m.status,
      nopol_armada: m.nopol_armada || null,
      driver_nama: m.driver_nama || null,
      tanggal_jemput: m.tanggal_jemput || null,
      jam_jemput: m.jam_jemput || null,
      surat_jalan_kode: m.surat_jalan_kode || null,
      tanggal_selesai: m.tanggal_selesai || null,
      rating: m.rating || null,
      komentar: m.komentar || null,
      foto_timbangan: m.foto_timbangan || null,
      foto_struk: m.foto_struk || null,
    }, { onConflict: 'id' });
  if (error) logError('upsertMatching', error);
}

export async function updateMatchingFields(id: string, fields: Partial<MatchingTransaksi>): Promise<void> {
  const { error } = await supabase
    .from('matching_transaksi')
    .update(fields)
    .eq('id', id);
  if (error) logError('updateMatchingFields', error);
}

export async function updateMatchingsByTong(tongId: string, fields: Partial<MatchingTransaksi>): Promise<void> {
  const { error } = await supabase
    .from('matching_transaksi')
    .update(fields)
    .eq('tong_id', tongId)
    .neq('status', 'sudah_diambil');
  if (error) logError('updateMatchingsByTong', error);
}

function mapMatching(row: any): MatchingTransaksi {
  return {
    id: row.id,
    listing_kertas_id: row.listing_kertas_id || '',
    permintaan_id: row.permintaan_id || undefined,
    unit_id: row.unit_id || '',
    unit_nama: row.unit_nama || '',
    tong_id: row.tong_id || '',
    tong_nama: row.tong_nama || '',
    perusahaan_id: row.perusahaan_id || '',
    perusahaan_nama: row.perusahaan_nama || '',
    jenis_kertas: row.jenis_kertas || '',
    jumlah_kg: Number(row.jumlah_kg) || 0,
    nilai_rupiah: Number(row.nilai_rupiah) || 0,
    eco_points: Number(row.eco_points) || 0,
    skor_kecocokan: Number(row.skor_kecocokan) || 0,
    status: row.status || 'menunggu_diambil',
    nopol_armada: row.nopol_armada || undefined,
    driver_nama: row.driver_nama || undefined,
    tanggal_jemput: row.tanggal_jemput || undefined,
    jam_jemput: row.jam_jemput || undefined,
    surat_jalan_kode: row.surat_jalan_kode || undefined,
    tanggal_selesai: row.tanggal_selesai || undefined,
    rating: row.rating ? Number(row.rating) : undefined,
    komentar: row.komentar || undefined,
    foto_timbangan: row.foto_timbangan || undefined,
    foto_struk: row.foto_struk || undefined,
  };
}

// ============================================
// LAPORAN MASALAH
// ============================================
export async function fetchLaporan(): Promise<LaporanMasalah[]> {
  const { data, error } = await supabase
    .from('laporan_masalah')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { logError('fetchLaporan', error); return []; }
  return (data || []).map(mapLaporan);
}

export async function upsertLaporan(l: LaporanMasalah): Promise<void> {
  const { error } = await supabase
    .from('laporan_masalah')
    .upsert({
      id: l.id,
      listing_kertas_id: l.listing_kertas_id || null,
      matching_id: l.matching_id || null,
      tong_id: l.tong_id || null,
      tong_nama: l.tong_nama,
      unit_nama: l.unit_nama,
      pelapor_id: l.pelapor_id,
      pelapor_nama: l.pelapor_nama,
      alasan: l.alasan,
      detail: l.detail,
      level: l.level,
      foto: l.foto || [],
      status: l.status,
      tanggal: l.tanggal,
    }, { onConflict: 'id' });
  if (error) logError('upsertLaporan', error);
}

export async function updateLaporanFields(id: string, fields: Partial<LaporanMasalah>): Promise<void> {
  const { error } = await supabase
    .from('laporan_masalah')
    .update(fields)
    .eq('id', id);
  if (error) logError('updateLaporanFields', error);
}

function mapLaporan(row: any): LaporanMasalah {
  return {
    id: row.id,
    listing_kertas_id: row.listing_kertas_id || undefined,
    matching_id: row.matching_id || undefined,
    tong_id: row.tong_id || undefined,
    tong_nama: row.tong_nama || '',
    unit_nama: row.unit_nama || '',
    pelapor_id: row.pelapor_id || '',
    pelapor_nama: row.pelapor_nama || '',
    alasan: row.alasan || '',
    detail: row.detail || '',
    level: row.level || 'sedang',
    foto: row.foto || undefined,
    status: row.status || 'menunggu_tindakan',
    tanggal: row.tanggal || '',
  };
}

// ============================================
// SALDO (Pembayaran)
// ============================================
export async function fetchSaldo(ownerId: string): Promise<Saldo | null> {
  const { data, error } = await supabase
    .from('saldo')
    .select('*')
    .eq('owner_id', ownerId)
    .maybeSingle();
  if (error) { logError('fetchSaldo', error); return null; }
  if (!data) return null;
  return {
    id: data.id,
    owner_id: data.owner_id,
    owner_type: data.owner_type,
    owner_nama: data.owner_nama,
    jumlah: Number(data.jumlah) || 0,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function fetchAllSaldo(): Promise<Saldo[]> {
  const { data, error } = await supabase
    .from('saldo')
    .select('*')
    .order('jumlah', { ascending: false });
  if (error) { logError('fetchAllSaldo', error); return []; }
  return (data || []).map(d => ({
    id: d.id,
    owner_id: d.owner_id,
    owner_type: d.owner_type,
    owner_nama: d.owner_nama,
    jumlah: Number(d.jumlah) || 0,
    created_at: d.created_at,
    updated_at: d.updated_at,
  }));
}

export async function upsertSaldo(ownerId: string, ownerType: 'unit' | 'perusahaan', ownerNama: string, jumlah: number): Promise<void> {
  // Check if exists
  const existing = await fetchSaldo(ownerId);
  if (existing) {
    const { error } = await supabase
      .from('saldo')
      .update({ jumlah, owner_nama: ownerNama, updated_at: new Date().toISOString() })
      .eq('owner_id', ownerId);
    if (error) logError('upsertSaldo:update', error);
  } else {
    const { error } = await supabase
      .from('saldo')
      .insert({ owner_id: ownerId, owner_type: ownerType, owner_nama: ownerNama, jumlah });
    if (error) logError('upsertSaldo:insert', error);
  }
}

export async function addToSaldo(ownerId: string, ownerType: 'unit' | 'perusahaan', ownerNama: string, tambahan: number): Promise<number> {
  const existing = await fetchSaldo(ownerId);
  const newJumlah = (existing?.jumlah || 0) + tambahan;
  await upsertSaldo(ownerId, ownerType, ownerNama, newJumlah);
  return newJumlah;
}

// ============================================
// RIWAYAT PEMBAYARAN
// ============================================
export async function fetchRiwayatPembayaran(ownerId?: string): Promise<RiwayatPembayaran[]> {
  let query = supabase
    .from('riwayat_pembayaran')
    .select('*')
    .order('created_at', { ascending: false });

  if (ownerId) {
    query = query.or(`dari_id.eq.${ownerId},ke_id.eq.${ownerId}`);
  }

  const { data, error } = await query;
  if (error) { logError('fetchRiwayatPembayaran', error); return []; }
  return (data || []).map(d => ({
    id: d.id,
    matching_transaksi_id: d.matching_transaksi_id || '',
    dari_id: d.dari_id || '',
    dari_nama: d.dari_nama || '',
    ke_id: d.ke_id || '',
    ke_nama: d.ke_nama || '',
    jumlah: Number(d.jumlah) || 0,
    jenis: d.jenis || 'pembayaran_kertas',
    status: d.status || 'berhasil',
    catatan: d.catatan || '',
    created_at: d.created_at || '',
  }));
}

export async function insertPembayaran(pembayaran: Omit<RiwayatPembayaran, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase
    .from('riwayat_pembayaran')
    .insert({
      matching_transaksi_id: pembayaran.matching_transaksi_id,
      dari_id: pembayaran.dari_id,
      dari_nama: pembayaran.dari_nama,
      ke_id: pembayaran.ke_id,
      ke_nama: pembayaran.ke_nama,
      jumlah: pembayaran.jumlah,
      jenis: pembayaran.jenis,
      status: pembayaran.status,
      catatan: pembayaran.catatan,
    });
  if (error) logError('insertPembayaran', error);
}

// ============================================
// PROCESS PAYMENT (Pembayaran Otomatis)
// Dipanggil saat transaksi dikonfirmasi selesai
// ============================================
export async function processPayment(matching: MatchingTransaksi): Promise<void> {
  const amount = matching.nilai_rupiah;
  if (amount <= 0) return;

  // 1. Tambah saldo unit (penjual kertas)
  await addToSaldo(matching.unit_id, 'unit', matching.unit_nama, amount);
  
  // 1.5. Tambah tagihan perusahaan (pembeli kertas)
  await addToSaldo(matching.perusahaan_id, 'perusahaan', matching.perusahaan_nama, amount);

  // 2. Update saldo di tabel unit_kampus juga
  const { data: unitData } = await supabase
    .from('unit_kampus')
    .select('saldo')
    .eq('id', matching.unit_id)
    .maybeSingle();
  
  const currentUnitSaldo = Number(unitData?.saldo) || 0;
  await updateUnitFields(matching.unit_id, { saldo: currentUnitSaldo + amount } as any);

  // 3. Catat riwayat pembayaran
  await insertPembayaran({
    matching_transaksi_id: matching.id,
    dari_id: matching.perusahaan_id,
    dari_nama: matching.perusahaan_nama,
    ke_id: matching.unit_id,
    ke_nama: matching.unit_nama,
    jumlah: amount,
    jenis: 'pembayaran_kertas',
    status: 'berhasil',
    catatan: `Pembayaran otomatis - ${matching.jenis_kertas}`,
  });
}

// ============================================
// FULL DATA LOAD (Initial fetch from Supabase)
// ============================================
export async function loadAllData() {
  const [units, tongList, listings, permintaanList, matchings, laporanList] = await Promise.all([
    fetchUnits(),
    fetchTong(),
    fetchListings(),
    fetchPermintaan(),
    fetchMatchings(),
    fetchLaporan(),
  ]);

  return { units, tongList, listings, permintaanList, matchings, laporanList };
}
