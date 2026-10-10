import React from 'react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeRoute, setActiveRoute, role } = useApp();

  const handleNav = (targetRoute: string) => {
    setActiveRoute(targetRoute);
  };

  // Nav configuration per role
  const getNavItems = () => {
    switch (role) {
      case 'unit':
        return [
          {
            route: '/unit/beranda',
            label: 'Beranda',
            icon: 'home',
            isActive: activeRoute === '/unit/beranda' || activeRoute === '/unit/setor-kertas' || activeRoute === '/unit/posting-baru'
          },
          {
            route: '/unit/status',
            label: 'Status Tong',
            icon: 'inventory_2',
            isActive: activeRoute === '/unit/status'
          },
          {
            route: '/leaderboard',
            label: 'Peringkat',
            icon: 'leaderboard',
            isActive: activeRoute === '/leaderboard'
          }
        ];

      case 'perusahaan':
        return [
          {
            route: '/perusahaan/dashboard',
            label: 'Dashboard',
            icon: 'dashboard',
            isActive:
              activeRoute === '/perusahaan/dashboard' ||
              activeRoute === '/perusahaan/pasokan' ||
              activeRoute === '/perusahaan/matching' ||
              activeRoute === '/perusahaan/jadwal' ||
              activeRoute === '/perusahaan/listing-detail'
          },
          {
            route: '/perusahaan/permintaan-baru',
            label: 'Kebutuhan',
            icon: 'post_add',
            isActive: activeRoute === '/perusahaan/permintaan-baru'
          },
          {
            route: '/perusahaan/riwayat',
            label: 'Riwayat',
            icon: 'receipt_long',
            isActive: activeRoute === '/perusahaan/riwayat'
          }
        ];

      case 'admin':
        return [
          {
            route: '/admin/dashboard',
            label: 'Dashboard',
            icon: 'analytics',
            isActive: activeRoute === '/admin/dashboard'
          },
          {
            route: '/admin/unit-tong',
            label: 'Unit & Tong',
            icon: 'inventory_2',
            isActive: activeRoute === '/admin/unit-tong'
          },
          {
            route: '/admin/laporan',
            label: 'Laporan & Flag',
            icon: 'flag',
            isActive: activeRoute === '/admin/laporan'
          }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-4 inset-x-0 z-40 pb-safe pointer-events-none">
      <div className="max-w-md mx-auto px-4 pointer-events-auto">
        <div className="flex items-center justify-around bg-white/95 backdrop-blur-md rounded-full px-2 py-2 shadow-xl border border-black/5">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNav(item.route)}
              className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                item.isActive
                  ? 'bg-[#2D6A4F] text-white font-extrabold shadow-sm scale-105'
                  : 'text-[#52645A] hover:text-[#1A2E22] font-semibold'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: item.isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {item.isActive && (
                <span className="text-xs font-extrabold tracking-tight">{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
