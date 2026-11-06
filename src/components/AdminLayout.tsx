import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { activeRoute, setActiveRoute, logout } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  // Strictly follow original 3 navigation items
  const navItems = [
    { route: '/admin/dashboard', label: 'Dashboard', icon: 'analytics' },
    { route: '/admin/unit-tong', label: 'Kelola Unit & Tong', icon: 'inventory_2' },
    { route: '/admin/laporan', label: 'Laporan & Flag', icon: 'flag' }
  ];

  const handleNav = (route: string) => {
    setActiveRoute(route);
    setIsSidebarOpen(false);
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

      {/* Clean Cream & Forest Green Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-64 bg-white border-r border-[#E0E5E2] transform transition-all duration-300 ease-in-out flex flex-col shrink-0 shadow-xs
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${isDesktopSidebarOpen ? 'lg:translate-x-0 lg:ml-0' : 'lg:-translate-x-full lg:-ml-64'}
        `}
      >
        <div className="h-20 flex items-center px-6 border-b border-[#E0E5E2] gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F1EEE5] p-1.5 flex items-center justify-center shrink-0 border border-[#E0E5E2]/80">
            <img src={APP_BRAND.logoUrl} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-[#2D6A4F] leading-tight">
              Sampah<br/>Butuh Teman
            </h1>
            <p className="text-[10px] text-[#8A9E94] font-semibold tracking-wider uppercase mt-0.5">Admin Portal</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          <p className="px-3 text-[10px] font-extrabold text-[#8A9E94] uppercase tracking-wider mb-2">
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
                <span>{item.label}</span>
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
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-[#E0E5E2] flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen);
                setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#4A5C52] hover:bg-[#F7F8F5] transition-colors"
              aria-label="Toggle Sidebar"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h2 className="text-base font-extrabold text-[#141E18]">Admin Dashboard</h2>
              <p className="text-[11px] text-[#4A5C52] font-medium">Platform Manajemen Sirkularitas Kertas Kampus UPJ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F7F8F5] border border-[#E0E5E2] text-[11px] font-bold text-[#4A5C52]">
              <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
              <span>Sistem Aktif</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              AD
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
