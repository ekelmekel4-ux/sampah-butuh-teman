import React from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';

export const AuthGateView: React.FC = () => {
  const { setAuthStep } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF7] via-[#F2F7F4] to-[#D8F3DC]/30 text-[#1A2E22] flex flex-col justify-between p-4 sm:p-6 max-w-xl mx-auto select-none relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#2D6A4F]/6 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center pt-6 pb-4 relative z-10">
        <div className="inline-flex items-center justify-center p-3 rounded-3xl bg-white border border-[#2D6A4F]/15 shadow-md mb-4 ring-4 ring-[#2D6A4F]/5">
          <img src={APP_BRAND.logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2D6A4F] tracking-tight">
          Pilih Peran Ekosistem
        </h1>
        <p className="text-xs sm:text-sm text-[#52645A] font-medium mt-1.5 max-w-md mx-auto leading-relaxed">
          Akses portal sesuai peran Anda dalam menjalin sirkularitas sampah kertas di ekosistem kampus.
        </p>
      </div>

      {/* 3 Role Cards */}
      <div className="space-y-4 my-auto py-2 relative z-10">
        {/* Role 1: Penyalur */}
        <div className="bg-white rounded-2xl p-5 border border-[#2D6A4F]/15 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#2D6A4F]/40 group relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#2D6A4F] rounded-l-2xl" />
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-extrabold text-[#1A2E22] tracking-tight">
                  Penyalur (Unit Kampus)
                </h2>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#D8F3DC] text-[#2D6A4F] uppercase tracking-wider">
                  BEM / Unit
                </span>
              </div>
              <p className="text-xs text-[#52645A] mt-1 leading-relaxed font-medium">
                Untuk penanggung jawab unit (BEM, Fakultas, Biro, Prodi) yang menghasilkan limbah kertas dan mengelola tong terpadu.
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                <button
                  onClick={() => setAuthStep('login')}
                  className="flex-1 h-10 rounded-xl bg-[#2D6A4F] hover:bg-[#1A4235] active:bg-[#0F2E22] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Masuk Penyalur</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
                <button
                  onClick={() => setAuthStep('register-penyalur')}
                  className="px-3.5 h-10 rounded-xl border border-[#2D6A4F]/30 text-[#2D6A4F] hover:bg-[#D8F3DC] text-xs font-extrabold transition-all"
                >
                  Daftar Unit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Role 2: Penerima */}
        <div className="bg-white rounded-2xl p-5 border border-[#F4A261]/25 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#F4A261]/50 group relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#F4A261] rounded-l-2xl" />
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F4A261]/10 text-[#C27D3A] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                factory
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-extrabold text-[#1A2E22] tracking-tight">
                  Penerima (Mitra Industri)
                </h2>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#F4A261]/15 text-[#C27D3A] uppercase tracking-wider">
                  Pabrik Daur Ulang
                </span>
              </div>
              <p className="text-xs text-[#52645A] mt-1 leading-relaxed font-medium">
                Terbuka bagi industri & vendor daur ulang kertas yang membutuhkan pasokan limbah berkualitas dan terverifikasi.
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                <button
                  onClick={() => setAuthStep('login')}
                  className="flex-1 h-10 rounded-xl bg-[#C27D3A] hover:bg-[#A0632B] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Masuk Penerima</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
                <button
                  onClick={() => setAuthStep('register-penerima')}
                  className="px-3.5 h-10 rounded-xl border border-[#F4A261]/40 text-[#C27D3A] hover:bg-[#F4A261]/10 text-xs font-extrabold transition-all"
                >
                  Daftar Pabrik
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="text-center pt-2 pb-2 text-[11px] font-semibold text-[#52645A] relative z-10 flex items-center justify-center gap-1.5">
        <span className="material-symbols-outlined text-[14px] text-[#2D6A4F]">verified_user</span>
        <span>{APP_BRAND.subtitle} • Kampus Hijau</span>
      </div>
    </div>
  );
};
