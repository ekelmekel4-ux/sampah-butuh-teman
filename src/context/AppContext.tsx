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
  KategoriKertas
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_UNITS,
  INITIAL_TONG,
  INITIAL_LISTINGS,
  INITIAL_PERMINTAAN,
  INITIAL_MATCHINGS,
  INITIAL_LAPORAN,
  APP_BRAND
} from '../data/initialData';

export type AuthStep =
  | 'onboarding'
  | 'gate'
  | 'login-penyalur'
  | 'register-penyalur'
  | 'login-penerima'
  | 'register-penerima'
  | 'login-admin';

interface AppContextType {
  role: UserRole;
  currentUser: User;
  isLoggedIn: boolean;
  hasSeenOnboarding: boolean;
  authStep: AuthStep;
  completeOnboarding: () => void;
  setAuthStep: (step: AuthStep) => void;
  login: (email: string, role: UserRole, password?: string) => { success: boolean; message?: string };
  registerPenyalur: (data: {
    namaUnit: string;
    inisial: string;
    jenis: 'fakultas' | 'biro' | 'prodi';
    picNama: string;
    email: string;
    kontak: string;
    lokasiDetail?: string;
  }) => { success: boolean; message?: string };
  registerPenerima: (data: {
    namaPt: string;
    nib: string;
    email: string;
    kontakDispatcher: string;
  }) => { success: boolean; message?: string };
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
  // Actions
  createListing: (data: {
    unitId: string;
    tongId?: string;
    jumlahKg: number;
    kategori: KategoriKertas;
    kategoriLabel: string;
    kondisi: string[];
    foto: string;
  }) => ListingKertas;
  createPermintaan: (data: {
    jenisKertas: string[];
    jumlahKg: number;
    toleransiKadarAir: number;
    syaratQc: string[];
    hariPickup: string[];
    waktuOperasional: string;
  }) => PermintaanKertas;
  schedulePickup: (matchingId: string, tanggal: string, jam: string) => void;
  confirmPickup: (matchingId: string) => void;
  confirmUnitPlaced: (listingId: string) => void;
  emptyTong: (tongId: string) => void;
  requestSecondTong: (unitId: string) => Tong;
  addNewUnitAndTong: (data: {
    namaUnit: string;
    inisial: string;
    jenis: 'fakultas' | 'biro' | 'prodi';
    lokasiDetail: string;
    kapasitasMax: number;
    picNama?: string;
    kontakPic?: string;
  }) => { unit: UnitKampus; tong: Tong };
  resolveLaporan: (id: string) => void;
  submitLaporan: (data: {
    tongNama: string;
    unitNama: string;
    alasan: string;
    detail: string;
    level: 'kritis' | 'sedang';
  }) => void;
  resetDemoData: () => void;
  // Stats
  totalKgTersalurkan: number;
  totalPohon: number;
  totalAirBersih: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'sbt_current_role_v2',
  IS_LOGGED_IN: 'sbt_logged_in_v2',
  HAS_SEEN_ONBOARDING: 'sbt_seen_onboarding_v2',
  CURRENT_USER: 'sbt_current_user_v2',
  REGISTERED_USERS: 'sbt_registered_users_v2',
  UNITS: 'sbt_units_v6',
  TONG: 'sbt_tong_v6',
  LISTINGS: 'sbt_listings_v6',
  PERMINTAAN: 'sbt_permintaan_v6',
  MATCHINGS: 'sbt_matchings_v6',
  LAPORAN: 'sbt_laporan_v6'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Onboarding & Auth State
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

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USERS[0];
  });

  const [activeRoute, setActiveRoute] = useState<string>(() => {
    if (role === 'unit') return '/unit/beranda';
    if (role === 'perusahaan') return '/perusahaan/matching';
    return '/admin/dashboard';
  });

  const [selectedMatchingId, setSelectedMatchingId] = useState<string | null>(null);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  const [units, setUnits] = useState<UnitKampus[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.UNITS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4 && !parsed.some(u => u.id === 'unit-bkl')) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_UNITS;
  });

  const [tongList, setTongList] = useState<Tong[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TONG);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 20 && parsed.some(t => t.id === 'tong-ftd-5')) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_TONG;
  });

  const [listings, setListings] = useState<ListingKertas[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LISTINGS);
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [permintaanList, setPermintaanList] = useState<PermintaanKertas[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PERMINTAAN);
    return saved ? JSON.parse(saved) : INITIAL_PERMINTAAN;
  });

  const [matchings, setMatchings] = useState<MatchingTransaksi[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATCHINGS);
    return saved ? JSON.parse(saved) : INITIAL_MATCHINGS;
  });

  const [laporanList, setLaporanList] = useState<LaporanMasalah[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LAPORAN);
    return saved ? JSON.parse(saved) : INITIAL_LAPORAN;
  });

  // Sync state to local storage
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
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TONG, JSON.stringify(tongList));
  }, [tongList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PERMINTAAN, JSON.stringify(permintaanList));
  }, [permintaanList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATCHINGS, JSON.stringify(matchings));
  }, [matchings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAPORAN, JSON.stringify(laporanList));
  }, [laporanList]);

  // Auth Functions
  const completeOnboarding = () => {
    setHasSeenOnboarding(true);
    localStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, 'true');
    setAuthStep('gate');
  };

  const login = (email: string, targetRole: UserRole, _password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Find matching user or fallback to initial template
    let matchedUser = registeredUsers.find(
      u => u.email.toLowerCase() === cleanEmail && u.role === targetRole
    );

    // If not found in registeredUsers, check if matches any default demo role
    if (!matchedUser) {
      if (targetRole === 'admin' && (cleanEmail.includes('admin') || cleanEmail === 'admin.kampushijau@univ.ac.id')) {
        matchedUser = INITIAL_USERS.find(u => u.role === 'admin');
      } else if (targetRole === 'unit') {
        // Fallback or create mock session for any campus email
        matchedUser = {
          id: `user-unit-${Date.now()}`,
          nama: cleanEmail.split('@')[0].toUpperCase(),
          email: cleanEmail,
          role: 'unit',
          kontak: '081234567890',
          unit_id: units[0]?.id || 'unit-ftd',
          avatar_url: APP_BRAND.avatarUrl
        };
      } else if (targetRole === 'perusahaan') {
        matchedUser = {
          id: `user-perusahaan-${Date.now()}`,
          nama: cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'perusahaan',
          kontak: '081987654321',
          perusahaan_id: 'perusahaan-mdl',
          avatar_url: APP_BRAND.avatarUrl
        };
      }
    }

    if (!matchedUser) {
      return { success: false, message: 'Email tidak ditemukan untuk peran ini.' };
    }

    setCurrentUser(matchedUser);
    setRoleState(targetRole);
    setIsLoggedIn(true);

    if (targetRole === 'unit') {
      setActiveRoute('/unit/beranda');
    } else if (targetRole === 'perusahaan') {
      setActiveRoute('/perusahaan/matching');
    } else {
      setActiveRoute('/admin/dashboard');
    }

    return { success: true };
  };

  const registerPenyalur = ({
    namaUnit,
    inisial,
    jenis,
    picNama,
    email,
    kontak,
    lokasiDetail = 'Gedung Utama Kampus'
  }: {
    namaUnit: string;
    inisial: string;
    jenis: 'fakultas' | 'biro' | 'prodi';
    picNama: string;
    email: string;
    kontak: string;
    lokasiDetail?: string;
  }) => {
    // 1. Create Unit & Tong
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

    setUnits(prev => [...prev, newUnit]);
    setTongList(prev => [...prev, newTong]);
    setRegisteredUsers(prev => [...prev, newUser]);

    // Auto login
    setCurrentUser(newUser);
    setRoleState('unit');
    setIsLoggedIn(true);
    setActiveRoute('/unit/beranda');

    return { success: true };
  };

  const registerPenerima = ({
    namaPt,
    nib,
    email,
    kontakDispatcher
  }: {
    namaPt: string;
    nib: string;
    email: string;
    kontakDispatcher: string;
  }) => {
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

    setRegisteredUsers(prev => [...prev, newUser]);

    // Auto login
    setCurrentUser(newUser);
    setRoleState('perusahaan');
    setIsLoggedIn(true);
    setActiveRoute('/perusahaan/matching');

    return { success: true };
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setAuthStep('gate');
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'unit') {
      setActiveRoute('/unit/beranda');
    } else if (newRole === 'perusahaan') {
      setActiveRoute('/perusahaan/matching');
    } else if (newRole === 'admin') {
      setActiveRoute('/admin/dashboard');
    }
  };

  // 1. Posting limbah kertas (Unit)
  const createListing = ({
    unitId,
    tongId,
    jumlahKg,
    kategori,
    kategoriLabel,
    kondisi,
    foto
  }: {
    unitId: string;
    tongId?: string;
    jumlahKg: number;
    kategori: KategoriKertas;
    kategoriLabel: string;
    kondisi: string[];
    foto: string;
  }) => {
    const unit = units.find(u => u.id === unitId) || units[0];
    const tong = (tongId ? tongList.find(t => t.id === tongId) : null) || tongList.find(t => t.unit_id === unit.id) || tongList[0];

    const newListingId = `list-${Date.now()}`;
    const newTongWeight = tong.berat_kg + jumlahKg;
    const isQuotaMet = newTongWeight >= 10;

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

    setTongList(prev =>
      prev.map(t =>
        t.id === tong.id
          ? {
              ...t,
              status: isQuotaMet ? 'siap_pickup' : 'terisi',
              berat_kg: newTongWeight,
              tipe_kertas: kategoriLabel,
              catatan: isQuotaMet
                ? `Siap dijemput mitra pabrik (kuota terpenuhi: ${newTongWeight} Kg)`
                : `Terkumpul ${newTongWeight}/10 Kg. Kurang ${10 - newTongWeight} Kg lagi untuk siap dijemput.`
            }
          : t
      )
    );

    // Update unit's overall contribution stats
    setUnits(prev =>
      prev.map(u =>
        u.id === unit.id
          ? {
              ...u,
              total_kg_tersalurkan: u.total_kg_tersalurkan + jumlahKg,
              eco_points: u.eco_points + jumlahKg * 2
            }
          : u
      )
    );

    // Create automatic matching entry if any active permintaan exists
    const matchingReq = permintaanList[0];
    const newTrxId = `trx-${Date.now().toString().slice(-6)}`;
    const newMatch: MatchingTransaksi = {
      id: newTrxId,
      listing_kertas_id: newListingId,
      permintaan_id: matchingReq?.id,
      unit_id: unit.id,
      unit_nama: unit.nama_unit,
      tong_id: tong.id,
      tong_nama: tong.nama_tong,
      perusahaan_id: matchingReq?.perusahaan_id || 'perusahaan-mdl',
      perusahaan_nama: matchingReq?.perusahaan_nama || 'PT Mandiri Daur Lestari',
      jenis_kertas: `${jumlahKg} Kg ${kategoriLabel}`,
      jumlah_kg: jumlahKg,
      nilai_rupiah: jumlahKg * 1500,
      eco_points: jumlahKg * 2,
      skor_kecocokan: 96,
      status: 'menunggu_diambil',
      tanggal_jemput: 'Jadwal Otomatis Siap Dipilih',
      jam_jemput: '13:00 - 16:00 WIB'
    };

    newListing.matching_id = newTrxId;

    setListings(prev => [newListing, ...prev]);
    setMatchings(prev => [newMatch, ...prev]);

    return newListing;
  };

  // 2. Buat Permintaan Pasokan Kertas (Perusahaan)
  const createPermintaan = ({
    jenisKertas,
    jumlahKg,
    toleransiKadarAir,
    syaratQc,
    hariPickup,
    waktuOperasional
  }: {
    jenisKertas: string[];
    jumlahKg: number;
    toleransiKadarAir: number;
    syaratQc: string[];
    hariPickup: string[];
    waktuOperasional: string;
  }) => {
    const perusahaanNama = currentUser?.role === 'perusahaan' ? currentUser.nama : 'PT Mandiri Daur Lestari';
    const newReq: PermintaanKertas = {
      id: `req-${Date.now()}`,
      perusahaan_id: currentUser?.perusahaan_id || 'perusahaan-mdl',
      perusahaan_nama: perusahaanNama,
      jenis_kertas: jenisKertas,
      jumlah_kg: jumlahKg,
      toleransi_kadar_air: toleransiKadarAir,
      syarat_qc: syaratQc,
      hari_pickup: hariPickup,
      waktu_operasional: waktuOperasional,
      estimasi_dana_riset: jumlahKg * 1500,
      estimasi_eco_points: jumlahKg * 2,
      status_aktif: true,
      tanggal_dibuat: 'Hari ini'
    };

    setPermintaanList(prev => [newReq, ...prev]);
    return newReq;
  };

  // 3. Jadwalkan Pengambilan
  const schedulePickup = (matchingId: string, tanggal: string, jam: string) => {
    setMatchings(prev =>
      prev.map(m =>
        m.id === matchingId
          ? {
              ...m,
              tanggal_jemput: tanggal,
              jam_jemput: jam,
              nopol_armada: 'B 9821 PQL',
              driver_nama: 'Pak Joko Susilo',
              surat_jalan_kode: `#SJ-${new Date().getFullYear()}-${m.id}`
            }
          : m
      )
    );
  };

  // 4. Konfirmasi Selesai Diambil
  const confirmPickup = (matchingId: string) => {
    const match = matchings.find(m => m.id === matchingId);
    if (!match) return;

    setMatchings(prev =>
      prev.map(m =>
        m.id === matchingId
          ? {
              ...m,
              status: 'sudah_diambil',
              tanggal_selesai: 'Baru saja',
              rating: 5.0,
              komentar: 'Kertas bersih, rapi, dan terverifikasi di timbangan drop point.'
            }
          : m
      )
    );

    setListings(prev =>
      prev.map(l =>
        l.id === match.listing_kertas_id || l.matching_id === matchingId
          ? { ...l, status: 'sudah_diambil' }
          : l
      )
    );

    setTongList(prev =>
      prev.map(t =>
        t.id === match.tong_id
          ? {
              ...t,
              status: 'kosong',
              berat_kg: Math.max(0, t.berat_kg - match.jumlah_kg),
              jadwal_pickup: undefined,
              catatan: 'Baru saja diangkut oleh mitra pabrik'
            }
          : t
      )
    );

    setUnits(prev =>
      prev.map(u =>
        u.id === match.unit_id
          ? {
              ...u,
              total_kg_tersalurkan: u.total_kg_tersalurkan + match.jumlah_kg,
              eco_points: u.eco_points + match.eco_points
            }
          : u
      )
    );
  };

  // 5. Konfirmasi Kertas Sudah Ditaruh di Tong oleh Unit
  const confirmUnitPlaced = (listingId: string) => {
    setListings(prev =>
      prev.map(l =>
        l.id === listingId ? { ...l, status: 'siap_pickup' } : l
      )
    );
  };

  // 5b. Pengosongan Tong saat Armada Mengambil Muatan (Reset ke 0 Kg)
  const emptyTong = (tongId: string) => {
    setTongList(prev =>
      prev.map(t =>
        t.id === tongId
          ? {
              ...t,
              status: 'kosong',
              berat_kg: 0,
              catatan: 'Baru saja diangkut & dikosongkan oleh armada mitra pabrik'
            }
          : t
      )
    );

    setListings(prev =>
      prev.map(l =>
        l.tong_id === tongId && l.status !== 'sudah_diambil'
          ? { ...l, status: 'sudah_diambil' }
          : l
      )
    );

    setMatchings(prev =>
      prev.map(m =>
        m.tong_id === tongId && m.status !== 'sudah_diambil'
          ? {
              ...m,
              status: 'sudah_diambil',
              tanggal_selesai: 'Baru saja'
            }
          : m
      )
    );
  };

  // 5c. Permintaan / Pengaktifan Tong Cadangan (Tong No. 2 dst.)
  const requestSecondTong = (unitId: string) => {
    const unit = units.find(u => u.id === unitId) || units[0];
    const unitTongs = tongList.filter(t => t.unit_id === unit.id);
    
    // Find next non-full tong in the unit's 5 tongs
    const available = unitTongs.find(t => t.berat_kg < t.kapasitas_max_kg);
    if (available) return available;

    // Fallback: create tong No. 2 if not present
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

    setTongList(prev => [...prev, newTong]);
    return newTong;
  };

  // 6. Daftarkan Unit & Tong Baru (Admin)
  const addNewUnitAndTong = ({
    namaUnit,
    inisial,
    jenis,
    lokasiDetail,
    kapasitasMax,
    picNama = 'Koordinator Unit',
    kontakPic = '08123456789'
  }: {
    namaUnit: string;
    inisial: string;
    jenis: 'fakultas' | 'biro' | 'prodi';
    lokasiDetail: string;
    kapasitasMax: number;
    picNama?: string;
    kontakPic?: string;
  }) => {
    const cleanInisial = inisial.toUpperCase().trim() || 'UNT';
    const unitId = `unit-${cleanInisial.toLowerCase()}-${Date.now()}`;
    const primaryTongId = `tong-${cleanInisial.toLowerCase()}-1`;
    const primaryNamaTong = `Tong ${cleanInisial} No. 1 (Slot ${cleanInisial} 1-5)`;

    const newUnit: UnitKampus = {
      id: unitId,
      nama_unit: namaUnit,
      inisial: cleanInisial,
      jenis,
      lokasi_detail: lokasiDetail,
      pic_nama: picNama,
      kontak_pic: kontakPic,
      tong_id: primaryTongId,
      tong_nama: primaryNamaTong,
      total_kg_tersalurkan: 0,
      eco_points: 0
    };

    // Standardize 5 tongs per row for any newly registered unit
    const newTongs: Tong[] = [1, 2, 3, 4, 5].map(idx => ({
      id: `tong-${cleanInisial.toLowerCase()}-${idx}`,
      unit_id: unitId,
      unit_nama: namaUnit,
      nama_tong: `Tong ${cleanInisial} No. ${idx}`,
      nomor: `${cleanInisial}-0${idx}`,
      lokasi_spesifik: `Gedung Serbaguna - Sayap ${cleanInisial} • Kotak ${idx}`,
      status: 'kosong' as const,
      berat_kg: 0,
      kapasitas_max_kg: kapasitasMax || 120,
      tipe_kertas: 'Standby Siap Diisi',
      catatan: `Slot wadah #${idx} unit ${cleanInisial}`
    }));

    setUnits(prev => [...prev, newUnit]);
    setTongList(prev => [...prev, ...newTongs]);

    return { unit: newUnit, tong: newTongs[0] };
  };

  // 7. Laporan Masalah / Moderasi
  const resolveLaporan = (id: string) => {
    setLaporanList(prev =>
      prev.map(l =>
        l.id === id
          ? {
              ...l,
              status: 'sudah_selesai',
              level: 'selesai'
            }
          : l
      )
    );
  };

  const submitLaporan = ({
    tongNama,
    unitNama,
    alasan,
    detail,
    level
  }: {
    tongNama: string;
    unitNama: string;
    alasan: string;
    detail: string;
    level: 'kritis' | 'sedang';
  }) => {
    const newLap: LaporanMasalah = {
      id: `flag-${Date.now().toString().slice(-4)}`,
      tong_nama: tongNama,
      unit_nama: unitNama,
      pelapor_id: currentUser.id,
      pelapor_nama: currentUser.nama,
      alasan,
      detail,
      level,
      status: 'menunggu_tindakan',
      tanggal: 'Baru saja'
    };
    setLaporanList(prev => [newLap, ...prev]);
  };

  // Reset Demo
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.UNITS);
    localStorage.removeItem(STORAGE_KEYS.TONG);
    localStorage.removeItem(STORAGE_KEYS.LISTINGS);
    localStorage.removeItem(STORAGE_KEYS.PERMINTAAN);
    localStorage.removeItem(STORAGE_KEYS.MATCHINGS);
    localStorage.removeItem(STORAGE_KEYS.LAPORAN);
    localStorage.removeItem(STORAGE_KEYS.REGISTERED_USERS);
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    setUnits(INITIAL_UNITS);
    setTongList(INITIAL_TONG);
    setListings(INITIAL_LISTINGS);
    setPermintaanList(INITIAL_PERMINTAAN);
    setMatchings(INITIAL_MATCHINGS);
    setLaporanList(INITIAL_LAPORAN);
    setRegisteredUsers(INITIAL_USERS);
    setIsLoggedIn(false);
    setHasSeenOnboarding(false);
    setAuthStep('onboarding');
  };

  // Calculations
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
        totalAirBersih
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
