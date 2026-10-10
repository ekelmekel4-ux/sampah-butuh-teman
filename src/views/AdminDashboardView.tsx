import React from 'react';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const markerIconUnit = L.divIcon({
  className: 'custom-map-marker-unit',
  html: `<div style="background-color: #2D6A4F; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); border: 2px solid white;"><span class="material-symbols-outlined" style="color: white; font-size: 16px;">school</span></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

const markerIconIndustri = L.divIcon({
  className: 'custom-map-marker-industri',
  html: `<div style="background-color: #E76F51; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); border: 2px solid white;"><span class="material-symbols-outlined" style="color: white; font-size: 16px;">factory</span></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

/* ─── Donut Gauge (fixed — text NOT rotated) ─── */
const DonutGauge: React.FC<{ pct: number; color: string; bg?: string; size?: number; sw?: number }> = ({
  pct, color, bg = '#e5e7eb', size = 76, sw = 9
}) => {
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={`${(pct / 100) * circ} ${circ}`} strokeLinecap="round" />
      </svg>
      {/* Text sits on top, NOT inside SVG so it doesn't rotate */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-black" style={{ color }}>{pct}%</span>
      </div>
    </div>
  );
};

/* ─── Sparkline ─── */
const Sparkline: React.FC<{ data: number[]; color: string; fill?: string }> = ({ data, color, fill }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 100, h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 2) - 1;
    return `${x},${y}`;
  }).join(' ');
  const fillPath = `M0,${h} L${pts.split(' ').join(' L')} L${w},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 28 }} preserveAspectRatio="none">
      {fill && <path d={fillPath} fill={fill} opacity="0.2" />}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ══════════════════════════════════════════
   PAPER & CARDBOARD MASCOT HERO ILLUSTRATION
══════════════════════════════════════════ */
const Illu3DCandyCrushHero = () => (
  <svg viewBox="0 0 460 340" className="w-full h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Paper character gradients */}
      <linearGradient id="paperBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#F5F5F0" />
        <stop offset="100%" stopColor="#E8E4DC" />
      </linearGradient>
      <linearGradient id="paperSheetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FAFAF8" />
        <stop offset="100%" stopColor="#EAE8E2" />
      </linearGradient>

      {/* Cardboard character gradients */}
      <linearGradient id="cardboardBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4A96A" />
        <stop offset="40%" stopColor="#C4934F" />
        <stop offset="100%" stopColor="#A87540" />
      </linearGradient>
      <linearGradient id="cardboardSheetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DDB678" />
        <stop offset="100%" stopColor="#B8884A" />
      </linearGradient>

      {/* Green elements */}
      <linearGradient id="greenSneakerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#4CAF72" />
        <stop offset="100%" stopColor="#2D6A4F" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2D6A4F" />
        <stop offset="100%" stopColor="#52B788" />
      </linearGradient>
      <linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3D8B5E" />
        <stop offset="100%" stopColor="#1E4D35" />
      </linearGradient>
      <linearGradient id="armGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#52B788" />
        <stop offset="100%" stopColor="#2D6A4F" />
      </linearGradient>

      <filter id="mascotShadow" x="-20%" y="-5%" width="140%" height="140%">
        <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#0A2016" floodOpacity="0.35" />
      </filter>
      <filter id="leafShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#0A2016" floodOpacity="0.25" />
      </filter>
    </defs>

    {/* ── Background decorative glows ── */}
    <circle cx="100" cy="90" r="50" fill="#52B788" opacity="0.12" />
    <circle cx="360" cy="60" r="45" fill="#D4A96A" opacity="0.15" />
    <circle cx="380" cy="230" r="30" fill="#52B788" opacity="0.10" />

    {/* Confetti / floating particles */}
    <circle cx="60" cy="40" r="5" fill="#52B788" opacity="0.7" />
    <circle cx="420" cy="80" r="6" fill="#D4A96A" opacity="0.8" />
    <rect x="380" y="30" width="8" height="8" rx="2" fill="#52B788" opacity="0.7" transform="rotate(30 380 30)" />
    <rect x="50" y="200" width="7" height="7" rx="2" fill="#C4934F" opacity="0.6" transform="rotate(20 50 200)" />
    <path d="M150 30 Q158 15 165 35" stroke="#52B788" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
    <path d="M280 15 Q288 0 296 20" stroke="#D4A96A" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />

    {/* ════════ CHARACTER 1: PAPER MASCOT (LEFT) ════════ */}
    <g transform="translate(30, 15)" filter="url(#mascotShadow)">

      {/* ── Stem / twig ── */}
      <rect x="96" y="22" width="5" height="30" rx="2.5" fill="#4A7C59" />

      {/* ── Leaf sprout (2 leaves + center bud) ── */}
      <g filter="url(#leafShadow)">
        {/* Left leaf */}
        <path d="M101 42 C88 30 72 28 75 44 C78 56 101 52 101 42Z" fill="url(#leafGrad)" />
        <path d="M75 44 Q88 37 101 42" stroke="#2D6A4F" strokeWidth="1" fill="none" opacity="0.5" />
        {/* Right leaf */}
        <path d="M101 38 C114 26 130 25 127 41 C124 53 101 48 101 38Z" fill="url(#leafGrad)" />
        <path d="M127 41 Q114 33 101 38" stroke="#2D6A4F" strokeWidth="1" fill="none" opacity="0.5" />
        {/* Bud tip */}
        <ellipse cx="101" cy="24" rx="5" ry="6" fill="#52B788" />
        <ellipse cx="101" cy="22" rx="3" ry="3" fill="#74C69D" />
      </g>

      {/* ── Paper stack body (layered sheets) ── */}
      {/* Back sheets (depth effect) */}
      <rect x="52" y="58" width="105" height="130" rx="6" fill="#E0DDD5" transform="rotate(4 52 58)" />
      <rect x="52" y="56" width="105" height="130" rx="6" fill="#ECEAE4" transform="rotate(-3 52 56)" />
      {/* Main front sheet */}
      <rect x="48" y="52" width="108" height="132" rx="8" fill="url(#paperBodyGrad)" stroke="#D8D5CE" strokeWidth="1.5" />
      {/* Sheet edge lines (stacked paper look) */}
      <line x1="52" y1="62" x2="152" y2="62" stroke="#D0CEC8" strokeWidth="1" opacity="0.6" />
      <line x1="51" y1="68" x2="153" y2="68" stroke="#D0CEC8" strokeWidth="1" opacity="0.5" />
      <line x1="50" y1="74" x2="154" y2="74" stroke="#D0CEC8" strokeWidth="0.8" opacity="0.4" />
      {/* Inner page line lines */}
      <line x1="62" y1="120" x2="140" y2="120" stroke="#D0CEC8" strokeWidth="1.2" opacity="0.35" />
      <line x1="62" y1="130" x2="125" y2="130" stroke="#D0CEC8" strokeWidth="1.2" opacity="0.3" />
      <line x1="62" y1="140" x2="132" y2="140" stroke="#D0CEC8" strokeWidth="1.2" opacity="0.3" />
      {/* Highlight gloss */}
      <rect x="55" y="56" width="35" height="55" rx="4" fill="white" opacity="0.22" />

      {/* ── Face ── */}
      {/* Left eye (winking — closed arc) */}
      <path d="M76 100 Q84 92 92 100" stroke="#2D1A0E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* Right eye (open, round) */}
      <ellipse cx="122" cy="97" rx="9" ry="11" fill="#2D1A0E" />
      <circle cx="125" cy="94" r="4" fill="white" />
      <circle cx="123" cy="102" r="1.5" fill="white" opacity="0.7" />
      {/* Rosy cheeks */}
      <ellipse cx="68" cy="112" rx="10" ry="7" fill="#F48CAB" opacity="0.55" />
      <ellipse cx="135" cy="110" rx="10" ry="7" fill="#F48CAB" opacity="0.55" />
      {/* Big happy smile */}
      <path d="M72 118 Q102 148 132 118" stroke="#2D1A0E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* Mouth fill */}
      <path d="M76 121 Q102 144 128 121 Q102 138 76 121Z" fill="#E07090" opacity="0.7" />

      {/* ── Left arm (green, raised) ── */}
      <path d="M48 95 Q18 72 25 45" stroke="url(#armGreenGrad)" strokeWidth="16" strokeLinecap="round" />
      {/* Hand */}
      <circle cx="27" cy="40" rx="14" ry="14" fill="url(#armGreenGrad)" />
      <circle cx="18" cy="33" r="7" fill="#52B788" />
      <circle cx="27" cy="28" r="7" fill="#52B788" />
      <circle cx="36" cy="33" r="7" fill="#52B788" />

      {/* ── Right arm (green, holding bag) ── */}
      <path d="M156 115 Q188 100 184 75" stroke="url(#armGreenGrad)" strokeWidth="16" strokeLinecap="round" />
      {/* Eco bag */}
      <rect x="172" y="52" width="36" height="32" rx="6" fill="url(#bagGrad)" />
      <path d="M180 52 Q180 44 188 44 Q196 44 196 52" stroke="#74C69D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Leaf icon on bag */}
      <path d="M188 62 C184 58 178 60 180 66 C182 70 188 68 188 62Z" fill="#52B788" opacity="0.8" />
      <line x1="181" y1="66" x2="188" y2="62" stroke="#74C69D" strokeWidth="1" />

      {/* ── Legs ── */}
      <rect x="72" y="180" width="20" height="38" rx="8" fill="url(#armGreenGrad)" />
      <rect x="108" y="180" width="20" height="38" rx="8" fill="url(#armGreenGrad)" />

      {/* ── Sneakers ── */}
      {/* Left shoe */}
      <rect x="62" y="212" width="42" height="18" rx="9" fill="url(#greenSneakerGrad)" />
      <rect x="64" y="215" width="20" height="6" rx="3" fill="white" opacity="0.5" />
      <line x1="68" y1="219" x2="100" y2="219" stroke="white" strokeWidth="1.5" opacity="0.7" strokeDasharray="4 3" />
      {/* Right shoe */}
      <rect x="98" y="212" width="42" height="18" rx="9" fill="url(#greenSneakerGrad)" />
      <rect x="100" y="215" width="20" height="6" rx="3" fill="white" opacity="0.5" />
      <line x1="104" y1="219" x2="136" y2="219" stroke="white" strokeWidth="1.5" opacity="0.7" strokeDasharray="4 3" />
    </g>

    {/* ════════ CHARACTER 2: CARDBOARD MASCOT (RIGHT) ════════ */}
    <g transform="translate(235, 25)" filter="url(#mascotShadow)">

      {/* ── Stem / twig ── */}
      <rect x="95" y="20" width="5" height="30" rx="2.5" fill="#4A7C59" />

      {/* ── Leaf sprout ── */}
      <g filter="url(#leafShadow)">
        {/* Left leaf */}
        <path d="M100 40 C87 28 71 26 74 42 C77 54 100 50 100 40Z" fill="url(#leafGrad)" />
        <path d="M74 42 Q87 35 100 40" stroke="#2D6A4F" strokeWidth="1" fill="none" opacity="0.5" />
        {/* Right leaf */}
        <path d="M100 36 C113 24 129 23 126 39 C123 51 100 46 100 36Z" fill="url(#leafGrad)" />
        <path d="M126 39 Q113 31 100 36" stroke="#2D6A4F" strokeWidth="1" fill="none" opacity="0.5" />
        {/* Bud tip */}
        <ellipse cx="100" cy="22" rx="5" ry="6" fill="#52B788" />
        <ellipse cx="100" cy="20" rx="3" ry="3" fill="#74C69D" />
      </g>

      {/* ── Cardboard stack body ── */}
      {/* Back sheets */}
      <rect x="50" y="58" width="105" height="130" rx="6" fill="#9C6A30" transform="rotate(4 50 58)" />
      <rect x="50" y="56" width="105" height="130" rx="6" fill="#B87E3A" transform="rotate(-3 50 56)" />
      {/* Main front sheet */}
      <rect x="47" y="52" width="108" height="132" rx="8" fill="url(#cardboardBodyGrad)" stroke="#9C6A30" strokeWidth="1.5" />
      {/* Corrugated texture lines */}
      <line x1="51" y1="62" x2="151" y2="62" stroke="#9C6A30" strokeWidth="1.2" opacity="0.55" />
      <line x1="50" y1="68" x2="152" y2="68" stroke="#9C6A30" strokeWidth="1.2" opacity="0.45" />
      <line x1="49" y1="74" x2="153" y2="74" stroke="#9C6A30" strokeWidth="1" opacity="0.35" />
      {/* Horizontal grain lines */}
      <line x1="61" y1="118" x2="139" y2="118" stroke="#9C6A30" strokeWidth="1.2" opacity="0.3" />
      <line x1="61" y1="128" x2="124" y2="128" stroke="#9C6A30" strokeWidth="1.2" opacity="0.25" />
      <line x1="61" y1="138" x2="131" y2="138" stroke="#9C6A30" strokeWidth="1.2" opacity="0.25" />
      {/* Highlight gloss */}
      <rect x="54" y="56" width="32" height="50" rx="4" fill="white" opacity="0.14" />

      {/* ── Face ── */}
      {/* Left eye */}
      <ellipse cx="80" cy="97" rx="9" ry="11" fill="#2D1A0E" />
      <circle cx="83" cy="94" r="4" fill="white" />
      <circle cx="81" cy="102" r="1.5" fill="white" opacity="0.7" />
      {/* Right eye */}
      <ellipse cx="120" cy="97" rx="9" ry="11" fill="#2D1A0E" />
      <circle cx="123" cy="94" r="4" fill="white" />
      <circle cx="121" cy="102" r="1.5" fill="white" opacity="0.7" />
      {/* Cheeks */}
      <ellipse cx="66" cy="111" rx="10" ry="7" fill="#F48CAB" opacity="0.55" />
      <ellipse cx="134" cy="111" rx="10" ry="7" fill="#F48CAB" opacity="0.55" />
      {/* Happy smile */}
      <path d="M71 118 Q100 148 129 118" stroke="#2D1A0E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M75 121 Q100 144 125 121 Q100 138 75 121Z" fill="#E07090" opacity="0.7" />

      {/* ── Left arm (green, holding bag) ── */}
      <path d="M47 105 Q16 88 18 62" stroke="url(#armGreenGrad)" strokeWidth="16" strokeLinecap="round" />
      {/* Eco bag */}
      <rect x="2" y="40" width="36" height="30" rx="6" fill="url(#bagGrad)" />
      <path d="M10 40 Q10 32 18 32 Q26 32 26 40" stroke="#74C69D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M18 52 C14 48 8 50 10 56 C12 60 18 58 18 52Z" fill="#52B788" opacity="0.8" />
      <line x1="11" y1="56" x2="18" y2="52" stroke="#74C69D" strokeWidth="1" />

      {/* ── Right arm (green, raised up) ── */}
      <path d="M155 95 Q188 72 182 42" stroke="url(#armGreenGrad)" strokeWidth="16" strokeLinecap="round" />
      {/* Hand */}
      <circle cx="183" cy="36" r="14" fill="url(#armGreenGrad)" />
      <circle cx="175" cy="29" r="7" fill="#52B788" />
      <circle cx="183" cy="24" r="7" fill="#52B788" />
      <circle cx="192" cy="29" r="7" fill="#52B788" />

      {/* ── Legs ── */}
      <rect x="71" y="180" width="20" height="38" rx="8" fill="url(#armGreenGrad)" />
      <rect x="107" y="180" width="20" height="38" rx="8" fill="url(#armGreenGrad)" />

      {/* ── Sneakers ── */}
      {/* Left shoe */}
      <rect x="61" y="212" width="42" height="18" rx="9" fill="url(#greenSneakerGrad)" />
      <rect x="63" y="215" width="20" height="6" rx="3" fill="white" opacity="0.5" />
      <line x1="67" y1="219" x2="99" y2="219" stroke="white" strokeWidth="1.5" opacity="0.7" strokeDasharray="4 3" />
      {/* Right shoe */}
      <rect x="97" y="212" width="42" height="18" rx="9" fill="url(#greenSneakerGrad)" />
      <rect x="99" y="215" width="20" height="6" rx="3" fill="white" opacity="0.5" />
      <line x1="103" y1="219" x2="135" y2="219" stroke="white" strokeWidth="1.5" opacity="0.7" strokeDasharray="4 3" />
    </g>
  </svg>
);

/* ── Card illustrations (fixed: text area left, illustration right) ── */
const IlluScale = () => (
  <svg viewBox="0 0 100 90" className="w-full h-full" fill="none">
    <rect x="35" y="72" width="30" height="6" rx="3" fill="#C27D3A" opacity="0.7" />
    <rect x="46" y="35" width="8" height="38" rx="4" fill="#A0632B" opacity="0.5" />
    <rect x="18" y="33" width="64" height="6" rx="3" fill="#A0632B" opacity="0.6" />
    <circle cx="50" cy="36" r="6" fill="#A0632B" opacity="0.8" />
    <path d="M20 38 C20 38 12 42 12 56" stroke="#C27D3A" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <rect x="4" y="54" width="18" height="12" rx="3" fill="#F4A261" opacity="0.7" />
    <rect x="6" y="57" width="8" height="2" rx="1" fill="white" opacity="0.9" />
    <rect x="6" y="61" width="12" height="2" rx="1" fill="white" opacity="0.7" />
    <path d="M80 38 C80 38 86 42 86 52" stroke="#C27D3A" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <rect x="78" y="50" width="18" height="12" rx="3" fill="#FFDBC8" opacity="0.9" />
    <rect x="80" y="53" width="6" height="2" rx="1" fill="#C27D3A" opacity="0.5" />
    <text x="76" y="22" fontSize="16" fill="#F4A261" opacity="0.5">♻</text>
    <circle cx="14" cy="18" r="9" fill="#2D6A4F" opacity="0.15" />
    <text x="9" y="23" fontSize="12" fill="#2D6A4F" opacity="0.5">↑</text>
  </svg>
);

const IlluMoney = () => (
  <svg viewBox="0 0 100 90" className="w-full h-full" fill="none">
    <rect x="15" y="22" width="62" height="44" rx="5" fill="#BECFFF" opacity="0.5" />
    <rect x="19" y="26" width="54" height="34" rx="3" fill="#EEF4FF" />
    <rect x="26" y="46" width="6" height="10" rx="2" fill="#5B8DEF" opacity="0.6" />
    <rect x="35" y="40" width="6" height="16" rx="2" fill="#5B8DEF" opacity="0.8" />
    <rect x="44" y="34" width="6" height="22" rx="2" fill="#3A5BA0" />
    <rect x="53" y="37" width="6" height="19" rx="2" fill="#5B8DEF" opacity="0.8" />
    <rect x="62" y="30" width="6" height="26" rx="2" fill="#3A5BA0" />
    <polyline points="26,44 35,38 44,32 53,36 62,28" fill="none" stroke="#F4A261" strokeWidth="2" strokeLinecap="round" />
    <circle cx="62" cy="28" r="3" fill="#F4A261" />
    <rect x="5" y="66" width="90" height="5" rx="2" fill="#BECFFF" opacity="0.6" />
    <circle cx="12" cy="34" r="10" fill="#F4A261" opacity="0.75" />
    <text x="6" y="38" fontSize="9" fill="white" fontWeight="bold">Rp</text>
    <circle cx="88" cy="48" r="8" fill="#F4A261" opacity="0.55" />
    <text x="83" y="52" fontSize="7" fill="white" fontWeight="bold">Rp</text>
    <rect x="62" y="8" width="30" height="14" rx="7" fill="#2D6A4F" opacity="0.85" />
    <text x="65" y="18" fontSize="8" fill="white" fontWeight="bold">+18%</text>
  </svg>
);

const IlluTruck = () => (
  <svg viewBox="0 0 110 90" className="w-full h-full" fill="none">
    <rect x="0" y="66" width="110" height="16" rx="4" fill="#B7E4C7" opacity="0.35" />
    <rect x="4" y="72" width="16" height="4" rx="2" fill="white" opacity="0.5" />
    <rect x="46" y="72" width="16" height="4" rx="2" fill="white" opacity="0.5" />
    <rect x="88" y="72" width="16" height="4" rx="2" fill="white" opacity="0.5" />
    <rect x="20" y="40" width="52" height="28" rx="5" fill="#2D6A4F" opacity="0.8" />
    <rect x="68" y="45" width="28" height="23" rx="5" fill="#1A4235" opacity="0.9" />
    <rect x="71" y="48" width="18" height="12" rx="3" fill="#D8F3DC" opacity="0.9" />
    <circle cx="38" cy="70" r="9" fill="#1A2E22" opacity="0.9" />
    <circle cx="38" cy="70" r="5" fill="#52B788" opacity="0.7" />
    <circle cx="82" cy="70" r="9" fill="#1A2E22" opacity="0.9" />
    <circle cx="82" cy="70" r="5" fill="#52B788" opacity="0.7" />
    <text x="29" y="59" fontSize="16" fill="white" opacity="0.65">♻</text>
    <line x1="2" y1="50" x2="18" y2="50" stroke="#52B788" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    <line x1="6" y1="57" x2="18" y2="57" stroke="#52B788" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    <line x1="0" y1="43" x2="18" y2="43" stroke="#52B788" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    <circle cx="90" cy="20" r="16" fill="#EEF9ED" opacity="0.9" stroke="#B7E4C7" strokeWidth="1.5" />
    <text x="78" y="24" fontSize="10" fill="#2D6A4F" fontWeight="bold">1.8h</text>
    <circle cx="22" cy="20" r="10" fill="#D8F3DC" opacity="0.8" />
    <text x="16" y="25" fontSize="12" fill="#2D6A4F">✓</text>
  </svg>
);

const IlluForest = () => (
  <svg viewBox="0 0 110 90" className="w-full h-full" fill="none">
    <circle cx="80" cy="45" r="38" fill="#52B788" opacity="0.06" />
    <polygon points="72,76 85,42 98,76" fill="#1A4235" opacity="0.45" />
    <rect x="81" y="75" width="7" height="10" rx="2" fill="#1A2E22" opacity="0.35" />
    <polygon points="86,73 97,46 108,73" fill="#2D6A4F" opacity="0.35" />
    <polygon points="42,76 57,32 72,76" fill="#52B788" opacity="0.8" />
    <rect x="53" y="75" width="8" height="12" rx="2" fill="#2D6A4F" opacity="0.6" />
    <polygon points="18,76 37,34 56,76" fill="#2D6A4F" opacity="0.9" />
    <rect x="33" y="75" width="8" height="12" rx="2" fill="#1A4235" opacity="0.7" />
    <polygon points="2,78 14,52 26,78" fill="#52B788" opacity="0.6" />
    <rect x="0" y="84" width="110" height="10" rx="4" fill="#1A4235" opacity="0.35" />
    <circle cx="95" cy="18" r="11" fill="#F4A261" opacity="0.22" />
    <circle cx="95" cy="18" r="7" fill="#F4A261" opacity="0.32" />
    <text x="2" y="24" fontSize="10" fill="#52B788" opacity="0.55">✦</text>
    <text x="100" y="42" fontSize="8" fill="#52B788" opacity="0.4">✦</text>
    <rect x="4" y="52" width="32" height="15" rx="7" fill="#52B788" opacity="0.25" />
    <text x="7" y="63" fontSize="8" fill="#52B788" fontWeight="bold">-CO₂ ✓</text>
  </svg>
);

export const AdminDashboardView: React.FC = () => {
  const { units, totalKgTersalurkan, totalPohon, totalAirBersih, laporanList, setActiveRoute } = useApp();

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

  return (
    <div className="w-full max-w-7xl mx-auto font-sans text-[#1A2E22] space-y-6 pb-10">

      {/* ═══ CANDY CRUSH STYLE HERO BANNER ═══ */}
      <div className="w-full rounded-[32px] bg-gradient-to-r from-[#14362B] via-[#1B4D3E] to-[#2D6A4F] text-white relative overflow-visible shadow-2xl border border-[#52B788]/20 my-2">
        {/* Contour lines decor */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 rounded-[32px]" preserveAspectRatio="none" viewBox="0 0 800 220">
          <path d="M -50 100 Q 150 20 350 120 T 750 40 T 950 180" fill="none" stroke="#52B788" strokeWidth="1.5" />
          <path d="M -50 150 Q 200 60 450 180 T 850 90" fill="none" stroke="#D8F3DC" strokeWidth="1" />
        </svg>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 md:p-10 min-h-[260px] lg:min-h-[320px]">
          {/* Left Column Text & Pill Button */}
          <div className="max-w-md space-y-4 text-left z-20">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-widest text-[#D8F3DC] uppercase border border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-[#70E000] animate-pulse" />
              SAMPAH BUTUH TEMAN • DASHBOARD
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              Saatnya Daur Ulang & Raih Sirkularitas!
            </h1>

            <p className="text-xs sm:text-sm text-[#D8F3DC]/80 font-medium leading-relaxed max-w-sm">
              Kelola limbah kertas kampus, pantau emisi CO₂, dan salurkan langsung ke mitra daur ulang terpercaya.
            </p>
          </div>

          {/* Right Column — Mina & Moni Mascots */}
          <div className="absolute -right-16 md:-right-24 lg:-right-32 bottom-0 pointer-events-none flex items-end justify-end">
            <img
              src="/mina.png"
              alt="Mina - Maskot Kertas"
              className="h-[350px] md:h-[300px] lg:h-[380px] object-contain object-bottom translate-x-20 md:translate-x-28 lg:translate-x-40"
              style={{ filter: 'drop-shadow(0 20px 30px rgba(6,36,25,0.45))' }}
            />
            <img
              src="/moni.png"
              alt="Moni - Maskot Kardus"
              className="h-[250px] md:h-[300px] lg:h-[380px] object-contain object-bottom -ml-20 md:-ml-28 lg:-ml-36 relative z-10"
              style={{ filter: 'drop-shadow(0 20px 30px rgba(6,36,25,0.45))' }}
            />
          </div>
        </div>
      </div>

      {/* ═══ QUICK ACTIONS ═══ */}
      <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveRoute('/admin/unit-tong')}
          className="flex items-center gap-4 bg-gradient-to-br from-[#E8F5EE] to-[#D8F3DC] rounded-2xl p-4 shadow-sm border border-[#52B788]/30 hover:shadow-lg hover:border-[#52B788]/60 hover:-translate-y-1 active:translate-y-0 transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-xl bg-white text-[#1A4235] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
          </div>
          <div>
            <h3 className="text-sm font-black text-[#1A2E22]">Kelola Unit</h3>
            <p className="text-[10px] text-[#2D6A4F] font-semibold mt-0.5 leading-tight">Atur drop point & kuota</p>
          </div>
        </button>

        <button
          onClick={() => setActiveRoute('/admin/laporan')}
          className="flex items-center gap-4 bg-gradient-to-br from-[#FFF0ED] to-[#FFE0D9] rounded-2xl p-4 shadow-sm border border-[#E76F51]/30 hover:shadow-lg hover:border-[#E76F51]/60 hover:-translate-y-1 active:translate-y-0 transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-xl bg-white text-[#A03A2B] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
          </div>
          <div>
            <h3 className="text-sm font-black text-[#1A2E22]">Laporan Flag</h3>
            <p className="text-[10px] text-[#A03A2B] font-semibold mt-0.5 leading-tight">Tinjau isu & sengketa</p>
          </div>
        </button>
      </div>

      {/* ═══ OVERVIEW HEADER ═══ */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#1A2E22]">Overview</h2>
        <button className="bg-[#E76F51] hover:bg-[#D46045] active:scale-95 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#E76F51]/30 transition-all flex items-center gap-2">
          Unduh Laporan <span className="material-symbols-outlined text-lg">download</span>
        </button>
      </div>

      {/* ═══ MAIN GRID ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* LEFT 2×2 */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-5">

          {/* Card 1 — Total Tersalurkan */}
          <div className="bg-gradient-to-br from-[#FFF4ED] to-[#FFE9D5] border border-[#FFDBC8] rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="flex h-full">
              {/* Text left */}
              <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                <div>
                  <span className="text-[10px] font-extrabold text-[#A0632B] uppercase tracking-wider block mb-2">Total Tersalurkan</span>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-3xl font-black text-[#A0632B] tracking-tighter leading-none">{totalKgTersalurkan}</span>
                    <span className="inline-flex items-center gap-0.5 bg-[#E76F51] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[9px]">arrow_downward</span>2.4%
                    </span>
                  </div>
                  <div className="text-[10px] text-[#C27D3A] font-semibold mt-1">Target {targetSemester.toLocaleString('id-ID')} Kg • Semester Genap</div>
                </div>
                <div className="mt-3">
                  <Sparkline data={monthlyData} color="#C27D3A" fill="#F4A261" />
                </div>
              </div>
              {/* Illustration right */}
              <div className="w-28 shrink-0 flex items-end justify-center pb-0 opacity-90 group-hover:scale-105 transition-transform duration-500">
                <IlluScale />
              </div>
            </div>
          </div>

          {/* Card 2 — Nilai Sirkularitas */}
          <div className="bg-gradient-to-br from-[#EEF4FF] to-[#DCEAFF] border border-[#BECFFF] rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="flex h-full">
              <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                <div>
                  <span className="text-[10px] font-extrabold text-[#3A5BA0] uppercase tracking-wider block mb-2">Nilai Sirkularitas</span>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xl font-black text-[#3A5BA0]">Rp</span>
                    <span className="text-3xl font-black text-[#3A5BA0] tracking-tighter leading-none">{(nilaiSirkularitas / 1000).toFixed(0)}K</span>
                    <span className="inline-flex items-center gap-0.5 bg-[#2D6A4F] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[9px]">arrow_upward</span>18.2%
                    </span>
                  </div>
                  <div className="text-[10px] text-[#5B8DEF] font-semibold mt-1">Rata-rata Rp 1.400 / Kg HVS</div>
                </div>
                <div className="flex gap-1 items-end mt-3" style={{ height: 28 }}>
                  {[30, 50, 70, 55, 80, 95].map((v, i) => (
                    <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${(v / 95) * 100}%`, background: i === 5 ? '#3A5BA0' : '#5B8DEF55' }} />
                  ))}
                </div>
              </div>
              <div className="w-28 shrink-0 flex items-end justify-center opacity-90 group-hover:scale-105 transition-transform duration-500">
                <IlluMoney />
              </div>
            </div>
          </div>

          {/* Card 3 — Peta Sebaran */}
          <div className="bg-[#E8F5EE] border border-[#B7E4C7] rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col relative z-0 min-h-[180px]">
            <div className="absolute top-4 left-4 z-[400] pointer-events-none">
              <span className="text-[10px] font-extrabold text-[#1A4235] uppercase tracking-wider block bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-white/50">
                Peta Sebaran Mitra
              </span>
            </div>
            <div className="flex-1 w-full h-full relative z-0" style={{ minHeight: '140px' }}>
              <MapContainer center={[-6.2737, 106.7323]} zoom={12} zoomControl={false} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[-6.2737, 106.7323]} icon={markerIconUnit}>
                  <Popup className="font-sans font-bold text-xs">Universitas Pembangunan Jaya</Popup>
                </Marker>
                <Marker position={[-6.2500, 106.7600]} icon={markerIconIndustri}>
                  <Popup className="font-sans font-bold text-xs">Mitra Daur Ulang Bintaro</Popup>
                </Marker>
                <Marker position={[-6.3000, 106.7000]} icon={markerIconIndustri}>
                  <Popup className="font-sans font-bold text-xs">Pabrik Kertas Serpong</Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="p-2.5 bg-white/60 backdrop-blur-md border-t border-[#B7E4C7] text-[10px] text-[#1A4235] leading-snug">
              <span className="font-extrabold text-[#2D6A4F] mr-1">Jangkauan Wilayah:</span>
              Radius ~15km dari UPJ (Bintaro, Tangsel, & sekitarnya).
            </div>
          </div>

          {/* Card 4 — Pohon Terselamatkan */}
          <div className="bg-gradient-to-br from-[#1A2E22] to-[#0F1D16] border border-[#2D6A4F]/30 rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300 relative">
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-[#52B788]/15 blur-2xl pointer-events-none" />
            <div className="flex h-full relative z-10">
              <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                <div>
                  <span className="text-[10px] font-extrabold text-[#52B788] uppercase tracking-wider block mb-2">Pohon Terselamatkan</span>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-3xl font-black text-white tracking-tighter leading-none">{totalPohon}</span>
                    <span className="inline-flex items-center gap-0.5 bg-[#52B788] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[9px]">arrow_upward</span>2.4%
                    </span>
                  </div>
                  <div className="text-[10px] text-[#52B788] font-semibold mt-1">{totalAirBersih.toLocaleString('id-ID')} L Air Terhemat</div>
                </div>
                <div className="flex gap-1 items-end mt-3" style={{ height: 28 }}>
                  {[20, 45, 30, 60, 50, 80].map((v, i) => (
                    <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${(v / 80) * 100}%`, background: i === 5 ? '#52B788' : '#52B78840' }} />
                  ))}
                </div>
              </div>
              <div className="w-28 shrink-0 flex items-end justify-center opacity-85 group-hover:scale-105 transition-transform duration-500">
                <IlluForest />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Peringkat Unit */}
        <div className="lg:col-span-1 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-[#1A2E22] text-base">Peringkat Unit</h3>
              <p className="text-[11px] text-gray-400 font-medium">{units.length} Unit Aktif</p>
            </div>
            <span className="text-[10px] font-extrabold bg-[#D8F3DC] text-[#2D6A4F] px-3 py-1 rounded-full whitespace-nowrap">Bulan Ini</span>
          </div>

          <div className="grid grid-cols-12 text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 px-1">
            <span className="col-span-1">#</span>
            <span className="col-span-6 pl-2">Unit</span>
            <span className="col-span-2 text-center">Kg</span>
            <span className="col-span-3 text-right">Poin</span>
          </div>

          <div className="flex-1 space-y-1">
            {rankedUnits.slice(0, 5).map((u, i) => {
              const rc = [
                { num: 'bg-[#FFF4ED] text-[#A0632B]', bar: '#F4A261' },
                { num: 'bg-gray-100 text-gray-500', bar: '#9CA3AF' },
                { num: 'bg-orange-50 text-orange-700', bar: '#EA580C' },
                { num: 'bg-blue-50 text-blue-600', bar: '#5B8DEF' },
                { num: 'bg-[#EEF9ED] text-[#2D6A4F]', bar: '#2D6A4F' },
              ][i] ?? { num: 'bg-gray-50 text-gray-400', bar: '#9CA3AF' };
              return (
                <div key={u.id} className="grid grid-cols-12 items-center px-1 py-2 rounded-xl hover:bg-gray-50 transition-colors group cursor-default">
                  <span className={`col-span-1 w-5 h-5 rounded flex items-center justify-center text-[9px] font-black ${rc.num}`}>{i + 1}</span>
                  <div className="col-span-6 pl-2 pr-1 min-w-0">
                    <div className="text-[11px] font-bold text-[#1A2E22] truncate group-hover:text-[#2D6A4F] transition-colors">{u.nama_unit}</div>
                    <div className="w-full bg-gray-100 rounded-full overflow-hidden mt-1" style={{ height: 3 }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(u.kg / (rankedUnits[0]?.kg || 1)) * 100}%`, background: rc.bar }} />
                    </div>
                  </div>
                  <span className="col-span-2 text-center text-[11px] font-black text-[#52645A]">{u.kg}</span>
                  <span className="col-span-3 text-right text-[11px] font-extrabold text-[#2D6A4F]">{u.points}</span>
                </div>
              );
            })}
          </div>

          {pendingLaporan > 0 && (
            <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm text-amber-600" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-extrabold text-amber-800">{pendingLaporan} Laporan Menunggu</div>
                <div className="text-[10px] text-amber-600">Perlu tindakan segera</div>
              </div>
              <button onClick={() => setActiveRoute('/admin/laporan')} className="text-[10px] font-black text-amber-700 hover:underline shrink-0">Cek →</button>
            </div>
          )}

          <button onClick={() => setActiveRoute('/leaderboard')} className="mt-4 w-full h-10 rounded-xl border-2 border-gray-100 hover:border-[#2D6A4F] text-sm font-bold text-gray-500 hover:text-[#2D6A4F] transition-all">
            Lihat Papan Skor Penuh →
          </button>
        </div>
      </div>

      {/* ═══ BOTTOM CHARTS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="font-extrabold text-[#1A2E22] text-base">Traffic Analisis (Kg)</h3>
              <p className="text-[11px] text-gray-400 font-medium">Serapan kertas bulanan semester genap</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold text-gray-500 shrink-0">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#2D6A4F]" />HVS</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#E76F51]" />Kardus</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#F4A261]" />Campur</span>
            </div>
          </div>

          <div className="relative ml-8">
            <div className="absolute -left-8 top-0 bottom-8 flex flex-col justify-between text-[10px] font-bold text-gray-300 pointer-events-none">
              {['320', '240', '160', '80'].map(v => <span key={v}>{v}</span>)}
            </div>
            <div className="border-l border-b border-gray-100 relative" style={{ height: 210 }}>
              {[25, 50, 75].map(p => (
                <div key={p} className="absolute w-full border-t border-dashed border-gray-100" style={{ bottom: `${p}%` }} />
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
                  <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
                    <div className="flex gap-1 items-end w-full justify-center" style={{ height: '88%' }}>
                      <div className="flex-1 max-w-[12px] bg-[#E76F51] rounded-t-md hover:opacity-80 transition-all duration-200 cursor-pointer" style={{ height: `${(d.kds / 320) * 100}%` }} />
                      <div className="flex-1 max-w-[12px] bg-[#2D6A4F] rounded-t-md hover:opacity-80 transition-all duration-200 cursor-pointer" style={{ height: `${(d.hvs / 320) * 100}%` }} />
                      <div className="flex-1 max-w-[12px] bg-[#F4A261] rounded-t-md hover:opacity-80 transition-all duration-200 cursor-pointer" style={{ height: `${(d.mix / 320) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 mt-2 mb-1">{d.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3.5 rounded-2xl bg-[#EEF9ED] border border-[#B7E4C7] flex items-start gap-3">
            <span className="material-symbols-outlined text-[#2D6A4F] text-lg shrink-0 mt-0.5">insights</span>
            <p className="text-[11px] text-[#1A4235] font-medium leading-relaxed">
              <strong className="font-extrabold">Insight:</strong> Kenaikan signifikan di bulan <strong>Maret (+56%)</strong> seiring pembersihan berkas ujian akhir semester.
            </p>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="lg:col-span-1 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-extrabold text-[#1A2E22] text-base">Komposisi Kertas</h3>
              <p className="text-[11px] text-gray-400 font-medium">Distribusi material semester ini</p>
            </div>
            <span className="text-[10px] font-bold text-gray-400">Today</span>
          </div>
          <div className="text-sm font-extrabold text-[#1A2E22] mb-4">
            1.085 <span className="font-medium text-gray-400">Total Kg Terserap</span>
          </div>

          <div className="flex justify-center my-2">
            <div className="relative" style={{ width: 160, height: 160 }}>
              <svg width={160} height={160} viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="80" cy="80" r="60" fill="none" stroke="#f3f4f6" strokeWidth="24" />
                <circle cx="80" cy="80" r="60" fill="none" stroke="#2D6A4F" strokeWidth="24"
                  strokeDasharray={`${0.447 * 2 * Math.PI * 60} ${2 * Math.PI * 60}`} />
                <circle cx="80" cy="80" r="60" fill="none" stroke="#E76F51" strokeWidth="24"
                  strokeDasharray={`${0.359 * 2 * Math.PI * 60} ${2 * Math.PI * 60}`}
                  strokeDashoffset={`-${0.447 * 2 * Math.PI * 60}`} />
                <circle cx="80" cy="80" r="60" fill="none" stroke="#F4A261" strokeWidth="24"
                  strokeDasharray={`${0.194 * 2 * Math.PI * 60} ${2 * Math.PI * 60}`}
                  strokeDashoffset={`-${(0.447 + 0.359) * 2 * Math.PI * 60}`} />
              </svg>
              {/* Center label — outside SVG so it doesn't rotate */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-black text-[#1A2E22]">1.085</div>
                <div className="text-[10px] text-gray-400 font-bold">Total Kg</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-3">
            {[
              { abbr: 'HVS', label: 'Kertas HVS & Office', kg: 485, bg: '#EEF9ED', text: '#1A4235' },
              { abbr: 'KDS', label: 'Kardus Box', kg: 390, bg: '#FFF0EB', text: '#B04030' },
              { abbr: 'MIX', label: 'Kertas Campur', kg: 210, bg: '#FFF7ED', text: '#C27D3A' },
            ].map(cat => (
              <div key={cat.abbr} className="flex items-center gap-3 hover:bg-gray-50 px-2 py-1.5 rounded-xl transition-colors cursor-default group">
                <span className="w-9 h-6 rounded-md flex items-center justify-center text-[9px] font-black shrink-0" style={{ background: cat.bg, color: cat.text }}>{cat.abbr}</span>
                <span className="flex-1 text-xs font-semibold text-gray-500 group-hover:text-[#1A2E22] transition-colors truncate">{cat.label}</span>
                <span className="text-xs font-extrabold text-[#1A2E22] shrink-0">{cat.kg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
