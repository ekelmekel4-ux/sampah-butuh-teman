import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { OnboardingView } from './views/OnboardingView';
import { AuthGateView } from './views/AuthGateView';
import { LoginPenyalurView } from './views/auth/LoginPenyalurView';
import { RegisterPenyalurView } from './views/auth/RegisterPenyalurView';
import { LoginPenerimaView } from './views/auth/LoginPenerimaView';
import { RegisterPenerimaView } from './views/auth/RegisterPenerimaView';
import { LoginAdminView } from './views/auth/LoginAdminView';
import { LeaderboardView } from './views/LeaderboardView';
import { UnitBerandaView } from './views/UnitBerandaView';
import { UnitSetorKertasView } from './views/UnitSetorKertasView';
import { UnitStatusView } from './views/UnitStatusView';
import { PerusahaanPermintaanView } from './views/PerusahaanPermintaanView';
import { PerusahaanMatchingView } from './views/PerusahaanMatchingView';
import { PerusahaanJadwalView } from './views/PerusahaanJadwalView';
import { PerusahaanListingDetailView } from './views/PerusahaanListingDetailView';
import { PerusahaanRiwayatView } from './views/PerusahaanRiwayatView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AdminUnitTongView } from './views/AdminUnitTongView';
import { AdminLaporanView } from './views/AdminLaporanView';

const MainContent: React.FC = () => {
  const { isLoggedIn, hasSeenOnboarding, authStep, activeRoute } = useApp();

  // 1. Onboarding Screen (first time)
  if (!hasSeenOnboarding || authStep === 'onboarding') {
    return <OnboardingView />;
  }

  // 2. Authentication Flow (before logged in)
  if (!isLoggedIn) {
    switch (authStep) {
      case 'login-penyalur':
        return <LoginPenyalurView />;
      case 'register-penyalur':
        return <RegisterPenyalurView />;
      case 'login-penerima':
        return <LoginPenerimaView />;
      case 'register-penerima':
        return <RegisterPenerimaView />;
      case 'login-admin':
        return <LoginAdminView />;
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

      case '/unit/setor-kertas':
      case '/unit/posting-baru':
        return <UnitSetorKertasView />;

      case '/unit/status':
        return <UnitStatusView />;

      case '/perusahaan/permintaan-baru':
        return <PerusahaanPermintaanView />;

      case '/perusahaan/matching':
        return <PerusahaanMatchingView />;

      case '/perusahaan/jadwal':
        return <PerusahaanJadwalView />;

      case '/perusahaan/listing-detail':
        return <PerusahaanListingDetailView />;

      case '/perusahaan/riwayat':
        return <PerusahaanRiwayatView />;

      case '/admin/dashboard':
        return <AdminDashboardView />;

      case '/admin/unit-tong':
        return <AdminUnitTongView />;

      case '/admin/laporan':
        return <AdminLaporanView />;

      case 'beranda':
      case '/leaderboard':
      default:
        return <LeaderboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#1C1C16] font-sans antialiased flex flex-col selection:bg-[#176B4D] selection:text-white">
      {/* Top Fixed Header with role badge and logout */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-3 sm:px-4 pt-20 pb-24">
        <div className="animate-in fade-in duration-200">
          {renderCurrentView()}
        </div>
      </main>

      {/* Role-Specific Bottom Tab Navigation */}
      <BottomNav />
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
