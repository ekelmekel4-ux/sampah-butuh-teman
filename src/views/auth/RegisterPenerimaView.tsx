import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const RegisterPenerimaView: React.FC = () => {
  const { registerPenerima, setAuthStep } = useApp();
  const [namaPt, setNamaPt] = useState('');
  const [nib, setNib] = useState('');
  const [dispatcherNama, setDispatcherNama] = useState('');
  const [kontakDispatcher, setKontakDispatcher] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeQc, setAgreeQc] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!agreeQc) {
      setErrorMsg('Harap setujui komitmen kepatuhan standar timbangan & verifikasi QC drop point.');
      return;
    }

    if (!namaPt || !nib || !email || !kontakDispatcher) {
      setErrorMsg('Mohon lengkapi seluruh formulir yang wajib.');
      return;
    }

    const res = registerPenerima({
      namaPt,
      nib,
      email,
      kontakDispatcher: `${kontakDispatcher} (${dispatcherNama || 'PIC'})`
    });

    if (!res.success) {
      setErrorMsg(res.message || 'Gagal mendaftar mitra industri.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#1C1C16] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      {/* Top Bar Back */}
      <div className="pt-2">
        <button
          onClick={() => setAuthStep('login-penerima')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57635A] hover:text-[#8B6045] transition-colors px-2 py-1 rounded-lg hover:bg-black/5"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Masuk Penerima</span>
        </button>
      </div>

      {/* Main Registration Box */}
      <div className="my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#8B6045]/20 shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#8B6045]/10 text-[#8B6045] flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-[26px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                domain_add
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6045] bg-[#8B6045]/10 px-2 py-0.5 rounded-full">
                Registrasi Industri
              </span>
              <h1 className="text-xl font-black text-[#1C1C16] tracking-tight mt-0.5">
                Daftar Mitra Penerima
              </h1>
            </div>
          </div>

          <p className="text-xs text-[#57635A] mb-5 leading-relaxed">
            Terbuka untuk perusahaan & pabrik daur ulang kertas yang siap menyerap pasokan limbah kertas kampus secara rutin.
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Nama PT & NIB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-[#1C1C16] mb-1">
                  Nama Perusahaan / PT *
                </label>
                <input
                  type="text"
                  value={namaPt}
                  onChange={e => setNamaPt(e.target.value)}
                  required
                  placeholder="Contoh: PT Kertas Daur Semesta"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#8B6045] outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1C1C16] mb-1">
                  Nomor Induk Berusaha (NIB) *
                </label>
                <input
                  type="text"
                  value={nib}
                  onChange={e => setNib(e.target.value)}
                  required
                  placeholder="Contoh: 9120003451829"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#8B6045] outline-hidden"
                />
              </div>
            </div>

            {/* Nama Dispatcher & Kontak */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-[#1C1C16] mb-1">
                  Nama Koordinator / Dispatcher
                </label>
                <input
                  type="text"
                  value={dispatcherNama}
                  onChange={e => setDispatcherNama(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#8B6045] outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1C1C16] mb-1">
                  No. WhatsApp Dispatcher *
                </label>
                <input
                  type="tel"
                  value={kontakDispatcher}
                  onChange={e => setKontakDispatcher(e.target.value)}
                  required
                  placeholder="081987654321"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#8B6045] outline-hidden"
                />
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-[#1C1C16] mb-1">
                  Email Perusahaan *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="logistik@perusahaan.co.id"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#8B6045] outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1C1C16] mb-1">
                  Kata Sandi *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#8B6045] outline-hidden"
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
                  className="mt-0.5 rounded-sm border-gray-300 text-[#8B6045] focus:ring-[#8B6045]"
                />
                <span className="text-[11px] text-[#57635A] leading-relaxed">
                  Menyatakan kesiapan armada jemput berizin, penerbitan surat jalan resmi, dan pembayaran transparan atas pasokan terverifikasi.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#8B6045] hover:bg-[#6D4830] text-white font-bold text-xs shadow-md shadow-[#8B6045]/20 transition-all flex items-center justify-center gap-2 mt-3"
            >
              <span className="material-symbols-outlined text-[18px]">handshake</span>
              <span>Daftar Mitra & Mulai Terima Pasokan</span>
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-5 text-center text-xs text-[#57635A]">
            Sudah memiliki akun mitra?{' '}
            <button
              onClick={() => setAuthStep('login-penerima')}
              className="font-bold text-[#8B6045] hover:underline"
            >
              Masuk di sini
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#6F7A73] pb-2">
        Sampah Butuh Teman • Pendaftaran Mitra Industri
      </div>
    </div>
  );
};
