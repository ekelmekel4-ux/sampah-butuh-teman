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
  RiwayatPembayaran,
  AppNotification
} from '../types';
import {
  APP_BRAND,
  HARGA_PER_KG,
  HARGA_DEFAULT_PER_KG,
  INITIAL_USERS,
  INITIAL_UNITS,
  INITIAL_TONG,
  INITIAL_LISTINGS,
  INITIAL_PERMINTAAN,
  INITIAL_MATCHINGS,
  INITIAL_LAPORAN,
  INITIAL_RIWAYAT_PEMBAYARAN,
  INITIAL_NOTIFIKASI
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
  schedulePickup: (matchingId: string, tanggal: string, jam: string, nopol?: string, driver?: string) => Promise<void>;
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
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  payTransaction: (matchingId: string, metode?: string) => Promise<{ success: boolean; message: string }>;
  withdrawUnitBalance: (unitId: string, jumlah: number, bank: string, norek: string) => Promise<{ success: boolean; message: string }>;
  toastNotification: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'sbt_current_role_v3',
  IS_LOGGED_IN: 'sbt_logged_in_v3',
  HAS_SEEN_ONBOARDING: 'sbt_seen_onboarding_v3',
  CURRENT_USER: 'sbt_current_user_v3',
  MATCHINGS: 'sbt_matchings_v3',
  SALDO_MAP: 'sbt_saldo_map_v3',
  RIWAYAT_PEMBAYARAN: 'sbt_riwayat_pembayaran_v3',
  NOTIFIKASI: 'sbt_notifikasi_v3',
};

const DEFAULT_SALDO_MAP: Record<string, number> = {
  'unit-ftd': 180000,
  'unit-feb': 120000,
  'unit-baa': 82500,
  'unit-fikom': 50000,
  'perusahaan-mdl': 0,
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

  const [units, setUnits] = useState<UnitKampus[]>(INITIAL_UNITS);
  const [tongList, setTongList] = useState<Tong[]>(INITIAL_TONG);
  const [listings, setListings] = useState<ListingKertas[]>(INITIAL_LISTINGS);
  const [permintaanList, setPermintaanList] = useState<PermintaanKertas[]>(INITIAL_PERMINTAAN);
  
  const [matchings, setMatchings] = useState<MatchingTransaksi[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATCHINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_MATCHINGS;
  });

  const [laporanList, setLaporanList] = useState<LaporanMasalah[]>(INITIAL_LAPORAN);

  const [saldoMap, setSaldoMap] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SALDO_MAP);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_SALDO_MAP;
  });

  const [riwayatSaldo, setRiwayatSaldo] = useState<RiwayatPembayaran[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RIWAYAT_PEMBAYARAN);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_RIWAYAT_PEMBAYARAN;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFIKASI);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_NOTIFIKASI;
  });

  const [toastNotification, setToastNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Compute active balance according to active logged-in user or role
  const currentOwnerId = currentUser?.role === 'unit' 
    ? (currentUser.unit_id || 'unit-ftd')
    : currentUser?.role === 'perusahaan'
    ? (currentUser.perusahaan_id || 'perusahaan-mdl')
    : 'admin';

  const saldoSekarang = currentOwnerId === 'admin'
    ? Object.values(saldoMap).reduce((a, b) => a + b, 0)
    : (saldoMap[currentOwnerId] ?? 0);

  // Notification helper methods
  const filteredNotifications = notifications.filter(n => {
    if (n.target_role === 'all') return true;
    if (currentUser?.role && n.target_role === currentUser.role) {
      if (!n.target_id) return true;
      const myId = currentUser.role === 'unit' ? (currentUser.unit_id || 'unit-ftd') : (currentUser.perusahaan_id || 'perusahaan-mdl');
      return n.target_id === myId;
    }
    return false;
  });

  const unreadNotificationCount = filteredNotifications.filter(n => !n.dibaca).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, dibaca: true } : n);
      localStorage.setItem(STORAGE_KEYS.NOTIFIKASI, JSON.stringify(next));
      return next;
    });
  };

  const clearAllNotifications = () => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, dibaca: true }));
      localStorage.setItem(STORAGE_KEYS.NOTIFIKASI, JSON.stringify(next));
      return next;
    });
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastNotification({ message, type });
  };

  const hideToast = () => {
    setToastNotification(null);
  };

  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        setToastNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATCHINGS, JSON.stringify(matchings));
  }, [matchings]);

  const refreshData = async () => {
    try {
      const data = await db.loadAllData();
      if (data.units && data.units.length > 0) setUnits(data.units);
      if (data.tongList && data.tongList.length > 0) setTongList(data.tongList);
      if (data.listings && data.listings.length > 0) setListings(data.listings);
      if (data.permintaanList && data.permintaanList.length > 0) setPermintaanList(data.permintaanList);
      if (data.matchings && data.matchings.length > 0) {
        // preserve local payment statuses
        setMatchings(prev => {
          const map = new Map(prev.map(m => [m.id, m]));
          return data.matchings.map(m => ({
            ...m,
            status_pembayaran: map.get(m.id)?.status_pembayaran || m.status_pembayaran,
            metode_pembayaran: map.get(m.id)?.metode_pembayaran || m.metode_pembayaran,
            tanggal_bayar: map.get(m.id)?.tanggal_bayar || m.tanggal_bayar,
            nomor_referensi_bayar: map.get(m.id)?.nomor_referensi_bayar || m.nomor_referensi_bayar,
          }));
        });
      }
      if (data.laporanList && data.laporanList.length > 0) setLaporanList(data.laporanList);

      if (currentUser) {
         const ownerId = currentUser.role === 'unit' ? currentUser.unit_id : currentUser.perusahaan_id;
         if (ownerId) {
            const s = await db.fetchSaldo(ownerId);
            if (s && s.jumlah > 0) {
              setSaldoMap(prev => ({ ...prev, [ownerId]: s.jumlah }));
            }
            const r = await db.fetchRiwayatPembayaran(ownerId);
            if (r && r.length > 0) {
              setRiwayatSaldo(r);
            }
         }
      }
    } catch (err) {
      console.warn('[AppContext] Supabase offline or fetch failed, using local fallback state:', err);
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

  const schedulePickup = async (
    matchingId: string,
    tanggal: string,
    jam: string,
    nopol: string = 'B 9821 PQL',
    driver: string = 'Pak Joko Susilo'
  ) => {
    const suratJalan = `#SJ-${new Date().getFullYear()}-${matchingId}`;

    setMatchings(prev => {
      const next = prev.map(m => {
        if (m.id === matchingId) {
          return {
            ...m,
            tanggal_jemput: tanggal,
            jam_jemput: jam,
            nopol_armada: nopol,
            driver_nama: driver,
            surat_jalan_kode: suratJalan,
            status: 'menunggu_diambil' as const,
          };
        }
        return m;
      });
      localStorage.setItem(STORAGE_KEYS.MATCHINGS, JSON.stringify(next));
      return next;
    });

    const match = matchings.find(m => m.id === matchingId);
    if (match) {
      const unitNotif: AppNotification = {
        id: `notif-${Date.now()}-sch`,
        target_role: 'unit',
        target_id: match.unit_id,
        judul: 'Jadwal Penjemputan Terkonfirmasi!',
        pesan: `${match.perusahaan_nama} telah menjadwalkan penjemputan ${match.jenis_kertas} pada ${tanggal}, ${jam}.`,
        tipe: 'penjemputan',
        link: '/unit/status',
        dibaca: false,
        created_at: 'Baru saja',
      };
      setNotifications(prev => {
        const next = [unitNotif, ...prev];
        localStorage.setItem(STORAGE_KEYS.NOTIFIKASI, JSON.stringify(next));
        return next;
      });
    }

    showToast(`Jadwal penjemputan (${tanggal}, ${jam}) berhasil dikonfirmasi!`, 'success');

    try {
      await db.updateMatchingFields(matchingId, {
        tanggal_jemput: tanggal,
        jam_jemput: jam,
        nopol_armada: nopol,
        driver_nama: driver,
        surat_jalan_kode: suratJalan,
      });
    } catch (e) {
      console.warn('[schedulePickup] Supabase sync deferred (offline):', e);
    }
  };

  const confirmPickup = async (matchingId: string) => {
    const match = matchings.find(m => m.id === matchingId);
    if (!match) return;

    // Synchronous state updates
    setMatchings(prev => prev.map(m => m.id === matchingId ? {
      ...m,
      status: 'sudah_diambil',
      tanggal_selesai: 'Baru saja',
      rating: 5.0,
      komentar: 'Kertas bersih, rapi, dan terverifikasi di timbangan drop point.'
    } : m));

    if (match.listing_kertas_id) {
      setListings(prev => prev.map(l => l.id === match.listing_kertas_id ? { ...l, status: 'sudah_diambil' } : l));
    }

    setTongList(prev => prev.map(t => t.id === match.tong_id ? {
      ...t,
      status: 'kosong',
      berat_kg: Math.max(0, t.berat_kg - match.jumlah_kg),
      jadwal_pickup: undefined,
      catatan: 'Baru saja diangkut oleh mitra pabrik'
    } : t));

    setUnits(prev => prev.map(u => u.id === match.unit_id ? {
      ...u,
      total_kg_tersalurkan: u.total_kg_tersalurkan + match.jumlah_kg,
      eco_points: u.eco_points + match.eco_points
    } : u));

    showToast(`Penjemputan ${match.jumlah_kg} Kg kertas oleh ${match.perusahaan_nama} telah dikonfirmasi!`, 'success');

    // Background DB sync
    try {
      await db.updateMatchingFields(matchingId, {
        status: 'sudah_diambil',
        tanggal_selesai: 'Baru saja',
        rating: 5.0,
        komentar: 'Kertas bersih, rapi, dan terverifikasi di timbangan drop point.'
      });
      if (match.listing_kertas_id) {
        await db.updateListingFields(match.listing_kertas_id, { status: 'sudah_diambil' });
      }
      await db.updateTongFields(match.tong_id, {
        status: 'kosong',
        berat_kg: Math.max(0, (tongList.find(t => t.id === match.tong_id)?.berat_kg || 0) - match.jumlah_kg),
        jadwal_pickup: undefined,
        catatan: 'Baru saja diangkut oleh mitra pabrik'
      });
      const unit = units.find(u => u.id === match.unit_id);
      if (unit) {
        await db.updateUnitFields(unit.id, {
          total_kg_tersalurkan: unit.total_kg_tersalurkan + match.jumlah_kg,
          eco_points: unit.eco_points + match.eco_points
        } as any);
      }
    } catch (e) {
      console.warn('[confirmPickup] Supabase sync deferred (offline):', e);
    }
  };

  const payTransaction = async (matchingId: string, metode: string = 'Transfer Dompet Kampus') => {
    const match = matchings.find(m => m.id === matchingId);
    if (!match) return { success: false, message: 'Transaksi tidak ditemukan.' };

    const refNo = `PAY-${Date.now().toString().slice(-8)}`;
    const nowWib = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';

    // 1. Update matching in React state & localStorage
    setMatchings(prev => {
      const next = prev.map(m => {
        if (m.id === matchingId) {
          return {
            ...m,
            status: 'sudah_diambil',
            status_pembayaran: 'lunas' as const,
            metode_pembayaran: metode,
            tanggal_bayar: nowWib,
            nomor_referensi_bayar: refNo,
            tanggal_selesai: m.tanggal_selesai || 'Baru saja',
            rating: m.rating || 5.0,
            komentar: m.komentar || 'Pembayaran berhasil dikonfirmasi ke Dompet Unit.'
          };
        }
        return m;
      });
      localStorage.setItem(STORAGE_KEYS.MATCHINGS, JSON.stringify(next));
      return next;
    });

    // 2. Update Listing and Tong
    if (match.listing_kertas_id) {
      setListings(prev => prev.map(l => l.id === match.listing_kertas_id ? { ...l, status: 'sudah_diambil' } : l));
    }
    setTongList(prev => prev.map(t => t.id === match.tong_id ? {
      ...t,
      status: 'kosong',
      berat_kg: Math.max(0, t.berat_kg - match.jumlah_kg),
      catatan: 'Kertas telah diangkut & dibayar oleh mitra pabrik'
    } : t));

    // 3. Update Unit stats and Unit balance
    const targetUnitId = match.unit_id;
    setUnits(prev => prev.map(u => {
      if (u.id === targetUnitId) {
        const newSaldo = (u.saldo || 0) + match.nilai_rupiah;
        return {
          ...u,
          total_kg_tersalurkan: u.total_kg_tersalurkan + match.jumlah_kg,
          eco_points: u.eco_points + match.eco_points,
          saldo: newSaldo
        };
      }
      return u;
    }));

    // 4. Update saldoMap for target unit
    setSaldoMap(prev => {
      const next = {
        ...prev,
        [targetUnitId]: (prev[targetUnitId] || 0) + match.nilai_rupiah
      };
      localStorage.setItem(STORAGE_KEYS.SALDO_MAP, JSON.stringify(next));
      return next;
    });

    // 5. Create new payment record
    const newPaymentRecord: RiwayatPembayaran = {
      id: refNo,
      matching_transaksi_id: match.id,
      dari_id: match.perusahaan_id,
      dari_nama: match.perusahaan_nama,
      ke_id: match.unit_id,
      ke_nama: match.unit_nama,
      jumlah: match.nilai_rupiah,
      jenis: 'pembayaran_kertas',
      status: 'berhasil',
      catatan: `Pembayaran ${match.jenis_kertas} (${match.jumlah_kg} Kg)`,
      created_at: new Date().toISOString(),
    };

    setRiwayatSaldo(prev => {
      const next = [newPaymentRecord, ...prev];
      localStorage.setItem(STORAGE_KEYS.RIWAYAT_PEMBAYARAN, JSON.stringify(next));
      return next;
    });

    // 6. Create Notifications for both parties
    const unitNotif: AppNotification = {
      id: `notif-${Date.now()}-u`,
      target_role: 'unit',
      target_id: match.unit_id,
      judul: 'Dana Pembayaran Masuk!',
      pesan: `${match.perusahaan_nama} telah membayar Rp ${match.nilai_rupiah.toLocaleString('id-ID')} ke Dompet Kas Unit Anda (${match.jenis_kertas}).`,
      tipe: 'pembayaran',
      link: '/unit/dompet',
      dibaca: false,
      created_at: 'Baru saja'
    };

    const mitraNotif: AppNotification = {
      id: `notif-${Date.now()}-m`,
      target_role: 'perusahaan',
      target_id: match.perusahaan_id,
      judul: 'Pembayaran Berhasil Diverifikasi',
      pesan: `Pembayaran Rp ${match.nilai_rupiah.toLocaleString('id-ID')} untuk ${match.unit_nama} sukses diproses via ${metode}.`,
      tipe: 'pembayaran',
      link: '/perusahaan/riwayat',
      dibaca: false,
      created_at: 'Baru saja'
    };

    setNotifications(prev => {
      const next = [unitNotif, mitraNotif, ...prev];
      localStorage.setItem(STORAGE_KEYS.NOTIFIKASI, JSON.stringify(next));
      return next;
    });

    // 7. Trigger visual Toast
    showToast(`Pembayaran Rp ${match.nilai_rupiah.toLocaleString('id-ID')} ke Dompet ${match.unit_nama} BERHASIL!`, 'success');

    // 8. Background Supabase sync (graceful fallback)
    try {
      await db.updateMatchingFields(matchingId, {
        status: 'sudah_diambil',
        tanggal_selesai: 'Baru saja',
        rating: 5.0
      });
      await db.processPayment(match);
    } catch (e) {
      console.warn('[payTransaction] Supabase sync deferred (offline):', e);
    }

    return { success: true, message: 'Pembayaran berhasil diselesaikan!' };
  };

  const withdrawUnitBalance = async (unitId: string, jumlah: number, bank: string, norek: string) => {
    const currentBalance = saldoMap[unitId] || 0;
    if (jumlah <= 0 || jumlah > currentBalance) {
      return { success: false, message: 'Nominal penarikan melebihi saldo kas yang tersedia.' };
    }

    const refNo = `WD-${Date.now().toString().slice(-8)}`;
    setSaldoMap(prev => {
      const next = { ...prev, [unitId]: Math.max(0, (prev[unitId] || 0) - jumlah) };
      localStorage.setItem(STORAGE_KEYS.SALDO_MAP, JSON.stringify(next));
      return next;
    });

    const newPaymentRecord: RiwayatPembayaran = {
      id: refNo,
      matching_transaksi_id: `withdraw-${unitId}`,
      dari_id: unitId,
      dari_nama: units.find(u => u.id === unitId)?.nama_unit || 'Unit Kampus',
      ke_id: `bank-${bank.toLowerCase()}`,
      ke_nama: `${bank} (${norek})`,
      jumlah: jumlah,
      jenis: 'penarikan',
      status: 'berhasil',
      catatan: `Penarikan Kas Operasional Unit ke ${bank} - ${norek}`,
      created_at: new Date().toISOString(),
    };

    setRiwayatSaldo(prev => {
      const next = [newPaymentRecord, ...prev];
      localStorage.setItem(STORAGE_KEYS.RIWAYAT_PEMBAYARAN, JSON.stringify(next));
      return next;
    });

    const notif: AppNotification = {
      id: `notif-${Date.now()}-wd`,
      target_role: 'unit',
      target_id: unitId,
      judul: 'Penarikan Dana Berhasil',
      pesan: `Pengajuan penarikan Rp ${jumlah.toLocaleString('id-ID')} ke rekening ${bank} (${norek}) berhasil diproses.`,
      tipe: 'pembayaran',
      link: '/unit/dompet',
      dibaca: false,
      created_at: 'Baru saja'
    };

    setNotifications(prev => {
      const next = [notif, ...prev];
      localStorage.setItem(STORAGE_KEYS.NOTIFIKASI, JSON.stringify(next));
      return next;
    });

    showToast(`Penarikan dana Rp ${jumlah.toLocaleString('id-ID')} ke rekening ${bank} berhasil!`, 'success');
    return { success: true, message: 'Penarikan berhasil diproses.' };
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
    localStorage.removeItem(STORAGE_KEYS.MATCHINGS);
    localStorage.removeItem(STORAGE_KEYS.SALDO_MAP);
    localStorage.removeItem(STORAGE_KEYS.RIWAYAT_PEMBAYARAN);
    localStorage.removeItem(STORAGE_KEYS.NOTIFIKASI);

    setMatchings(INITIAL_MATCHINGS);
    setUnits(INITIAL_UNITS);
    setTongList(INITIAL_TONG);
    setListings(INITIAL_LISTINGS);
    setPermintaanList(INITIAL_PERMINTAAN);
    setLaporanList(INITIAL_LAPORAN);
    setSaldoMap(DEFAULT_SALDO_MAP);
    setRiwayatSaldo(INITIAL_RIWAYAT_PEMBAYARAN);
    setNotifications(INITIAL_NOTIFIKASI);

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
        notifications: filteredNotifications,
        unreadNotificationCount,
        markNotificationAsRead,
        clearAllNotifications,
        payTransaction,
        withdrawUnitBalance,
        toastNotification,
        showToast,
        hideToast,
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
