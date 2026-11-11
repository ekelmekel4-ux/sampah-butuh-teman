import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

interface LaporanModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Data transaksi/listing yang dilaporkan (kosong = laporan umum). */
  target?: {
    tongNama: string;
    unitNama: string;
    listing_kertas_id?: string;
    matching_id?: string;
    tong_id?: string;
  };
}

const ALASAN_LIST = [
  'Kertas tidak sesuai spesifikasi',
  'Kuantitas / berat kurang',
  'Kertas terkontaminasi basah / minyak',
  'Kertas tidak terikat rapi',
  'Kategori kertas tidak sesuai',
  'Lainnya',
];

/**
 * Form laporan bermasalah (sampah/listing tidak sesuai) → diteruskan ke admin drop point.
 */
export const LaporanModal: React.FC<LaporanModalProps> = ({ isOpen, onClose, target }) => {
  const { submitLaporan } = useApp();
  const [alasan, setAlasan] = useState(ALASAN_LIST[0]);
  const [detail, setDetail] = useState('');
  const [level, setLevel] = useState<'sedang' | 'kritis'>('sedang');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setAlasan(ALASAN_LIST[0]);
    setDetail('');
    setLevel('sedang');
    setErrorMsg('');
    setIsSending(false);
  }, [isOpen]);

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

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!detail.trim()) {
      setErrorMsg('Tuliskan detail masalahnya agar admin bisa menindaklanjuti.');
      return;
    }
    setErrorMsg('');
    setIsSending(true);
    const result = await submitLaporan({
      tongNama: target?.tongNama || 'Drop Point Serbaguna (Sayap Barat)',
      unitNama: target?.unitNama || 'Unit kampus',
      alasan,
      detail: detail.trim(),
      level,
      listing_kertas_id: target?.listing_kertas_id,
      matching_id: target?.matching_id,
      tong_id: target?.tong_id,
    });
    setIsSending(false);
    if (result.success) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="laporan-title"
      className="fixed inset-0 z-50 bg-[#0F241A]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-[20px] max-w-md w-full max-h-[92dvh] flex flex-col overflow-hidden border border-[#C27D3A]/25 shadow-2xl animate-in zoom-in-95 duration-200">
        <header className="shrink-0 bg-[#A0632B] text-white px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-white/10 text-[#FDE68A] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[19px]">report_problem</span>
            </div>
            <div className="min-w-0">
              <h2 id="laporan-title" className="text-sm font-bold leading-tight text-white">
                Laporkan Masalah
              </h2>
              <p className="text-[11px] text-white/75 mt-0.5 truncate">
                {target ? `${target.unitNama} · ${target.tongNama}` : 'Sampah / listing tidak sesuai'}
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#FDE68A] focus-visible:outline-offset-2"
            aria-label="Tutup form laporan"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#FAF8F5] p-4 sm:p-5 space-y-3">
          <div>
            <label htmlFor="laporan-alasan" className="mb-1.5 block text-[11px] font-bold text-[#52645A]">
              Alasan laporan
            </label>
            <select
              id="laporan-alasan"
              value={alasan}
              onChange={event => setAlasan(event.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-[#C27D3A]/15 bg-white px-3 text-[12px] font-semibold text-[#1A2E22] outline-none focus:border-[#C27D3A]/50 focus:ring-2 focus:ring-[#C27D3A]/10"
            >
              {ALASAN_LIST.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="laporan-detail" className="mb-1.5 block text-[11px] font-bold text-[#52645A]">
              Detail masalah <span className="font-medium text-[#8CA090]">(wajib)</span>
            </label>
            <textarea
              id="laporan-detail"
              rows={4}
              value={detail}
              onChange={event => setDetail(event.target.value)}
              placeholder="Contoh: 60 Kg terproyeksi, timbangan menunjukkan 52 Kg dan 5 kardus tercampur kertas koran basah."
              className="w-full rounded-xl border border-[#C27D3A]/15 bg-white p-3 text-[12px] font-medium leading-relaxed text-[#1A2E22] outline-none placeholder:text-[#9AA99E] focus:border-[#C27D3A]/50 focus:ring-2 focus:ring-[#C27D3A]/10"
            />
          </div>

          <div>
            <span className="mb-1.5 block text-[11px] font-bold text-[#52645A]">Tingkat prioritas</span>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: 'sedang', label: 'Sedang', desc: 'Perlu dicek (drop point)', icon: 'warning' },
                  { value: 'kritis', label: 'Kritis', desc: 'Mengganggu operasional', icon: 'emergency' },
                ] as const
              ).map(item => {
                const active = level === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setLevel(item.value)}
                    className={`flex items-start gap-2 rounded-xl border p-2.5 text-left transition-colors ${
                      active
                        ? 'border-[#C27D3A]/40 bg-[#FFF8EE]'
                        : 'border-[#E7E0CF] bg-white hover:bg-[#FFFCF5]'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[16px] shrink-0 ${
                        active ? 'text-[#A0632B]' : 'text-[#8CA090]'
                      }`}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-extrabold text-[#1A2E22]">{item.label}</span>
                      <span className="block text-[10px] text-[#52645A]">{item.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

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
            className="flex-1 min-h-[44px] rounded-[10px] border border-[#CFC9B8] bg-white text-xs font-bold text-[#52645A] hover:bg-[#FAFAF7] transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSending}
            className="flex-1 min-h-[44px] rounded-[10px] bg-[#C27D3A] hover:bg-[#A0632B] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isSending ? 'hourglass_top' : 'send'}
            </span>
            {isSending ? 'Mengirim...' : 'Kirim Laporan'}
          </button>
        </footer>
      </div>
    </div>
  );
};
