import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';

export const OnboardingView: React.FC = () => {
  const { completeOnboarding } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Sampah Kertas Kampus Butuh Teman',
      subtitle: 'Platform Sirkular Sampah Kertas Terintegrasi Kampus',
      description:
        'Menghubungkan unit kampus (BEM, Fakultas, Biro, Prodi) yang menghasilkan limbah kertas bernilai tinggi langsung dengan mitra industri daur ulang.',
      badge: 'Solusi Sirkular Kampus',
      icon: 'recycling',
      gradient: 'from-[#176B4D] to-[#0E4632]',
      accentColor: 'text-[#176B4D]',
      stats: [
        { label: 'Kampus Hijau', value: '100%' },
        { label: 'Sirkularitas', value: 'Terpadu' }
      ]
    },
    {
      title: 'Drop Point Terpusat & Matching Cerdas',
      subtitle: 'Satu Titik Logistik Gedung Serbaguna',
      description:
        'Kertas disalurkan ke wadah tong bernomor per unit. Sistem mencocokkan kriteria kadar air dan tonase secara instan dengan kebutuhan pabrik.',
      badge: 'Logistik Terpusat',
      icon: 'inventory_2',
      gradient: 'from-[#8B6045] to-[#5C3B25]',
      accentColor: 'text-[#8B6045]',
      stats: [
        { label: 'Kapasitas Tong', value: '120-180 Kg' },
        { label: 'Akurasi Match', value: '96%+' }
      ]
    },
    {
      title: 'Dampak Nyata & Konversi Dana Riset',
      subtitle: 'Kertas Terkelola Jadi Eco-Points & Dana Kampus',
      description:
        'Pantau pohon yang terselamatkan, air bersih yang terhemat, serta leaderboard keaktifan unit kampus dalam mendukung keberlanjutan lingkungan.',
      badge: 'Dampak Lingkungan',
      icon: 'forest',
      gradient: 'from-[#176B4D] to-[#2E8B57]',
      accentColor: 'text-[#176B4D]',
      stats: [
        { label: 'Eco-Points', value: '2x/Kg' },
        { label: 'Pohon Selamat', value: '17/Ton' }
      ]
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#1C1C16] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto select-none">
      {/* Top Bar: Brand Logo + Skip */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <img
            src={APP_BRAND.logoUrl}
            alt="Logo"
            className="w-8 h-8 object-contain drop-shadow-xs"
          />
          <span className="font-bold text-[#176B4D] text-sm tracking-tight">
            {APP_BRAND.name}
          </span>
        </div>
        <button
          onClick={completeOnboarding}
          className="text-xs font-semibold text-[#6F7A73] hover:text-[#176B4D] px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors"
        >
          Lewati
        </button>
      </div>

      {/* Main Slide Card */}
      <div className="my-auto py-8">
        {/* Visual Card Hero */}
        <div
          className={`w-full rounded-3xl p-8 text-white bg-gradient-to-br ${slide.gradient} shadow-xl relative overflow-hidden transition-all duration-500`}
        >
          {/* Decorative background shapes */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide text-white mb-6">
            <span className="material-symbols-outlined text-[15px]">eco</span>
            {slide.badge}
          </div>

          {/* Hero Icon */}
          <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 shadow-inner">
            <span
              className="material-symbols-outlined text-[44px] text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {slide.icon}
            </span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/20">
            {slide.stats.map((st, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                <div className="text-[11px] opacity-80">{st.label}</div>
                <div className="text-base font-bold text-white tracking-tight">
                  {st.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Text Content */}
        <div className="mt-8 text-center px-2">
          <h1 className="text-2xl font-black text-[#176B4D] tracking-tight leading-tight">
            {slide.title}
          </h1>
          <div className="text-xs font-bold text-[#8B6045] uppercase tracking-wider mt-1.5 mb-3">
            {slide.subtitle}
          </div>
          <p className="text-sm text-[#57635A] leading-relaxed max-w-sm mx-auto">
            {slide.description}
          </p>
        </div>
      </div>

      {/* Bottom Controls: Dots + Button */}
      <div className="pb-4 space-y-4">
        {/* Step Indicator Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? 'w-8 bg-[#176B4D]'
                  : 'w-2.5 bg-[#176B4D]/25 hover:bg-[#176B4D]/50'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next / Start Button */}
        <button
          onClick={handleNext}
          className="w-full h-14 rounded-2xl bg-[#176B4D] hover:bg-[#0E4632] text-white font-bold text-base shadow-lg shadow-[#176B4D]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span>{currentSlide === slides.length - 1 ? 'Mulai Sekarang' : 'Lanjutkan'}</span>
          <span className="material-symbols-outlined text-[20px]">
            {currentSlide === slides.length - 1 ? 'check_circle' : 'arrow_forward'}
          </span>
        </button>
      </div>
    </div>
  );
};
