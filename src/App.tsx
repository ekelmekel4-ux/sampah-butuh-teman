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
import { UnitBerandaView } from './views/UnitBerandaView';
import { UnitDompetView } from './views/UnitDompetView';
import { UnitSetorKertasView } from './views/UnitSetorKertasView';
import { UnitStatusView } from './views/UnitStatusView';
import { PerusahaanDashboardView } from './views/PerusahaanDashboardView';
import { PerusahaanPermintaanView } from './views/PerusahaanPermintaanView';
import { PerusahaanJadwalView } from './views/PerusahaanJadwalView';
import { PerusahaanListingDetailView } from './views/PerusahaanListingDetailView';
import { PerusahaanRiwayatView } from './views/PerusahaanRiwayatView';
import { PerusahaanProfilView } from './views/PerusahaanProfilView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AdminUnitTongView } from './views/AdminUnitTongView';
import { AdminLaporanView } from './views/AdminLaporanView';

const MainContent: React.FC = () => {
  const { isLoggedIn, hasSeenOnboarding, authStep, activeRoute, role } = useApp();

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

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1A2E22] font-sans antialiased flex flex-col selection:bg-[#2D6A4F]/20 selection:text-[#2D6A4F]">
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
