import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';

type TabMode = 'saran' | 'manual';

const KATEGORI_LABELS: Record<string, string> = {
  hvs: 'HVS / Arsip',
  kardus: 'Kardus',
  koran: 'Koran / Majalah',
  campur: 'Campuran',
};

export const PerusahaanMatchingView: React.FC = () => {
  const {
    matchings,
    listings,
    units,
    confirmPickup,
    setSelectedMatchingId,
    setSelectedListingId,
    setActiveRoute,
  } = useApp();

  const [tabMode, setTabMode] = useState<TabMode>('saran');
  const [filterKategori, setFilterKategori] = useState<string>('semua');
  const [successCelebration, setSuccessCelebration] = useState<string | null>(null);

  // --- Tab Saran Sistem ---
  const pendingMatchings = matchings.filter(m => m.status === 'menunggu_diambil');
  const primaryMatch = pendingMatchings[0] || matchings[0];

  const handleConfirmPickupClick = (matchingId: string) => {
    confirmPickup(matchingId);
    setSuccessCelebration('Kertas berhasil diambil! Status Tong kembali KOSONG dan Eco-Points resmi masuk ke Unit Kampus.');
    setTimeout(() => setSuccessCelebration(null), 4500);
  };

  const handleJadwalkan = (matchingId: string) => {
    setSelectedMatchingId(matchingId);
    setActiveRoute('/perusahaan/jadwal');
  };

  // --- Tab Browse Manual ---
  const availableListings = listings.filter(l => l.status !== 'sudah_diambil');

  const filteredListings =
    filterKategori === 'semua'
      ? availableListings
      : availableListings.filter(l => l.kategori === filterKategori);

  const handleLihatDetail = (listingId: string) => {
    setSelectedListingId(listingId);
    setActiveRoute('/perusahaan/listing-detail');
  };

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4">

      {/* Top Banner: Company Demand State */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#8B6045] text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-2xl">factory</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1C1C16]">PT Mandiri Daur Lestari</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-[#57635A]">
                  MDL-2024-K09
                </span>
              </div>
              <span className="text-[11px] text-[#0D6D3C] font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#157140] animate-pulse" />
                Sistem Matching Otomatis Aktif
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveRoute('/perusahaan/permintaan-baru')}
            className="px-2.5 py-1.5 rounded-lg bg-[#F7F3EA] text-[#8B6045] text-xs font-bold hover:bg-[#ECE8DF] transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            <span>Ubah Kuota</span>
          </button>
        </div>

        <div className="p-3 bg-[#F7F3EA] rounded-xl text-xs space-y-1">
          <div className="flex justify-between items-center text-[#57635A]">
            <span>Permintaan Aktif:</span>
            <strong className="text-[#1C1C16]">Min 100 kg/minggu (HVS/Arsip & Kardus)</strong>
          </div>
          <div className="flex justify-between items-center text-[#57635A]">
            <span>Kriteria QC:</span>
            <strong className="text-[#005138]">Kadar Air ≤12%, Terikat Rapi & Bebas Residu</strong>
          </div>
        </div>
      </div>

      {/* Mode Toggle: Saran Sistem vs Browse Manual */}
      <div className="bg-[#F1EEE5] p-1 rounded-xl flex items-center gap-1">
        <button
          onClick={() => setTabMode('saran')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            tabMode === 'saran' ? 'bg-white text-[#176B4D] shadow-xs' : 'text-[#57635A]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          Saran Sistem
          {pendingMatchings.length > 0 && (
            <span className="px-1.5 py-0.2 bg-[#9CF2B5] text-[#157140] text-[9px] font-extrabold rounded-full">
              {pendingMatchings.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTabMode('manual')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            tabMode === 'manual' ? 'bg-white text-[#176B4D] shadow-xs' : 'text-[#57635A]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">search</span>
          Jelajah Manual
          <span className="px-1.5 py-0.2 bg-gray-200 text-gray-600 text-[9px] font-extrabold rounded-full">
            {availableListings.length}
          </span>
        </button>
      </div>

      {/* ======================== TAB: SARAN SISTEM ======================== */}
      {tabMode === 'saran' && (
        <>
          {/* System Smart Match Recommendations */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#176B4D] text-lg">auto_awesome</span>
                <h3 className="text-sm font-bold text-[#1C1C16]">Pencocokan Otomatis Sistem</h3>
              </div>
              <span className="text-[10px] font-bold text-[#157140] bg-[#9CF2B5] px-2 py-0.5 rounded-full">
                {pendingMatchings.length} Rekomendasi
              </span>
            </div>

            {pendingMatchings.length === 0 && (
              <div className="p-4 bg-[#F7F3EA] rounded-xl text-center text-xs text-[#57635A] space-y-1">
                <span className="material-symbols-outlined text-2xl text-gray-300 block">inbox</span>
                <span>Belum ada rekomendasi saat ini. Coba jelajah listing manual di tab sebelah.</span>
              </div>
            )}

            <div className="space-y-3">
              {pendingMatchings.map((match, idx) => (
                <div key={match.id} className={`p-3.5 rounded-xl border space-y-2.5 ${
                  idx === 0 ? 'bg-[#F7F3EA] border-[#176B4D]/20' : 'bg-[#F7F3EA] border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      match.skor_kecocokan >= 95 ? 'bg-[#9CF2B5] text-[#157140]' : 'bg-[#A4F3CC] text-[#002114]'
                    }`}>
                      <span className="material-symbols-outlined text-xs">verified</span>
                      {match.skor_kecocokan}% Kecocokan Kriteria
                    </span>
                    <span className="text-xs font-bold text-[#176B4D]">{match.tong_nama}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    {/* Cari foto dari listing */}
                    {(() => {
                      const relatedListing = listings.find(l => l.id === match.listing_kertas_id);
                      return relatedListing?.foto ? (
                        <img
                          src={relatedListing.foto}
                          alt="Kertas"
                          className="w-16 h-16 rounded-lg object-cover shrink-0 border border-white shadow-xs"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-[#A4F3CC] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[#005138] text-2xl">inventory_2</span>
                        </div>
                      );
                    })()}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#1C1C16]">{match.jenis_kertas}</h4>
                      <p className="text-[11px] text-[#57635A] mt-0.5">{match.unit_nama}</p>
                      <span className="text-[10px] text-[#8B6045] font-semibold block mt-1">
                        📍 Drop Point Pusat Gedung Serbaguna
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleJadwalkan(match.id)}
                      className={`py-2.5 px-3 rounded-lg text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all ${
                        idx === 0 ? 'bg-[#176B4D] hover:bg-[#005138]' : 'bg-[#8B6045] hover:bg-[#633E25]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span>Jadwalkan</span>
                    </button>
                    <button
                      onClick={() => {
                        const rel = listings.find(l => l.id === match.listing_kertas_id);
                        if (rel) { setSelectedListingId(rel.id); setActiveRoute('/perusahaan/listing-detail'); }
                      }}
                      className="py-2.5 px-3 rounded-lg bg-white border border-gray-200 text-[#57635A] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">info</span>
                      <span>Lihat Detail</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmed Pickup Schedule Card */}
          {primaryMatch && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 space-y-3.5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div>
                  <span className="text-[10px] font-bold text-[#8B6045] uppercase tracking-wider block">
                    Jadwal Penjemputan Terkonfirmasi
                  </span>
                  <h3 className="text-sm font-bold text-[#1C1C16]">Penjemputan Batch Hari Ini</h3>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  primaryMatch.status === 'sudah_diambil'
                    ? 'bg-[#9CF2B5] text-[#157140]'
                    : 'bg-[#FFDBC8] text-[#8B6045]'
                }`}>
                  {primaryMatch.status === 'sudah_diambil' ? '✓ Sudah Selesai Diambil' : '• Menunggu Diambil'}
                </span>
              </div>

              {/* Date, Time, Driver */}
              <div className="p-3 bg-[#F7F3EA] rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#57635A] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#176B4D]">calendar_today</span>
                    Tanggal & Jam:
                  </span>
                  <strong className="text-[#1C1C16]">
                    {primaryMatch.tanggal_jemput || 'Kamis, 24 Oktober 2024'} • {primaryMatch.jam_jemput || '14:30 WIB'}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#57635A] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#8B6045]">local_shipping</span>
                    Armada & Pengemudi:
                  </span>
                  <strong className="text-[#1C1C16]">
                    {primaryMatch.nopol_armada || 'B 9821 PQL'} ({primaryMatch.driver_nama || 'Pak Joko Susilo'})
                  </strong>
                </div>
              </div>

              {/* Drop Point Map */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#1C1C16] block">Alamat Drop Point Pengambilan:</span>
                <div className="rounded-xl overflow-hidden border border-[#176B4D]/15 bg-[#F7F3EA]">
                  <div className="relative h-32 w-full bg-gray-100">
                    <img
                      src={APP_BRAND.dropPointUtama.mapImg}
                      alt="Denah Drop Point Serbaguna"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-white text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[#9CF2B5] text-sm">location_on</span>
                        Drop Point Gedung Serbaguna Kampus (Sayap Barat)
                      </span>
                    </div>
                  </div>
                  <div className="p-2 text-[11px] text-[#57635A] flex justify-between items-center">
                    <span>Ramp truk 6-roda & timbangan digital siap pakai</span>
                    <span className="text-[#176B4D] font-bold">Akses Gerbang Barat</span>
                  </div>
                </div>
              </div>

              {/* Tong position */}
              <div className="p-3 bg-[#F7F3EA] rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#A4F3CC] flex items-center justify-center text-[#005138] font-bold text-sm">
                  {primaryMatch.unit_id.slice(5, 8).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#57635A] uppercase tracking-wider block font-semibold">
                    Rute & Posisi Tong
                  </span>
                  <div className="text-xs font-bold text-[#1C1C16]">
                    Ambil di: Tong "{primaryMatch.tong_nama}", {primaryMatch.jumlah_kg} Kg
                  </div>
                </div>
              </div>

              {/* CTA */}
              {primaryMatch.status !== 'sudah_diambil' ? (
                <button
                  onClick={() => handleConfirmPickupClick(primaryMatch.id)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#005138] hover:bg-[#176B4D] active:scale-[0.98] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    task_alt
                  </span>
                  <span>Konfirmasi: Kertas Sudah Diambil dari Tong</span>
                </button>
              ) : (
                <div className="p-3 bg-[#9CF2B5]/30 border border-[#157140]/30 rounded-xl text-xs text-[#157140] font-bold text-center flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>Kertas telah berhasil diambil & diverifikasi!</span>
                </div>
              )}

              {successCelebration && (
                <div className="p-3.5 bg-[#176B4D] text-white rounded-xl text-xs font-bold text-center animate-in zoom-in-95 space-y-1 shadow-lg">
                  <div className="flex items-center justify-center gap-1.5 text-[#A4F3CC]">
                    <span className="material-symbols-outlined text-base">eco</span>
                    <span>PENGAMBILAN TONG SELESAI!</span>
                  </div>
                  <p className="text-[11px] font-normal text-white/90">{successCelebration}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ======================== TAB: JELAJAH MANUAL ======================== */}
      {tabMode === 'manual' && (
        <>
          {/* Info banner */}
          <div className="p-3 bg-[#F7F3EA] border border-[#176B4D]/15 rounded-xl text-xs text-[#57635A] flex items-start gap-2">
            <span className="material-symbols-outlined text-[#176B4D] text-base shrink-0 mt-0.5">info</span>
            <span>
              Mode Jelajah Manual: Anda bisa memilih listing kertas mana pun yang tersedia tanpa perlu menunggu saran dari sistem.
            </span>
          </div>

          {/* Filter Kategori */}
          <div className="bg-[#F1EEE5] p-1 rounded-xl flex items-center gap-1 text-xs overflow-x-auto">
            {(['semua', 'hvs', 'kardus', 'koran', 'campur'] as const).map(kat => (
              <button
                key={kat}
                onClick={() => setFilterKategori(kat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterKategori === kat ? 'bg-white text-[#176B4D] shadow-xs' : 'text-[#57635A]'
                }`}
              >
                {kat === 'semua' ? 'Semua' : KATEGORI_LABELS[kat]}
              </button>
            ))}
          </div>

          {/* Count */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#57635A]">
              Menampilkan <strong className="text-[#1C1C16]">{filteredListings.length}</strong> listing tersedia
            </span>
            {filterKategori !== 'semua' && (
              <button onClick={() => setFilterKategori('semua')} className="text-xs text-[#176B4D] font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-sm">close</span>
                Reset filter
              </button>
            )}
          </div>

          {/* Listings Grid */}
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center space-y-2 border border-dashed border-gray-200">
              <span className="material-symbols-outlined text-4xl text-gray-300">inventory_2</span>
              <p className="text-sm text-gray-400">Tidak ada listing yang cocok dengan filter ini.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredListings.map(listing => {
                const unit = units.find(u => u.id === listing.unit_id);
                const isAvailable = listing.status !== 'sudah_diambil';

                return (
                  <div
                    key={listing.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#176B4D]/8"
                  >
                    {/* Foto thumbnail */}
                    <div className="relative h-36 bg-gray-100">
                      <img
                        src={listing.foto}
                        alt={listing.kategori_label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-2 right-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm ${
                          listing.status === 'siap_pickup' ? 'bg-[#9CF2B5] text-[#157140]' : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {listing.status === 'siap_pickup' ? 'Siap Diambil' : 'Menunggu Mitra'}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <span className="text-white text-sm font-extrabold">{listing.jumlah_kg} Kg</span>
                        <span className="text-white/80 text-xs ml-2">{listing.kategori_label}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3.5 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xs font-bold text-[#1C1C16]">{listing.unit_nama}</h3>
                          <p className="text-[11px] text-[#57635A] mt-0.5">{listing.tanggal_post}</p>
                        </div>
                        <span className="text-[10px] font-extrabold text-[#8B6045] bg-[#FFDBC8] px-2 py-0.5 rounded-full shrink-0">
                          {listing.tong_nama}
                        </span>
                      </div>

                      {/* Kondisi preview */}
                      <div className="flex flex-wrap gap-1">
                        {listing.kondisi.slice(0, 2).map((k, i) => (
                          <span key={i} className="text-[10px] bg-[#F7F3EA] text-[#57635A] px-2 py-0.5 rounded-full">
                            {k.length > 30 ? k.slice(0, 30) + '...' : k}
                          </span>
                        ))}
                        {listing.kondisi.length > 2 && (
                          <span className="text-[10px] text-[#176B4D] font-semibold">+{listing.kondisi.length - 2} lagi</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleLihatDetail(listing.id)}
                          className="py-2.5 px-3 rounded-lg bg-[#F7F3EA] text-[#176B4D] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#ECE8DF] transition-all border border-[#176B4D]/20"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                          <span>Lihat Detail</span>
                        </button>
                        <button
                          disabled={!isAvailable}
                          onClick={() => {
                            handleLihatDetail(listing.id);
                          }}
                          className="py-2.5 px-3 rounded-lg bg-[#176B4D] hover:bg-[#005138] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
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
    </div>
  );
};
