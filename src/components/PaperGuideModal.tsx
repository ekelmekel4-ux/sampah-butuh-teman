import React, { useEffect } from 'react';

export const PAPER_CATEGORIES = [
  {
    key: 'HVS & Office Paper',
    label: 'HVS',
    sub: 'Putih',
    icon: 'description',
    bg: 'bg-[#D8F3DC]',
    fg: 'text-[#174630]',
  },
  {
    key: 'Kardus & Packaging',
    label: 'Kardus',
    sub: 'Box',
    icon: 'inventory_2',
    bg: 'bg-[#FEF3C7]',
    fg: 'text-[#8A5A12]',
  },
  {
    key: 'Arsip & Majalah',
    label: 'Arsip',
    sub: 'Buku',
    icon: 'auto_stories',
    bg: 'bg-[#E5F0F6]',
    fg: 'text-[#17607E]',
  },
] as const;

type PaperCategoryCardsProps = {
  onSelect: (category: string) => void;
};

/** Kartu jenis kertas — dipakai di menu Status Tong unit. */
export const PaperCategoryCards: React.FC<PaperCategoryCardsProps> = ({ onSelect }) => (
  <div className="grid grid-cols-3 gap-2.5">
    {PAPER_CATEGORIES.map(cat => (
      <button
        key={cat.key}
        type="button"
        onClick={() => onSelect(cat.key)}
        className="group rounded-2xl border border-[#2D6A4F]/8 bg-white px-2 py-3.5 text-center shadow-xs transition-all hover:border-[#2D6A4F]/25 hover:shadow-sm"
      >
        <span
          className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl ${cat.bg} ${cat.fg} transition-transform group-hover:scale-105`}
        >
          <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
        </span>
        <span className="mt-2 block truncate text-[11px] font-extrabold text-[#1A2E22]">{cat.label}</span>
        <span className="block text-[10px] font-medium text-[#8CA090]">{cat.sub}</span>
      </button>
    ))}
  </div>
);

type PaperGuideModalProps = {
  open: boolean;
  category: string | null;
  unitInisial: string;
  onClose: () => void;
};

/** Modal panduan daur ulang kertas — dipakai bersama oleh Beranda dan Status Tong. */
export const PaperGuideModal: React.FC<PaperGuideModalProps> = ({
  open,
  category,
  unitInisial,
  onClose,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0F241A]/60 backdrop-blur-xs sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="panduan-unit-title"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-lg animate-in slide-in-from-bottom flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl duration-300 sm:rounded-[28px]">
        <div className="relative flex h-40 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#D8F3DC] via-[#F2F7F4] to-[#FAFAF7]">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1A2E22] shadow-sm backdrop-blur-md transition-all hover:bg-white focus-visible:outline-2 focus-visible:outline-[#2D6A4F] focus-visible:outline-offset-2"
            aria-label="Tutup panduan"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-[#2D6A4F]/10 bg-white shadow-xl">
              <span className="material-symbols-outlined text-[46px] text-[#2D6A4F]">recycling</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto p-5">
          <div className="text-center">
            <span className="rounded-full bg-[#D8F3DC] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#174630]">
              {category || 'Panduan resmi kampus'}
            </span>
            <h3 id="panduan-unit-title" className="mt-2 text-xl font-black tracking-tight text-[#1A2E22]">
              Cara daur ulang kertas kampus
            </h3>
          </div>

          <div className="space-y-3 pt-1">
            {[
              {
                step: 1,
                title: 'Pisahkan jenis kertas',
                desc: 'Bedakan HVS putih, kardus/box paket, dan majalah/arsip. Kertas berlapis lilin atau laminasi plastik tidak dapat didaur ulang.',
              },
              {
                step: 2,
                title: 'Pastikan kering & bebas minyak',
                desc: 'Kertas basah atau berminyak mengontaminasi seluruh batch bubur kertas di pabrik.',
              },
              {
                step: 3,
                title: 'Ikat rapi di tong unit',
                desc: `Kumpulkan kertas pada wadah unit ${unitInisial} dalam keadaan terikat rapi. Minimal 10 Kg agar memenuhi kuota jemput.`,
              },
              {
                step: 4,
                title: 'Konversi rupiah & eco-points',
                desc: 'Setiap kilogram otomatis dihitung ke saldo kas unit dan menambah 2 Eco-Points di papan peringkat kampus.',
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="flex items-start gap-3 rounded-2xl border border-[#2D6A4F]/8 bg-[#F7FAF8] p-3.5"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2D6A4F] text-[11px] font-black text-white">
                  {step}
                </div>
                <div>
                  <h4 className="text-[12px] font-extrabold text-[#1A2E22]">{title}</h4>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-[#52645A]">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] w-full rounded-full bg-[#2D6A4F] text-[13px] font-extrabold text-white shadow-md transition-all hover:bg-[#1A4235]"
          >
            Paham & tutup panduan
          </button>
        </div>
      </div>
    </div>
  );
};
