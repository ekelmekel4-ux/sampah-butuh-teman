import React from 'react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeRoute, setActiveRoute, role } = useApp();

  const getNavItems = () => {
    switch (role) {
      case 'unit':
        return [
          {
            route: '/unit/beranda',
            label: 'Beranda',
            icon: 'home',
            isActive:
              activeRoute === '/unit/beranda' ||
              activeRoute === '/unit/posting-baru' ||
              activeRoute === '/unit/dompet' ||
              activeRoute === '/unit/profil',
          },
          {
            route: '/unit/status',
            label: 'Status Tong',
            icon: 'inventory_2',
            // Halaman setor kertas bagian dari alur tong, jadi tab Status Tong tetap aktif.
            isActive: activeRoute === '/unit/status' || activeRoute === '/unit/setor-kertas',
          },
          {
            route: '/unit/riwayat',
            label: 'Riwayat',
            icon: 'history',
            isActive: activeRoute === '/unit/riwayat',
          },
          {
            route: '/leaderboard',
            label: 'Peringkat',
            icon: 'leaderboard',
            isActive: activeRoute === '/leaderboard',
          },
        ];

      case 'perusahaan':
        return [
          {
            route: '/perusahaan/dashboard',
            label: 'Pasokan',
            icon: 'recycling',
            isActive:
              activeRoute === '/perusahaan/dashboard' ||
              activeRoute === '/perusahaan/pasokan' ||
              activeRoute === '/perusahaan/matching' ||
              activeRoute === '/perusahaan/jadwal' ||
              activeRoute === '/perusahaan/listing-detail',
          },
          {
            route: '/perusahaan/permintaan-baru',
            label: 'Kebutuhan',
            icon: 'request_quote',
            isActive: activeRoute === '/perusahaan/permintaan-baru',
          },
          {
            route: '/perusahaan/riwayat',
            label: 'Riwayat',
            icon: 'history',
            isActive: activeRoute === '/perusahaan/riwayat',
          },
        ];

      case 'admin':
        return [
          {
            route: '/admin/dashboard',
            label: 'Dashboard',
            icon: 'analytics',
            isActive: activeRoute === '/admin/dashboard',
          },
          {
            route: '/admin/unit-tong',
            label: 'Unit & Tong',
            icon: 'inventory_2',
            isActive: activeRoute === '/admin/unit-tong',
          },
          {
            route: '/admin/laporan',
            label: 'Laporan',
            icon: 'flag',
            isActive: activeRoute === '/admin/laporan',
          },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();
  // Palet navigasi mengikuti peran: mitra = coklat/amber seperti form registrasi
  const isMitra = role === 'perusahaan';

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 pb-safe pointer-events-none"
      aria-label="Navigasi utama"
    >
      <div className="max-w-md mx-auto px-3 pb-3 pointer-events-auto">
        <div className={`flex items-stretch justify-around gap-1 rounded-full border border-white/60 ${isMitra ? 'bg-[#FFF8EE]/70' : 'bg-[#EAF7EE]/70'} p-1.5 backdrop-blur-xl shadow-[0_18px_45px_rgba(23,70,48,0.18)]`}>
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveRoute(item.route)}
              aria-label={item.label}
              aria-current={item.isActive ? 'page' : undefined}
              className={`
                group relative flex flex-1 flex-col items-center justify-center gap-0.5
                px-2 py-2 min-h-[52px] rounded-full
                text-center transition-all duration-200
                focus-visible:outline-2 ${isMitra ? 'focus-visible:outline-[#A0632B]' : 'focus-visible:outline-[#174630]'} focus-visible:outline-offset-2
                ${item.isActive
                  ? (isMitra ? 'bg-[#A0632B] text-white shadow-[0_10px_24px_rgba(126,85,59,0.28)]' : 'bg-[#174630] text-white shadow-[0_10px_24px_rgba(23,70,48,0.28)]')
                  : (isMitra ? 'text-[#A0632B]/60 hover:text-[#A0632B] hover:bg-white/50' : 'text-[#174630]/60 hover:text-[#174630] hover:bg-white/50')
                }
              `}
            >
              <span
                className="material-symbols-outlined leading-none"
                style={{
                  fontSize: item.isActive ? '21px' : '23px',
                  fontVariationSettings: item.isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              {/* Nama tab hanya tampil saat tab itu yang aktif */}
              {item.isActive && (
                <span className="text-[10px] font-semibold leading-none tracking-wide">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
