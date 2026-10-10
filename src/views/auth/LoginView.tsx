import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const LoginView: React.FC = () => {
  const { login, setAuthStep } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(email, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Gagal masuk. Periksa kembali email Anda.');
    }
  };

  const fillDemo = (role: 'unit' | 'perusahaan' | 'admin') => {
    if (role === 'unit') {
      setEmail('penyalur@ft.univ.ac.id');
      setPassword('demo1234');
    } else if (role === 'perusahaan') {
      setEmail('mitra@pt-mdl.com');
      setPassword('demo1234');
    } else {
      setEmail('admin.kampushijau@univ.ac.id');
      setPassword('demo1234');
    }
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1A2E22] flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto font-sans select-none">
      {/* Back Button */}
      <div className="pt-2">
        <button
          onClick={() => setAuthStep('gate')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#52645A] hover:text-[#2D6A4F] transition-colors px-3 py-1.5 rounded-full bg-white border border-[#2D6A4F]/10 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Pilihan Akun</span>
        </button>
      </div>

      {/* Main Form Box */}
      <div className="my-auto py-6">
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#2D6A4F]/10 shadow-xl space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                login
              </span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F] bg-[#D8F3DC] px-2.5 py-0.5 rounded-full">
                Portal Utama
              </span>
              <h1 className="text-xl font-black text-[#1A2E22] tracking-tight mt-1">
                Masuk Ekosistem
              </h1>
            </div>
          </div>

          <p className="text-xs text-[#52645A] font-medium leading-relaxed">
            Sistem akan otomatis mendeteksi peran Anda (Unit Kampus, Mitra Industri, atau Admin) berdasarkan email.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-extrabold text-[#1A2E22] block mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                className="w-full h-12 px-4 rounded-2xl bg-[#F2F7F4] border border-[#2D6A4F]/15 text-xs font-bold text-[#1A2E22] outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#1A2E22] block mb-1">
                Kata Sandi
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 px-4 rounded-2xl bg-[#F2F7F4] border border-[#2D6A4F]/15 text-xs font-bold text-[#1A2E22] outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15 transition-all"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-[#E76F51]/10 border border-[#E76F51]/30 text-[#B04030] text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-base shrink-0">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#2D6A4F] hover:bg-[#1A4235] active:bg-[#0F2E22] text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Masuk Sekarang</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          {/* Demo Shortcuts */}
          <div className="pt-3 border-t border-[#2D6A4F]/8 text-center flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-[#8CA090] uppercase tracking-wider mb-1">Akses Cepat Demo</p>
            <button type="button" onClick={() => fillDemo('unit')} className="text-xs font-extrabold text-[#2D6A4F] hover:underline">
              ⚡ Isi Demo: Unit Kampus
            </button>
            <button type="button" onClick={() => fillDemo('perusahaan')} className="text-xs font-extrabold text-[#F4A261] hover:underline">
              ⚡ Isi Demo: Mitra Industri
            </button>
            <button type="button" onClick={() => fillDemo('admin')} className="text-xs font-extrabold text-[#1A2E22] hover:underline">
              ⚡ Isi Demo: Admin
            </button>
          </div>
        </div>

      </div>

      <div className="text-center pb-2 text-[11px] font-semibold text-[#8CA090]">
        Sampah Butuh Teman • Kampus Hijau
      </div>
    </div>
  );
};
