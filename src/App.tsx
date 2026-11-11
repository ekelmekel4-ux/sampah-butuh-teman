import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AdminLayout } from './components/AdminLayout';
import { OnboardingView } from './views/OnboardingView';
import { AuthGateView } from './views/AuthGateView';
import { LoginView } from './views/auth/LoginView';
import { RegisterPenyalurView } from './views/auth/RegisterPenyalurView';
import { RegisterPenerimaView } from './views/auth/RegisterPenerimaView';
import { LeaderboardView } from './views/LeaderboardView';
import { LeaderboardDetailView } from './views/LeaderboardDetailView';
import { UnitBerandaView } from './views/UnitBerandaView';
import { UnitDompetView } from './views/UnitDompetView';
import { UnitSetorKertasView } from './views/UnitSetorKertasView';
import { UnitStatusView } from './views/UnitStatusView';
import { UnitRiwayatView } from './views/UnitRiwayatView';
import { UnitProfilView } from './views/UnitProfilView';
import { PerusahaanDashboardView } from './views/PerusahaanDashboardView';
import { PerusahaanPermintaanView } from './views/PerusahaanPermintaanView';
import { PerusahaanJadwalView } from './views/PerusahaanJadwalView';
import { PerusahaanListingDetailView } from './views/PerusahaanListingDetailView';
import { PerusahaanRiwayatView } from './views/PerusahaanRiwayatView';
import { PerusahaanProfilView } from './views/PerusahaanProfilView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AdminUnitTongView } from './views/AdminUnitTongView';
import { AdminLaporanView } from './views/AdminLaporanView';

/** Sub-halaman (detail/profil/riwayat) yang disembunyikan navbar atasnya. */
const DETAIL_ROUTES = new Set([
  '/unit/profil',
  '/unit/riwayat',
  '/unit/setor-kertas',
  '/unit/posting-baru',
  '/perusahaan/profil',
  '/perusahaan/riwayat',
  '/perusahaan/jadwal',
  '/perusahaan/listing-detail',
  '/leaderboard/rincian',
]);

const MainContent: React.FC = () => {
  const { isLoggedIn, hasSeenOnboarding, authStep, activeRoute, role, toastNotification, hideToast } = useApp();

  // 1. Onboarding Screen (first time)
  if (!hasSeenOnboarding || authStep === 'onboarding') {
    return <OnboardingView />;
  }

  // 2. Authentication Flow (before logged in)
  if (!isLoggedIn) {
    switch (authStep) {
      case 'login':
        return <LoginView />;
      case 'register-penyalur':
        return <RegisterPenyalurView />;
      case 'register-penerima':
        return <RegisterPenerimaView />;
      case 'gate':
      default:
        return <AuthGateView />;
    }
  }

  // 3. Authenticated App Views
  const renderCurrentView = () => {
    switch (activeRoute) {
      case '/unit/beranda':
        return <UnitBerandaView />;

      case '/unit/dompet':
        return <UnitDompetView />;

      case '/unit/setor-kertas':
      case '/unit/posting-baru':
        return <UnitSetorKertasView />;

      case '/unit/status':
        return <UnitStatusView />;

      case '/unit/riwayat':
        return <UnitRiwayatView />;

      case '/unit/profil':
        return <UnitProfilView />;

      case '/perusahaan/permintaan-baru':
        return <PerusahaanPermintaanView />;

      case '/perusahaan/dashboard':
      case '/perusahaan/pasokan':
      case '/perusahaan/matching':
        return <PerusahaanDashboardView />;

      case '/perusahaan/jadwal':
        return <PerusahaanJadwalView />;

      case '/perusahaan/listing-detail':
        return <PerusahaanListingDetailView />;

      case '/perusahaan/riwayat':
        return <PerusahaanRiwayatView />;

      case '/perusahaan/profil':
        return <PerusahaanProfilView />;

      case '/admin/dashboard':
        return <AdminDashboardView />;

      case '/admin/unit-tong':
        return <AdminUnitTongView />;

      case '/admin/laporan':
        return <AdminLaporanView />;

      case 'beranda':
      case '/leaderboard':
        return <LeaderboardView />;

      case '/leaderboard/rincian':
        return <LeaderboardDetailView />;

      default:
        return <LeaderboardView />;
    }
  };

  if (role === 'admin') {
    return (
      <AdminLayout>
        {renderCurrentView()}
      </AdminLayout>
    );
  }

  // Halaman detail (sub-halaman) disembunyikan navbar-nya agar fokus ke konten.
  const hideNavbar = DETAIL_ROUTES.has(activeRoute);

  return (
    <div className="min-h-screen bg-[#FAF5EA] text-[#1A2E22] font-sans antialiased flex flex-col relative">
      {/* Floating Global Toast Notification */}
      {toastNotification && (
        <div className="fixed app-toast-top inset-x-0 z-50 flex justify-center px-4 pointer-events-none animate-in slide-in-from-top-4 duration-300">
          <div className="pointer-events-auto max-w-md w-full bg-[#174630] border border-[#52B788]/40 text-white rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#52B788]/20 text-[#A7F3D0] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">
                  {toastNotification.type === 'error' ? 'error' : toastNotification.type === 'info' ? 'info' : 'payments'}
                </span>
              </div>
              <p className="text-xs font-bold text-white/95 leading-snug">
                {toastNotification.message}
              </p>
            </div>
            <button
              onClick={hideToast}
              className="w-6 h-6 rounded-full hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center text-xs shrink-0 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top Fixed Header */}
      {!hideNavbar && <Navbar />}

      {/* Main Page Area */}
      <main
        className={`flex-1 max-w-2xl w-full mx-auto px-3 sm:px-4 ${
          hideNavbar ? 'pt-4 pb-8' : 'app-main-top pb-28'
        }`}
      >
        <div className="animate-in fade-in duration-200">
          {renderCurrentView()}
        </div>
      </main>

      {/* Bottom Tab Navigation */}
      {!hideNavbar && <BottomNav />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
