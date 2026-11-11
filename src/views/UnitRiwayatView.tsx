import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { QcChips } from '../components/QcChips';
import { LABEL_RATING, ratingStars } from '../lib/penilaian';
import { MatchingTransaksi } from '../types';

const STATUS_LISTING_META: Record<string, { label: string; className: string }> = {
  sudah_diambil: { label: 'Selesai', className: 'bg-[#D8F3DC] text-[#174630]' },
  siap_pickup: { label: 'Siap pickup', className: 'bg-[#DDF1FA] text-[#17607E]' },
  menunggu_mitra: { label: 'Menunggu mitra', className: 'bg-[#FEF3C7] text-[#8A5A12]' },
};

const formatRupiah = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({ rating, size = 'sm' }) => {
  const iconSize = size === 'md' ? 'text-[18px]' : 'text-[14px]';
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} dari 5`}>
      {ratingStars(rating).map((filled, index) => (
        <span
          key={index}
          className={`material-symbols-outlined ${iconSize} ${filled ? 'text-[#C27D3A]' : 'text-[#D8DCD6]'}`}
          aria-hidden="true"
        >
          star
        </span>
      ))}
    </span>
  );
};

/**
 * Riwayat setoran unit + penilaian yang diberikan mitra.
 * Dipakai unit untuk melihat apakah kertasnya dinilai baik oleh mitra.
 */
export const UnitRiwayatView: React.FC = () => {
  const { currentUser, units, listings, matchings, setActiveRoute, selectedListingId, setSelectedListingId } =
    useApp();
  const [expandedId, setExpandedId] = useState<string | null>(selectedListingId || null);

  // Daftar setoran dari dashboard jadi trigger: item yang dipilih langsung dibuka.
  useEffect(() => {
    if (selectedListingId) setExpandedId(selectedListingId);
  }, [selectedListingId]);

  const currentUnit =
    units.find(u => u.id === currentUser?.unit_id) ||
    units.find(u => u.inisial === 'FTD') ||
    units[0] ||
    { id: 'unit-ftd', nama_unit: 'Fakultas Teknik & Desain', inisial: 'FTD', total_kg_tersalurkan: 0 };

  const unitListings = useMemo(
    () =>
      [...listings]
        .filter(l => l.unit_id === currentUnit.id)
        .sort((a, b) => (b.tanggal_post || '').localeCompare(a.tanggal_post || '')),
    [listings, currentUnit.id]
  );

  const matchByListing = useMemo(() => {
    const map = new Map<string, MatchingTransaksi>();
    matchings.forEach(m => {
      if (m.listing_kertas_id) map.set(m.listing_kertas_id, m);
    });
    return map;
  }, [matchings]);

  const ratedListings = unitListings.filter(l => {
    const m = matchByListing.get(l.id);
    return typeof m?.rating === 'number';
  });

  const avgRating =
    ratedListings.length > 0
      ? ratedListings.reduce((acc, l) => acc + (matchByListing.get(l.id)?.rating || 0), 0) /
        ratedListings.length
      : 0;

  // Total berat & nilai setoran supaya kartu statistik langsung jelas Meaning-nya.
  const totalKg = unitListings.reduce((acc, l) => acc + (l.jumlah_kg || 0), 0);
  const belumDinilai = unitListings.length - ratedListings.length;

  const ringkasan = [
    { label: 'Setoran', value: `${unitListings.length}`, sub: `${totalKg.toLocaleString('id-ID')} Kg terkumpul` },
    {
      label: 'Dinilai',
      value: `${ratedListings.length}`,
      sub: belumDinilai > 0 ? `${belumDinilai} belum dinilai` : 'semua sudah dinilai',
    },
    {
      label: 'Rata-rata',
      value: avgRating ? avgRating.toFixed(1) : '—',
      sub: avgRating ? `bintang mitra` : 'belum ada penilaian',
    },
  ];

  const toggleDetail = (listingId: string) => {
    const next = expandedId === listingId ? null : listingId;
    setExpandedId(next);
    setSelectedListingId(next);
  };

  const renderPenilaian = (matching?: MatchingTransaksi) => {
    if (!matching) {
      return (
        <div className="rounded-2xl border border-dashed border-[#2D6A4F]/25 bg-[#F7FAF8] p-3.5">
          <p className="text-[12px] font-extrabold text-[#1A2E22]">Belum ada transaksi mitra</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-[#52645A]">
            Setoran ini belum dijemput mitra, jadi belum ada penilaian yang masuk.
          </p>
        </div>
      );
    }

    if (typeof matching.rating !== 'number') {
      return (
        <div className="rounded-2xl border border-dashed border-[#C27D3A]/35 bg-[#FFF8EE] p-3.5">
          <p className="text-[12px] font-extrabold text-[#1A2E22]">Belum dinilai mitra</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-[#52645A]">
            {matching.status === 'sudah_diambil'
              ? 'Kertas sudah diterima mitra. Penilaian QC & bintang akan muncul di sini begitu mitra mengirim penilaiannya.'
              : 'Penilaian mitra diberikan setelah kertas selesai dijemput (QR tong discan).'}
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-[#2D6A4F]/12 bg-white p-3.5 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <StarRating rating={matching.rating} />
            <span className="text-[12px] font-extrabold text-[#C27D3A] tabular-nums">
              {matching.rating.toFixed(1)}
            </span>
            <span className="text-[11px] font-bold text-[#52645A]">
              {LABEL_RATING[Math.round(matching.rating)]}
            </span>
          </div>
          <span className="rounded-full bg-[#F2F7F4] px-2 py-0.5 text-[10px] font-extrabold text-[#52645A]">
            {matching.perusahaan_nama}
          </span>
        </div>

        {matching.qc_penilaian && matching.qc_penilaian.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {matching.qc_penilaian.map(item => (
              <span
                key={item}
                className="inline-flex items-center gap-1 rounded-full bg-[#D8F3DC] px-2 py-0.5 text-[10px] font-semibold text-[#174630]"
              >
                <span className="material-symbols-outlined text-[12px]">check</span>
                {item}
              </span>
            ))}
          </div>
        )}

        {matching.komentar && (
          <p className="text-[11px] italic leading-relaxed text-[#52645A]">"{matching.komentar}"</p>
        )}

        <p className="text-[10px] text-[#8CA090]">
          {matching.rating_oleh ? `Dinilai ${matching.rating_oleh}` : 'Penilaian lama · belum tercatat nama penilai'}
          {matching.rating_at ? ` · ${matching.rating_at}` : ''}
        </p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pb-24 font-sans text-[#1A2E22]">
      <header className="flex items-center gap-3 px-1 py-1">
        <button
          type="button"
          onClick={() => setActiveRoute('/unit/beranda')}
          aria-label="Kembali ke beranda"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2D6A4F]/15 bg-white text-[#2D6A4F] shadow-xs transition-colors hover:bg-[#D8F3DC]"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[#8CA090]">{currentUnit.nama_unit}</p>
          <h1 className="font-display text-[20px] font-black leading-tight tracking-tight text-[#1A2E22]">
            Riwayat & Penilaian
          </h1>
        </div>
      </header>

      <section className="grid grid-cols-3 gap-2">
        {ringkasan.map(card => (
          <div key={card.label} className="rounded-2xl border border-[#2D6A4F]/10 bg-white p-3 text-center shadow-xs">
            <p
              className={`font-display text-[18px] font-extrabold leading-none tabular-nums ${
                card.label === 'Rata-rata' ? 'text-[#C27D3A]' : 'text-[#1A2E22]'
              }`}
            >
              {card.value}
            </p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[#8CA090]">{card.label}</p>
            <p className="mt-0.5 text-[10px] font-medium leading-tight text-[#6B7C70]">{card.sub}</p>
          </div>
        ))}
      </section>

      {unitListings.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-[#2D6A4F]/25 bg-white p-6 text-center">
          <span className="material-symbols-outlined text-3xl text-[#C7D6CB]">receipt_long</span>
          <p className="mt-2 text-[12px] font-bold text-[#1A2E22]">Belum ada setoran tercatat</p>
          <p className="mt-1 text-[11px] font-medium text-[#8CA090]">
            Setoran unit ini akan muncul di sini beserta penilaian dari mitra.
          </p>
        </div>
      ) : (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-lg text-[#2D6A4F]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                receipt_long
              </span>
              <h2 className="text-sm font-extrabold text-[#1A2E22]">Riwayat setoran</h2>
            </div>
            <span className="text-[10px] font-bold text-[#8CA090]">{unitListings.length} catatan</span>
          </div>

          {unitListings.map(listing => {
            const meta = STATUS_LISTING_META[listing.status] || STATUS_LISTING_META.menunggu_mitra;
            const matching = matchByListing.get(listing.id);
            const rated = typeof matching?.rating === 'number';
            const isOpen = expandedId === listing.id;

            return (
              <article
                key={listing.id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-xs transition-colors ${
                  isOpen ? 'border-[#2D6A4F]/35 ring-1 ring-[#2D6A4F]/15' : 'border-[#2D6A4F]/10'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleDetail(listing.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 p-3.5 text-left transition-colors hover:bg-[#F7FAF8] focus-visible:outline-2 focus-visible:outline-[#2D6A4F] focus-visible:-outline-offset-2"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F2F7F4] text-[#2D6A4F]">
                      <span className="material-symbols-outlined text-[19px]">description</span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-extrabold text-[#1A2E22]">
                        {listing.kategori_label}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] font-medium text-[#6B7C70]">
                        {listing.jumlah_kg} Kg · {listing.tong_nama} · {listing.tanggal_post}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        {rated ? (
                          <span className="inline-flex items-center gap-1">
                            <StarRating rating={matching!.rating} />
                            <span className="text-[10px] font-extrabold text-[#C27D3A] tabular-nums">
                              {matching!.rating.toFixed(1)}
                            </span>
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[9px] font-extrabold text-[#8A5A12]">
                            Belum dinilai
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${meta.className}`}>
                      {meta.label}
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-[#A8B6AC]">
                      {isOpen ? 'expand_less' : 'chevron_right'}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="space-y-3 border-t border-[#2D6A4F]/10 bg-[#F7FAF8] p-3.5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8CA090]">
                        Kondisi dari unit
                      </p>
                      <div className="mt-1.5">
                        <QcChips listing={listing} max={6} />
                      </div>
                    </div>

                    <div>
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8CA090]">
                        Penilaian mitra
                      </p>
                      {renderPenilaian(matching)}
                    </div>

                    {matching && (
                      <div>
                        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8CA090]">
                          Detail transaksi
                        </p>
                        <dl className="grid grid-cols-2 gap-2">
                          <div className="rounded-xl bg-white p-2.5">
                            <dt className="text-[9px] font-bold uppercase tracking-wider text-[#8CA090]">Mitra</dt>
                            <dd className="mt-0.5 text-[11px] font-extrabold text-[#1A2E22]">
                              {matching.perusahaan_nama}
                            </dd>
                          </div>
                          <div className="rounded-xl bg-white p-2.5">
                            <dt className="text-[9px] font-bold uppercase tracking-wider text-[#8CA090]">Nilai</dt>
                            <dd className="mt-0.5 text-[11px] font-extrabold text-[#1A2E22] tabular-nums">
                              {formatRupiah(matching.nilai_rupiah)}
                            </dd>
                          </div>
                          <div className="rounded-xl bg-white p-2.5">
                            <dt className="text-[9px] font-bold uppercase tracking-wider text-[#8CA090]">Jemput</dt>
                            <dd className="mt-0.5 text-[11px] font-extrabold text-[#1A2E22]">
                              {matching.tanggal_jemput || '—'}
                            </dd>
                          </div>
                          <div className="rounded-xl bg-white p-2.5">
                            <dt className="text-[9px] font-bold uppercase tracking-wider text-[#8CA090]">Selesai</dt>
                            <dd className="mt-0.5 text-[11px] font-extrabold text-[#1A2E22]">
                              {matching.tanggal_selesai || '—'}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};
