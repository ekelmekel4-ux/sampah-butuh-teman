import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND, HIGHLIGHT_MATCHING_KEY } from '../data/initialData';
import { ReceiptModal } from '../components/ReceiptModal';

const formatRupiah = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

const formatTanggal = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const ARMADA = [
  { id: '1', nopol: 'B 9821 PQL', driver: 'Pak Joko Susilo', jenis: 'Truk 6 roda' },
  { id: '2', nopol: 'D 8122 XZ', driver: 'Kang Maman', jenis: 'Pick-up' },
];

const METODE = [
  {
    id: 'dompet',
    label: 'Transfer Dompet Kampus',
    description: 'Saldo kas unit penyalur · langsung masuk',
    icon: 'account_balance_wallet',
    badge: 'Rekomendasi',
  },
  {
    id: 'qris',
    label: 'QRIS Sirkularitas UPJ',
    description: 'BCA, Mandiri, GoPay, OVO',
    icon: 'qr_code_2',
  },
  {
    id: 'va',
    label: 'Virtual Account',
    description: 'Bank Mandiri / BNI',
    icon: 'account_balance',
  },
] as const;

const methodLabels: Record<string, string> = {
  dompet: 'Transfer Dompet Kampus (Instan)',
  qris: 'QRIS Sirkularitas UPJ',
  va: 'Virtual Account Bank Mandiri/BNI',
};

export const PerusahaanJadwalView: React.FC = () => {
  const { matchings, selectedMatchingId, schedulePickup, payTransaction, setActiveRoute } = useApp();

  const matching =
    matchings.find(m => m.id === selectedMatchingId) ||
    matchings.find(m => m.status === 'menunggu_diambil') ||
    null;

  const now = new Date();
  const toIsoDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // Pilihan tanggal: 14 hari ke depan khusus hari kerja (Senin-Jumat, sesuai jam operasional)
  const tanggalOptions: { value: string; label: string }[] = [];
  for (let i = 0; i < 14; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const day = d.getDay();
    if (day === 0 || day === 6) continue;
    tanggalOptions.push({
      value: toIsoDate(d),
      label: d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }),
    });
  }

  // Pilihan jam: slot 30 menit pukul 08.00-16.00
  const jamOptions: { value: string; label: string }[] = [];
  for (let h = 8; h <= 16; h += 1) {
    for (const m of [0, 30]) {
      if (h === 16 && m === 30) continue;
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      jamOptions.push({ value: `${hh}:${mm}`, label: `${hh}.${mm} WIB` });
    }
  }

  const [tanggal, setTanggal] = useState<string>(tanggalOptions[0]?.value || toIsoDate(now));
  const [jam, setJam] = useState<string>('14:00');
  const [armadaId, setArmadaId] = useState<string>('1');
  const [selectedMethod, setSelectedMethod] = useState<'dompet' | 'qris' | 'va'>('dompet');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    if (submitted) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [submitted]);

  const selectedArmada = ARMADA.find(a => a.id === armadaId) || ARMADA[0];
  const selectedMethodMeta = METODE.find(m => m.id === selectedMethod) || METODE[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matching) {
      setErrorMsg('Tidak ada data matching yang dipilih. Kembali ke halaman matching untuk memilih.');
      return;
    }
    if (!tanggal || !jam || !armadaId) {
      setErrorMsg('Pilih tanggal, jam, dan armada terlebih dahulu.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    const formatted = formatTanggal(tanggal);
    const jamWib = `${jam} WIB`;

    setTimeout(() => {
      void schedulePickup(
        matching.id,
        formatted,
        jamWib,
        selectedArmada.nopol,
        selectedArmada.driver
      ).catch(() => {});

      void payTransaction(matching.id, methodLabels[selectedMethod]).catch(() => {});

      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  const bukaRiwayat = () => {
    if (!matching) return;
    sessionStorage.setItem(HIGHLIGHT_MATCHING_KEY, matching.id);
    setActiveRoute('/perusahaan/riwayat');
  };

  if (!matching) {
    return (
      <div className="w-full pb-20 max-w-xl mx-auto space-y-4">
        <div className="bg-white rounded-[16px] p-6 border border-[#C27D3A]/10 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF8EE] text-[#C27D3A] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">event_busy</span>
          </div>
          <h2 className="text-sm font-bold text-[#1A2E22]">Tidak ada matching yang dipilih</h2>
          <p className="text-xs text-[#52645A] leading-relaxed max-w-xs mx-auto">
            Silakan kembali ke halaman Pasokan dan pilih batch kertas yang ingin dijadwalkan.
          </p>
          <button
            onClick={() => setActiveRoute('/perusahaan/dashboard')}
            className="min-h-[44px] px-4 rounded-[10px] bg-[#C27D3A] hover:bg-[#A0632B] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Kembali ke Pasokan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4 font-sans text-[#1A2E22]">
      <section className="bg-[#A0632B] text-white rounded-[20px] p-5 border border-[#F4A261]/30 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#FDE68A]">
              Mitra Industri
            </p>
            <h1 className="text-xl font-bold tracking-tight leading-tight mt-1 text-white">
              Jadwal & Pembayaran
            </h1>
            <p className="text-xs text-white/75 mt-1 leading-relaxed">
              {submitted
                ? 'Pembayaran lunas. Armada penjemputan untuk batch ini sudah dijadwalkan.'
                : 'Atur kedatangan armada dan selesaikan pembayaran ke dompet unit penyalur.'}
            </p>
          </div>
          <span className="material-symbols-outlined text-2xl text-[#FDE68A] shrink-0">
            {submitted ? 'task_alt' : 'event_available'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t border-white/15">
          <div className="min-w-0">
            <span className="text-[11px] text-white/70 block">Kertas dijemput</span>
            <div className="text-xl font-bold tabular-nums mt-0.5 leading-tight">
              {matching.jumlah_kg.toLocaleString('id-ID')}{' '}
              <span className="text-sm font-medium text-[#FDE68A]">Kg</span>
            </div>
            <span className="text-[11px] text-white/60 block mt-0.5 truncate">
              {matching.jenis_kertas}
            </span>
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-white/70 block">Total pembayaran</span>
            <div className="text-xl font-bold tabular-nums mt-0.5 leading-tight">
              <span className="text-sm font-medium text-[#FDE68A]">Rp</span>{' '}
              {matching.nilai_rupiah.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] text-white/60 block mt-0.5 truncate">
              {matching.tong_nama}
            </span>
          </div>
        </div>
      </section>

      {!submitted && (
        <section className="bg-white rounded-[16px] border border-[#C27D3A]/10 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-[#1A2E22] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#C27D3A]">inventory_2</span>
              Batch yang dijemput
            </h2>
            <span className="font-mono text-[10px] text-[#8CA090]">#{matching.id}</span>
          </div>
          <dl className="text-xs divide-y divide-[#E0E5E2]">
            <div className="flex items-start justify-between gap-3 py-2">
              <dt className="text-[#52645A]">Unit penyalur</dt>
              <dd className="font-semibold text-right">{matching.unit_nama}</dd>
            </div>
            <div className="flex items-start justify-between gap-3 py-2">
              <dt className="text-[#52645A]">Slot tong</dt>
              <dd className="font-semibold text-right">{matching.tong_nama}</dd>
            </div>
            <div className="flex items-start justify-between gap-3 py-2">
              <dt className="text-[#52645A]">Harga per kg</dt>
              <dd className="font-semibold text-right tabular-nums">
                {formatRupiah(Math.round(matching.nilai_rupiah / Math.max(matching.jumlah_kg, 1)))}
              </dd>
            </div>
          </dl>
        </section>
      )}

      {!submitted && (
        <a
          href={APP_BRAND.dropPointUtama.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Buka lokasi Drop Point Kampus UPJ di Google Maps"
          className="group flex items-stretch overflow-hidden rounded-[16px] border border-[#C27D3A]/10 bg-white hover:border-[#C27D3A]/35 transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
        >
          <div className="w-24 shrink-0 bg-[#FFF8EE]">
            <img
              src={APP_BRAND.dropPointUtama.mapImg}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 p-3.5">
            <span className="text-[10px] font-semibold text-[#8CA090] uppercase tracking-wider">
              Lokasi penjemputan
            </span>
            <p className="text-xs font-bold text-[#1A2E22] mt-0.5 leading-snug">
              {APP_BRAND.dropPointUtama.nama}
            </p>
            <p className="text-[11px] text-[#52645A] mt-0.5 leading-snug line-clamp-2">
              {APP_BRAND.dropPointUtama.alamat}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C27D3A] mt-1.5">
              <span className="material-symbols-outlined text-[14px]">map</span>
              Buka di Google Maps
              <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </span>
          </div>
        </a>
      )}

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[16px] border border-[#C27D3A]/10 p-4 sm:p-5 space-y-4"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-[#1A2E22] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#C27D3A]">
                calendar_month
              </span>
              Atur jadwal kedatangan
            </h2>
            <span className="text-[10px] font-semibold text-[#8CA090] text-right">
              Senin–Jumat · 08.00–16.00
            </span>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-[10px] border border-[#E76F51]/30 bg-[#E76F51]/10 p-3 text-xs font-semibold text-[#B04030]"
            >
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="min-w-0">
              <label
                htmlFor="tanggal-jemput"
                className="text-[11px] font-semibold text-[#52645A] block mb-1"
              >
                Tanggal kedatangan
              </label>
              <div className="relative min-w-0">
                <select
                  id="tanggal-jemput"
                  value={tanggal}
                  onChange={e => setTanggal(e.target.value)}
                  required
                  className="w-full max-w-full min-w-0 h-11 appearance-none truncate rounded-[10px] border border-[#E0E5E2] bg-[#FAFAF7] pl-3 pr-9 text-xs font-semibold text-[#1A2E22] outline-none focus:border-[#C27D3A] focus:ring-2 focus:ring-[#C27D3A]/15 transition-colors"
                >
                  {tanggalOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-[#8CA090]">
                  expand_more
                </span>
              </div>
            </div>
            <div className="min-w-0">
              <label
                htmlFor="jam-jemput"
                className="text-[11px] font-semibold text-[#52645A] block mb-1"
              >
                Jam kedatangan
              </label>
              <div className="relative min-w-0">
                <select
                  id="jam-jemput"
                  value={jam}
                  onChange={e => setJam(e.target.value)}
                  required
                  className="w-full max-w-full min-w-0 h-11 appearance-none truncate rounded-[10px] border border-[#E0E5E2] bg-[#FAFAF7] pl-3 pr-9 text-xs font-semibold text-[#1A2E22] outline-none focus:border-[#C27D3A] focus:ring-2 focus:ring-[#C27D3A]/15 transition-colors"
                >
                  {jamOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-[#8CA090]">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-[11px] font-semibold text-[#52645A] mb-1">
              Armada penjemput
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {ARMADA.map(armada => {
                const isSelected = armadaId === armada.id;
                return (
                  <label
                    key={armada.id}
                    className={`flex items-center gap-3 rounded-[12px] border p-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-[#C27D3A] bg-[#FFF8EE]'
                        : 'border-[#E0E5E2] hover:bg-[#FAFAF7]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="armada"
                      value={armada.id}
                      checked={isSelected}
                      onChange={() => setArmadaId(armada.id)}
                      className="sr-only"
                    />
                    <span
                      className={`w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#C27D3A] text-white' : 'bg-[#FFF8EE] text-[#C27D3A]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-xs font-bold text-[#1A2E22]">{armada.nopol}</span>
                      <span className="block text-[11px] text-[#52645A] truncate">
                        {armada.driver} · {armada.jenis}
                      </span>
                    </span>
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#C27D3A] bg-[#C27D3A]' : 'border-[#CFC9B8]'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="space-y-2 border-t border-[#E0E5E2] pt-4">
            <legend className="text-[11px] font-semibold text-[#52645A] mb-1">
              Metode pembayaran
            </legend>
            <div className="space-y-2">
              {METODE.map(metode => {
                const isSelected = selectedMethod === metode.id;
                return (
                  <label
                    key={metode.id}
                    className={`flex items-start gap-3 rounded-[12px] border p-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-[#C27D3A] bg-[#FFF8EE]'
                        : 'border-[#E0E5E2] hover:bg-[#FAFAF7]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="metode"
                      value={metode.id}
                      checked={isSelected}
                      onChange={() => setSelectedMethod(metode.id)}
                      className="sr-only"
                    />
                    <span
                      className={`w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#C27D3A] text-white' : 'bg-[#FFF8EE] text-[#C27D3A]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{metode.icon}</span>
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-[#1A2E22]">{metode.label}</span>
                        {'badge' in metode && metode.badge && (
                          <span className="rounded-full bg-[#FEF3C7] px-1.5 py-0.5 text-[9px] font-bold text-[#A0632B]">
                            {metode.badge}
                          </span>
                        )}
                      </span>
                      <span className="block text-[11px] text-[#52645A] mt-0.5">
                        {metode.description}
                      </span>
                    </span>
                    <span
                      className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#C27D3A] bg-[#C27D3A]' : 'border-[#CFC9B8]'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="flex items-center justify-between gap-3 rounded-[12px] border border-[#C27D3A]/10 bg-[#FFF8EE] p-3.5">
            <div>
              <span className="text-[11px] text-[#52645A] block">Total pembayaran</span>
              <p className="text-lg font-bold text-[#A0632B] tabular-nums leading-tight mt-0.5">
                {formatRupiah(matching.nilai_rupiah)}
              </p>
            </div>
            <span className="text-right text-[10px] font-semibold text-[#C27D3A] leading-snug">
              Tanpa biaya admin
              <span className="block text-[#8CA090] font-medium">via {selectedMethodMeta.label}</span>
            </span>
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[48px] px-4 rounded-[10px] bg-[#A0632B] hover:bg-[#C27D3A] active:scale-[0.99] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-wait"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses pembayaran...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  Konfirmasi & bayar {formatRupiah(matching.nilai_rupiah)}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveRoute('/perusahaan/dashboard')}
              className="w-full min-h-[44px] rounded-[10px] text-[#52645A] hover:bg-[#FAFAF7] text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
            >
              Batalkan dan kembali ke Pasokan
            </button>
          </div>
        </form>
      ) : (
        <section className="bg-white rounded-[16px] border border-[#C27D3A]/15 p-5 space-y-4 animate-in zoom-in-95">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FEF3C7] text-[#A0632B] flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[30px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                task_alt
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] border border-[#C27D3A]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A0632B]">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Lunas · Terjadwal
            </span>
            <h2 className="text-base font-bold text-[#1A2E22]">
              Jadwal & pembayaran dikonfirmasi
            </h2>
            <p className="text-xs text-[#52645A] max-w-sm mx-auto leading-relaxed">
              Dana masuk ke dompet kas <strong className="text-[#1A2E22]">{matching.unit_nama}</strong>{' '}
              dan armada siap menjemput batch ini.
            </p>
          </div>

          <div className="rounded-[12px] bg-[#FAFAF7] border border-[#E0E5E2] p-4 space-y-2.5 text-xs">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[#52645A]">Waktu penjemputan</span>
              <strong className="break-words">
                {formatTanggal(tanggal)}, {jam} WIB
              </strong>
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[#52645A]">Armada & driver</span>
              <strong className="break-words">
                {selectedArmada.nopol} · {selectedArmada.driver}
              </strong>
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[#52645A]">Pembayaran</span>
              <strong className="break-words text-[#A0632B]">
                {methodLabels[selectedMethod]}
              </strong>
            </div>
            <div className="flex flex-col gap-0.5 min-w-0 border-t border-[#E0E5E2] pt-2.5">
              <span className="text-[#52645A] font-semibold">Total dibayar</span>
              <strong className="text-base font-bold text-[#A0632B] tabular-nums">
                {formatRupiah(matching.nilai_rupiah)}
              </strong>
            </div>
          </div>

          <a
            href={APP_BRAND.dropPointUtama.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 rounded-[10px] border border-[#C27D3A]/15 bg-[#FFF8EE] px-3.5 py-3 text-[11px] font-bold text-[#C27D3A] hover:bg-[#FEF3C7] transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
          >
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-[16px] shrink-0">location_on</span>
              <span className="truncate">Buka lokasi drop point penjemputan</span>
            </span>
            <span className="material-symbols-outlined text-[16px] shrink-0">open_in_new</span>
          </a>

          <div className="space-y-2">
            <button
              onClick={bukaRiwayat}
              className="w-full min-h-[48px] px-4 rounded-[10px] bg-[#A0632B] hover:bg-[#C27D3A] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              Lihat transaksi di Riwayat
            </button>
            <button
              onClick={() => setShowReceiptModal(true)}
              className="w-full min-h-[44px] px-4 rounded-[10px] border border-[#C27D3A]/25 bg-white text-[#A0632B] hover:bg-[#FFF8EE] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
            >
              <span className="material-symbols-outlined text-[16px]">receipt</span>
              Lihat bukti pembayaran
            </button>
          </div>
        </section>
      )}

      {showReceiptModal && (
        <ReceiptModal
          matching={matching}
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};
