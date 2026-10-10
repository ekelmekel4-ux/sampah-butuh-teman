import React from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';

export const UnitBerandaView: React.FC = () => {
  const { currentUser, units, tongList, listings, emptyTong, requestSecondTong, submitLaporan, setActiveRoute, saldoSekarang } = useApp();
  const [reportSuccess, setReportSuccess] = React.useState<boolean>(false);
  const [showHowToModal, setShowHowToModal] = React.useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  // Find active unit for the current user
  const currentUnit =
    units.find(u => u.id === currentUser?.unit_id) ||
    units.find(u => u.inisial === 'FTD') ||
    units[0];

  // Find assigned tongs for this unit
  const assignedTongs = tongList.filter(t => t.unit_id === currentUnit.id);
  const primaryTong = assignedTongs[0] || tongList[0];

  // Unit specific listings
  const unitListings = listings.filter(l => l.unit_id === currentUnit.id);

  // Unit stats calculations
  const totalUnitKg = currentUnit.total_kg_tersalurkan || 0;
  const totalUnitPoints = currentUnit.eco_points || 0;
  const estimasiUnitRupiah = saldoSekarang;
  const pohonSelamat = Math.round((totalUnitKg / 1000) * 17 * 10) / 10;
  const airTerhemat = Math.round(totalUnitKg * 26);

  // Tong capacity gauge
  const tongPercent = Math.min(
    100,
    Math.round((primaryTong.berat_kg / primaryTong.kapasitas_max_kg) * 100)
  );

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4 font-sans text-[#1A2E22]">
      
      {/* 1. Top User Profile Bar */}
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="w-11 h-11 rounded-full bg-[#D8F3DC] border border-[#2D6A4F]/20 flex items-center justify-center font-black text-[#2D6A4F] text-base shadow-xs overflow-hidden">
            {currentUser?.nama ? currentUser.nama.charAt(0) : currentUnit.inisial || 'U'}
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#52645A] tracking-tight">
              Halo, {currentUser?.nama || currentUnit.pic_nama} 👋
            </div>
            <h1 className="text-base font-extrabold text-[#1A2E22] tracking-tight leading-tight">
              {currentUnit.nama_unit}
            </h1>
          </div>
        </div>

        {/* Leaderboard button */}
        <button
          onClick={() => setActiveRoute('/leaderboard')}
          className="px-3 py-1.5 rounded-full bg-white border border-[#2D6A4F]/20 flex items-center gap-1.5 shadow-xs text-[#2D6A4F] text-xs font-bold hover:bg-[#D8F3DC] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-base text-amber-500">trophy</span>
          <span>Leaderboard</span>
        </button>
      </div>

      {/* 2. Summary Banner Card */}
      <div className="w-full rounded-[28px] p-6 text-white bg-[#2D6A4F] shadow-lg shadow-[#2D6A4F]/20 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-white/8 blur-xl pointer-events-none" />
        <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-white/8 blur-lg pointer-events-none" />

        {/* 4 Stat Highlights in Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center relative z-10">
          {/* Stat 1: Dana Rupiah Kas */}
          <div 
            onClick={() => setActiveRoute('/unit/dompet')}
            className="relative flex flex-col items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-xs cursor-pointer hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined absolute top-1.5 right-1.5 text-[14px] text-white/40">arrow_outward</span>
            <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
            <div className="text-lg font-black text-amber-200 tracking-tight leading-none">
              Rp {(estimasiUnitRupiah / 1000).toFixed(0)}k
            </div>
            <div className="text-[9px] uppercase font-extrabold text-white/80 tracking-wider mt-1">
              DANA TERHIMPUN
            </div>
          </div>

          {/* Stat 2: Total Kg */}
          <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-full bg-emerald-400/20 text-emerald-200 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[18px]">recycling</span>
            </div>
            <div className="text-lg font-black text-white tracking-tight leading-none">
              {totalUnitKg} <span className="text-xs font-semibold">Kg</span>
            </div>
            <div className="text-[9px] uppercase font-extrabold text-white/80 tracking-wider mt-1">
              TERDAUR ULANG
            </div>
          </div>

          {/* Stat 3: Eco-Points */}
          <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[18px] text-amber-200">monetization_on</span>
            </div>
            <div className="text-lg font-black text-white tracking-tight leading-none">
              {totalUnitPoints}
            </div>
            <div className="text-[9px] uppercase font-extrabold text-white/80 tracking-wider mt-1">
              ECO-POINTS
            </div>
          </div>

          {/* Stat 4: Pohon */}
          <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[18px] text-sky-200">forest</span>
            </div>
            <div className="text-lg font-black text-white tracking-tight leading-none">
              {pohonSelamat} <span className="text-xs font-semibold">Pohon</span>
            </div>
            <div className="text-[9px] uppercase font-extrabold text-white/80 tracking-wider mt-1">
              DISELAMATKAN
            </div>
          </div>
        </div>
      </div>

      {/* 3. Primary CTA Card: Setor Kertas */}
      <div className="bg-white rounded-[24px] p-5 shadow-xs border border-[#2D6A4F]/8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">add_box</span>
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#1A2E22]">Setor Kertas Baru</h2>
              <p className="text-[11px] font-medium text-[#52645A]">Penyaluran Sirkular Kertas Kampus</p>
            </div>
          </div>
          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-[#D8F3DC] text-[#2D6A4F]">
            Tong {primaryTong.nomor}
          </span>
        </div>

        {/* Tong Capacity Progress */}
        <div className="bg-[#F2F7F4] rounded-2xl p-3.5 space-y-2 border border-[#2D6A4F]/8">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#52645A] font-medium">Kapasitas Tong Unit Saat Ini</span>
            <span className="font-extrabold text-[#1A2E22]">{primaryTong.berat_kg} / {primaryTong.kapasitas_max_kg} Kg ({tongPercent}%)</span>
          </div>
          <div className="w-full bg-[#D8F3DC] rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                tongPercent > 80 ? 'bg-[#F4A261]' : 'bg-[#2D6A4F]'
              }`}
              style={{ width: `${Math.max(primaryTong.berat_kg > 0 ? 6 : 0, tongPercent)}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => setActiveRoute('/unit/setor-kertas')}
          className="w-full h-12 rounded-full bg-[#2D6A4F] hover:bg-[#1A4235] active:bg-[#0F2E22] text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Catat & Setor Kertas Sekarang</span>
        </button>
      </div>

      {/* 4. Kategori Sampah Kertas */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-extrabold text-[#1A2E22] tracking-tight">
            Kategori Sampah Kertas
          </h2>
          <span className="text-xs text-[#2D6A4F] font-bold">Terintegrasi</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Category 1: HVS */}
          <div
            onClick={() => { setSelectedCategory('HVS & Office Paper'); setShowHowToModal(true); }}
            className="bg-white rounded-2xl p-3.5 text-center shadow-xs border border-[#2D6A4F]/8 hover:border-[#2D6A4F]/30 cursor-pointer transition-all hover:shadow-md group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[26px]">description</span>
            </div>
            <div className="text-xs font-extrabold text-[#1A2E22] truncate">HVS & Office</div>
            <div className="text-[10px] text-[#52645A] font-medium mt-0.5">Kertas Putih</div>
          </div>

          {/* Category 2: Kardus */}
          <div
            onClick={() => { setSelectedCategory('Kardus & Packaging'); setShowHowToModal(true); }}
            className="bg-white rounded-2xl p-3.5 text-center shadow-xs border border-[#2D6A4F]/8 hover:border-[#F4A261]/40 cursor-pointer transition-all hover:shadow-md group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#F4A261]/10 text-[#C27D3A] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[26px]">inventory_2</span>
            </div>
            <div className="text-xs font-extrabold text-[#1A2E22] truncate">Kardus & Box</div>
            <div className="text-[10px] text-[#52645A] font-medium mt-0.5">Box Paket</div>
          </div>

          {/* Category 3: Arsip */}
          <div
            onClick={() => { setSelectedCategory('Arsip & Majalah'); setShowHowToModal(true); }}
            className="bg-white rounded-2xl p-3.5 text-center shadow-xs border border-[#2D6A4F]/8 hover:border-sky-300/50 cursor-pointer transition-all hover:shadow-md group"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[26px]">auto_stories</span>
            </div>
            <div className="text-xs font-extrabold text-[#1A2E22] truncate">Arsip & Dupleks</div>
            <div className="text-[10px] text-[#52645A] font-medium mt-0.5">Brosur & Buku</div>
          </div>
        </div>
      </div>

      {/* 5. Tips & Panduan */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-extrabold text-[#1A2E22] tracking-tight">
            Panduan & Tips Daur Ulang
          </h2>
          <button
            onClick={() => setShowHowToModal(true)}
            className="text-xs text-[#2D6A4F] hover:underline font-extrabold"
          >
            Lihat Semua
          </button>
        </div>

        {/* Tip Card 1 */}
        <div
          onClick={() => setShowHowToModal(true)}
          className="bg-white rounded-2xl p-4 shadow-xs border border-[#2D6A4F]/8 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">dry_cleaning</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-extrabold text-[#1A2E22] truncate">
              Pisahkan Kertas Kering & Bebas Minyak
            </h3>
            <p className="text-[11px] text-[#52645A] truncate mt-0.5 font-medium">
              Kertas basah merusak kualitas serat daur ulang pabrik.
            </p>
          </div>
          <span className="material-symbols-outlined text-[18px] text-[#8CA090] group-hover:text-[#2D6A4F] transition-colors">
            chevron_right
          </span>
        </div>

        {/* Tip Card 2 */}
        <div
          onClick={() => setActiveRoute('/leaderboard')}
          className="bg-white rounded-2xl p-4 shadow-xs border border-[#2D6A4F]/8 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">payments</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-extrabold text-[#1A2E22] truncate">
              Kompensasi Dana Kas Unit
            </h3>
            <p className="text-[11px] text-[#52645A] truncate mt-0.5 font-medium">
              Tiap Kg kertas disetor otomatis terkonversi rupiah untuk kas operasional.
            </p>
          </div>
          <span className="material-symbols-outlined text-[18px] text-[#8CA090] group-hover:text-[#2D6A4F] transition-colors">
            chevron_right
          </span>
        </div>
      </div>

      {/* 6. Daftar Penyetoran Kertas Aktif */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-extrabold text-[#1A2E22] tracking-tight">
            Daftar Penyetoran Kertas Aktif ({unitListings.length})
          </h2>
        </div>

        {unitListings.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-xs text-[#52645A] border border-[#2D6A4F]/8">
            Belum ada data penyetoran kertas. Mulai setor sekarang!
          </div>
        ) : (
          <div className="space-y-2">
            {unitListings.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 border border-[#2D6A4F]/8 flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#F2F7F4] text-[#2D6A4F] flex items-center justify-center shrink-0 font-bold text-xs border border-black/5">
                    <span className="material-symbols-outlined text-[18px]">description</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#1A2E22] truncate">
                      {item.kategori_label} • {item.jumlah_kg} Kg
                    </div>
                    <div className="text-[10px] text-[#52645A] font-medium truncate">
                      {item.tanggal_post} • {item.unit_nama}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ${
                    item.status === 'sudah_diambil'
                      ? 'bg-[#D8F3DC] text-[#2D6A4F]'
                      : item.status === 'siap_pickup'
                      ? 'bg-sky-50 text-sky-700'
                      : 'bg-[#F4A261]/15 text-[#C27D3A]'
                  }`}
                >
                  {item.status === 'sudah_diambil'
                    ? 'Selesai'
                    : item.status === 'siap_pickup'
                    ? 'Siap Pickup'
                    : 'Di Tong'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. How-To Modal */}
      {showHowToModal && (
        <div className="fixed inset-0 z-50 bg-[#1A2E22]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
            
            {/* Top Illustration Banner */}
            <div className="relative w-full h-48 bg-gradient-to-br from-[#D8F3DC] via-[#F2F7F4] to-[#FAFAF7] flex items-center justify-center overflow-hidden">
              <button
                onClick={() => { setShowHowToModal(false); setSelectedCategory(null); }}
                className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1A2E22] flex items-center justify-center shadow-sm backdrop-blur-md transition-all z-10"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>

              <div className="relative flex flex-col items-center">
                <div className="w-24 h-24 rounded-3xl bg-white shadow-xl border border-[#2D6A4F]/10 flex items-center justify-center relative">
                  <span className="material-symbols-outlined text-[54px] text-[#2D6A4F]">recycling</span>
                </div>
              </div>
            </div>

            {/* Sheet Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="text-center">
                <span className="text-[11px] font-extrabold text-[#2D6A4F] bg-[#D8F3DC] px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedCategory || 'Panduan Resmi Kampus'}
                </span>
                <h3 className="text-xl font-black text-[#1A2E22] tracking-tight mt-2">
                  Cara Daur Ulang Kertas Kampus
                </h3>
              </div>

              {/* Steps */}
              <div className="space-y-3.5 pt-2">
                {[
                  { step: 1, title: 'Pisahkan Jenis Kertas', desc: 'Bedakan kertas HVS putih office, kardus/box paket, dan majalah/arsip. Kertas bercampur lilin atau laminasi plastik tidak dapat didaur ulang.' },
                  { step: 2, title: 'Bebaskan dari Minyak & Staples Berlebih', desc: 'Pastikan kertas dalam kondisi kering. Basah atau bercak minyak mengkontaminasi seluruh batch bubur kertas di pabrik.' },
                  { step: 3, title: 'Masukkan ke Wadah Kertas Unit Anda', desc: `Kumpulkan kertas pada wadah unit Anda (Wadah ${primaryTong.nomor}) dalam keadaan terikat rapi.` },
                  { step: 4, title: 'Konversi Rupiah & Naikkan Peringkat', desc: 'Setiap penyetoran otomatis dihitung per Kg ke nilai Rupiah (Rp) kas unit serta menambah skor di papan leaderboard kampus.' }
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex items-start gap-3 bg-[#F2F7F4] p-3.5 rounded-2xl border border-[#2D6A4F]/8">
                    <div className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white font-black text-xs flex items-center justify-center shrink-0">
                      {step}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#1A2E22]">{title}</h4>
                      <p className="text-[11px] text-[#52645A] leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setShowHowToModal(false); setSelectedCategory(null); }}
                className="w-full py-3.5 rounded-full bg-[#2D6A4F] hover:bg-[#1A4235] text-white font-extrabold text-xs shadow-md transition-all"
              >
                Paham & Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
