import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_BRAND } from '../../data/initialData';

export const RegisterPenerimaView: React.FC = () => {
  const { registerPenerima, setAuthStep } = useApp();
  const [namaPt, setNamaPt] = useState('');
  const [nib, setNib] = useState('');
  const [dispatcherNama, setDispatcherNama] = useState('');
  const [kontakDispatcher, setKontakDispatcher] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alamat, setAlamat] = useState('');
  const [kota, setKota] = useState('');
  const [kodePos, setKodePos] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [agreeQc, setAgreeQc] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUseMyLocation = () => {
    setErrorMsg('');
    if (!('geolocation' in navigator)) {
      setErrorMsg('Perangkat ini tidak mendukung deteksi lokasi. Mohon isi titik koordinat secara manual.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setErrorMsg('Izin lokasi ditolak atau lokasi tidak tersedia. Mohon isi titik koordinat secara manual (contoh dari Google Maps).');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!agreeQc) {
      setErrorMsg('Harap setujui komitmen kepatuhan standar timbangan & verifikasi QC sirkularitas kampus.');
      return;
    }

    if (!namaPt || !nib || !email || !kontakDispatcher) {
      setErrorMsg('Mohon lengkapi seluruh formulir yang wajib.');
      return;
    }

    if (!alamat.trim()) {
      setErrorMsg('Mohon isi alamat lengkap perusahaan.');
      return;
    }
    if (!kota.trim()) {
      setErrorMsg('Mohon isi kota/kabupaten perusahaan.');
      return;
    }

    const latNum = parseFloat(lat.replace(',', '.'));
    const lngNum = parseFloat(lng.replace(',', '.'));
    if (!lat.trim() || !lng.trim() || Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      setErrorMsg('Mohon isi titik koordinat (latitude & longitude). Gunakan tombol "Gunakan Lokasi Saya" atau salin dari Google Maps.');
      return;
    }
    if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      setErrorMsg('Titik koordinat tidak valid. Latitude harus antara -90 sampai 90, longitude antara -180 sampai 180.');
      return;
    }

    const res = await registerPenerima({
      namaPt,
      nib,
      email,
      kontakDispatcher: `${kontakDispatcher} (${dispatcherNama || 'PIC'})`,
      alamat: alamat.trim(),
      kota: kota.trim(),
      kodePos: kodePos.trim(),
      koordinat: { lat: latNum, lng: lngNum }
    });

    if (!res.success) {
      setErrorMsg(res.message || 'Gagal mendaftar mitra industri.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1A2E22] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      {/* Back Button */}
      <div className="pt-2">
        <button
          onClick={() => setAuthStep('login-penerima')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52645A] hover:text-[#C27D3A] transition-colors px-3 py-1.5 rounded-full bg-white border border-[#F4A261]/20 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Masuk Penerima</span>
        </button>
      </div>

      {/* Main Registration Box */}
      <div className="my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4A261]/20 shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#F4A261]/10 text-[#C27D3A] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                domain_add
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C27D3A] bg-[#F4A261]/15 px-2 py-0.5 rounded-full">
                Registrasi Industri
              </span>
              <h1 className="text-xl font-black text-[#1A2E22] tracking-tight mt-0.5">
                Daftar Mitra Penerima
              </h1>
            </div>
          </div>

          <p className="text-xs text-[#52645A] mb-5 leading-relaxed">
            Terbuka untuk perusahaan & pabrik daur ulang kertas yang siap menyerap pasokan limbah
            kertas kampus secara rutin.
          </p>

          <a
            href={APP_BRAND.dropPointUtama.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buka lokasi Drop Point Kampus UPJ di Google Maps"
            className="mb-5 flex items-center gap-3 rounded-xl border border-[#C27D3A]/25 bg-[#FFF8EE] p-3.5 hover:border-[#C27D3A]/50 transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
          >
            <span className="w-9 h-9 rounded-lg bg-[#F4A261]/15 text-[#C27D3A] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[11px] font-bold text-[#1A2E22]">
                Lokasi pengambilan pasokan
              </span>
              <span className="block text-[11px] text-[#52645A] leading-snug mt-0.5">
                {APP_BRAND.dropPointUtama.nama} · ketuk untuk buka Google Maps
              </span>
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#C27D3A] shrink-0">
              open_in_new
            </span>
          </a>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#E76F51]/10 border border-[#E76F51]/30 text-[#B04030] text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Nama PT & NIB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-[#1A2E22] mb-1">
                  Nama Perusahaan / PT *
                </label>
                <input
                  type="text"
                  value={namaPt}
                  onChange={e => setNamaPt(e.target.value)}
                  required
                  placeholder="Contoh: PT Kertas Daur Semesta"
                  className="w-full h-10 px-3 rounded-xl border border-[#F4A261]/20 bg-[#F2F7F4] text-xs text-[#1A2E22] focus:bg-white focus:border-[#C27D3A] focus:ring-2 focus:ring-[#F4A261]/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A2E22] mb-1">
                  Nomor Induk Berusaha (NIB) *
                </label>
                <input
                  type="text"
                  value={nib}
                  onChange={e => setNib(e.target.value)}
                  required
                  placeholder="Contoh: 9120003451829"
                  className="w-full h-10 px-3 rounded-xl border border-[#F4A261]/20 bg-[#F2F7F4] text-xs text-[#1A2E22] focus:bg-white focus:border-[#C27D3A] outline-none transition-all"
                />
              </div>
            </div>

            {/* Nama Dispatcher & Kontak */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-[#1A2E22] mb-1">
                  Nama Koordinator / Dispatcher
                </label>
                <input
                  type="text"
                  value={dispatcherNama}
                  onChange={e => setDispatcherNama(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full h-10 px-3 rounded-xl border border-[#F4A261]/20 bg-[#F2F7F4] text-xs text-[#1A2E22] focus:bg-white focus:border-[#C27D3A] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A2E22] mb-1">
                  No. WhatsApp Dispatcher *
                </label>
                <input
                  type="tel"
                  value={kontakDispatcher}
                  onChange={e => setKontakDispatcher(e.target.value)}
                  required
                  placeholder="081987654321"
                  className="w-full h-10 px-3 rounded-xl border border-[#F4A261]/20 bg-[#F2F7F4] text-xs text-[#1A2E22] focus:bg-white focus:border-[#C27D3A] outline-none transition-all"
                />
              </div>
            </div>

            {/* Alamat & Titik Koordinat */}
            <div className="space-y-3 rounded-2xl border border-[#F4A261]/20 bg-[#FFF8EE] p-3.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#C27D3A]">location_on</span>
                <span className="text-xs font-bold text-[#1A2E22]">Alamat & Titik Koordinat Perusahaan</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A2E22] mb-1">
                  Alamat Lengkap *
                </label>
                <textarea
                  value={alamat}
                  onChange={e => setAlamat(e.target.value)}
                  required
                  rows={2}
                  placeholder="Contoh: Jl. Industri Daur Ulang No. 45, Kawasan Industri Surya Cipta"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#F4A261]/20 bg-white text-xs text-[#1A2E22] focus:border-[#C27D3A] focus:ring-2 focus:ring-[#F4A261]/20 outline-none transition-all resize-y"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#1A2E22] mb-1">
                    Kota/Kabupaten *
                  </label>
                  <input
                    type="text"
                    value={kota}
                    onChange={e => setKota(e.target.value)}
                    required
                    placeholder="Contoh: Tangerang Selatan"
                    className="w-full h-10 px-3 rounded-xl border border-[#F4A261]/20 bg-white text-xs text-[#1A2E22] focus:border-[#C27D3A] focus:ring-2 focus:ring-[#F4A261]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A2E22] mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={kodePos}
                    onChange={e => setKodePos(e.target.value)}
                    inputMode="numeric"
                    placeholder="Contoh: 15413"
                    className="w-full h-10 px-3 rounded-xl border border-[#F4A261]/20 bg-white text-xs text-[#1A2E22] focus:border-[#C27D3A] focus:ring-2 focus:ring-[#F4A261]/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A2E22] mb-1">
                  Titik Koordinat *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={lat}
                    onChange={e => setLat(e.target.value)}
                    required
                    inputMode="decimal"
                    placeholder="Latitude (-6.29...)"
                    aria-label="Latitude"
                    className="w-full h-10 px-3 rounded-xl border border-[#F4A261]/20 bg-white text-xs text-[#1A2E22] focus:border-[#C27D3A] focus:ring-2 focus:ring-[#F4A261]/20 outline-none transition-all"
                  />
                  <input
                    type="text"
                    value={lng}
                    onChange={e => setLng(e.target.value)}
                    required
                    inputMode="decimal"
                    placeholder="Longitude (106.72...)"
                    aria-label="Longitude"
                    className="w-full h-10 px-3 rounded-xl border border-[#F4A261]/20 bg-white text-xs text-[#1A2E22] focus:border-[#C27D3A] focus:ring-2 focus:ring-[#F4A261]/20 outline-none transition-all"
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    disabled={isLocating}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#C27D3A] hover:bg-[#A0632B] disabled:opacity-60 text-white px-3 py-1.5 text-[11px] font-bold transition-colors"
                  >
                    <span className={`material-symbols-outlined text-[15px] ${isLocating ? 'animate-spin' : ''}`}>
                      {isLocating ? 'progress_activity' : 'my_location'}
                    </span>
                    {isLocating ? 'Mendeteksi lokasi...' : 'Gunakan Lokasi Saya'}
                  </button>
                  {lat.trim() && lng.trim() && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat.trim()},${lng.trim()}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C27D3A] hover:underline"
                    >
                      <span className="material-symbols-outlined text-[14px]">map</span>
                      Lihat di Google Maps
                    </a>
                  )}
                </div>
                <p className="mt-1.5 text-[10px] text-[#52645A] leading-relaxed">
                  Titik ini dipakai untuk rute penjemputan armada. Buka Google Maps, klik kanan lokasi perusahaan, lalu salin koordinatnya.
                </p>
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-[#1A2E22] mb-1">
                  Email Perusahaan *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="logistik@perusahaan.co.id"
                  className="w-full h-10 px-3 rounded-xl border border-[#F4A261]/20 bg-[#F2F7F4] text-xs text-[#1A2E22] focus:bg-white focus:border-[#C27D3A] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A2E22] mb-1">
                  Kata Sandi *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-10 px-3 rounded-xl border border-[#F4A261]/20 bg-[#F2F7F4] text-xs text-[#1A2E22] focus:bg-white focus:border-[#C27D3A] outline-none transition-all"
                />
              </div>
            </div>

            {/* Agreement */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeQc}
                  onChange={e => setAgreeQc(e.target.checked)}
                  className="mt-0.5 accent-[#C27D3A]"
                />
                <span className="text-[11px] text-[#52645A] leading-relaxed">
                  Menyatakan kesiapan armada jemput berizin, penerbitan surat jalan resmi, dan pembayaran transparan atas pasokan terverifikasi.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#C27D3A] hover:bg-[#A0632B] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-3"
            >
              <span className="material-symbols-outlined text-[18px]">handshake</span>
              <span>Daftar Mitra & Mulai Terima Pasokan</span>
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-5 text-center text-xs text-[#52645A]">
            Sudah memiliki akun mitra?{' '}
            <button
              onClick={() => setAuthStep('login-penerima')}
              className="font-bold text-[#C27D3A] hover:underline"
            >
              Masuk di sini
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#8CA090] pb-2">
        Sampah Butuh Teman • Pendaftaran Mitra Industri
      </div>
    </div>
  );
};
