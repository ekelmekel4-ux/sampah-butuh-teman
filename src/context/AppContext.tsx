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
    alamat: string;
    kota: string;
    kodePos?: string;
    koordinat: { lat: number; lng: number };
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  updateProfile: (data: Partial<Pick<User, 'nama' | 'email' | 'kontak' | 'avatar_url' | 'alamat' | 'kota' | 'kode_pos' | 'koordinat'>>) => Promise<{ success: boolean; message?: string }>;
  updateUnitProfile: (
    unitData: Partial<Pick<UnitKampus, 'nama_unit' | 'inisial' | 'jenis' | 'lokasi_detail' | 'pic_nama' | 'kontak_pic'>>,
    userData?: Partial<Pick<User, 'nama' | 'email' | 'kontak' | 'avatar_url'>>
  ) => Promise<{ success: boolean; message?: string }>;
  units: UnitKampus[];
  tongList: Tong[];
  listings: ListingKertas[];
  permintaanList: PermintaanKertas[];
  matchings: MatchingTransaksi[];
  laporanList: LaporanMasalah[];
  /** Semua akun terdaftar (untuk foto profil mitra di peta admin). */
  profiles: User[];
  activeRoute: string;
  setActiveRoute: (route: string) => void;
  selectedMatchingId: string | null;
  setSelectedMatchingId: (id: string | null) => void;
  selectedListingId: string | null;
  setSelectedListingId: (id: string | null) => void;
  preselectTongId: string | null;
  setPreselectTongId: (id: string | null) => void;
  leaderboardUnitId: string | null;
  setLeaderboardUnitId: (id: string | null) => void;
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
    listing_kertas_id?: string;
    matching_id?: string;
    tong_id?: string;
    foto?: string[];
  }) => Promise<{ success: boolean; message?: string }>;
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
  verifyQrCode: (matchingId: string, scannedCode: string) => Promise<{ success: boolean; message: string }>;
  rateTransaction: (
    matchingId: string,
    payload: { rating: number; qc: string[]; catatan: string }
  ) => Promise<{ success: boolean; message: string }>;
  getVerificationCode: (matching: MatchingTransaksi) => string;
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

/** Kuota minimal (Kg) agar batch kertas di tong siap dijemput mitra. */
const KUOTA_JEMPUT = 10;

const DEFAULT_SALDO_MAP: Record<string, number> = {
  'unit-ftd': 180000,
  'unit-feb': 120000,
  'unit-baa': 82500,
  'unit-fikom': 50000,
  'perusahaan-mdl': 0,
};

const randomNonce = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();

const qrChecksum = (matchingId: string, nonce: string) => {
  let hash = 0;
  const input = `${matchingId}:${nonce}`;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash * 31) + input.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36).toUpperCase().padStart(4, '0').slice(-4);
};

const getExpectedNonce = (m: MatchingTransaksi) =>
  m.verification_nonce || `DEMO-${m.id.replace(/[^A-Z0-9]/gi, '').slice(-6).toUpperCase()}`;

const buildVerificationCode = (m: MatchingTransaksi) => {
  const nonce = getExpectedNonce(m);
  return `SBT-V1:${m.id}:${nonce}:${qrChecksum(m.id, nonce)}`;
};

const parseVerificationCode = (raw: string) => {
  const code = raw.trim().toUpperCase();
  const found = code.match(/^SBT-V1:([^:]+):([^:]+):([A-Z0-9]{4})$/);
  if (!found) return null;
  return { matchingId: found[1], nonce: found[2], checksum: found[3] };
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
  const [preselectTongId, setPreselectTongId] = useState<string | null>(null);
  const [leaderboardUnitId, setLeaderboardUnitId] = useState<string | null>(null);

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
  // Akun-akun yang terdaftar (dipakai admin untuk memuat foto profil mitra).
  const [profiles, setProfiles] = useState<User[]>([]);

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
            verification_nonce: map.get(m.id)?.verification_nonce || m.verification_nonce,
            verification_status: map.get(m.id)?.verification_status || m.verification_status,
            verified_at: map.get(m.id)?.verified_at || m.verified_at,
            verified_by: map.get(m.id)?.verified_by || m.verified_by,
            last_verification_note: map.get(m.id)?.last_verification_note || m.last_verification_note,
            rating: map.get(m.id)?.rating ?? m.rating,
            komentar: map.get(m.id)?.komentar ?? m.komentar,
            qc_penilaian: map.get(m.id)?.qc_penilaian ?? m.qc_penilaian,
            rating_oleh: map.get(m.id)?.rating_oleh ?? m.rating_oleh,
            rating_at: map.get(m.id)?.rating_at ?? m.rating_at,
          }));
        });
      }
      if (data.laporanList && data.laporanList.length > 0) setLaporanList(data.laporanList);
      const akun = await db.fetchProfiles();
      if (akun.length > 0) setProfiles(akun);

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

  // Admin perlu data paling fresh (mis. laporan baru dari unit/mitra) setiap membuka menu admin.
  useEffect(() => {
    if (activeRoute.startsWith('/admin')) {
      refreshData();
    }
  }, [activeRoute]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  // Setiap kali pindah halaman, scroll kembali ke paling atas.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeRoute]);

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

  const registerPenerima = async ({ namaPt, nib, email, kontakDispatcher, alamat, kota, kodePos, koordinat }: any) => {
    const perusahaanId = `perusahaan-${Date.now().toString().slice(-4)}`;
    const newUser: User = {
      id: `user-${perusahaanId}`,
      nama: `${namaPt} (NIB: ${nib})`,
      email: email.trim().toLowerCase(),
      role: 'perusahaan',
      kontak: kontakDispatcher,
      perusahaan_id: perusahaanId,
      avatar_url: APP_BRAND.avatarUrl,
      alamat: alamat?.trim() || undefined,
      kota: kota?.trim() || undefined,
      kode_pos: kodePos?.trim() || undefined,
      koordinat: koordinat && Number.isFinite(koordinat.lat) && Number.isFinite(koordinat.lng)
        ? { lat: koordinat.lat, lng: koordinat.lng }
        : undefined
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

  const updateProfile = async (
    data: Partial<Pick<User, 'nama' | 'email' | 'kontak' | 'avatar_url' | 'alamat' | 'kota' | 'kode_pos' | 'koordinat'>>
  ) => {
    if (!currentUser) {
      return { success: false, message: 'Belum ada akun aktif.' };
    }

    const updatedUser: User = { ...currentUser, ...data };
    setCurrentUser(updatedUser);

    try {
      await db.upsertProfile(updatedUser);
    } catch (e) {
      console.warn('[updateProfile] Supabase sync deferred (offline):', e);
    }

    return { success: true };
  };

  const updateUnitProfile = async (
    unitData: Partial<Pick<UnitKampus, 'nama_unit' | 'inisial' | 'jenis' | 'lokasi_detail' | 'pic_nama' | 'kontak_pic'>>,
    userData?: Partial<Pick<User, 'nama' | 'email' | 'kontak' | 'avatar_url'>>
  ) => {
    if (!currentUser) {
      return { success: false, message: 'Belum ada akun unit yang aktif.' };
    }

    const unitId = currentUser.unit_id || units[0]?.id;
    const unit = units.find(u => u.id === unitId);
    if (!unit) {
      return { success: false, message: 'Data unit kampus tidak ditemukan.' };
    }

    const updatedUnit: UnitKampus = { ...unit, ...unitData };
    const updatedUser: User = { ...currentUser, ...(userData || {}) };

    setUnits(prev => prev.map(u => (u.id === unit.id ? updatedUnit : u)));
    setTongList(prev => prev.map(t => (t.unit_id === unit.id ? { ...t, unit_nama: updatedUnit.nama_unit } : t)));
    setListings(prev => prev.map(l => (l.unit_id === unit.id ? { ...l, unit_nama: updatedUnit.nama_unit } : l)));
    if (userData) setCurrentUser(updatedUser);

    try {
      await db.updateUnitFields(unit.id, unitData);
      if (userData) await db.upsertProfile(updatedUser);

      if (unitData.nama_unit && unitData.nama_unit !== unit.nama_unit) {
        const unitTongs = tongList.filter(t => t.unit_id === unit.id);
        const unitListings = listings.filter(l => l.unit_id === unit.id);
        await Promise.all([
          ...unitTongs.map(t => db.updateTongFields(t.id, { unit_nama: unitData.nama_unit })),
          ...unitListings.map(l => db.updateListingFields(l.id, { unit_nama: unitData.nama_unit })),
        ]);
      }
    } catch (e) {
      console.warn('[updateUnitProfile] Supabase sync deferred (offline):', e);
    }

    return { success: true };
  };

  const createListing = async ({ unitId, tongId, jumlahKg, kategori, kategoriLabel, kondisi, foto }: any) => {
    const unit = units.find(u => u.id === unitId) || units[0];
    const tong = (tongId ? tongList.find(t => t.id === tongId) : null) || tongList.find(t => t.unit_id === unit.id) || tongList[0];

    const newTongWeight = tong.berat_kg + jumlahKg;
    const isQuotaMet = newTongWeight >= KUOTA_JEMPUT;
    const hargaKg = HARGA_PER_KG[kategori as KategoriKertas] ?? HARGA_DEFAULT_PER_KG;

    // Model batch: satu tong = satu batch kertas yang sedang terkumpul.
    // Setoran berikutnya digabung ke batch yang sama, bukan membuat listing baru.
    const existingListing = listings.find(l => l.tong_id === tong.id && l.status !== 'sudah_diambil');
    let resultingListing: ListingKertas;
    let batchSiapJemput = false;

    const buildMatching = (listingId: string, totalKg: number, label: string): MatchingTransaksi => {
      const req = permintaanList[0];
      return {
        id: `trx-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`,
        listing_kertas_id: listingId,
        permintaan_id: req?.id,
        unit_id: unit.id,
        unit_nama: unit.nama_unit,
        tong_id: tong.id,
        tong_nama: tong.nama_tong,
        perusahaan_id: req?.perusahaan_id || 'perusahaan-mdl',
        perusahaan_nama: req?.perusahaan_nama || 'PT Mandiri Daur Lestari',
        jenis_kertas: `${totalKg} Kg ${label}`,
        jumlah_kg: totalKg,
        nilai_rupiah: totalKg * hargaKg,
        eco_points: totalKg * 2,
        skor_kecocokan: 96,
        status: 'menunggu_diambil',
        tanggal_jemput: 'Jadwal Otomatis Siap Dipilih',
        jam_jemput: '13:00 - 16:00 WIB',
      };
    };

    if (existingListing) {
      // Agregasi ke batch yang sedang terkumpul
      const updatedJumlahKg = existingListing.jumlah_kg + jumlahKg;
      const mergedKategoriLabel = existingListing.kategori_label.includes(kategoriLabel)
        ? existingListing.kategori_label
        : `${existingListing.kategori_label}, ${kategoriLabel}`;
      const mergedKondisi = [...new Set([...(existingListing.kondisi || []), ...kondisi])];
      const nextStatus = isQuotaMet ? 'siap_pickup' : 'menunggu_mitra';
      batchSiapJemput = isQuotaMet && existingListing.status !== 'siap_pickup';

      await db.updateListingFields(existingListing.id, {
        jumlah_kg: updatedJumlahKg,
        kategori_label: mergedKategoriLabel,
        kondisi: mergedKondisi,
        status: nextStatus,
        ...(foto ? { foto } : {}),
      });

      resultingListing = {
        ...existingListing,
        jumlah_kg: updatedJumlahKg,
        kategori_label: mergedKategoriLabel,
        kondisi: mergedKondisi,
        status: nextStatus,
        foto: foto || existingListing.foto,
      };

      // Matching dibuat saat kuota jemput terpenuhi, lalu diperbarui tiap setoran berikutnya.
      const existingMatch = existingListing.matching_id
        ? matchings.find(m => m.id === existingListing.matching_id)
        : null;

      if (existingMatch) {
        await db.updateMatchingFields(existingMatch.id, {
          jumlah_kg: existingMatch.jumlah_kg + jumlahKg,
          jenis_kertas: existingMatch.jenis_kertas.includes(kategoriLabel)
            ? existingMatch.jenis_kertas
            : `${existingMatch.jenis_kertas}, ${kategoriLabel}`,
          nilai_rupiah: existingMatch.nilai_rupiah + jumlahKg * hargaKg,
          eco_points: existingMatch.eco_points + jumlahKg * 2,
          status: isQuotaMet ? 'menunggu_diambil' : existingMatch.status,
        });
      } else if (isQuotaMet) {
        const newMatch = buildMatching(existingListing.id, updatedJumlahKg, mergedKategoriLabel);
        await db.upsertMatching(newMatch);
        await db.updateListingFields(existingListing.id, { matching_id: newMatch.id });
        resultingListing.matching_id = newMatch.id;
      }
    } else {
      // Batch baru
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
      batchSiapJemput = isQuotaMet;

      if (isQuotaMet) {
        const newMatch = buildMatching(newListingId, jumlahKg, kategoriLabel);
        await db.upsertMatching(newMatch);
        await db.updateListingFields(newListingId, { matching_id: newMatch.id });
        resultingListing.matching_id = newMatch.id;
      }
    }

    await db.updateTongFields(tong.id, {
      status: isQuotaMet ? 'siap_pickup' : 'terisi',
      berat_kg: newTongWeight,
      tipe_kertas: kategoriLabel,
      catatan: isQuotaMet
        ? `Siap dijemput mitra pabrik (kuota terpenuhi: ${newTongWeight} Kg)`
        : `Terkumpul ${newTongWeight}/${KUOTA_JEMPUT} Kg. Kurang ${KUOTA_JEMPUT - newTongWeight} Kg lagi untuk siap dijemput.`
    });
    await db.updateUnitFields(unit.id, {
      total_kg_tersalurkan: unit.total_kg_tersalurkan + jumlahKg,
      eco_points: unit.eco_points + jumlahKg * 2
    } as any);

    // Kabari mitra begitu batch masuk antrean penjemputan.
    if (batchSiapJemput) {
      const mitraNotif: AppNotification = {
        id: `notif-${Date.now()}-mitra`,
        target_role: 'perusahaan',
        target_id: 'perusahaan-mdl',
        judul: 'Batch baru siap dijemput',
        pesan: `${unit.nama_unit} menumpuk ${newTongWeight} Kg di ${tong.nama_tong}. Batch masuk antrean penjemputan mitra.`,
        tipe: 'penjemputan',
        link: '/perusahaan/pasokan',
        dibaca: false,
        created_at: 'Baru saja'
      };
      setNotifications(prev => {
        const next = [mitraNotif, ...prev];
        localStorage.setItem(STORAGE_KEYS.NOTIFIKASI, JSON.stringify(next));
        return next;
      });
    }

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
            status_pembayaran: 'lunas' as const,
            metode_pembayaran: metode,
            tanggal_bayar: nowWib,
            nomor_referensi_bayar: refNo,
            verification_nonce: m.verification_nonce || randomNonce(),
            verification_status: 'belum_diverifikasi' as const
          };
        }
        return m;
      });
      localStorage.setItem(STORAGE_KEYS.MATCHINGS, JSON.stringify(next));
      return next;
    });

    // 2. Pengambilan kertas ditandai saat QR tong discan (lihat verifyQrCode).

    // 3. Update Unit stats and Unit balance
    const targetUnitId = match.unit_id;
    setUnits(prev => prev.map(u => {
      if (u.id === targetUnitId) {
        const newSaldo = (u.saldo || 0) + match.nilai_rupiah;
        return {
          ...u,
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
      await db.processPayment(match);
    } catch (e) {
      console.warn('[payTransaction] Supabase sync deferred (offline):', e);
    }

    return { success: true, message: 'Pembayaran berhasil diselesaikan!' };
  };

  const getVerificationCode = (matching: MatchingTransaksi) => buildVerificationCode(matching);

  const verifyQrCode = async (matchingId: string, scannedCode: string) => {
    const match = matchings.find(m => m.id === matchingId);
    if (!match) {
      showToast('Transaksi tidak ditemukan.', 'error');
      return { success: false, message: 'Transaksi tidak ditemukan.' };
    }

    if (match.status_pembayaran !== 'lunas') {
      showToast('QR belum aktif: pembayaran belum lunas.', 'error');
      return { success: false, message: 'QR belum aktif: pembayaran belum lunas.' };
    }

    const reject = (expectedId: string, message: string, note: string) => {
      setMatchings(prev => {
        const next = prev.map(m =>
          m.id === expectedId
            ? { ...m, verification_status: 'ditolak' as const, last_verification_note: note }
            : m
        );
        localStorage.setItem(STORAGE_KEYS.MATCHINGS, JSON.stringify(next));
        return next;
      });
      showToast(message, 'error');
      return { success: false, message };
    };

    const parsed = parseVerificationCode(scannedCode);
    if (!parsed) {
      return reject(matchingId, 'Ditolak: QR tidak terbaca.', 'Ditolak: format QR tidak valid.');
    }

    if (parsed.matchingId.toUpperCase() !== match.id.toUpperCase()) {
      return reject(match.id, 'Ditolak: QR milik transaksi lain.', 'Ditolak: QR milik transaksi lain.');
    }

    const expectedNonce = getExpectedNonce(match);
    if (parsed.nonce !== expectedNonce || parsed.checksum !== qrChecksum(match.id, expectedNonce)) {
      return reject(match.id, 'Ditolak: kode verifikasi tidak cocok.', 'Ditolak: nonce/ checksum tidak cocok.');
    }

    if (match.verification_status === 'terverifikasi') {
      showToast('QR sudah digunakan sebelumnya.', 'error');
      return { success: false, message: 'QR sudah digunakan sebelumnya.' };
    }

    const verifiedAt = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';

    setMatchings(prev => {
      const next = prev.map(m =>
        m.id === match.id
          ? {
              ...m,
              verification_nonce: expectedNonce,
              verification_status: 'terverifikasi' as const,
              verified_at: verifiedAt,
              verified_by: currentUser?.nama || 'Petugas drop point',
              last_verification_note: 'Terverifikasi di drop point.'
            }
          : m
      );
      localStorage.setItem(STORAGE_KEYS.MATCHINGS, JSON.stringify(next));
      return next;
    });

    // Scan QR = satu-satunya penanda kertas sudah diambil.
    if (match.status !== 'sudah_diambil') {
      setMatchings(prev =>
        prev.map(m =>
          m.id === match.id
            ? {
                ...m,
                status: 'sudah_diambil' as const,
                tanggal_selesai: verifiedAt,
              }
            : m
        )
      );
      if (match.listing_kertas_id) {
        setListings(prev =>
          prev.map(l => (l.id === match.listing_kertas_id ? { ...l, status: 'sudah_diambil' as const } : l))
        );
      }
      setTongList(prev =>
        prev.map(t =>
          t.id === match.tong_id
            ? {
                ...t,
                status: 'kosong' as const,
                berat_kg: Math.max(0, t.berat_kg - match.jumlah_kg),
                catatan: 'Kertas sudah diangkut & diverifikasi lewat QR tong',
              }
            : t
        )
      );

      const pickedNotif: AppNotification = {
        id: `notif-${Date.now()}-qr`,
        target_role: 'unit',
        target_id: match.unit_id,
        judul: 'Kertas Sudah Diangkut Mitra',
        pesan: `${match.jumlah_kg} Kg di ${match.tong_nama} telah diverifikasi lewat QR dan diangkut mitra.`,
        tipe: 'penjemputan',
        link: '/unit/status',
        dibaca: false,
        created_at: 'Baru saja',
      };
      setNotifications(prev => {
        const next = [pickedNotif, ...prev];
        localStorage.setItem(STORAGE_KEYS.NOTIFIKASI, JSON.stringify(next));
        return next;
      });
    }

    try {
      await db.updateMatchingFields(match.id, {
        verification_nonce: expectedNonce,
        verification_status: 'terverifikasi',
        verified_at: verifiedAt,
        verified_by: currentUser?.nama || 'Petugas drop point',
        last_verification_note: 'Terverifikasi di drop point.',
        ...(match.status !== 'sudah_diambil'
          ? { status: 'sudah_diambil', tanggal_selesai: verifiedAt }
          : {})
      } as any);
      if (match.listing_kertas_id && match.status !== 'sudah_diambil') {
        await db.updateListingFields(match.listing_kertas_id, { status: 'sudah_diambil' });
      }
      if (match.status !== 'sudah_diambil') {
        await db.updateTongFields(match.tong_id, {
          status: 'kosong',
          berat_kg: Math.max(0, (tongList.find(t => t.id === match.tong_id)?.berat_kg || 0) - match.jumlah_kg),
          catatan: 'Kertas sudah diangkut & diverifikasi lewat QR tong',
        });
      }
    } catch (e) {
      console.warn('[verifyQrCode] Supabase sync deferred (offline):', e);
    }

    showToast(`QR terverifikasi untuk ${match.tong_nama}.`, 'success');
    return { success: true, message: 'QR terverifikasi.' };
  };

  /**
   * Penilaian kertas oleh mitra (perusahaan): hasil QC + bintang + catatan.
   * Hanya bisa diisi setelah kertas diterima (status `sudah_diambil`).
   */
  const rateTransaction = async (
    matchingId: string,
    payload: { rating: number; qc: string[]; catatan: string }
  ) => {
    const match = matchings.find(m => m.id === matchingId);
    if (!match) {
      showToast('Transaksi tidak ditemukan.', 'error');
      return { success: false, message: 'Transaksi tidak ditemukan.' };
    }

    if (match.status !== 'sudah_diambil') {
      showToast('Penilaian baru bisa diberikan setelah kertas diterima mitra.', 'error');
      return { success: false, message: 'Transaksi belum berstatus selesai.' };
    }

    const rawRating = Number(payload.rating);
    if (!rawRating || rawRating < 1) {
      showToast('Pilih jumlah bintang penilaian terlebih dahulu.', 'error');
      return { success: false, message: 'Rating belum dipilih.' };
    }
    const rating = Math.min(5, Math.max(1, Math.round(rawRating)));

    const qc = (payload.qc || []).filter(Boolean);
    if (qc.length === 0) {
      showToast('Pilih minimal satu hasil pemeriksaan QC kertas.', 'error');
      return { success: false, message: 'Hasil QC belum dipilih.' };
    }

    const catatan = (payload.catatan || '').trim();
    const ratedAt =
      new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB';
    const ratedBy = currentUser?.nama || match.perusahaan_nama;

    setMatchings(prev => {
      const next = prev.map(m =>
        m.id === matchingId
          ? {
              ...m,
              rating,
              qc_penilaian: qc,
              komentar: catatan || undefined,
              rating_oleh: ratedBy,
              rating_at: ratedAt,
            }
          : m
      );
      localStorage.setItem(STORAGE_KEYS.MATCHINGS, JSON.stringify(next));
      return next;
    });

    const notif: AppNotification = {
      id: `notif-${Date.now()}-rating`,
      target_role: 'unit',
      target_id: match.unit_id,
      judul: 'Kertas Anda Dinilai Mitra',
      pesan: `${match.perusahaan_nama} memberi penilaian ${rating}/5 untuk ${match.jenis_kertas} (${match.jumlah_kg} Kg).`,
      tipe: 'sistem',
      link: '/unit/status',
      dibaca: false,
      created_at: 'Baru saja',
    };
    setNotifications(prev => {
      const next = [notif, ...prev];
      localStorage.setItem(STORAGE_KEYS.NOTIFIKASI, JSON.stringify(next));
      return next;
    });

    try {
      // Kolom rating & komentar selalu tersedia di database.
      const ok = await db.updateMatchingFields(matchingId, {
        rating,
        komentar: catatan || null,
      } as any);
      if (ok) {
        // Rincian QC butuh kolom tambahan (opsional, lihat supabase-migration.sql).
        const okDetail = await db.updateMatchingFields(matchingId, {
          qc_penilaian: qc,
          rating_oleh: ratedBy,
          rating_at: ratedAt,
        } as any);
        if (!okDetail) {
          console.warn(
            '[rateTransaction] Kolom rincian QC belum ada di database. Jalankan ALTER TABLE di supabase-migration.sql.'
          );
        }
      }
    } catch (e) {
      console.warn('[rateTransaction] Supabase sync deferred (offline):', e);
    }

    showToast(`Penilaian ${rating}/5 untuk ${match.jenis_kertas} tersimpan.`, 'success');
    return { success: true, message: 'Penilaian tersimpan.' };
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
    const selesaiAt = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';
    await db.updateTongFields(tongId, {
       status: 'kosong',
       berat_kg: 0,
       catatan: 'Baru saja diangkut & dikosongkan oleh armada mitra pabrik'
    });
    await db.updateListingsByTong(tongId, { status: 'sudah_diambil' });
    await db.updateMatchingsByTong(tongId, { status: 'sudah_diambil', tanggal_selesai: selesaiAt });
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
    if (!currentUser) {
      showToast('Belum ada akun aktif.', 'error');
      return { success: false, message: 'Belum ada akun aktif.' };
    }
    const newLap: LaporanMasalah = {
      id: `flag-${Date.now().toString().slice(-6)}`,
      listing_kertas_id: data.listing_kertas_id,
      matching_id: data.matching_id,
      tong_id: data.tong_id,
      tong_nama: data.tongNama,
      unit_nama: data.unitNama,
      pelapor_id: currentUser.id,
      pelapor_nama: currentUser.nama,
      alasan: data.alasan,
      detail: data.detail,
      level: data.level,
      foto: data.foto,
      status: 'menunggu_tindakan',
      tanggal: 'Baru saja',
    };
    await db.upsertLaporan(newLap);
    await refreshData();

    // Kabar ke admin supaya langsung ditindaklanjuti.
    const adminNotif: AppNotification = {
      id: `notif-${Date.now()}-flag`,
      target_role: 'admin',
      judul: 'Laporan Baru Masuk',
      pesan: `${currentUser.nama} mengirim laporan "${data.alasan}" untuk ${data.tongNama}.`,
      tipe: 'sistem',
      link: '/admin/laporan',
      dibaca: false,
      created_at: 'Baru saja',
    };
    setNotifications(prev => {
      const next = [adminNotif, ...prev];
      localStorage.setItem(STORAGE_KEYS.NOTIFIKASI, JSON.stringify(next));
      return next;
    });

    showToast('Laporan berhasil dikirim ke admin drop point.', 'success');
    return { success: true, message: 'Laporan terkirim.' };
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
        updateProfile,
        updateUnitProfile,
        units,
        tongList,
        listings,
        permintaanList,
        matchings,
        laporanList,
        profiles,
        activeRoute,
        setActiveRoute,
        selectedMatchingId,
        setSelectedMatchingId,
        selectedListingId,
        setSelectedListingId,
        preselectTongId,
        setPreselectTongId,
        leaderboardUnitId,
        setLeaderboardUnitId,
        createListing,
        createPermintaan,
        schedulePickup,
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
        verifyQrCode,
        rateTransaction,
        getVerificationCode,
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
