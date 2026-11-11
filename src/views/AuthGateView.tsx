import React from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';

type RoleCard = {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  accentColor: string;
  accentBg: string;
  onLogin: () => void;
  onRegister: () => void;
  loginLabel: string;
  registerLabel: string;
};

export const AuthGateView: React.FC = () => {
  const { setAuthStep } = useApp();

  const roles: RoleCard[] = [
    {
      title: 'Unit Kampus',
      subtitle: 'Penyalur',
      description:
        'Untuk penanggung jawab unit (BEM, Fakultas, Biro, Prodi) yang menghasilkan limbah kertas dan mengelola tong terpadu.',
      icon: 'account_balance',
      accentColor: '#2D6A4F',
      accentBg: '#D8F3DC',
      onLogin: () => setAuthStep('login'),
      onRegister: () => setAuthStep('register-penyalur'),
      loginLabel: 'Masuk',
      registerLabel: 'Daftar unit baru',
    },
    {
      title: 'Mitra Industri',
      subtitle: 'Penerima',
      description:
        'Untuk perusahaan & vendor daur ulang kertas yang membutuhkan pasokan limbah berkualitas dan terverifikasi dari kampus.',
      icon: 'factory',
      accentColor: '#92400E',
      accentBg: '#FEF3C7',
      onLogin: () => setAuthStep('login'),
      onRegister: () => setAuthStep('register-penerima'),
      loginLabel: 'Masuk',
      registerLabel: 'Daftar perusahaan',
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FAFAF7]"
      style={{ maxWidth: '480px', margin: '0 auto' }}
    >
      {/* ─── Header ─────────────────────────── */}
      <div className="px-5 pt-12 pb-8">
        <div className="flex items-center gap-2 mb-8">
          <img src={APP_BRAND.logoUrl} alt="" aria-hidden className="h-6 w-6 object-contain" />
          <span className="text-[13px] font-bold text-[#1A2E22] tracking-tight">{APP_BRAND.name}</span>
        </div>

        <h1 className="text-[28px] font-bold text-[#1A2E22] tracking-[-0.03em] leading-[1.15] mb-2">
          Pilih Peran<br />
          <span className="text-[#2D6A4F]">Ekosistem</span>
        </h1>
        <p className="text-[13px] text-[#52645A] leading-relaxed">
          Akses portal sesuai peran Anda dalam sirkularitas limbah kertas kampus.
        </p>
      </div>

      {/* ─── Role Cards ─────────────────────── */}
      <div className="flex-1 px-5 space-y-3">
        {roles.map((role, i) => (
          <div
            key={i}
            className="bg-white border border-[#E3DDCF] rounded-[14px] overflow-hidden"
            style={{ boxShadow: '0 1px 3px rgba(20,30,24,0.06)' }}
          >
            {/* Card header with icon */}
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-start gap-4 mb-3">
                {/* Icon square */}
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{ background: role.accentBg }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: '22px',
                      color: role.accentColor,
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    {role.icon}
                  </span>
                </div>

                {/* Title block */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h2 className="text-[15px] font-bold text-[#1A2E22] tracking-tight">{role.title}</h2>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: role.accentBg, color: role.accentColor }}
                    >
                      {role.subtitle}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#52645A] leading-relaxed">{role.description}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#E6EADD]" />
            </div>

            {/* Actions */}
            <div className="px-5 pb-5 flex items-center gap-2.5">
              <button
                onClick={role.onLogin}
                className="flex-1 h-10 rounded-[10px] text-[13px] font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
                style={{ background: role.accentColor }}
              >
                {role.loginLabel}
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
              <button
                onClick={role.onRegister}
                className="px-4 h-10 rounded-[10px] text-[13px] font-medium text-[#52645A] border border-[#CFC9B8] hover:border-[#8CA090] hover:bg-[#FAFAF7] transition-colors"
              >
                {role.registerLabel}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Footer ─────────────────────────── */}
      <div className="px-5 py-6 flex items-center justify-center gap-1.5">
        <span className="material-symbols-outlined text-[14px] text-[#2D6A4F]">verified_user</span>
        <span className="text-[11px] text-[#8CA090]">{APP_BRAND.subtitle}</span>
      </div>
    </div>
  );
};
