import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaperCategoryCards, PaperGuideModal } from '../components/PaperGuideModal';
import { getTongState, TONG_STATE_META, TongState } from '../lib/tong';
import { Tong } from '../types';

type FilterState = 'semua' | TongState;

const FILTER_LABEL: Record<FilterState, string> = {
  semua: 'Semua',
  kosong: 'Kosong',
  terisi: 'Terisi',
  siap_pickup: 'Siap jemput',
};

export const UnitStatusView: React.FC = () => {
  const { currentUser, units, tongList, emptyTong, submitLaporan, showToast, setActiveRoute, setPreselectTongId } =
    useApp();

  const currentUnit =
    units.find(u => u.id === currentUser?.unit_id) ||
    units.find(u => u.inisial === 'FTD') ||
    units[0] ||
    {
      id: 'unit-ftd',
      nama_unit: 'Fakultas Teknik & Desain',
      inisial: 'FTD',
    };

  const assignedTongs = useMemo(
    () =>
      [...tongList]
        .filter(t => t.unit_id === currentUnit.id)
        .sort((a, b) => a.nomor.localeCompare(b.nomor)),
    [tongList, currentUnit.id]
  );

  const [filter, setFilter] = useState<FilterState>('semua');
  const [reportTongId, setReportTongId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Tong penuh & butuh penjadwalan cepat');
  const [reportDetail, setReportDetail] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [emptyTongId, setEmptyTongId] = useState<string | null>(null);
  const [isEmptying, setIsEmptying] = useState(false);
  const [guideCategory, setGuideCategory] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const reportTong = assignedTongs.find(t => t.id === reportTongId) || null;
  const emptyTarget = assignedTongs.find(t => t.id === emptyTongId) || null;

  const totalBerat = assignedTongs.reduce((acc, t) => acc + t.berat_kg, 0);
  const totalKapasitas = assignedTongs.reduce((acc, t) => acc + t.kapasitas_max_kg, 0);
  const sisaKapasitas = Math.max(0, totalKapasitas - totalBerat);
  const totalPercent = totalKapasitas > 0 ? Math.min(100, Math.round((totalBerat / totalKapasitas) * 100)) : 0;
  const emptyCount = assignedTongs.filter(t => getTongState(t) === 'kosong').length;
  const filledCount = assignedTongs.filter(t => t.berat_kg > 0).length;
  const readyCount = assignedTongs.filter(t => getTongState(t) === 'siap_pickup').length;

  const counts: Record<FilterState, number> = {
    semua: assignedTongs.length,
    kosong: emptyCount,
    terisi: filledCount,
    siap_pickup: readyCount,
  };

  // Filter "Terisi" = tong yang sudah ada isinya (termasuk yang sudah siap jemput).
  const filteredTongs = useMemo(() => {
    if (filter === 'semua') return assignedTongs;
    if (filter === 'terisi') return assignedTongs.filter(t => t.berat_kg > 0);
    return assignedTongs.filter(t => getTongState(t) === filter);
  }, [filter, assignedTongs]);

  const summaryCards = [
    {
      label: 'Total tong',
      value: `${assignedTongs.length}`,
      sub: `${emptyCount} kosong · ${filledCount + readyCount} terisi`,
      icon: 'inventory_2',
    },
    {
      label: 'Kertas di tong',
      value: `${totalBerat.toLocaleString('id-ID')} Kg`,
      sub: `dari ${totalKapasitas.toLocaleString('id-ID')} Kg kapasitas`,
      icon: 'scale',
    },
    {
      label: 'Siap dijemput',
      value: `${readyCount}`,
      sub: 'Kuota minimal 10 Kg terpenuhi',
      icon: 'local_shipping',
    },
    {
      label: 'Sisa kapasitas',
      value: `${sisaKapasitas.toLocaleString('id-ID')} Kg`,
      sub: 'Ruang untuk setoran berikutnya',
      icon: 'space_dashboard',
    },
  ];

  const openReport = (tong: Tong) => {
    setReportTongId(tong.id);
    setReportReason('Tong penuh & butuh penjadwalan cepat');
    setReportDetail('');
    setReportSuccess(false);
  };

  const handleTongSelect = (tong: Tong) => {
    setPreselectTongId(tong.id);
    setActiveRoute('/unit/setor-kertas');
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTong) return;

    await submitLaporan({
      tongNama: reportTong.nama_tong,
      unitNama: currentUnit.nama_unit,
      alasan: reportReason,
      detail: reportDetail.trim() || `Permintaan pengecekan fisik ${reportTong.nama_tong} di ${reportTong.lokasi_spesifik}.`,
      level: 'sedang',
      tong_id: reportTong.id,
    });

    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportTongId(null);
    }, 1600);
  };

  const handleEmptyTong = async () => {
    if (!emptyTarget) return;
    setIsEmptying(true);
    try {
      await emptyTong(emptyTarget.id);
      showToast(`${emptyTarget.nama_tong} dikosongkan. Berat direset ke 0 Kg.`, 'success');
      setEmptyTongId(null);
    } catch {
      showToast('Tong gagal dikosongkan. Coba lagi.', 'error');
    } finally {
      setIsEmptying(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pb-24 font-sans text-[#1A2E22]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-1 py-1">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[#8CA090]">Monitoring unit · {currentUnit.inisial}</p>
          <h1 className="mt-1 text-[26px] font-extrabold leading-tight tracking-tight text-[#1A2E22]">
            Status tong
          </h1>
          <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#52645A]">
            Pantau kapasitas wadah dan laporkan kendala di titik jemput.
          </p>
        </div>
        <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#2D6A4F]/15 bg-[#D8F3DC] px-2.5 py-1 text-[10px] font-extrabold text-[#174630]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2D6A4F]" />
          Live sync
        </span>
      </div>

      {/* Ringkasan */}
      <section aria-label="Ringkasan tong" className="space-y-3">
        <div className="relative overflow-hidden rounded-2xl border border-[#DDE7E0] bg-[#F2F7F4]">
          <div className="grid grid-cols-2">
            {summaryCards.map((card, idx) => (
              <div
                key={card.label}
                className={`bg-white/80 p-4 ${idx < 2 ? 'border-b' : ''} ${
                  idx % 2 === 0 ? 'border-r' : ''
                } border-[#DDE7E0]`}
              >
                <span
                  className="material-symbols-outlined text-[21px] text-[#2D6A4F]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {card.icon}
                </span>
                <div className="mt-2">
                  <div className="text-[11px] font-medium leading-snug text-[#52645A]">{card.label}</div>
                  <div className="mt-0.5 text-[19px] font-extrabold leading-tight tracking-tight text-[#1A2E22] tabular-nums">
                    {card.value}
                  </div>
                  <div className="mt-0.5 text-[10px] font-medium leading-snug text-[#8CA090]">{card.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {assignedTongs.length > 0 && (
          <div className="rounded-2xl border border-[#2D6A4F]/10 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="font-medium text-[#52645A]">Kapasitas gabungan seluruh tong</span>
              <span className="font-extrabold text-[#1A2E22] tabular-nums">{totalPercent}%</span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#DDE7E0]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  totalPercent >= 80 ? 'bg-[#E9A23B]' : 'bg-[#2D6A4F]'
                }`}
                style={{ width: `${Math.max(totalBerat > 0 ? 4 : 0, totalPercent)}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 text-[10px] font-medium text-[#6B7C70]">
              <span>{totalBerat.toLocaleString('id-ID')} Kg terisi</span>
              <span>{sisaKapasitas.toLocaleString('id-ID')} Kg tersedia</span>
            </div>
          </div>
        )}
      </section>

      {/* Filter */}
      <section className="space-y-3" aria-label="Daftar tong unit">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold text-[#1A2E22]">Wadah unit</h2>
          <span className="text-[11px] font-semibold text-[#8CA090]">
            {filteredTongs.length} dari {assignedTongs.length} tong
          </span>
        </div>
        <p className="-mt-1.5 px-1 text-[11px] font-medium leading-relaxed text-[#6B7C70]">
          Pilih tong pada daftar di bawah untuk langsung menyetor kertas ke wadah tersebut.
        </p>

        <div className="flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Filter status tong">
          {(Object.keys(FILTER_LABEL) as FilterState[]).map(key => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={active}
                className={`inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-full border px-3 text-[11px] font-bold transition-colors ${
                  active
                    ? 'border-[#174630] bg-[#174630] text-white'
                    : 'border-[#2D6A4F]/15 bg-white text-[#52645A] hover:bg-[#F2F7F4]'
                }`}
              >
                {FILTER_LABEL[key]}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold tabular-nums ${
                    active ? 'bg-white/20 text-white' : 'bg-[#F2F7F4] text-[#52645A]'
                  }`}
                >
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </div>

        {assignedTongs.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#2D6A4F]/25 bg-white p-7 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F7F4] text-[#2D6A4F]">
              <span className="material-symbols-outlined text-2xl">inventory_2</span>
            </div>
            <p className="mt-3 text-sm font-extrabold text-[#1A2E22]">Belum ada tong terdaftar</p>
            <p className="mx-auto mt-1 max-w-[300px] text-[12px] leading-relaxed text-[#52645A]">
              Hubungi admin drop point untuk mengaktifkan wadah unit {currentUnit.inisial}. Setelah aktif,
              status dan kapasitas tong akan muncul di sini.
            </p>
          </div>
        ) : filteredTongs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#2D6A4F]/20 bg-white p-6 text-center">
            <p className="text-[13px] font-extrabold text-[#1A2E22]">Tidak ada tong dengan status ini</p>
            <p className="mt-1 text-[11px] font-medium text-[#52645A]">
              Coba pilih filter lain untuk melihat seluruh wadah.
            </p>
            <button
              type="button"
              onClick={() => setFilter('semua')}
              className="mt-3 inline-flex min-h-[38px] items-center rounded-full bg-[#F2F7F4] px-4 text-[11px] font-extrabold text-[#2D6A4F] transition-colors hover:bg-[#D8F3DC]"
            >
              Tampilkan semua
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTongs.map(tong => {
              const state = getTongState(tong);
              const meta = TONG_STATE_META[state];
              const percent = Math.min(
                100,
                Math.round((tong.berat_kg / Math.max(1, tong.kapasitas_max_kg)) * 100)
              );
              const sisa = Math.max(0, tong.kapasitas_max_kg - tong.berat_kg);

              return (
                <article
                  key={tong.id}
                  className="overflow-hidden rounded-[22px] border border-[#2D6A4F]/10 bg-white shadow-xs"
                >
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#2D6A4F]/8 bg-[#F2F7F4] text-[#2D6A4F]">
                          <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-[13px] font-extrabold text-[#1A2E22]">{tong.nama_tong}</h3>
                          <p className="mt-0.5 flex items-start gap-1 text-[10px] font-medium text-[#6B7C70]">
                            <span className="material-symbols-outlined mt-0.5 text-[13px]">location_on</span>
                            <span className="line-clamp-2">{tong.lokasi_spesifik}</span>
                          </p>
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${meta.className}`}>
                        {meta.label}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[11px] font-medium text-[#52645A]">
                          Terisi <strong className="font-extrabold text-[#1A2E22] tabular-nums">{tong.berat_kg} Kg</strong>
                        </span>
                        <span className="text-[10px] font-semibold text-[#8CA090] tabular-nums">
                          {tong.berat_kg} / {tong.kapasitas_max_kg} Kg
                        </span>
                      </div>
                      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#DDE7E0]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percent >= 80 ? 'bg-[#E9A23B]' : 'bg-[#2D6A4F]'
                          }`}
                          style={{ width: `${Math.max(tong.berat_kg > 0 ? 4 : 0, percent)}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] font-medium">
                        <span className="text-[#6B7C70]">{percent}% terpakai</span>
                        <span className={sisa > 0 ? 'text-[#2D6A4F]' : 'text-[#C0392B]'}>
                          {sisa > 0 ? `Sisa ${sisa} Kg` : 'Wadah penuh'}
                        </span>
                      </div>
                    </div>

                    {tong.catatan && (
                      <div className="flex items-start gap-2 rounded-xl bg-[#F7FAF8] px-3 py-2">
                        <span className="material-symbols-outlined mt-0.5 text-[14px] text-[#8CA090]">info</span>
                        <p className="line-clamp-2 text-[10px] font-medium leading-relaxed text-[#52645A]">
                          {tong.catatan}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleTongSelect(tong)}
                        className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-full bg-[#2D6A4F] px-3 text-[11px] font-extrabold text-white shadow-xs transition-colors hover:bg-[#1A4235]"
                      >
                        <span className="material-symbols-outlined text-[17px]">add_circle</span>
                        Setor ke tong
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => openReport(tong)}
                          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-[#2D6A4F]/15 bg-white px-3 text-[11px] font-extrabold text-[#1A2E22] transition-colors hover:bg-[#F2F7F4]"
                        >
                          <span className="material-symbols-outlined text-[17px] text-[#B45309]">report_problem</span>
                          Laporkan
                        </button>
                        <button
                          type="button"
                          onClick={() => setEmptyTongId(tong.id)}
                          disabled={tong.berat_kg <= 0}
                          title={tong.berat_kg <= 0 ? 'Tong sudah kosong' : 'Kosongkan setelah armada menjemput'}
                          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-full bg-[#F2F7F4] px-3 text-[11px] font-extrabold text-[#1A2E22] transition-colors hover:bg-[#DDE7E0] disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          <span className="material-symbols-outlined text-[17px]">refresh</span>
                          Kosongkan
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Kategori kertas */}
      <section className="space-y-3" aria-label="Kategori kertas">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-lg text-[#2D6A4F]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              category
            </span>
            <h2 className="text-sm font-extrabold text-[#1A2E22]">Kategori kertas</h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveRoute('/unit/setor-kertas')}
            className="text-[11px] font-bold text-[#2D6A4F] hover:underline"
          >
            Mulai setor
          </button>
        </div>

        <p className="px-1 text-[11px] font-medium leading-relaxed text-[#52645A]">
          Pastikan jenis kertas sesuai sebelum setoran dikirim ke mitra industri.
        </p>

        <PaperCategoryCards
          onSelect={category => {
            setGuideCategory(category);
            setShowGuide(true);
          }}
        />
      </section>

      {/* Panduan kategori kertas */}
      <PaperGuideModal
        open={showGuide}
        category={guideCategory}
        unitInisial={currentUnit.inisial}
        onClose={() => {
          setShowGuide(false);
          setGuideCategory(null);
        }}
      />

      {/* Report modal */}
      {reportTong && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F241A]/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="laporan-tong-title"
          onClick={e => {
            if (e.target === e.currentTarget) setReportTongId(null);
          }}
        >
          <div className="w-full max-w-sm animate-in zoom-in-95 space-y-4 rounded-[24px] border border-[#2D6A4F]/15 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF3C7] text-[#B45309]">
                  <span className="material-symbols-outlined text-[21px]">report_problem</span>
                </span>
                <div>
                  <h3 id="laporan-tong-title" className="text-sm font-extrabold text-[#1A2E22]">
                    Laporkan kendala
                  </h3>
                  <p className="text-[10px] font-medium text-[#8CA090]">{reportTong.nama_tong}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReportTongId(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#8CA090] transition-colors hover:bg-[#F2F7F4] hover:text-[#1A2E22]"
                aria-label="Tutup laporan"
              >
                <span className="material-symbols-outlined text-[19px]">close</span>
              </button>
            </div>

            <form onSubmit={handleReport} className="space-y-3">
              <div>
                <label htmlFor="alasan-laporan" className="mb-1 block text-[11px] font-bold text-[#52645A]">
                  Alasan
                </label>
                <select
                  id="alasan-laporan"
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  className="min-h-[44px] w-full rounded-xl border border-[#2D6A4F]/15 bg-[#F7FAF8] px-3 text-[12px] font-semibold text-[#1A2E22] outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15"
                >
                  <option>Tong penuh & butuh penjadwalan cepat</option>
                  <option>Tong rusak / engsel macet</option>
                  <option>Timbangan digital tidak terkoneksi</option>
                  <option>Kertas terkontaminasi basah / minyak</option>
                </select>
              </div>

              <div>
                <label htmlFor="detail-laporan" className="mb-1 block text-[11px] font-bold text-[#52645A]">
                  Detail tambahan <span className="font-medium text-[#8CA090]">(opsional)</span>
                </label>
                <textarea
                  id="detail-laporan"
                  rows={3}
                  value={reportDetail}
                  onChange={e => setReportDetail(e.target.value)}
                  placeholder="Catatan untuk admin drop point..."
                  className="w-full rounded-xl border border-[#2D6A4F]/15 bg-[#F7FAF8] p-3 text-[12px] font-medium leading-relaxed text-[#1A2E22] outline-none placeholder:text-[#9AA99E] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15"
                />
              </div>

              {reportSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-[#D8F3DC] px-3 py-2.5 text-[11px] font-bold text-[#174630]" role="status">
                  <span className="material-symbols-outlined text-[17px]">check_circle</span>
                  Laporan berhasil dikirim ke admin.
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setReportTongId(null)}
                  className="min-h-[44px] flex-1 rounded-full border border-[#CFC9B8] bg-white text-[12px] font-bold text-[#52645A] transition-colors hover:bg-[#FAFAF7]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={reportSuccess}
                  className="min-h-[44px] flex-1 rounded-full bg-[#2D6A4F] text-[12px] font-extrabold text-white shadow-xs transition-colors hover:bg-[#1A4235] disabled:opacity-60"
                >
                  Kirim laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty tong confirmation */}
      {emptyTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F241A]/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kosongkan-tong-title"
          onClick={e => {
            if (e.target === e.currentTarget && !isEmptying) setEmptyTongId(null);
          }}
        >
          <div className="w-full max-w-sm rounded-[24px] border border-[#2D6A4F]/15 bg-white p-5 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2F7F4] text-[#2D6A4F]">
              <span className="material-symbols-outlined text-[22px]">refresh</span>
            </div>
            <h3 id="kosongkan-tong-title" className="mt-3 text-base font-extrabold text-[#1A2E22]">
              Kosongkan {emptyTarget.nama_tong}?
            </h3>
            <p className="mt-1 text-[12px] leading-relaxed text-[#52645A]">
              Berat tong akan direset ke 0 Kg dan listing aktif ditandai selesai. Gunakan aksi ini setelah
              armada mitra benar-benar menjemput kertas.
            </p>
            <div className="mt-3 rounded-xl bg-[#F7FAF8] px-3 py-2.5 text-[11px] font-semibold text-[#1A2E22]">
              Berat saat ini: <span className="font-extrabold tabular-nums">{emptyTarget.berat_kg} Kg</span>
            </div>
            <div className="mt-4 flex gap-2.5">
              <button
                type="button"
                onClick={() => setEmptyTongId(null)}
                disabled={isEmptying}
                className="min-h-[46px] flex-1 rounded-full border border-[#CFC9B8] bg-white text-[12px] font-bold text-[#1A2E22] transition-colors hover:bg-[#FAFAF7] disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleEmptyTong}
                disabled={isEmptying}
                className="flex min-h-[46px] flex-1 items-center justify-center gap-1.5 rounded-full bg-[#2D6A4F] text-[12px] font-extrabold text-white transition-colors hover:bg-[#1A4235] disabled:opacity-60"
              >
                {isEmptying && <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>}
                {isEmptying ? 'Memproses...' : 'Ya, kosongkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
