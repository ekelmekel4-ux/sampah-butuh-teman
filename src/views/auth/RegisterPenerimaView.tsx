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
      setErrorMsg('Harap setujui komitmen kepatuhan standar timbangan & verifikasi QC sirkularitas kampus.');
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
            Terbuka untuk perusahaan & pabrik daur ulang kertas yang siap menyerap pasokan limbah kertas kampus secara rutin.
          </p>

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
