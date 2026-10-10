import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

// Standar tarif aktual per kategori kertas
export const HARGA_KERTAS_AKTUAL: Record<string, { label: string; perKg: number; icon: string }> = {
  hvs: { label: 'HVS / Arsip Putih', perKg: 1500, icon: 'description' },
  kardus: { label: 'Kardus Box Corrugated', perKg: 1300, icon: 'inventory_2' },
  koran: { label: 'Koran & Majalah', perKg: 1100, icon: 'newspaper' },
  campur: { label: 'Campuran Kering Bersih', perKg: 900, icon: 'auto_stories' },
};

export const LeaderboardView: React.FC = () => {
  const { units, matchings, listings, totalKgTersalurkan, totalPohon, setActiveRoute, setRole } = useApp();
  const [period, setPeriod] = useState<'bulan' | 'semester' | 'sepanjang'>('bulan');
  const [showRincianHarga, setShowRincianHarga] = useState(false);

  // Hitung nilai Rupiah aktual per unit:
  // 1. Dari transaksi matchings yang selesai (aktual yang sudah dicairkan)
  // 2. Ditambah estimasi dari listing unit atau rata-rata aktual Rp 1.450/kg untuk riwayat awal
  const getUnitRupiah = (unitId: string, totalKg: number): number => {
    // Ambil dari matching aktual selesai
    const completedTrx = matchings.filter(m => m.unit_id === unitId && m.status === 'sudah_diambil');
    const trxTotalRp = completedTrx.reduce((sum, m) => sum + (m.nilai_rupiah || 0), 0);
    const trxTotalKg = completedTrx.reduce((sum, m) => sum + (m.jumlah_kg || 0), 0);

    const sisaKg = Math.max(0, totalKg - trxTotalKg);
    // Untuk sisa kg yang tercatat, gunakan rata-rata aktual Rp 1.450 per kg
    const sisaRp = sisaKg * 1450;

    return trxTotalRp + sisaRp;
  };

  // Sort units descending by total_kg_tersalurkan
  const sortedUnits = [...units].map(u => ({
    ...u,
    totalRupiah: getUnitRupiah(u.id, u.total_kg_tersalurkan)
  })).sort((a, b) => b.total_kg_tersalurkan - a.total_kg_tersalurkan);

  const totalDanaKampus = sortedUnits.reduce((acc, curr) => acc + curr.totalRupiah, 0);

  const firstPlace = sortedUnits[0];
  const secondPlace = sortedUnits[1];
  const thirdPlace = sortedUnits[2];
  const restUnits = sortedUnits.slice(3);

  const handleSetorClick = () => {
    setRole('unit');
    setActiveRoute('/unit/setor-kertas');
  };

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4 font-sans text-[#1A2E22]">
      
      {/* 1. Header Profile & Title Bar */}
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#2D6A4F]/20 border border-[#2D6A4F]/30 flex items-center justify-center font-black text-[#0F2E22] text-base shadow-xs">
            🏆
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#52645A] tracking-tight">
              Papan Skor Sirkularitas Kampus
            </div>
            <h1 className="text-base font-extrabold text-[#1A2E22] tracking-tight leading-tight">
              Leaderboard & Konversi Dana
            </h1>
          </div>
        </div>

        {/* Period Filter */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-black/5 shadow-xs text-xs">
          <button
            onClick={() => setPeriod('bulan')}
            className={`px-3 py-1 rounded-full font-extrabold text-[11px] transition-all cursor-pointer ${
              period === 'bulan' ? 'bg-[#2D6A4F] text-white shadow-xs' : 'text-[#52645A]'
            }`}
          >
            Bulan
          </button>
          <button
            onClick={() => setPeriod('semester')}
            className={`px-3 py-1 rounded-full font-extrabold text-[11px] transition-all cursor-pointer ${
              period === 'semester' ? 'bg-[#2D6A4F] text-white shadow-xs' : 'text-[#52645A]'
            }`}
          >
            Semester
          </button>
        </div>
      </div>

      {/* 2. Vibrant Green Summary Banner Card */}
      <div className="w-full rounded-[28px] p-6 text-white bg-[#2D6A4F] shadow-md shadow-[#2D6A4F]/20 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-white/10 blur-lg pointer-events-none" />

        {/* 4 Stat Highlights in Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center relative z-10">
          {/* Total Dana Rp Terhimpun */}
          <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mb-1 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-200 tracking-tight leading-none">
              Rp {(totalDanaKampus / 1000).toFixed(0)}k
            </div>
            <div className="text-[9px] uppercase font-extrabold text-white/80 tracking-wider mt-1">
              DANA TERHIMPUN
            </div>
          </div>

          {/* Total Kertas Terdaur Ulang */}
          <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-full bg-emerald-400/20 text-emerald-200 flex items-center justify-center mb-1 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">recycling</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white tracking-tight leading-none">
              {totalKgTersalurkan.toLocaleString('id-ID')} <span className="text-xs font-semibold">Kg</span>
            </div>
            <div className="text-[9px] uppercase font-extrabold text-white/80 tracking-wider mt-1">
              TERDAUR ULANG
            </div>
          </div>

          {/* Eco-Points */}
          <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-1 shadow-xs">
              <span className="material-symbols-outlined text-[18px] text-amber-200">monetization_on</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white tracking-tight leading-none">
              {(totalKgTersalurkan * 2).toLocaleString('id-ID')}
            </div>
            <div className="text-[9px] uppercase font-extrabold text-white/80 tracking-wider mt-1">
              ECO-POINTS
            </div>
          </div>

          {/* Pohon Terselamatkan */}
          <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-1 shadow-xs">
              <span className="material-symbols-outlined text-[18px] text-sky-200">forest</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white tracking-tight leading-none">
              {totalPohon} <span className="text-xs font-semibold">Pohon</span>
            </div>
            <div className="text-[9px] uppercase font-extrabold text-white/80 tracking-wider mt-1">
              TERSELAMATKAN
            </div>
          </div>
        </div>

        {/* Info konversi aktual button */}
        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white/90">
          <span className="text-[11px] font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-amber-300">currency_exchange</span>
            Nilai dihitung real-time per Kg sesuai standar mitra pabrik.
          </span>
          <button
            onClick={() => setShowRincianHarga(!showRincianHarga)}
            className="text-[11px] font-extrabold underline hover:text-white cursor-pointer"
          >
            {showRincianHarga ? 'Tutup Kurs' : 'Cek Kurs Kertas'}
          </button>
        </div>
      </div>

      {/* Rincian Kurs Kertas Aktual Popup / Card */}
      {showRincianHarga && (
        <div className="bg-white rounded-[24px] p-5 shadow-xs border border-black/5 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2D6A4F] text-lg">price_check</span>
              <h3 className="text-xs font-extrabold text-[#1A2E22]">Tarif Konversi Aktual per Kategori</h3>
            </div>
            <span className="text-[10px] font-bold text-[#52645A] bg-[#F5F6F3] px-2 py-0.5 rounded-full">
              Update Terkini
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(HARGA_KERTAS_AKTUAL).map(([k, val]) => (
              <div key={k} className="p-3 bg-[#F5F6F3] rounded-2xl border border-black/5 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-[#1A2E22]">{val.label}</div>
                  <div className="text-[10px] text-[#52645A]">Kondisi Kering & Bersih</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#2D6A4F] block">
                    Rp {val.perKg.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[9px] text-[#52645A]">/ Kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Top 3 Podiums Section */}
      <div className="bg-white rounded-[28px] p-5 shadow-xs border border-black/5 space-y-4">
        <div className="text-center">
          <span className="text-[10px] font-extrabold text-[#2D6A4F] bg-[#2D6A4F]/10 px-3 py-1 rounded-full uppercase tracking-wider">
            Unit Kampus Teraktif
          </span>
          <h2 className="text-lg font-black text-[#1A2E22] mt-1.5">
            Podium Sirkularitas & Kas Terhimpun
          </h2>
        </div>

        {/* 3 Podiums Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 items-end">
          {/* #2 Second Place */}
          {secondPlace && (
            <div className="bg-[#F5F6F3] rounded-2xl p-3 text-center border border-black/5 flex flex-col items-center justify-between h-44">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center shadow-xs">
                #2
              </div>
              <div className="my-auto w-full">
                <div className="text-xs font-extrabold text-[#1A2E22] line-clamp-1">
                  {secondPlace.nama_unit}
                </div>
                <div className="text-sm font-black text-[#2D6A4F] mt-0.5">
                  {secondPlace.total_kg_tersalurkan} Kg
                </div>
                <div className="text-[11px] font-black text-[#C27D3A] mt-0.5">
                  Rp {secondPlace.totalRupiah.toLocaleString('id-ID')}
                </div>
              </div>
              <span className="text-[10px] text-[#52645A] font-semibold">
                {secondPlace.eco_points} pts
              </span>
            </div>
          )}

          {/* #1 First Place (Tallest) */}
          {firstPlace && (
            <div className="bg-gradient-to-b from-amber-50 to-[#F5F6F3] rounded-2xl p-3 text-center border-2 border-amber-300 flex flex-col items-center justify-between h-52 shadow-md relative">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-amber-950 font-black text-sm flex items-center justify-center shadow-sm">
                👑 #1
              </div>
              <div className="my-auto w-full">
                <div className="text-xs sm:text-sm font-black text-[#1A2E22] line-clamp-2">
                  {firstPlace.nama_unit}
                </div>
                <div className="text-base font-black text-[#2D6A4F] mt-1">
                  {firstPlace.total_kg_tersalurkan} Kg
                </div>
                <div className="text-xs font-black text-[#C27D3A] mt-0.5">
                  Rp {firstPlace.totalRupiah.toLocaleString('id-ID')}
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                {firstPlace.eco_points} pts
              </span>
            </div>
          )}

          {/* #3 Third Place */}
          {thirdPlace && (
            <div className="bg-[#F5F6F3] rounded-2xl p-3 text-center border border-black/5 flex flex-col items-center justify-between h-40">
              <div className="w-8 h-8 rounded-full bg-amber-800 text-amber-100 font-black text-xs flex items-center justify-center shadow-xs">
                #3
              </div>
              <div className="my-auto w-full">
                <div className="text-xs font-extrabold text-[#1A2E22] line-clamp-1">
                  {thirdPlace.nama_unit}
                </div>
                <div className="text-sm font-black text-[#2D6A4F] mt-0.5">
                  {thirdPlace.total_kg_tersalurkan} Kg
                </div>
                <div className="text-[11px] font-black text-[#C27D3A] mt-0.5">
                  Rp {thirdPlace.totalRupiah.toLocaleString('id-ID')}
                </div>
              </div>
              <span className="text-[10px] text-[#52645A] font-semibold">
                {thirdPlace.eco_points} pts
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Rest Units List */}
      <div className="bg-white rounded-[28px] p-5 shadow-xs border border-black/5 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-extrabold text-[#1A2E22]">
            Daftar Peringkat Unit Lainnya
          </h3>
          <span className="text-[11px] font-bold text-[#52645A]">
            {sortedUnits.length} Unit Kampus
          </span>
        </div>

        <div className="space-y-2">
          {restUnits.map((unit, idx) => (
            <div
              key={unit.id}
              className="bg-[#F5F6F3] rounded-2xl p-3.5 border border-black/5 flex items-center justify-between gap-3 text-xs hover:border-[#2D6A4F]/30 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white text-[#1A2E22] border border-black/5 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  #{idx + 4}
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-[#1A2E22] truncate">
                    {unit.nama_unit}
                  </div>
                  <div className="text-[10px] font-medium text-[#52645A] truncate">
                    {unit.jenis.toUpperCase()} • {unit.eco_points} Eco-Points
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-black text-[#2D6A4F] text-sm block">
                  {unit.total_kg_tersalurkan} Kg
                </span>
                <span className="text-[11px] font-extrabold text-[#C27D3A] block">
                  Rp {unit.totalRupiah.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleSetorClick}
          className="w-full mt-2 py-3.5 rounded-full bg-[#2D6A4F] hover:bg-[#1A4235] active:bg-[#0F2E22] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Setor Kertas & Tambah Nilai Dana Unit Anda</span>
        </button>
      </div>

    </div>
  );
};
