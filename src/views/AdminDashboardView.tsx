import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

/* ─── Leaflet Map Marker Icons ─── */
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
  html: `<div style="background-color: #1B4332; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid white;"><span class="material-symbols-outlined" style="color: white; font-size: 17px;">recycling</span></div>`,
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

/* ─── Logistics Partners Data ─── */
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
}

const MITRA_PARTNERS: LogisticsPartner[] = [
  {
    id: 'upj-gsg',
    name: 'Drop Point Kampus UPJ (GSG)',
    type: 'drop_point',
    category: 'Pusat Konsolidasi Utama',
    address: 'Jl. Cendrawasih Raya Blok B7/P, Bintaro Jaya, Sawah Baru, Ciputat, Tangerang Selatan',
    coords: [-6.291391, 106.725795],
    distance: 'Pusat Kampus',
    badge: '8 / 10 Tong Aktif',
    badgeClass: 'bg-[#E8F5EE] text-[#1B4332] border-[#2D6A4F]/25',
    color: '#2D6A4F',
    iconName: 'school',
    iconType: markerIconUnit,
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
    distance: '4.2 Km dari UPJ',
    badge: 'Siap Tampung 3 Ton',
    badgeClass: 'bg-[#FEF3C7] text-[#92400E] border-[#D97706]/25',
    color: '#D97706',
    iconName: 'factory',
    iconType: markerIconIndustri,
    acceptedTypes: ['Kertas HVS Kantor', 'Koran', 'Arsip Rahasia Terpilah'],
    capacity: 'Kapasitas Harian: 3.000 Kg',
    armada: 'Armada Truk Box Sedang (Nomor #A-02)',
    driver: 'Pak Hendro (Status: Standby)',
    jadwal: 'Penjemputan Setiap Selasa & Jumat Pagi',
  },
  {
    id: 'mitra-serpong',
    name: 'Pabrik Pengolah Kertas Serpong',
    type: 'mitra_industri',
    category: 'Pabrik Peleburan Kardus & Dupleks',
    address: 'Kawasan Industri Taman Tekno BSD Blok J-12, Serpong (~7.8 Km dari UPJ)',
    coords: [-6.3000, 106.7000],
    distance: '7.8 Km dari UPJ',
    badge: 'Kapasitas Besar',
    badgeClass: 'bg-[#E8F5EE] text-[#1B4332] border-[#2D6A4F]/25',
    color: '#1B4332',
    iconName: 'recycling',
    iconType: markerIconSerpong,
    acceptedTypes: ['Kardus Box Gelombang (Corrugated)', 'Dupleks', 'Karton Tebal'],
    capacity: 'Kapasitas Harian: 8.000 Kg',
    armada: 'Truk Tronton Hidrolik (Nomor #TR-01)',
    driver: 'Pak Bambang (Status: Menuju Pabrik)',
    jadwal: 'Penjemputan Terjadwal: Setiap Kamis Jam 10.00',
  },
  {
    id: 'mitra-ciputat',
    name: 'CV Berkah Jaya Daur Ulang',
    type: 'mitra_industri',
    category: 'Bank Sampah & Pusat Sortir Ciputat',
    address: 'Jl. Dewi Sartika No. 45, Cipayung, Ciputat (~3.1 Km dari UPJ)',
    coords: [-6.3100, 106.7400],
    distance: '3.1 Km dari UPJ',
    badge: 'Mitra Cepat Tanggap',
    badgeClass: 'bg-[#D1FAE5] text-[#065F46] border-[#059669]/25',
    color: '#059669',
    iconName: 'precision_manufacturing',
    iconType: markerIconCiputat,
    acceptedTypes: ['Semua Jenis Kertas Bersih', 'Koran Buram', 'Majalah'],
    capacity: 'Kapasitas Harian: 1.500 Kg',
    armada: 'Pick-Up L300 Khusus Kampus (Nomor #PU-03)',
    driver: 'Mas Dani (Status: Siap Jemput 2 Jam)',
    jadwal: 'Layanan Jemput Kilat (Senin - Sabtu)',
  },
];

/* ─── Smooth Catmull-Rom Spline Helper (Ensures line passes exactly through points) ─── */
function createSmoothSpline(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return '';
  let path = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x},${p2.y}`;
  }
  return path;
}

export const AdminDashboardView: React.FC = () => {
  const { units, totalKgTersalurkan, totalPohon, totalAirBersih, laporanList, setActiveRoute } = useApp();

  // Animation on initial mount
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 120);
    return () => clearTimeout(timer);
  }, []);

  // Mascot quotes & hover states
  const [activeMascotQuote, setActiveMascotQuote] = useState(0);
  const [hoveredMascot, setHoveredMascot] = useState<'mina' | 'moni' | null>(null);

  const mascotQuotes = [
    { mina: 'Hai Admin! Kertas HVS UPJ siap olah! ✨', moni: 'Kardus terjaga kering & rapi!' },
    { mina: 'Hari ini emisi CO2 kampus turun lagi lho! 🌿', moni: 'Armada mitra siap jemput tepat waktu!' },
    { mina: 'Klik kami kalau butuh semangat sirkular! 💚', moni: 'Semangat pilah limbah kertas kampus!' }
  ];

  // Interactive Map State
  const [selectedMitraId, setSelectedMitraId] = useState<string>('upj-gsg');
  const [mapTarget, setMapTarget] = useState<{ coords: [number, number]; zoom: number; triggerKey: number }>({
    coords: [-6.291391, 106.725795],
    zoom: 13,
    triggerKey: Date.now(),
  });

  const handleSelectMitra = (mitra: LogisticsPartner) => {
    setSelectedMitraId(mitra.id);
    setMapTarget({
      coords: mitra.coords,
      zoom: 15,
      triggerKey: Date.now(),
    });
  };

  const handleResetMap = () => {
    setSelectedMitraId('upj-gsg');
    setMapTarget({
      coords: [-6.291391, 106.725795],
      zoom: 12,
      triggerKey: Date.now(),
    });
  };

  const selectedPartner = MITRA_PARTNERS.find(p => p.id === selectedMitraId) || MITRA_PARTNERS[0];

  // Line Chart Data Points
  const linePoints = [
    { month: 'Apr', label: '24.500 Kg', x: 60, y: 140 },
    { month: 'Mei', label: '31.200 Kg', x: 170, y: 122 },
    { month: 'Jun', label: '38.800 Kg', x: 280, y: 98 },
    { month: 'Jul', label: '44.600 Kg', x: 390, y: 84 },
    { month: 'Agu', label: '48.100 Kg', x: 500, y: 68 },
    { month: 'Sep', label: '52.180 Kg', x: 610, y: 50 },
  ];
  const splinePath = createSmoothSpline(linePoints);
  const areaPath = `${splinePath} L 610,180 L 60,180 Z`;

  const [activeLinePoint, setActiveLinePoint] = useState<number | null>(5);

  // Categories composition data
  const categories = [
    { id: 'hvs', name: 'Kertas HVS & Arsip', pct: 42, amount: '21.900 Kg', color: '#2D6A4F', desc: 'Arsip kantor & berkas prodi UPJ', dasharray: '158 218', dashoffset: 0 },
    { id: 'kardus', name: 'Kardus Box Cokelat', pct: 28, amount: '14.610 Kg', color: '#C4934F', desc: 'Kardus logistik & paket kampus', dasharray: '105 271', dashoffset: -158 },
    { id: 'dupleks', name: 'Kertas Dupleks', pct: 16, amount: '8.350 Kg', color: '#E76F51', desc: 'Karton kemasan & box makanan kering', dasharray: '60 316', dashoffset: -263 },
    { id: 'koran', name: 'Koran & Buram', pct: 14, amount: '7.320 Kg', color: '#52B788', desc: 'Surat kabar perpustakaan & buram', dasharray: '53 323', dashoffset: -323 },
  ];
  const [hoveredCategory, setHoveredCategory] = useState<typeof categories[0] | null>(null);

  // Bar chart monthly comparison
  const barData = [
    { month: 'Apr', setor: 48, setorKg: '24.500 Kg', mitra: 38, mitraKg: '19.200 Kg', eff: '78%' },
    { month: 'Mei', setor: 62, setorKg: '31.200 Kg', mitra: 50, mitraKg: '25.000 Kg', eff: '80%' },
    { month: 'Jun', setor: 74, setorKg: '38.800 Kg', mitra: 60, mitraKg: '31.500 Kg', eff: '81%' },
    { month: 'Jul', setor: 85, setorKg: '44.600 Kg', mitra: 70, mitraKg: '36.800 Kg', eff: '83%' },
    { month: 'Agu', setor: 92, setorKg: '48.100 Kg', mitra: 80, mitraKg: '41.500 Kg', eff: '86%' },
    { month: 'Sep', setor: 98, setorKg: '52.180 Kg', mitra: 88, mitraKg: '46.800 Kg', eff: '90%' },
  ];
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

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

  return (
    <div className="w-full max-w-6xl mx-auto font-sans text-[#141E18] space-y-6 pb-12">

      {/* ─── 1. TOP GREETING HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-2xl">☀️</span>
            <h1 className="text-xl sm:text-2xl font-black text-[#141E18] tracking-tight">
              Selamat Pagi, Tim Pengelola!
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E0E5E2] text-[11px] font-bold text-[#4A5C52] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
              <span>Senin, 04 November 2026</span>
            </span>
          </div>
          <p className="text-xs text-[#4A5C52] font-medium mt-1">
            Berikut ringkasan perputaran limbah kertas &amp; logistik kampus UPJ hari ini.
          </p>
        </div>
      </div>

      {/* ─── 2. HERO BANNER PERSIS REFERENSI (MINA DIGESER KE KIRI AGAR TIDAK TERTUMPUK DENGAN MONI) ─── */}
      <div className="w-full relative pt-10 sm:pt-12 mb-2">
        {/* Dark Forest Green Background Card */}
        <div className="absolute inset-x-0 bottom-0 top-10 sm:top-12 rounded-[28px] sm:rounded-[32px] bg-[#174630] border border-[#52B788]/30 shadow-xl shadow-[#0C2419]/25 overflow-hidden pointer-events-none">
          <div className="absolute -right-10 -bottom-14 w-80 h-80 rounded-full bg-[#52B788]/20 blur-3xl" />
          <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none" viewBox="0 0 800 220">
            <path d="M -50 100 Q 150 20 350 120 T 750 40 T 950 180" fill="none" stroke="#52B788" strokeWidth="1.5" />
            <path d="M -50 150 Q 200 60 450 180 T 850 90" fill="none" stroke="#D8F3DC" strokeWidth="1" />
          </svg>
        </div>

        {/* Content Container (Overflow-visible so Mascots sprout above top edge!) */}
        <div className="relative z-10 px-6 sm:px-9 py-7 sm:py-8 min-h-[225px] sm:min-h-[245px] flex items-center overflow-visible">
          
          {/* Left Text Column */}
          <div className="max-w-[50%] sm:max-w-xs md:max-w-sm lg:max-w-md space-y-3 z-10 text-left">
            <div className="inline-flex items-center gap-2 bg-[#0F2D1F]/60 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-wider text-[#A7F3D0] uppercase border border-white/10 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse" />
              PUSAT KOMANDO SIRKULARITAS • KAMPUS UPJ
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
              Monitoring Sirkularitas &amp; Limbah Kertas
            </h2>

            <p className="text-xs sm:text-sm text-[#D1FAE5]/85 font-normal leading-relaxed max-w-sm">
              Pantau serapan limbah kertas kampus, kendalikan kapasitas drop point serbaguna, dan pastikan penyaluran ke mitra industri berjalan tepat waktu.
            </p>
          </div>

          {/* Right Column: Mascots with Floating Animation & Clear Horizontal Spacing */}
          <div
            className="absolute bottom-0 right-1 sm:right-4 md:right-8 flex items-end justify-end select-none cursor-pointer group pb-0 z-20 overflow-visible pointer-events-auto"
            onClick={() => setActiveMascotQuote(q => (q + 1) % mascotQuotes.length)}
            title="Klik Mina &amp; Moni untuk pesan berikutnya"
            role="button"
            tabIndex={0}
            aria-label="Maskot Mina dan Moni"
          >
            {/* Ambient Glow behind mascots */}
            <div className="absolute w-72 h-72 rounded-full bg-[#52B788]/20 blur-3xl -top-6 pointer-events-none" />

            {/* Ground Contact Shadow */}
            <div className="absolute bottom-0 w-72 h-5 bg-[#081F14]/60 rounded-full blur-md pointer-events-none z-0" />

            {/* Characters Pair Container (Side-by-side with clear gap, no cramming!) */}
            <div className="relative flex items-end justify-end z-10 pb-0 overflow-visible">

              {/* Mina (Paper Sheets Mascot) — Shifted left with clear breathing space */}
              <div
                className="relative -translate-x-28 sm:-translate-x-36 md:-translate-x-44 w-[130px] sm:w-[155px] md:w-[175px] h-[230px] sm:h-[260px] md:h-[285px] flex items-end justify-center animate-float-mina z-10 transition-transform duration-300 hover:scale-105 hover:z-30 cursor-pointer"
                onMouseEnter={() => setHoveredMascot('mina')}
                onMouseLeave={() => setHoveredMascot(null)}
              >
                {/* Speech Bubble directly above Mina */}
                {(hoveredMascot === 'mina' || hoveredMascot === null) && (
                  <div className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 z-40 pointer-events-auto cursor-pointer animate-speech-bubble whitespace-nowrap">
                    <div className="relative bg-white text-[#141E18] px-3.5 py-1.5 rounded-full shadow-lg border border-[#E0E5E2] text-[10px] sm:text-[11px] font-extrabold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform">
                      <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse shrink-0" />
                      <span>{mascotQuotes[activeMascotQuote].mina}</span>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-[#E0E5E2]" />
                    </div>
                  </div>
                )}

                <img
                  src="/mina.png"
                  alt="Mina - Maskot Kertas"
                  className="max-w-none h-[230px] sm:h-[260px] md:h-[285px] object-contain object-bottom pointer-events-none"
                  style={{
                    filter: 'drop-shadow(0 16px 20px rgba(7, 24, 16, 0.45)) drop-shadow(0 4px 6px rgba(7, 24, 16, 0.3))'
                  }}
                />
              </div>

              {/* Moni (Cardboard Stack Mascot) — Positioned cleanly beside Mina, NO overlapping! */}
              <div
                className="relative -ml-4 sm:-ml-6 md:-ml-8 w-[115px] sm:w-[140px] md:w-[160px] h-[195px] sm:h-[225px] md:h-[245px] flex items-end justify-center animate-float-moni z-20 transition-transform duration-300 hover:scale-105 hover:z-30 cursor-pointer"
                onMouseEnter={() => setHoveredMascot('moni')}
                onMouseLeave={() => setHoveredMascot(null)}
              >
                {hoveredMascot === 'moni' && (
                  <div className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 z-40 pointer-events-auto cursor-pointer animate-speech-bubble whitespace-nowrap">
                    <div className="relative bg-white text-[#78350F] px-3.5 py-1.5 rounded-full shadow-lg border border-[#FDE68A] text-[10px] sm:text-[11px] font-extrabold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform">
                      <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse shrink-0" />
                      <span>{mascotQuotes[activeMascotQuote].moni}</span>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-[#FDE68A]" />
                    </div>
                  </div>
                )}

                <img
                  src="/moni.png"
                  alt="Moni - Maskot Kardus"
                  className="max-w-none h-[195px] sm:h-[225px] md:h-[245px] object-contain object-bottom pointer-events-none"
                  style={{
                    filter: 'drop-shadow(0 14px 18px rgba(7, 24, 16, 0.45)) drop-shadow(0 4px 6px rgba(7, 24, 16, 0.25))'
                  }}
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. EXACT 3 ACTION BUTTON CARDS FROM USER SCREENSHOT ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Card 1: Kelola Unit & Tong */}
        <button
          onClick={() => setActiveRoute('/admin/unit-tong')}
          className="bg-white rounded-2xl p-4 border border-[#E0E5E2] shadow-xs hover:shadow-md hover:border-[#2D6A4F]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-between group cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#E8F5EE] text-[#2D6A4F] flex items-center justify-center shrink-0 border border-[#D8F3DC] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#141E18] group-hover:text-[#2D6A4F] transition-colors">
                Kelola Unit &amp; Tong
              </h3>
              <p className="text-[11px] text-[#4A5C52] font-medium mt-0.5">
                Atur kuota slot tong di drop point GSG
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#8A9E94] text-lg group-hover:text-[#2D6A4F] group-hover:translate-x-1 transition-all">
            arrow_forward
          </span>
        </button>

        {/* Card 2: Laporan & Sengketa */}
        <button
          onClick={() => setActiveRoute('/admin/laporan')}
          className="bg-white rounded-2xl p-4 border border-[#E0E5E2] shadow-xs hover:shadow-md hover:border-[#E76F51]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-between group cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FEECEC] text-[#C0392B] flex items-center justify-center shrink-0 border border-[#FCD5D5] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#141E18] group-hover:text-[#C0392B] transition-colors">
                Laporan &amp; Sengketa {pendingLaporan > 0 && <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-[#C0392B] text-white">{pendingLaporan}</span>}
              </h3>
              <p className="text-[11px] text-[#4A5C52] font-medium mt-0.5">
                Tinjau kontaminasi basah/minyak
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#8A9E94] text-lg group-hover:text-[#C0392B] group-hover:translate-x-1 transition-all">
            arrow_forward
          </span>
        </button>

        {/* Card 3: Papan Skor Sirkularitas */}
        <button
          onClick={() => setActiveRoute('/leaderboard')}
          className="bg-white rounded-2xl p-4 border border-[#E0E5E2] shadow-xs hover:shadow-md hover:border-[#D97706]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-between group cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 border border-[#FDE68A] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#141E18] group-hover:text-[#D97706] transition-colors">
                Papan Skor Sirkularitas
              </h3>
              <p className="text-[11px] text-[#4A5C52] font-medium mt-0.5">
                Peringkat unit &amp; konversi dana kas
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#8A9E94] text-lg group-hover:text-[#D97706] group-hover:translate-x-1 transition-all">
            arrow_forward
          </span>
        </button>
      </div>

      {/* ─── 4. OVERVIEW STATS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 — Total Tersalurkan */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0E5E2] shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#8A9E94] uppercase tracking-wider">Total Tersalurkan</span>
            <span className="w-7 h-7 rounded-lg bg-[#E8F5EE] text-[#2D6A4F] flex items-center justify-center font-black text-xs">
              Kg
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[#141E18] tracking-tight tabular-nums">{totalKgTersalurkan.toLocaleString('id-ID')}</span>
              <span className="text-xs font-bold text-[#8A9E94]">Kg</span>
            </div>
            <p className="text-[11px] text-[#2D6A4F] font-semibold mt-0.5">Target {targetSemester.toLocaleString('id-ID')} Kg • Semester Genap</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E0E5E2]/60 flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F]">
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#E8F5EE] text-[11px]">
              ↑ 12.4%
            </span>
            <span className="text-[11px] text-[#8A9E94] font-medium">vs. bulan lalu</span>
          </div>
        </div>

        {/* Card 2 — Nilai Sirkularitas */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0E5E2] shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#8A9E94] uppercase tracking-wider">Nilai Sirkularitas</span>
            <span className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-black text-xs">
              Rp
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-[#8A9E94]">Rp</span>
              <span className="text-2xl sm:text-3xl font-black text-[#141E18] tracking-tight tabular-nums">{(nilaiSirkularitas).toLocaleString('id-ID')}</span>
            </div>
            <p className="text-[11px] text-[#C4934F] font-semibold mt-0.5">Rata-rata Rp 1.400 / Kg Terpilah</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E0E5E2]/60 flex items-center gap-1.5 text-xs font-bold text-[#D97706]">
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[11px]">
              ↑ 18.2%
            </span>
            <span className="text-[11px] text-[#8A9E94] font-medium">distribusi kas unit</span>
          </div>
        </div>

        {/* Card 3 — Capaian Semester */}
        <div 
          className="bg-white rounded-2xl p-5 border border-[#E0E5E2] shadow-xs flex flex-col justify-between group relative cursor-help hover:shadow-sm transition-shadow"
          title={`Target ${targetSemester} Kg • Tercapai ${totalKgTersalurkan} Kg (${pct}%)`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#8A9E94] uppercase tracking-wider">Capaian Semester</span>
            <span className="text-xs font-black text-[#2D6A4F] tabular-nums">{pct}%</span>
          </div>
          <div className="mt-3">
            <div className="w-full h-2.5 bg-[#F1EEE5] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#2D6A4F] rounded-full transition-all duration-1000 ease-out" 
                style={{ width: isLoaded ? `${pct}%` : '0%' }} 
              />
            </div>
            <p className="text-[11px] text-[#4A5C52] font-semibold mt-2">
              Tersisa {(targetSemester - totalKgTersalurkan).toLocaleString('id-ID')} Kg menuju target
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E0E5E2]/60 flex items-center gap-1 text-[11px] font-bold text-[#2D6A4F]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
            <span>Target Genap 2026</span>
          </div>
        </div>

        {/* Card 4 — Dampak Ekologis */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0E5E2] shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#8A9E94] uppercase tracking-wider">Dampak Ekologis</span>
            <span className="w-7 h-7 rounded-lg bg-[#E8F5EE] text-[#2D6A4F] flex items-center justify-center font-bold text-xs">
              🌱
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <p className="text-xl font-black text-[#2D6A4F] tabular-nums">{totalPohon} Pohon</p>
              <p className="text-[10px] text-[#8A9E94] font-semibold">Terselamatkan</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-[#141E18] tabular-nums">{totalAirBersih} L</p>
              <p className="text-[10px] text-[#8A9E94] font-semibold">Air Terhemat</p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E0E5E2]/60 flex items-center gap-1 text-[11px] font-bold text-[#2D6A4F]">
            <span className="material-symbols-outlined text-xs">verified</span>
            <span>Tervalidasi Sistem UPJ</span>
          </div>
        </div>
      </div>

      {/* ─── 5. INTERACTIVE CHARTS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Volume Pengumpulan Line Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#E0E5E2] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0E5E2]/70">
            <div>
              <h2 className="text-sm font-black text-[#141E18]">Tren Volume Pengumpulan Kertas</h2>
              <p className="text-[11px] text-[#4A5C52] font-medium mt-0.5">Arahkan kursor pada titik grafik untuk melihat rincian tonase per bulan</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F7F8F5] border border-[#E0E5E2] rounded-lg text-xs font-bold text-[#141E18]">
              <span>6 Bulan Terakhir</span>
            </div>
          </div>

          <div className="relative mt-6 pt-4">
            {/* Dynamic Clean Floating Tooltip */}
            {activeLinePoint !== null && (
              <div 
                className="absolute z-30 pointer-events-none transition-all duration-200 ease-out -translate-x-1/2 -translate-y-full"
                style={{ 
                  left: `${(linePoints[activeLinePoint].x / 650) * 100}%`,
                  top: `${(linePoints[activeLinePoint].y / 200) * 100}%`,
                  marginTop: '-10px'
                }}
              >
                <div className="bg-[#1B4332] text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-lg flex flex-col items-center gap-0.5 whitespace-nowrap border border-white/20">
                  <span className="text-[9px] uppercase tracking-wider text-[#A7F3D0]">{linePoints[activeLinePoint].month} 2026</span>
                  <span className="text-xs font-black">{linePoints[activeLinePoint].label}</span>
                </div>
                <div className="w-2 h-2 bg-[#1B4332] rotate-45 mx-auto -mt-1 border-r border-b border-white/20" />
              </div>
            )}

            <svg viewBox="0 0 650 200" className="w-full h-52 overflow-visible">
              <defs>
                <linearGradient id="creamGreenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#52B788" stopOpacity={isLoaded ? "0.30" : "0"} />
                  <stop offset="100%" stopColor="#52B788" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="40" y1="30" x2="630" y2="30" stroke="#E0E5E2" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="40" y1="70" x2="630" y2="70" stroke="#E0E5E2" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="40" y1="110" x2="630" y2="110" stroke="#E0E5E2" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="40" y1="150" x2="630" y2="150" stroke="#E0E5E2" strokeDasharray="4 4" strokeWidth="1" />

              <text x="10" y="34" className="text-[10px] fill-[#8A9E94] font-bold">80K</text>
              <text x="10" y="74" className="text-[10px] fill-[#8A9E94] font-bold">60K</text>
              <text x="10" y="114" className="text-[10px] fill-[#8A9E94] font-bold">40K</text>
              <text x="10" y="154" className="text-[10px] fill-[#8A9E94] font-bold">20K</text>

              <path
                d={areaPath}
                fill="url(#creamGreenGradient)"
                className="transition-opacity duration-1000 ease-out"
                style={{ opacity: isLoaded ? 1 : 0 }}
              />

              <path
                d={splinePath}
                fill="none"
                stroke="#2D6A4F"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="800"
                strokeDashoffset={isLoaded ? '0' : '800'}
                style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />

              {linePoints.map((pt, idx) => {
                const isActive = activeLinePoint === idx;
                return (
                  <g 
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveLinePoint(idx)}
                    onClick={() => setActiveLinePoint(idx)}
                  >
                    <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                    {isActive && (
                      <circle 
                        cx={pt.x} 
                        cy={pt.y} 
                        r="9" 
                        fill="#2D6A4F" 
                        opacity="0.15" 
                      />
                    )}

                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isActive ? "6" : "4.5"}
                      fill={isActive ? "#2D6A4F" : "#FFFFFF"}
                      stroke="#2D6A4F"
                      strokeWidth={isActive ? "3" : "2"}
                      className="transition-all duration-150"
                    />
                  </g>
                );
              })}
            </svg>

            <div className="flex justify-between pl-12 pr-4 text-[11px] font-bold text-[#8A9E94] mt-2">
              {linePoints.map((pt, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveLinePoint(idx)}
                  className={`cursor-pointer transition-colors ${
                    activeLinePoint === idx ? 'text-[#2D6A4F] font-black' : 'hover:text-[#2D6A4F]'
                  }`}
                >
                  {pt.month}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Komposisi Jenis Kertas Donut Chart */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#E0E5E2] shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-[#E0E5E2]/70">
            <h2 className="text-sm font-black text-[#141E18]">Komposisi Jenis Kertas</h2>
            <p className="text-[11px] text-[#4A5C52] font-medium mt-0.5">Sentuh segmen untuk melihat detail jenis kertas</p>
          </div>

          <div className="relative flex items-center justify-center my-3">
            <svg viewBox="0 0 160 160" className="w-38 h-38 transform -rotate-90">
              <circle cx="80" cy="80" r="60" fill="none" stroke="#F1EEE5" strokeWidth="18" />
              
              {categories.map((c) => {
                const isHovered = hoveredCategory?.id === c.id;
                return (
                  <circle
                    key={c.id}
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke={c.color}
                    strokeWidth={isHovered ? "22" : "18"}
                    strokeDasharray={c.dasharray}
                    strokeDashoffset={isLoaded ? c.dashoffset : "-400"}
                    className="cursor-pointer transition-all duration-300 ease-out"
                    onMouseEnter={() => setHoveredCategory(c)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                );
              })}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-200 px-2 text-center">
              {hoveredCategory ? (
                <>
                  <span className="text-[10px] font-bold text-[#8A9E94] uppercase tracking-wider">{hoveredCategory.name}</span>
                  <span className="text-lg font-black tracking-tight" style={{ color: hoveredCategory.color }}>
                    {hoveredCategory.pct}%
                  </span>
                  <span className="text-[10px] font-bold text-[#141E18]">{hoveredCategory.amount}</span>
                </>
              ) : (
                <>
                  <span className="text-base font-black text-[#141E18] tracking-tight tabular-nums">52.180</span>
                  <span className="text-[9px] font-black text-[#2D6A4F] uppercase tracking-wider">Total Kg</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-1.5 mt-1 pt-2 border-t border-[#E0E5E2]/70">
            {categories.map((c) => {
              const isHovered = hoveredCategory?.id === c.id;
              return (
                <div 
                  key={c.id} 
                  className={`flex items-center justify-between text-xs p-1.5 rounded-lg cursor-pointer transition-all ${
                    isHovered ? 'bg-[#E8F5EE] scale-102 font-bold' : 'hover:bg-[#F7F8F5]'
                  }`}
                  onMouseEnter={() => setHoveredCategory(c)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <span className={`font-semibold ${isHovered ? 'text-[#2D6A4F] font-black' : 'text-[#141E18]'}`}>{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#8A9E94]">{c.pct}%</span>
                    <span className="font-black text-[#141E18] tabular-nums">{c.amount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── 6. DUAL BAR CHART (NO AWKWARD GAP, CLEAN PROPORTIONS & FLOATING STATS STRIP) & INTERACTIVE MAP ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Setor vs Salur Mitra Bar Chart (Tightened gap, dedicated info strip, taller bars) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E0E5E2] shadow-xs flex flex-col">
          
          {/* Header */}
          <div className="pb-3 border-b border-[#E0E5E2]/70">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-black text-[#141E18]">Setor vs Salur Mitra</h3>
              <div className="flex items-center gap-3 text-[10px] font-black">
                <span className="flex items-center gap-1.5 text-[#2D6A4F]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#2D6A4F]" /> Setor
                </span>
                <span className="flex items-center gap-1.5 text-[#52B788]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#52B788]" /> Mitra
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#4A5C52]">Perbandingan serapan tonase limbah kertas per bulan</p>
          </div>

          {/* Dedicated Info Banner at the Top of Chart (Solves "Keterangan terlalu mepet" completely!) */}
          <div className="mt-3 min-h-[38px] flex items-center">
            {hoveredBarIndex !== null ? (
              <div className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#141E18] text-white text-[11px] font-bold shadow-sm animate-speech-bubble">
                <div className="flex items-center gap-2">
                  <span className="text-[#A7F3D0] uppercase font-black tracking-wide">{barData[hoveredBarIndex].month} 2026:</span>
                  <span>Setor: <strong className="text-[#52B788]">{barData[hoveredBarIndex].setorKg}</strong></span>
                  <span className="text-white/30">|</span>
                  <span>Mitra: <strong className="text-[#A7F3D0]">{barData[hoveredBarIndex].mitraKg}</strong></span>
                </div>
                <span className="text-[10px] text-[#FDE68A] bg-white/10 px-2 py-0.5 rounded-md font-extrabold">
                  Serapan {barData[hoveredBarIndex].eff}
                </span>
              </div>
            ) : (
              <div className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#F7F8F5] border border-[#E0E5E2] text-[#4A5C52] text-[11px] font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
                  Arahkan kursor pada batang untuk melihat rincian
                </span>
                <span className="text-[10px] font-bold text-[#2D6A4F]">Rata-rata 83%</span>
              </div>
            )}
          </div>

          {/* Balanced Bars Container (Bars now gracefully fill the height without empty void!) */}
          <div className="relative flex-1 flex flex-col justify-end mt-4 pt-4 pb-1 min-h-[220px]">
            
            {/* Faint Background Gridlines */}
            <div className="absolute inset-x-2 top-4 bottom-8 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-b border-dashed border-[#E0E5E2] w-full" />
              <div className="border-b border-dashed border-[#E0E5E2] w-full" />
              <div className="border-b border-dashed border-[#E0E5E2] w-full" />
            </div>

            {/* Bars Row */}
            <div className="h-48 flex items-end justify-between gap-3 px-2 relative z-10">
              {barData.map((b, i) => {
                const isHovered = hoveredBarIndex === i;
                return (
                  <div 
                    key={i} 
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end cursor-pointer group"
                    onMouseEnter={() => setHoveredBarIndex(i)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                  >
                    <div className={`w-full flex items-end justify-center gap-1.5 h-40 p-1 rounded-lg transition-all ${
                      isHovered ? 'bg-[#E8F5EE]/80' : ''
                    }`}>
                      {/* Bar Setor */}
                      <div 
                        className={`w-3.5 bg-[#2D6A4F] rounded-t-sm transition-all duration-700 ease-out ${
                          isHovered ? 'brightness-110 shadow-xs' : ''
                        }`}
                        style={{ height: isLoaded ? `${b.setor}%` : '0%' }} 
                      />
                      {/* Bar Mitra */}
                      <div 
                        className={`w-3.5 bg-[#52B788] rounded-t-sm transition-all duration-700 ease-out ${
                          isHovered ? 'brightness-110 shadow-xs' : ''
                        }`}
                        style={{ height: isLoaded ? `${b.mitra}%` : '0%' }} 
                      />
                    </div>

                    <span className={`text-[11px] transition-colors ${
                      isHovered ? 'font-black text-[#2D6A4F]' : 'font-bold text-[#8A9E94]'
                    }`}>
                      {b.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Full Interactive Logistics Partner Map (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E0E5E2] shadow-xs flex flex-col justify-between">
          
          {/* Map Header with Reset Button */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-black text-[#141E18]">Peta Sebaran Mitra &amp; Drop Point</h3>
              <p className="text-[11px] text-[#4A5C52]">Klik salah satu lokasi untuk melihat info logistik &amp; armada</p>
            </div>
            <button
              onClick={handleResetMap}
              className="text-[11px] font-bold text-[#2D6A4F] hover:underline flex items-center gap-1 bg-[#E8F5EE] px-2.5 py-1 rounded-full cursor-pointer hover:bg-[#D8F3DC] transition-colors"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              <span>Reset Peta</span>
            </button>
          </div>

          {/* Clickable Location Selector Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
            {MITRA_PARTNERS.map((mitra) => {
              const isSelected = selectedMitraId === mitra.id;
              return (
                <button
                  key={mitra.id}
                  onClick={() => handleSelectMitra(mitra)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#2D6A4F] text-white shadow-xs scale-102' 
                      : 'bg-[#F7F8F5] text-[#4A5C52] border border-[#E0E5E2] hover:bg-[#E8F5EE] hover:text-[#2D6A4F]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {mitra.iconName}
                  </span>
                  <span>{mitra.name}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Leaflet Map with Smooth Fly Controller */}
          <div className="w-full rounded-xl overflow-hidden border border-[#E0E5E2] relative z-0" style={{ height: '200px' }}>
            <MapContainer 
              center={mapTarget.coords} 
              zoom={mapTarget.zoom} 
              zoomControl={false} 
              style={{ height: '100%', width: '100%', zIndex: 1 }}
            >
              <MapFlyController 
                coords={mapTarget.coords} 
                zoom={mapTarget.zoom} 
                triggerKey={mapTarget.triggerKey} 
              />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {MITRA_PARTNERS.map((mitra) => (
                <Marker 
                  key={mitra.id} 
                  position={mitra.coords} 
                  icon={mitra.iconType}
                  eventHandlers={{
                    click: () => handleSelectMitra(mitra),
                  }}
                >
                  <Popup className="font-sans font-bold text-xs">
                    <div className="space-y-1">
                      <p className="font-extrabold text-[#141E18]">{mitra.name}</p>
                      <p className="text-[10px] text-[#4A5C52]">{mitra.category}</p>
                      <p className="text-[10px] text-[#2D6A4F] font-bold">{mitra.capacity}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Detail Card of Currently Selected Location */}
          <div className="mt-3 p-3 rounded-xl bg-[#F7F8F5] border border-[#E0E5E2] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2D6A4F] text-base">
                  {selectedPartner.iconName}
                </span>
                <span className="text-xs font-black text-[#141E18]">{selectedPartner.name}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${selectedPartner.badgeClass}`}>
                  {selectedPartner.badge}
                </span>
              </div>
              <p className="text-[11px] text-[#4A5C52] mt-0.5">{selectedPartner.address}</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {selectedPartner.acceptedTypes.map((t, idx) => (
                  <span key={idx} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#E0E5E2] text-[#2D6A4F]">
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E0E5E2]">
              <p className="text-[10px] font-bold text-[#8A9E94] uppercase tracking-wider">{selectedPartner.distance}</p>
              <p className="text-xs font-black text-[#2D6A4F] mt-0.5">{selectedPartner.capacity}</p>
              <p className="text-[10px] text-[#4A5C52] font-medium">{selectedPartner.jadwal}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 7. LEADERBOARD PERINGKAT UNIT TERAKTIF KAMPUS ─── */}
      <div className="bg-white rounded-2xl p-6 border border-[#E0E5E2] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-[#141E18]">Peringkat Unit Teraktif Kampus</h3>
            <p className="text-[11px] text-[#4A5C52]">Kontribusi pemilahan limbah kertas per fakultas/prodi</p>
          </div>
          <button 
            onClick={() => setActiveRoute('/leaderboard')}
            className="text-xs font-bold text-[#2D6A4F] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Papan Skor</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#8A9E94] border-b border-[#E0E5E2] pb-2 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 font-bold">Peringkat</th>
                <th className="py-2.5 font-bold">Unit / Fakultas</th>
                <th className="py-2.5 font-bold">Total Kertas Disetor</th>
                <th className="py-2.5 font-bold">Eco-Points</th>
                <th className="py-2.5 font-bold text-right">Status Tong</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E5E2]/60">
              {rankedUnits.slice(0, 5).map((u, idx) => (
                <tr key={u.id} className="hover:bg-[#F7F8F5] transition-colors">
                  <td className="py-3 font-black text-[#141E18]">
                    <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-black text-[11px] ${
                      idx === 0 ? 'bg-[#FEF3C7] text-[#D97706]' : idx === 1 ? 'bg-[#E8F5EE] text-[#2D6A4F]' : 'text-[#8A9E94]'
                    }`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-[#141E18]">{u.name}</td>
                  <td className="py-3 font-black text-[#2D6A4F] tabular-nums">{u.kg} Kg</td>
                  <td className="py-3 font-bold text-[#C4934F] tabular-nums">{u.points} Poin</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5EE] text-[#2D6A4F]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" /> Aktif Terlayani
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
