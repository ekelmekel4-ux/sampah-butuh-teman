import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const UnitStatusView: React.FC = () => {
  const { currentUser, units, tongList, emptyTong, submitLaporan } = useApp();
  const currentUnit = units.find(u => u.id === currentUser?.unit_id) || units.find(u => u.inisial === 'FTD') || units[0];
  const assignedTong = tongList.find(t => t.unit_id === currentUnit.id) || tongList[0];

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Tong Penuh & Butuh Penjadwalan Cepat');
  const [reportDetail, setReportDetail] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [selectedReportTong, setSelectedReportTong] = useState(assignedTong);

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    submitLaporan({
      tongNama: selectedReportTong.nama_tong,
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
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4 font-sans text-[#1A2E22]">

      {/* Header Bar */}
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-[11px] font-bold text-[#52645A] tracking-tight">
              Status & Monitoring Unit
            </div>
            <h1 className="text-base font-extrabold text-[#1A2E22] tracking-tight leading-tight">
              Status Penyetoran & Tong
            </h1>
          </div>
        </div>

        <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20">
          Live Sync
        </span>
      </div>

      {/* Status Capacity Cards */}
      <div className="space-y-6">
        {tongList
          .filter(t => t.unit_id === currentUnit.id)
          .sort((a, b) => a.nomor.localeCompare(b.nomor))
          .map(tong => {
            const percentage = Math.min(100, Math.round((tong.berat_kg / tong.kapasitas_max_kg) * 100));
            return (
              <div key={tong.id} className="space-y-4">
                {/* Vibrant Green Header Banner */}
                <div className="w-full rounded-[28px] p-6 text-white bg-[#2D6A4F] shadow-md shadow-[#2D6A4F]/20 relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <span className="text-[10px] font-extrabold text-white/80 uppercase tracking-widest block">
                        STATUS WADAH FISIK TONG
                      </span>
                      <h2 className="text-xl font-black text-white leading-tight mt-0.5">
                        {tong.nama_tong} ({tong.nomor})
                      </h2>
                      <p className="text-xs text-white/90 mt-1 leading-relaxed font-medium">
                        Lokasi Wadah: {tong.lokasi_spesifik}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 ml-3">
                      <span className="material-symbols-outlined text-[28px] text-white">inventory_2</span>
                    </div>
                  </div>
                </div>

                {/* Status Capacity Card */}
                <div className="bg-white rounded-[24px] p-5 shadow-xs border border-black/5 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#52645A] font-medium">Akumulasi Berat di Tong Fisik</span>
                    <strong className="text-[#2D6A4F] font-extrabold">
                      {tong.berat_kg} / {tong.kapasitas_max_kg} Kg ({percentage}%)
                    </strong>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${percentage > 80 ? 'bg-amber-600' : 'bg-[#2D6A4F]'
                        }`}
                      style={{ width: `${Math.max(tong.berat_kg > 0 ? 5 : 0, percentage)}%` }}
                    />
                  </div>

                  <div className="p-3.5 bg-[#F5F6F3] rounded-2xl border border-black/5 flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2 text-[#52645A]">
                      <span className="material-symbols-outlined text-[18px] text-[#2D6A4F]">rule</span>
                      <span>Penjagaan Kuota Minimum Jemput: <strong>10 Kg</strong></span>
                    </div>
                    <span className={`font-extrabold ${tong.berat_kg >= 10 ? 'text-[#2D6A4F]' : 'text-amber-700'}`}>
                      {tong.berat_kg >= 10 ? '✅ Kuota Terpenuhi' : `Kurang ${10 - tong.berat_kg} Kg`}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setReportReason('Tong Penuh & Butuh Penjadwalan Cepat');
                        setSelectedReportTong(tong);
                        setShowReportModal(true);
                      }}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#F5F6F3] hover:bg-gray-200 text-[#1A2E22] border border-black/5 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-[18px] text-amber-700">report_problem</span>
                      <span>Laporkan Kendala Wadah</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => emptyTong(tong.id)}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#2D6A4F] hover:bg-[#1A4235] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer whitespace-nowrap"
                      title="Simulasi penjemputan pabrik (Reset 0 Kg)"
                    >
                      <span className="material-symbols-outlined text-[18px]">refresh</span>
                      <span>Pengosongan Wadah (Reset 0 Kg)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-extrabold text-[#1A2E22] text-center">Laporkan Kendala Tong</h3>

            <form onSubmit={handleReport} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#52645A] block mb-1">Alasan</label>
                <select
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/5 bg-[#F5F6F3] text-xs font-bold text-[#1A2E22]"
                >
                  <option>Tong Penuh & Butuh Penjadwalan Cepat</option>
                  <option>Tong Rusak / Engsel Macet</option>
                  <option>Timbangan Digital Tidak Terkoneksi</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#52645A] block mb-1">Detail Tambahan</label>
                <textarea
                  rows={3}
                  value={reportDetail}
                  onChange={e => setReportDetail(e.target.value)}
                  placeholder="Catatan detail untuk admin drop point..."
                  className="w-full p-2.5 rounded-xl border border-black/5 bg-[#F5F6F3] text-xs font-medium text-[#1A2E22]"
                />
              </div>

              {reportSuccess && (
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold text-center">
                  Laporan berhasil dikirim ke Admin!
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-2.5 rounded-full bg-[#F5F6F3] text-xs font-bold text-[#52645A]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#2D6A4F] hover:bg-[#1A4235] text-xs font-bold text-white shadow-xs"
                >
                  Kirim Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
