import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';

export const Navbar: React.FC = () => {
  const { role, currentUser, logout, setActiveRoute } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const getRoleBadge = () => {
    switch (role) {
      case 'unit':
        return {
          label: 'Penyalur',
          bg: 'bg-[#2D6A4F] text-white',
          dot: 'bg-[#52B788]'
        };
      case 'perusahaan':
        return {
          label: 'Penerima',
          bg: 'bg-[#2D6A4F] text-white',
          dot: 'bg-[#52B788]'
        };
      case 'admin':
        return {
          label: 'Admin Sirkularitas',
          bg: 'bg-[#1A4235] text-white',
          dot: 'bg-[#52B788]'
        };
    }
  };

  const handleHomeClick = () => {
    if (role === 'unit') setActiveRoute('/unit/beranda');
    else if (role === 'perusahaan') setActiveRoute('/perusahaan/matching');
    else setActiveRoute('/admin/dashboard');
  };

  const badge = getRoleBadge();

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-transparent pt-safe">
        <div className="max-w-2xl mx-auto h-20 px-4 flex items-center justify-between gap-2 mt-2">
          {/* Brand Logo & Name */}
          <button
            onClick={handleHomeClick}
            className="flex items-center gap-2.5 min-w-0 text-left group overflow-hidden bg-white/80 hover:bg-white backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-[#2D6A4F]/10 transition-all"
          >
            <img
              src={APP_BRAND.logoUrl}
              alt="Sampah Butuh Teman Logo"
              className="h-8 w-8 object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col min-w-0 justify-center pr-1">
              <span className="text-[13px] font-black text-[#1A2E22] tracking-tight truncate leading-tight">
                {APP_BRAND.name}
              </span>
            </div>
          </button>

          {/* Right section: Role Badge + Profile Menu */}
          <div className="flex items-center gap-2 shrink-0 bg-white/60 backdrop-blur-md px-1.5 py-1.5 rounded-full border border-[#2D6A4F]/10">
            {/* Role Badge */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${badge.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
              <span>{badge.label}</span>
            </div>

            {/* User Profile Button */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 rounded-full transition-transform hover:scale-105 active:scale-95"
                title="Menu Pengguna"
              >
                <div className="w-9 h-9 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center font-bold text-xs">
                  {currentUser?.nama?.charAt(0) || 'U'}
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 origin-top-right border border-[#2D6A4F]/10">
                  <div className="px-3 py-3 bg-[#D8F3DC]/50 rounded-2xl mb-2">
                    <div className="text-[10px] font-black uppercase tracking-wider text-[#52645A] mb-1">
                      Akun Aktif
                    </div>
                    <div className="text-sm font-black text-[#1A2E22] truncate">
                      {currentUser?.nama || 'Pengguna'}
                    </div>
                    <div className="text-xs font-semibold text-[#52645A] truncate mb-3">
                      {currentUser?.email || '-'}
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${badge.bg}`}>
                      <span className={`w-1 h-1 rounded-full ${badge.dot}`} />
                      <span>{badge.label}</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    {role === 'perusahaan' && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setActiveRoute('/perusahaan/profil');
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#E5F6EB] text-xs font-black text-[#2D6A4F] hover:bg-[#D8F3DC] transition-colors mb-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">settings</span>
                        <span>Pengaturan Profil</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowConfirmLogout(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#2D6A4F] text-xs font-black text-white hover:bg-[#1A4235] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 z-50 bg-[#1A2E22]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full animate-in fade-in zoom-in-95 border border-[#2D6A4F]/15 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center mb-4 mx-auto">
              <span className="material-symbols-outlined text-[28px]">logout</span>
            </div>
            <h3 className="text-xl font-black text-[#1A2E22] text-center mb-1">Keluar Akun?</h3>
            <p className="text-xs font-medium text-[#52645A] text-center mb-6">
              Anda akan kembali ke halaman pemilih peran aplikasi.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="flex-1 h-12 rounded-full bg-[#F2F7F4] text-xs font-black text-[#1A2E22] border border-[#2D6A4F]/10 transition-transform hover:scale-105 active:scale-95"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowConfirmLogout(false);
                  logout();
                }}
                className="flex-1 h-12 rounded-full bg-[#2D6A4F] text-xs font-black text-white hover:bg-[#1A4235] transition-all hover:scale-105 active:scale-95"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
