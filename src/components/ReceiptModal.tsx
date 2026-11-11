import React, { useEffect, useRef, useState } from 'react';
import { MatchingTransaksi } from '../types';

interface ReceiptModalProps {
  matching: MatchingTransaksi;
  isOpen: boolean;
  onClose: () => void;
}

const formatRupiah = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;
const formatKg = (value: number) => `${value.toLocaleString('id-ID')} Kg`;
const displayValue = (value?: string | number | null) => {
  if (value === undefined || value === null || value === '') return '—';
  return String(value);
};

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ matching, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const reference = matching.nomor_referensi_bayar || `PAY-${matching.id}`;
  const isPaid =
    matching.status === 'sudah_diambil' ||
    matching.status_pembayaran === 'lunas' ||
    Boolean(matching.nomor_referensi_bayar) ||
    Boolean(matching.tanggal_bayar);
  const paymentDate = matching.tanggal_bayar || matching.tanggal_selesai;
  const method = matching.metode_pembayaran;
  const unitPrice =
    matching.jumlah_kg > 0 ? Math.round(matching.nilai_rupiah / matching.jumlah_kg) : null;

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 50);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!isOpen) return null;

  const handleCopyReference = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(reference);
        setCopied(true);
        return;
      }
    } catch {
      // fall back to legacy copy below
    }

    const textarea = document.createElement('textarea');
    textarea.value = reference;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copiedToClipboard = document.execCommand('copy');
    document.body.removeChild(textarea);
    setCopied(copiedToClipboard);
  };

  const handlePrint = () => {
    const previousTitle = document.title;
    document.title = `Bukti Pembayaran ${reference}`;
    window.print();
    window.setTimeout(() => {
      document.title = previousTitle;
    }, 0);
  };

  const trapFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(element => element.offsetParent !== null);

    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-title"
      className="fixed inset-0 z-50 bg-[#0F241A]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={event => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={trapFocus}
    >
      <div
        className="receipt-print-area bg-white rounded-[20px] max-w-md w-full max-h-[92dvh] flex flex-col overflow-hidden border border-[#2D6A4F]/20 shadow-2xl animate-in zoom-in-95 duration-200"
        style={{ boxShadow: '0 20px 40px -15px rgba(23,70,48,0.25)' }}
      >
        <header className="shrink-0 bg-[#174630] text-white px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-white/10 text-[#A7F3D0] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[19px]">receipt_long</span>
            </div>
            <div className="min-w-0">
              <h2 id="receipt-title" className="text-sm font-bold leading-tight text-white">
                Bukti Pembayaran
              </h2>
              <p className="text-[11px] text-[#A7F3D0]/80 mt-0.5 truncate">
                Sampah Butuh Teman · Mitra Industri
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="receipt-no-print w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#A7F3D0] focus-visible:outline-offset-2"
            aria-label="Tutup struk"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </header>

        <div className="receipt-scroll flex-1 overflow-y-auto bg-[#FAF8F5]">
          <div className="p-4 sm:p-5 space-y-3">
            <section className="rounded-[16px] bg-white border border-[#E0E5E2] p-5 text-center space-y-2">
              {isPaid ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D8F3DC] border border-[#2D6A4F]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#005138]">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Lunas · Terverifikasi
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] border border-[#D97706]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#92400E]">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  Menunggu pembayaran
                </span>
              )}

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#52645A]">
                  {isPaid ? 'Total pembayaran' : 'Total tagihan'}
                </p>
                <p className="text-3xl font-bold text-[#174630] tabular-nums tracking-tight mt-0.5">
                  <span className="text-base font-semibold text-[#2D6A4F]">Rp</span>{' '}
                  {matching.nilai_rupiah.toLocaleString('id-ID')}
                </p>
              </div>

              <p className="text-[11px] text-[#52645A] leading-relaxed">
                {isPaid
                  ? method
                    ? `Dibayar via ${method}`
                    : 'Pembayaran telah dikonfirmasi.'
                  : 'Pembayaran belum tercatat pada transaksi ini.'}
              </p>
            </section>

            <div className="flex items-center justify-between gap-2 rounded-[12px] bg-white border border-[#E0E5E2] px-4 py-3">
              <div className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#8CA090]">
                  Nomor referensi
                </span>
                <span className="block font-mono text-xs font-bold text-[#174630] truncate">
                  {reference}
                </span>
              </div>
              <button
                onClick={handleCopyReference}
                className="receipt-no-print shrink-0 min-h-[40px] px-3 rounded-[8px] bg-[#F2F7F4] hover:bg-[#E8F5E9] text-[#174630] text-[11px] font-bold flex items-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-[#2D6A4F] focus-visible:outline-offset-2"
                aria-label={copied ? 'Nomor referensi tersalin' : 'Salin nomor referensi'}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                {copied ? 'Tersalin' : 'Salin'}
              </button>
            </div>

            <section className="rounded-[16px] bg-white border border-[#E0E5E2] p-4">
              <h3 className="text-xs font-bold text-[#1A2E22]">Rincian Transaksi</h3>
              <dl className="text-xs divide-y divide-[#E0E5E2] mt-1">
                <div className="flex items-start justify-between gap-3 py-2">
                  <dt className="text-[#52645A] shrink-0">Batch kertas</dt>
                  <dd className="text-right font-semibold text-[#1A2E22]">
                    {matching.jenis_kertas}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3 py-2">
                  <dt className="text-[#52645A]">Berat</dt>
                  <dd className="text-right font-semibold text-[#1A2E22]">
                    {formatKg(matching.jumlah_kg)}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3 py-2">
                  <dt className="text-[#52645A]">Harga satuan</dt>
                  <dd className="text-right font-semibold text-[#1A2E22] tabular-nums">
                    {unitPrice !== null
                      ? `${formatRupiah(unitPrice)} / Kg`
                      : '—'}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3 py-2">
                  <dt className="text-[#52645A]">Waktu pembayaran</dt>
                  <dd className="text-right font-semibold text-[#1A2E22]">
                    {displayValue(paymentDate)}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3 py-2">
                  <dt className="text-[#52645A]">Metode</dt>
                  <dd className="text-right font-semibold text-[#1A2E22]">
                    {displayValue(method)}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3 py-2">
                  <dt className="text-[#52645A]">Nomor tong</dt>
                  <dd className="text-right font-semibold text-[#1A2E22]">{matching.tong_nama}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 pt-2.5 pb-1">
                  <dt className="text-[#1A2E22] font-bold">Total</dt>
                  <dd className="text-sm font-bold text-[#174630] tabular-nums">
                    {formatRupiah(matching.nilai_rupiah)}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-[16px] bg-white border border-[#E0E5E2] p-4">
              <h3 className="text-xs font-bold text-[#1A2E22]">Pihak & Lokasi</h3>
              <dl className="space-y-2 text-xs mt-2">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-[#52645A]">Mitra pengirim</dt>
                  <dd className="text-right font-semibold text-[#1A2E22]">
                    {matching.perusahaan_nama}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-[#52645A]">Unit penerima</dt>
                  <dd className="text-right font-semibold text-[#174630]">
                    {matching.unit_nama}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-[#52645A]">Lokasi penjemputan</dt>
                  <dd className="text-right font-semibold text-[#1A2E22]">
                    {matching.tong_nama}
                  </dd>
                </div>
              </dl>
            </section>

            <div className="flex items-center justify-between gap-3 rounded-[12px] border border-[#2D6A4F]/15 bg-[#E8F5E9]/60 px-4 py-3">
              <div className="flex items-center gap-2 text-[11px] text-[#52645A]">
                <span className="material-symbols-outlined text-[16px] text-[#2D6A4F]">eco</span>
                Eco-points dihasilkan
              </div>
              <span className="rounded-full bg-[#D8F3DC] px-2.5 py-1 text-[11px] font-bold text-[#005138]">
                +{matching.eco_points} poin
              </span>
            </div>

            <p className="text-[10px] text-[#8CA090] text-center leading-relaxed">
              Dokumen ini dihasilkan otomatis oleh sistem Sampah Butuh Teman. Simpan sebagai bukti
              pembayaran yang sah.
            </p>
          </div>
        </div>

        <footer className="receipt-no-print shrink-0 bg-white border-t border-[#E0E5E2] p-3 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[44px] rounded-[10px] border border-[#CFC9B8] text-xs font-bold text-[#52645A] hover:bg-[#FAFAF7] transition-colors focus-visible:outline-2 focus-visible:outline-[#2D6A4F] focus-visible:outline-offset-2"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 min-h-[44px] rounded-[10px] bg-[#174630] hover:bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#2D6A4F] focus-visible:outline-offset-2"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Cetak / Simpan PDF
          </button>
        </footer>
      </div>
    </div>
  );
};
