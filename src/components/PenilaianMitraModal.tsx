import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { MatchingTransaksi } from '../types';
import { KRITERIA_QC_MITRA, LABEL_RATING, qcKeyToLabel, qcLabelToKey } from '../lib/penilaian';

interface PenilaianMitraModalProps {
  matching: MatchingTransaksi | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatKg = (value: number) => `${value.toLocaleString('id-ID')} Kg`;
const formatRupiah = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

/**
 * Form penilaian kertas untuk mitra (perusahaan).
 * Mitra yang menerima dan memeriksa kertas di tempat sortirnya,
 * sehingga hasil QC + bintang adalah penilaian mitra, bukan penilaian sistem.
 */
export const PenilaianMitraModal: React.FC<PenilaianMitraModalProps> = ({
  matching,
  isOpen,
  onClose,
}) => {
  const { rateTransaction } = useApp();
  const [rating, setRating] = useState(0);
  const [qc, setQc] = useState<string[]>([]);
  const [catatan, setCatatan] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Isi ulang form setiap kali modal dibuka dengan transaksi baru.
  useEffect(() => {
    if (!isOpen || !matching) return;
    setRating(Math.round(matching.rating || 0));
    setQc((matching.qc_penilaian || []).map(qcLabelToKey));
    setCatatan(matching.komentar || '');
    setErrorMsg('');
    setIsSaving(false);
  }, [isOpen, matching]);

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

  if (!isOpen || !matching) return null;

  const toggleQc = (key: string) => {
    setQc(prev => (prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]));
  };

  const handleSubmit = async () => {
    if (!rating) {
      setErrorMsg('Pilih jumlah bintang penilaian terlebih dahulu.');
      return;
    }
    if (qc.length === 0) {
      setErrorMsg('Pilih minimal satu hasil pemeriksaan QC kertas.');
      return;
    }

    setErrorMsg('');
    setIsSaving(true);
    const result = await rateTransaction(matching.id, {
      rating,
      qc: qc.map(qcKeyToLabel),
      catatan,
    });
    setIsSaving(false);
    if (result.success) onClose();
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
      aria-labelledby="penilaian-title"
      className="fixed inset-0 z-50 bg-[#0F241A]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={event => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={trapFocus}
    >
      <div className="bg-white rounded-[20px] max-w-md w-full max-h-[92dvh] flex flex-col overflow-hidden border border-[#2D6A4F]/20 shadow-2xl animate-in zoom-in-95 duration-200">
        <header className="shrink-0 bg-[#174630] text-white px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-white/10 text-[#A7F3D0] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[19px]">rate_review</span>
            </div>
            <div className="min-w-0">
              <h2 id="penilaian-title" className="text-sm font-bold leading-tight text-white">
                Penilaian Kertas
              </h2>
              <p className="text-[11px] text-[#A7F3D0]/80 mt-0.5 truncate">
                Diisi mitra · {matching.unit_nama}
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#A7F3D0] focus-visible:outline-offset-2"
            aria-label="Tutup penilaian"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#FAF8F5] p-4 sm:p-5 space-y-3">
          <section className="rounded-[16px] bg-white border border-[#E0E5E2] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8CA090]">
              Kertas yang diterima
            </p>
            <p className="text-sm font-bold text-[#1A2E22] mt-0.5">{matching.jenis_kertas}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[11px] text-[#52645A]">
              <span className="font-semibold">{formatKg(matching.jumlah_kg)}</span>
              <span>{formatRupiah(matching.nilai_rupiah)}</span>
              <span>{matching.tong_nama}</span>
            </div>
          </section>

          <section className="rounded-[16px] bg-white border border-[#E0E5E2] p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-[#1A2E22]">Hasil pemeriksaan QC</h3>
              <span className="text-[10px] font-semibold text-[#8CA090]">Pilih yang sesuai</span>
            </div>
            {KRITERIA_QC_MITRA.map(item => {
              const checked = qc.includes(item.key);
              return (
                <button
                  key={item.key}
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => toggleQc(item.key)}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#2D6A4F] focus-visible:outline-offset-2 ${
                    checked
                      ? 'border-[#2D6A4F]/20 bg-[#F2F7F4]'
                      : 'border-[#F4A261]/35 bg-[#FEF9EE]'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                      checked ? 'border-[#2D6A4F] bg-[#2D6A4F] text-white' : 'border-[#C9B98E] bg-white'
                    }`}
                    aria-hidden="true"
                  >
                    {checked && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#1A2E22]">
                      <span className="material-symbols-outlined text-[15px] text-[#2D6A4F]">
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                    <span className="block text-[10px] text-[#52645A] mt-0.5 leading-relaxed">
                      {item.desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </section>

          <section className="rounded-[16px] bg-white border border-[#E0E5E2] p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-[#1A2E22]">Rating kualitas kertas</h3>
              <span className="text-[10px] font-semibold text-[#C27D3A]">
                {rating ? `${LABEL_RATING[rating]} · ${rating}/5` : 'Belum dipilih'}
              </span>
            </div>
            <div
              className="flex items-center gap-1.5"
              role="radiogroup"
              aria-label="Rating kualitas kertas"
            >
              {[1, 2, 3, 4, 5].map(value => {
                const active = value <= rating;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={value === rating}
                    aria-label={`${value} bintang`}
                    onClick={() => setRating(value)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[10px] transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2 hover:bg-[#FFF8EE]"
                  >
                    <span
                      className={`material-symbols-outlined text-[26px] ${
                        active ? 'text-[#C27D3A]' : 'text-[#D8DCD6]'
                      }`}
                      aria-hidden="true"
                    >
                      star
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-[#8CA090] leading-relaxed">
              Rating diberikan mitra terhadap kertas yang diterima dari {matching.unit_nama}.
            </p>
          </section>

          <section className="rounded-[16px] bg-white border border-[#E0E5E2] p-4 space-y-2">
            <label htmlFor="penilaian-catatan" className="text-xs font-bold text-[#1A2E22] block">
              Catatan untuk unit (opsional)
            </label>
            <textarea
              id="penilaian-catatan"
              value={catatan}
              onChange={event => setCatatan(event.target.value)}
              rows={3}
              maxLength={280}
              placeholder="Contoh: Kertas bersih, rapi dan bebas kontaminan. Beberapa lembar perlu sortir ulang."
              className="w-full rounded-[12px] border border-[#E0E5E2] bg-[#FAF8F5] px-3 py-2.5 text-xs text-[#1A2E22] leading-relaxed outline-none focus-visible:border-[#C27D3A] focus-visible:ring-2 focus-visible:ring-[#C27D3A]/20 resize-none"
            />
            <p className="text-[10px] text-[#8CA090] text-right">{catatan.length}/280</p>
          </section>

          {errorMsg && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-[12px] border border-[#C0392B]/20 bg-[#FEECEC] px-3 py-2.5 text-[11px] font-semibold text-[#C0392B]"
            >
              <span className="material-symbols-outlined text-[15px] shrink-0">error</span>
              {errorMsg}
            </p>
          )}
        </div>

        <footer className="shrink-0 bg-white border-t border-[#E0E5E2] p-3 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[44px] rounded-[10px] border border-[#CFC9B8] text-xs font-bold text-[#52645A] hover:bg-[#FAFAF7] transition-colors focus-visible:outline-2 focus-visible:outline-[#2D6A4F] focus-visible:outline-offset-2"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 min-h-[44px] rounded-[10px] bg-[#174630] hover:bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-[#174630] focus-visible:outline-offset-2"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isSaving ? 'hourglass_top' : 'check_circle'}
            </span>
            {isSaving ? 'Menyimpan...' : 'Simpan Penilaian'}
          </button>
        </footer>
      </div>
    </div>
  );
};
