import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MatchingTransaksi } from '../types';

export const PerusahaanRiwayatView: React.FC = () => {
  const { matchings } = useApp();
  const [filterTab, setFilterTab] = useState<'semua' | 'berjalan' | 'selesai'>('semua');
  const [activeModalTrx, setActiveModalTrx] = useState<MatchingTransaksi | null>(null);
  const [showNavMap, setShowNavMap] = useState<boolean>(false);

  const activeTrx = matchings.find(m => m.status === 'menunggu_diambil');
  const completedTrxList = matchings.filter(m => m.status === 'sudah_diambil');

  const filteredList =
    filterTab === 'berjalan'
      ? matchings.filter(m => m.status === 'menunggu_diambil')
      : filterTab === 'selesai'
      ? completedTrxList
      : matchings;

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4">
      {/* Bento Banner Akumulasi Mitra Industri */}
      <div className="bg-gradient-to-br from-[#8B6045] to-[#633E25] text-white rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#FFDBC8]">receipt_long</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFDBC8]">
              LOGISTIK SIRKULAR MITRA
            </span>
          </div>
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
            Mitra Hijau Grade A
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-white/80 block">Total Kertas Terangkut</span>
            <div className="text-2xl font-extrabold mt-0.5">
              840 <span className="text-sm font-normal">Kg</span>
            </div>
            <span className="text-[10px] text-[#A4F3CC] font-bold block mt-1">
              +145 Kg siklus ini
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-white/80 block">Emisi Ditekan</span>
            <div className="text-2xl font-extrabold mt-0.5">
              -1.2 <span className="text-sm font-normal">Ton</span>
            </div>
            <span className="text-[10px] text-[#FFDBC8] font-bold block mt-1">
              Setara 240 pohon ditanam
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[#F1EEE5] p-1 rounded-xl flex items-center gap-1 text-xs">
        <button
          onClick={() => setFilterTab('semua')}
          className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all ${
            filterTab === 'semua' ? 'bg-white text-[#176B4D] shadow-xs' : 'text-[#57635A]'
          }`}
        >
          Semua ({matchings.length})
        </button>
        <button
          onClick={() => setFilterTab('berjalan')}
          className={`flex-1 py-1.5 rounded-lg text-center font-semibold transition-all ${
            filterTab === 'berjalan' ? 'bg-white text-[#176B4D] shadow-xs' : 'text-[#57635A]'
          }`}
        >
          Sedang Berjalan ({activeTrx ? 1 : 0})
        </button>
        <button
          onClick={() => setFilterTab('selesai')}
          className={`flex-1 py-1.5 rounded-lg text-center font-semibold transition-all ${
            filterTab === 'selesai' ? 'bg-white text-[#176B4D] shadow-xs' : 'text-[#57635A]'
          }`}
        >
          Selesai ({completedTrxList.length})
        </button>
      </div>

      {/* Penjemputan Aktif Section */}
      {activeTrx && (filterTab === 'semua' || filterTab === 'berjalan') && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/15 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#176B4D] animate-ping"></span>
              <h3 className="text-sm font-bold text-[#1C1C16]">Penjemputan Aktif Hari Ini</h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#9CF2B5] text-[#157140]">
              ETA ~8 mnt
            </span>
          </div>

          <div className="p-3.5 bg-[#F7F3EA] rounded-xl space-y-2 border border-[#176B4D]/10">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#176B4D]">#{activeTrx.id}</span>
              <span className="text-[11px] text-[#57635A] font-semibold">
                Truk {activeTrx.nopol_armada || 'B 9821 PQL'} ({activeTrx.driver_nama || 'Pak Joko'})
              </span>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <div className="w-10 h-10 rounded-lg bg-[#A4F3CC] flex items-center justify-center text-[#005138] font-bold text-sm shrink-0">
                FTD
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#1C1C16]">
                  {activeTrx.jumlah_kg} Kg HVS Putih (Grade A+)
                </h4>
                <p className="text-[11px] text-[#57635A] mt-0.5">
                  {activeTrx.unit_nama} • Tong {activeTrx.tong_nama}
                </p>
                <span className="text-[10px] text-[#8B6045] font-semibold block mt-0.5">
                  📍 Drop Point Serbaguna (Pintu Barat)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60">
              <button
                onClick={() => setActiveModalTrx(activeTrx)}
                className="py-2 px-3 rounded-lg bg-[#176B4D] hover:bg-[#005138] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                <span className="material-symbols-outlined text-sm">qr_code</span>
                <span>Surat Jalan & QR</span>
              </button>
              <button
                onClick={() => setShowNavMap(true)}
                className="py-2 px-3 rounded-lg bg-white hover:bg-gray-50 text-[#57635A] border border-gray-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-sm">navigation</span>
                <span>Navigasi ke Tong</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Riwayat Transaksi Terverifikasi */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#176B4D] text-lg">verified</span>
            <h3 className="text-sm font-bold text-[#1C1C16]">Riwayat Transaksi Terverifikasi</h3>
          </div>
          <span className="text-xs text-[#57635A]">
            {completedTrxList.length} Transaksi Selesai
          </span>
        </div>

        <div className="space-y-3">
          {completedTrxList.map(trx => (
            <div
              key={trx.id}
              className="p-3.5 rounded-xl bg-[#F7F3EA] border border-gray-100 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#005138]">#{trx.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#9CF2B5] text-[#157140]">
                      ✓ Selesai
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1C1C16] mt-0.5">
                    {trx.jenis_kertas}
                  </h4>
                  <p className="text-[11px] text-[#57635A]">
                    {trx.unit_nama} ({trx.tong_nama}) • {trx.tanggal_selesai || '18 Okt, 15:10 WIB'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#8B6045] block">
                    Rp {trx.nilai_rupiah.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-[#005138] font-bold">
                    +{trx.eco_points} Poin
                  </span>
                </div>
              </div>

              {/* Physical Verification Photos & Rating */}
              {trx.foto_timbangan && (
                <div className="p-2.5 rounded-lg bg-white border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#57635A] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-[#176B4D]">scale</span>
                      Foto Timbangan Digital Nyata & Struk Fisik:
                    </span>
                    <span className="text-[#8B6045] font-bold">Terverifikasi</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative rounded-lg overflow-hidden h-24 bg-gray-100 border border-gray-200">
                      <img
                        src={trx.foto_timbangan}
                        alt="Timbangan Digital"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-black/60 text-white text-[9px] backdrop-blur-xs">
                        Timbangan: {trx.jumlah_kg} Kg
                      </span>
                    </div>

                    <div className="relative rounded-lg overflow-hidden h-24 bg-gray-100 border border-gray-200">
                      <img
                        src={trx.foto_struk || trx.foto_timbangan}
                        alt="Struk Fisik"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-black/60 text-white text-[9px] backdrop-blur-xs">
                        Struk Timbang Sah
                      </span>
                    </div>
                  </div>

                  {trx.komentar && (
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px]">
                      <span className="text-[#57635A] italic">"{trx.komentar}"</span>
                      <span className="text-[#8B6045] font-bold flex items-center gap-0.5">
                        ★ {trx.rating}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Surat Jalan Digital Modal */}
      {activeModalTrx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 border border-[#176B4D]/20">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#176B4D]">description</span>
                <h3 className="font-bold text-sm text-[#1C1C16]">Surat Jalan Pengambilan Resmi</h3>
              </div>
              <button
                onClick={() => setActiveModalTrx(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* QR Visual */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#F7F3EA] border border-gray-200">
              <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-xs border border-gray-200 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  {/* Outer corner squares */}
                  <rect x="5" y="5" width="28" height="28" fill="#176B4D" />
                  <rect x="9" y="9" width="20" height="20" fill="white" />
                  <rect x="13" y="13" width="12" height="12" fill="#176B4D" />

                  <rect x="67" y="5" width="28" height="28" fill="#176B4D" />
                  <rect x="71" y="9" width="20" height="20" fill="white" />
                  <rect x="75" y="13" width="12" height="12" fill="#176B4D" />

                  <rect x="5" y="67" width="28" height="28" fill="#176B4D" />
                  <rect x="9" y="71" width="20" height="20" fill="white" />
                  <rect x="13" y="75" width="12" height="12" fill="#176B4D" />

                  {/* Body data mock pattern */}
                  <rect x="40" y="8" width="6" height="6" fill="#176B4D" />
                  <rect x="52" y="8" width="6" height="6" fill="#176B4D" />
                  <rect x="40" y="20" width="18" height="6" fill="#176B4D" />
                  <rect x="40" y="32" width="6" height="18" fill="#176B4D" />
                  <rect x="52" y="32" width="6" height="6" fill="#176B4D" />
                  <rect x="64" y="44" width="28" height="6" fill="#176B4D" />
                  <rect x="8" y="44" width="24" height="6" fill="#176B4D" />
                  <rect x="40" y="60" width="18" height="6" fill="#176B4D" />
                  <rect x="64" y="60" width="6" height="18" fill="#176B4D" />
                  <rect x="76" y="75" width="16" height="16" fill="#176B4D" />
                  <rect x="40" y="75" width="18" height="16" fill="#176B4D" />
                </svg>
              </div>
              <span className="text-xs font-extrabold text-[#005138] mt-2 tracking-wider">
                {activeModalTrx.surat_jalan_kode || `#SJ-2024-${activeModalTrx.id}`}
              </span>
              <span className="text-[10px] text-[#57635A]">
                Pindai di Pos Jaga Pintu Barat / Timbangan Drop Point
              </span>
            </div>

            {/* Document metadata table */}
            <div className="space-y-1.5 text-xs text-[#57635A]">
              <div className="flex justify-between">
                <span>Unit Pengirim:</span>
                <strong className="text-[#1C1C16]">{activeModalTrx.unit_nama}</strong>
              </div>
              <div className="flex justify-between">
                <span>Tong Drop Point:</span>
                <strong className="text-[#176B4D]">{activeModalTrx.tong_nama}</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Muatan:</span>
                <strong className="text-[#1C1C16]">{activeModalTrx.jumlah_kg} Kg</strong>
              </div>
              <div className="flex justify-between">
                <span>Driver & Armada:</span>
                <strong className="text-[#1C1C16]">Pak Joko Susilo (B 9821 PQL)</strong>
              </div>
            </div>

            <button
              onClick={() => setActiveModalTrx(null)}
              className="w-full py-2.5 rounded-xl bg-[#176B4D] hover:bg-[#005138] text-white text-xs font-bold transition-all"
            >
              Tutup Surat Jalan
            </button>
          </div>
        </div>
      )}

      {/* Nav Map Modal */}
      {showNavMap && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#176B4D]">navigation</span>
                <h3 className="font-bold text-sm text-[#1C1C16]">Rute Akses Drop Point</h3>
              </div>
              <button
                onClick={() => setShowNavMap(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-200">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmviIiiVahgnvhO_El-huson9J5-9mLv6s0NQKjrLHCL5_VDkgxtYr-uWRy1XeDI3jI0NEmhvp80WPZYTmS4b7171z821fB_qByVHWOM6pE5LBP4bXbyCFeYnW0hvwAFNRCwn5pODD6p-aBUrM4ZvGEmaVYFRamzn0-FqR7i8-LkRYKr2sraGUSuU_CrVENPUpymUBvnY5IR9CRbhV4B3Do5vyR20weTyWCYQC848V84BjAmHKzQio1A"
                alt="Rute Kampus"
                className="w-full h-44 object-cover"
              />
            </div>

            <div className="text-xs text-[#57635A] space-y-1">
              <div className="font-bold text-[#1C1C16]">Petunjuk Akses Armada:</div>
              <p className="leading-snug">1. Masuk lewat Gerbang Barat Jl. Lingkar Kampus.</p>
              <p className="leading-snug">2. Ikuti marka hijau menuju Gedung Serbaguna Sayap Barat.</p>
              <p className="leading-snug">3. Parkir di depan Ramp Muat Tong FTD-01.</p>
            </div>

            <button
              onClick={() => setShowNavMap(false)}
              className="w-full py-2.5 rounded-xl bg-[#176B4D] hover:bg-[#005138] text-white text-xs font-bold transition-all"
            >
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
