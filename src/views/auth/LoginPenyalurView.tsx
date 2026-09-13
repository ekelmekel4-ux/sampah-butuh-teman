import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const LoginPenyalurView: React.FC = () => {
  const { login, setAuthStep } = useApp();
  const [email, setEmail] = useState('penyalur@ft.univ.ac.id');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(email, 'unit', password);
    if (!res.success) {
      setErrorMsg(res.message || 'Gagal masuk. Periksa kembali email Anda.');
    }
  };

  const handleDemoFill = () => {
    setEmail('penyalur@ft.univ.ac.id');
    setPassword('demo1234');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#1C1C16] flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto">
      {/* Top Bar Back */}
      <div className="pt-2">
        <button
          onClick={() => setAuthStep('gate')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57635A] hover:text-[#176B4D] transition-colors px-2 py-1 rounded-lg hover:bg-black/5"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Pilihan Akun</span>
        </button>
      </div>

      {/* Main Form Box */}
      <div className="my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#176B4D]/15 shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#176B4D]/10 text-[#176B4D] flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-[26px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B4D] bg-[#176B4D]/10 px-2 py-0.5 rounded-full">
                Akun Penyalur
              </span>
              <h1 className="text-xl font-black text-[#1C1C16] tracking-tight mt-0.5">
                Masuk Unit Kampus
              </h1>
            </div>
          </div>

          <p className="text-xs text-[#57635A] mb-5 leading-relaxed">
            Akses khusus penanggung jawab unit kampus (BEM, Fakultas, Biro, Prodi) untuk posting limbah & pantau tong.
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1C16] mb-1.5">
                Email Institusi Kampus
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="nama.unit@univ.ac.id"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#176B4D] focus:ring-1 focus:ring-[#176B4D] outline-hidden transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C16] mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                  lock
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#176B4D] focus:ring-1 focus:ring-[#176B4D] outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Quick Demo Pill */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleDemoFill}
                className="w-full py-1.5 px-3 rounded-lg bg-[#176B4D]/5 text-[#176B4D] hover:bg-[#176B4D]/10 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>Gunakan Akun Demo (FTD - Dr. Hendra)</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#176B4D] hover:bg-[#0E4632] text-white font-bold text-xs shadow-md shadow-[#176B4D]/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Masuk ke Dashboard Unit</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </form>

          {/* SSO Kampus Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-gray-400 bg-white px-2">
              atau
            </div>
          </div>

          {/* SSO Button */}
          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full h-11 rounded-xl border border-gray-200 hover:bg-gray-50 text-[#1C1C16] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] text-[#176B4D]">school</span>
            <span>Masuk dengan SSO Kampus Hijau</span>
          </button>

          {/* Link to Register */}
          <div className="mt-6 text-center text-xs text-[#57635A]">
            Belum mendaftarkan unit Anda?{' '}
            <button
              onClick={() => setAuthStep('register-penyalur')}
              className="font-bold text-[#176B4D] hover:underline"
            >
              Daftar Unit Baru
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#6F7A73] pb-2">
        Sistem Sirkular Limbah Kertas • Kampus Hijau
      </div>
    </div>
  );
};
