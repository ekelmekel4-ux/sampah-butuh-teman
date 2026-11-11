import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';

const KATEGORI_META: Record<string, { label: string; color: string; icon: string }> = {
  hvs: { label: 'HVS & Arsip', color: 'bg-[#2D6A4F]', icon: 'description' },
  kardus: { label: 'Kardus Box', color: 'bg-[#C27D3A]', icon: 'inventory_2' },
  koran: { label: 'Koran & Majalah', color: 'bg-[#C9A227]', icon: 'newspaper' },
  campur: { label: 'Campuran Kering', color: 'bg-[#5B8DB8]', icon: 'auto_stories' },
};

const POIN_PER_KG = 2;

export const LeaderboardDetailView: React.FC = () => {
  const { units, listings, currentUser, leaderboardUnitId, setActiveRoute } = useApp();

  const sortedUnits = useMemo(
    () => [...units].sort((a, b) => b.total_kg_tersalurkan - a.total_kg_tersalurkan),
    [units]
  );

  // Default: unit yang sedang login, kalau tidak ada unit yang dipilih dari leaderboard.
  const currentUnit = units.find(u => u.id === currentUser?.unit_id);

  const unit =
    sortedUnits.find(u => u.id === leaderboardUnitId) ||
    currentUnit ||
    sortedUnits[0] ||
    units[0];

  const unitListings = useMemo(
    () =>
      listings
        .filter(l => l.unit_id === unit?.id)
        .sort((a, b) => (b.tanggal_post || '').localeCompare(a.tanggal_post || '')),
    [listings, unit?.id]
  );

  if (!unit) {
    return (
      <div className="w-full max-w-xl mx-auto px-1 py-10 text-center text-[13px] font-semibold text-[#52645A]">
        Belum ada unit untuk dirinci.
      </div>
    );
  }

  const rank = sortedUnits.findIndex(u => u.id === unit.id) + 1;
  const totalKg = unit.total_kg_tersalurkan || 0;
  const totalPoin = unit.eco_points || 0;
  const pohon = Math.round((totalKg / 1000) * 17 * 10) / 10;

  const recordedKg = unitListings.reduce((acc, l) => acc + (l.jumlah_kg || 0), 0);

  const perKategori = Object.entries(
    unitListings.reduce<Record<string, number>>((acc, l) => {
      acc[l.kategori] = (acc[l.kategori] || 0) + (l.jumlah_kg || 0);
      return acc;
    }, {})
  )
    .map(([key, kg]) => ({
      key,
      kg,
      poin: kg * POIN_PER_KG,
      ...(KATEGORI_META[key] || { label: key, color: 'bg-[#8CA090]', icon: 'category' }),
    }))
    .sort((a, b) => b.kg - a.kg);

  const statusMeta: Record<string, { label: string; className: string }> = {
    menunggu_mitra: { label: 'Menunggu mitra', className: 'bg-[#FEF3C7] text-[#8A5A12]' },
    siap_pickup: { label: 'Siap pickup', className: 'bg-[#DDF1FA] text-[#17607E]' },
    sudah_diambil: { label: 'Selesai', className: 'bg-[#D8F3DC] text-[#174630]' },
  };

  const isOwnUnit = unit.id === currentUser?.unit_id;

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pb-24 font-sans text-[#1A2E22]">
      {/* Header */}
      <header className="flex items-center gap-3 px-1 py-1">
        <button
          type="button"
          onClick={() => setActiveRoute('/leaderboard')}
          aria-label="Kembali ke leaderboard"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2D6A4F]/15 bg-white text-[#2D6A4F] shadow-xs transition-colors hover:bg-[#D8F3DC]"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[#8CA090]">Rincian kertas unit</p>
          <h1 className="font-display text-[20px] font-black leading-tight tracking-tight text-[#1A2E22]">
            {unit.nama_unit}
          </h1>
        </div>
        <span className="ml-auto shrink-0 rounded-full bg-[#2D6A4F] px-3 py-1.5 text-[11px] font-extrabold text-white">
          #{rank}
        </span>
      </header>

      {/* Ringkasan total */}
      <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#3C8F68] via-[#2D6A4F] to-[#174630] p-5 text-white shadow-[0_18px_40px_rgba(23,70,48,0.22)]">
        <div className="pointer-events-none absolute -right-12 -top-14 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-white/15 text-[18px] font-black text-white ring-4 ring-white/20">
              {(unit.inisial || 'U').slice(0, 3).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A7F3D0]">Total tersalurkan</p>
              <p className="font-display text-[26px] font-extrabold leading-none tabular-nums">
                {totalKg.toLocaleString('id-ID')} Kg
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/15 pt-3 text-center">
            <div>
              <p className="font-display text-[16px] font-extrabold tabular-nums">{totalPoin.toLocaleString('id-ID')}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/75">Eco-Points</p>
            </div>
            <div>
              <p className="font-display text-[16px] font-extrabold tabular-nums">{unitListings.length}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/75">Setoran</p>
            </div>
            <div>
              <p className="font-display text-[16px] font-extrabold tabular-nums">{pohon}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/75">Pohon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dari mana poinnya */}
      <section className="rounded-[22px] border border-[#2D6A4F]/10 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#2D6A4F]">functions</span>
          <h2 className="text-[13px] font-extrabold text-[#1A2E22]">Dari mana poinnya?</h2>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-[#F7FAF8] px-3.5 py-3">
          <div>
            <p className="text-[11px] font-bold text-[#52645A]">Rumus Eco-Points</p>
            <p className="mt-0.5 font-display text-[13px] font-extrabold text-[#1A2E22]">
              2 poin × {totalKg.toLocaleString('id-ID')} Kg
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-[18px] font-extrabold tabular-nums text-[#2D6A4F]">
              {totalPoin.toLocaleString('id-ID')}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-[#8CA090]">poin</p>
          </div>
        </div>
        <p className="mt-2 text-[10px] font-medium leading-relaxed text-[#6B7C70]">
          Setiap kilogram kertas yang disetor unit = <strong className="font-extrabold">2 Eco-Points</strong>. Poin
          inilah yang menentukan urutan di papan peringkat. Nilai rupiah mengikuti kurs kertas aktual per kategori.
        </p>
      </section>

      {/* Breakdown per kategori */}
      {perKategori.length > 0 && (
        <section className="rounded-[22px] border border-[#2D6A4F]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#2D6A4F]">category</span>
              <h2 className="text-[13px] font-extrabold text-[#1A2E22]">Rincian per kategori</h2>
            </div>
            <span className="text-[10px] font-bold text-[#8CA090]">
              {recordedKg.toLocaleString('id-ID')} Kg tercatat
            </span>
          </div>

          {recordedKg < totalKg && (
            <p className="mt-2 rounded-xl bg-[#F7FAF8] px-3 py-2 text-[10px] font-medium leading-relaxed text-[#6B7C70]">
              Riwayat setoran tercatat <strong className="font-extrabold">{recordedKg.toLocaleString('id-ID')} Kg</strong>{' '}
              dari total unit <strong className="font-extrabold">{totalKg.toLocaleString('id-ID')} Kg</strong>. Selisihnya
              berasal dari setoran lama sebelum fitur riwayat dicatat.
            </p>
          )}

          <div className="mt-3 space-y-3">
            {perKategori.map(item => {
              const pct = totalKg > 0 ? Math.round((item.kg / totalKg) * 100) : 0;
              return (
                <div key={item.key}>
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="flex items-center gap-1.5 font-bold text-[#1A2E22]">
                      <span className="material-symbols-outlined text-[15px] text-[#2D6A4F]">{item.icon}</span>
                      {item.label}
                    </span>
                    <span className="font-display font-extrabold tabular-nums text-[#2D6A4F]">
                      {item.kg.toLocaleString('id-ID')} Kg
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#EAF2EC]">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[9.5px] font-medium text-[#8CA090]">
                    <span>{pct}% dari total</span>
                    <span>{item.poin.toLocaleString('id-ID')} poin</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {isOwnUnit && (
        <button
          type="button"
          onClick={() => setActiveRoute('/unit/riwayat')}
          className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full border border-[#2D6A4F]/20 bg-white text-[12px] font-extrabold text-[#2D6A4F] transition-colors hover:bg-[#F2F7F4]"
        >
          <span className="material-symbols-outlined text-[18px]">rate_review</span>
          Riwayat setoran &amp; penilaian mitra
        </button>
      )}

      <button
        type="button"
        onClick={() => setActiveRoute('/leaderboard')}
        className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#2D6A4F] text-[12px] font-extrabold text-white shadow-md transition-colors hover:bg-[#1A4235]"
      >
        <span className="material-symbols-outlined text-[18px]">leaderboard</span>
        Kembali ke papan peringkat
      </button>
    </div>
  );
};
