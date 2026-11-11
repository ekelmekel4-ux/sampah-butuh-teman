import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

// Standar tarif aktual per kategori kertas
export const HARGA_KERTAS_AKTUAL: Record<string, { label: string; perKg: number; icon: string }> = {
  hvs: { label: 'HVS / Arsip Putih', perKg: 1500, icon: 'description' },
  kardus: { label: 'Kardus Box Corrugated', perKg: 1300, icon: 'inventory_2' },
  koran: { label: 'Koran & Majalah', perKg: 1100, icon: 'newspaper' },
  campur: { label: 'Campuran Kering Bersih', perKg: 900, icon: 'auto_stories' },
};

type Period = 'bulan' | 'semester';

const PERIOD_OPTIONS: { key: Period; label: string }[] = [
  { key: 'bulan', label: 'Bulan ini' },
  { key: 'semester', label: 'Semester ini' },
];

/** Tema podium 3D ala referensi, dengan warna disesuaikan ke tema hijau/krem aplikasi. */
const PODIUM_THEME: Record<
  number,
  { front: string; top: string; ring: string; avatar: string; height: number; number: string }
> = {
  1: {
    front: 'bg-gradient-to-b from-[#3C8F68] to-[#174630] text-white shadow-[0_18px_34px_rgba(23,70,48,0.28)]',
    top: 'bg-[#6FBF95]',
    ring: 'ring-[#FDE68A]',
    avatar: 'bg-[#FDE68A] text-[#5C3A0A]',
    height: 152,
    number: 'text-white',
  },
  2: {
    front: 'bg-gradient-to-b from-[#E7F8EE] to-[#C7ECD8] text-[#174630] shadow-[0_14px_28px_rgba(23,70,48,0.16)]',
    top: 'bg-[#F4FCF8]',
    ring: 'ring-[#A7F3D0]',
    avatar: 'bg-[#A7F3D0] text-[#174630]',
    height: 118,
    number: 'text-[#174630]',
  },
  3: {
    front: 'bg-gradient-to-b from-[#FDF1C6] to-[#F8E29B] text-[#5C3A0A] shadow-[0_12px_26px_rgba(138,95,20,0.18)]',
    top: 'bg-[#FEF8E6]',
    ring: 'ring-[#FDE68A]',
    avatar: 'bg-[#FEF3C7] text-[#8A5A12]',
    height: 100,
    number: 'text-[#5C3A0A]',
  },
};

const AVATAR_PALETTE = [
  { bg: 'bg-[#D8F3DC]', fg: 'text-[#174630]', ring: 'ring-[#D8F3DC]' },
  { bg: 'bg-[#FEF3C7]', fg: 'text-[#8A5A12]', ring: 'ring-[#FEF3C7]' },
  { bg: 'bg-[#E5F0F6]', fg: 'text-[#17607E]', ring: 'ring-[#E5F0F6]' },
  { bg: 'bg-[#FCE7E3]', fg: 'text-[#A33B2A]', ring: 'ring-[#FCE7E3]' },
];

const CELEBRATION_KEY = 'sbt_leaderboard_celebration_v1';

export const LeaderboardView: React.FC = () => {
  const { units, matchings, currentUser, role, setActiveRoute, setRole, showToast, setLeaderboardUnitId } =
    useApp();
  const [period, setPeriod] = useState<Period>('bulan');
  const [showRincianHarga, setShowRincianHarga] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Hitung nilai Rupiah aktual per unit:
  // 1. Dari transaksi matchings yang selesai (aktual yang sudah dicairkan)
  // 2. Ditambah estimasi dari sisa kg dengan rata-rata aktual Rp 1.450/kg
  const getUnitRupiah = (unitId: string, totalKg: number): number => {
    const completedTrx = matchings.filter(m => m.unit_id === unitId && m.status === 'sudah_diambil');
    const trxTotalRp = completedTrx.reduce((sum, m) => sum + (m.nilai_rupiah || 0), 0);
    const trxTotalKg = completedTrx.reduce((sum, m) => sum + (m.jumlah_kg || 0), 0);

    const sisaKg = Math.max(0, totalKg - trxTotalKg);
    return trxTotalRp + sisaKg * 1450;
  };

  // Sort units descending by total_kg_tersalurkan
  const sortedUnits = [...units]
    .map(u => ({
      ...u,
      totalRupiah: getUnitRupiah(u.id, u.total_kg_tersalurkan),
    }))
    .sort((a, b) => b.total_kg_tersalurkan - a.total_kg_tersalurkan);

  const podium = [
    { rank: 2, unit: sortedUnits[1] },
    { rank: 1, unit: sortedUnits[0] },
    { rank: 3, unit: sortedUnits[2] },
  ].filter(item => Boolean(item.unit));

  const restUnits = sortedUnits.slice(3);
  const bulanTahun = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  const initialOf = (unit: { inisial?: string; nama_unit?: string }) => {
    const source = (unit.inisial || unit.nama_unit || 'U').trim();
    return source.slice(0, 3).toUpperCase();
  };

  const paletteFor = (index: number) => AVATAR_PALETTE[index % AVATAR_PALETTE.length];

  const isTopUnit = currentUser?.unit_id === sortedUnits[0]?.id;
  const currentUnitRank = sortedUnits.findIndex(u => u.id === currentUser?.unit_id) + 1;

  // Rayakan juara sekali per sesi untuk unit yang memuncaki papan.
  useEffect(() => {
    if (!isTopUnit || role !== 'unit') return;
    if (sessionStorage.getItem(CELEBRATION_KEY)) return;
    const timer = setTimeout(() => {
      sessionStorage.setItem(CELEBRATION_KEY, 'true');
      setShowCelebration(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [isTopUnit, role]);

  const handleSetorClick = () => {
    setRole('unit');
    setActiveRoute('/unit/setor-kertas');
  };

  const openUnitDetail = (unitId: string) => {
    setLeaderboardUnitId(unitId);
    setActiveRoute('/leaderboard/rincian');
  };

  const handleShare = async () => {
    const text = `Peringkat daur ulang kertas kampus: ${sortedUnits
      .slice(0, 3)
      .map((u, i) => `#${i + 1} ${u.nama_unit} (${u.eco_points} pts)`)
      .join(' • ')}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Leaderboard Sampah Butuh Teman', text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        showToast('Peringkat berhasil disalin ke papan klip.', 'success');
      } else {
        showToast('Bagikan belum didukung di perangkat ini.', 'info');
      }
    } catch {
      /* pengguna membatalkan bagikan */
    }
  };

  return (
    <>
      {/* Sinar latar penuh: menutupi seluruh layar, berpusat di tengah layar */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <svg
          className="podium-rays-fade absolute left-1/2 top-1/2"
          viewBox="-700 -700 1400 1400"
          style={{ width: 1400, height: 1400, transform: 'translate(-50%, -50%)' }}
        >
          {Array.from({ length: 32 }).map((_, i) => (
            <path
              key={i}
              d="M0 0 L-18 1400 L18 1400 Z"
              fill="#2D6A4F"
              opacity={i % 2 === 0 ? 0.07 : 0.038}
              transform={`rotate(${(i * 360) / 32})`}
            />
          ))}
        </svg>
        <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D8F3DC]/60 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FDE68A]/40 blur-2xl" />
      </div>

      <div className="relative z-10 w-full pb-24 max-w-xl mx-auto space-y-4 font-sans text-[#1A2E22]">
        {/* Header: judul di tengah */}
        <header className="relative px-1 pt-1 text-center">
          <h1 className="font-display text-[22px] font-black leading-tight tracking-tight text-[#1A2E22]">Leaderboard</h1>
          <p className="mt-0.5 font-display text-[10px] font-semibold text-[#8CA090]">{bulanTahun}</p>
        </header>

      {/* Podium */}
      {sortedUnits.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-[#2D6A4F]/25 bg-white p-7 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F7F4] text-[#2D6A4F]">
            <span className="material-symbols-outlined text-2xl">leaderboard</span>
          </div>
          <p className="mt-3 text-sm font-extrabold text-[#1A2E22]">Belum ada unit untuk dirankingkan</p>
          <p className="mx-auto mt-1 max-w-[280px] text-[12px] leading-relaxed text-[#52645A]">
            Papan peringkat akan terisi otomatis setelah ada unit kampus yang mendaftarkan tong.
          </p>
        </div>
      ) : (
        <section
          aria-label="Podium peringkat"
          className="relative px-1 pb-2"
        >
          {/* Lantai podium - membuat blok terasa berdiri di alas (blur halus, tanpa tepi potong) */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-[50%] bg-[#2D6A4F]/10 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative flex items-end gap-2 px-1 pt-6">
            {podium.map(({ rank, unit }) => {
              const theme = PODIUM_THEME[rank];
              const isCurrent = currentUser?.unit_id === unit.id;
              return (
                <div key={rank} className="group relative flex flex-1 flex-col items-center">
                  {/* Area klik untuk membuka rincian unit */}
                  <button
                    type="button"
                    onClick={() => openUnitDetail(unit.id)}
                    aria-label={`Lihat rincian ${unit.nama_unit}`}
                    className="absolute inset-0 z-10 cursor-pointer rounded-2xl"
                  />
                  <div className="relative">
                    <div
                      className={`animate-avatar-bob flex items-center justify-center rounded-[22px] font-black ring-4 ${theme.ring} ${theme.avatar} ${
                        rank === 1 ? 'h-16 w-16 text-[15px]' : 'h-14 w-14 text-[13px]'
                      } shadow-sm`}
                      style={{ animationDelay: `${rank * 0.45}s` }}
                    >
                      {initialOf(unit)}
                    </div>
                    <span className="absolute -top-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#FDE68A] ring-2 ring-white" />
                    {isCurrent && (
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#2D6A4F] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                        Anda
                      </span>
                    )}
                  </div>

                  <p className="font-display mt-3 line-clamp-2 h-[24px] w-full px-0.5 text-center text-[10px] font-bold leading-tight text-[#1A2E22] transition-colors group-hover:text-[#2D6A4F]">
                    {unit.nama_unit}
                  </p>
                  <p className="font-display flex items-center gap-1 text-[10px] font-bold text-[#C27D3A]">
                    <span
                      className="material-symbols-outlined text-[13px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    {unit.eco_points.toLocaleString('id-ID')}
                  </p>

                  {/* Blok podium 3D — ujung bawah memudar biar tidak terlihat terpotong */}
                  <div
                    className="animate-podium-float relative mt-2 w-full transition-[filter] group-hover:brightness-105"
                    style={{ height: theme.height, animationDelay: `${(4 - rank) * 0.5}s` }}
                  >
                    <div
                      className={`absolute inset-x-0 top-0 h-4 rounded-t-[10px] ${theme.top}`}
                      style={{ transform: 'skewX(-14deg)', transformOrigin: 'bottom center' }}
                      aria-hidden="true"
                    />
                    <div
                      className={`podium-fade-bottom absolute inset-x-0 bottom-0 top-3 flex flex-col items-center justify-center rounded-b-[20px] ${theme.front}`}
                    >
                      <span className={`font-display text-[42px] font-extrabold leading-none ${theme.number}`}>{rank}</span>
                    </div>
                    <div
                      className="absolute -bottom-1 left-1/2 h-3 w-[88%] -translate-x-1/2 rounded-full bg-black/10 blur-md"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative mt-2 flex justify-center">
            <span className="material-symbols-outlined text-[16px] text-[#DDE7E0]">expand_more</span>
          </div>
        </section>
      )}

      {/* Kurs kertas */}
      <section aria-label="Kurs kertas" className="overflow-hidden rounded-[24px] border border-[#2D6A4F]/10 bg-white/85 shadow-xs backdrop-blur-[2px]">
        <button
          type="button"
          onClick={() => setShowRincianHarga(!showRincianHarga)}
          aria-expanded={showRincianHarga}
          className="flex w-full items-center gap-3 px-4 py-3 text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F2F7F4] text-[#2D6A4F]">
            <span className="material-symbols-outlined text-[19px]">currency_exchange</span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-[12px] font-semibold text-[#1A2E22]">Kurs kertas aktual</span>
            <span className="mt-0.5 block truncate text-[10px] font-medium text-[#6B7C70]">
              HVS Rp 1.500 · Kardus Rp 1.300 · Koran Rp 1.100 per Kg
            </span>
          </span>
          <span className="material-symbols-outlined shrink-0 text-[19px] text-[#8CA090]">
            {showRincianHarga ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {showRincianHarga && (
          <div className="grid grid-cols-2 gap-2 border-t border-[#2D6A4F]/8 px-4 pb-4 pt-3">
            {Object.entries(HARGA_KERTAS_AKTUAL).map(([key, val]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-2 rounded-2xl border border-[#2D6A4F]/8 bg-[#F7FAF8] px-3 py-2.5"
              >
                <div className="min-w-0">
                  <div className="truncate text-[10px] font-extrabold text-[#1A2E22]">{val.label}</div>
                  <div className="text-[9px] font-medium text-[#8CA090]">Kering &amp; bersih</div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="block text-[11px] font-black text-[#2D6A4F]">
                    Rp {val.perKg.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[9px] font-medium text-[#8CA090]">/ Kg</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Daftar peringkat */}
      {restUnits.length > 0 && (
        <section aria-label="Daftar peringkat" className="overflow-hidden rounded-[28px] border border-[#2D6A4F]/10 bg-white/85 shadow-xs backdrop-blur-[2px]">
          <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-4">
            <h3 className="font-display text-[13px] font-bold text-[#1A2E22]">Peringkat unit lainnya</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#8CA090]">
                {currentUnitRank > 0 ? `Anda #${currentUnitRank} · ` : ''}
                {restUnits.length} unit
              </span>
              <button
                type="button"
                onClick={handleShare}
                aria-label="Bagikan peringkat"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2D6A4F]/12 bg-white text-[#2D6A4F] transition-colors hover:bg-[#F2F7F4]"
              >
                <span className="material-symbols-outlined text-[15px]">share</span>
              </button>
            </div>
          </div>

          <div className="pb-1">
            {restUnits.map((unit, idx) => {
              const palette = paletteFor(idx);
              const isCurrent = currentUser?.unit_id === unit.id;
              return (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => openUnitDetail(unit.id)}
                  className={`flex w-full items-center gap-3 border-t border-[#2D6A4F]/8 px-4 py-3 text-left transition-colors hover:bg-[#F2F7F4] ${
                    isCurrent ? 'bg-[#F2F7F4]' : ''
                  }`}
                >
                  <span className="flex w-9 shrink-0 items-center justify-center gap-0.5 text-[12px] font-black tabular-nums text-[#8CA090]">
                    <span
                      className="material-symbols-outlined text-[14px] text-[#C27D3A]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      emoji_events
                    </span>
                    {idx + 4}
                  </span>
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] text-[11px] font-black ring-2 ${palette.bg} ${palette.fg} ${palette.ring}`}
                  >
                    {initialOf(unit)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display truncate text-[12px] font-semibold text-[#1A2E22]">{unit.nama_unit}</p>
                    <p className="truncate text-[10px] font-medium text-[#8CA090]">
                      @{unit.jenis} · {unit.total_kg_tersalurkan.toLocaleString('id-ID')} Kg
                    </p>
                  </div>
                  <span className="font-display flex shrink-0 items-center gap-1 text-[12px] font-bold tabular-nums text-[#2D6A4F]">
                    <span
                      className="material-symbols-outlined text-[15px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    {unit.eco_points.toLocaleString('id-ID')}
                  </span>
                  <span className="material-symbols-outlined shrink-0 text-[16px] text-[#C2D0C5]">chevron_right</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setShowInfo(true)}
        className="flex w-full items-center justify-center gap-1.5 text-[10px] font-medium text-[#8CA090] transition-colors hover:text-[#2D6A4F]"
      >
        <span className="material-symbols-outlined text-[14px]">update</span>
        Diperbarui otomatis setiap ada setoran
      </button>

      {/* CTA */}
      <button
        onClick={handleSetorClick}
        className="font-display flex w-full min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#2D6A4F] text-[12px] font-semibold text-white shadow-md transition-colors hover:bg-[#1A4235]"
      >
        <span className="material-symbols-outlined text-[18px]">add_circle</span>
        <span>Setor Kertas &amp; Tambah Nilai Dana Unit Anda</span>
      </button>

      {/* Modal Tentang peringkat */}
      {showInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F241A]/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-peringkat-title"
          onClick={e => {
            if (e.target === e.currentTarget) setShowInfo(false);
          }}
        >
          <div className="w-full max-w-sm rounded-[24px] border border-[#2D6A4F]/15 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F7F4] text-[#2D6A4F]">
                  <span className="material-symbols-outlined text-[21px]">info</span>
                </span>
                <h3 id="info-peringkat-title" className="text-sm font-extrabold text-[#1A2E22]">
                  Cara peringkat dihitung
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                aria-label="Tutup informasi"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#8CA090] transition-colors hover:bg-[#F2F7F4] hover:text-[#1A2E22]"
              >
                <span className="material-symbols-outlined text-[19px]">close</span>
              </button>
            </div>

            <ul className="mt-4 space-y-2.5">
              {[
                'Setiap 1 Kg kertas yang disetor menambah 2 Eco-Points untuk unit.',
                'Peringkat ditentukan dari total Eco-Points unit kampus, semakin tinggi semakin atas.',
                'Nilai rupiah mengikuti kurs kertas aktual per kategori yang berlaku di pasar.',
                'Tong unit minimal 10 Kg agar siap dijemput oleh mitra industri.',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 rounded-2xl bg-[#F7FAF8] p-3">
                  <span className="material-symbols-outlined mt-0.5 text-[16px] text-[#2D6A4F]">check_circle</span>
                  <span className="text-[11px] font-medium leading-relaxed text-[#52645A]">{item}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setShowInfo(false)}
              className="mt-4 min-h-[44px] w-full rounded-full bg-[#2D6A4F] text-[12px] font-extrabold text-white transition-colors hover:bg-[#1A4235]"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Rayakan juara (ala referensi: Perfect Scorer) */}
      {showCelebration && sortedUnits[0] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F241A]/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rayakan-juara-title"
        >
          <div className="w-full max-w-sm overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div className="relative flex h-56 items-end justify-center overflow-hidden bg-gradient-to-b from-[#EAF7EE] via-[#F8FCF9] to-[#FFFDF6]">
              <div className="absolute left-6 top-6 h-16 w-16 rounded-full bg-[#A7F3D0]/40 blur-2xl" />
              <div className="absolute right-10 top-10 h-20 w-20 rounded-full bg-[#FDE68A]/40 blur-2xl" />
              <img
                src="/moni.png"
                alt=""
                className="relative h-52 w-full object-contain object-bottom"
                style={{ filter: 'drop-shadow(0 18px 22px rgba(23,70,48,0.28))' }}
              />
              <span className="absolute right-7 top-7 flex h-12 w-12 items-center justify-center rounded-full bg-[#FDE68A] text-[#8A5A12] shadow-lg">
                <span
                  className="material-symbols-outlined text-[26px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  trophy
                </span>
              </span>
            </div>

            <div className="p-5 text-center">
              <h3 id="rayakan-juara-title" className="text-[21px] font-black tracking-tight text-[#1A2E22]">
                Juara Sirkularitas
              </h3>
              <p className="mx-auto mt-1.5 max-w-[280px] text-[12px] leading-relaxed text-[#52645A]">
                {sortedUnits[0].nama_unit} memimpin papan daur ulang kampus. Jadikan standar baru bagi
                seluruh unit kampus.
              </p>

              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] px-3 py-1.5 text-[12px] font-extrabold text-[#8A5A12]">
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  trophy
                </span>
                {sortedUnits[0].eco_points.toLocaleString('id-ID')} pts
              </span>

              <button
                type="button"
                onClick={() => setShowCelebration(false)}
                className="mt-4 min-h-[46px] w-full rounded-full bg-[#2D6A4F] text-[13px] font-extrabold text-white shadow-md transition-colors hover:bg-[#1A4235]"
              >
                Lanjut
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="mt-2 min-h-[44px] w-full rounded-full border border-[#2D6A4F]/25 bg-white text-[12px] font-extrabold text-[#2D6A4F] transition-colors hover:bg-[#F2F7F4]"
              >
                Bagikan ke teman
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};
