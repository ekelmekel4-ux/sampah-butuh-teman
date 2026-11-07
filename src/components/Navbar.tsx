import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';

export const Navbar: React.FC = () => {
  const {
    role,
    currentUser,
    logout,
    setActiveRoute,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    clearAllNotifications,
  } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const getRoleMeta = () => {
    switch (role) {
      case 'unit':
        return { label: 'Unit Kampus', color: 'bg-[#D8F3DC] text-[#005138]' };
      case 'perusahaan':
        return { label: 'Mitra Industri', color: 'bg-[#FEF3C7] text-[#92400E]' };
      case 'admin':
        return { label: 'Admin', color: 'bg-[#ECE6D7] text-[#52645A]' };
      default:
        return { label: '', color: '' };
    }
  };

  const handleHomeClick = () => {
    if (role === 'unit') setActiveRoute('/unit/beranda');
    else if (role === 'perusahaan') setActiveRoute('/perusahaan/matching');
    else setActiveRoute('/admin/dashboard');
  };

  const meta = getRoleMeta();
  const initials = currentUser?.nama?.slice(0, 2).toUpperCase() || 'U';

  return (
    <>
      {/* ─── Top Header ─────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/96 backdrop-blur-sm border-b border-[#E0E5E2] pt-safe">
        <div className="max-w-2xl mx-auto h-14 px-4 flex items-center justify-between gap-3">

          {/* Brand */}
          <button
            onClick={handleHomeClick}
            className="flex items-center gap-2.5 min-w-0 group rounded-[6px] focus-visible:outline-2 focus-visible:outline-[#2D6A4F] focus-visible:outline-offset-2"
            aria-label="Ke halaman utama"
          >
            <img
              src={APP_BRAND.logoUrl}
              alt=""
              aria-hidden="true"
              className="h-7 w-7 object-contain shrink-0"
            />
            <span className="text-[13px] font-bold text-[#1A2E22] tracking-[-0.02em] truncate group-hover:text-[#2D6A4F] transition-colors leading-none">
              {APP_BRAND.name}
            </span>
          </button>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Role badge */}
            <span className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${meta.color}`}>
              {meta.label}
            </span>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifMenu(v => !v); setShowProfileMenu(false); }}
                className="w-8 h-8 rounded-[10px] bg-[#FAF8F5] hover:bg-[#E8F5E9] border border-[#2D6A4F]/15 text-[#174630] flex items-center justify-center transition-colors relative cursor-pointer"
                aria-label="Notifikasi"
              >
                <span className="material-symbols-outlined text-[19px]">notifications</span>
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E76F51] text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifMenu(false)}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-[#E0E5E2] rounded-[18px] z-50 overflow-hidden shadow-2xl"
                    style={{ boxShadow: '0 12px 32px rgba(20,30,24,0.12)' }}
                  >
                    <div className="px-4 py-3 bg-[#174630] text-white flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-[#A7F3D0]">notifications_active</span>
                        <h4 className="text-xs font-black">Notifikasi Sistem</h4>
                      </div>
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="text-[10px] text-[#A7F3D0] hover:underline font-bold cursor-pointer"
                        >
                          Tandai Dibaca
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-[#52645A]">
                          Belum ada notifikasi baru.
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationAsRead(n.id);
                              if (n.link) {
                                setShowNotifMenu(false);
                                setActiveRoute(n.link);
                              }
                            }}
                            className={`p-3 text-left transition-colors cursor-pointer flex items-start gap-2.5 ${
                              !n.dibaca ? 'bg-[#E8F5E9]/40 hover:bg-[#E8F5E9]/70' : 'hover:bg-gray-50'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                !n.dibaca ? 'bg-[#2D6A4F]' : 'bg-transparent'
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h5 className="text-xs font-bold text-[#1A2E22] truncate">{n.judul}</h5>
                                <span className="text-[9px] text-[#8CA090] shrink-0">{n.created_at}</span>
                              </div>
                              <p className="text-[11px] text-[#52645A] mt-0.5 line-clamp-2 leading-relaxed">
                                {n.pesan}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Avatar trigger */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(v => !v)}
                className="w-8 h-8 rounded-[10px] bg-[#2D6A4F] text-white text-[11px] font-bold flex items-center justify-center hover:bg-[#005138] transition-colors focus-visible:outline-2 focus-visible:outline-[#2D6A4F] focus-visible:outline-offset-2"
                aria-label="Menu akun"
                aria-expanded={showProfileMenu}
              >
                {initials}
              </button>

              {/* Dropdown */}
              {showProfileMenu && (
                <>
                  {/* Transparent backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                    aria-hidden="true"
                  />

                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E0E5E2] rounded-[14px] z-50 overflow-hidden"
                    style={{ boxShadow: '0 8px 24px rgba(20,30,24,0.10), 0 2px 6px rgba(20,30,24,0.05)' }}>
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-[#E3DDCF]">
                      <p className="text-[11px] text-[#8CA090] font-medium mb-0.5">Akun aktif</p>
                      <p className="text-[13px] font-semibold text-[#1A2E22] truncate">{currentUser?.nama || 'Pengguna'}</p>
                      <p className="text-[11px] text-[#52645A] truncate">{currentUser?.email || '—'}</p>
                    </div>

                    {/* Actions */}
                    <div className="p-1.5 space-y-0.5">
                      {role === 'perusahaan' && (
                        <button
                          onClick={() => { setShowProfileMenu(false); setActiveRoute('/perusahaan/profil'); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] text-[13px] text-[#1A2E22] hover:bg-[#FAFAF7] transition-colors text-left font-medium"
                        >
                          <span className="material-symbols-outlined text-[18px] text-[#52645A]">manage_accounts</span>
                          <span>Pengaturan Profil</span>
                        </button>
                      )}
                      <button
                        onClick={() => { setShowProfileMenu(false); setShowConfirmLogout(true); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] text-[13px] text-[#C0392B] hover:bg-[#FEECEC] transition-colors text-left font-medium"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>Keluar</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Logout Confirmation Modal ───────── */}
      {showConfirmLogout && (
        <div
          className="fixed inset-0 z-50 bg-[#1A2E22]/50 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowConfirmLogout(false); }}
        >
          <div className="bg-white rounded-[20px] p-6 max-w-xs w-full border border-[#E0E5E2]"
            style={{ boxShadow: '0 8px 24px rgba(20,30,24,0.12)' }}>
            <h3 className="text-[17px] font-bold text-[#1A2E22] mb-1.5 tracking-tight">Keluar dari akun?</h3>
            <p className="text-[13px] text-[#52645A] leading-relaxed mb-6">
              Anda akan kembali ke halaman pemilih peran.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="flex-1 h-11 rounded-[10px] border border-[#CFC9B8] text-[#1A2E22] text-[13px] font-semibold hover:bg-[#FAFAF7] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => { setShowConfirmLogout(false); logout(); }}
                className="flex-1 h-11 rounded-[10px] bg-[#C0392B] hover:bg-[#A93226] text-white text-[13px] font-semibold transition-colors"
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
