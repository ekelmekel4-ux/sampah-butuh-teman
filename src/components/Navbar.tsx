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
          label: 'Penyalur • Unit Kampus',
          bg: 'bg-[#176B4D]/10 text-[#176B4D] border-[#176B4D]/20',
          dot: 'bg-[#176B4D]'
        };
      case 'perusahaan':
        return {
          label: 'Penerima • Mitra Industri',
          bg: 'bg-[#8B6045]/10 text-[#8B6045] border-[#8B6045]/20',
          dot: 'bg-[#8B6045]'
        };
      case 'admin':
        return {
          label: 'Admin • Drop Point',
          bg: 'bg-gray-100 text-gray-800 border-gray-300',
          dot: 'bg-gray-800'
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
      <header className="fixed top-0 inset-x-0 z-40 bg-[#FDF9F0]/95 backdrop-blur-xl border-b border-[#176B4D]/10 shadow-[0_2px_12px_rgba(23,107,77,0.06)] pt-safe">
        <div className="max-w-2xl mx-auto h-16 px-4 flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <button
            onClick={handleHomeClick}
            className="flex items-center gap-2.5 min-w-0 text-left group"
          >
            <img
              src={APP_BRAND.logoUrl}
              alt="Sampah Butuh Teman Logo"
              className="h-9 w-9 object-contain shrink-0 drop-shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col min-w-0 justify-center">
              <span className="text-[17px] font-bold text-[#176B4D] tracking-tight truncate leading-tight">
                Sampah Butuh Teman
              </span>
              <span className="text-[10px] font-semibold text-[#8B6045] tracking-wider uppercase truncate leading-none mt-0.5">
                Drop Point Serbaguna Kampus
              </span>
            </div>
          </button>

          {/* Right section: Static Role Badge + Profile & Logout Menu */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Role Badge (Static, no switcher) */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
              <span>{badge.label}</span>
            </div>

            {/* User Profile Button with Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-full hover:bg-black/5 transition-colors border border-transparent hover:border-black/10"
                title="Menu Pengguna"
              >
                <div className="w-8 h-8 rounded-full bg-[#176B4D] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser?.nama?.charAt(0) || 'U'}
                </div>
                <span className="material-symbols-outlined text-[18px] text-gray-500">
                  expand_more
                </span>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2.5 border-b border-gray-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Akun Aktif
                    </div>
                    <div className="text-xs font-bold text-[#1C1C16] truncate mt-0.5">
                      {currentUser?.nama || 'Pengguna'}
                    </div>
                    <div className="text-[11px] text-[#57635A] truncate">
                      {currentUser?.email || '-'}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-700">
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      <span>{badge.label}</span>
                    </div>
                  </div>

                  <div className="pt-1.5">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowConfirmLogout(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Keluar dari Akun</span>
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[26px]">logout</span>
            </div>
            <h3 className="text-base font-bold text-[#1C1C16]">Konfirmasi Keluar</h3>
            <p className="text-xs text-[#57635A] mt-1.5 leading-relaxed">
              Apakah Anda yakin ingin keluar dari akun ini? Anda akan kembali ke halaman pemilihan peran.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="flex-1 h-10 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowConfirmLogout(false);
                  logout();
                }}
                className="flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition-colors shadow-xs"
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
