import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';
import { QcChips } from '../components/QcChips';

const KONDISI_ICON: Record<string, string> = {
  'Kering': 'water_drop',
  'Basah': 'water_drop',
  'Bebas': 'block',
  'Kadar': 'humidity_percentage',
  'diikat': 'package_2',
  'rapi': 'done_all',
};

const getKondisiIcon = (kondisi: string): string => {
  for (const [key, icon] of Object.entries(KONDISI_ICON)) {
    if (kondisi.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return 'check_circle';
};

export const PerusahaanListingDetailView: React.FC = () => {
  const {
    listings,
    units,
    selectedListingId,
    setSelectedMatchingId,
    matchings,
    setActiveRoute,
    permintaanList,
  } = useApp();

  const listing = listings.find(l => l.id === selectedListingId) || listings[0];
  const unit = units.find(u => u.id === listing?.unit_id);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmDone, setConfirmDone] = useState(false);

  if (!listing) {
    return (
      <div className="w-full pb-20 max-w-xl mx-auto space-y-4">
        <div className="bg-[#F7FAF7] rounded-[16px] p-6 border border-[#C27D3A]/10 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-white text-[#C27D3A] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">inventory_2</span>
          </div>
          <h2 className="text-sm font-bold text-[#1A2E22]">Listing Tidak Ditemukan</h2>
          <p className="text-xs text-[#52645A] leading-relaxed max-w-xs mx-auto">
            Silakan kembali ke halaman Pasokan dan pilih listing yang ingin dilihat.
          </p>
          <button
            onClick={() => setActiveRoute('/perusahaan/matching')}
            className="min-h-[44px] px-4 rounded-[10px] bg-[#C27D3A] hover:bg-[#A0632B] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Kembali ke Pasokan
          </button>
        </div>
      </div>
    );
  }

  const existingMatch = matchings.find(m => m.listing_kertas_id === listing.id || m.id === listing.matching_id);

  const handlePilihDanJadwalkan = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      let matchId = existingMatch?.id;
      if (!matchId && listing.matching_id) matchId = listing.matching_id;

      if (matchId) {
        setSelectedMatchingId(matchId);
      } else {
        const perm = permintaanList[0];
        setSelectedMatchingId(perm?.id || null);
      }
      setConfirmLoading(false);
      setConfirmDone(true);
      setTimeout(() => {
        setActiveRoute('/perusahaan/jadwal');
      }, 1000);
    }, 600);
  };

  const statusStyles =
    listing.status === 'siap_pickup'
      ? 'bg-[#FEF3C7] text-[#A0632B] border-[#F4A261]/40'
      : listing.status === 'sudah_diambil'
      ? 'bg-white/85 text-[#52645A] border-white/60'
      : 'bg-[#FEF3C7] text-[#92400E] border-[#C27D3A]/30';

  const statusIcon =
    listing.status === 'siap_pickup'
      ? 'check_circle'
      : listing.status === 'sudah_diambil'
      ? 'inventory_2'
      : 'schedule';

  const statusLabel =
    listing.status === 'siap_pickup'
      ? 'Siap Diambil'
      : listing.status === 'sudah_diambil'
      ? 'Sudah Diambil'
      : 'Menunggu Mitra';

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4 font-sans text-[#1A2E22]">
      <button
        onClick={() => setActiveRoute('/perusahaan/matching')}
        className="inline-flex items-center gap-1.5 min-h-[44px] pl-2 pr-3 -ml-1 rounded-full text-[11px] font-bold text-[#C27D3A] hover:bg-[#FFF8EE] active:bg-[#FEF3C7] transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Kembali ke Pasokan
      </button>

      <section className="relative overflow-hidden rounded-[20px] bg-[#A0632B] p-5 text-white border border-[#F4A261]/30 shadow-sm">
        <div
          className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#F4A261]/20 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#FDE68A]">
                Listing Kertas
              </p>
              <h1 className="mt-1 text-xl font-bold tracking-tight leading-tight text-white">
                {listing.kategori_label}
              </h1>
              <p className="mt-1 text-xs text-white/70 leading-relaxed">
                Diposting {listing.tanggal_post} · {APP_BRAND.dropPointUtama.lokasiSingkat}
              </p>
            </div>
            <span
              className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusStyles}`}
            >
              <span className="material-symbols-outlined text-[13px]">{statusIcon}</span>
              {statusLabel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-white/15 pt-4">
            <div className="min-w-0">
              <span className="text-[11px] text-white/65 block">Berat tersedia</span>
              <p className="text-xl font-bold tabular-nums leading-tight mt-0.5">
                {listing.jumlah_kg.toLocaleString('id-ID')}{' '}
                <span className="text-sm font-medium text-[#FDE68A]">Kg</span>
              </p>
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-white/65 block">Titik ambil</span>
              <p className="text-sm font-bold leading-snug mt-0.5 truncate" title={APP_BRAND.dropPointUtama.nama}>
                Drop Point Kampus UPJ
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="relative h-56 overflow-hidden rounded-[16px] border border-[#C27D3A]/10 bg-[#E8EDE9] shadow-sm">
        <img
          src={listing.foto}
          alt={`Foto kertas ${listing.kategori_label}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3.5">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
              <span className="material-symbols-outlined text-[12px]">location_on</span>
              Drop Point Kampus UPJ
            </span>
            <p className="mt-1 text-white text-xs font-bold truncate">{APP_BRAND.dropPointUtama.lokasiSingkat}</p>
          </div>
          <span className="shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm tabular-nums">
            {listing.jumlah_kg.toLocaleString('id-ID')} Kg
          </span>
        </div>
      </div>

      <section className="rounded-[16px] border border-[#C27D3A]/10 bg-[#F7FAF7] p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#C27D3A]">verified</span>
            Kondisi & Kualitas
          </h2>
          <span className="text-[10px] font-semibold text-[#8CA090]">
            {listing.kondisi.length} poin
          </span>
        </div>
        <QcChips listing={listing} max={4} />
        <ul className="space-y-2">
          {listing.kondisi.map((k, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-[#3F4943] leading-relaxed">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-white text-[#C27D3A] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[14px]">{getKondisiIcon(k)}</span>
              </span>
              <span>{k}</span>
            </li>
          ))}
        </ul>
      </section>

      {unit && (
        <section className="rounded-[16px] border border-[#C27D3A]/10 bg-[#F7FAF7] p-4 space-y-3">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#C27D3A]">insights</span>
            Rekam Jejak Unit
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-[10px] border border-[#E0E5E2] bg-white p-2.5">
              <span className="text-[10px] text-[#52645A] block">Total tersalurkan</span>
              <strong className="text-sm font-bold text-[#A0632B] tabular-nums">
                {unit.total_kg_tersalurkan.toLocaleString('id-ID')} Kg
              </strong>
            </div>
            <div className="rounded-[10px] border border-[#E0E5E2] bg-white p-2.5">
              <span className="text-[10px] text-[#52645A] block">Eco-Points</span>
              <strong className="text-sm font-bold text-[#C27D3A] tabular-nums">
                {unit.eco_points.toLocaleString('id-ID')}
              </strong>
            </div>
          </div>
          {unit.kontak_pic && (
            <div className="flex items-center justify-between gap-2 rounded-[10px] bg-white px-3 py-2 text-[11px]">
              <span className="text-[#52645A]">PIC Unit</span>
              <strong className="text-[#1A2E22] text-right">{unit.pic_nama}</strong>
            </div>
          )}
        </section>
      )}

      {listing.status !== 'sudah_diambil' ? (
        <section className="rounded-[16px] border border-[#C27D3A]/12 bg-[#FFF8EE] p-4 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <span className="w-8 h-8 rounded-full bg-white text-[#C27D3A] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[17px]">event_available</span>
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold">Siap menjadwalkan pengambilan?</p>
              <p className="text-[11px] text-[#52645A] leading-relaxed mt-0.5">
                Pilih listing ini untuk mengatur tanggal, armada, dan pembayaran ke dompet unit.
              </p>
            </div>
          </div>

          {!confirmDone ? (
            <button
              onClick={handlePilihDanJadwalkan}
              disabled={confirmLoading}
              className="w-full min-h-[48px] px-4 rounded-[10px] bg-[#A0632B] hover:bg-[#C27D3A] active:scale-[0.99] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-wait"
            >
              {confirmLoading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  Memproses...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  Pilih Listing & Buat Jadwal
                </>
              )}
            </button>
          ) : (
            <div className="min-h-[48px] rounded-[10px] bg-[#FEF3C7] px-4 text-[#A0632B] text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
              Berhasil! Mengalihkan ke halaman jadwal...
            </div>
          )}

        </section>
      ) : (
        <div className="rounded-[16px] border border-[#E0E5E2] bg-[#FFF8EE] p-4 text-center text-xs font-semibold text-[#52645A]">
          Listing ini sudah diambil oleh mitra lain.
        </div>
      )}
    </div>
  );
};
