import { PaymentModal } from '../components/PaymentModal';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MatchingTransaksi } from '../types';
import { APP_BRAND } from '../data/initialData';

export const PerusahaanRiwayatView: React.FC = () => {
  const { matchings, confirmPickup } = useApp();
  const [filterTab, setFilterTab] = useState<'semua' | 'berjalan' | 'selesai'>('semua');
  const [activeModalTrx, setActiveModalTrx] = useState<MatchingTransaksi | null>(null);
  const [showNavMap, setShowNavMap] = useState<boolean>(false);
  const [selectedPaymentMatch, setSelectedPaymentMatch] = useState<MatchingTransaksi | null>(null);

  const pendingMatchings = matchings.filter(m => m.status === 'menunggu_diambil');
  const completedTrxList = matchings.filter(m => m.status === 'sudah_diambil');

  const handleConfirmPickupClick = (matchingId: string) => {
    confirmPickup(matchingId);
  };

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4">
      {/* Bento Banner Akumulasi Mitra Industri */}
      <div className="bg-gradient-to-br from-[#C27D3A] to-[#633E25] text-white rounded-2xl p-4 shadow-md space-y-3">
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
            filterTab === 'semua' ? 'bg-white text-[#2D6A4F] shadow-xs' : 'text-[#52645A]'
          }`}
        >
          Semua ({matchings.length})
        </button>
        <button
          onClick={() => setFilterTab('berjalan')}
          className={`flex-1 py-1.5 rounded-lg text-center font-semibold transition-all ${
            filterTab === 'berjalan' ? 'bg-white text-[#2D6A4F] shadow-xs' : 'text-[#52645A]'
          }`}
        >
          Sedang Berjalan ({pendingMatchings.length})
        </button>
        <button
          onClick={() => setFilterTab('selesai')}
          className={`flex-1 py-1.5 rounded-lg text-center font-semibold transition-all ${
            filterTab === 'selesai' ? 'bg-white text-[#2D6A4F] shadow-xs' : 'text-[#52645A]'
          }`}
        >
          Selesai ({completedTrxList.length})
        </button>
      </div>

      {/* Jadwal Penjemputan Terkonfirmasi & Sedang Berjalan */}
      {(filterTab === 'semua' || filterTab === 'berjalan') && pendingMatchings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] animate-pulse" />
              <h3 className="text-sm font-black text-[#1A2E22]">Jadwal Penjemputan Terkonfirmasi</h3>
            </div>
            <span className="text-xs font-bold text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">
              {pendingMatchings.length} Batch Aktif
            </span>
          </div>

          {pendingMatchings.map(trx => (
            <div
              key={trx.id}
              className="bg-white rounded-[24px] p-5 shadow-sm border border-[#2D6A4F]/15 space-y-4 animate-in fade-in"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-2.5 gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#2D6A4F] uppercase tracking-wider block">
                    #{trx.id} {trx.surat_jalan_kode ? `• ${trx.surat_jalan_kode}` : ''}
                  </span>
                  <h4 className="text-sm font-black text-[#1A2E22]">{trx.jenis_kertas}</h4>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFDBC8] text-[#C27D3A]">
                    • Menunggu Diambil
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      trx.status_pembayaran === 'lunas'
                        ? 'bg-[#D8F3DC] text-[#005138]'
                        : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}
                  >
                    {trx.status_pembayaran === 'lunas' ? '✓ Lunas' : 'Belum Dibayar'}
                  </span>
                </div>
              </div>

              {/* Detail Jadwal & Driver */}
              <div className="p-3.5 bg-[#FAFAF7] rounded-xl space-y-2 text-xs border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                  <span className="text-[#52645A] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#2D6A4F]">calendar_today</span>
                    Waktu Penjemputan:
                  </span>
                  <strong className="text-[#1A2E22]">
                    {trx.tanggal_jemput || 'Kamis, 24 Oktober 2024'} • {trx.jam_jemput || '14:30 WIB'}
                  </strong>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                  <span className="text-[#52645A] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#C27D3A]">local_shipping</span>
                    Armada & Pengemudi:
                  </span>
                  <strong className="text-[#1A2E22]">
                    {trx.nopol_armada || 'B 9821 PQL'} ({trx.driver_nama || 'Pak Joko Susilo'})
                  </strong>
                </div>
              </div>

              {/* Lokasi Drop Point & Tong */}
              <div className="p-3 bg-[#FAFAF7] rounded-xl flex items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-[#A4F3CC] flex items-center justify-center text-[#005138] font-black text-sm shrink-0">
                  {trx.unit_id.slice(5, 8).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <span className="text-[10px] text-[#52645A] uppercase tracking-wider block font-bold">
                    Lokasi Penjemputan Kertas
                  </span>
                  <div className="font-black text-[#1A2E22] truncate">
                    Tong "{trx.tong_nama}", {trx.unit_nama}
                  </div>
                  <span className="text-[10px] text-[#2D6A4F] block mt-0.5">
                    Drop Point Gedung Serbaguna UPJ (Sayap Barat)
                  </span>
                </div>
              </div>

              {/* Tagihan & Salur Info */}
              <div className="p-3 bg-[#E8F5E9]/50 border border-[#2D6A4F]/20 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#52645A] block">
                    Nilai Tagihan Penyaluran
                  </span>
                  <div className="text-base font-black text-[#174630]">
                    Rp {trx.nilai_rupiah.toLocaleString('id-ID')}
                    <span className="text-[11px] font-normal text-[#52645A] ml-1.5">({trx.jumlah_kg} Kg)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#52645A] block">Penerima Kas:</span>
                  <span className="text-xs font-extrabold text-[#2D6A4F]">{trx.unit_nama}</span>
                </div>
              </div>

              {/* Action Buttons: Pembayaran & Konfirmasi */}
              <div className="space-y-2 pt-1">
                {trx.status_pembayaran !== 'lunas' ? (
                  <button
                    onClick={() => setSelectedPaymentMatch(trx)}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#174630] hover:bg-[#2D6A4F] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">payments</span>
                    <span>Bayar ke Dompet Unit (Rp {trx.nilai_rupiah.toLocaleString('id-ID')})</span>
                  </button>
                ) : (
                  <div className="p-3 bg-[#D8F3DC] border border-[#2D6A4F]/30 rounded-xl text-xs text-[#005138] font-bold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">verified</span>
                      <span>Pembayaran Lunas via {trx.metode_pembayaran || 'Transfer Dompet Kampus'}</span>
                    </div>
                    <button
                      onClick={() => setSelectedPaymentMatch(trx)}
                      className="text-[11px] font-extrabold underline text-[#005138] hover:text-[#174630] cursor-pointer"
                    >
                      Lihat Bukti Bayar
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setActiveModalTrx(trx)}
                    className="py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-[#F7F8F5] text-[#52645A] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">qr_code</span>
                    <span>Surat Jalan & QR</span>
                  </button>
                  <button
                    onClick={() => handleConfirmPickupClick(trx.id)}
                    className="py-2.5 px-3 rounded-xl bg-[#2D6A4F] hover:bg-[#005138] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">task_alt</span>
                    <span>Kertas Sudah Diambil</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Jika tab berjalan dipilih tapi tidak ada batch aktif */}
      {filterTab === 'berjalan' && pendingMatchings.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center text-xs text-[#52645A] border border-[#2D6A4F]/10 space-y-2">
          <span className="material-symbols-outlined text-3xl text-gray-300">event_busy</span>
          <p className="font-bold text-[#1A2E22]">Tidak Ada Jadwal Penjemputan Aktif</p>
          <p>Silakan buat jadwal penjemputan baru melalui halaman Pasokan.</p>
        </div>
      )}

      {/* Riwayat Transaksi Terverifikasi */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#2D6A4F]/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2D6A4F] text-lg">verified</span>
            <h3 className="text-sm font-bold text-[#1A2E22]">Riwayat Transaksi Terverifikasi</h3>
          </div>
          <span className="text-xs text-[#52645A]">
            {completedTrxList.length} Transaksi Selesai
          </span>
        </div>

        <div className="space-y-3">
          {completedTrxList.map(trx => (
            <div
              key={trx.id}
              className="p-3.5 rounded-xl bg-[#FAFAF7] border border-gray-100 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold text-[#005138]">#{trx.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9CF2B5] text-[#157140]">
                      ✓ Selesai
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trx.status_pembayaran === 'lunas' ? 'bg-[#D8F3DC] text-[#005138]' : 'bg-[#FEF3C7] text-[#92400E]'}`}>
                      {trx.status_pembayaran === 'lunas' ? '✓ Lunas' : 'Belum Dibayar'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1A2E22] mt-0.5">
                    {trx.jenis_kertas}
                  </h4>
                  <p className="text-[11px] text-[#52645A]">
                    {trx.unit_nama} ({trx.tong_nama}) • {trx.tanggal_selesai || '18 Okt, 15:10 WIB'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#C27D3A] block">
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
                    <span className="text-[#52645A] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-[#2D6A4F]">scale</span>
                      Foto Timbangan Digital Nyata & Struk Fisik:
                    </span>
                    <span className="text-[#C27D3A] font-bold">Terverifikasi</span>
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
                      <span className="text-[#52645A] italic">"{trx.komentar}"</span>
                      <span className="text-[#C27D3A] font-bold flex items-center gap-0.5">
                        ★ {trx.rating}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Status Pembayaran & Tombol Bayar */}
              <div className="pt-1 border-t border-gray-100">
                {trx.status_pembayaran !== 'lunas' ? (
                  <button
                    onClick={() => setSelectedPaymentMatch(trx)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#174630] hover:bg-[#2D6A4F] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">payments</span>
                    <span>Bayar Sekarang • Rp {trx.nilai_rupiah.toLocaleString('id-ID')}</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-[#2D6A4F]/15">
                    <span className="text-[#005138] font-bold flex items-center gap-1.5 text-[11px]">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Lunas via {trx.metode_pembayaran || 'Transfer Dompet Kampus'}
                    </span>
                    <button
                      onClick={() => setSelectedPaymentMatch(trx)}
                      className="text-[#174630] font-extrabold text-[11px] underline hover:text-[#2D6A4F] cursor-pointer"
                    >
                      Lihat Bukti Bayar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Surat Jalan Digital Modal */}
      {activeModalTrx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 border border-[#2D6A4F]/20">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2D6A4F]">description</span>
                <h3 className="font-bold text-sm text-[#1A2E22]">Surat Jalan Pengambilan Resmi</h3>
              </div>
              <button
                onClick={() => setActiveModalTrx(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* QR Visual */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#FAFAF7] border border-gray-200">
              <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-xs border border-gray-200 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  {/* Outer corner squares */}
                  <rect x="5" y="5" width="28" height="28" fill="#2D6A4F" />
                  <rect x="9" y="9" width="20" height="20" fill="white" />
                  <rect x="13" y="13" width="12" height="12" fill="#2D6A4F" />

                  <rect x="67" y="5" width="28" height="28" fill="#2D6A4F" />
                  <rect x="71" y="9" width="20" height="20" fill="white" />
                  <rect x="75" y="13" width="12" height="12" fill="#2D6A4F" />

                  <rect x="5" y="67" width="28" height="28" fill="#2D6A4F" />
                  <rect x="9" y="71" width="20" height="20" fill="white" />
                  <rect x="13" y="75" width="12" height="12" fill="#2D6A4F" />

                  {/* Body data mock pattern */}
                  <rect x="40" y="8" width="6" height="6" fill="#2D6A4F" />
                  <rect x="52" y="8" width="6" height="6" fill="#2D6A4F" />
                  <rect x="40" y="20" width="18" height="6" fill="#2D6A4F" />
                  <rect x="40" y="32" width="6" height="18" fill="#2D6A4F" />
                  <rect x="52" y="32" width="6" height="6" fill="#2D6A4F" />
                  <rect x="64" y="44" width="28" height="6" fill="#2D6A4F" />
                  <rect x="8" y="44" width="24" height="6" fill="#2D6A4F" />
                  <rect x="40" y="60" width="18" height="6" fill="#2D6A4F" />
                  <rect x="64" y="60" width="6" height="18" fill="#2D6A4F" />
                  <rect x="76" y="75" width="16" height="16" fill="#2D6A4F" />
                  <rect x="40" y="75" width="18" height="16" fill="#2D6A4F" />
                </svg>
              </div>
              <span className="text-xs font-extrabold text-[#005138] mt-2 tracking-wider">
                {activeModalTrx.surat_jalan_kode || `#SJ-2024-${activeModalTrx.id}`}
              </span>
              <span className="text-[10px] text-[#52645A]">
                Pindai di Pos Jaga Gerbang Barat Kampus UPJ / Timbangan Drop Point
              </span>
            </div>

            {/* Document metadata table */}
            <div className="space-y-1.5 text-xs text-[#52645A]">
              <div className="flex justify-between">
                <span>Unit Pengirim:</span>
                <strong className="text-[#1A2E22]">{activeModalTrx.unit_nama}</strong>
              </div>
              <div className="flex justify-between">
                <span>Tong Drop Point:</span>
                <strong className="text-[#2D6A4F]">{activeModalTrx.tong_nama}</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Muatan:</span>
                <strong className="text-[#1A2E22]">{activeModalTrx.jumlah_kg} Kg</strong>
              </div>
              <div className="flex justify-between">
                <span>Driver & Armada:</span>
                <strong className="text-[#1A2E22]">Pak Joko Susilo (B 9821 PQL)</strong>
              </div>
            </div>

            <button
              onClick={() => setActiveModalTrx(null)}
              className="w-full py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#005138] text-white text-xs font-bold transition-all"
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
                <span className="material-symbols-outlined text-[#2D6A4F]">navigation</span>
                <h3 className="font-bold text-sm text-[#1A2E22]">Rute Akses Drop Point</h3>
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

            <div className="text-xs text-[#52645A] space-y-1">
              <div className="font-bold text-[#1A2E22]">Petunjuk Akses Armada:</div>
              <p className="leading-snug">1. Masuk lewat Gerbang Barat UPJ, Jl. Cendrawasih, Ciputat.</p>
              <p className="leading-snug">2. Ikuti marka hijau menuju Gedung Serbaguna Kampus UPJ.</p>
              <p className="leading-snug">3. Parkir di depan Ramp Muat sesuai nomor tong yang dijadwalkan.</p>
            </div>

            <button
              onClick={() => setShowNavMap(false)}
              className="w-full py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#005138] text-white text-xs font-bold transition-all"
            >
              Kembali
            </button>
          </div>
        </div>
      )}
      {selectedPaymentMatch && (
        <PaymentModal
          matching={selectedPaymentMatch}
          isOpen={!!selectedPaymentMatch}
          onClose={() => setSelectedPaymentMatch(null)}
        />
      )}
      </div>
  );
};
