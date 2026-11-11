import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { activeRoute, setActiveRoute, logout, laporanList } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const pendingLaporan = laporanList.filter(l => l.status === 'menunggu_tindakan').length;

  const navItems = [
    { route: '/admin/dashboard', label: 'Dashboard', icon: 'analytics', badge: 0 },
    { route: '/admin/unit-tong', label: 'Kelola Unit & Tong', icon: 'inventory_2', badge: 0 },
    { route: '/admin/laporan', label: 'Laporan & Flag', icon: 'flag', badge: pendingLaporan }
  ];

  const handleNav = (route: string) => {
    setActiveRoute(route);
    setIsSidebarOpen(false); // Close on mobile after click
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#141E18] flex font-sans antialiased overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#141E18]/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Clean Cream & Forest Green Sidebar — panel melayang dengan sudut membulat */}
      <aside
        className={`fixed lg:static inset-y-3 left-3 z-50 bg-white border border-[#E0E5E2] rounded-[24px] overflow-hidden transform transition-all duration-300 ease-in-out flex flex-col shrink-0 shadow-[0_18px_45px_rgba(20,30,24,0.12)]
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[110%]'}
          ${
            isDesktopSidebarOpen
              ? 'w-72 lg:w-64 lg:translate-x-0 lg:ml-3 lg:my-3 lg:opacity-100'
              : 'lg:w-0 lg:translate-x-0 lg:ml-0 lg:my-0 lg:opacity-0 lg:pointer-events-none lg:border-0 lg:shadow-none'
          }
        `}
      >
        <div className="h-20 flex items-center px-6 border-b border-[#E0E5E2] gap-3 bg-[#FAFCFA]">
          <div className="w-10 h-10 rounded-xl bg-[#F1EEE5] p-1.5 flex items-center justify-center shrink-0 border border-[#E0E5E2]/80">
              <img src={APP_BRAND.logoUrl} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-[#2D6A4F] leading-tight">
              Sampah<br/>Butuh Teman
            </h1>
            <p className="text-[10px] text-[#8CA090] font-semibold tracking-wider uppercase mt-0.5">Admin Portal</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          <p className="px-3 text-[10px] font-extrabold text-[#8CA090] uppercase tracking-wider mb-2">
            Menu Utama
          </p>
          
          {navItems.map((item) => {
            const isActive = activeRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#2D6A4F] text-white shadow-xs'
                    : 'text-[#4A5C52] hover:bg-[#D8F3DC]/40 hover:text-[#2D6A4F]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#BA1A1A] text-white text-[10px] font-extrabold tabular-nums">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#E0E5E2]">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#C0392B] hover:bg-[#FEECEC] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header — floating rounded bar */}
        <header className="mx-3 lg:mx-4 mt-3 h-20 shrink-0 bg-white border border-[#E0E5E2] rounded-[28px] shadow-[0_10px_30px_rgba(20,30,24,0.08)] px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen);
                setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
              }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#4A5C52] hover:bg-[#F7F8F5] transition-colors"
              aria-label="Toggle Sidebar"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-[#141E18] truncate">Admin Dashboard</h2>
              <p className="text-[11px] text-[#4A5C52] font-medium truncate">Platform Manajemen Sirkularitas Kertas Kampus UPJ</p>
            </div>
          </div>
        </header>

        {/* Scrollable Main View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F7F8F5]">
          <div className="max-w-6xl mx-auto pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
