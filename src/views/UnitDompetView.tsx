import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const STATUS_META: Record<string, { label: string; className: string }> = {
  berhasil: { label: 'Berhasil', className: 'bg-[#D8F3DC] text-[#174630]' },
  menunggu: { label: 'Menunggu', className: 'bg-[#FEF3C7] text-[#8A5A12]' },
  gagal: { label: 'Gagal', className: 'bg-[#FEECEC] text-[#C0392B]' },
};

export const UnitDompetView: React.FC = () => {
  const { currentUser, units, saldoSekarang, riwayatSaldo, setActiveRoute, withdrawUnitBalance } = useApp();

  const currentUnit =
    units.find(u => u.id === currentUser?.unit_id) ||
    units.find(u => u.inisial === 'FTD') ||
    units[0] ||
    {
      id: 'unit-ftd',
      nama_unit: 'Fakultas Teknik & Desain (FTD)',
      inisial: 'FTD',
      total_kg_tersalurkan: 0,
      eco_points: 0,
    };

  const [filterType, setFilterType] = useState<'semua' | 'masuk' | 'tarik'>('semua');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(50000);
  const [selectedBank, setSelectedBank] = useState<string>('Bank Mandiri');
  const [rekeningNo, setRekeningNo] = useState<string>('164-00-9821034-1');
  const [atasNama, setAtasNama] = useState<string>(`Kas Operasional ${currentUnit.nama_unit}`);
  const [isSubmittingWd, setIsSubmittingWd] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');

  const unitTransactions = riwayatSaldo.filter(trx => trx.ke_id === currentUnit.id || trx.dari_id === currentUnit.id);

  const totalMasuk = unitTransactions
    .filter(t => t.jenis === 'pembayaran_kertas')
    .reduce((acc, t) => acc + t.jumlah, 0);

  const totalDitarik = unitTransactions
    .filter(t => t.jenis === 'penarikan')
    .reduce((acc, t) => acc + t.jumlah, 0);

  const countMasuk = unitTransactions.filter(t => t.jenis === 'pembayaran_kertas').length;
  const countTarik = unitTransactions.filter(t => t.jenis === 'penarikan').length;

  const filteredTransactions = unitTransactions.filter(trx => {
    if (filterType === 'masuk') return trx.jenis === 'pembayaran_kertas';
    if (filterType === 'tarik') return trx.jenis === 'penarikan';
    return true;
  });

  const quickAmounts = Array.from(
    new Set([25000, 50000, 100000, saldoSekarang].filter(amount => amount > 0 && amount <= saldoSekarang))
  );

  const openWithdrawModal = () => {
    setWithdrawError('');
    setWithdrawAmount(Math.min(50000, Math.max(0, saldoSekarang)) || saldoSekarang);
    setShowWithdrawModal(true);
  };

  const handleExecuteWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');

    if (withdrawAmount <= 0 || withdrawAmount > saldoSekarang) {
      setWithdrawError('Nominal penarikan tidak valid atau melebihi saldo tersedia.');
      return;
    }

    setIsSubmittingWd(true);
    try {
      const result = await withdrawUnitBalance(currentUnit.id, withdrawAmount, selectedBank, rekeningNo);
      if (!result.success) {
        setWithdrawError(result.message || 'Penarikan gagal diproses.');
        return;
      }
      setShowWithdrawModal(false);
      setFilterType('tarik');
    } catch {
      setWithdrawError('Penarikan gagal diproses. Periksa koneksi lalu coba lagi.');
    } finally {
      setIsSubmittingWd(false);
    }
  };

  const filterOptions: { key: 'semua' | 'masuk' | 'tarik'; label: string; count: number }[] = [
    { key: 'semua', label: 'Semua', count: unitTransactions.length },
    { key: 'masuk', label: 'Pemasukan', count: countMasuk },
    { key: 'tarik', label: 'Penarikan', count: countTarik },
  ];

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pb-24 font-sans text-[#1A2E22]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-1 py-1">
        <div className="flex min-w-0 items-start gap-3">
          <button
            onClick={() => setActiveRoute('/unit/beranda')}
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2D6A4F]/15 bg-white text-[#2D6A4F] shadow-xs transition-colors hover:bg-[#D8F3DC] focus-visible:outline-2 focus-visible:outline-[#2D6A4F] focus-visible:outline-offset-2"
            aria-label="Kembali ke beranda unit"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[#8CA090]">Kas unit · {currentUnit.inisial}</p>
            <h1 className="mt-0.5 text-[24px] font-extrabold leading-tight tracking-tight text-[#1A2E22]">
              Dompet kas
            </h1>
          </div>
        </div>
        <span className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-full bg-[#D8F3DC] px-2.5 py-1 text-[10px] font-extrabold text-[#174630]">
          <span className="material-symbols-outlined text-[13px]">check_circle</span>
          Terverifikasi
        </span>
      </div>

      {/* Saldo hero */}
      <section
        aria-label="Saldo kas unit"
        className="relative overflow-hidden rounded-[24px] border border-[#52B788]/30 bg-gradient-to-br from-[#2D6A4F] via-[#1A4235] to-[#0F2E22] p-5 text-white shadow-[0_18px_40px_rgba(15,46,34,0.28)]"
      >
        <div className="pointer-events-none absolute -right-14 -top-16 h-52 w-52 rounded-full bg-[#52B788]/25 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-[#A7F3D0]/10 blur-2xl" aria-hidden="true" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-[#D1FAE5]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#A7F3D0]" />
              Saldo kas operasional
            </span>
            <span className="text-right text-[10px] font-medium leading-snug text-white/60">
              Rekening kas unit
              <br />
              {currentUnit.inisial}
            </span>
          </div>

          <div>
            <p className="text-[11px] font-medium text-white/70">Dana tersedia</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-semibold text-[#A7F3D0]">Rp</span>
              <span className="text-[32px] font-black leading-none tracking-tight tabular-nums sm:text-[36px]">
                {saldoSekarang.toLocaleString('id-ID')}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-white/65">
              Bertambah otomatis dari kertas yang dijemput mitra industri.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-[10px] font-medium text-white/65">Total dana masuk</p>
              <p className="mt-0.5 text-[13px] font-extrabold tabular-nums text-[#A7F3D0]">
                +Rp {totalMasuk.toLocaleString('id-ID')}
              </p>
              <p className="mt-0.5 text-[9px] font-medium text-white/50">{countMasuk} transaksi</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-[10px] font-medium text-white/65">Total ditarik</p>
              <p className="mt-0.5 text-[13px] font-extrabold tabular-nums text-white/90">
                Rp {totalDitarik.toLocaleString('id-ID')}
              </p>
              <p className="mt-0.5 text-[9px] font-medium text-white/50">{countTarik} penarikan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={openWithdrawModal}
              disabled={saldoSekarang <= 0}
              className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-full bg-white px-3 text-[12px] font-extrabold text-[#174630] shadow-md transition-all hover:bg-[#D8F3DC] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
              Tarik dana
            </button>
            <button
              type="button"
              onClick={() => setActiveRoute('/unit/setor-kertas')}
              className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 text-[12px] font-extrabold text-white transition-colors hover:bg-white/15"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Setor kertas
            </button>
          </div>
        </div>
      </section>

      {/* Info strip */}
      <div className="flex items-start gap-3 rounded-2xl border border-[#2D6A4F]/10 bg-white p-3.5 shadow-xs">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F2F7F4] text-[#2D6A4F]">
          <span className="material-symbols-outlined text-lg">sync_alt</span>
        </div>
        <p className="text-[11px] leading-relaxed text-[#52645A]">
          Setiap kilogram kertas yang diangkut mitra otomatis dikonversi menjadi dana kas digital unit.
          Riwayat di bawah mencatat semua mutasi saldo.
        </p>
      </div>

      {/* Riwayat */}
      <section className="space-y-3" aria-label="Riwayat mutasi saldo">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold text-[#1A2E22]">Riwayat mutasi</h2>
          <span className="text-[11px] font-semibold text-[#8CA090]">{filteredTransactions.length} transaksi</span>
        </div>

        <div className="flex gap-1 rounded-xl bg-[#F1EEE5] p-1" role="group" aria-label="Filter transaksi">
          {filterOptions.map(option => {
            const active = filterType === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setFilterType(option.key)}
                aria-pressed={active}
                className={`flex min-h-[38px] flex-1 items-center justify-center gap-1.5 rounded-lg px-2 text-[11px] font-bold transition-all ${
                  active ? 'bg-white text-[#2D6A4F] shadow-xs' : 'text-[#52645A] hover:text-[#1A2E22]'
                }`}
              >
                {option.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold tabular-nums ${
                    active ? 'bg-[#D8F3DC] text-[#174630]' : 'bg-white/60 text-[#8CA090]'
                  }`}
                >
                  {option.count}
                </span>
              </button>
            );
          })}
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#2D6A4F]/25 bg-white p-7 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F7F4] text-[#2D6A4F]">
              <span className="material-symbols-outlined text-2xl">receipt_long</span>
            </div>
            <p className="mt-3 text-sm font-extrabold text-[#1A2E22]">
              {unitTransactions.length === 0 ? 'Belum ada mutasi saldo' : 'Tidak ada transaksi di filter ini'}
            </p>
            <p className="mx-auto mt-1 max-w-[290px] text-[12px] leading-relaxed text-[#52645A]">
              {unitTransactions.length === 0
                ? 'Dana masuk akan tercatat setelah mitra menjemput kertas dari tong unit.'
                : 'Pilih filter lain untuk melihat seluruh mutasi saldo unit.'}
            </p>
            {unitTransactions.length === 0 ? (
              <button
                type="button"
                onClick={() => setActiveRoute('/unit/setor-kertas')}
                className="mt-3 inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#2D6A4F] px-4 text-[12px] font-extrabold text-white transition-colors hover:bg-[#1A4235]"
              >
                <span className="material-symbols-outlined text-[17px]">add_circle</span>
                Mulai setor kertas
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setFilterType('semua')}
                className="mt-3 inline-flex min-h-[38px] items-center rounded-full bg-[#F2F7F4] px-4 text-[11px] font-extrabold text-[#2D6A4F] transition-colors hover:bg-[#D8F3DC]"
              >
                Tampilkan semua
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTransactions.map(trx => {
              const statusMeta = STATUS_META[trx.status] || STATUS_META.berhasil;
              const isWithdrawal = trx.jenis === 'penarikan';
              const date = new Date(trx.created_at || Date.now()).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={trx.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[#2D6A4F]/10 bg-white p-3.5 shadow-xs transition-colors hover:border-[#2D6A4F]/25"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        isWithdrawal ? 'bg-[#FEECEC] text-[#C0392B]' : 'bg-[#D8F3DC] text-[#174630]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isWithdrawal ? 'arrow_downward' : 'payments'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-extrabold text-[#1A2E22]">
                        {trx.catatan || (isWithdrawal ? 'Penarikan kas unit' : 'Pembayaran kertas')}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 truncate text-[10px] font-medium text-[#6B7C70]">
                        <span className="truncate">{trx.dari_nama || 'PT Mandiri Daur Lestari'}</span>
                        <span aria-hidden="true">·</span>
                        <span className="shrink-0">{date}</span>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 pl-2 text-right">
                    <p
                      className={`text-[13px] font-black tracking-tight tabular-nums ${
                        isWithdrawal ? 'text-[#C0392B]' : 'text-[#174630]'
                      }`}
                    >
                      {isWithdrawal ? '-' : '+'}Rp {trx.jumlah.toLocaleString('id-ID')}
                    </p>
                    <span className={`mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-extrabold ${statusMeta.className}`}>
                      {statusMeta.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal penarikan */}
      {showWithdrawModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#0F241A]/60 p-0 backdrop-blur-xs sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tarik-dana-title"
          onClick={e => {
            if (e.target === e.currentTarget && !isSubmittingWd) setShowWithdrawModal(false);
          }}
        >
          <div className="flex max-h-[92vh] w-full max-w-sm animate-in slide-in-from-bottom flex-col overflow-hidden rounded-t-[28px] border border-[#2D6A4F]/15 bg-white shadow-2xl duration-300 sm:rounded-[28px]">
            <div className="flex items-start justify-between gap-3 border-b border-[#2D6A4F]/8 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D8F3DC] text-[#174630]">
                  <span className="material-symbols-outlined text-[21px]">account_balance</span>
                </span>
                <div>
                  <h3 id="tarik-dana-title" className="text-sm font-extrabold text-[#1A2E22]">
                    Tarik dana kas
                  </h3>
                  <p className="text-[10px] font-medium text-[#8CA090]">Ke rekening bank unit</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                disabled={isSubmittingWd}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#8CA090] transition-colors hover:bg-[#F2F7F4] hover:text-[#1A2E22] disabled:opacity-50"
                aria-label="Tutup form penarikan"
              >
                <span className="material-symbols-outlined text-[19px]">close</span>
              </button>
            </div>

            <form onSubmit={handleExecuteWithdraw} className="space-y-3.5 overflow-y-auto p-5">
              <div className="rounded-2xl bg-[#F7FAF8] p-3">
                <p className="text-[10px] font-medium text-[#6B7C70]">Saldo tersedia</p>
                <p className="mt-0.5 text-lg font-black tabular-nums text-[#174630]">
                  Rp {saldoSekarang.toLocaleString('id-ID')}
                </p>
              </div>

              <div>
                <label htmlFor="nominal-tarik" className="mb-1 block text-[11px] font-bold text-[#52645A]">
                  Nominal penarikan
                </label>
                <div className="flex min-h-[48px] items-center gap-2 rounded-xl border border-[#2D6A4F]/20 bg-[#F7FAF8] px-3 focus-within:border-[#2D6A4F] focus-within:ring-2 focus-within:ring-[#2D6A4F]/15">
                  <span className="text-[12px] font-bold text-[#8CA090]">Rp</span>
                  <input
                    id="nominal-tarik"
                    type="number"
                    min="1"
                    max={saldoSekarang}
                    value={withdrawAmount}
                    onChange={e => {
                      setWithdrawAmount(Number(e.target.value));
                      setWithdrawError('');
                    }}
                    className="w-full bg-transparent py-3 text-sm font-extrabold tabular-nums text-[#174630] outline-none"
                  />
                </div>
                {quickAmounts.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {quickAmounts.map(amount => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => {
                          setWithdrawAmount(amount);
                          setWithdrawError('');
                        }}
                        className={`min-h-[32px] rounded-full px-2.5 text-[10px] font-bold transition-colors ${
                          withdrawAmount === amount
                            ? 'bg-[#2D6A4F] text-white'
                            : 'bg-[#F2F7F4] text-[#174630] hover:bg-[#D8F3DC]'
                        }`}
                      >
                        {amount === saldoSekarang ? 'Semua' : `Rp ${(amount / 1000).toFixed(0)}k`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="bank-tarik" className="mb-1 block text-[11px] font-bold text-[#52645A]">
                  Bank tujuan
                </label>
                <select
                  id="bank-tarik"
                  value={selectedBank}
                  onChange={e => setSelectedBank(e.target.value)}
                  className="min-h-[44px] w-full rounded-xl border border-[#2D6A4F]/15 bg-[#F7FAF8] px-3 text-[12px] font-semibold text-[#1A2E22] outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15"
                >
                  <option value="Bank Mandiri">Bank Mandiri (Kampus UPJ)</option>
                  <option value="Bank BNI">Bank BNI (Biro Keuangan)</option>
                  <option value="Bank BCA">Bank BCA</option>
                </select>
              </div>

              <div>
                <label htmlFor="rekening-tarik" className="mb-1 block text-[11px] font-bold text-[#52645A]">
                  Nomor rekening
                </label>
                <input
                  id="rekening-tarik"
                  type="text"
                  value={rekeningNo}
                  onChange={e => setRekeningNo(e.target.value)}
                  className="min-h-[44px] w-full rounded-xl border border-[#2D6A4F]/15 bg-[#F7FAF8] px-3 font-mono text-[12px] text-[#1A2E22] outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15"
                />
              </div>

              <div>
                <label htmlFor="atasnama-tarik" className="mb-1 block text-[11px] font-bold text-[#52645A]">
                  Atas nama
                </label>
                <input
                  id="atasnama-tarik"
                  type="text"
                  value={atasNama}
                  onChange={e => setAtasNama(e.target.value)}
                  className="min-h-[44px] w-full rounded-xl border border-[#2D6A4F]/15 bg-[#F7FAF8] px-3 text-[12px] font-semibold text-[#1A2E22] outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15"
                />
              </div>

              <div className="rounded-xl border border-[#2D6A4F]/10 bg-[#F7FAF8] px-3 py-2.5">
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-medium text-[#52645A]">Dana diterima</span>
                  <span className="font-extrabold tabular-nums text-[#174630]">
                    Rp {Math.max(0, withdrawAmount || 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="mt-1 text-[9px] font-medium leading-relaxed text-[#8CA090]">
                  Dana masuk ke rekening kas unit, bukan rekening pribadi PIC.
                </p>
              </div>

              {withdrawError && (
                <div className="flex items-start gap-2 rounded-xl bg-[#FEECEC] px-3 py-2.5 text-[11px] font-bold text-[#C0392B]" role="alert">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {withdrawError}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  disabled={isSubmittingWd}
                  className="min-h-[46px] flex-1 rounded-full border border-[#CFC9B8] bg-white text-[12px] font-bold text-[#52645A] transition-colors hover:bg-[#FAFAF7] disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingWd || withdrawAmount <= 0}
                  className="flex min-h-[46px] flex-1 items-center justify-center gap-1.5 rounded-full bg-[#174630] text-[12px] font-extrabold text-white shadow-md transition-colors hover:bg-[#2D6A4F] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingWd && (
                    <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  )}
                  {isSubmittingWd ? 'Memproses...' : 'Tarik sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
