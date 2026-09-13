import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const RoleDemoBanner: React.FC = () => {
  const { role, setRole, activeRoute, setActiveRoute, resetDemoData } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleReset = () => {
    resetDemoData();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="w-full bg-[#176B4D] text-white text-xs border-b border-[#52A66F]/30 shadow-xs">
      <div className="max-w-2xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none">
            <span className="font-bold uppercase tracking-wider text-[10px] text-[#A4F3CC] shrink-0">
              Demo Navigasi:
            </span>

            {/* Quick subroute pills based on role or cross-navigation */}
            {role === 'unit' && (
              <>
                <button
                  onClick={() => setActiveRoute('/unit/posting-baru')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all ${
                    activeRoute === '/unit/posting-baru'
                      ? 'bg-white text-[#176B4D] font-bold shadow-xs'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  + Posting Kertas
                </button>
                <button
                  onClick={() => setActiveRoute('/unit/status')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all ${
                    activeRoute === '/unit/status'
                      ? 'bg-white text-[#176B4D] font-bold shadow-xs'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  Status Tong Unit
                </button>
              </>
            )}

            {role === 'perusahaan' && (
              <>
                <button
                  onClick={() => setActiveRoute('/perusahaan/matching')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all ${
                    activeRoute === '/perusahaan/matching'
                      ? 'bg-white text-[#176B4D] font-bold shadow-xs'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  Pencocokan & Pickup
                </button>
                <button
                  onClick={() => setActiveRoute('/perusahaan/permintaan-baru')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all ${
                    activeRoute === '/perusahaan/permintaan-baru'
                      ? 'bg-white text-[#176B4D] font-bold shadow-xs'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  + Permintaan Baru
                </button>
                <button
                  onClick={() => setActiveRoute('/perusahaan/riwayat')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all ${
                    activeRoute === '/perusahaan/riwayat'
                      ? 'bg-white text-[#176B4D] font-bold shadow-xs'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  Surat Jalan & Riwayat
                </button>
              </>
            )}

            {role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveRoute('/admin/dashboard')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all ${
                    activeRoute === '/admin/dashboard'
                      ? 'bg-white text-[#176B4D] font-bold shadow-xs'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  Denah Tong Drop Point
                </button>
                <button
                  onClick={() => setActiveRoute('/admin/unit-tong')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all ${
                    activeRoute === '/admin/unit-tong'
                      ? 'bg-white text-[#176B4D] font-bold shadow-xs'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  Kelola Unit & Tong
                </button>
                <button
                  onClick={() => setActiveRoute('/admin/laporan')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all ${
                    activeRoute === '/admin/laporan'
                      ? 'bg-white text-[#176B4D] font-bold shadow-xs'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  Laporan / Flag
                </button>
              </>
            )}

            <button
              onClick={() => setActiveRoute('/leaderboard')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all ${
                activeRoute === '/leaderboard'
                  ? 'bg-white text-[#176B4D] font-bold shadow-xs'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              Papan Peringkat
            </button>
          </div>

          {/* Action reset */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleReset}
              className="px-2 py-0.5 rounded text-[10px] bg-[#8B6045] hover:bg-[#633E25] text-white font-semibold transition-colors flex items-center gap-1"
              title="Kembalikan data ke awal simulasi demo"
            >
              <span className="material-symbols-outlined text-[13px]">restart_alt</span>
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>

        {showToast && (
          <div className="mt-1 text-[11px] text-[#A4F3CC] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Data simulasi demo berhasil dikembalikan ke status awal!
          </div>
        )}
      </div>
    </div>
  );
};
