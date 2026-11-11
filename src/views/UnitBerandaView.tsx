import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaperGuideModal } from '../components/PaperGuideModal';
import { HERO_MASCOT } from '../lib/mascot';
import { getTongState, TONG_STATE_META } from '../lib/tong';

type HeroSlide = {
  title: string;
  subtitle: string;
  cta: string;
  route: string;
};

const STATUS_LISTING_META: Record<string, { label: string; className: string }> = {
  sudah_diambil: { label: 'Selesai', className: 'bg-[#D8F3DC] text-[#174630]' },
  siap_pickup: { label: 'Siap pickup', className: 'bg-[#DDF1FA] text-[#17607E]' },
  menunggu_mitra: { label: 'Menunggu mitra', className: 'bg-[#FEF3C7] text-[#8A5A12]' },
};

export const UnitBerandaView: React.FC = () => {
  const { currentUser, units, tongList, listings, matchings, setActiveRoute, saldoSekarang, setPreselectTongId, setSelectedListingId } =
    useApp();
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  const currentUnit =
    units.find(u => u.id === currentUser?.unit_id) ||
    units.find(u => u.inisial === 'FTD') ||
    units[0] ||
    {
      id: 'unit-ftd',
      nama_unit: 'Fakultas Teknik & Desain',
      inisial: 'FTD',
      total_kg_tersalurkan: 0,
      eco_points: 0,
      pic_nama: 'PIC FTD',
    };

  const assignedTongs = useMemo(
    () =>
      [...tongList]
        .filter(t => t.unit_id === currentUnit.id)
        .sort((a, b) => a.nomor.localeCompare(b.nomor)),
    [tongList, currentUnit.id]
  );

  const activeTong =
    [...assignedTongs].sort((a, b) => b.berat_kg - a.berat_kg)[0] || null;

  const unitListings = listings.filter(l => l.unit_id === currentUnit.id);
  const recentListings = unitListings.slice(0, 3);

  // Rating mitra per setoran (biar dashboard langsung terlihat mana yang sudah dinilai).
  const ratingByListing = useMemo(() => {
    const map = new Map<string, number>();
    matchings.forEach(m => {
      if (m.listing_kertas_id && typeof m.rating === 'number') map.set(m.listing_kertas_id, m.rating);
    });
    return map;
  }, [matchings]);

  const totalUnitKg = currentUnit.total_kg_tersalurkan || 0;
  const totalUnitPoints = currentUnit.eco_points || 0;
  const totalBerat = assignedTongs.reduce((acc, t) => acc + t.berat_kg, 0);
  const totalKapasitas = assignedTongs.reduce((acc, t) => acc + t.kapasitas_max_kg, 0);
  const sisaKapasitas = Math.max(0, totalKapasitas - totalBerat);
  const filledCount = assignedTongs.filter(t => t.berat_kg > 0).length;
  const readyCount = assignedTongs.filter(t => getTongState(t) === 'siap_pickup').length;
  const availableCount = assignedTongs.filter(t => t.kapasitas_max_kg - t.berat_kg >= 10).length;
  const pohonSelamat = Math.round((totalUnitKg / 1000) * 17 * 10) / 10;

  const tongPercent = activeTong
    ? Math.min(100, Math.round((activeTong.berat_kg / Math.max(1, activeTong.kapasitas_max_kg)) * 100))
    : 0;
  const activeTongState = activeTong ? getTongState(activeTong) : 'kosong';
  const activeTongMeta = TONG_STATE_META[activeTongState];
  const activeTongSisa = activeTong ? Math.max(0, activeTong.kapasitas_max_kg - activeTong.berat_kg) : 0;

  const namaPanggilan =
    currentUser?.nama
      ?.replace(/^(?:(?:Dr|Ir|Bpk|Ibu|Bapak)\.\s*)+/i, '')
      .replace(/,\s*.*$/, '')
      .trim() ||
    currentUnit.pic_nama ||
    'Pengelola unit';

  const jamSekarang = new Date().getHours();
  const periodeHari =
    jamSekarang >= 5 && jamSekarang < 11
      ? 'Pagi'
      : jamSekarang < 15
        ? 'Siang'
        : jamSekarang < 19
          ? 'Sore'
          : 'Malam';
  const tanggalHariIni = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const heroSlides: HeroSlide[] = [
    {
      title: 'Kertas kampus, jadi kas unit.',
      subtitle: assignedTongs.length
        ? `${availableCount} dari ${assignedTongs.length} tong siap menerima setoran. Mulai dari 10 Kg per setoran.`
        : 'Belum ada tong terdaftar. Hubungi admin untuk mengaktifkan wadah unit.',
      cta: 'Setor kertas',
      route: '/unit/setor-kertas',
    },
    {
      title: 'Tong aman, jadwal lancar.',
      subtitle:
        readyCount > 0
          ? `${readyCount} tong sudah memenuhi kuota 10 Kg dan siap dijemput mitra industri.`
          : `Belum ada tong yang memenuhi kuota 10 Kg. Kurang ${Math.max(0, 10 - (activeTong?.berat_kg || 0))} Kg dari tong utama.`,
      cta: 'Cek status tong',
      route: '/unit/status',
    },
    {
      title: 'Tiap kilo, naik peringkat.',
      subtitle: `${totalUnitPoints.toLocaleString('id-ID')} Eco-Points dari ${totalUnitKg.toLocaleString('id-ID')} Kg kertas. Lihat posisi unit di papan peringkat.`,
      cta: 'Lihat peringkat',
      route: '/leaderboard',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const openGuide = () => {
    setShowHowToModal(true);
  };

  const kpiCards = [
    {
      label: 'Dana kas unit',
      value: `Rp ${saldoSekarang.toLocaleString('id-ID')}`,
      sub: 'Siap ditarik kapan saja',
      icon: 'account_balance_wallet',
      route: '/unit/dompet',
    },
    {
      label: 'Kertas tersalurkan',
      value: `${totalUnitKg.toLocaleString('id-ID')} Kg`,
      sub: `${unitListings.length} setoran · ${pohonSelamat.toLocaleString('id-ID')} pohon setara`,
      icon: 'description',
      route: '/unit/riwayat',
    },
    {
      label: 'Eco-Points',
      value: totalUnitPoints.toLocaleString('id-ID'),
      sub: '2 poin per kilogram',
      icon: 'eco',
      route: undefined,
    },
    {
      label: 'Tong siap jemput',
      value: `${readyCount}`,
      sub: `${filledCount} dari ${assignedTongs.length} tong terisi`,
      icon: 'inventory_2',
      route: '/unit/status',
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pb-24 font-sans text-[#1A2E22]">
      {/* Greeting */}
      <section aria-label="Sapaan" className="px-1">
        <p className="text-[11px] font-medium leading-snug text-[#8CA090]">{tanggalHariIni}</p>
        <h1 className="mt-2 leading-[1.08] tracking-tight text-[#1A2E22]">
          <span className="block text-[22px] font-medium">Selamat {periodeHari.toLowerCase()},</span>
          <span className="block break-words text-[26px] font-extrabold sm:text-[28px]">
            {namaPanggilan} <span aria-hidden="true">👋</span>
          </span>
        </h1>
        <p className="mt-2.5 text-[13px] leading-relaxed text-[#52645A]">
          Kelola setoran kertas unit dan pantau dampaknya bagi kampus.
        </p>
      </section>

      {/* Hero */}
      <section className="relative" aria-label="Ringkasan unit">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px] border border-[#52B788]/30 bg-gradient-to-br from-[#52B788] via-[#2D6A4F] to-[#174630] shadow-[0_18px_40px_rgba(23,70,48,0.22)]"
          aria-hidden="true"
        >
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#A7F3D0]/20 blur-3xl" />
          <div className="absolute right-16 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="relative z-10 flex min-h-[280px] items-end gap-2 px-4 pb-7 pt-5 sm:min-h-[300px] sm:px-5">
          <div className="min-w-0 flex-1 pb-1">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#D8F3DC] px-2.5 py-1 text-[10px] font-semibold text-[#174630] sm:text-[11px]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2D6A4F]" />
              {currentUnit.inisial} · Unit kampus
            </span>

            <h2
              key={`title-${heroIndex}`}
              className="mt-3 animate-in fade-in slide-in-from-bottom-1 text-[20px] font-extrabold leading-[1.08] tracking-tight text-white duration-300 min-[380px]:text-[24px] sm:text-[27px]"
            >
              {heroSlides[heroIndex].title}
            </h2>

            <p
              key={`subtitle-${heroIndex}`}
              className="mt-2 animate-in fade-in slide-in-from-bottom-1 text-[12px] font-normal leading-relaxed text-white/85 duration-300 sm:text-[13px]"
            >
              {heroSlides[heroIndex].subtitle}
            </p>

            <button
              onClick={() => {
                const target = heroSlides[heroIndex].route;
                if (target === '/unit/setor-kertas') {
                  const nextTong =
                    assignedTongs.find(t => t.kapasitas_max_kg - t.berat_kg >= 10) || assignedTongs[0];
                  if (nextTong) setPreselectTongId(nextTong.id);
                }
                setActiveRoute(target);
              }}
              className="mt-3 inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 text-[12px] font-bold text-[#174630] shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-colors hover:bg-[#D8F3DC] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 sm:px-3.5 sm:text-[13px]"
            >
              {heroSlides[heroIndex].cta}
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div
            className={`pointer-events-none relative flex ${HERO_MASCOT.frame} shrink-0 select-none flex-col items-center justify-end`}
            aria-hidden="true"
          >
            <div className="absolute bottom-1 h-4 w-24 rounded-full bg-black/25 blur-md sm:w-32" />
            <div className={`relative flex ${HERO_MASCOT.media} w-full items-end justify-center`}>
              <img
                src="/moni.png"
                alt=""
                className="animate-float-moni h-full w-full object-cover object-center"
                style={{ filter: 'drop-shadow(0 16px 20px rgba(10, 35, 22, 0.45))' }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-20 -mt-3 flex items-center gap-3 px-5 pb-4">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Pilih pesan beranda">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setHeroIndex(idx)}
                aria-label={`Pesan beranda ${idx + 1}`}
                aria-current={idx === heroIndex}
                className={`h-1.5 rounded-full transition-all ${
                  idx === heroIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
          <span className="ml-auto text-[10px] font-medium text-white/70">
            {heroIndex + 1} / {heroSlides.length}
          </span>
        </div>
      </section>

      {/* KPI panel */}
      <div className="relative overflow-hidden rounded-2xl border border-[#DDE7E0] bg-[#F2F7F4]">
        <div className="relative grid grid-cols-2">
          {kpiCards.map((card, idx) => {
            const shell = `bg-white/80 p-4 text-left transition-colors ${
              idx < 2 ? 'border-b' : ''
            } ${idx % 2 === 0 ? 'border-r' : ''} border-[#DDE7E0]`;

            const body = (
              <>
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="material-symbols-outlined text-[22px] text-[#2D6A4F]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {card.icon}
                  </span>
                  {card.route && (
                    <span className="material-symbols-outlined text-[15px] text-[#A8B6AC] transition-colors group-hover:text-[#2D6A4F]">
                      arrow_outward
                    </span>
                  )}
                </div>
                <div className="mt-2.5">
                  <div className="text-[11px] font-medium leading-snug text-[#52645A]">{card.label}</div>
                  <div className="mt-1 break-words text-[20px] font-extrabold leading-tight tracking-tight text-[#1A2E22] tabular-nums">
                    {card.value}
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium leading-snug text-[#8CA090]">{card.sub}</div>
                </div>
              </>
            );

            // Kartu tanpa tujuan (mis. Eco-Points) hanya informatif, tidak bisa diklik.
            if (!card.route) {
              return (
                <div key={card.label} className={shell}>
                  {body}
                </div>
              );
            }

            return (
              <button
                key={card.label}
                type="button"
                onClick={() => {
                  if (card.route === '/unit/riwayat') setSelectedListingId(null);
                  setActiveRoute(card.route as string);
                }}
                className={`group hover:bg-white ${shell}`}
              >
                {body}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tong utama */}
      <section className="space-y-3" aria-label="Tong utama unit">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-lg text-[#2D6A4F]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              inventory_2
            </span>
            <h2 className="text-sm font-extrabold text-[#1A2E22]">Tong unit</h2>
            <span className="rounded-full bg-[#F2F7F4] px-2 py-0.5 text-[10px] font-extrabold text-[#52645A]">
              {assignedTongs.length} wadah
            </span>
          </div>
          <button
            onClick={() => setActiveRoute('/unit/status')}
            className="flex items-center gap-0.5 text-[11px] font-bold text-[#2D6A4F] hover:underline"
          >
            Kelola tong
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>

        {activeTong ? (
          <div className="space-y-3 rounded-[24px] border border-[#2D6A4F]/10 bg-white p-4 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D8F3DC] text-[#174630]">
                  <span className="material-symbols-outlined text-2xl">inventory_2</span>
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-[13px] font-extrabold text-[#1A2E22]">{activeTong.nama_tong}</h3>
                  <p className="mt-0.5 flex items-start gap-1 text-[11px] font-medium text-[#6B7C70]">
                    <span className="material-symbols-outlined mt-0.5 text-[13px]">location_on</span>
                    <span className="line-clamp-2">{activeTong.lokasi_spesifik}</span>
                  </p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${activeTongMeta.className}`}
              >
                {activeTongMeta.label}
              </span>
            </div>

            <div className="rounded-2xl border border-[#2D6A4F]/8 bg-[#F7FAF8] p-3.5">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="font-medium text-[#52645A]">Kapasitas terisi</span>
                <span className="font-extrabold text-[#1A2E22] tabular-nums">
                  {activeTong.berat_kg} / {activeTong.kapasitas_max_kg} Kg
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#DDE7E0]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    tongPercent >= 80 ? 'bg-[#E9A23B]' : 'bg-[#2D6A4F]'
                  }`}
                  style={{ width: `${Math.max(activeTong.berat_kg > 0 ? 5 : 0, tongPercent)}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 text-[10px] font-medium">
                <span className="text-[#6B7C70]">{tongPercent}% terpakai</span>
                <span className={activeTongSisa > 0 ? 'text-[#2D6A4F]' : 'text-[#C0392B]'}>
                  {activeTongSisa > 0 ? `Sisa ${activeTongSisa} Kg` : 'Wadah penuh'}
                </span>
              </div>
            </div>

            {assignedTongs.length > 1 && (
              <div className="flex flex-wrap gap-1.5" aria-label="Status seluruh tong">
                {assignedTongs.map(t => {
                  const state = getTongState(t);
                  return (
                    <span
                      key={t.id}
                      className={`rounded-full border px-2 py-1 text-[10px] font-bold tabular-nums ${TONG_STATE_META[state].className}`}
                    >
                      {t.nomor}
                    </span>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                onClick={() => {
                  if (activeTong) setPreselectTongId(activeTong.id);
                  setActiveRoute('/unit/setor-kertas');
                }}
                className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-full bg-[#2D6A4F] px-3 text-[12px] font-extrabold text-white shadow-md transition-all hover:bg-[#1A4235] active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Setor ke tong
              </button>
              <button
                onClick={() => openGuide()}
                className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-[#2D6A4F]/20 bg-white px-3 text-[12px] font-extrabold text-[#2D6A4F] transition-colors hover:bg-[#F2F7F4]"
              >
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
                Panduan setor
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#2D6A4F]/25 bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F7F4] text-[#2D6A4F]">
              <span className="material-symbols-outlined text-2xl">inventory_2</span>
            </div>
            <p className="mt-3 text-sm font-extrabold text-[#1A2E22]">Belum ada tong terdaftar</p>
            <p className="mt-1 text-[12px] leading-relaxed text-[#52645A]">
              Admin perlu mengaktifkan wadah untuk unit {currentUnit.inisial} sebelum setoran pertama.
            </p>
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-3 gap-2.5" aria-label="Aksi cepat">
        <button
          onClick={() => setActiveRoute('/unit/dompet')}
          className="group flex flex-col items-center gap-2 rounded-2xl border border-[#2D6A4F]/10 bg-white px-2 py-3.5 text-center shadow-xs transition-all hover:border-[#2D6A4F]/25 hover:shadow-sm"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D8F3DC] text-[#174630] transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[21px]">account_balance_wallet</span>
          </span>
          <span className="text-[11px] font-extrabold leading-tight text-[#1A2E22]">Dompet kas</span>
        </button>
        <button
          onClick={() => setActiveRoute('/unit/profil')}
          className="group flex flex-col items-center gap-2 rounded-2xl border border-[#2D6A4F]/10 bg-white px-2 py-3.5 text-center shadow-xs transition-all hover:border-[#2D6A4F]/25 hover:shadow-sm"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F7F4] text-[#2D6A4F] transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[21px]">manage_accounts</span>
          </span>
          <span className="text-[11px] font-extrabold leading-tight text-[#1A2E22]">Profil unit</span>
        </button>
        <button
          onClick={() => setActiveRoute('/leaderboard')}
          className="group flex flex-col items-center gap-2 rounded-2xl border border-[#2D6A4F]/10 bg-white px-2 py-3.5 text-center shadow-xs transition-all hover:border-[#2D6A4F]/25 hover:shadow-sm"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF3C7] text-[#8A5A12] transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[21px]">trophy</span>
          </span>
          <span className="text-[11px] font-extrabold leading-tight text-[#1A2E22]">Peringkat</span>
        </button>
      </section>

      {/* Setoran terbaru */}
      <section className="scroll-mt-24 space-y-3" aria-label="Setoran terbaru">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-lg text-[#2D6A4F]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              receipt_long
            </span>
            <h2 className="text-sm font-extrabold text-[#1A2E22]">Setoran terbaru</h2>
            {unitListings.length > 0 && (
              <span className="rounded-full bg-[#F2F7F4] px-2 py-0.5 text-[10px] font-extrabold text-[#52645A]">
                {unitListings.length}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setSelectedListingId(null);
              setActiveRoute('/unit/riwayat');
            }}
            className="flex items-center gap-0.5 text-[11px] font-bold text-[#2D6A4F] hover:underline"
          >
            Riwayat lengkap
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>

        {recentListings.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#2D6A4F]/25 bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F7F4] text-[#2D6A4F]">
              <span className="material-symbols-outlined text-2xl">receipt_long</span>
            </div>
            <p className="mt-3 text-sm font-extrabold text-[#1A2E22]">Belum ada setoran tercatat</p>
            <p className="mx-auto mt-1 max-w-[280px] text-[12px] leading-relaxed text-[#52645A]">
              Setoran pertama akan muncul di sini beserta berat, kategori, dan statusnya.
            </p>
            <button
              onClick={() => setActiveRoute('/unit/setor-kertas')}
              className="mt-3 inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#2D6A4F] px-4 text-[12px] font-extrabold text-white transition-colors hover:bg-[#1A4235]"
            >
              <span className="material-symbols-outlined text-[17px]">add_circle</span>
              Setor kertas pertama
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {recentListings.map(item => {
              const statusMeta = STATUS_LISTING_META[item.status] || STATUS_LISTING_META.menunggu_mitra;
              const rating = ratingByListing.get(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedListingId(item.id);
                    setActiveRoute('/unit/riwayat');
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#2D6A4F]/10 bg-white p-3.5 text-left shadow-xs transition-colors hover:border-[#2D6A4F]/25 hover:bg-[#F7FAF8] focus-visible:outline-2 focus-visible:outline-[#2D6A4F] focus-visible:outline-offset-2"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/5 bg-[#F2F7F4] text-[#2D6A4F]">
                      <span className="material-symbols-outlined text-[19px]">description</span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-extrabold text-[#1A2E22]">
                        {item.kategori_label}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] font-medium text-[#6B7C70]">
                        {item.jumlah_kg} Kg · {item.tong_nama} · {item.tanggal_post}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5">
                        {typeof rating === 'number' ? (
                          <>
                            <span className="material-symbols-outlined text-[13px] text-[#C27D3A]">star</span>
                            <span className="text-[10px] font-extrabold text-[#C27D3A] tabular-nums">
                              {rating.toFixed(1)} · dinilai mitra
                            </span>
                          </>
                        ) : (
                          <span className="rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[9px] font-extrabold text-[#8A5A12]">
                            Belum dinilai mitra
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${statusMeta.className}`}>
                      {statusMeta.label}
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-[#A8B6AC]">chevron_right</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Panduan modal */}
      <PaperGuideModal
        open={showHowToModal}
        category={null}
        unitInisial={currentUnit.inisial}
        onClose={() => setShowHowToModal(false)}
      />
    </div>
  );
};
