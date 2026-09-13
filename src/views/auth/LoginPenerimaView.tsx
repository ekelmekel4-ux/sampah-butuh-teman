import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const LoginPenerimaView: React.FC = () => {
  const { login, setAuthStep } = useApp();
  const [email, setEmail] = useState('logistik@daurlestari.co.id');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(email, 'perusahaan', password);
    if (!res.success) {
      setErrorMsg(res.message || 'Gagal masuk. Periksa kembali email Anda.');
    }
  };

  const handleDemoFill = () => {
    setEmail('logistik@daurlestari.co.id');
    setPassword('demo1234');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#1C1C16] flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto">
      {/* Top Bar Back */}
      <div className="pt-2">
        <button
          onClick={() => setAuthStep('gate')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57635A] hover:text-[#8B6045] transition-colors px-2 py-1 rounded-lg hover:bg-black/5"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Pilihan Akun</span>
        </button>
      </div>

      {/* Main Form Box */}
      <div className="my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#8B6045]/20 shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#8B6045]/10 text-[#8B6045] flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-[26px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                factory
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6045] bg-[#8B6045]/10 px-2 py-0.5 rounded-full">
                Akun Penerima
              </span>
              <h1 className="text-xl font-black text-[#1C1C16] tracking-tight mt-0.5">
                Masuk Mitra Industri
              </h1>
            </div>
          </div>

          <p className="text-xs text-[#57635A] mb-5 leading-relaxed">
            Portal bagi mitra pabrik pengolah kertas untuk matching pasokan limbah kampus, membuat kriteria kebutuhan, dan jadwalkan armada jemput.
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
                Email Perusahaan / Dispatcher
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
                  placeholder="logistik@perusahaan.co.id"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#8B6045] focus:ring-1 focus:ring-[#8B6045] outline-hidden transition-all"
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
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#8B6045] focus:ring-1 focus:ring-[#8B6045] outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Quick Demo Pill */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleDemoFill}
                className="w-full py-1.5 px-3 rounded-lg bg-[#8B6045]/10 text-[#8B6045] hover:bg-[#8B6045]/15 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>Gunakan Akun Demo (PT Mandiri Daur Lestari)</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#8B6045] hover:bg-[#6D4830] text-white font-bold text-xs shadow-md shadow-[#8B6045]/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Masuk Portal Industri</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </form>

          {/* Link to Register */}
          <div className="mt-6 text-center text-xs text-[#57635A]">
            Belum terdaftar sebagai mitra industri?{' '}
            <button
              onClick={() => setAuthStep('register-penerima')}
              className="font-bold text-[#8B6045] hover:underline"
            >
              Daftar Mitra Pabrik
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#6F7A73] pb-2">
        Kemitraan Daur Ulang Kertas • Drop Point Terpusat
      </div>
    </div>
  );
};
