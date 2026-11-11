import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND, HARGA_PER_KG } from '../data/initialData';
import { QcChips } from '../components/QcChips';
import { HERO_MASCOT } from '../lib/mascot';
import { MatchingTransaksi } from '../types';

/* --- Sparkline mini --- */
const MiniBar: React.FC<{ value: number; max: number; color: string }> = ({ value, max, color }) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
};

type TabMode = 'saran' | 'manual';

const KATEGORI_LABELS: Record<string, string> = {
  hvs: 'HVS / Arsip',
  kardus: 'Kardus',
  koran: 'Koran / Majalah',
  campur: 'Campuran',
};

export const PerusahaanDashboardView: React.FC = () => {
  const {
    matchings,
    listings,
    units,
    currentUser,
    setSelectedMatchingId,
    setSelectedListingId,
    setActiveRoute,
  } = useApp();

  const [tabMode, setTabMode] = useState<TabMode>('saran');
  const [filterKategori, setFilterKategori] = useState<string>('semua');
  const [successCelebration, setSuccessCelebration] = useState<string | null>(null);
  const [pesanIndex, setPesanIndex] = useState(0);

  const selesai = matchings.filter(m => m.status === 'sudah_diambil');
  const pending = matchings.filter(m => m.status === 'menunggu_diambil');
  const totalKg = selesai.reduce((acc, m) => acc + m.jumlah_kg, 0);
  const totalNilai = selesai.reduce((acc, m) => acc + m.nilai_rupiah, 0);
  const pendingKg = pending.reduce((acc, m) => acc + m.jumlah_kg, 0);
  const availableListings = listings.filter(l => l.status !== 'sudah_diambil');
  const namaPerusahaan = currentUser?.nama?.replace(' (Dispatcher)', '').replace(/\(NIB:.*\)/, '').trim() || 'PT Mandiri Daur Lestari';

  const jamSekarang = new Date().getHours();
  const periodeHari = jamSekarang >= 5 && jamSekarang < 11 ? 'Pagi' : jamSekarang < 15 ? 'Siang' : jamSekarang < 19 ? 'Sore' : 'Malam';
  const salam = `Selamat ${periodeHari.toLowerCase()}`;
  const tanggalHariIni = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

  const pesanPasokan = [
    pending.length > 0
      ? `${pending.length} batch siap dijemput dengan total ${pendingKg.toLocaleString('id-ID')} Kg.`
      : 'Belum ada batch menunggu. Saran sistem akan muncul otomatis.',
    'Setiap 1 ton kertas daur ulang membantu menyelamatkan sekitar 17 pohon.',
    'Kertas kering dan terpilah meningkatkan nilai jual hingga 20%.',
    'Eco-Points unit kampus bertambah 2 poin untuk setiap kilogram kertas.',
    'Jadwalkan penjemputan sebelum kuota mingguan unit terpenuhi.',
  ];

  // Slide carousel mitra purely informatif. Action "Posting kebutuhan" dipisah
  // ke card tersendiri supaya tidak ketuker dengan tombol lain di hero.
  type HeroAction = { type: 'scroll'; target: 'kebutuhan-aktif' | 'pasokan-manual' };
  const heroSlides: { title: string; subtitle: string; cta: string; action: HeroAction }[] = [
    { title: 'Kertas. Teman Baru.', subtitle: pesanPasokan[0], cta: 'Lihat Kebutuhan Aktif', action: { type: 'scroll', target: 'kebutuhan-aktif' } },
    { title: 'Selamatkan Pohon.', subtitle: pesanPasokan[1], cta: 'Lihat Pasokan', action: { type: 'scroll', target: 'kebutuhan-aktif' } },
    { title: 'Kuota Aman.', subtitle: pesanPasokan[4], cta: 'Jadwalkan Pickup', action: { type: 'scroll', target: 'pasokan-manual' } },
  ];

  const handleHeroAction = (action: HeroAction) => {
    if (action.target === 'pasokan-manual') {
      setTabMode('manual');
    }
    requestAnimationFrame(() => {
      document.getElementById(action.target)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  // Mina menjadi maskot tetap Mitra Industri.
  const mascot = { src: '/mina.png', floatClass: 'animate-float-mina' };

  useEffect(() => {
    const timer = setInterval(() => {
      setPesanIndex(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const statCards = [
    { label: 'Total kertas diterima', value: `${totalKg.toLocaleString('id-ID')} Kg`, sub: `${selesai.length} transaksi selesai`, icon: 'description' },
    { label: 'Total nilai transaksi', value: `Rp ${totalNilai.toLocaleString('id-ID')}`, sub: 'Berdasarkan berat · harga/kg', icon: 'toll' },
    { label: 'Menunggu diambil', value: `${pending.length} Batch`, sub: `${pendingKg} Kg siap dijemput`, icon: 'hourglass_top' },
    { label: 'Listing tersedia', value: `${availableListings.length}`, sub: 'Siap dicocokkan di sistem', icon: 'view_list' },
  ];

  const pendingMatchings = matchings.filter(m => m.status === 'menunggu_diambil');
  const primaryMatch = pendingMatchings[0] || matchings[0];

  const handleJadwalkan = (matchingId: string) => {
    setSelectedMatchingId(matchingId);
    setActiveRoute('/perusahaan/jadwal');
  };

  const filteredListings =
    filterKategori === 'semua' ? availableListings : availableListings.filter(l => l.kategori === filterKategori);

  const handleLihatDetail = (listingId: string) => {
    setSelectedListingId(listingId);
    setActiveRoute('/perusahaan/listing-detail');
  };

  return (
    <div className="w-full pb-24 max-w-xl mx-auto space-y-4">

      {/* Greeting — mengikuti referensi: sapaan besar + sub-teks abu */}
      <section aria-label="Sapaan" className="px-1">
        <p className="text-[11px] font-medium text-[#8CA090] leading-snug">{tanggalHariIni}</p>
        <h1 className="mt-2 leading-[1.08] tracking-tight text-[#1A2E22]">
          <span className="block text-[22px] font-medium">{salam},</span>
          <span className="block text-[26px] sm:text-[28px] font-extrabold break-words">
            {namaPerusahaan} <span aria-hidden="true">👋</span>
          </span>
        </h1>
        <p className="mt-2.5 text-[13px] leading-relaxed text-[#52645A]">
          Satu langkah kecil hari ini, untuk bumi yang lebih baik.
        </p>
      </section>

      {/* Hero Header — palet mitra (coklat/amber seperti form registrasi), tipografi sama seperti greeting */}
      <section className="relative" aria-label="Ringkasan pasokan">
        <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-[#F4A261] via-[#C27D3A] to-[#A0632B] border border-[#F4A261]/30 shadow-[0_18px_40px_rgba(62,39,20,0.22)] overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FDE68A]/20 blur-3xl" />
          <div className="absolute right-16 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="relative z-10 flex min-h-[280px] sm:min-h-[300px] items-end gap-2 px-5 pt-5 pb-7">
          <div className="flex-1 min-w-0 pb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] px-2.5 py-1 text-[11px] font-semibold text-[#1A2E22] whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C27D3A] animate-pulse" />
              Matching aktif
            </span>

            <h2
              key={`title-${pesanIndex}`}
              className="mt-3 text-[24px] sm:text-[27px] leading-[1.08] font-extrabold tracking-tight text-white animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
              {heroSlides[pesanIndex].title}
            </h2>

            <p
              key={`subtitle-${pesanIndex}`}
              className="mt-2 text-[13px] font-normal leading-relaxed text-white/85 animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
              {heroSlides[pesanIndex].subtitle}
            </p>

            <button
              onClick={() => handleHeroAction(heroSlides[pesanIndex].action)}
              className="mt-3 inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-white px-3.5 text-[13px] font-bold text-[#A0632B] shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-colors hover:bg-[#FEF3C7] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 whitespace-nowrap"
            >
              {heroSlides[pesanIndex].cta}
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Maskot Mitra Industri: Mina */}
          <div className={`relative shrink-0 ${HERO_MASCOT.frame} flex flex-col items-center justify-end select-none pointer-events-none`} aria-hidden="true">
            <div className="absolute bottom-1 w-32 h-4 bg-black/25 rounded-full blur-md" />
            <div className={`relative w-full ${HERO_MASCOT.media} flex items-end justify-center`}>
              <img
                key={mascot.src}
                src={mascot.src}
                alt=""
                className={`h-full w-full object-cover object-center ${mascot.floatClass} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                style={{ filter: 'drop-shadow(0 16px 20px rgba(62, 39, 20, 0.45))' }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-20 flex items-center gap-3 px-5 pb-4 -mt-3">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Pilih pesan hero">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPesanIndex(idx)}
                aria-label={`Pesan hero ${idx + 1}`}
                aria-current={idx === pesanIndex}
                className={`h-1.5 rounded-full transition-all ${idx === pesanIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/60'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stat Cards — satu panel dibagi garis hairline */}
      <div className="relative overflow-hidden rounded-2xl border border-[#E0E5E2] bg-[#FFF8EE]">
        <div className="relative grid grid-cols-2">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className={`bg-white/70 p-4 ${idx < 2 ? 'border-b' : ''} ${idx % 2 === 0 ? 'border-r' : ''} border-[#E0E5E2]`}
            >
              <span className="material-symbols-outlined block text-[22px] text-[#C27D3A]" style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
              <div className="mt-2.5">
                <div className="text-[11px] font-medium text-[#52645A] leading-snug">{card.label}</div>
                <div className="mt-1 text-[20px] font-extrabold tracking-tight text-[#1A2E22] leading-tight tabular-nums">{card.value}</div>
                <div className="mt-0.5 text-[11px] font-medium text-[#8CA090] leading-snug">{card.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pasokan Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#C27D3A] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>recycling</span>
          <h2 className="text-sm font-extrabold text-[#1A2E22]">Pasokan Kertas</h2>
          {pendingMatchings.length > 0 && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#A0632B]">{pendingMatchings.length} pending</span>
          )}
        </div>
      </div>

      {/* Company Demand Banner */}
      <div id="kebutuhan-aktif" className="relative overflow-hidden rounded-[24px] p-4 border border-[#F4A261]/30 shadow-[0_18px_40px_rgba(62,39,20,0.22)] bg-gradient-to-br from-[#F4A261] via-[#C27D3A] to-[#A0632B] space-y-3 scroll-mt-28">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FDE68A]/20 blur-3xl" />
          <div className="absolute right-16 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        </div>
        <div className="relative z-10 flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#FEF3C7] text-[#A0632B] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">layers</span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[#FEF3C7]">Kebutuhan aktif saya</p>
            <span className="block text-xs font-bold text-white truncate mt-0.5">{namaPerusahaan}</span>
            <span className="text-[11px] text-white/85 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#FEF3C7] animate-pulse" />
              Sistem Matching Otomatis Aktif
            </span>
          </div>
        </div>
        <div className="relative z-10 p-3 bg-white rounded-xl text-xs space-y-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[#52645A] gap-1">
            <span>Permintaan Aktif:</span>
            <strong className="text-[#1A2E22]">Min 100 kg/minggu (HVS/Arsip & Kardus)</strong>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[#52645A] gap-1">
            <span>Kriteria QC:</span>
            <strong className="text-[#A0632B]">Kadar Air =12%, Terikat Rapi & Bebas Residu</strong>
          </div>
        </div>
      </div>

      {/* Card terpisah: Posting kebutuhan */}
      <section
        aria-label="Posting kebutuhan"
        className="rounded-[20px] border border-[#C27D3A]/15 bg-white p-4 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7] text-[#A0632B]">
            <span className="material-symbols-outlined text-[21px]">post_add</span>
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[13px] font-extrabold text-[#1A2E22]">Posting Kebutuhan</h2>
            <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-[#52645A]">
              Tentukan kuota dan spesifikasi bahan baku agar sistem bisa mencocokkan dengan tong unit kampus.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setActiveRoute('/perusahaan/permintaan-baru')}
          className="mt-3 flex w-full min-h-[44px] items-center justify-center gap-1.5 rounded-full bg-[#C27D3A] text-[12px] font-extrabold text-white shadow-sm transition-colors hover:bg-[#A0632B]"
        >
          <span className="material-symbols-outlined text-[17px]">edit</span>
          Buat / Perbarui Kebutuhan
        </button>
      </section>

      {/* Mode Toggle */}
      <div id="pasokan-manual" className="bg-[#F1EEE5] p-1 rounded-xl flex items-center gap-1 scroll-mt-28">
        <button
          onClick={() => setTabMode('saran')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${tabMode === 'saran' ? 'bg-white text-[#C27D3A] shadow-xs' : 'text-[#52645A]'}`}
        >
          <span className="material-symbols-outlined text-sm">lightbulb</span>
          Saran Sistem
          {pendingMatchings.length > 0 && (
            <span className="px-1.5 bg-[#FEF3C7] text-[#A0632B] text-[9px] font-extrabold rounded-full">{pendingMatchings.length}</span>
          )}
        </button>
        <button
          onClick={() => setTabMode('manual')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${tabMode === 'manual' ? 'bg-white text-[#C27D3A] shadow-xs' : 'text-[#52645A]'}`}
        >
          <span className="material-symbols-outlined text-sm">explore</span>
          Jelajah Manual
          <span className="px-1.5 bg-gray-200 text-gray-600 text-[9px] font-extrabold rounded-full">{availableListings.length}</span>
        </button>
      </div>

      {/* TAB: SARAN SISTEM */}
      {tabMode === 'saran' && (
        <>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#C27D3A]/10 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#C27D3A] text-lg">lightbulb</span>
                <h3 className="text-sm font-bold text-[#1A2E22]">Pencocokan Otomatis Sistem</h3>
              </div>
              <span className="text-[10px] font-bold text-[#A0632B] bg-[#FEF3C7] px-2 py-0.5 rounded-full">{pendingMatchings.length} Rekomendasi</span>
            </div>
            {pendingMatchings.length === 0 && (
              <div className="p-4 bg-[#FAFAF7] rounded-xl text-center text-xs text-[#52645A] space-y-1">
                <span className="material-symbols-outlined text-2xl text-gray-300 block">inbox</span>
                <span>Belum ada rekomendasi saat ini. Coba jelajah listing manual di tab sebelah.</span>
              </div>
            )}
            <div className="space-y-3">
              {pendingMatchings.map((match, idx) => (
                <div key={match.id} className={`p-3.5 rounded-xl border space-y-2.5 ${idx === 0 ? 'bg-[#FAFAF7] border-[#C27D3A]/20' : 'bg-[#FAFAF7] border-gray-200'}`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${match.skor_kecocokan >= 95 ? 'bg-[#FEF3C7] text-[#A0632B]' : 'bg-[#FDE68A] text-[#A0632B]'}`}>
                      <span className="material-symbols-outlined text-xs">verified</span>
                      {match.skor_kecocokan}% Kecocokan Kriteria
                    </span>
                    <span className="text-xs font-bold text-[#C27D3A]">{match.tong_nama}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    {(() => {
                      const relatedListing = listings.find(l => l.id === match.listing_kertas_id);
                      return relatedListing?.foto ? (
                        <img src={relatedListing.foto} alt="Kertas" className="w-16 h-16 rounded-lg object-cover shrink-0 border border-white shadow-xs" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-[#FDE68A] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[#A0632B] text-2xl">inventory_2</span>
                        </div>
                      );
                    })()}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#1A2E22]">{match.jenis_kertas}</h4>
                      <p className="text-[11px] text-[#52645A] mt-0.5">{match.unit_nama}</p>
                      <span className="text-[10px] text-[#C27D3A] font-semibold flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[12px]">location_on</span>
                        Drop Point Gedung Serbaguna Kampus UPJ
                      </span>
                      <span className="text-[10px] text-[#A0632B] font-bold block mt-0.5">Rp {match.nilai_rupiah.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  {(() => {
                    const relatedListing = listings.find(l => l.id === match.listing_kertas_id);
                    if (!relatedListing) return null;
                    return (
                      <div className="flex flex-wrap gap-1">
                        <QcChips listing={relatedListing} max={2} />
                      </div>
                    );
                  })()}
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleJadwalkan(match.id)} className={`py-2.5 px-3 rounded-lg text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all ${idx === 0 ? 'bg-[#C27D3A] hover:bg-[#A0632B]' : 'bg-[#C27D3A] hover:bg-[#92400E]'}`}>
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span>Jadwalkan</span>
                    </button>
                    <button
                      onClick={() => { const rel = listings.find(l => l.id === match.listing_kertas_id); if (rel) { setSelectedListingId(rel.id); setActiveRoute('/perusahaan/listing-detail'); } }}
                      className="py-2.5 px-3 rounded-lg bg-white border border-gray-200 text-[#52645A] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">info</span>
                      <span>Lihat Detail</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </>
      )}

      {/* TAB: JELAJAH MANUAL */}
      {tabMode === 'manual' && (
        <>
          <div className="p-3 bg-[#FAFAF7] border border-[#C27D3A]/15 rounded-xl text-xs text-[#52645A] flex items-start gap-2">
            <span className="material-symbols-outlined text-[#C27D3A] text-base shrink-0 mt-0.5">info</span>
            <span>Mode Jelajah Manual: Anda bisa memilih listing kertas mana pun yang tersedia tanpa perlu menunggu saran dari sistem.</span>
          </div>
          <div className="bg-[#F1EEE5] p-1 rounded-xl flex items-center gap-1 text-xs overflow-x-auto">
            {(['semua', 'hvs', 'kardus', 'koran', 'campur'] as const).map(kat => (
              <button key={kat} onClick={() => setFilterKategori(kat)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg font-semibold transition-all ${filterKategori === kat ? 'bg-white text-[#C27D3A] shadow-xs' : 'text-[#52645A]'}`}>
                {kat === 'semua' ? 'Semua' : KATEGORI_LABELS[kat]}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-xs text-[#52645A]">Menampilkan <strong className="text-[#1A2E22]">{filteredListings.length}</strong> listing tersedia</span>
            {filterKategori !== 'semua' && (
              <button onClick={() => setFilterKategori('semua')} className="text-xs text-[#C27D3A] font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-sm">close</span>Reset filter
              </button>
            )}
          </div>
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center space-y-2 border border-dashed border-gray-200">
              <span className="material-symbols-outlined text-4xl text-gray-300">inventory_2</span>
              <p className="text-sm text-gray-400">Tidak ada listing yang cocok dengan filter ini.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredListings.map(listing => {
                const isAvailable = listing.status !== 'sudah_diambil';
                return (
                  <div key={listing.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#C27D3A]/8">
                    <div className="relative h-36 bg-gray-100">
                      <img src={listing.foto} alt={listing.kategori_label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <span className="text-white text-sm font-extrabold">{listing.jumlah_kg} Kg</span>
                        <span className="text-white/80 text-xs ml-2">{listing.kategori_label}</span>
                      </div>
                    </div>
                    <div className="p-3.5 space-y-2.5">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xs font-bold text-[#1A2E22]">{listing.unit_nama}</h3>
                          <p className="text-[11px] text-[#52645A] mt-0.5">{listing.tanggal_post}</p>
                        </div>
                        <span className="text-[10px] font-extrabold text-[#C27D3A] bg-[#FFDBC8] px-2 py-0.5 rounded-full shrink-0">{listing.tong_nama}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <QcChips listing={listing} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button onClick={() => handleLihatDetail(listing.id)} className="py-2.5 px-3 rounded-lg bg-[#FAFAF7] text-[#C27D3A] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#ECE8DF] transition-all border border-[#C27D3A]/20">
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                          <span>Lihat Detail</span>
                        </button>
                        <button disabled={!isAvailable} onClick={() => { handleLihatDetail(listing.id); }} className="py-2.5 px-3 rounded-lg bg-[#C27D3A] hover:bg-[#A0632B] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          <span>Pilih & Jadwal</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Referensi Harga */}
      <div className="bg-[#F7FAF7] rounded-2xl p-4 shadow-sm border border-[#C27D3A]/10 space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#C27D3A] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>price_check</span>
          <h2 className="text-sm font-bold text-[#1A2E22]">Harga Beli per Kategori (Rp/Kg)</h2>
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'HVS / Arsip', kat: 'hvs' as const, icon: 'description', max: 2500 },
            { label: 'Kardus', kat: 'kardus' as const, icon: 'inventory_2', max: 2500 },
            { label: 'Koran / Majalah', kat: 'koran' as const, icon: 'newspaper', max: 2500 },
            { label: 'Campuran', kat: 'campur' as const, icon: 'layers', max: 2500 },
          ].map(item => (
            <div key={item.kat} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#52645A]">
                  <span className="material-symbols-outlined text-sm text-[#C27D3A]">{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                </div>
                <span className="font-extrabold text-[#C27D3A]">Rp {HARGA_PER_KG[item.kat].toLocaleString('id-ID')}</span>
              </div>
              <MiniBar value={HARGA_PER_KG[item.kat]} max={item.max} color="#C27D3A" />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#52645A] italic">Harga ditetapkan per siklus. Nilai transaksi = berat timbangan · harga kategori.</p>
      </div>

      {/* Drop Point Info */}
      <a
        href={APP_BRAND.dropPointUtama.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Buka lokasi Drop Point Kampus UPJ di Google Maps"
        className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-[#C27D3A]/10 hover:border-[#C27D3A]/35 transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
      >
        <div className="relative h-32 bg-gray-100">
          <img src={APP_BRAND.dropPointUtama.mapImg} alt="Drop Point Kampus UPJ" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
            <div>
              <span className="text-white text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[#FEF3C7] text-sm">location_on</span>
                {APP_BRAND.dropPointUtama.nama}
              </span>
              <p className="text-white/70 text-[10px] mt-0.5">{APP_BRAND.dropPointUtama.alamat}</p>
            </div>
          </div>
        </div>
        <div className="p-3 flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[#52645A] block">{APP_BRAND.dropPointUtama.deskripsi}</span>
            <span className="text-[#C27D3A] font-bold">Akses: Gerbang Barat UPJ</span>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-[#C27D3A]">
            <span className="material-symbols-outlined text-[14px]">map</span>
            Google Maps
            <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-0.5">
              arrow_forward
            </span>
          </span>
        </div>
      </a>

    </div>
  );
};
