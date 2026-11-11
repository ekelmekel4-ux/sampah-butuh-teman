import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { APP_BRAND } from '../data/initialData';

/* ─── Map Marker Icons ─── */
/**
 * Marker drop point UPJ (hub) — pin besar dengan denyut + label.
 * Semua penjemputan berpusat di sini, jadi dibuat paling menonjol.
 */
const markerIconDropPoint = L.divIcon({
  className: '',
  html: `
    <div class="sbt-hub-marker">
      <div class="sbt-hub-marker__halo"></div>
      <div class="sbt-hub-marker__halo sbt-hub-marker__halo--2"></div>
      <div class="sbt-hub-pin"><span class="material-symbols-outlined">warehouse</span></div>
      <div class="sbt-map-label">DROP POINT UPJ</div>
    </div>
  `,
  iconSize: [62, 62],
  iconAnchor: [31, 31],
  popupAnchor: [0, -26],
});

/** Marker mitra — pin warna partner, memakai foto profil bila akun sudah mengunggah. */
const buildMitraIcon = (color: string, iconName: string, avatarUrl?: string) =>
  L.divIcon({
    className: '',
    html: `
      <div class="sbt-partner-pin" style="background:${color}">
        ${
          avatarUrl
            ? `<img src="${avatarUrl}" alt="" />`
            : `<span class="material-symbols-outlined">${iconName}</span>`
        }
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -18],
  });

const markerIconUnit = L.divIcon({
  className: 'custom-map-marker-unit',
  html: `<div style="background-color: #2D6A4F; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid white;"><span class="material-symbols-outlined" style="color: white; font-size: 18px;">school</span></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17],
});

const markerIconIndustri = L.divIcon({
  className: 'custom-map-marker-industri',
  html: `<div style="background-color: #D97706; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid white;"><span class="material-symbols-outlined" style="color: white; font-size: 17px;">factory</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const markerIconSerpong = L.divIcon({
  className: 'custom-map-marker-serpong',
  html: `<div style="background-color: #005138; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid white;"><span class="material-symbols-outlined" style="color: white; font-size: 17px;">recycling</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const markerIconCiputat = L.divIcon({
  className: 'custom-map-marker-ciputat',
  html: `<div style="background-color: #059669; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid white;"><span class="material-symbols-outlined" style="color: white; font-size: 17px;">precision_manufacturing</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

/* ─── Smooth Map Pan & Fly Controller ─── */
const MapFlyController: React.FC<{ coords: [number, number]; zoom: number; triggerKey: number }> = ({ coords, zoom, triggerKey }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, zoom, {
        duration: 1.4,
        easeLinearity: 0.25,
      });
    }
  }, [coords, zoom, triggerKey, map]);
  return null;
};

/* ─── Skala Jarak (meter) ─── */
const MapScaleControl: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    const scale = L.control.scale({ imperial: false, position: 'bottomright' });
    scale.addTo(map);
    return () => {
      scale.remove();
    };
  }, [map]);
  return null;
};

/* ─── Logistics Partners Data Structure ─── */
interface LogisticsPartner {
  id: string;
  name: string;
  type: 'drop_point' | 'mitra_industri';
  category: string;
  address: string;
  coords: [number, number];
  distance: string;
  badge: string;
  badgeClass: string;
  color: string;
  iconName: string;
  iconType: L.DivIcon;
  acceptedTypes: string[];
  capacity: string;
  armada: string;
  driver?: string;
  jadwal: string;
  /** Id akun di tabel profiles — dipakai untuk menampilkan foto profil mitra. */
  akunId?: string;
  /** Id perusahaan di tabel profiles (akun-akun mitra di bawah perusahaan ini). */
  perusahaanId?: string;
}

const MITRA_PARTNERS: LogisticsPartner[] = [
  {
    id: 'upj-gsg',
    name: APP_BRAND.dropPointUtama.nama,
    type: 'drop_point',
    category: 'Pusat Konsolidasi Utama',
    address: APP_BRAND.dropPointUtama.alamat,
    coords: [-6.292137, 106.725419],
    distance: 'Pusat Kampus',
    badge: '8 / 10 Tong Aktif',
    badgeClass: 'bg-[#E8F5EE] text-[#005138] border-[#2D6A4F]/25',
    color: '#2D6A4F',
    iconName: 'school',
    iconType: markerIconUnit,
    akunId: 'user-admin-pusat',
    acceptedTypes: ['Kertas HVS', 'Kardus Box', 'Kertas Campur'],
    capacity: '1.085 Kg Terkumpul',
    armada: 'Ramp Truk 6-Roda & Timbangan Digital Tera',
    jadwal: 'Senin - Sabtu (08.00 - 17.00)',
  },
  {
    id: 'mitra-bintaro',
    name: 'PT Mandiri Daur Lestari',
    type: 'mitra_industri',
    category: 'Mitra Pengolah Kertas HVS & Arsip',
    address: 'Kawasan Niaga Bintaro Sektor 7, Pondok Aren (~4.2 Km dari UPJ)',
    coords: [-6.2500, 106.7600],
    distance: '4.2 Km',
    badge: 'Siap Jemput',
    badgeClass: 'bg-[#FEF3C7] text-[#92400E] border-[#D97706]/25',
    color: '#D97706',
    iconName: 'factory',
    iconType: markerIconIndustri,
    akunId: 'user-perusahaan-mdl',
    perusahaanId: 'perusahaan-mdl',
    acceptedTypes: ['HVS Bersih', 'Buku & Majalah', 'Dokumen Rahasia'],
    capacity: 'Kapasitas Harian: 2.000 Kg',
    armada: 'Truk Box B 9821 PQL',
    driver: 'Pak Joko Susilo (0812-8871-xxxx)',
    jadwal: 'Penjemputan: Selasa & Jumat',
  },
  {
    id: 'mitra-serpong',
    name: 'Pabrik Kertas Kraft Serpong',
    type: 'mitra_industri',
    category: 'Pabrik Karton & Box Corrugated',
    address: 'Kawasan Pergudangan Taman Tekno Blok B, BSD Serpong (~8.7 Km dari UPJ)',
    coords: [-6.3000, 106.7000],
    distance: '8.7 Km',
    badge: 'Jadwal Kamis',
    badgeClass: 'bg-[#E8F5EE] text-[#005138] border-[#2D6A4F]/25',
    color: '#005138',
    iconName: 'recycling',
    iconType: markerIconSerpong,
    acceptedTypes: ['Kardus Cokelat', 'Karton Duplex', 'Paper Core'],
    capacity: 'Kapasitas Kontainer: 1.500 Kg',
    armada: 'Flatbed Container B 9102 KRD',
    driver: 'Pak Hendra Pratama (0856-9123-xxxx)',
    jadwal: 'Penjemputan Rutin: Setiap Kamis',
  },
  {
    id: 'mitra-ciputat',
    name: 'CV Berkah Daur Paperindo',
    type: 'mitra_industri',
    category: 'Pabrik Pulp & Kertas Campur',
    address: 'Jl. RE Martadinata No. 45, Cipayung, Ciputat (~5.4 Km dari UPJ)',
    coords: [-6.3150, 106.7450],
    distance: '5.4 Km',
    badge: 'Mitra Cadangan',
    badgeClass: 'bg-[#D1FAE5] text-[#065F46] border-[#059669]/25',
    color: '#059669',
    iconName: 'precision_manufacturing',
    iconType: markerIconCiputat,
    acceptedTypes: ['Kertas Campur', 'Brosur & Flier', 'Koran Bekas'],
    capacity: 'Kapasitas Batch: 800 Kg',
    armada: 'Pick-Up L300 B 9334 TNG',
    driver: 'Pak Rahmat Hidayat (0878-7112-xxxx)',
    jadwal: 'Sistem On-Call / Sesuai Permintaan',
  },
];

/* ─── Sparkline (Animated SVG Path) ─── */
const Sparkline: React.FC<{ data: number[]; color: string; isLoaded?: boolean }> = ({ data, color, isLoaded = true }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 120, h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 6) - 3;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible" style={{ height: 32 }} preserveAspectRatio="none">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="300"
        strokeDashoffset={isLoaded ? '0' : '300'}
        style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      />
    </svg>
  );
};

export const AdminDashboardView: React.FC = () => {
  const { units, totalKgTersalurkan, totalPohon, totalAirBersih, laporanList, setActiveRoute, currentUser, profiles, tongList } = useApp();

  const [isLoaded, setIsLoaded] = useState(false);
  const [activeMascotQuote, setActiveMascotQuote] = useState(0);
  const [hoveredMascot, setHoveredMascot] = useState<'mina' | 'moni' | null>(null);
  const [selectedMitraId, setSelectedMitraId] = useState<string>('mitra-bintaro');
  const [mapTarget, setMapTarget] = useState<{ coords: [number, number]; zoom: number; triggerKey: number }>({
    coords: [-6.2500, 106.7600],
    zoom: 15,
    triggerKey: Date.now(),
  });

  // Jumlah tong aktif mengikuti perhitungan menu "Kelola Unit & Tong".
  const totalTong = tongList.length;
  const tongAktif = tongList.filter(t => t.status === 'terisi' || t.status === 'siap_pickup').length;

  const badgeFor = (partner: LogisticsPartner) =>
    partner.type === 'drop_point' ? `${tongAktif} / ${totalTong} Tong Aktif` : partner.badge;

  /** Foto profil akun mitra (kalau sudah mengunggah, bukan logo bawaan). */
  const avatarFor = (partner: LogisticsPartner): string | undefined => {
    const kandidat = profiles.filter(p =>
      (partner.akunId && p.id === partner.akunId) ||
      (partner.perusahaanId && p.perusahaan_id === partner.perusahaanId)
    );
    for (const akun of kandidat) {
      const url = akun.avatar_url;
      if (url && url !== APP_BRAND.avatarUrl && url !== '/logo-sbt.png') return url;
    }
    return undefined;
  };

  const handleSelectMitra = (mitra: LogisticsPartner) => {
    setSelectedMitraId(mitra.id);
    setMapTarget({
      coords: mitra.coords,
      zoom: 15,
      triggerKey: Date.now(),
    });
  };

  const handleResetMap = () => {
    setSelectedMitraId('');
    setMapTarget({
      coords: [-6.292137, 106.725419],
      zoom: 12,
      triggerKey: Date.now(),
    });
  };

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const mascotQuotes = [
    { mina: 'Hai Admin! Kertas HVS UPJ siap olah! 📄✨', moni: 'Kardus terjaga kering & rapi! 📦' },
    { mina: 'Hari ini emisi CO₂ turun lagi lho! 🌱', moni: 'Armada mitra siap jemput sesuai jadwal! 🚚' },
    { mina: 'Klik kami kalau butuh semangat sirkular! ✋', moni: 'Semangat pilah sampah kertas kampus! 🚀' }
  ];

  const targetSemester = 2500;
  const pct = Math.min(100, Math.round((totalKgTersalurkan / targetSemester) * 100));
  const nilaiSirkularitas = totalKgTersalurkan * 1400;
  const pendingLaporan = laporanList.filter(l => l.status === 'menunggu_tindakan').length;

  const periodMultipliers: Record<string, { kg: number; points: number }> = {
    'unit-baa': { kg: 245, points: 490 },
    'unit-ftd': { kg: 190, points: 380 },
    'unit-fk': { kg: 170, points: 340 },
    'unit-feb': { kg: 145, points: 290 },
    'unit-fasilkom': { kg: 120, points: 240 },
    'unit-fikom': { kg: 95, points: 190 },
    'unit-perpus': { kg: 85, points: 170 },
    'unit-lppm': { kg: 55, points: 110 },
  };

  const rankedUnits = units
    .map(u => ({
      ...u,
      kg: periodMultipliers[u.id]?.kg ?? u.total_kg_tersalurkan,
      points: periodMultipliers[u.id]?.points ?? u.eco_points,
    }))
    .sort((a, b) => b.kg - a.kg);

  const monthlyData = [120, 185, 290, 240, 250, totalKgTersalurkan];

  // Sapaan — seragam dengan dashboard mitra &ljawab unit
  const jamSekarang = new Date().getHours();
  const periodeHari =
    jamSekarang >= 5 && jamSekarang < 11
      ? 'pagi'
      : jamSekarang < 15
        ? 'siang'
        : jamSekarang < 19
          ? 'sore'
          : 'malam';
  const tanggalHariIni = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const namaAdmin =
    currentUser?.nama
      ?.replace(/,\s*.*$/, '')
      .replace(/\(.*\)$/, '')
      .trim() || 'Admin Drop Point';

  return (
    <div className="w-full max-w-7xl mx-auto font-sans text-[#1A2E22] space-y-6 pb-12">

      {/* ═══ Sapaan — sama seperti dashboard mitra &ljawab unit ═══ */}
      <section aria-label="Sapaan" className="px-1">
        <p className="text-[11px] font-medium text-[#8CA090] leading-snug">{tanggalHariIni}</p>
        <h1 className="mt-2 leading-[1.08] tracking-tight text-[#1A2E22]">
          <span className="block text-[22px] font-medium">Selamat {periodeHari},</span>
          <span className="block text-[26px] sm:text-[28px] font-extrabold break-words">
            {namaAdmin} <span aria-hidden="true">👋</span>
          </span>
        </h1>
        <p className="mt-2.5 text-[13px] leading-relaxed text-[#52645A]">
          Satu langkah kecil hari ini, untuk bumi yang lebih baik.
        </p>
      </section>

      {/* ═══ 1. EXECUTIVE SUSTAINABILITY COMMAND BANNER (WITH 3D BREAKOUT MASCOTS) ═══ */}
      <div className="w-full relative pt-3 sm:pt-4 md:pt-5 mb-2">
        <div className="absolute inset-x-0 bottom-0 top-3 sm:top-4 md:top-5 rounded-[24px] bg-gradient-to-br from-[#123827] via-[#1B4D36] to-[#256346] border border-[#52B788]/25 shadow-xl shadow-[#0E281C]/25 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.09]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1.2px, transparent 0)', backgroundSize: '24px 24px' }}
          />
          <div className="absolute -right-12 -bottom-16 w-96 h-96 rounded-full bg-[#52B788]/20 blur-3xl" />
          <div className="absolute left-1/3 -top-20 w-80 h-80 rounded-full bg-[#74C69D]/15 blur-3xl" />
          <div className="absolute -left-12 -bottom-12 w-72 h-72 rounded-full bg-[#2D6A4F]/35 blur-2xl" />
        </div>

        {/* Card Content Layer — OVERFLOW VISIBLE: Mina & Moni break OUT of the top card border for real 3D effect */}
        <div className="relative z-10 p-6 sm:p-8 md:px-10 min-h-[210px] sm:min-h-[235px] overflow-visible flex items-center">
          {/* Left Column Text — Width constrained so it never overlaps with mascots on the right */}
          <div className="max-w-[60%] sm:max-w-md md:max-w-lg lg:max-w-xl space-y-3.5 z-10 py-4 sm:py-6 text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide text-[#D8F3DC] border border-white/15 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse" />
              PUSAT KOMANDO SIRKULARITAS • KAMPUS UPJ
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-sm">
              Monitoring Sirkularitas & Limbah Kertas
            </h1>

            <p className="text-xs sm:text-sm text-[#D8F3DC]/85 font-normal leading-relaxed max-w-lg">
              Pantau serapan limbah kertas kampus, kendalikan kapasitas drop point serbaguna, dan pastikan penyaluran ke mitra industri berjalan tepat waktu.
            </p>
          </div>

          {/* Right Column — Mina & Moni Mascots PINNED SECURELY TO THE FAR RIGHT SIDE */}
          <div
            className="absolute bottom-0 right-1 sm:right-4 md:right-8 lg:right-12 xl:right-16 flex items-end justify-end select-none cursor-pointer group pb-0 z-20 overflow-visible pointer-events-auto"
            onClick={() => setActiveMascotQuote(q => (q + 1) % mascotQuotes.length)}
            title="Klik Mina & Moni untuk melihat pesan mereka"
            role="button"
            tabIndex={0}
            aria-label="Maskot Mina dan Moni"
          >
            <div className="absolute w-72 h-72 rounded-full bg-[#52B788]/25 blur-3xl -top-6 pointer-events-none animate-pulse-glow" />
            <div className="absolute bottom-0 w-60 sm:w-76 md:w-88 h-5 bg-[#081F14]/55 rounded-full blur-md pointer-events-none z-0" />

            {/* Characters Duo Container — standing shoulder-to-shoulder on the right edge */}
            <div className="relative flex items-end justify-end z-10 pb-0 overflow-visible">

              {/* Mina Slot (Paper Mascot) */}
              <div
                className="relative -translate-x-30 sm:-translate-x-30 md:-translate-x-18 w-[120px] sm:w-[145px] md:w-[170px] lg:w-[190px] h-[215px] sm:h-[245px] md:h-[270px] lg:h-[285px] flex items-end justify-center animate-float-mina z-10 transition-transform duration-300 hover:scale-105 hover:z-30 cursor-pointer"
                onMouseEnter={() => setHoveredMascot('mina')}
                onMouseLeave={() => setHoveredMascot(null)}
              >
                {/* Speech Bubble directly above Mina's head */}
                {(hoveredMascot === 'mina' || hoveredMascot === null) && (
                  <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto cursor-pointer animate-speech-bubble whitespace-nowrap">
                    <div className="relative bg-white/95 backdrop-blur-md text-[#1A2E22] px-3.5 py-1 rounded-full shadow-lg border border-[#E3DDCF] text-[10px] sm:text-[11px] font-bold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform">
                      <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse shrink-0" />
                      <span className="max-w-[180px] sm:max-w-none text-center">
                        {mascotQuotes[activeMascotQuote].mina}
                      </span>
                      <span className="text-[11px]">📄</span>
                      {/* Speech Bubble Arrow Tail pointing down straight into Mina's head */}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-[#E3DDCF]" />
                    </div>
                  </div>
                )}

                <img
                  src="/mina.png"
                  alt="Mina - Maskot Kertas"
                  className="max-w-none h-[215px] sm:h-[245px] md:h-[270px] lg:h-[285px] object-contain object-bottom pointer-events-none"
                  style={{
                    filter: 'drop-shadow(0 16px 20px rgba(7, 24, 16, 0.45)) drop-shadow(0 6px 8px rgba(7, 24, 16, 0.3))'
                  }}
                />
              </div>

              {/* Moni Slot (Cardboard Mascot) */}
              <div
                className="relative w-[95px] sm:w-[115px] md:w-[135px] lg:w-[150px] h-[170px] sm:h-[195px] md:h-[215px] lg:h-[230px] -ml-5 sm:-ml-7 md:-ml-9 flex items-end justify-center animate-float-moni z-20 transition-transform duration-300 hover:scale-105 hover:z-30 cursor-pointer"
                onMouseEnter={() => setHoveredMascot('moni')}
                onMouseLeave={() => setHoveredMascot(null)}
              >
                {/* Speech Bubble directly above Moni's head when hovering Moni */}
                {hoveredMascot === 'moni' && (
                  <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto cursor-pointer animate-speech-bubble whitespace-nowrap">
                    <div className="relative bg-white/95 backdrop-blur-md text-[#1A2E22] px-3.5 py-1 rounded-full shadow-lg border border-[#E3DDCF] text-[10px] sm:text-[11px] font-bold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform">
                      <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse shrink-0" />
                      <span className="max-w-[180px] sm:max-w-none text-center">
                        {mascotQuotes[activeMascotQuote].moni}
                      </span>
                      <span className="text-[11px]">📦</span>
                      {/* Speech Bubble Arrow Tail pointing down straight into Moni's head */}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-[#E3DDCF]" />
                    </div>
                  </div>
                )}

                <img
                  src="/moni.png"
                  alt="Moni - Maskot Kardus"
                  className="max-w-none h-[170px] sm:h-[195px] md:h-[215px] lg:h-[230px] object-contain object-bottom pointer-events-none"
                  style={{
                    filter: 'drop-shadow(0 16px 20px rgba(7, 24, 16, 0.45)) drop-shadow(0 6px 8px rgba(7, 24, 16, 0.3))'
                  }}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
      {/* ═══ 2. QUICK ACTIONS BAR ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        <button
          onClick={() => setActiveRoute('/admin/unit-tong')}
          className="bg-white border border-[#E3DDCF] hover:border-[#2D6A4F] rounded-[14px] p-4 text-left transition-all hover:shadow-xs group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[10px] bg-[#E6ECDD] text-[#005138] flex items-center justify-center shrink-0 group-hover:bg-[#2D6A4F] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-[#1A2E22]">Kelola Unit & Tong</h3>
              <p className="text-[11px] text-[#52645A]">Atur kuota slot tong di drop point GSG</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#8CA090] text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>

        <button
          onClick={() => setActiveRoute('/admin/laporan')}
          className="bg-white border border-[#E3DDCF] hover:border-[#C0392B] rounded-[14px] p-4 text-left transition-all hover:shadow-xs group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[10px] bg-[#FEECEC] text-[#C0392B] flex items-center justify-center shrink-0 group-hover:bg-[#C0392B] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">flag</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-bold text-[#1A2E22]">Laporan & Sengketa</h3>
                {pendingLaporan > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#C0392B] text-white text-[10px] font-bold">
                    {pendingLaporan} baru
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#52645A]">Tinjau kontaminasi basah/minyak</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#8CA090] text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>

        <button
          onClick={() => setActiveRoute('/leaderboard')}
          className="bg-white border border-[#E3DDCF] hover:border-[#2D6A4F] rounded-[14px] p-4 text-left transition-all hover:shadow-xs group flex items-center justify-between sm:col-span-2 md:col-span-1"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[10px] bg-[#FEF3C7] text-[#92400E] flex items-center justify-center shrink-0 group-hover:bg-[#8A5309] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">trophy</span>
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-[#1A2E22]">Papan Skor Sirkularitas</h3>
              <p className="text-[11px] text-[#52645A]">Peringkat unit & konversi dana kas</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#8CA090] text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>

      {/* ═══ 3. SECTION HEADER ═══ */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-xl font-bold text-[#1A2E22] tracking-tight">Ringkasan Kinerja Sirkularitas</h2>
          <p className="text-xs text-[#52645A]">Agregasi data real-time seluruh unit kampus dan mitra industri</p>
        </div>
        <button className="h-9 px-4 rounded-[8px] bg-white border border-[#E3DDCF] text-xs font-semibold text-[#1A2E22] hover:bg-[#FAFAF7] transition-colors flex items-center gap-2 shadow-xs">
          <span className="material-symbols-outlined text-[16px] text-[#52645A]">download</span>
          Ekspor Laporan
        </button>
      </div>

      {/* ═══ 4. UNIFIED METRIC CARDS GRID ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 1: Total Tersalurkan */}
        <div className="bg-white border border-[#E3DDCF] rounded-[16px] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#8CA090] uppercase tracking-wider">Total Kertas Terserap</span>
              <span className="w-7 h-7 rounded-[6px] bg-[#E6ECDD] text-[#005138] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">scale</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1A2E22] tracking-tight tabular-nums">
                {totalKgTersalurkan.toLocaleString('id-ID')}
              </span>
              <span className="text-sm font-semibold text-[#52645A]">Kg</span>
            </div>
            <p className="text-[11px] text-[#52645A] mt-1 font-medium">
              Target semester: <strong>{targetSemester.toLocaleString('id-ID')} Kg</strong> ({pct}%)
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E3DDCF]">
            <Sparkline data={monthlyData} color="#2D6A4F" isLoaded={isLoaded} />
          </div>
        </div>

        {/* Card 2: Nilai Sirkularitas */}
        <div className="bg-white border border-[#E3DDCF] rounded-[16px] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#8CA090] uppercase tracking-wider">Nilai Sirkularitas</span>
              <span className="px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#2D6A4F] text-[10px] font-bold">
                +18.2%
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-[#52645A]">Rp</span>
              <span className="text-3xl font-extrabold text-[#1A2E22] tracking-tight tabular-nums">
                {nilaiSirkularitas.toLocaleString('id-ID')}
              </span>
            </div>
            <p className="text-[11px] text-[#52645A] mt-1 font-medium">
              Rata-rata aktual Rp 1.400 / Kg HVS
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E3DDCF]">
            {/* Animated mini bars */}
            <div className="flex gap-1.5 items-end" style={{ height: 32 }}>
              {[30, 50, 70, 55, 80, 95].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: isLoaded ? `${(v / 95) * 100}%` : '0%',
                    background: i === 5 ? '#2D6A4F' : '#D8F3DC',
                    transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 60}ms`
                  }}
                  title={`Batch ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Kapasitas Drop Point */}
        <div className="bg-white border border-[#E3DDCF] rounded-[16px] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#8CA090] uppercase tracking-wider">Kapasitas Drop Point</span>
              <span className="px-2 py-0.5 rounded-full bg-[#E6ECDD] text-[#005138] text-[10px] font-bold">
                80% Terpakai
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1A2E22] tracking-tight tabular-nums">
                8 <span className="text-xl text-[#8CA090] font-medium">/ 10</span>
              </span>
              <span className="text-xs font-semibold text-[#52645A]">Tong Terisi</span>
            </div>
            <p className="text-[11px] text-[#52645A] mt-1 font-medium">
              Drop point GSG siap angkut mitra
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E3DDCF] space-y-1.5">
            <div className="w-full bg-[#ECE6D7] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#2D6A4F] h-full rounded-full"
                style={{
                  width: isLoaded ? '80%' : '0%',
                  transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#8CA090] font-medium">
              <span>94.2% Sortir Bersih</span>
              <span className="font-bold text-[#2D6A4F]">Timbangan OK</span>
            </div>
          </div>
        </div>

        {/* Card 4: Dampak Lingkungan */}
        <div className="bg-white border border-[#E3DDCF] rounded-[16px] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#8CA090] uppercase tracking-wider">Dampak Ekologis (ESG)</span>
              <span className="px-2 py-0.5 rounded-full bg-[#D8F3DC] text-[#005138] text-[10px] font-bold">
                Terverifikasi
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#005138] tracking-tight tabular-nums">
                {totalPohon}
              </span>
              <span className="text-sm font-semibold text-[#52645A]">Pohon</span>
              <span className="text-xs text-[#8CA090] font-medium">•</span>
              <span className="text-sm font-bold text-[#1A2E22] tabular-nums">
                {totalAirBersih.toLocaleString('id-ID')}
              </span>
              <span className="text-[11px] text-[#52645A]">L Air</span>
            </div>
            <p className="text-[11px] text-[#52645A] mt-1 font-medium">
              Formula standar daur ulang per 1.000 Kg
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E3DDCF]">
            <div className="flex gap-1.5 items-end" style={{ height: 32 }}>
              {[20, 45, 30, 60, 50, 80].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: isLoaded ? `${(v / 80) * 100}%` : '0%',
                    background: i === 5 ? '#005138' : '#B7E4C7',
                    transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 60}ms`
                  }}
                  title={`Bulan ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ═══ 5. CHARTS & LEADERBOARD MAIN SECTION ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Bar Chart: Traffic Analisis */}
        <div className="lg:col-span-2 bg-white border border-[#E3DDCF] rounded-[16px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E3DDCF]">
              <div>
                <h3 className="font-bold text-[#1A2E22] text-base">Traffic Analisis Serapan Kertas (Kg)</h3>
                <p className="text-xs text-[#52645A]">Distribusi material daur ulang semester berjalan</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-[#52645A] shrink-0">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F]" />HVS</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8A5309]" />Kardus</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#40916C]" />Campur</span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="relative ml-8">
              {/* Y-Axis Labels */}
              <div className="absolute -left-8 top-0 bottom-8 flex flex-col justify-between text-[10px] font-bold text-[#8CA090] pointer-events-none">
                {['320', '240', '160', '80'].map(v => <span key={v}>{v}</span>)}
              </div>

              {/* Gridlines & Bars Container */}
              <div className="border-l border-b border-[#E3DDCF] relative" style={{ height: 210 }}>
                {[25, 50, 75].map(p => (
                  <div key={p} className="absolute w-full border-t border-dashed border-[#E3DDCF]" style={{ bottom: `${p}%` }} />
                ))}

                <div className="absolute inset-0 flex items-end justify-around px-4 pb-0 gap-3">
                  {[
                    { m: 'Jan', hvs: 55, kds: 40, mix: 25 },
                    { m: 'Feb', hvs: 85, kds: 65, mix: 35 },
                    { m: 'Mar', hvs: 130, kds: 90, mix: 70 },
                    { m: 'Apr', hvs: 110, kds: 80, mix: 50 },
                    { m: 'Mei', hvs: 115, kds: 85, mix: 50 },
                    { m: 'Jun', hvs: 145, kds: 100, mix: 65 },
                  ].map((d, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group relative">
                      {/* Floating Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-[#1A2E22] text-white text-[10px] font-bold px-2.5 py-1 rounded-md pointer-events-none whitespace-nowrap shadow-md z-30 -translate-y-1 group-hover:translate-y-0">
                        Total: {d.hvs + d.kds + d.mix} Kg (HVS {d.hvs}, Kardus {d.kds})
                      </div>

                      {/* Bar Group with isLoaded Transition */}
                      <div className="flex gap-1 items-end w-full justify-center" style={{ height: '88%' }}>
                        <div
                          className="flex-1 max-w-[12px] bg-[#8A5309] rounded-t-sm hover:brightness-110 transition-all cursor-pointer"
                          style={{
                            height: isLoaded ? `${(d.kds / 320) * 100}%` : '0%',
                            transition: `height 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 75}ms`
                          }}
                          title={`Kardus: ${d.kds} Kg`}
                        />
                        <div
                          className="flex-1 max-w-[12px] bg-[#2D6A4F] rounded-t-sm hover:brightness-110 transition-all cursor-pointer"
                          style={{
                            height: isLoaded ? `${(d.hvs / 320) * 100}%` : '0%',
                            transition: `height 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 75 + 30}ms`
                          }}
                          title={`HVS: ${d.hvs} Kg`}
                        />
                        <div
                          className="flex-1 max-w-[12px] bg-[#40916C] rounded-t-sm hover:brightness-110 transition-all cursor-pointer"
                          style={{
                            height: isLoaded ? `${(d.mix / 320) * 100}%` : '0%',
                            transition: `height 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 75 + 60}ms`
                          }}
                          title={`Campur: ${d.mix} Kg`}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#8CA090] mt-2 mb-1 group-hover:text-[#2D6A4F] transition-colors">{d.m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Clean Insight Footer */}
          <div className="mt-5 p-3.5 rounded-[10px] bg-[#FAFAF7] border border-[#E3DDCF] flex items-center gap-3">
            <span className="material-symbols-outlined text-[#2D6A4F] text-[20px] shrink-0">insights</span>
            <p className="text-xs text-[#1A2E22] font-medium leading-relaxed">
              <strong className="font-bold">Tren Sirkularitas:</strong> Kenaikan serapan tertinggi terjadi pada bulan <strong>Maret (+56%)</strong> seiring masa arsip semester genap.
            </p>
          </div>
        </div>

        {/* Circular Donut Chart: Komposisi Kertas */}
        <div className="lg:col-span-1 bg-white border border-[#E3DDCF] rounded-[16px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-[#E3DDCF]">
              <div>
                <h3 className="font-bold text-[#1A2E22] text-base">Komposisi Material</h3>
                <p className="text-xs text-[#52645A]">Proporsi jenis kertas semester ini</p>
              </div>
              <span className="text-[11px] font-semibold text-[#8CA090]">Semester Genap</span>
            </div>

            {/* Circular Donut Gauge with Animated Stroke */}
            <div className="flex justify-center my-4">
              <div className="relative" style={{ width: 170, height: 170 }}>
                <svg width={170} height={170} viewBox="0 0 170 170" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="85" cy="85" r="65" fill="none" stroke="#FAFAF7" strokeWidth="22" />
                  {/* HVS: 44.7% */}
                  <circle
                    cx="85" cy="85" r="65" fill="none" stroke="#2D6A4F" strokeWidth="22"
                    strokeDasharray={isLoaded ? `${0.447 * 2 * Math.PI * 65} ${2 * Math.PI * 65}` : `0 ${2 * Math.PI * 65}`}
                    style={{ transition: 'stroke-dasharray 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) 150ms' }}
                  />
                  {/* Kardus: 35.9% */}
                  <circle
                    cx="85" cy="85" r="65" fill="none" stroke="#8A5309" strokeWidth="22"
                    strokeDasharray={isLoaded ? `${0.359 * 2 * Math.PI * 65} ${2 * Math.PI * 65}` : `0 ${2 * Math.PI * 65}`}
                    strokeDashoffset={`-${0.447 * 2 * Math.PI * 65}`}
                    style={{ transition: 'stroke-dasharray 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) 300ms' }}
                  />
                  {/* Campur: 19.4% */}
                  <circle
                    cx="85" cy="85" r="65" fill="none" stroke="#40916C" strokeWidth="22"
                    strokeDasharray={isLoaded ? `${0.194 * 2 * Math.PI * 65} ${2 * Math.PI * 65}` : `0 ${2 * Math.PI * 65}`}
                    strokeDashoffset={`-${(0.447 + 0.359) * 2 * Math.PI * 65}`}
                    style={{ transition: 'stroke-dasharray 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) 450ms' }}
                  />
                </svg>

                {/* Center Stat Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-2xl font-extrabold text-[#1A2E22] tabular-nums">1.085</div>
                  <div className="text-[10px] text-[#8CA090] font-bold uppercase tracking-wider">Total Kg</div>
                </div>
              </div>
            </div>

            {/* Category Breakdown Table */}
            <div className="space-y-2 mt-4">
              {[
                { abbr: 'HVS', label: 'Kertas HVS & Arsip', kg: 485, pct: '44.7%', color: '#2D6A4F', bg: '#D8F3DC' },
                { abbr: 'KDS', label: 'Kardus Box Corrugated', kg: 390, pct: '35.9%', color: '#92400E', bg: '#FEF3C7' },
                { abbr: 'MIX', label: 'Kertas Campuran Bersih', kg: 210, pct: '19.4%', color: '#005138', bg: '#E6ECDD' },
              ].map(cat => (
                <div key={cat.abbr} className="flex items-center justify-between p-2 rounded-[8px] hover:bg-[#FAFAF7] transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                    <span className="text-xs font-semibold text-[#1A2E22]">{cat.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#1A2E22] tabular-nums mr-2">{cat.kg} Kg</span>
                    <span className="text-[10px] font-bold text-[#8CA090]">{cat.pct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ═══ 6. SPATIOUS LOGISTICS NETWORK & DROP POINT MAP SECTION ═══ */}
      <div className="bg-white border border-[#E3DDCF] rounded-[16px] p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-[#E3DDCF]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-[8px] bg-[#E6ECDD] text-[#005138] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">map</span>
              </span>
              <h3 className="font-bold text-[#1A2E22] text-base">Peta Jaringan Logistik & Sebaran Mitra Industri</h3>
            </div>
            <p className="text-xs text-[#52645A]">
              Pantau koridor rute penyaluran sampah kertas UPJ. Klik mitra industri pada daftar untuk mengarahkan peta langsung ke lokasi mitra tersebut.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleResetMap}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAFAF7] hover:bg-[#E6ECDD] text-[#005138] text-xs font-bold border border-[#E3DDCF] transition-colors"
              title="Reset tampilan peta ke seluruh jaringan"
            >
              <span className="material-symbols-outlined text-[15px]">zoom_out_map</span>
              Tampilkan Semua Rute
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6ECDD] text-[#005138] text-xs font-bold border border-[#2D6A4F]/20">
              <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
              3 Mitra Industri Aktif
            </span>
          </div>
        </div>

        {/* Quick Filter Partner Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-[#8CA090] uppercase tracking-wider shrink-0 mr-1">Fokus Cepat:</span>
          {MITRA_PARTNERS.map(mitra => {
            const isSelected = selectedMitraId === mitra.id;
            return (
              <button
                key={mitra.id}
                onClick={() => handleSelectMitra(mitra)}
                className={`px-3 py-1.5 rounded-full font-bold text-xs transition-all shrink-0 flex items-center gap-1.5 border ${isSelected
                  ? 'bg-[#005138] text-white border-[#005138] shadow-xs'
                  : 'bg-[#FAFAF7] text-[#52645A] border-[#E3DDCF] hover:border-[#2D6A4F] hover:text-[#1A2E22]'
                  }`}
              >
                <span className="material-symbols-outlined text-[14px]">{mitra.iconName}</span>
                {mitra.name}
                <span className="text-[10px] opacity-75">({mitra.distance})</span>
              </button>
            );
          })}
        </div>

        {/* Map and Route Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Interactive Leaflet Map Area (7 Columns on Desktop) */}
          <div className="lg:col-span-7 rounded-[14px] overflow-hidden border border-[#E3DDCF] relative h-[420px] sm:h-[460px] shadow-inner bg-[#FAFAF7]">
            <MapContainer
              center={[-6.292137, 106.725419]}
              zoom={12}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%', zIndex: 1 }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                maxZoom={19}
              />

              {/* Skala jarak */}
              <MapScaleControl />

              {/* Radius layanan penjemputan di sekitar Drop Point UPJ */}
              <Circle
                center={[-6.292137, 106.725419]}
                radius={5200}
                pathOptions={{
                  color: '#C27D3A',
                  weight: 1.5,
                  opacity: 0.55,
                  fillColor: '#C27D3A',
                  fillOpacity: 0.05,
                  dashArray: '5, 8',
                }}
              />

              {/* Dynamic Fly Controller */}
              <MapFlyController
                coords={mapTarget.coords}
                zoom={mapTarget.zoom}
                triggerKey={mapTarget.triggerKey}
              />

              {/* Route connecting UPJ to Bintaro */}
              <Polyline
                positions={[
                  [-6.292137, 106.725419],
                  [-6.2500, 106.7600]
                ]}
                pathOptions={{
                  color: selectedMitraId === 'mitra-bintaro' ? '#8A5309' : '#2D6A4F',
                  weight: selectedMitraId === 'mitra-bintaro' ? 5 : 3.5,
                  dashArray: '6, 8',
                  opacity: selectedMitraId === 'mitra-bintaro' ? 1 : 0.75,
                }}
              />

              {/* Route connecting UPJ to Serpong */}
              <Polyline
                positions={[
                  [-6.292137, 106.725419],
                  [-6.3000, 106.7000]
                ]}
                pathOptions={{
                  color: selectedMitraId === 'mitra-serpong' ? '#005138' : '#8A5309',
                  weight: selectedMitraId === 'mitra-serpong' ? 5 : 3.5,
                  dashArray: '6, 8',
                  opacity: selectedMitraId === 'mitra-serpong' ? 1 : 0.75,
                }}
              />

              {/* Route connecting UPJ to Ciputat */}
              <Polyline
                positions={[
                  [-6.292137, 106.725419],
                  [-6.3150, 106.7450]
                ]}
                pathOptions={{
                  color: selectedMitraId === 'mitra-ciputat' ? '#2D6A4F' : '#52B788',
                  weight: selectedMitraId === 'mitra-ciputat' ? 5 : 3.5,
                  dashArray: '6, 8',
                  opacity: selectedMitraId === 'mitra-ciputat' ? 1 : 0.75,
                }}
              />

              {/* Markers for all logistics partners */}
              {MITRA_PARTNERS.map(partner => (
                <Marker
                  key={partner.id}
                  position={partner.coords}
                  zIndexOffset={partner.type === 'drop_point' ? 1000 : 0}
                  icon={
                    partner.type === 'drop_point'
                      ? markerIconDropPoint
                      : buildMitraIcon(partner.color, partner.iconName, avatarFor(partner))
                  }
                  eventHandlers={{
                    click: () => handleSelectMitra(partner),
                  }}
                >
                  <Popup className="font-sans">
                    <div className="p-1 min-w-[210px]">
                      <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: partner.color }}>
                        {partner.category}
                      </div>
                      <div className="text-xs font-extrabold text-[#1A2E22]">{partner.name}</div>
                      <p className="text-[11px] text-[#52645A] mt-0.5">{partner.address}</p>
                      <div className="mt-2 pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-[#1A2E22]">{partner.capacity}</span>
                        <span className={`px-1.5 py-0.5 rounded font-bold ${partner.badgeClass}`}>
                          {badgeFor(partner)}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Floating Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-[10px] border border-[#E3DDCF] shadow-sm text-[10px] space-y-1.5 pointer-events-auto">
              <div className="font-bold text-[#1A2E22] uppercase tracking-wider text-[9px] mb-1">Titik Logistik Sirkular:</div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F] shrink-0" />
                <span className="font-semibold text-[#1A2E22]">{APP_BRAND.dropPointUtama.nama}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8A5309] shrink-0" />
                <span className="font-medium text-[#1A2E22]">PT Mandiri Daur Lestari (Bintaro, 4.2 km)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#005138] shrink-0" />
                <span className="font-medium text-[#1A2E22]">Pabrik Kertas Kraft (Serpong, 8.7 km)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F] shrink-0" />
                <span className="font-medium text-[#1A2E22]">CV Berkah Daur (Ciputat, 5.4 km)</span>
              </div>
            </div>
          </div>

          {/* Interactive Industrial Partners List Panel (5 Columns on Desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              <div className="text-[11px] font-bold text-[#8CA090] uppercase tracking-wider flex items-center justify-between px-1">
                <span>Daftar Mitra & Drop Point ({MITRA_PARTNERS.length})</span>
                <span className="text-[10px] text-[#2D6A4F] font-semibold lowercase">klik untuk arahkan peta</span>
              </div>

              {MITRA_PARTNERS.map(partner => {
                const isSelected = selectedMitraId === partner.id;
                const isHub = partner.type === 'drop_point';
                return (
                  <div
                    key={partner.id}
                    onClick={() => handleSelectMitra(partner)}
                    className={`p-3.5 rounded-[12px] border transition-all cursor-pointer text-left relative group ${
                      isHub
                        ? 'bg-gradient-to-br from-[#FFF6E8] via-[#FDF0DC] to-[#FAE7CB] border-[#C27D3A]/45 shadow-[0_10px_26px_rgba(126,85,59,0.14)] ring-1 ring-[#C27D3A]/25'
                        : isSelected
                          ? 'bg-[#E6ECDD]/45 border-[#2D6A4F] shadow-sm ring-1 ring-[#2D6A4F]'
                          : 'bg-white border-[#E3DDCF] hover:border-[#2D6A4F] hover:bg-[#FAFAF7]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        {avatarFor(partner) ? (
                          <img
                            src={avatarFor(partner)}
                            alt={`Foto profil ${partner.name}`}
                            className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-white border border-[#E3DDCF]"
                          />
                        ) : (
                          <span
                            className={`flex items-center justify-center shrink-0 ${
                              isHub
                                ? 'w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#C27D3A] to-[#8A5309] text-white shadow-sm'
                                : 'w-7 h-7 rounded-[8px]'
                            }`}
                            style={
                              isHub
                                ? undefined
                                : {
                                    backgroundColor: isSelected ? partner.color : '#FAFAF7',
                                    color: isSelected ? '#FFFFFF' : partner.color,
                                  }
                            }
                          >
                            <span className="material-symbols-outlined text-[16px]">{partner.iconName}</span>
                          </span>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#1A2E22] flex items-center gap-1.5">
                            {partner.name}
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] animate-ping" />
                            )}
                          </div>
                          <div className="text-[10px] font-medium text-[#8CA090]">{partner.category}</div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${partner.badgeClass}`}>
                        {badgeFor(partner)}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#52645A] line-clamp-1 mb-1.5">
                      <span className="font-semibold text-[#1A2E22]">Alamat:</span> {partner.address}
                    </p>

                    {/* Titik koordinat lokasi pada peta */}
                    <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] text-[#52645A]">
                      <span className="material-symbols-outlined text-[12px] text-[#C27D3A]">my_location</span>
                      <span className="font-semibold text-[#1A2E22]">
                        {partner.coords[0].toFixed(4)}, {partner.coords[1].toFixed(4)}
                      </span>
                      {isHub && (
                        <span className="font-sans text-[9px] font-bold uppercase tracking-wide text-[#A0632B]">
                          titik kumpul drop point
                        </span>
                      )}
                    </p>

                    <div className="pt-2 border-t border-[#E3DDCF]/60 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-2 text-[#52645A]">
                        <span className="inline-flex items-center gap-1 font-semibold text-[#1A2E22]">
                          <span className="material-symbols-outlined text-[13px] text-[#2D6A4F]">pin_drop</span>
                          {partner.distance}
                        </span>
                        <span>•</span>
                        <span>{partner.armada}</span>
                      </div>

                      <button
                        type="button"
                        className={`px-2.5 py-1 rounded-[6px] font-bold text-[10px] flex items-center gap-1 transition-colors ${isSelected
                          ? 'bg-[#2D6A4F] text-white'
                          : 'bg-[#FAFAF7] text-[#2D6A4F] group-hover:bg-[#E6ECDD]'
                          }`}
                      >
                        <span className="material-symbols-outlined text-[12px]">location_searching</span>
                        {isSelected ? 'Aktif di Peta' : 'Arahkan Peta'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => setActiveRoute('/admin/unit-tong')}
              className="w-full py-2.5 px-4 rounded-[10px] bg-[#005138] hover:bg-[#2D6A4F] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">alt_route</span>
              Kelola Alokasi Drop Point & Tong
            </button>
          </div>
        </div>
      </div>
      {/* ═══ 7. UNIT LEADERBOARD RANKINGS ═══ */}
      <div className="bg-white border border-[#E3DDCF] rounded-[16px] p-6 shadow-xs">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#E3DDCF]">
          <div>
            <h3 className="font-bold text-[#1A2E22] text-base">Peringkat Keaktifan Unit Kampus</h3>
            <p className="text-xs text-[#52645A]">Distribusi serapan kertas dan perolehan Eco-Points unit</p>
          </div>
          <button
            onClick={() => setActiveRoute('/leaderboard')}
            className="text-xs font-bold text-[#2D6A4F] hover:underline flex items-center gap-1"
          >
            Lihat Semua Peringkat <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-12 text-[10px] text-[#8CA090] font-bold uppercase tracking-wider mb-2 px-2">
          <span className="col-span-1">#</span>
          <span className="col-span-5 sm:col-span-6">Nama Unit</span>
          <span className="col-span-3 sm:col-span-3 text-center">Tersalurkan (Kg)</span>
          <span className="col-span-3 sm:col-span-2 text-right">Eco-Points</span>
        </div>

        <div className="space-y-1.5">
          {rankedUnits.slice(0, 5).map((u, i) => (
            <div key={u.id} className="grid grid-cols-12 items-center px-2 py-2.5 rounded-[10px] hover:bg-[#FAFAF7] transition-colors group">
              <span className={`col-span-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold ${i === 0 ? 'bg-[#2D6A4F] text-white' : i === 1 ? 'bg-[#40916C] text-white' : 'bg-[#ECE6D7] text-[#52645A]'
                }`}>
                {i + 1}
              </span>
              <div className="col-span-5 sm:col-span-6 pr-4 min-w-0">
                <div className="text-xs font-bold text-[#1A2E22] truncate group-hover:text-[#2D6A4F] transition-colors">{u.nama_unit}</div>
                <div className="w-full bg-[#ECE6D7] rounded-full overflow-hidden mt-1.5" style={{ height: 4 }}>
                  <div
                    className="h-full rounded-full bg-[#2D6A4F]"
                    style={{
                      width: isLoaded ? `${(u.kg / (rankedUnits[0]?.kg || 1)) * 100}%` : '0%',
                      transition: `width 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 100}ms`
                    }}
                  />
                </div>
              </div>
              <span className="col-span-3 sm:col-span-3 text-center text-xs font-bold text-[#1A2E22] tabular-nums">{u.kg} Kg</span>
              <span className="col-span-3 sm:col-span-2 text-right text-xs font-extrabold text-[#2D6A4F] tabular-nums">{u.points} pts</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
