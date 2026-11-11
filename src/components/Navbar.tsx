import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';

export const Navbar: React.FC = () => {
  const {
    role,
    currentUser,
    logout,
    setActiveRoute,
    activeRoute,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    clearAllNotifications,
  } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const menuOpen = showNotifMenu || showProfileMenu || showConfirmLogout;

      if (!isMobile || menuOpen) {
        setHeaderHidden(false);
      } else if (y <= 16) {
        setHeaderHidden(false);
      } else if (y > lastY + 6) {
        setHeaderHidden(true);
      } else if (y < lastY - 6) {
        setHeaderHidden(false);
      }

      lastY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => {
      if (window.innerWidth >= 768) setHeaderHidden(false);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [showNotifMenu, showProfileMenu, showConfirmLogout]);

  useEffect(() => {
    setHeaderHidden(false);
  }, [activeRoute]);

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
  // Palet chrome mengikuti peran: mitra = coklat/amber seperti form registrasi, unit/admin = hijau
  const isMitra = role === 'perusahaan';
  const initials = currentUser?.nama?.slice(0, 2).toUpperCase() || 'U';
  const hasCustomAvatar = !!currentUser?.avatar_url && currentUser.avatar_url !== APP_BRAND.avatarUrl;

  return (
    <>
      {/* ─── Top Header ─────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-40 px-3 sm:px-4 pt-safe transition-transform duration-300 ease-out will-change-transform ${
          headerHidden ? '-translate-y-[130%]' : 'translate-y-0'
        }`}
      >
        <div className={`max-w-2xl mx-auto mt-2.5 h-14 px-3.5 flex items-center justify-between gap-3 rounded-full border border-white/10 ${isMitra ? 'bg-[#A0632B]/95' : 'bg-[#174630]/95'} backdrop-blur-md shadow-[0_10px_30px_rgba(10,25,18,0.28)]`}>

          {/* Brand */}
          <button
            onClick={handleHomeClick}
            className={`flex items-center gap-2.5 min-w-0 group rounded-[6px] focus-visible:outline-2 ${isMitra ? 'focus-visible:outline-[#C27D3A]' : 'focus-visible:outline-[#2D6A4F]'} focus-visible:outline-offset-2`}
            aria-label="Ke halaman utama"
          >
            <img
              src={APP_BRAND.logoUrl}
              alt=""
              aria-hidden="true"
              className="h-7 w-7 object-contain shrink-0"
            />
            <span className={`text-[13px] font-bold text-white tracking-[-0.02em] truncate ${isMitra ? 'group-hover:text-[#FDE68A]' : 'group-hover:text-[#A7F3D0]'} transition-colors leading-none`}>
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
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white flex items-center justify-center transition-colors relative cursor-pointer"
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
                    <div className={`px-4 py-3 ${isMitra ? 'bg-[#A0632B]' : 'bg-[#174630]'} text-white flex items-center justify-between`}>
                      <div className="flex items-center gap-1.5">
                        <span className={`material-symbols-outlined text-sm ${isMitra ? 'text-[#FDE68A]' : 'text-[#A7F3D0]'}`}>notifications_active</span>
                        <h4 className="text-xs font-black">Notifikasi Sistem</h4>
                      </div>
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className={`text-[10px] ${isMitra ? 'text-[#FDE68A]' : 'text-[#A7F3D0]'} hover:underline font-bold cursor-pointer`}
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
                              !n.dibaca ? (isMitra ? 'bg-[#FEF3C7]/50 hover:bg-[#FEF3C7]/80' : 'bg-[#E8F5E9]/40 hover:bg-[#E8F5E9]/70') : 'hover:bg-gray-50'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                !n.dibaca ? (isMitra ? 'bg-[#C27D3A]' : 'bg-[#2D6A4F]') : 'bg-transparent'
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
                className={`w-8 h-8 rounded-full ${isMitra ? 'bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A] focus-visible:outline-[#FDE68A]' : 'bg-[#D8F3DC] text-[#005138] hover:bg-[#A7F3D0] focus-visible:outline-[#A7F3D0]'} text-[11px] font-bold flex items-center justify-center overflow-hidden transition-colors focus-visible:outline-2 focus-visible:outline-offset-2`}
                aria-label="Menu akun"
                aria-expanded={showProfileMenu}
              >
                {hasCustomAvatar ? (
                  <img src={currentUser?.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
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
                      {role === 'unit' && (
                        <>
                          <button
                            onClick={() => { setShowProfileMenu(false); setActiveRoute('/unit/dompet'); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] text-[13px] text-[#1A2E22] hover:bg-[#F2F7F4] transition-colors text-left font-medium"
                          >
                            <span className="material-symbols-outlined text-[18px] text-[#2D6A4F]">account_balance_wallet</span>
                            <span>Dompet kas</span>
                          </button>
                          <button
                            onClick={() => { setShowProfileMenu(false); setActiveRoute('/unit/profil'); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] text-[13px] text-[#1A2E22] hover:bg-[#F2F7F4] transition-colors text-left font-medium"
                          >
                            <span className="material-symbols-outlined text-[18px] text-[#2D6A4F]">manage_accounts</span>
                            <span>Profil unit</span>
                          </button>
                        </>
                      )}
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
