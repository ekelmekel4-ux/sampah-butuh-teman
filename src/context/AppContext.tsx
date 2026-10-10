import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  User,
  UnitKampus,
  Tong,
  ListingKertas,
  PermintaanKertas,
  MatchingTransaksi,
  LaporanMasalah,
  KategoriKertas,
  Saldo,
  RiwayatPembayaran
} from '../types';
import {
  APP_BRAND,
  HARGA_PER_KG,
  HARGA_DEFAULT_PER_KG,
  INITIAL_USERS
} from '../data/initialData';
import * as db from '../lib/database';

export type AuthStep =
  | 'onboarding'
  | 'gate'
  | 'login'
  | 'login-penyalur'
  | 'login-penerima'
  | 'register-penyalur'
  | 'register-penerima';

interface AppContextType {
  role: UserRole;
  currentUser: User | null;
  isLoggedIn: boolean;
  hasSeenOnboarding: boolean;
  authStep: AuthStep;
  completeOnboarding: () => void;
  setAuthStep: (step: AuthStep) => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  registerPenyalur: (data: {
    namaUnit: string;
    inisial: string;
    jenis: 'fakultas' | 'biro' | 'prodi';
    picNama: string;
    email: string;
    kontak: string;
    lokasiDetail?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  registerPenerima: (data: {
    namaPt: string;
    nib: string;
    email: string;
    kontakDispatcher: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  units: UnitKampus[];
  tongList: Tong[];
  listings: ListingKertas[];
  permintaanList: PermintaanKertas[];
  matchings: MatchingTransaksi[];
  laporanList: LaporanMasalah[];
  activeRoute: string;
  setActiveRoute: (route: string) => void;
  selectedMatchingId: string | null;
  setSelectedMatchingId: (id: string | null) => void;
  selectedListingId: string | null;
  setSelectedListingId: (id: string | null) => void;
  createListing: (data: {
    unitId: string;
    tongId?: string;
    jumlahKg: number;
    kategori: KategoriKertas;
    kategoriLabel: string;
    kondisi: string[];
    foto: string;
  }) => Promise<ListingKertas | null>;
  createPermintaan: (data: {
    jenisKertas: string[];
    jumlahKg: number;
    toleransiKadarAir: number;
    syaratQc: string[];
    hariPickup: string[];
    waktuOperasional: string;
  }) => Promise<PermintaanKertas | null>;
  schedulePickup: (matchingId: string, tanggal: string, jam: string) => Promise<void>;
  confirmPickup: (matchingId: string) => Promise<void>;
  confirmUnitPlaced: (listingId: string) => Promise<void>;
  emptyTong: (tongId: string) => Promise<void>;
  requestSecondTong: (unitId: string) => Promise<Tong | null>;
  addNewUnitAndTong: (data: {
    namaUnit: string;
    inisial: string;
    jenis: 'fakultas' | 'biro' | 'prodi';
    lokasiDetail: string;
    kapasitasMax: number;
    picNama?: string;
    kontakPic?: string;
  }) => Promise<{ unit: UnitKampus; tong: Tong } | null>;
  resolveLaporan: (id: string) => Promise<void>;
  submitLaporan: (data: {
    tongNama: string;
    unitNama: string;
    alasan: string;
    detail: string;
    level: 'kritis' | 'sedang';
  }) => Promise<void>;
  resetDemoData: () => void;
  totalKgTersalurkan: number;
  totalPohon: number;
  totalAirBersih: number;
  saldoSekarang: number;
  riwayatSaldo: RiwayatPembayaran[];
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'sbt_current_role_v3',
  IS_LOGGED_IN: 'sbt_logged_in_v3',
  HAS_SEEN_ONBOARDING: 'sbt_seen_onboarding_v3',
  CURRENT_USER: 'sbt_current_user_v3',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING) === 'true';
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  });
  const [authStep, setAuthStep] = useState<AuthStep>(() => {
    const seen = localStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING) === 'true';
    return seen ? 'gate' : 'onboarding';
  });
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'unit';
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return null;
  });
  const [activeRoute, setActiveRoute] = useState<string>(() => {
    if (role === 'unit') return '/unit/beranda';
    if (role === 'perusahaan') return '/perusahaan/dashboard';
    return '/admin/dashboard';
  });

  const [selectedMatchingId, setSelectedMatchingId] = useState<string | null>(null);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  const [units, setUnits] = useState<UnitKampus[]>([]);
  const [tongList, setTongList] = useState<Tong[]>([]);
  const [listings, setListings] = useState<ListingKertas[]>([]);
  const [permintaanList, setPermintaanList] = useState<PermintaanKertas[]>([]);
  const [matchings, setMatchings] = useState<MatchingTransaksi[]>([]);
  const [laporanList, setLaporanList] = useState<LaporanMasalah[]>([]);
  const [saldoSekarang, setSaldoSekarang] = useState<number>(0);
  const [riwayatSaldo, setRiwayatSaldo] = useState<RiwayatPembayaran[]>([]);

  const refreshData = async () => {
    const data = await db.loadAllData();
    setUnits(data.units);
    setTongList(data.tongList);
    setListings(data.listings);
    setPermintaanList(data.permintaanList);
    setMatchings(data.matchings);
    setLaporanList(data.laporanList);

    if (currentUser) {
       const ownerId = currentUser.role === 'unit' ? currentUser.unit_id : currentUser.perusahaan_id;
       if (ownerId) {
          const s = await db.fetchSaldo(ownerId);
          setSaldoSekarang(s?.jumlah || 0);
          const r = await db.fetchRiwayatPembayaran(ownerId);
          setRiwayatSaldo(r);
       }
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, String(hasSeenOnboarding));
  }, [hasSeenOnboarding]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  const completeOnboarding = () => {
    setHasSeenOnboarding(true);
    setAuthStep('gate');
  };

  const login = async (email: string, _password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    let user = await db.getProfileByEmail(cleanEmail);

    if (!user) {
      if (cleanEmail.includes('admin') || cleanEmail === 'admin.kampushijau@univ.ac.id') {
         user = INITIAL_USERS.find(u => u.role === 'admin') || null;
      } else if (cleanEmail.includes('pt') || cleanEmail.includes('perusahaan') || cleanEmail.includes('cv') || cleanEmail.includes('mitra')) {
        user = {
          id: `user-perusahaan-${Date.now()}`,
          nama: cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'perusahaan',
          kontak: '081987654321',
          perusahaan_id: 'perusahaan-mdl',
          avatar_url: APP_BRAND.avatarUrl
        };
      } else {
        user = {
          id: `user-unit-${Date.now()}`,
          nama: cleanEmail.split('@')[0].toUpperCase(),
          email: cleanEmail,
          role: 'unit',
          kontak: '081234567890',
          unit_id: units[0]?.id || 'unit-ftd',
          avatar_url: APP_BRAND.avatarUrl
        };
      }
      if (user) await db.upsertProfile(user);
    }

    if (!user) {
      return { success: false, message: 'Email tidak ditemukan.' };
    }

    setCurrentUser(user);
    setRoleState(user.role);
    setIsLoggedIn(true);

    if (user.role === 'unit') setActiveRoute('/unit/beranda');
    else if (user.role === 'perusahaan') setActiveRoute('/perusahaan/dashboard');
    else setActiveRoute('/admin/dashboard');

    return { success: true };
  };

  const registerPenyalur = async ({ namaUnit, inisial, jenis, picNama, email, kontak, lokasiDetail = 'Gedung Utama Kampus' }: any) => {
    const cleanInisial = inisial.toUpperCase().trim() || 'UNT';
    const unitId = `unit-${cleanInisial.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const tongId = `tong-${cleanInisial.toLowerCase()}-1`;
    const namaTong = `Tong ${cleanInisial} No. 1`;

    const newUnit: UnitKampus = {
      id: unitId,
      nama_unit: namaUnit,
      inisial: cleanInisial,
      jenis,
      lokasi_detail: lokasiDetail,
      pic_nama: picNama,
      kontak_pic: kontak,
      tong_id: tongId,
      tong_nama: namaTong,
      total_kg_tersalurkan: 0,
      eco_points: 0
    };

    const newTong: Tong = {
      id: tongId,
      unit_id: unitId,
      unit_nama: namaUnit,
      nama_tong: namaTong,
      nomor: `${cleanInisial}-01`,
      lokasi_spesifik: `Gedung Serbaguna - Sayap ${cleanInisial}`,
      status: 'kosong',
      berat_kg: 0,
      kapasitas_max_kg: 150,
      tipe_kertas: 'Standby Siap Diisi',
      catatan: 'Wadah resmi unit baru terdaftar'
    };

    const newUser: User = {
      id: `user-${unitId}`,
      nama: picNama,
      email: email.trim().toLowerCase(),
      role: 'unit',
      kontak,
      unit_id: unitId,
      avatar_url: APP_BRAND.avatarUrl
    };

    await db.upsertUnit(newUnit);
    await db.upsertTong(newTong);
    await db.upsertProfile(newUser);
    await refreshData();

    setCurrentUser(newUser);
    setRoleState('unit');
    setIsLoggedIn(true);
    setActiveRoute('/unit/beranda');

    return { success: true };
  };

  const registerPenerima = async ({ namaPt, nib, email, kontakDispatcher }: any) => {
    const perusahaanId = `perusahaan-${Date.now().toString().slice(-4)}`;
    const newUser: User = {
      id: `user-${perusahaanId}`,
      nama: `${namaPt} (NIB: ${nib})`,
      email: email.trim().toLowerCase(),
      role: 'perusahaan',
      kontak: kontakDispatcher,
      perusahaan_id: perusahaanId,
      avatar_url: APP_BRAND.avatarUrl
    };

    await db.upsertProfile(newUser);
    await refreshData();

    setCurrentUser(newUser);
    setRoleState('perusahaan');
    setIsLoggedIn(true);
    setActiveRoute('/perusahaan/dashboard');

    return { success: true };
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAuthStep('gate');
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'unit') setActiveRoute('/unit/beranda');
    else if (newRole === 'perusahaan') setActiveRoute('/perusahaan/dashboard');
    else setActiveRoute('/admin/dashboard');
  };

  const createListing = async ({ unitId, tongId, jumlahKg, kategori, kategoriLabel, kondisi, foto }: any) => {
    const unit = units.find(u => u.id === unitId) || units[0];
    const tong = (tongId ? tongList.find(t => t.id === tongId) : null) || tongList.find(t => t.unit_id === unit.id) || tongList[0];

    const newTongWeight = tong.berat_kg + jumlahKg;
    const isQuotaMet = newTongWeight >= 10;

    const existingListing = listings.find(l => l.tong_id === tong.id && l.status !== 'sudah_diambil');
    let resultingListing: ListingKertas;

    if (existingListing) {
      // Aggregate into existing listing
      const updatedJumlahKg = existingListing.jumlah_kg + jumlahKg;
      await db.updateListingFields(existingListing.id, {
          jumlah_kg: updatedJumlahKg,
          kategori_label: existingListing.kategori_label.includes(kategoriLabel) 
              ? existingListing.kategori_label 
              : existingListing.kategori_label + ', ' + kategoriLabel,
          kondisi: [...new Set([...(existingListing.kondisi || []), ...kondisi])],
          status: isQuotaMet ? 'siap_pickup' : 'menunggu_mitra'
      });
      resultingListing = { ...existingListing, jumlah_kg: updatedJumlahKg, status: isQuotaMet ? 'siap_pickup' : 'menunggu_mitra' };

      if (existingListing.matching_id) {
          const existingMatch = matchings.find(m => m.id === existingListing.matching_id);
          if (existingMatch) {
              await db.updateMatchingFields(existingMatch.id, {
                  jumlah_kg: existingMatch.jumlah_kg + jumlahKg,
                  jenis_kertas: existingMatch.jenis_kertas.includes(kategoriLabel)
                      ? existingMatch.jenis_kertas
                      : existingMatch.jenis_kertas + ', ' + kategoriLabel,
                  nilai_rupiah: existingMatch.nilai_rupiah + (jumlahKg * (HARGA_PER_KG[kategori as KategoriKertas] ?? HARGA_DEFAULT_PER_KG)),
                  eco_points: existingMatch.eco_points + (jumlahKg * 2),
                  status: isQuotaMet ? 'menunggu_diambil' : existingMatch.status
              });
          }
      }
    } else {
      // Create new listing
      const newListingId = `list-${Date.now()}`;
      const newListing: ListingKertas = {
        id: newListingId,
        unit_id: unit.id,
        unit_nama: unit.nama_unit,
        tong_id: tong.id,
        tong_nama: tong.nama_tong,
        jumlah_kg: jumlahKg,
        kategori,
        kategori_label: kategoriLabel,
        kondisi,
        foto: foto || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
        status: isQuotaMet ? 'siap_pickup' : 'menunggu_mitra',
        tanggal_post: 'Baru saja'
      };

      await db.upsertListing(newListing);
      resultingListing = newListing;

      const matchingReq = permintaanList[0];
      if (matchingReq) {
          const newTrxId = `trx-${Date.now().toString().slice(-6)}`;
          const newMatch: MatchingTransaksi = {
            id: newTrxId,
            listing_kertas_id: newListingId,
            permintaan_id: matchingReq.id,
            unit_id: unit.id,
            unit_nama: unit.nama_unit,
            tong_id: tong.id,
            tong_nama: tong.nama_tong,
            perusahaan_id: matchingReq.perusahaan_id || 'perusahaan-mdl',
            perusahaan_nama: matchingReq.perusahaan_nama || 'PT Mandiri Daur Lestari',
            jenis_kertas: `${jumlahKg} Kg ${kategoriLabel}`,
            jumlah_kg: jumlahKg,
            nilai_rupiah: jumlahKg * (HARGA_PER_KG[kategori as KategoriKertas] ?? HARGA_DEFAULT_PER_KG),
            eco_points: jumlahKg * 2,
            skor_kecocokan: 96,
            status: isQuotaMet ? 'menunggu_diambil' : 'menunggu_diambil',
            tanggal_jemput: 'Jadwal Otomatis Siap Dipilih',
            jam_jemput: '13:00 - 16:00 WIB'
          };
          await db.upsertMatching(newMatch);
          await db.updateListingFields(newListingId, { matching_id: newTrxId });
          resultingListing.matching_id = newTrxId;
      }
    }

    await db.updateTongFields(tong.id, {
        status: isQuotaMet ? 'siap_pickup' : 'terisi',
        berat_kg: newTongWeight,
        tipe_kertas: kategoriLabel,
        catatan: isQuotaMet
          ? `Siap dijemput mitra pabrik (kuota terpenuhi: ${newTongWeight} Kg)`
          : `Terkumpul ${newTongWeight}/10 Kg. Kurang ${10 - newTongWeight} Kg lagi untuk siap dijemput.`
    });
    await db.updateUnitFields(unit.id, {
        total_kg_tersalurkan: unit.total_kg_tersalurkan + jumlahKg,
        eco_points: unit.eco_points + jumlahKg * 2
    } as any);

    await refreshData();
    return resultingListing;
  };

  const createPermintaan = async (data: any) => {
    const perusahaanNama = currentUser?.role === 'perusahaan' ? currentUser.nama : 'PT Mandiri Daur Lestari';
    const newReq: PermintaanKertas = {
      id: `req-${Date.now()}`,
      perusahaan_id: currentUser?.perusahaan_id || 'perusahaan-mdl',
      perusahaan_nama: perusahaanNama,
      jenis_kertas: data.jenisKertas,
      jumlah_kg: data.jumlahKg,
      toleransi_kadar_air: data.toleransiKadarAir,
      syarat_qc: data.syaratQc,
      hari_pickup: data.hariPickup,
      waktu_operasional: data.waktuOperasional,
      estimasi_dana_riset: data.jumlahKg * HARGA_DEFAULT_PER_KG,
      estimasi_eco_points: data.jumlahKg * 2,
      status_aktif: true,
      tanggal_dibuat: 'Hari ini'
    };
    await db.upsertPermintaan(newReq);
    await refreshData();
    return newReq;
  };

  const schedulePickup = async (matchingId: string, tanggal: string, jam: string) => {
    await db.updateMatchingFields(matchingId, {
      tanggal_jemput: tanggal,
      jam_jemput: jam,
      nopol_armada: 'B 9821 PQL',
      driver_nama: 'Pak Joko Susilo',
      surat_jalan_kode: `#SJ-${new Date().getFullYear()}-${matchingId}`
    });
    await refreshData();
  };

  const confirmPickup = async (matchingId: string) => {
    const match = matchings.find(m => m.id === matchingId);
    if (!match) return;

    await db.updateMatchingFields(matchingId, {
      status: 'sudah_diambil',
      tanggal_selesai: 'Baru saja',
      rating: 5.0,
      komentar: 'Kertas bersih, rapi, dan terverifikasi di timbangan drop point.'
    });

    if (match.listing_kertas_id) {
       await db.updateListingFields(match.listing_kertas_id, { status: 'sudah_diambil' });
    }
    
    const tong = tongList.find(t => t.id === match.tong_id);
    if (tong) {
      await db.updateTongFields(tong.id, {
        status: 'kosong',
        berat_kg: Math.max(0, tong.berat_kg - match.jumlah_kg),
        jadwal_pickup: undefined,
        catatan: 'Baru saja diangkut oleh mitra pabrik'
      });
    }

    const unit = units.find(u => u.id === match.unit_id);
    if (unit) {
       await db.updateUnitFields(unit.id, {
         total_kg_tersalurkan: unit.total_kg_tersalurkan + match.jumlah_kg,
         eco_points: unit.eco_points + match.eco_points
       } as any);
    }
    
    await db.processPayment(match);
    await refreshData();
  };

  const confirmUnitPlaced = async (listingId: string) => {
    await db.updateListingFields(listingId, { status: 'siap_pickup' });
    await refreshData();
  };

  const emptyTong = async (tongId: string) => {
    await db.updateTongFields(tongId, {
       status: 'kosong',
       berat_kg: 0,
       catatan: 'Baru saja diangkut & dikosongkan oleh armada mitra pabrik'
    });
    await db.updateListingsByTong(tongId, { status: 'sudah_diambil' });
    await db.updateMatchingsByTong(tongId, { status: 'sudah_diambil', tanggal_selesai: 'Baru saja' });
    await refreshData();
  };

  const requestSecondTong = async (unitId: string) => {
    const unit = units.find(u => u.id === unitId) || units[0];
    const unitTongs = tongList.filter(t => t.unit_id === unit.id);
    const available = unitTongs.find(t => t.berat_kg < t.kapasitas_max_kg);
    if (available) return available;

    const newTongId = `tong-${unit.inisial.toLowerCase()}-2`;
    const existing = tongList.find(t => t.id === newTongId);
    if (existing) return existing;

    const newTong: Tong = {
      id: newTongId,
      unit_id: unit.id,
      unit_nama: unit.nama_unit,
      nama_tong: `Tong ${unit.inisial} No. 2`,
      nomor: `${unit.inisial}-02`,
      lokasi_spesifik: `Gedung Serbaguna - Sayap ${unit.inisial} • Kotak 2`,
      status: 'kosong',
      berat_kg: 0,
      kapasitas_max_kg: 120,
      tipe_kertas: 'Standby Siap Diisi',
      catatan: 'Wadah tong cadangan resmi diaktifkan karena Tong No. 1 penuh'
    };
    await db.upsertTong(newTong);
    await refreshData();
    return newTong;
  };

  const addNewUnitAndTong = async (data: any) => {
    const cleanInisial = data.inisial.toUpperCase().trim() || 'UNT';
    const unitId = `unit-${cleanInisial.toLowerCase()}-${Date.now()}`;
    const primaryTongId = `tong-${cleanInisial.toLowerCase()}-1`;
    const primaryNamaTong = `Tong ${cleanInisial} No. 1 (Slot ${cleanInisial} 1-5)`;

    const newUnit: UnitKampus = {
      id: unitId,
      nama_unit: data.namaUnit,
      inisial: cleanInisial,
      jenis: data.jenis,
      lokasi_detail: data.lokasiDetail,
      pic_nama: data.picNama || 'Koordinator Unit',
      kontak_pic: data.kontakPic || '08123456789',
      tong_id: primaryTongId,
      tong_nama: primaryNamaTong,
      total_kg_tersalurkan: 0,
      eco_points: 0
    };

    const newTongs: Tong[] = [1, 2, 3, 4, 5].map(idx => ({
      id: `tong-${cleanInisial.toLowerCase()}-${idx}`,
      unit_id: unitId,
      unit_nama: data.namaUnit,
      nama_tong: `Tong ${cleanInisial} No. ${idx}`,
      nomor: `${cleanInisial}-0${idx}`,
      lokasi_spesifik: `Gedung Serbaguna - Sayap ${cleanInisial} • Kotak ${idx}`,
      status: 'kosong' as const,
      berat_kg: 0,
      kapasitas_max_kg: data.kapasitasMax || 120,
      tipe_kertas: 'Standby Siap Diisi',
      catatan: `Slot wadah #${idx} unit ${cleanInisial}`
    }));

    await db.upsertUnit(newUnit);
    await db.upsertTongBatch(newTongs);
    await refreshData();
    return { unit: newUnit, tong: newTongs[0] };
  };

  const resolveLaporan = async (id: string) => {
    await db.updateLaporanFields(id, { status: 'sudah_selesai', level: 'selesai' });
    await refreshData();
  };

  const submitLaporan = async (data: any) => {
    if (!currentUser) return;
    const newLap: LaporanMasalah = {
      id: `flag-${Date.now().toString().slice(-4)}`,
      tong_nama: data.tongNama,
      unit_nama: data.unitNama,
      pelapor_id: currentUser.id,
      pelapor_nama: currentUser.nama,
      alasan: data.alasan,
      detail: data.detail,
      level: data.level,
      status: 'menunggu_tindakan',
      tanggal: 'Baru saja'
    };
    await db.upsertLaporan(newLap);
    await refreshData();
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setIsLoggedIn(false);
    setHasSeenOnboarding(false);
    setAuthStep('onboarding');
    setCurrentUser(null);
  };

  const totalKgTersalurkan = units.reduce((acc, curr) => acc + curr.total_kg_tersalurkan, 0);
  const totalPohon = Math.round((totalKgTersalurkan / 1000) * 17);
  const totalAirBersih = Math.round(totalKgTersalurkan * 26);

  return (
    <AppContext.Provider
      value={{
        role,
        currentUser,
        isLoggedIn,
        hasSeenOnboarding,
        authStep,
        completeOnboarding,
        setAuthStep,
        login,
        registerPenyalur,
        registerPenerima,
        logout,
        setRole,
        units,
        tongList,
        listings,
        permintaanList,
        matchings,
        laporanList,
        activeRoute,
        setActiveRoute,
        selectedMatchingId,
        setSelectedMatchingId,
        selectedListingId,
        setSelectedListingId,
        createListing,
        createPermintaan,
        schedulePickup,
        confirmPickup,
        confirmUnitPlaced,
        emptyTong,
        requestSecondTong,
        addNewUnitAndTong,
        resolveLaporan,
        submitLaporan,
        resetDemoData,
        totalKgTersalurkan,
        totalPohon,
        totalAirBersih,
        saldoSekarang,
        riwayatSaldo,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
