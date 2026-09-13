import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

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
    tongList,
    selectedListingId,
    setSelectedMatchingId,
    matchings,
    createPermintaan,
    setActiveRoute,
    permintaanList,
  } = useApp();

  const listing = listings.find(l => l.id === selectedListingId) || listings[0];
  const unit = units.find(u => u.id === listing?.unit_id);
  const tong = tongList.find(t => t.id === listing?.tong_id);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmDone, setConfirmDone] = useState(false);
  const [showLaporModal, setShowLaporModal] = useState(false);
  const [laporAlasan, setLaporAlasan] = useState('');

  if (!listing) {
    return (
      <div className="w-full pb-20 max-w-xl mx-auto space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 text-center space-y-3">
          <span className="material-symbols-outlined text-4xl text-red-400">inventory_2</span>
          <h2 className="text-base font-bold text-[#1C1C16]">Listing Tidak Ditemukan</h2>
          <p className="text-sm text-[#57635A]">
            Silakan kembali ke halaman Matching dan pilih listing yang ingin dilihat.
          </p>
          <button
            onClick={() => setActiveRoute('/perusahaan/matching')}
            className="mt-2 px-4 py-2.5 rounded-xl bg-[#176B4D] text-white text-sm font-bold hover:bg-[#005138] transition-all"
          >
            Kembali ke Matching
          </button>
        </div>
      </div>
    );
  }

  // Cari apakah sudah ada matching untuk listing ini
  const existingMatch = matchings.find(m => m.listing_kertas_id === listing.id || m.id === listing.matching_id);

  const handlePilihDanJadwalkan = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      // Jika sudah ada matching, gunakan itu. Jika tidak, buat matching baru.
      let matchId = existingMatch?.id;
      if (!matchId && listing.matching_id) matchId = listing.matching_id;

      if (matchId) {
        setSelectedMatchingId(matchId);
      } else {
        // Buat permintaan baru jika belum ada
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

  const statusColor =
    listing.status === 'siap_pickup'
      ? 'bg-[#9CF2B5] text-[#157140]'
      : listing.status === 'sudah_diambil'
      ? 'bg-gray-100 text-gray-500'
      : 'bg-[#FFF3E0] text-[#E65100]';

  const statusLabel =
    listing.status === 'siap_pickup'
      ? 'Siap Diambil'
      : listing.status === 'sudah_diambil'
      ? 'Sudah Diambil'
      : 'Menunggu Mitra';

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4">

      {/* Back button */}
      <button
        onClick={() => setActiveRoute('/perusahaan/matching')}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#176B4D] hover:text-[#005138] transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Kembali ke Matching
      </button>

      {/* Foto Kertas */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#176B4D]/10 bg-gray-100 h-52">
        <img
          src={listing.foto}
          alt={`Kertas ${listing.kategori_label}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
          <div>
            <span className="text-white text-sm font-extrabold block leading-tight">
              {listing.jumlah_kg} Kg
            </span>
            <span className="text-white/80 text-xs">{listing.kategori_label}</span>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Info Utama */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-[#176B4D] uppercase tracking-wider block">
              Detail Listing Kertas
            </span>
            <h1 className="text-base font-extrabold text-[#1C1C16] mt-0.5">
              {listing.kategori_label}
            </h1>
            <p className="text-xs text-[#57635A] mt-0.5">
              Diposting: {listing.tanggal_post}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-lg font-extrabold text-[#005138] block">{listing.jumlah_kg} Kg</span>
            <span className="text-[10px] text-[#57635A]">estimasi berat</span>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Unit & Tong Info */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#1C1C16]">Asal & Lokasi Tong</h3>
          <div className="p-3 bg-[#F7F3EA] rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#A4F3CC] flex items-center justify-center text-[#005138] font-extrabold text-sm shrink-0">
              {unit?.inisial || listing.unit_id.slice(5, 8).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#1C1C16] block truncate">{listing.unit_nama}</span>
              {unit && (
                <span className="text-[11px] text-[#57635A] truncate block">{unit.lokasi_detail}</span>
              )}
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-extrabold text-[#8B6045] bg-[#FFDBC8] px-2 py-0.5 rounded-full">
                  {listing.tong_nama}
                </span>
                {tong && (
                  <span className="text-[10px] text-[#57635A]">{tong.lokasi_spesifik}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Kondisi Kertas */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#1C1C16]">Kondisi & Kualitas</h3>
          <div className="space-y-1.5">
            {listing.kondisi.map((k, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-[#3F4943]">
                <span className="material-symbols-outlined text-[#176B4D] text-base shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {getKondisiIcon(k)}
                </span>
                <span>{k}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Unit */}
        {unit && (
          <div className="p-3 bg-[#F7F3EA] rounded-xl text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#57635A]">Total disalurkan unit ini:</span>
              <strong className="text-[#005138]">{unit.total_kg_tersalurkan} Kg</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#57635A]">Eco-Points unit:</span>
              <strong className="text-[#8B6045]">{unit.eco_points} Poin</strong>
            </div>
            {unit.kontak_pic && (
              <div className="flex justify-between">
                <span className="text-[#57635A]">PIC Unit:</span>
                <strong className="text-[#1C1C16]">{unit.pic_nama}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA */}
      {listing.status !== 'sudah_diambil' ? (
        <div className="space-y-2">
          {!confirmDone ? (
            <button
              onClick={handlePilihDanJadwalkan}
              disabled={confirmLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#005138] hover:bg-[#176B4D] active:scale-[0.98] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-60"
            >
              {confirmLoading ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    event_available
                  </span>
                  <span>Pilih Listing Ini & Buat Jadwal Pengambilan</span>
                </>
              )}
            </button>
          ) : (
            <div className="p-3.5 bg-[#176B4D] text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 animate-in zoom-in-95">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
              <span>Berhasil! Mengalihkan ke halaman jadwal...</span>
            </div>
          )}

          <button
            onClick={() => setShowLaporModal(true)}
            className="w-full py-2.5 rounded-xl bg-white border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 flex items-center justify-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-sm">flag</span>
            Laporkan Listing Bermasalah
          </button>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-sm text-gray-500 font-semibold">
          Listing ini sudah diambil oleh mitra lain.
        </div>
      )}

      {/* Modal Laporan */}
      {showLaporModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#1C1C16] flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-base">flag</span>
                Laporkan Listing Ini
              </h3>
              <button onClick={() => setShowLaporModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <textarea
              value={laporAlasan}
              onChange={e => setLaporAlasan(e.target.value)}
              placeholder="Jelaskan masalah yang ditemukan (mis: foto tidak sesuai, berat tidak akurat, kontaminan...)"
              rows={3}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs outline-none resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowLaporModal(false)}
                className="flex-1 py-2 rounded-lg bg-gray-100 text-xs font-semibold text-gray-600"
              >Batal</button>
              <button
                onClick={() => {
                  setShowLaporModal(false);
                  setLaporAlasan('');
                }}
                className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-xs font-bold text-white"
              >Kirim Laporan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
