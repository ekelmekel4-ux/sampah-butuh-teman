import React from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';

export const AuthGateView: React.FC = () => {
  const { setAuthStep } = useApp();

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#1C1C16] flex flex-col justify-between p-4 sm:p-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center pt-4 pb-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#176B4D]/10 text-[#176B4D] mb-3">
          <img
            src={APP_BRAND.logoUrl}
            alt="Logo"
            className="w-10 h-10 object-contain drop-shadow-xs"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#176B4D] tracking-tight">
          Pilih Jenis Akun
        </h1>
        <p className="text-xs sm:text-sm text-[#57635A] mt-1 max-w-md mx-auto">
          Aplikasi terpisah sesuai kewenangan dan peran sirkularitas Anda di ekosistem kampus.
        </p>
      </div>

      {/* 3 Role Cards */}
      <div className="space-y-3.5 my-auto py-4">
        {/* Role 1: Penyalur (Unit Kampus) */}
        <div className="bg-white rounded-2xl p-5 border border-[#176B4D]/15 shadow-sm hover:shadow-md transition-all hover:border-[#176B4D]/40 group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#176B4D]/10 text-[#176B4D] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-[#1C1C16] tracking-tight">
                  Penyalur (Unit Kampus)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#176B4D]/10 text-[#176B4D]">
                  BEM / Unit
                </span>
              </div>
              <p className="text-xs text-[#57635A] mt-1 leading-relaxed">
                Untuk penanggung jawab/admin unit (BEM, Fakultas, Biro, Prodi, Lab) yang mengelola pengumpulan sampah kertas.
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                <button
                  onClick={() => setAuthStep('login-penyalur')}
                  className="flex-1 h-10 rounded-xl bg-[#176B4D] hover:bg-[#0E4632] text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Masuk Penyalur</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
                <button
                  onClick={() => setAuthStep('register-penyalur')}
                  className="px-3.5 h-10 rounded-xl border border-[#176B4D]/30 text-[#176B4D] hover:bg-[#176B4D]/5 text-xs font-semibold transition-colors"
                >
                  Daftar Unit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Role 2: Penerima (Mitra Industri / Pabrik) */}
        <div className="bg-white rounded-2xl p-5 border border-[#8B6045]/20 shadow-sm hover:shadow-md transition-all hover:border-[#8B6045]/50 group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#8B6045]/10 text-[#8B6045] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                factory
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-[#1C1C16] tracking-tight">
                  Penerima (Mitra Industri)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B6045]/10 text-[#8B6045]">
                  Pabrik / Daur Ulang
                </span>
              </div>
              <p className="text-xs text-[#57635A] mt-1 leading-relaxed">
                Terbuka bagi industri & vendor daur ulang kertas yang memerlukan suplai kontinu limbah terverifikasi.
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                <button
                  onClick={() => setAuthStep('login-penerima')}
                  className="flex-1 h-10 rounded-xl bg-[#8B6045] hover:bg-[#6D4830] text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Masuk Penerima</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
                <button
                  onClick={() => setAuthStep('register-penerima')}
                  className="px-3.5 h-10 rounded-xl border border-[#8B6045]/30 text-[#8B6045] hover:bg-[#8B6045]/5 text-xs font-semibold transition-colors"
                >
                  Daftar Pabrik
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Role 3: Admin (Drop Point & Sistem) */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-gray-400 group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                admin_panel_settings
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-[#1C1C16] tracking-tight">
                  Admin Drop Point
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  Pengelola Pusat
                </span>
              </div>
              <p className="text-xs text-[#57635A] mt-1 leading-relaxed">
                Khusus pengelola logistik kampus, drop point Gedung Serbaguna, timbangan digital, dan master unit.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setAuthStep('login-admin')}
                  className="w-full h-10 rounded-xl bg-gray-800 hover:bg-black text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Masuk Panel Admin</span>
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center pt-2 pb-2 text-[11px] text-[#6F7A73]">
        {APP_BRAND.subtitle} • Kampus Hijau
      </div>
    </div>
  );
};
