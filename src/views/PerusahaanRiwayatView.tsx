import React, { useCallback, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import { MatchingTransaksi } from '../types';
import { ReceiptModal } from '../components/ReceiptModal';
import { PenilaianMitraModal } from '../components/PenilaianMitraModal';
import { LaporanModal } from '../components/LaporanModal';
import { LABEL_RATING, ratingStars } from '../lib/penilaian';
import { HIGHLIGHT_MATCHING_KEY } from '../data/initialData';

const formatRupiah = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;
const formatKg = (value: number) => `${value.toLocaleString('id-ID')} Kg`;
const displayValue = (value?: string | number | null) => {
  if (value === undefined || value === null || value === '') return '—';
  return String(value);
};

// QR asli dari kode verifikasi (SBT-V1:...) — benar-benar bisa dipindai kamera/jsQR.
// Dulu polanya palsu (acak dari kode), jadi tidak ada pemindai yang bisa membacanya.
const QrPattern: React.FC<{ code: string }> = ({ code }) => {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(code, { width: 256, margin: 1, color: { dark: '#3E2723', light: '#FFFFFF' } })
      .then(url => {
        if (alive) setDataUrl(url);
      })
      .catch(() => {
        if (alive) setDataUrl('');
      });
    return () => {
      alive = false;
    };
  }, [code]);

  return (
    <div className="w-full overflow-hidden rounded-[10px] border border-[#E0E5E2] bg-white p-1">
      {dataUrl ? (
        <img src={dataUrl} alt={`QR verifikasi ${code}`} className="aspect-square w-full" />
      ) : (
        <div className="aspect-square w-full animate-pulse bg-[#FFF8EE]" aria-hidden="true" />
      )}
    </div>
  );
};

export const PerusahaanRiwayatView: React.FC = () => {
  const { matchings, currentUser, setActiveRoute, verifyQrCode, getVerificationCode } = useApp();
  const [filterTab, setFilterTab] = useState<'semua' | 'berjalan' | 'selesai'>('berjalan');
  const [selectedReceiptMatch, setSelectedReceiptMatch] = useState<MatchingTransaksi | null>(null);
  const [qrTrx, setQrTrx] = useState<MatchingTransaksi | null>(null);
  const [qrInput, setQrInput] = useState('');
  const [qrBusy, setQrBusy] = useState(false);
  const [qrResult, setQrResult] = useState('');
  const [highlightedTrxId, setHighlightedTrxId] = useState<string | null>(null);
  const [penilaianTrx, setPenilaianTrx] = useState<MatchingTransaksi | null>(null);
  const [laporanTrx, setLaporanTrx] = useState<MatchingTransaksi | null>(null);

  // Scanner kamera QR tong di loker (getUserMedia + jsQR)
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const scanningRef = useRef(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraBusy, setCameraBusy] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const stopCamera = useCallback(() => {
    scanningRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
    setCameraBusy(false);
  }, []);

  const closeQrModal = useCallback(() => {
    stopCamera();
    setQrTrx(null);
  }, [stopCamera]);

  const scanTick = useCallback(() => {
    if (!scanningRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
      const scale = Math.min(1, 640 / video.videoWidth);
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const decoded = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });
        if (decoded?.data) {
          setQrInput(decoded.data.trim());
          setQrResult('QR tong terbaca. Periksa kode di bawah, lalu tekan Verifikasi.');
          stopCamera();
          return;
        }
      }
    }
    rafRef.current = requestAnimationFrame(scanTick);
  }, [stopCamera]);

  const startCamera = useCallback(async () => {
    setCameraError('');
    setQrResult('');
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setCameraError('Kamera butuh koneksi aman (HTTPS atau localhost). Jika situs dibuka lewat IP lokal tanpa HTTPS, gunakan "Scan dari foto" di bawah atau tempel kode manual.');
      return;
    }
    setCameraBusy(true);
    const openStream = async (): Promise<MediaStream> => {
      try {
        return await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
      } catch (err) {
        // Kamera belakang tidak ada (mis. laptop) — coba kamera apa pun yang tersedia
        if (err instanceof DOMException && (err.name === 'OverconstrainedError' || err.name === 'NotFoundError')) {
          return await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
        throw err;
      }
    };
    try {
      const stream = await openStream();
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      setCameraBusy(false);
      scanningRef.current = true;
      rafRef.current = requestAnimationFrame(scanTick);
    } catch {
      stopCamera();
      setCameraError('Izin kamera ditolak atau kamera tidak tersedia. Izinkan akses kamera di pengaturan browser, atau gunakan "Scan dari foto" / tempel kode manual di bawah.');
    }
  }, [scanTick, stopCamera]);

  // Cadangan bila kamera tidak bisa dipakai: pindai QR dari foto yang diambil/diunggah
  const handleScanPhoto = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setCameraError('');
    setQrResult('');
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 1024 / bitmap.width);
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Canvas tidak tersedia.');
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const decoded = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth',
      });
      if (decoded?.data) {
        setQrInput(decoded.data.trim());
        setQrResult('QR terbaca dari foto. Periksa kode di bawah, lalu tekan Verifikasi.');
      } else {
        setQrResult('QR tidak terbaca dari foto ini. Ambil foto ulang lebih dekat dan fokus ke QR, atau tempel kode manual.');
      }
    } catch {
      setQrResult('Foto tidak bisa diproses. Coba gambar lain atau tempel kode manual.');
    }
  }, []);

  useEffect(() => {
    if (!qrTrx) stopCamera();
  }, [qrTrx, stopCamera]);

  useEffect(() => stopCamera, [stopCamera]);

  const companyMatchings = currentUser?.perusahaan_id
    ? matchings.filter(m => m.perusahaan_id === currentUser.perusahaan_id)
    : matchings;

  const pendingMatchings = companyMatchings.filter(m => m.status === 'menunggu_diambil');
  const completedTrxList = companyMatchings.filter(m => m.status === 'sudah_diambil');
  const settledMatchings = companyMatchings.filter(
    m => m.status_pembayaran === 'lunas' || m.status === 'sudah_diambil'
  );

  const completedKg = completedTrxList.reduce((sum, m) => sum + m.jumlah_kg, 0);
  const totalPaid = settledMatchings.reduce((sum, m) => sum + m.nilai_rupiah, 0);

  const tabs = [
    { id: 'semua', label: 'Semua', count: companyMatchings.length },
    { id: 'berjalan', label: 'Berjalan', count: pendingMatchings.length },
    { id: 'selesai', label: 'Selesai', count: completedTrxList.length },
  ] as const;

  const showPendingSection =
    filterTab === 'berjalan' || (filterTab === 'semua' && pendingMatchings.length > 0);
  const showCompletedSection =
    filterTab === 'selesai' || (filterTab === 'semua' && completedTrxList.length > 0);

  const renderQrPanel = (trx: MatchingTransaksi) => {
    if (trx.status_pembayaran !== 'lunas') return null;
    const code = getVerificationCode(trx);
    return (
      <div className="rounded-[14px] border border-[#E0E5E2] bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="w-[72px] shrink-0">
            <QrPattern code={code} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-bold text-[#1A2E22]">
              QR tong di loker
            </p>
            <p className="mt-1 break-all font-mono text-[10px] leading-relaxed text-[#52645A]">{code}</p>
            {trx.verification_status === 'terverifikasi' ? (
              <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-semibold text-[#A0632B]">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                Terverifikasi{trx.verified_at ? ` · ${trx.verified_at}` : ''}
              </p>
            ) : trx.verification_status === 'ditolak' ? (
              <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#FEECEC] px-2 py-0.5 text-[11px] font-semibold text-[#C0392B]">
                <span className="material-symbols-outlined text-[13px]">error</span>
                {trx.last_verification_note || 'Ditolak'}
              </p>
            ) : (
              <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-semibold text-[#92400E]">
                <span className="material-symbols-outlined text-[13px]">schedule</span>
                Belum diverifikasi
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            setQrTrx(trx);
            setQrInput('');
            setQrResult('');
            setCameraError('');
          }}
          className="mt-3 w-full min-h-[48px] rounded-[10px] bg-[#A0632B] px-4 text-xs font-bold text-white flex items-center justify-center transition-colors hover:bg-[#C27D3A] focus-visible:outline-2 focus-visible:outline-[#A0632B] focus-visible:outline-offset-2"
        >
          Scan QR tong di loker
        </button>
        <p className="mt-2 text-center text-[11px] text-[#52645A]">
          Buka kamera, arahkan ke QR pada {trx.tong_nama}.
        </p>
      </div>
    );
  };

  useEffect(() => {
    const targetId = sessionStorage.getItem(HIGHLIGHT_MATCHING_KEY);
    if (!targetId) return;
    sessionStorage.removeItem(HIGHLIGHT_MATCHING_KEY);
    setFilterTab('semua');
    setHighlightedTrxId(targetId);
    const timer = window.setTimeout(() => {
      document
        .getElementById(targetId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
    return () => window.clearTimeout(timer);
  }, []);


  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4 font-sans text-[#1A2E22]">
      {/* Header halaman (navbar disembunyikan di sub-halaman) */}
      <div className="flex items-center gap-3 px-1 py-1">
        <button
          type="button"
          onClick={() => setActiveRoute('/perusahaan/dashboard')}
          aria-label="Kembali ke beranda mitra"
          className="w-10 h-10 rounded-full bg-white border border-[#C27D3A]/15 flex items-center justify-center text-[#C27D3A] hover:bg-[#FFF8EE] transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-[#6B7C70]">Mitra Industri</p>
          <h1 className="text-xl font-extrabold tracking-tight text-[#1A2E22] truncate">Riwayat Transaksi</h1>
        </div>
      </div>

      {/* Ringkasan kemitraan */}
      <section className="bg-[#A0632B] text-white rounded-[20px] p-5 border border-[#F4A261]/30 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#FDE68A]">
              Mitra Industri
            </p>
            <p className="text-xs text-white/75 mt-1 leading-relaxed">
              Batch berjalan dan bukti pembayaran penjemputan kertas Anda.
            </p>
          </div>
          <span className="material-symbols-outlined text-2xl text-[#FDE68A] shrink-0">
            receipt_long
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t border-white/15">
          <div className="min-w-0">
            <span className="text-[11px] text-white/70 block">Kertas diangkut</span>
            <div className="text-xl sm:text-2xl font-bold tabular-nums mt-0.5 leading-tight">
              {completedKg.toLocaleString('id-ID')}{' '}
              <span className="text-sm font-medium text-[#FDE68A]">Kg</span>
            </div>
            <span className="text-[11px] text-white/60 block mt-0.5">
              {completedTrxList.length} transaksi selesai
            </span>
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-white/70 block">Total dibayar</span>
            <div className="text-xl sm:text-2xl font-bold tabular-nums mt-0.5 leading-tight">
              <span className="text-sm font-medium text-[#FDE68A]">Rp</span>{' '}
              {totalPaid.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] text-white/60 block mt-0.5">
              {settledMatchings.length} transaksi lunas
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-[11px]">
          {pendingMatchings.length > 0 ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#F4A261]" />
              <span className="text-[#FFDBC8] font-semibold">
                {pendingMatchings.length} batch menunggu penjemputan
              </span>
            </>
          ) : companyMatchings.length > 0 ? (
            <>
              <span className="material-symbols-outlined text-[14px] text-[#FDE68A]">
                check_circle
              </span>
              <span className="text-[#FDE68A] font-semibold">Semua batch sudah selesai</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[14px] text-[#FDE68A]">
                info
              </span>
              <span className="text-[#FDE68A] font-semibold">Belum ada batch terdaftar</span>
            </>
          )}
        </div>
      </section>

      {companyMatchings.length > 0 && (
        <>
          {/* Filter */}
          <div
            role="tablist"
            aria-label="Filter riwayat transaksi"
            className="bg-[#FFF8EE] p-1 rounded-[12px] flex items-center gap-1 border border-[#C27D3A]/10"
          >
            {tabs.map(tab => {
              const isActive = filterTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilterTab(tab.id)}
                  className={`flex-1 min-h-[44px] rounded-[9px] px-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2 ${
                    isActive
                      ? 'bg-white text-[#A0632B] shadow-xs'
                      : 'text-[#52645A] hover:text-[#1A2E22]'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-1.5 text-[11px] tabular-nums ${
                      isActive ? 'text-[#C27D3A]' : 'text-[#8CA090]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Batch berjalan */}
          {showPendingSection && (
            <section className="space-y-2.5 pt-1" aria-labelledby="batch-berjalan-title">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                  <h2 id="batch-berjalan-title" className="text-sm font-bold text-[#1A2E22]">
                    Batch Berjalan
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-[#52645A]">
                  {pendingMatchings.length} batch
                </span>
              </div>

              {pendingMatchings.length === 0 ? (
                <div className="bg-white rounded-[14px] border border-[#C27D3A]/10 p-5 text-center">
                  <p className="text-xs text-[#52645A]">
                    Tidak ada batch yang menunggu penjemputan.
                  </p>
                </div>
              ) : (
                pendingMatchings.map(trx => (
                  <article
                    key={trx.id}
                    className="bg-white rounded-[16px] border border-[#C27D3A]/12 p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] text-[#92400E] px-2.5 py-1 text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                          Menunggu diambil
                        </span>
                        <h3 className="text-[15px] font-bold text-[#1A2E22] leading-snug mt-1.5">
                          {trx.jenis_kertas}
                        </h3>
                        <p className="text-[11px] text-[#52645A] mt-0.5">
                          #{trx.id}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="block text-[11px] text-[#52645A]">Nilai transaksi</span>
                        <span className="block text-[15px] font-bold text-[#A0632B] tabular-nums mt-0.5">
                          {formatRupiah(trx.nilai_rupiah)}
                        </span>
                        {trx.status_pembayaran === 'lunas' && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-[#A0632B] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-[12px]">
                              verified
                            </span>
                            Lunas
                          </span>
                        )}
                      </div>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 rounded-[12px] bg-[#FAFAF7] border border-[#E0E5E2] p-3 text-xs">
                      <div>
                        <dt className="text-[11px] text-[#52645A] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px] text-[#C27D3A]">
                            calendar_today
                          </span>
                          Jadwal jemput
                        </dt>
                        <dd className="font-semibold text-[#1A2E22] mt-0.5 pl-[22px]">
                          {displayValue(trx.tanggal_jemput)}
                          {trx.jam_jemput ? ` · ${trx.jam_jemput}` : ''}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] text-[#52645A] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px] text-[#C27D3A]">
                            local_shipping
                          </span>
                          Armada & driver
                        </dt>
                        <dd className="font-semibold text-[#1A2E22] mt-0.5 pl-[22px]">
                          {trx.nopol_armada
                            ? `${trx.nopol_armada}${trx.driver_nama ? ` · ${trx.driver_nama}` : ''}`
                            : '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] text-[#52645A] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px] text-[#C27D3A]">
                            location_on
                          </span>
                          Lokasi penjemputan
                        </dt>
                        <dd className="font-semibold text-[#1A2E22] mt-0.5 pl-[22px]">
                          {trx.tong_nama} · {trx.unit_nama}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] text-[#52645A] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px] text-[#C27D3A]">
                            payments
                          </span>
                          Pembayaran
                        </dt>
                        <dd className="font-semibold text-[#1A2E22] mt-0.5 pl-[22px]">
                          {displayValue(trx.metode_pembayaran)}
                        </dd>
                      </div>
                    </dl>

                    {renderQrPanel(trx)}

                    <div className="flex items-center justify-between gap-3 border-t border-[#E0E5E2] pt-3">
                      <p className="text-[11px] font-medium leading-relaxed text-[#52645A]">
                        Kertas ditandai terambil saat QR tong discan.
                      </p>
                      <button
                        onClick={() => setSelectedReceiptMatch(trx)}
                        className="min-h-[44px] shrink-0 px-3 rounded-[10px] border border-[#E0E5E2] bg-white text-[#A0632B] text-xs font-semibold hover:bg-[#FAFAF7] transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
                      >
                        Lihat struk
                      </button>
                    </div>
                  </article>
                ))
              )}
            </section>
          )}

          {/* Transaksi selesai */}
          {showCompletedSection && (
            <section className="space-y-2.5 pt-1" aria-labelledby="transaksi-selesai-title">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#C27D3A]">
                    verified
                  </span>
                  <h2 id="transaksi-selesai-title" className="text-sm font-bold text-[#1A2E22]">
                    Transaksi Selesai
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-[#52645A]">
                  {completedTrxList.length} transaksi
                </span>
              </div>

              {completedTrxList.length === 0 ? (
                <div className="bg-white rounded-[14px] border border-[#C27D3A]/10 p-5 text-center">
                  <p className="text-xs text-[#52645A]">
                    Belum ada transaksi yang selesai pada kategori ini.
                  </p>
                </div>
              ) : (
                completedTrxList.map(trx => (
                  <article
                    key={trx.id}
                    id={trx.id}
                    className={`rounded-[16px] border p-4 space-y-3 transition-all ${
                      highlightedTrxId === trx.id
                        ? 'bg-[#FFF8EE] border-[#C27D3A]/45 ring-2 ring-[#C27D3A]/25 shadow-sm'
                        : 'bg-white border-[#C27D3A]/12'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-[13px] font-bold text-[#1A2E22] leading-snug">
                            {trx.jenis_kertas}
                          </h3>
                          <span className="rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-semibold text-[#A0632B]">
                            Selesai
                          </span>
                          {highlightedTrxId === trx.id && (
                            <span className="rounded-full bg-[#A0632B] px-2 py-0.5 text-[10px] font-semibold text-white">
                              Baru dibayar
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#52645A] mt-0.5">
                          {trx.unit_nama} · {trx.tong_nama}
                        </p>
                        <p className="text-[11px] text-[#8CA090] mt-0.5">
                          {displayValue(trx.tanggal_selesai)}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="block text-[15px] font-bold text-[#A0632B] tabular-nums">
                          {formatRupiah(trx.nilai_rupiah)}
                        </span>
                        <span className="block text-[11px] font-semibold text-[#C27D3A] mt-0.5">
                          +{trx.eco_points} poin
                        </span>
                      </div>
                    </div>

                    {trx.foto_timbangan && (
                      <div className="grid grid-cols-2 gap-2">
                        <figure className="relative overflow-hidden rounded-[10px] border border-[#E0E5E2] bg-[#FFF8EE]">
                          <img
                            src={trx.foto_timbangan}
                            alt={`Foto timbangan digital ${formatKg(trx.jumlah_kg)}`}
                            className="h-24 w-full object-cover"
                            loading="lazy"
                          />
                          <figcaption className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-[10px] font-medium text-white">
                            {formatKg(trx.jumlah_kg)} · Timbangan
                          </figcaption>
                        </figure>
                        <figure className="relative overflow-hidden rounded-[10px] border border-[#E0E5E2] bg-[#FFF8EE]">
                          <img
                            src={trx.foto_struk || trx.foto_timbangan}
                            alt="Foto struk timbang fisik"
                            className="h-24 w-full object-cover"
                            loading="lazy"
                          />
                          <figcaption className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-[10px] font-medium text-white">
                            Struk timbang
                          </figcaption>
                        </figure>
                      </div>
                    )}

                    {typeof trx.rating === 'number' ? (
                      <div className="rounded-[12px] border border-[#E0E5E2] bg-[#FAFAF7] p-3 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1" aria-label={`Rating ${trx.rating} dari 5`}>
                              {ratingStars(trx.rating).map((filled, index) => (
                                <span
                                  key={index}
                                  className={`material-symbols-outlined text-[16px] ${
                                    filled ? 'text-[#C27D3A]' : 'text-[#D8DCD6]'
                                  }`}
                                  aria-hidden="true"
                                >
                                  star
                                </span>
                              ))}
                              <span className="ml-1 text-[11px] font-bold text-[#C27D3A] tabular-nums">
                                {trx.rating.toFixed(1)}
                              </span>
                              <span className="text-[11px] font-semibold text-[#52645A]">
                                {LABEL_RATING[Math.round(trx.rating)]}
                              </span>
                            </div>
                            {trx.rating_oleh ? (
                              <p className="text-[10px] text-[#8CA090] mt-0.5">
                                Dinilai {trx.rating_oleh}
                                {trx.rating_at ? ` · ${trx.rating_at}` : ''}
                              </p>
                            ) : (
                              <p className="text-[10px] text-[#8CA090] mt-0.5">
                                Penilaian lama · belum tercatat nama penilai
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => setPenilaianTrx(trx)}
                            className="shrink-0 min-h-[36px] px-2.5 rounded-[10px] border border-[#E0E5E2] bg-white text-[11px] font-semibold text-[#A0632B] hover:bg-[#FFF8EE] transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
                          >
                            Ubah
                          </button>
                        </div>

                        {trx.qc_penilaian && trx.qc_penilaian.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {trx.qc_penilaian.map(item => (
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

                        {trx.komentar && (
                          <p className="text-[11px] text-[#52645A] italic leading-relaxed">
                            "{trx.komentar}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 rounded-[12px] border border-dashed border-[#C27D3A]/35 bg-[#FFF8EE] p-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-[#1A2E22]">Kertas belum dinilai</p>
                          <p className="text-[10px] text-[#52645A] mt-0.5 leading-relaxed">
                            Catat hasil QC kertas &amp; beri bintang untuk {trx.unit_nama}.
                          </p>
                        </div>
                        <button
                          onClick={() => setPenilaianTrx(trx)}
                          className="shrink-0 min-h-[36px] px-2.5 rounded-[10px] bg-[#C27D3A] hover:bg-[#A0632B] text-white text-[11px] font-bold inline-flex items-center gap-1 transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
                        >
                          <span className="material-symbols-outlined text-[14px]">rate_review</span>
                          Nilai
                        </button>
                      </div>
                    )}

                    {renderQrPanel(trx)}

                    <div className="flex items-center justify-between gap-2 border-t border-[#E0E5E2] pt-3">
                      <span className="text-[11px] text-[#52645A] min-w-0 truncate">
                        {trx.metode_pembayaran
                          ? `Lunas via ${trx.metode_pembayaran}`
                          : 'Pembayaran lunas'}
                      </span>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          onClick={() => setLaporanTrx(trx)}
                          className="min-h-[40px] px-2.5 rounded-[10px] border border-[#E0E5E2] bg-white text-[11px] font-semibold text-[#C0392B] hover:bg-[#FEECEC] transition-colors focus-visible:outline-2 focus-visible:outline-[#C0392B] focus-visible:outline-offset-2"
                        >
                          Laporkan
                        </button>
                        <button
                          onClick={() => setSelectedReceiptMatch(trx)}
                          className="shrink-0 min-h-[40px] px-3 rounded-[10px] border border-[#E0E5E2] bg-white text-[#A0632B] text-xs font-semibold hover:bg-[#FAFAF7] transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
                        >
                          Lihat struk
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </section>
          )}
        </>
      )}

      {companyMatchings.length === 0 && (
        <section className="bg-white rounded-[16px] border border-[#C27D3A]/10 p-8 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF8EE] text-[#C27D3A] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">receipt_long</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1A2E22]">Belum ada transaksi</h2>
            <p className="text-xs text-[#52645A] mt-1 leading-relaxed max-w-xs mx-auto">
              Transaksi akan muncul di sini setelah Anda menjadwalkan penjemputan dari halaman
              Pasokan.
            </p>
          </div>
          <button
            onClick={() => setActiveRoute('/perusahaan/dashboard')}
            className="min-h-[44px] px-4 rounded-[10px] bg-[#C27D3A] hover:bg-[#A0632B] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
          >
            <span className="material-symbols-outlined text-[16px]">search</span>
            Cari Pasokan Kertas
          </button>
        </section>
      )}


      {qrTrx && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-verify-title"
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={event => {
            if (event.target === event.currentTarget) closeQrModal();
          }}
        >
          <div className="bg-white rounded-t-[20px] sm:rounded-[20px] w-full sm:max-w-md max-h-[92dvh] overflow-y-auto border border-[#E0E5E2] animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white px-5 py-4 border-b border-[#E0E5E2] flex items-center justify-between gap-3 z-10">
              <h2 id="qr-verify-title" className="font-bold text-sm text-[#1A2E22] truncate min-w-0">
                Scan QR tong di loker
              </h2>
              <button
                onClick={closeQrModal}
                className="w-9 h-9 rounded-full bg-[#FFF8EE] hover:bg-[#FFF8EE] text-[#52645A] flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
                aria-label="Tutup verifikasi QR"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 rounded-[12px] border border-[#E0E5E2] bg-white p-3">
                <div className="w-[56px] shrink-0">
                  <QrPattern code={getVerificationCode(qrTrx)} />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-[#1A2E22]">{qrTrx.tong_nama}</p>
                  <p className="text-[11px] text-[#52645A] truncate">{qrTrx.jenis_kertas}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-[#52645A] truncate">{qrTrx.unit_nama}</p>
                </div>
              </div>

              {/* Kamera scanner */}
              <div>
                <div className="relative overflow-hidden rounded-[16px] bg-[#3E2723] aspect-[4/3]">
                  <video
                    ref={videoRef}
                    muted
                    playsInline
                    aria-label="Kamera pemindai QR tong"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {!cameraOn && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/80 px-6 text-center">
                      <p className="text-xs leading-relaxed">
                        Kamera mati. Tekan tombol di bawah untuk membuka kamera belakang.
                      </p>
                    </div>
                  )}
                  {cameraOn && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                      <div className="relative h-44 w-44 sm:h-52 sm:w-52">
                        <span className="absolute left-0 top-0 h-8 w-8 border-l-4 border-t-4 border-[#FEF3C7] rounded-tl-lg" />
                        <span className="absolute right-0 top-0 h-8 w-8 border-r-4 border-t-4 border-[#FEF3C7] rounded-tr-lg" />
                        <span className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-[#FEF3C7] rounded-bl-lg" />
                        <span className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-[#FEF3C7] rounded-br-lg" />
                        <span className="absolute inset-x-6 top-1/2 h-0.5 -translate-y-1/2 bg-[#FEF3C7] animate-pulse" />
                      </div>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="absolute h-px w-px opacity-0 pointer-events-none" aria-hidden="true" />
                </div>
                <p className="mt-2 text-center text-[11px] leading-relaxed text-[#52645A]">
                  {cameraOn
                    ? 'Arahkan kamera ke QR pada tong di loker drop point. Kode terbaca otomatis terisi di bawah.'
                    : 'Scan QR pada tong di loker drop point untuk membuka kunci penjemputan.'}
                </p>
                {cameraError && (
                  <p role="alert" className="mt-2 rounded-[10px] bg-[#FEECEC] px-3 py-2 text-[11px] font-semibold leading-relaxed text-[#C0392B]">
                    {cameraError}
                  </p>
                )}
                {cameraOn ? (
                  <button
                    onClick={stopCamera}
                    className="mt-3 w-full min-h-[44px] rounded-[10px] border border-[#E0E5E2] bg-white text-xs font-semibold text-[#52645A] flex items-center justify-center hover:bg-[#FAFAF7] transition-colors"
                  >
                    Matikan kamera
                  </button>
                ) : (
                  <button
                    onClick={startCamera}
                    disabled={cameraBusy}
                    className="mt-3 w-full min-h-[48px] rounded-[10px] bg-[#A0632B] hover:bg-[#C27D3A] disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center transition-colors"
                  >
                    {cameraBusy ? 'Membuka kamera...' : 'Buka kamera & scan'}
                  </button>
                )}
                {!cameraOn && (
                  <>
                    <input
                      id="qr-photo-input"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="sr-only"
                      onChange={e => {
                        void handleScanPhoto(e.target.files?.[0]);
                        e.target.value = '';
                      }}
                    />
                    <label
                      htmlFor="qr-photo-input"
                      className="mt-2 w-full min-h-[44px] rounded-[10px] border border-[#E0E5E2] bg-white text-xs font-semibold text-[#52645A] flex items-center justify-center hover:bg-[#FAFAF7] transition-colors cursor-pointer"
                    >
                      Scan dari foto QR
                    </label>
                  </>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#52645A] mb-1.5" htmlFor="qr-scan-input">
                  Kode QR hasil scan
                </label>
                <textarea
                  id="qr-scan-input"
                  value={qrInput}
                  onChange={e => setQrInput(e.target.value)}
                  placeholder="Hasil scan otomatis terisi di sini, atau tempel kode manual, mis. SBT-V1:trx-2024-1024:DEMO-01024:XXXX"
                  rows={2}
                  className="w-full rounded-[10px] border border-[#E0E5E2] bg-[#FAFAF7] px-3 py-2.5 font-mono text-xs text-[#1A2E22] outline-none resize-none focus:border-[#C27D3A] focus:ring-2 focus:ring-[#C27D3A]/15 transition-all"
                />
                <p className="mt-1 text-[10px] text-[#8CA090]">
                  Kamera tidak tersedia? Tempel kode dari QR tong di sini. QR milik transaksi lain akan ditolak sistem.
                </p>
              </div>
              {qrResult && (
                <p className={`rounded-[10px] px-3 py-2 text-xs font-semibold leading-relaxed ${qrResult.startsWith('Ditolak') || qrResult.includes('sudah') || qrResult.includes('belum') ? 'bg-[#FEECEC] text-[#C0392B]' : 'bg-[#FEF3C7] text-[#A0632B]'}`}>
                  {qrResult}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={closeQrModal}
                  className="flex-1 min-h-[48px] rounded-[10px] border border-[#E0E5E2] bg-white text-xs font-semibold text-[#52645A] hover:bg-[#FAFAF7] transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    setQrBusy(true);
                    const result = await verifyQrCode(qrTrx.id, qrInput);
                    setQrResult(result.message);
                    setQrBusy(false);
                    if (result.success) {
                      setQrInput('');
                      stopCamera();
                    }
                  }}
                  disabled={qrBusy || !qrInput.trim()}
                  className="flex-1 min-h-[48px] rounded-[10px] bg-[#A0632B] hover:bg-[#C27D3A] disabled:opacity-60 text-xs font-bold text-white transition-colors"
                >
                  {qrBusy ? 'Memeriksa...' : 'Verifikasi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedReceiptMatch && (
        <ReceiptModal
          matching={selectedReceiptMatch}
          isOpen={!!selectedReceiptMatch}
          onClose={() => setSelectedReceiptMatch(null)}
        />
      )}

      <PenilaianMitraModal
        matching={penilaianTrx}
        isOpen={!!penilaianTrx}
        onClose={() => setPenilaianTrx(null)}
      />

      <LaporanModal
        isOpen={!!laporanTrx}
        onClose={() => setLaporanTrx(null)}
        target={
          laporanTrx
            ? {
                tongNama: laporanTrx.tong_nama,
                unitNama: laporanTrx.unit_nama,
                listing_kertas_id: laporanTrx.listing_kertas_id,
                matching_id: laporanTrx.id,
                tong_id: laporanTrx.tong_id,
              }
            : undefined
        }
      />
    </div>
  );
};
