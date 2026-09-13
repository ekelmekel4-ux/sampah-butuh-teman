import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const LeaderboardView: React.FC = () => {
  const { units, totalKgTersalurkan, totalPohon, totalAirBersih, setActiveRoute, setRole } = useApp();
  const [period, setPeriod] = useState<'bulan' | 'semester' | 'sepanjang'>('bulan');
  const [showPanduan, setShowPanduan] = useState(false);

  // Sort units descending by total_kg_tersalurkan
  const sortedUnits = [...units].sort((a, b) => b.total_kg_tersalurkan - a.total_kg_tersalurkan);
  const firstPlace = sortedUnits[0];
  const secondPlace = sortedUnits[1];
  const thirdPlace = sortedUnits[2];
  const restUnits = sortedUnits.slice(3);

  const handleSetorClick = () => {
    setRole('unit');
    setActiveRoute('/unit/posting-baru');
  };

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4">
      {/* Top Movement Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#176B4D] to-[#0D6D3C] text-white p-4 shadow-md flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-2xl text-[#9CF2B5]">eco</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A4F3CC]">
            Gerakan Sirkular Kampus
          </span>
          <h2 className="text-lg font-bold leading-tight mt-0.5">
            Aksi Kertas Berkelanjutan
          </h2>
          <p className="text-xs text-white/85 mt-1 leading-relaxed">
            Setiap lembar arsip dan karton kampus diselamatkan menjadi sumber daya baru. Bersama wujudkan kampus minim timbulan sampah!
          </p>
        </div>
      </div>

      {/* Accumulated Impact Real-time */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#1C1C16]">Dampak Terakumulasi</h3>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#9CF2B5]/30 text-[#157140] text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#157140] animate-ping"></span>
            REAL-TIME
          </span>
        </div>

        {/* Big Total Card */}
        <div className="bg-[#F7F3EA] rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#57635A] block">Total Kertas Tersalurkan</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-extrabold text-[#005138] tracking-tight">
                {totalKgTersalurkan.toLocaleString('id-ID')}
              </span>
              <span className="text-sm font-bold text-[#005138]">Kg</span>
            </div>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#A4F3CC] text-[#002114] text-[10px] font-bold">
              +124 kg minggu ini dari {units.length} unit kampus
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#176B4D] shadow-xs">
            <span className="material-symbols-outlined text-3xl">recycling</span>
          </div>
        </div>

        {/* Tree & Water Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#F7F3EA] rounded-xl p-3 flex flex-col justify-between">
            <span className="material-symbols-outlined text-2xl text-[#176B4D]">park</span>
            <div className="mt-2">
              <div className="text-xl font-extrabold text-[#005138]">{totalPohon} <span className="text-xs font-normal">Pohon</span></div>
              <span className="text-[10px] text-[#57635A] leading-tight block mt-0.5">
                Terselamatkan dari penebangan
              </span>
            </div>
          </div>
          <div className="bg-[#F7F3EA] rounded-xl p-3 flex flex-col justify-between">
            <span className="material-symbols-outlined text-2xl text-[#8B6045]">water_drop</span>
            <div className="mt-2">
              <div className="text-xl font-extrabold text-[#8B6045]">{totalAirBersih.toLocaleString('id-ID')} <span className="text-xs font-normal">Liter</span></div>
              <span className="text-[10px] text-[#57635A] leading-tight block mt-0.5">
                Air bersih terlindungi
              </span>
            </div>
          </div>
        </div>

        {/* Central Drop Point Status */}
        <div className="p-3 rounded-xl bg-[#ECE8DF] border border-[#176B4D]/15 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#176B4D] text-lg">warehouse</span>
              <span className="text-xs font-bold text-[#1C1C16]">
                Drop Point Gedung Serbaguna
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#9CF2B5] text-[#157140] font-bold">
              • Aktif
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#57635A]">
            <span>Kapasitas Tong Terisi</span>
            <strong className="text-[#005138]">8 dari 12 Tong (67%)</strong>
          </div>
          <div className="w-full bg-white rounded-full h-2 overflow-hidden shadow-inner">
            <div className="bg-[#176B4D] h-full rounded-full transition-all duration-500" style={{ width: '67%' }}></div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#57635A] pt-0.5">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">schedule</span>
              Jadwal Angkut: Besok, 09:00 WIB
            </span>
            <span className="font-bold text-[#8B6045]">4 TONG KOSONG</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1C1C16]">Peringkat Keaktifan</h3>
            <p className="text-xs text-[#57635A]">Kontribusi pemilahan oleh unit & fakultas</p>
          </div>
          <span className="material-symbols-outlined text-[#176B4D] text-xl">military_tech</span>
        </div>

        {/* Period Filter Tabs */}
        <div className="bg-[#F1EEE5] p-1 rounded-xl flex items-center gap-1 text-xs">
          <button
            onClick={() => setPeriod('bulan')}
            className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all ${
              period === 'bulan' ? 'bg-white text-[#176B4D] shadow-xs' : 'text-[#57635A]'
            }`}
          >
            Bulan Ini
          </button>
          <button
            onClick={() => setPeriod('semester')}
            className={`flex-1 py-1.5 rounded-lg text-center font-semibold transition-all ${
              period === 'semester' ? 'bg-white text-[#176B4D] shadow-xs' : 'text-[#57635A]'
            }`}
          >
            Semester Genap
          </button>
          <button
            onClick={() => setPeriod('sepanjang')}
            className={`flex-1 py-1.5 rounded-lg text-center font-semibold transition-all ${
              period === 'sepanjang' ? 'bg-white text-[#176B4D] shadow-xs' : 'text-[#57635A]'
            }`}
          >
            Sepanjang Waktu
          </button>
        </div>

        {/* Podium Champions: #2 Left, #1 Center, #3 Right */}
        <div className="grid grid-cols-3 items-end gap-2 pt-6 pb-2">
          {/* #2 FEB */}
          {secondPlace && (
            <div className="flex flex-col items-center">
              <div className="relative mb-1">
                <div className="w-10 h-10 rounded-full bg-[#E6E2D9] border-2 border-[#BEC9C1] flex items-center justify-center text-[#57635A]">
                  <span className="material-symbols-outlined text-xl">account_balance</span>
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#57635A] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  #2
                </span>
              </div>
              <div className="w-full rounded-t-xl bg-[#F7F3EA] border border-[#E6E2D9] p-2 text-center flex flex-col items-center">
                <span className="text-xs font-bold text-[#1C1C16] truncate max-w-[80px]">
                  {secondPlace.inisial}
                </span>
                <span className="text-[11px] font-bold text-[#005138]">
                  {secondPlace.total_kg_tersalurkan} KG
                </span>
                <span className="text-[10px] text-[#8B6045] font-semibold mt-0.5">
                  ⚡ {secondPlace.eco_points}
                </span>
                <div className="mt-2 w-full py-1 rounded bg-[#E6E2D9] text-[#1C1C16] font-bold text-sm">
                  2
                </div>
              </div>
            </div>
          )}

          {/* #1 Juara FTD (Highest Podium) */}
          {firstPlace && (
            <div className="flex flex-col items-center -mt-4">
              <div className="flex flex-col items-center mb-1">
                <span className="text-[#005138] text-lg leading-none">👑</span>
                <div className="w-12 h-12 rounded-full bg-[#005138] border-2 border-[#52A66F] flex items-center justify-center text-white shadow-md">
                  <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                </div>
                <span className="bg-[#002114] text-[#A4F3CC] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs -mt-1">
                  JUARA
                </span>
              </div>
              <div className="w-full rounded-t-xl bg-[#A4F3CC]/20 border-2 border-[#005138] p-2 text-center flex flex-col items-center shadow-sm">
                <span className="text-xs font-extrabold text-[#005138] truncate max-w-[90px]">
                  {firstPlace.inisial}
                </span>
                <span className="text-xs font-extrabold text-[#005138]">
                  {firstPlace.total_kg_tersalurkan} KG
                </span>
                <span className="text-[10px] text-[#0D6D3C] font-bold mt-0.5 flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[11px]">eco</span>
                  {firstPlace.eco_points.toLocaleString('id-ID')} Poin
                </span>
                <div className="mt-3 w-full py-2 rounded bg-[#005138] text-white font-extrabold text-base shadow-xs">
                  1
                </div>
              </div>
            </div>
          )}

          {/* #3 BAA */}
          {thirdPlace && (
            <div className="flex flex-col items-center">
              <div className="relative mb-1">
                <div className="w-10 h-10 rounded-full bg-[#FFDBC8] border-2 border-[#8B6045] flex items-center justify-center text-[#8B6045]">
                  <span className="material-symbols-outlined text-xl">shield</span>
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#8B6045] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  #3
                </span>
              </div>
              <div className="w-full rounded-t-xl bg-[#F7F3EA] border border-[#E6E2D9] p-2 text-center flex flex-col items-center">
                <span className="text-xs font-bold text-[#1C1C16] truncate max-w-[80px]">
                  {thirdPlace.inisial}
                </span>
                <span className="text-[11px] font-bold text-[#8B6045]">
                  {thirdPlace.total_kg_tersalurkan} KG
                </span>
                <span className="text-[10px] text-[#57635A] font-semibold mt-0.5">
                  ⚡ {thirdPlace.eco_points}
                </span>
                <div className="mt-2 w-full py-1 rounded bg-[#E6E2D9] text-[#1C1C16] font-bold text-sm">
                  3
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ranked List for 4, 5, etc. */}
        <div className="space-y-2 pt-2">
          {restUnits.map((u, idx) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-3 rounded-xl bg-[#F7F3EA] hover:bg-[#ECE8DF] transition-colors border border-transparent hover:border-[#176B4D]/20"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 text-center font-bold text-sm text-[#57635A]">
                  {idx + 4}
                </span>
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#176B4D] shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-xl">
                    {u.jenis === 'biro' ? 'receipt_long' : 'campaign'}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#1C1C16] truncate">{u.nama_unit}</div>
                  <div className="text-[11px] text-[#57635A]">
                    {u.inisial} • {u.total_kg_tersalurkan} Kg Terkumpul
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-[#005138]">{u.eco_points} Pts</div>
                <span className="text-[9px] font-bold text-[#157140] bg-[#9CF2B5]/50 px-1.5 py-0.5 rounded">
                  {idx === 0 ? 'KONSISTEN' : '+35 POIN'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Promotion Card */}
      <div className="bg-[#F7F3EA] border border-[#8B6045]/20 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFDBC8] text-[#8B6045] flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-2xl">inventory_2</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1C1C16]">Punya Tumpukan Arsip & Kardus?</h4>
            <p className="text-xs text-[#57635A] mt-0.5 leading-relaxed">
              Laporkan tumpukan kertas tak terpakai di ruangan unit Anda. Tim logistik kampus siap jemput atau Anda dapat masukkan langsung ke tong unit.
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={handleSetorClick}
            className="w-full py-3 px-4 rounded-xl bg-[#176B4D] hover:bg-[#005138] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Setor Kertas Unit Sekarang</span>
          </button>
          <button
            onClick={() => setShowPanduan(!showPanduan)}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 text-[#57635A] font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#BEC9C1]/50 transition-all"
          >
            <span className="material-symbols-outlined text-base">menu_book</span>
            <span>Panduan Pemilahan Standar Kampus</span>
          </button>
        </div>

        {showPanduan && (
          <div className="p-3 bg-white rounded-xl border border-gray-100 text-xs text-[#3F4943] space-y-2 animate-in fade-in">
            <div className="font-bold text-[#176B4D]">Kriteria Sortir Bebas Kontaminan:</div>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>Kertas HVS/Arsip: Kering, bebas staples tebal/binder clip, terikat rapi per bendel.</li>
              <li>Kardus Box: Dilipat gepeng (di-press), bebas lakban tebal berlebih, diikat tali rafia.</li>
              <li>Dilarang keras memasukkan bungkus berminyak, gelas kopi plastik, atau sampah basah.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Community Volunteer Footer Pill */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#176B4D]/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#A4F3CC] flex items-center justify-center text-[#005138] shrink-0">
          <span className="material-symbols-outlined text-xl">diversity_3</span>
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D6D3C] block">
            Kolaborasi Civitas
          </span>
          <p className="text-xs font-bold text-[#1C1C16]">86 Dosen & Mahasiswa Aktif</p>
          <p className="text-[11px] text-[#57635A] truncate">
            Tergabung dalam relawan sirkular minggu ini
          </p>
        </div>
      </div>
    </div>
  );
};
