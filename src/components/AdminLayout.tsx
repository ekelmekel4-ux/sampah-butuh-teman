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

  const navItems = [
    { route: '/admin/dashboard', label: 'Dashboard', icon: 'analytics' },
    { route: '/admin/unit-tong', label: 'Kelola Unit & Tong', icon: 'inventory_2' },
    { route: '/admin/laporan', label: 'Laporan & Flag', icon: 'flag' }
  ];

  const handleNav = (route: string) => {
    setActiveRoute(route);
    setIsSidebarOpen(false); // Close on mobile after click
  };

  return (
    <div className="min-h-screen bg-[#F2F7F4] text-[#1A2E22] flex font-sans antialiased overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#1A2E22]/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-64 bg-white border-r border-[#2D6A4F]/10 transform transition-all duration-300 ease-in-out flex flex-col shrink-0 shadow-sm
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${isDesktopSidebarOpen ? 'lg:translate-x-0 lg:ml-0' : 'lg:-translate-x-full lg:-ml-64'}
        `}
      >
        <div className="h-20 flex items-center px-6 border-b border-[#2D6A4F]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1EEE5] p-1.5 flex items-center justify-center">
              <img src={APP_BRAND.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-black text-[#2D6A4F] leading-tight">Sampah<br/>Butuh Teman</h1>
            </div>
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
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#2D6A4F] text-white shadow-sm' 
                    : 'text-[#52645A] hover:bg-[#D8F3DC]/40 hover:text-[#2D6A4F]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#2D6A4F]/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-[#E76F51] hover:bg-[#E76F51]/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-[#2D6A4F]/10 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen);
                setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#52645A] hover:bg-[#F2F7F4] active:bg-[#D8F3DC] transition-colors"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="hidden sm:block">
              <h2 className="text-xl font-extrabold text-[#1A2E22]">Admin Dashboard</h2>
              <p className="text-xs text-[#52645A] font-medium">Platform Manajemen Sirkularitas Kertas</p>
            </div>
          </div>

        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#FAFAF7]">
          <div className="max-w-6xl mx-auto pb-10">
            <div className="animate-in fade-in duration-300">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
