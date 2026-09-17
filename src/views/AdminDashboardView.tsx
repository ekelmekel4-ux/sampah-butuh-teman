import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AdminDashboardView: React.FC = () => {
  const {
    units,
    laporanList,
    totalKgTersalurkan,
    totalPohon,
    totalAirBersih,
    setActiveRoute
  } = useApp();

  const [timeframe, setTimeframe] = useState<'semester' | 'bulan' | '30hari'>('semester');
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'mingguan' | 'bulanan' | 'semester'>('bulanan');
  const [leaderboardFilter, setLeaderboardFilter] = useState<'semua' | 'fakultas' | 'biro'>('semua');
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const pendingLaporan = laporanList.filter(l => l.status === 'menunggu_tindakan');

  const targetSemester = 2500;
  const persentaseTarget = Math.min(100, Math.round((totalKgTersalurkan / targetSemester) * 100));

  // Compute leaderboard values based on selected period
  const getRankedUnits = () => {
    const periodMultipliers: Record<string, Record<string, { kg: number; points: number; frekuensi: number }>> = {
      mingguan: {
        'unit-ftd': { kg: 65, points: 130, frekuensi: 3 },
        'unit-fk': { kg: 55, points: 110, frekuensi: 2 },
        'unit-feb': { kg: 45, points: 90, frekuensi: 2 },
        'unit-fasilkom': { kg: 40, points: 80, frekuensi: 2 },
        'unit-fikom': { kg: 30, points: 60, frekuensi: 1 },
        'unit-perpus': { kg: 25, points: 50, frekuensi: 1 },
        'unit-baa': { kg: 20, points: 40, frekuensi: 1 },
        'unit-lppm': { kg: 15, points: 30, frekuensi: 1 }
      },
      bulanan: {
        'unit-baa': { kg: 245, points: 490, frekuensi: 8 },
        'unit-ftd': { kg: 190, points: 380, frekuensi: 6 },
        'unit-fk': { kg: 170, points: 340, frekuensi: 5 },
        'unit-feb': { kg: 145, points: 290, frekuensi: 5 },
        'unit-fasilkom': { kg: 120, points: 240, frekuensi: 4 },
        'unit-fikom': { kg: 95, points: 190, frekuensi: 3 },
        'unit-perpus': { kg: 85, points: 170, frekuensi: 3 },
        'unit-lppm': { kg: 55, points: 110, frekuensi: 2 }
      }
    };

    const badges = [
      'Juara 1 Sirkular',
      'Most Consistent',
      'Active Contributor',
      'Active Contributor',
      'Rising Star',
      'Steady Partner',
      'Developing Unit',
      'Standby Unit'
    ];

    const items = units.map(u => {
      let kg = u.total_kg_tersalurkan;
      let points = u.eco_points;
      let frekuensi = Math.max(1, Math.round(kg / 35));

      if (leaderboardPeriod !== 'semester' && periodMultipliers[leaderboardPeriod]?.[u.id]) {
        kg = periodMultipliers[leaderboardPeriod][u.id].kg;
        points = periodMultipliers[leaderboardPeriod][u.id].points;
        frekuensi = periodMultipliers[leaderboardPeriod][u.id].frekuensi;
      }

      return {
        ...u,
        kg,
        points,
        frekuensi,
        hvsKg: Math.round(kg * 0.45),
        kardusKg: Math.round(kg * 0.35),
        campurKg: Math.max(0, kg - Math.round(kg * 0.45) - Math.round(kg * 0.35)),
        pohonSaved: Math.max(1, Math.round(kg / 50)),
        airSaved: kg * 30,
        co2Saved: Math.round(kg * 1.3)
      };
    }).sort((a, b) => b.kg - a.kg);

    const totalPeriodKg = items.reduce((acc, it) => acc + it.kg, 0) || 1;

    return items.map((it, idx) => ({
      ...it,
      rank: idx + 1,
      kontribusiPct: Math.round((it.kg / totalPeriodKg) * 100),
      badge: badges[idx] || 'Active Contributor'
    }));
  };

  const allRankedUnits = getRankedUnits();
  const filteredRankedUnits = leaderboardFilter === 'semua'
    ? allRankedUnits
    : allRankedUnits.filter(u => u.jenis === leaderboardFilter);

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4">
      {/* Capaian Kampus Hijau Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#176B4D] uppercase tracking-wider block">
              PANEL SENTRAL KAMPUS
            </span>
            <h2 className="text-base font-bold text-[#1C1C16]">
              Capaian Sirkular Kampus Hijau
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#9CF2B5] text-[#157140] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#157140] animate-pulse"></span>
            Drop Point Normal
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#57635A]">Target Semester Genap</span>
            <strong className="text-[#005138]">
              {totalKgTersalurkan.toLocaleString('id-ID')} / {targetSemester.toLocaleString('id-ID')} Kg ({persentaseTarget}%)
            </strong>
          </div>
          <div className="w-full bg-[#E6E2D9] rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-[#176B4D] to-[#52A66F] h-full rounded-full transition-all duration-500"
              style={{ width: `${persentaseTarget}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-[#57635A]">
            <span>Sisa target: {Math.max(0, targetSemester - totalKgTersalurkan)} Kg</span>
            <span>{totalPohon} Pohon • {totalAirBersih.toLocaleString('id-ID')} L Air</span>
          </div>
        </div>
      </div>

      {/* Akses Cepat Tombol Panel (Quick Access 2 Cards) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveRoute('/admin/unit-tong')}
          className="p-3.5 rounded-2xl bg-white border border-[#176B4D]/15 hover:border-[#176B4D]/40 shadow-xs hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#E8F8F0] text-[#176B4D] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">grid_view</span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#57635A] uppercase tracking-wider block">
                Akses Drop Point
              </span>
              <strong className="text-xs font-black text-[#1C1C16] group-hover:text-[#176B4D] transition-colors block truncate">
                Denah & Log Tong
              </strong>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#57635A] group-hover:text-[#176B4D] text-lg transition-transform group-hover:translate-x-0.5 shrink-0 ml-1">
            chevron_right
          </span>
        </button>

        <button
          onClick={() => setActiveRoute('/admin/laporan')}
          className="p-3.5 rounded-2xl bg-white border border-[#176B4D]/15 hover:border-[#BA1A1A]/40 shadow-xs hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#FFF3E0] text-[#E65100] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform relative">
              <span className="material-symbols-outlined text-xl">flag</span>
              {pendingLaporan.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#BA1A1A] text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {pendingLaporan.length}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#57635A] uppercase tracking-wider block">
                Moderasi QC
              </span>
              <strong className="text-xs font-black text-[#1C1C16] group-hover:text-[#BA1A1A] transition-colors block truncate">
                Laporan & Flag
              </strong>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#57635A] group-hover:text-[#BA1A1A] text-lg transition-transform group-hover:translate-x-0.5 shrink-0 ml-1">
            chevron_right
          </span>
        </button>
      </div>

      {/* Action Notice Alert */}
      {actionNotice && (
        <div className="p-3 bg-[#9CF2B5]/30 border border-[#157140]/30 rounded-xl text-xs text-[#157140] font-semibold flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-base shrink-0">check_circle</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KONTEN UTAMA: ANALISIS & STATISTIK SIRKULAR KAMPUS */}
      <div className="space-y-4">
        {/* 1. Header Analisis & Timeframe Filter */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#176B4D]/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#176B4D] text-xl">analytics</span>
                <h3 className="text-sm font-black text-[#1C1C16]">
                  Analisis & Intelijen Sirkular
                </h3>
              </div>
              <p className="text-xs text-[#57635A] mt-0.5 leading-relaxed">
                Laporan analitik penyerapan limbah kertas, dinamika penyalur, dan metrik dampak lingkungan
              </p>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center gap-1 bg-[#F7F3EA] p-1 rounded-xl text-xs shrink-0 self-start sm:self-auto w-full sm:w-auto">
              {[
                { key: 'semester', label: 'Semester' },
                { key: 'bulan', label: 'Bulan Ini' },
                { key: '30hari', label: '30 Hari' }
              ].map(t => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTimeframe(t.key as any)}
                  className={`flex-1 sm:flex-none px-2 py-1.5 rounded-lg font-bold transition-all text-[11px] cursor-pointer ${
                    timeframe === t.key
                      ? 'bg-white text-[#176B4D] shadow-xs'
                      : 'text-[#57635A] hover:text-[#1C1C16]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Executive KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#E8F8F0] to-[#D5F3E4] border border-[#176B4D]/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#176B4D]">Total Tersalurkan</span>
                <span className="material-symbols-outlined text-base text-[#176B4D]">recycling</span>
              </div>
              <div className="text-xl font-black text-[#005138]">
                {totalKgTersalurkan.toLocaleString('id-ID')} <span className="text-xs font-bold">Kg</span>
              </div>
              <div className="text-[10px] font-semibold text-[#176B4D] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">trending_up</span>
                <span>+18.4% vs bulan lalu</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#FFF5ED] to-[#FFE8D6] border border-[#8B6045]/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8B6045]">Nilai Sirkularitas</span>
                <span className="material-symbols-outlined text-base text-[#8B6045]">payments</span>
              </div>
              <div className="text-xl font-black text-[#5C3D28]">
                Rp {(totalKgTersalurkan * 1400).toLocaleString('id-ID')}
              </div>
              <span className="text-[10px] text-[#8B6045] block">
                Rerata Rp 1.400 / Kg
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#EDF5FF] to-[#DBEAFF] border border-[#1E6091]/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#1E6091]">Waktu Jemput</span>
                <span className="material-symbols-outlined text-base text-[#1E6091]">timer</span>
              </div>
              <div className="text-xl font-black text-[#133E60]">
                1.8 <span className="text-xs font-bold">Hari</span>
              </div>
              <span className="text-[10px] text-[#1E6091] font-semibold">
                Truk tiba &lt; 48 jam
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#F5F1E8] to-[#EBE4D5] border border-gray-300 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#57635A]">Kualitas QC</span>
                <span className="material-symbols-outlined text-base text-[#176B4D]">verified</span>
              </div>
              <div className="text-xl font-black text-[#1C1C16]">
                98.2%
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">
                Bebas kontaminasi residu
              </span>
            </div>
          </div>
        </div>

        {/* 2. Tren Penyaluran Kertas Kampus (Interactive Visual Bar Chart) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#176B4D]/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#1C1C16]">Tren Penyerapan Sampah Kertas (Kg per Bulan)</h4>
              <p className="text-xs text-[#57635A]">Progres akumulasi penimbangan di timbangan digital Gedung Serbaguna</p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-[#176B4D] border border-emerald-200">
              Target: 2.500 Kg
            </span>
          </div>

          {/* Visual Bar Chart */}
          <div className="pt-4 pb-2">
            <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 px-2 border-b border-gray-200">
              {[
                { bln: 'Jan', kg: 120, pct: 38, active: false },
                { bln: 'Feb', kg: 185, pct: 58, active: false },
                { bln: 'Mar', kg: 290, pct: 92, active: true },
                { bln: 'Apr', kg: 240, pct: 76, active: false },
                { bln: 'Mei', kg: 250, pct: 80, active: false },
                { bln: 'Jun (Proy)', kg: 315, pct: 100, active: false, projected: true }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  {/* Hover Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-[#1C1C16] text-white px-2 py-0.5 rounded shadow-md pointer-events-none whitespace-nowrap">
                    {item.kg} Kg
                  </div>
                  {/* Bar */}
                  <div
                    className={`w-full max-w-[42px] rounded-t-lg transition-all duration-500 relative ${
                      item.projected
                        ? 'bg-gradient-to-t from-gray-200 to-gray-300 border-2 border-dashed border-[#176B4D]'
                        : item.active
                        ? 'bg-gradient-to-t from-[#176B4D] to-[#2E9E74] shadow-md shadow-[#176B4D]/20'
                        : 'bg-gradient-to-t from-[#8B6045]/60 to-[#8B6045] hover:from-[#176B4D] hover:to-[#2E9E74]'
                    }`}
                    style={{ height: `${item.pct}%` }}
                  >
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#57635A]">
                      {item.kg}
                    </span>
                  </div>
                  {/* Month Label */}
                  <span className={`text-[11px] font-bold ${item.active ? 'text-[#176B4D]' : 'text-[#57635A]'}`}>
                    {item.bln}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F3EA] border border-[#176B4D]/10 flex items-center gap-2.5 text-xs text-[#57635A]">
            <span className="material-symbols-outlined text-[#176B4D] text-lg shrink-0">insights</span>
            <span>
              <strong>Insight Analis:</strong> Terjadi kenaikan signifikan setoran pada <strong>Maret (+56%)</strong> seiring program pembersihan berkas ujian akhir semester. Proyeksi Juni diperkirakan mencapai 315 Kg.
            </span>
          </div>
        </div>

        {/* 3. Komposisi Kategori Sampah Kertas */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#176B4D]/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#1C1C16]">Komposisi Kategori Sampah Kertas</h4>
              <p className="text-xs text-[#57635A]">Distribusi jenis material kertas yang diserap kampus</p>
            </div>
            <span className="text-xs font-black text-[#176B4D]">Total 1.085 Kg</span>
          </div>

          {/* Multi-segment progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden flex shadow-inner">
            <div style={{ width: '44.7%' }} className="bg-[#176B4D] h-full" title="HVS (44.7%)" />
            <div style={{ width: '35.9%' }} className="bg-[#8B6045] h-full" title="Kardus (35.9%)" />
            <div style={{ width: '12.9%' }} className="bg-[#3A7CA5] h-full" title="Majalah (12.9%)" />
            <div style={{ width: '6.5%' }} className="bg-[#D4A373] h-full" title="Campur (6.5%)" />
          </div>

          {/* 4 Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#176B4D]" />
                <div>
                  <h5 className="font-bold text-xs text-[#1C1C16]">Kertas HVS & Arsip Kantor</h5>
                  <span className="text-[10px] text-[#57635A]">Rp 1.500 / Kg</span>
                </div>
              </div>
              <div className="text-right">
                <strong className="text-xs text-[#176B4D]">485 Kg (44.7%)</strong>
                <p className="text-[10px] text-[#57635A]">Rp 727.500</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#8B6045]" />
                <div>
                  <h5 className="font-bold text-xs text-[#1C1C16]">Kardus Box Corrugated</h5>
                  <span className="text-[10px] text-[#57635A]">Rp 1.300 / Kg</span>
                </div>
              </div>
              <div className="text-right">
                <strong className="text-xs text-[#8B6045]">390 Kg (35.9%)</strong>
                <p className="text-[10px] text-[#57635A]">Rp 507.000</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#3A7CA5]" />
                <div>
                  <h5 className="font-bold text-xs text-[#1C1C16]">Majalah, Koran & Pamflet</h5>
                  <span className="text-[10px] text-[#57635A]">Rp 1.100 / Kg</span>
                </div>
              </div>
              <div className="text-right">
                <strong className="text-xs text-[#3A7CA5]">140 Kg (12.9%)</strong>
                <p className="text-[10px] text-[#57635A]">Rp 154.000</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#D4A373]" />
                <div>
                  <h5 className="font-bold text-xs text-[#1C1C16]">Campuran Kering Bersih</h5>
                  <span className="text-[10px] text-[#57635A]">Rp 900 / Kg</span>
                </div>
              </div>
              <div className="text-right">
                <strong className="text-xs text-[#D4A373]">70 Kg (6.5%)</strong>
                <p className="text-[10px] text-[#57635A]">Rp 63.000</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Dashboard Peringkat Kampus Hijau & List Rincian Detail */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#176B4D]/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-xl">emoji_events</span>
                <h4 className="text-sm font-black text-[#1C1C16]">Dashboard Peringkat Kampus Hijau</h4>
              </div>
              <p className="text-xs text-[#57635A] mt-0.5">
                Peringkat kontribusi penyaluran limbah kertas & Eco Points antar unit civitas
              </p>
            </div>

            {/* Period Switcher (PRD Section 5.1) */}
            <div className="flex items-center gap-1 bg-[#F7F3EA] p-1 rounded-xl text-xs self-start sm:self-auto shrink-0 flex-wrap">
              {[
                { key: 'mingguan', label: 'Mingguan' },
                { key: 'bulanan', label: 'Bulanan' },
                { key: 'semester', label: 'Akumulatif' }
              ].map(p => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setLeaderboardPeriod(p.key as any)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[10px] cursor-pointer ${
                    leaderboardPeriod === p.key
                      ? 'bg-white text-[#176B4D] shadow-xs'
                      : 'text-[#57635A] hover:text-[#1C1C16]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* VISUAL PODIUM 3 BESAR (Juara 1, 2, 3) */}
          <div className="pt-5 pb-2 px-3 bg-gradient-to-b from-[#F9F6F0] to-[#EFECE3] rounded-2xl border border-gray-200/80">
            <div className="flex items-end justify-center gap-2 sm:gap-4 max-w-sm mx-auto">
              {/* JUARA 2 (Silver) */}
              {allRankedUnits[1] && (
                <div className="flex-1 flex flex-col items-center min-w-0">
                  <div className="text-center space-y-1 mb-1.5 w-full px-1">
                    <span className="text-lg">🥈</span>
                    <div className="w-10 h-10 mx-auto rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xs shadow-xs border border-slate-300">
                      {allRankedUnits[1].inisial}
                    </div>
                    <div className="text-[10px] font-bold text-gray-800 truncate w-full">
                      {allRankedUnits[1].nama_unit.replace(/^(Fakultas|Biro|Lembaga|Perpustakaan)\s+/i, '')}
                    </div>
                    <span className="text-[10px] font-black text-[#176B4D] block">
                      {allRankedUnits[1].kg} Kg
                    </span>
                  </div>
                  <div className="w-full bg-gradient-to-t from-slate-300 to-slate-200 rounded-t-xl h-16 flex items-center justify-center border-t-2 border-slate-400/80 shadow-xs">
                    <span className="text-sm font-black text-slate-600">#2</span>
                  </div>
                </div>
              )}

              {/* JUARA 1 (Gold) */}
              {allRankedUnits[0] && (
                <div className="flex-1 flex flex-col items-center -mt-4 min-w-0">
                  <div className="text-center space-y-1 mb-1.5 w-full px-1">
                    <div className="inline-block relative">
                      <span className="text-2xl animate-bounce block">👑</span>
                      <span className="text-lg">🥇</span>
                    </div>
                    <div className="w-12 h-12 mx-auto rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-sm shadow-md border-2 border-amber-300 ring-2 ring-amber-200">
                      {allRankedUnits[0].inisial}
                    </div>
                    <div className="text-[11px] font-black text-[#1C1C16] truncate w-full">
                      {allRankedUnits[0].nama_unit.replace(/^(Fakultas|Biro|Lembaga|Perpustakaan)\s+/i, '')}
                    </div>
                    <span className="text-xs font-black text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded-md inline-block">
                      {allRankedUnits[0].kg} Kg
                    </span>
                  </div>
                  <div className="w-full bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-xl h-24 flex flex-col items-center justify-center border-t-2 border-amber-200 shadow-md">
                    <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest">JUARA</span>
                    <span className="text-base font-black text-amber-950">#1</span>
                  </div>
                </div>
              )}

              {/* JUARA 3 (Bronze) */}
              {allRankedUnits[2] && (
                <div className="flex-1 flex flex-col items-center min-w-0">
                  <div className="text-center space-y-1 mb-1.5 w-full px-1">
                    <span className="text-lg">🥉</span>
                    <div className="w-10 h-10 mx-auto rounded-xl bg-amber-700/20 text-amber-800 flex items-center justify-center font-black text-xs shadow-xs border border-amber-600/30">
                      {allRankedUnits[2].inisial}
                    </div>
                    <div className="text-[10px] font-bold text-gray-800 truncate w-full">
                      {allRankedUnits[2].nama_unit.replace(/^(Fakultas|Biro|Lembaga|Perpustakaan)\s+/i, '')}
                    </div>
                    <span className="text-[10px] font-black text-[#176B4D] block">
                      {allRankedUnits[2].kg} Kg
                    </span>
                  </div>
                  <div className="w-full bg-gradient-to-t from-amber-700/30 to-amber-700/20 rounded-t-xl h-12 flex items-center justify-center border-t-2 border-amber-600/40 shadow-xs">
                    <span className="text-xs font-black text-amber-800">#3</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* LIST DETAIL PERINGKAT LENGKAP (#1 s/d #8) */}
          <div className="space-y-2.5 pt-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-1 border-b border-gray-100 gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-[#176B4D] text-sm">format_list_numbered</span>
                <h5 className="text-xs font-black text-[#1C1C16]">
                  Daftar Peringkat Lengkap & Rincian Detail ({filteredRankedUnits.length} Unit)
                </h5>
              </div>

              {/* Filter Fakultas / Biro */}
              <div className="flex items-center gap-1 bg-[#F1EEE5] p-0.5 rounded-lg text-[10px] flex-wrap">
                {(['semua', 'fakultas', 'biro'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setLeaderboardFilter(f)}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all capitalize cursor-pointer whitespace-nowrap ${
                      leaderboardFilter === f ? 'bg-white text-[#176B4D] shadow-xs' : 'text-[#57635A]'
                    }`}
                  >
                    {f === 'semua' ? 'Semua' : f}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-[#57635A]">
              Klik pada baris unit untuk membuka <strong>rincian komposisi material, dampak ekologis, dan kontak PIC</strong>.
            </p>

            {/* List of Units */}
            <div className="space-y-2">
              {filteredRankedUnits.map((unit) => {
                const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
                const isExpanded = expandedUnitId === unit.id;

                return (
                  <div
                    key={unit.id}
                    className={`rounded-xl border transition-all overflow-hidden ${
                      isExpanded
                        ? 'border-[#176B4D]/40 bg-white shadow-md ring-1 ring-[#176B4D]/20'
                        : unit.rank <= 3
                        ? 'border-amber-200 bg-[#FFFDF9] hover:border-amber-300'
                        : 'border-gray-200/80 bg-white hover:border-gray-300'
                    }`}
                  >
                    {/* Main Row Header (Clickable to expand) */}
                    <div
                      onClick={() => setExpandedUnitId(isExpanded ? null : unit.id)}
                      className="p-3 flex items-center justify-between gap-2.5 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-sm font-black w-6 text-center shrink-0">
                          {medals[unit.rank] || `#${unit.rank}`}
                        </span>

                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                          unit.rank === 1
                            ? 'bg-amber-400 text-amber-950 font-black'
                            : unit.rank === 2
                            ? 'bg-slate-300 text-slate-800'
                            : unit.rank === 3
                            ? 'bg-amber-700/20 text-amber-800'
                            : 'bg-[#176B4D] text-white'
                        }`}>
                          {unit.inisial}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h5 className="font-bold text-xs text-[#1C1C16] truncate">
                              {unit.nama_unit}
                            </h5>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-gray-100 text-[#57635A]">
                              {unit.badge}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-[#57635A] mt-0.5">
                            <span>{unit.frekuensi}x Penyetoran</span>
                            <span>•</span>
                            <span className="text-[#176B4D] font-bold">{unit.kontribusiPct}% Kampus</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-black text-[#176B4D] block">
                            {unit.kg} Kg
                          </span>
                          <span className="text-[10px] font-bold text-[#8B6045]">
                            {unit.points} Pts
                          </span>
                        </div>

                        <span className={`material-symbols-outlined text-[#57635A] text-lg transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-[#176B4D]' : ''
                        }`}>
                          expand_more
                        </span>
                      </div>
                    </div>

                    {/* EXPANDED ACCORDION: RINCIAN DETAIL UNIT */}
                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-2 border-t border-gray-100 bg-[#FAF8F5] space-y-3 animate-in slide-in-from-top-2 duration-150 text-xs">
                        {/* 1. Rincian Komposisi Material Kertas */}
                        <div className="p-3 bg-white rounded-xl border border-gray-200/70 space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <strong className="text-[#1C1C16] font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-[#176B4D]">donut_small</span>
                              Rincian Material Terkumpul:
                            </strong>
                            <span className="text-[#57635A] font-semibold">{unit.kg} Kg total</span>
                          </div>

                          {/* Multi-color mini progress bar */}
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden flex shadow-inner">
                            <div style={{ width: '45%' }} className="bg-[#176B4D] h-full" title="HVS 45%" />
                            <div style={{ width: '35%' }} className="bg-[#8B6045] h-full" title="Kardus 35%" />
                            <div style={{ width: '20%' }} className="bg-[#3A7CA5] h-full" title="Koran/Majalah 20%" />
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-[10px] pt-1">
                            <div className="p-1.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-center">
                              <span className="text-emerald-800 font-bold block">{unit.hvsKg} Kg</span>
                              <span className="text-gray-500">HVS & Arsip</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-amber-50/60 border border-amber-100 text-center">
                              <span className="text-[#8B6045] font-bold block">{unit.kardusKg} Kg</span>
                              <span className="text-gray-500">Kardus Box</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-sky-50/60 border border-sky-100 text-center">
                              <span className="text-sky-800 font-bold block">{unit.campurKg} Kg</span>
                              <span className="text-gray-500">Majalah/Koran</span>
                            </div>
                          </div>
                        </div>

                        {/* 2. Metrik Dampak Lingkungan Unit */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2.5 rounded-xl bg-white border border-gray-200/70 text-center">
                            <span className="material-symbols-outlined text-emerald-600 text-base">nature</span>
                            <div className="text-sm font-black text-[#1C1C16]">{unit.pohonSaved}</div>
                            <span className="text-[9px] text-[#57635A] block leading-tight">Pohon Terselamatkan</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white border border-gray-200/70 text-center">
                            <span className="material-symbols-outlined text-cyan-600 text-base">water_drop</span>
                            <div className="text-sm font-black text-[#1C1C16]">{unit.airSaved.toLocaleString('id-ID')} L</div>
                            <span className="text-[9px] text-[#57635A] block leading-tight">Air Bersih Terhemat</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white border border-gray-200/70 text-center">
                            <span className="material-symbols-outlined text-amber-600 text-base">co2</span>
                            <div className="text-sm font-black text-[#1C1C16]">{unit.co2Saved} Kg</div>
                            <span className="text-[9px] text-[#57635A] block leading-tight">Emisi Karbon Dicegah</span>
                          </div>
                        </div>

                        {/* 3. Drop Point & PIC Contact */}
                        <div className="p-3 bg-white rounded-xl border border-gray-200/70 space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[#57635A]">Alokasi Drop Point:</span>
                            <strong className="text-[#1C1C16]">{unit.tong_nama}</strong>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                                Koordinator PIC
                              </span>
                              <strong className="text-xs text-[#1C1C16] block">{unit.pic_nama}</strong>
                              <span className="text-[10px] text-[#57635A]">{unit.kontak_pic}</span>
                            </div>

                            <a
                              href={`https://wa.me/${unit.kontak_pic.replace(/\D/g, '')}?text=Halo%20PIC%20${encodeURIComponent(unit.nama_unit)},%20selamat%20atas%20capaian%20peringkat%20${unit.rank}%20di%20Dashboard%20Kampus%20Hijau!`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-[#176B4D] hover:bg-[#005138] text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm">chat</span>
                              <span>WA PIC</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. Dampak Lingkungan Kumulatif */}
        <div className="bg-gradient-to-br from-[#176B4D] to-[#0E4632] rounded-2xl p-5 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-300 text-xl">forest</span>
              <h4 className="font-black text-sm">Dampak Ekologis Sirkular Kampus Hijau</h4>
            </div>
            <span className="text-[10px] font-semibold text-emerald-200 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-xs">
              Formula PRD Terverifikasi
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs space-y-1">
              <span className="material-symbols-outlined text-2xl text-emerald-300">nature</span>
              <div className="text-xl font-black">{totalPohon}</div>
              <div className="text-[10px] text-white/80">Pohon Terselamatkan</div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs space-y-1">
              <span className="material-symbols-outlined text-2xl text-cyan-300">water_drop</span>
              <div className="text-xl font-black">{totalAirBersih.toLocaleString('id-ID')} L</div>
              <div className="text-[10px] text-white/80">Air Bersih Terhemat</div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs space-y-1">
              <span className="material-symbols-outlined text-2xl text-amber-300">bolt</span>
              <div className="text-xl font-black">{Math.round(totalKgTersalurkan * 4).toLocaleString('id-ID')} kWh</div>
              <div className="text-[10px] text-white/80">Energi Listrik Terhemat</div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs space-y-1">
              <span className="material-symbols-outlined text-2xl text-emerald-200">co2</span>
              <div className="text-xl font-black">{Math.round(totalKgTersalurkan * 1.3).toLocaleString('id-ID')} Kg</div>
              <div className="text-[10px] text-white/80">Emisi Karbon Dicegah</div>
            </div>
          </div>
        </div>

        {/* 6. Rekomendasi Aksi Cerdas Admin */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#176B4D]/10 space-y-3">
          <h4 className="text-sm font-bold text-[#1C1C16] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#176B4D] text-lg">lightbulb</span>
            <span>Wawasan & Rekomendasi Pintar Logistik</span>
          </h4>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-rose-600 text-lg shrink-0 mt-0.5">warning</span>
                <div>
                  <strong className="text-rose-900 block font-bold">Tong BAA-01 Penuh (120 Kg)</strong>
                  <p className="text-rose-700 text-[11px] mt-0.5">
                    Kapasitas maksimal telah tercapai. Segera konfirmasi jadwal penjemputan armada dengan PT Mandiri Daur Lestari.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActionNotice('Panggilan konfirmasi logistik dikirimkan ke Dispatcher PT Mandiri Daur Lestari.');
                  setTimeout(() => setActionNotice(null), 3500);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shrink-0 shadow-xs transition-all cursor-pointer"
              >
                Panggil Armada
              </button>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#176B4D] text-lg shrink-0 mt-0.5">campaign</span>
                <div>
                  <strong className="text-emerald-900 block font-bold">Aktivasi Penyetoran Fakultas Teknik & Desain (FTD)</strong>
                  <p className="text-emerald-700 text-[11px] mt-0.5">
                    FTD memiliki 5 tong standby kosong. Kirim pengingat resmi program Paper Drive menjelang masa yudisium.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActionNotice('Pesan pengingat program Paper Drive terkirim ke WhatsApp PIC FTD.');
                  setTimeout(() => setActionNotice(null), 3500);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#176B4D] hover:bg-[#005138] text-white font-bold text-[10px] shrink-0 shadow-xs transition-all cursor-pointer"
              >
                Kirim Pengingat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
