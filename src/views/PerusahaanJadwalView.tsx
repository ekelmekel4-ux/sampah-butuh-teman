import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';
import { PaymentModal } from '../components/PaymentModal';

export const PerusahaanJadwalView: React.FC = () => {
  const {
    matchings,
    selectedMatchingId,
    schedulePickup,
    setActiveRoute,
  } = useApp();

  const matching = matchings.find(m => m.id === selectedMatchingId) || matchings.find(m => m.status === 'menunggu_diambil') || null;

  // Tanggal minimal = hari ini
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const [tanggal, setTanggal] = useState<string>(todayStr);
  const [jam, setJam] = useState<string>('14:00');
  const [armadaId, setArmadaId] = useState<string>('1');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const armadaMap: Record<string, { nopol: string; driver: string }> = {
    '1': { nopol: 'B 9821 PQL', driver: 'Pak Joko Susilo' },
    '2': { nopol: 'D 8122 XZ', driver: 'Kang Maman' },
  };

  const selectedArmada = armadaMap[armadaId] || armadaMap['1'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matching) {
      setErrorMsg('Tidak ada data matching yang dipilih. Kembali ke halaman matching untuk memilih.');
      return;
    }
    if (!tanggal || !jam || !armadaId) {
      setErrorMsg('Pilih tanggal, jam, dan armada terlebih dahulu.');
      return;
    }

    // Format tanggal untuk display
    const dateObj = new Date(tanggal);
    const formatted = dateObj.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const jamWib = `${jam} WIB`;

    schedulePickup(matching.id, formatted, jamWib, selectedArmada.nopol, selectedArmada.driver);
    setSubmitted(true);
  };

  if (!matching) {
    return (
      <div className="w-full pb-20 max-w-xl mx-auto space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 text-center space-y-3">
          <span className="material-symbols-outlined text-4xl text-red-400">error_outline</span>
          <h2 className="text-base font-bold text-[#1A2E22]">Tidak Ada Matching yang Dipilih</h2>
          <p className="text-sm text-[#52645A]">
            Silakan kembali ke halaman Matching dan pilih listing yang ingin dijadwalkan.
          </p>
          <button
            onClick={() => setActiveRoute('/perusahaan/matching')}
            className="mt-2 px-4 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-sm font-bold hover:bg-[#005138] transition-all cursor-pointer"
          >
            Kembali ke Matching
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4 font-sans text-[#1A2E22]">

      {/* Header */}
      <div className="bg-[#174630] text-white rounded-[24px] p-5 shadow-md space-y-1 border border-[#52B788]/30">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl text-[#A7F3D0]">event_available</span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A7F3D0]">
            Jadwal Pengambilan Kertas
          </span>
        </div>
        <h1 className="text-lg font-black tracking-tight leading-tight">
          Pilih Tanggal & Jam Pengambilan
        </h1>
        <p className="text-xs text-white/80">
          Setelah jadwal ditetapkan, armada Anda tinggal datang ke tong yang tertera dan Anda dapat melanjutkan pembayaran ke dompet unit.
        </p>
      </div>

      {/* Info Kertas yang Akan Diambil */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#2D6A4F]/10 space-y-3">
        <h2 className="text-sm font-bold text-[#1A2E22] flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-[#2D6A4F]">inventory_2</span>
          Detail Kertas yang Akan Diambil
        </h2>

        <div className="p-3 bg-[#FAFAF7] rounded-xl space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#52645A]">ID Transaksi:</span>
            <strong className="text-[#2D6A4F] font-mono">#{matching.id}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#52645A]">Unit Penyalur:</span>
            <strong className="text-[#1A2E22]">{matching.unit_nama}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#52645A]">Nomor Tong:</span>
            <span className="font-extrabold text-[#174630] bg-[#D8F3DC] px-2.5 py-0.5 rounded-full text-[11px]">
              {matching.tong_nama}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#52645A]">Jenis & Berat:</span>
            <strong className="text-[#1A2E22]">{matching.jenis_kertas}</strong>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-1.5">
            <span className="text-[#52645A]">Nilai Pembayaran:</span>
            <strong className="text-[#174630] text-sm font-black">
              Rp {matching.nilai_rupiah.toLocaleString('id-ID')}
            </strong>
          </div>
        </div>
      </div>

      {/* Lokasi Drop Point */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#2D6A4F]/10">
        <div className="relative h-32 w-full bg-gray-100">
          <img
            src={APP_BRAND.dropPointUtama.mapImg}
            alt="Denah Drop Point"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
            <div>
              <span className="text-white text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[#9CF2B5] text-sm">location_on</span>
                {APP_BRAND.dropPointUtama.lokasiSingkat}
              </span>
              <p className="text-white/70 text-[10px] mt-0.5">{APP_BRAND.dropPointUtama.deskripsi}</p>
            </div>
          </div>
        </div>
        <div className="p-3 text-xs text-[#52645A] flex justify-between items-center">
          <span>Ramp truk 6-roda & timbangan digital siap pakai</span>
          <span className="text-[#2D6A4F] font-bold">Akses Gerbang Barat</span>
        </div>
      </div>

      {/* Form Jadwal vs Success State */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm border border-[#2D6A4F]/10 space-y-4">
          <h2 className="text-sm font-black text-[#1A2E22] flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#2D6A4F]">calendar_month</span>
            Atur Jadwal Kedatangan Armada
          </h2>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1A2E22] block">
              Tanggal Pengambilan
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#2D6A4F] text-base pointer-events-none">
                calendar_today
              </span>
              <input
                type="date"
                value={tanggal}
                min={todayStr}
                onChange={e => setTanggal(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-[#FAFAF7] outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]/20 text-sm font-semibold text-[#1A2E22] transition-all"
              />
            </div>
          </div>

          {/* Time Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1A2E22] block">
              Jam Kedatangan
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#2D6A4F] text-base pointer-events-none">
                schedule
              </span>
              <input
                type="time"
                value={jam}
                min="08:00"
                max="16:00"
                onChange={e => setJam(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-[#FAFAF7] outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]/20 text-sm font-semibold text-[#1A2E22] transition-all"
              />
            </div>
            <p className="text-[10px] text-[#52645A]">
              Jam operasional drop point: 08:00 — 16:00 WIB (Senin–Jumat)
            </p>
          </div>

          {/* Armada Info & Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1A2E22] block">
              Pilih Armada & Driver
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#2D6A4F] text-base pointer-events-none">
                local_shipping
              </span>
              <select
                value={armadaId}
                onChange={e => setArmadaId(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-[#FAFAF7] outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]/20 text-sm font-semibold text-[#1A2E22] transition-all appearance-none"
              >
                <option value="1">B 9821 PQL (Pak Joko Susilo)</option>
                <option value="2">D 8122 XZ (Kang Maman)</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#52645A] text-base pointer-events-none">
                expand_more
              </span>
            </div>
            <p className="text-[10px] text-[#52645A]">Data diambil dari pengaturan Armada Perusahaan.</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-[#174630] hover:bg-[#2D6A4F] active:scale-[0.98] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              event_available
            </span>
            <span>Konfirmasi Jadwal Pengambilan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRoute('/perusahaan/matching')}
            className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#52645A] font-semibold text-xs transition-all cursor-pointer"
          >
            Batal, Kembali ke Matching
          </button>
        </form>
      ) : (
        /* Actionable Success State with Direct Payment Option */
        <div className="bg-white border border-[#2D6A4F]/20 rounded-[28px] p-6 shadow-xl space-y-4 animate-in zoom-in-95">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#D8F3DC] text-[#174630] flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              task_alt
            </span>
          </div>

          <div className="text-center space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#005138] bg-[#D8F3DC] px-2.5 py-0.5 rounded-full">
              Jadwal Terkonfirmasi
            </span>
            <h3 className="text-base font-black text-[#174630] pt-1">
              Jadwal Penjemputan Berhasil Dibuat!
            </h3>
            <p className="text-xs text-[#52645A] max-w-sm mx-auto leading-relaxed">
              Jadwal kini aktif dan dapat Anda pantau di <strong>Tab Riwayat</strong>. Anda bisa langsung melakukan pembayaran ke dompet unit sekarang atau membayarnya nanti di Tab Riwayat.
            </p>
          </div>

          {/* Ringkasan Konfirmasi */}
          <div className="p-4 rounded-2xl bg-[#F7F8F5] border border-[#E0E5E2] space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#52645A]">Waktu Penjemputan:</span>
              <strong className="text-[#1A2E22]">
                {new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}, {jam} WIB
              </strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#52645A]">Armada & Driver:</span>
              <strong className="text-[#1A2E22]">{selectedArmada.nopol} ({selectedArmada.driver})</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#52645A]">Unit Penyalur:</span>
              <strong className="text-[#174630]">{matching.unit_nama}</strong>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#E0E5E2]">
              <span className="text-[#52645A] font-bold">Total Pembayaran:</span>
              <strong className="text-base font-black text-[#174630]">
                Rp {matching.nilai_rupiah.toLocaleString('id-ID')}
              </strong>
            </div>
          </div>

          {/* Action Buttons: Bayar Sekarang vs Lihat di Riwayat */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-[#174630] hover:bg-[#2D6A4F] active:scale-[0.98] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">payments</span>
              <span>Bayar Sekarang ke Dompet Unit (Rp {matching.nilai_rupiah.toLocaleString('id-ID')})</span>
            </button>

            <button
              onClick={() => setActiveRoute('/perusahaan/riwayat')}
              className="w-full py-2.5 px-4 rounded-xl border border-[#2D6A4F]/25 text-[#174630] hover:bg-[#F7F8F5] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">receipt_long</span>
              <span>Lihat di Tab Riwayat Penjemputan</span>
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          matching={matching}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setActiveRoute('/perusahaan/riwayat');
          }}
        />
      )}
    </div>
  );
};
