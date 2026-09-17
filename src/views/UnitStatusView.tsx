import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const UnitStatusView: React.FC = () => {
  const { units, tongList, listings, emptyTong, setActiveRoute, submitLaporan } = useApp();
  const currentUnit = units.find(u => u.inisial === 'FTD') || units[0];
  const assignedTong = tongList.find(t => t.unit_id === currentUnit.id) || tongList[0];

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Tong Penuh & Butuh Penjadwalan Cepat');
  const [reportDetail, setReportDetail] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const percentage = Math.min(100, Math.round((assignedTong.berat_kg / assignedTong.kapasitas_max_kg) * 100));

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    submitLaporan({
      tongNama: assignedTong.nama_tong,
      unitNama: currentUnit.nama_unit,
      alasan: reportReason,
      detail: reportDetail || 'Permintaan pengecekan fisik tong di Gedung Serbaguna.',
      level: 'sedang'
    });
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setShowReportModal(false);
    }, 1500);
  };

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[#8B6045] uppercase tracking-wider block">
              STATUS FISIK TONG
            </span>
            <h2 className="text-lg font-bold text-[#1C1C16]">
              {assignedTong.nama_tong}
            </h2>
          </div>
          {assignedTong.berat_kg === 0 ? (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ECE8DF] text-[#57635A]">
              Kosong / Standby
            </span>
          ) : assignedTong.berat_kg < 10 ? (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
              <span>Mengumpulkan ({assignedTong.berat_kg}/10 Kg)</span>
            </span>
          ) : (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFDBC8] text-[#8B6045] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>Siap Dijemput ({assignedTong.berat_kg} Kg)</span>
            </span>
          )}
        </div>

        <div className="p-3 bg-[#F7F3EA] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs text-[#57635A] block">Lokasi Tong Fisik</span>
            <strong className="text-xs text-[#1C1C16]">
              {assignedTong.lokasi_spesifik}
            </strong>
          </div>
          <span className="material-symbols-outlined text-2xl text-[#176B4D]">
            pin_drop
          </span>
        </div>

        {/* Capacity Meter */}
        <div className="space-y-1.5 pt-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-1">
            <span className="text-[#57635A]">Akumulasi Berat Kertas di Tong</span>
            <strong className="text-[#005138]">
              {assignedTong.berat_kg} / {assignedTong.kapasitas_max_kg} Kg ({percentage}%)
            </strong>
          </div>
          <div className="w-full bg-[#E6E2D9] rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentage > 80 ? 'bg-[#8B6045]' : assignedTong.berat_kg >= 10 ? 'bg-[#176B4D]' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.max(assignedTong.berat_kg > 0 ? 5 : 0, percentage)}%` }}
            ></div>
          </div>
        </div>

        {/* Quota Minimum Guard */}
        <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#8B6045]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
          <div className="flex items-start sm:items-center gap-2">
            <span className="material-symbols-outlined text-[#8B6045] text-[18px]">
              verified
            </span>
            <div>
              <span className="text-[10px] text-gray-500 block uppercase font-bold">
                Penjagaan Kuota Penjemputan
              </span>
              <span className="font-bold text-[#1C1C16]">Minimal 10 Kg Terakumulasi</span>
            </div>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
            assignedTong.berat_kg >= 10
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {assignedTong.berat_kg >= 10
              ? 'Kuota Terpenuhi'
              : `Kurang ${10 - assignedTong.berat_kg} Kg`}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-[10px] text-gray-500 block">Tipe Kertas Dominan</span>
            <span className="font-bold text-[#1C1C16]">{assignedTong.tipe_kertas || 'HVS Arsip'}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-[10px] text-gray-500 block">Estimasi Jadwal Pick-up</span>
            <span className="font-bold text-[#176B4D]">{assignedTong.jadwal_pickup || 'Hari ini, 14:30 WIB'}</span>
          </div>
        </div>

        {/* If Tong is Full (120 Kg) */}
        {assignedTong.berat_kg >= assignedTong.kapasitas_max_kg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-rose-700">
              <span className="material-symbols-outlined text-rose-600 text-base">warning</span>
              <span>Wadah Telah Penuh ({assignedTong.kapasitas_max_kg} Kg)</span>
            </div>
            <p className="text-[11px] text-rose-800 leading-relaxed">
              Kapasitas maksimal telah tercapai. Tong ini otomatis diprioritaskan di sistem mitra pabrik daur ulang untuk segera dijemput.
            </p>
            <button
              onClick={() => emptyTong(assignedTong.id)}
              className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              <span>Simulasi Armada Jemput (Kosongkan Tong ke 0 Kg)</span>
            </button>
          </div>
        )}

        <div className="pt-2 flex gap-2">
          <button
            onClick={() => setActiveRoute('/unit/setor-kertas')}
            disabled={assignedTong.berat_kg >= assignedTong.kapasitas_max_kg}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#176B4D] hover:bg-[#005138] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>{assignedTong.berat_kg >= assignedTong.kapasitas_max_kg ? 'Tong Penuh' : 'Setor Kertas Baru'}</span>
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            className="py-2.5 px-3 rounded-xl bg-white hover:bg-gray-50 text-[#8B6045] border border-[#8B6045]/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-base">flag</span>
            <span>Lapor Masalah</span>
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 space-y-3 shadow-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100">
              <h3 className="font-bold text-sm text-[#1C1C16]">Lapor Masalah Tong Fisik</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReport} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Pilih Kendala</label>
                <select
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none"
                >
                  <option>Tong Penuh & Butuh Penjadwalan Cepat</option>
                  <option>Terdeteksi Kontaminasi Sampah Lain</option>
                  <option>Tali Pengikat Rusak / Berserakan</option>
                  <option>Engsel / Fisik Tong Rusak</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Keterangan Tambahan</label>
                <textarea
                  rows={3}
                  value={reportDetail}
                  onChange={e => setReportDetail(e.target.value)}
                  placeholder="Jelaskan kondisi tong secara spesifik..."
                  className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-2 rounded-lg bg-gray-100 font-semibold text-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-[#8B6045] hover:bg-[#633E25] font-bold text-white shadow-xs"
                >
                  Kirim Laporan
                </button>
              </div>
            </form>

            {reportSuccess && (
              <p className="text-center text-[#157140] font-bold text-xs pt-1">
                Laporan berhasil dikirim ke Admin Pusat!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
