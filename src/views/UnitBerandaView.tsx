import React from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';

export const UnitBerandaView: React.FC = () => {
  const { currentUser, units, tongList, listings, emptyTong, requestSecondTong, submitLaporan, setActiveRoute } = useApp();
  const [reportSuccess, setReportSuccess] = React.useState<boolean>(false);

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
  const recentListings = unitListings.slice(0, 4);

  // Unit stats calculations
  const totalUnitKg = currentUnit.total_kg_tersalurkan || 0;
  const totalUnitPoints = currentUnit.eco_points || 0;
  const estimasiDana = totalUnitKg * 1500;
  const pohonSelamat = Math.round((totalUnitKg / 1000) * 17 * 10) / 10;
  const airTerhemat = Math.round(totalUnitKg * 26);

  // Tong capacity gauge
  const tongPercent = Math.min(
    100,
    Math.round((primaryTong.berat_kg / primaryTong.kapasitas_max_kg) * 100)
  );

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4">
      {/* 1. Header Greeting & Unit Badge */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#176B4D]/10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#176B4D] text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-lg">
              {currentUnit.inisial || 'UNT'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#176B4D]/10 text-[#176B4D]">
                  Penyalur Terverifikasi
                </span>
                <span className="text-[10px] font-semibold text-[#8B6045] bg-[#8B6045]/10 px-2 py-0.5 rounded-full">
                  {currentUnit.jenis.toUpperCase()}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-[#1C1C16] truncate mt-0.5">
                {currentUnit.nama_unit}
              </h1>
              <p className="text-xs text-[#57635A] truncate">
                PIC: {currentUser?.nama || currentUnit.pic_nama} • Kontak: {currentUnit.kontak_pic}
              </p>
            </div>
          </div>
        </div>

        {/* Drop point banner note */}
        <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#57635A]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#176B4D]">
              pin_drop
            </span>
            <span className="truncate">{APP_BRAND.dropPointUtama.nama}</span>
          </div>
          <span className="text-[11px] font-bold text-[#176B4D] shrink-0">
            {primaryTong.nomor}
          </span>
        </div>
      </div>

      {/* 2. Hero CTA Card: Setor Kertas */}
      <div className="w-full rounded-3xl p-6 text-white bg-gradient-to-br from-[#176B4D] to-[#0E4632] shadow-xl relative overflow-hidden">
        {/* Decorative blur elements */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-white/5 blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
              <span className="material-symbols-outlined text-[15px]">eco</span>
              <span>Sirkularitas Limbah Kertas</span>
            </div>
            <div className="text-[11px] font-medium text-white/80 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-xs shrink-0">
              Terisi: {primaryTong.berat_kg} Kg
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              Ada Sampah Kertas Siap Disalurkan?
            </h2>
            <p className="text-xs sm:text-sm text-white/85 mt-1 leading-relaxed">
              Catat dan setorkan kertas ke wadah tong unit Anda di drop point serbaguna. Terkoneksi langsung dengan mitra pabrik daur ulang!
            </p>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => setActiveRoute('/unit/setor-kertas')}
            className="w-full h-12 rounded-2xl bg-[#E8F8F0] hover:bg-white text-[#0E4632] font-black text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Setor Kertas Sekarang</span>
          </button>
        </div>
      </div>

      {/* 3. Status Tong Unit (Quick Live Status) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#176B4D]/10 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#8B6045]/10 text-[#8B6045] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8B6045] uppercase tracking-wider block">
                Wadah Tong Fisik Unit
              </span>
              <h3 className="text-sm font-bold text-[#1C1C16]">
                {primaryTong.nama_tong} ({primaryTong.nomor})
              </h3>
            </div>
          </div>
          {primaryTong.berat_kg === 0 ? (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
              Wadah Kosong (0 Kg)
            </span>
          ) : primaryTong.berat_kg < 10 ? (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">hourglass_top</span>
              <span>Mengumpulkan ({primaryTong.berat_kg}/10 Kg)</span>
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">check_circle</span>
              <span>Siap Dijemput ({primaryTong.berat_kg} Kg)</span>
            </span>
          )}
        </div>

        {/* Meter bar & Kuota Minimum Guard */}
        <div className="space-y-1.5 pt-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-1">
            <span className="text-[#57635A]">Akumulasi Berat di Tong Fisik</span>
            <strong className="text-[#176B4D]">
              {primaryTong.berat_kg} / {primaryTong.kapasitas_max_kg} Kg ({tongPercent}%)
            </strong>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                tongPercent > 80
                  ? 'bg-[#8B6045]'
                  : primaryTong.berat_kg >= 10
                  ? 'bg-[#176B4D]'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.max(primaryTong.berat_kg > 0 ? 5 : 0, tongPercent)}%` }}
            />
          </div>
        </div>

        {/* Quota requirement notice */}
        <div className="p-2.5 rounded-xl bg-[#F5F1E8] border border-[#176B4D]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] gap-2">
          <div className="flex items-center gap-1.5 text-[#57635A]">
            <span className="material-symbols-outlined text-[15px] text-[#176B4D]">
              rule
            </span>
            <span>Penjagaan Kuota Jemput: <strong>Min. 10 Kg</strong></span>
          </div>
          <span className={`font-bold ${primaryTong.berat_kg >= 10 ? 'text-[#176B4D]' : 'text-amber-700'}`}>
            {primaryTong.berat_kg >= 10
              ? '✅ Kuota Terpenuhi'
              : `Kurang ${10 - primaryTong.berat_kg} Kg lagi`}
          </span>
        </div>

        {/* If Tong Reaches 120 Kg (Full Capacity Guard) */}
        {primaryTong.berat_kg >= primaryTong.kapasitas_max_kg && (
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-xs text-rose-700 uppercase tracking-wide">
              <span className="material-symbols-outlined text-[20px] text-rose-600 animate-pulse">
                warning
              </span>
              <span>Kapasitas Penuh (120/120 Kg) — Butuh Pengosongan Segera</span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              Wadah tong telah mencapai batas fisik 120 Kg. Tong otomatis diprioritaskan di sistem mitra pabrik daur ulang untuk segera dijemput ke Gedung Serbaguna.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  submitLaporan({
                    tongNama: primaryTong.nama_tong,
                    unitNama: currentUnit.nama_unit,
                    alasan: 'Tong Penuh (120 Kg) Butuh Penjemputan Cepat',
                    detail: 'Wadah mencapai kapasitas maksimal 120 Kg di Gedung Serbaguna. Mohon armada pabrik segera menjemput.',
                    level: 'kritis'
                  });
                  setReportSuccess(true);
                  setTimeout(() => setReportSuccess(false), 3000);
                }}
                className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                <span>Kirim Notifikasi Prioritas ke Pabrik</span>
              </button>

              <button
                type="button"
                onClick={() => emptyTong(primaryTong.id)}
                className="w-full sm:w-auto py-2 px-3 rounded-xl bg-white border border-rose-300 hover:bg-rose-100 text-rose-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                title="Simulasi armada pabrik selesai mengosongkan tong"
              >
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                <span>Simulasi Pengosongan (Reset ke 0 Kg)</span>
              </button>
            </div>

            {reportSuccess && (
              <div className="p-2 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Notifikasi penjemputan urgent terkirim ke admin drop point dan dispatcher pabrik!</span>
              </div>
            )}
          </div>
        )}

        {/* If unit has only 1 tong, provide shortcut to activate Tong No. 2 */}
        {assignedTongs.length < 2 && (
          <button
            type="button"
            onClick={() => requestSecondTong(currentUnit.id)}
            className="w-full py-2 px-3 rounded-xl border border-dashed border-[#176B4D]/30 hover:border-[#176B4D] bg-[#176B4D]/5 text-[#176B4D] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Buka / Aktifkan Wadah Cadangan (Tong {currentUnit.inisial} No. 2)</span>
          </button>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
          <span className="text-[#57635A] text-[11px]">
            Lokasi: {primaryTong.lokasi_spesifik}
          </span>
          <button
            onClick={() => setActiveRoute('/unit/status')}
            className="text-[11px] font-bold text-[#176B4D] hover:underline flex items-center gap-1"
          >
            <span>Detail Status</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* 4. Rekam Jejak & Dampak Lingkungan Unit */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#176B4D]/10 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1C1C16] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#176B4D] text-[18px]">
              analytics
            </span>
            <span>Dampak & Kontribusi Unit</span>
          </h3>
          <button
            onClick={() => setActiveRoute('/leaderboard')}
            className="text-xs font-bold text-[#176B4D] hover:underline flex items-center gap-0.5"
          >
            <span>Lihat Peringkat</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#F5F1E8] rounded-2xl p-3 border border-[#176B4D]/10">
            <div className="text-[11px] text-[#57635A]">Total Kertas Disalurkan</div>
            <div className="text-xl font-black text-[#176B4D] mt-0.5">
              {totalUnitKg} <span className="text-xs font-bold">Kg</span>
            </div>
            <div className="text-[10px] text-[#8B6045] mt-1 font-semibold">
              ≈ Rp {estimasiDana.toLocaleString('id-ID')} Dana Riset
            </div>
          </div>

          <div className="bg-[#F5F1E8] rounded-2xl p-3 border border-[#176B4D]/10">
            <div className="text-[11px] text-[#57635A]">Eco-Points Unit</div>
            <div className="text-xl font-black text-[#8B6045] mt-0.5">
              {totalUnitPoints} <span className="text-xs font-bold">Pts</span>
            </div>
            <div className="text-[10px] text-[#176B4D] mt-1 font-semibold">
              Terverifikasi Otomatis
            </div>
          </div>

          <div className="bg-[#F5F1E8] rounded-2xl p-3 border border-[#176B4D]/10">
            <div className="text-[11px] text-[#57635A]">Pohon Terselamatkan</div>
            <div className="text-base font-bold text-[#1C1C16] mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[#176B4D] text-[18px]">
                park
              </span>
              <span>{pohonSelamat} Pohon</span>
            </div>
          </div>

          <div className="bg-[#F5F1E8] rounded-2xl p-3 border border-[#176B4D]/10">
            <div className="text-[11px] text-[#57635A]">Air Bersih Terhemat</div>
            <div className="text-base font-bold text-[#1C1C16] mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[#176B4D] text-[18px]">
                water_drop
              </span>
              <span>{airTerhemat.toLocaleString('id-ID')} Liter</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Riwayat Penyetoran Kertas Terakhir */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#176B4D]/10 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[#1C1C16] flex items-center gap-1.5 min-w-0">
            <span className="material-symbols-outlined text-[#8B6045] text-[18px]">
              history
            </span>
            <span>Riwayat Penyetoran Terakhir</span>
          </h3>
          <span className="text-xs text-[#57635A]">
            {unitListings.length} Total Penyetoran
          </span>
        </div>

        {recentListings.length > 0 ? (
          <div className="space-y-2.5">
            {recentListings.map(listing => (
              <div
                key={listing.id}
                className="p-3 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-200 shrink-0 border border-gray-100">
                    <img
                      src={listing.foto}
                      alt={listing.kategori_label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#1C1C16] truncate">
                      {listing.jumlah_kg} Kg • {listing.kategori_label}
                    </div>
                    <div className="text-[10px] text-[#57635A] truncate mt-0.5">
                      {listing.tong_nama} • {listing.tanggal_post}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      listing.status === 'sudah_diambil'
                        ? 'bg-emerald-100 text-emerald-800'
                        : listing.status === 'siap_pickup'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {listing.status === 'sudah_diambil'
                      ? 'Diambil Pabrik'
                      : listing.status === 'siap_pickup'
                      ? 'Siap Pickup'
                      : 'Menunggu Mitra'}
                  </span>
                  <div className="text-[10px] text-[#176B4D] font-bold mt-1">
                    +{listing.jumlah_kg * 2} Pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 px-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200">
            <span className="material-symbols-outlined text-[36px] text-gray-400 mb-1">
              post_add
            </span>
            <div className="text-xs font-bold text-gray-700">Belum Ada Setoran Kertas</div>
            <p className="text-[11px] text-gray-500 mt-0.5 mb-3">
              Mulai salurkan limbah kertas dari kantor atau gedung unit Anda hari ini.
            </p>
            <button
              onClick={() => setActiveRoute('/unit/setor-kertas')}
              className="px-4 py-2 rounded-xl bg-[#176B4D] hover:bg-[#0E4632] text-white text-xs font-bold transition-colors"
            >
              Setor Sekarang
            </button>
          </div>
        )}
      </div>

      {/* 6. Panduan Pemilahan Kertas (Best Practices) */}
      <div className="bg-[#FAF7F0] rounded-3xl p-5 border border-[#8B6045]/20 space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#8B6045] text-[20px]">
            tips_and_updates
          </span>
          <h3 className="text-xs font-bold text-[#1C1C16] uppercase tracking-wide">
            Panduan Pemilahan Kertas Bersih
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-white rounded-2xl p-3 border border-[#8B6045]/15 shadow-2xs">
            <div className="font-bold text-[#1C1C16] flex items-center gap-1 mb-1">
              <span className="material-symbols-outlined text-[16px] text-[#176B4D]">
                check_circle
              </span>
              <span>Tanpa Logam</span>
            </div>
            <p className="text-[11px] text-[#57635A] leading-relaxed">
              Lepaskan binder klip tebal & staples besar sebelum disetor.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-[#8B6045]/15 shadow-2xs">
            <div className="font-bold text-[#1C1C16] flex items-center gap-1 mb-1">
              <span className="material-symbols-outlined text-[16px] text-[#176B4D]">
                check_circle
              </span>
              <span>Bebas Minyak</span>
            </div>
            <p className="text-[11px] text-[#57635A] leading-relaxed">
              Hindari kertas bekas kemasan berminyak / basah makanan.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-[#8B6045]/15 shadow-2xs">
            <div className="font-bold text-[#1C1C16] flex items-center gap-1 mb-1">
              <span className="material-symbols-outlined text-[16px] text-[#176B4D]">
                check_circle
              </span>
              <span>Terikat Rapi</span>
            </div>
            <p className="text-[11px] text-[#57635A] leading-relaxed">
              Kardus dilipat pipih dan kertas HVS diikat tali per bundel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
