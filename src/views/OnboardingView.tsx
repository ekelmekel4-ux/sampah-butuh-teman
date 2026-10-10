import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';

export const OnboardingView: React.FC = () => {
  const { completeOnboarding } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Kumpulkan & Kelola Limbah Kertas Kampus',
      subtitle: 'Platform Sirkular Kampus',
      description:
        'Menghubungkan unit kampus (BEM, Fakultas, Biro) yang menghasilkan limbah kertas bernilai tinggi langsung dengan mitra industri daur ulang.',
      image: '/onboarding-1.jpg',
      badge: 'BEM & Unit Kampus',
      icon: 'recycling'
    },
    {
      title: 'Penyaluran Langsung & Leaderboard Kampus',
      subtitle: 'Konversi Nilai Rupiah Real-Time',
      description:
        'Kertas disalurkan langsung oleh unit kampus. Setiap kilogram dihitung nilai rupiah (Rp) aktualnya dan dicatat di leaderboard sirkularitas kampus.',
      image: '/onboarding-2.jpg',
      badge: 'Leaderboard & Kas',
      icon: 'trophy'
    },
    {
      title: 'Dampak Lingkungan & Dana Riset',
      subtitle: 'Eco-Points & Transparansi',
      description:
        'Pantau pohon terselamatkan, air bersih terhemat, serta leaderboard keaktifan unit kampus dalam mendukung keberlanjutan.',
      image: '/onboarding-3.jpg',
      badge: 'Impact Dashboard',
      icon: 'forest'
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
    <div className="min-h-screen bg-gradient-to-br from-[#D8F3DC] via-[#FAFAF7] to-[#F2F7F4] text-[#1A2E22] flex flex-col justify-center items-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[#2D6A4F]/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#52B788]/10 blur-3xl pointer-events-none" />

      {/* Main Onboarding Card */}
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-[36px] shadow-2xl shadow-[#2D6A4F]/15 border border-[#2D6A4F]/10 overflow-hidden flex flex-col justify-between relative z-10 my-auto min-h-[640px] sm:min-h-[680px] transition-all">
        
        {/* Top Header Controls */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
          {/* Brand Badge */}
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#2D6A4F]/10 shadow-xs">
            <img src={APP_BRAND.logoUrl} alt="Logo" className="w-6 h-6 object-contain" />
            <span className="font-extrabold text-[#2D6A4F] text-xs tracking-tight">
              {APP_BRAND.name}
            </span>
          </div>
          {/* Skip Button */}
          <button
            onClick={completeOnboarding}
            className="text-xs font-bold text-[#52645A] hover:text-[#2D6A4F] px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-[#2D6A4F]/10 shadow-xs transition-all"
          >
            Lewati
          </button>
        </div>

        {/* Illustration Area */}
        <div className="relative w-full h-[310px] sm:h-[340px] bg-[#F2F7F4] overflow-hidden">
          <img
            key={slide.image}
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center transition-all duration-500"
          />

          {/* Feature Badge */}
          <div className="absolute bottom-10 left-6 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-extrabold text-[#2D6A4F] shadow-md border border-[#2D6A4F]/15">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>{slide.badge}</span>
          </div>

          {/* Wave separator */}
          <div className="absolute -bottom-1 inset-x-0 w-full pointer-events-none leading-none z-10">
            <svg viewBox="0 0 500 120" preserveAspectRatio="none" className="w-full h-16 text-white fill-current">
              <path d="M0,0 C150,90 350,-40 500,60 L500,120 L0,120 Z"></path>
            </svg>
          </div>
        </div>

        {/* Bottom Content Area */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between text-center bg-white relative z-10">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1A2E22] tracking-tight leading-snug mb-2">
              {slide.title}
            </h1>
            <div className="inline-block text-[11px] font-extrabold text-[#2D6A4F] bg-[#D8F3DC] px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              {slide.subtitle}
            </div>
            <p className="text-xs sm:text-sm text-[#52645A] leading-relaxed font-normal max-w-xs mx-auto">
              {slide.description}
            </p>
          </div>

          {/* Controls */}
          <div className="pt-6 space-y-5">
            {/* Step Dots */}
            <div className="flex items-center justify-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? 'w-8 bg-[#2D6A4F] shadow-xs'
                      : 'w-2.5 bg-[#2D6A4F]/20 hover:bg-[#2D6A4F]/40'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={handleNext}
              className="w-full py-3.5 sm:py-4 rounded-full bg-[#2D6A4F] hover:bg-[#1A4235] active:bg-[#0F2E22] text-white font-extrabold text-sm shadow-lg shadow-[#2D6A4F]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>{currentSlide === slides.length - 1 ? 'Mulai Sekarang' : 'Lanjutkan'}</span>
              <span className="material-symbols-outlined text-[18px]">
                {currentSlide === slides.length - 1 ? 'check_circle' : 'arrow_forward'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-[11px] font-semibold text-[#52645A] flex items-center justify-center gap-1.5 z-10">
        <span>{APP_BRAND.subtitle}</span>
      </div>
    </div>
  );
};
