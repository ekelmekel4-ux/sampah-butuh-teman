import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';

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
  const [armadaId, setArmadaId] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

    schedulePickup(matching.id, formatted, jamWib);
    setSubmitted(true);

    setTimeout(() => {
      setActiveRoute('/perusahaan/riwayat');
    }, 2000);
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
            className="mt-2 px-4 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-sm font-bold hover:bg-[#005138] transition-all"
          >
            Kembali ke Matching
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#2D6A4F] to-[#005138] text-white rounded-2xl p-4 shadow-md space-y-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl text-[#9CF2B5]">event_available</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CF2B5]">
            Jadwal Pengambilan
          </span>
        </div>
        <h1 className="text-lg font-extrabold leading-tight">
          Pilih Tanggal & Jam Pengambilan
        </h1>
        <p className="text-xs text-white/80">
          Setelah dijadwalkan, armada Anda tinggal datang ke nomor tong yang tertera.
        </p>
      </div>

      {/* Info Kertas yang Akan Diambil */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#2D6A4F]/10 space-y-3">
        <h2 className="text-sm font-bold text-[#1A2E22] flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-[#2D6A4F]">inventory_2</span>
          Detail Kertas yang Akan Diambil
        </h2>

        <div className="p-3 bg-[#F7F3EA] rounded-xl space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#52645A]">ID Transaksi:</span>
            <strong className="text-[#2D6A4F] font-mono">#{matching.id}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#52645A]">Unit Asal:</span>
            <strong className="text-[#1A2E22]">{matching.unit_nama}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#52645A]">Nomor Tong:</span>
            <span className="font-extrabold text-[#C27D3A] bg-[#FFDBC8] px-2.5 py-0.5 rounded-full text-[11px]">
              {matching.tong_nama}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#52645A]">Jenis & Berat:</span>
            <strong className="text-[#1A2E22]">{matching.jenis_kertas}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#52645A]">Nilai Estimasi:</span>
            <strong className="text-[#C27D3A]">Rp {matching.nilai_rupiah.toLocaleString('id-ID')}</strong>
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

      {/* Form Jadwal */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 shadow-sm border border-[#2D6A4F]/10 space-y-4">
          <h2 className="text-sm font-bold text-[#1A2E22] flex items-center gap-2">
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
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-[#F7F3EA] outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]/20 text-sm font-semibold text-[#1A2E22] transition-all"
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
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-[#F7F3EA] outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]/20 text-sm font-semibold text-[#1A2E22] transition-all"
              />
            </div>
            <p className="text-[10px] text-[#52645A]">
              Jam operasional drop point: 08:00 — 16:00 WIB (Senin–Jumat)
            </p>
          </div>

          {/* Info Tong */}
          <div className="p-3 bg-[#A4F3CC]/20 border border-[#2D6A4F]/20 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#A4F3CC] flex items-center justify-center text-[#005138] font-extrabold text-sm shrink-0">
              {matching.unit_id.slice(5, 8).toUpperCase()}
            </div>
            <div className="text-xs">
              <span className="block font-bold text-[#1A2E22]">Tuju langsung ke: {matching.tong_nama}</span>
              <span className="text-[#52645A]">Posisi tong ditandai dengan label unit pada denah drop point</span>
            </div>
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
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-[#F7F3EA] outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]/20 text-sm font-semibold text-[#1A2E22] transition-all appearance-none"
              >
                <option value="">Pilih armada dari profil...</option>
                <option value="1">B 9821 PQL (Pak Joko Susilo)</option>
                <option value="2">D 8122 XZ (Kang Maman)</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#52645A] text-base pointer-events-none">
                expand_more
              </span>
            </div>
            <p className="text-[10px] text-[#52645A]">Data diambil dari pengaturan Profil Perusahaan.</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-[#005138] hover:bg-[#2D6A4F] active:scale-[0.98] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              event_available
            </span>
            <span>Konfirmasi Jadwal Pengambilan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRoute('/perusahaan/matching')}
            className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#52645A] font-semibold text-sm transition-all"
          >
            Batal, Kembali ke Matching
          </button>
        </form>
      ) : (
        /* Success State */
        <div className="bg-[#2D6A4F] text-white rounded-2xl p-5 shadow-lg space-y-3 animate-in zoom-in-95">
          <div className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-3xl text-[#9CF2B5]" style={{ fontVariationSettings: "'FILL' 1" }}>
              task_alt
            </span>
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-base font-extrabold">Jadwal Berhasil Dibuat!</h3>
            <p className="text-xs text-white/80">
              Armada Anda dijadwalkan pada{' '}
              <strong className="text-[#9CF2B5]">
                {new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}, {jam} WIB
              </strong>
            </p>
            <p className="text-xs text-white/70 mt-1">
              Tuju <strong className="text-white">{matching.tong_nama}</strong> saat tiba di drop point.
            </p>
          </div>
          <div className="text-center text-xs text-[#9CF2B5] font-semibold animate-pulse">
            Mengalihkan ke Riwayat Transaksi...
          </div>
        </div>
      )}
    </div>
  );
};
