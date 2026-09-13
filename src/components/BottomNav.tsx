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
            route: '/perusahaan/matching',
            label: 'Pasokan Kertas',
            icon: 'handshake',
            isActive:
              activeRoute === '/perusahaan/matching' ||
              activeRoute === '/perusahaan/jadwal' ||
              activeRoute === '/perusahaan/listing-detail'
          },
          {
            route: '/perusahaan/permintaan-baru',
            label: 'Buat Kebutuhan',
            icon: 'post_add',
            isActive: activeRoute === '/perusahaan/permintaan-baru'
          },
          {
            route: '/perusahaan/riwayat',
            label: 'Riwayat Pickup',
            icon: 'history',
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
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#FDF9F0]/95 backdrop-blur-xl border-t border-[#176B4D]/10 shadow-[0_-4px_16px_rgba(23,107,77,0.08)]">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNav(item.route)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-12 rounded-xl transition-all ${
              item.isActive
                ? 'text-[#176B4D] font-bold scale-105'
                : 'text-[#57635A] hover:text-[#176B4D] font-medium'
            }`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: item.isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-[11px] leading-none tracking-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
