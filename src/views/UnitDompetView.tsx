import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const UnitDompetView: React.FC = () => {
  const { currentUser, units, saldoSekarang, riwayatSaldo, setActiveRoute, withdrawUnitBalance } = useApp();

  const currentUnit = units.find(u => u.id === currentUser?.unit_id) || units[0] || {
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

  // Filter unit's relevant transactions
  const unitTransactions = riwayatSaldo.filter(trx => {
    return trx.ke_id === currentUnit.id || trx.dari_id === currentUnit.id;
  });

  const filteredTransactions = unitTransactions.filter(trx => {
    if (filterType === 'masuk') return trx.jenis === 'pembayaran_kertas';
    if (filterType === 'tarik') return trx.jenis === 'penarikan';
    return true;
  });

  const totalMasuk = unitTransactions
    .filter(t => t.jenis === 'pembayaran_kertas')
    .reduce((acc, t) => acc + t.jumlah, 0);

  const totalDitarik = unitTransactions
    .filter(t => t.jenis === 'penarikan')
    .reduce((acc, t) => acc + t.jumlah, 0);

  const handleExecuteWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > saldoSekarang) {
      alert('Nominal penarikan tidak valid atau melebihi saldo tersedia.');
      return;
    }

    setIsSubmittingWd(true);
    setTimeout(async () => {
      await withdrawUnitBalance(currentUnit.id, withdrawAmount, selectedBank, rekeningNo);
      setIsSubmittingWd(false);
      setShowWithdrawModal(false);
    }, 700);
  };

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4 font-sans text-[#1A2E22]">
      {/* Header */}
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveRoute('/unit/beranda')}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#D8F3DC] border border-[#2D6A4F]/20 flex items-center justify-center text-[#2D6A4F] transition-colors shadow-xs"
            aria-label="Kembali"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-black tracking-tight text-[#174630]">Dompet Kas Unit</h1>
            <p className="text-[11px] text-[#52645A] font-medium">{currentUnit.nama_unit}</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-[#D8F3DC] text-[#005138] text-[10px] font-bold">
          Kas Terverifikasi
        </span>
      </div>

      {/* Saldo Hero Card */}
      <div className="bg-[#174630] rounded-[28px] p-6 text-white relative overflow-hidden shadow-xl shadow-[#0C2419]/25 border border-[#52B788]/30">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#52B788]/20 blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#A7F3D0] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse" />
              Saldo Kas Operasional Kertas
            </span>
            <span className="text-[11px] text-[#D1FAE5]/80 font-medium">Bisa Ditarik Kapan Saja</span>
          </div>

          <div className="text-3xl sm:text-4xl font-black tracking-tight flex items-baseline gap-1">
            <span className="text-xl font-normal text-[#A7F3D0]">Rp</span>
            <span>{saldoSekarang.toLocaleString('id-ID')}</span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
            <div className="bg-white/10 rounded-xl p-2.5">
              <span className="text-[10px] text-white/70 block font-medium">Total Dana Masuk</span>
              <span className="text-xs font-bold text-[#A7F3D0]">+Rp {totalMasuk.toLocaleString('id-ID')}</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5">
              <span className="text-[10px] text-white/70 block font-medium">Total Ditarik ke Bank</span>
              <span className="text-xs font-bold text-white/90">Rp {totalDitarik.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={saldoSekarang <= 0}
              className="flex-1 py-3 rounded-full bg-white text-[#174630] font-black text-xs shadow-md hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">account_balance</span>
              <span>Tarik Dana ke Kas</span>
            </button>
            <button
              onClick={() => setFilterType(filterType === 'tarik' ? 'semua' : 'tarik')}
              className="px-4 py-3 rounded-full bg-[#0F2D1F] text-white font-extrabold text-xs border border-white/20 hover:bg-[#0A1F15] active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              <span>Riwayat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Strip */}
      <div className="p-3.5 bg-white rounded-2xl border border-[#2D6A4F]/10 shadow-xs flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#D8F3DC] text-[#174630] flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-lg">sync_alt</span>
        </div>
        <p className="text-xs text-[#52645A] leading-relaxed">
          Tiap kilogram limbah kertas yang diangkut mitra industri langsung otomatis terkonversi menjadi dana kas digital unit ini.
        </p>
      </div>

      {/* Filter Tabs & Riwayat Transaksi */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black tracking-tight text-[#1A2E22]">Riwayat Mutasi Saldo</h2>
          <span className="text-xs text-[#52645A] font-semibold">
            {filteredTransactions.length} Transaksi
          </span>
        </div>

        {/* Filter Pills */}
        <div className="bg-[#F1EEE5] p-1 rounded-xl flex items-center gap-1 text-xs">
          <button
            onClick={() => setFilterType('semua')}
            className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all cursor-pointer ${
              filterType === 'semua' ? 'bg-white text-[#2D6A4F] shadow-xs' : 'text-[#52645A]'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterType('masuk')}
            className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all cursor-pointer ${
              filterType === 'masuk' ? 'bg-white text-[#2D6A4F] shadow-xs' : 'text-[#52645A]'
            }`}
          >
            Pemasukan Kertas
          </button>
          <button
            onClick={() => setFilterType('tarik')}
            className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all cursor-pointer ${
              filterType === 'tarik' ? 'bg-white text-[#2D6A4F] shadow-xs' : 'text-[#52645A]'
            }`}
          >
            Penarikan Kas
          </button>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-xs text-[#52645A] border border-[#2D6A4F]/10 space-y-2">
            <span className="material-symbols-outlined text-3xl text-gray-300">receipt_long</span>
            <p>Belum ada riwayat transaksi pada kategori ini.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTransactions.map(trx => (
              <div
                key={trx.id}
                className="bg-white rounded-2xl p-4 border border-[#2D6A4F]/10 flex items-center justify-between shadow-xs hover:border-[#2D6A4F]/30 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      trx.jenis === 'penarikan'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-[#D8F3DC] text-[#174630]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {trx.jenis === 'penarikan' ? 'arrow_downward' : 'payments'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-[#1A2E22] truncate">
                      {trx.catatan || 'Transaksi Dompet'}
                    </div>
                    <div className="text-[11px] text-[#52645A] flex items-center gap-1.5 mt-0.5">
                      <span>{trx.dari_nama || 'PT Mandiri Daur Lestari'}</span>
                      <span>•</span>
                      <span>
                        {new Date(trx.created_at || Date.now()).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <div
                    className={`text-sm font-black tracking-tight ${
                      trx.jenis === 'penarikan' ? 'text-red-500' : 'text-[#174630]'
                    }`}
                  >
                    {trx.jenis === 'penarikan' ? '-' : '+'}Rp {trx.jumlah.toLocaleString('id-ID')}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#059669] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                    {trx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Penarikan Dana */}
      {showWithdrawModal && (
        <div
          className="fixed inset-0 z-50 bg-[#0F241A]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={e => {
            if (e.target === e.currentTarget && !isSubmittingWd) setShowWithdrawModal(false);
          }}
        >
          <div className="bg-white rounded-[24px] max-w-sm w-full p-6 space-y-4 shadow-2xl border border-[#2D6A4F]/20 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#174630]">account_balance</span>
                <h3 className="font-black text-sm text-[#1A2E22]">Tarik Kas ke Rekening Bank</h3>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteWithdraw} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#52645A] mb-1">
                  Saldo Tersedia: <strong className="text-[#174630]">Rp {saldoSekarang.toLocaleString('id-ID')}</strong>
                </label>
                <input
                  type="number"
                  min="10000"
                  max={saldoSekarang}
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F7F8F5] border border-[#2D6A4F]/20 font-bold text-sm text-[#174630] focus:outline-none focus:border-[#2D6A4F]"
                />
                <div className="flex gap-2 mt-1.5">
                  {[50000, 100000, saldoSekarang].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setWithdrawAmount(amt)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#D8F3DC] text-[10px] font-bold text-[#174630] transition-colors"
                    >
                      {amt === saldoSekarang ? 'Semua' : `Rp ${(amt / 1000).toFixed(0)}k`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#52645A] mb-1">Pilih Bank Rekening Kas</label>
                <select
                  value={selectedBank}
                  onChange={e => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F8F5] border border-[#2D6A4F]/20 text-xs font-semibold focus:outline-none"
                >
                  <option value="Bank Mandiri">Bank Mandiri (Kampus UPJ)</option>
                  <option value="Bank BNI">Bank BNI (Biro Keuangan)</option>
                  <option value="Bank BCA">Bank BCA</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#52645A] mb-1">Nomor Rekening</label>
                <input
                  type="text"
                  value={rekeningNo}
                  onChange={e => setRekeningNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F8F5] border border-[#2D6A4F]/20 font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#52645A] mb-1">Atas Nama Rekening</label>
                <input
                  type="text"
                  value={atasNama}
                  onChange={e => setAtasNama(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F8F5] border border-[#2D6A4F]/20 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-[#52645A]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingWd || withdrawAmount <= 0}
                  className="flex-1 py-2.5 rounded-xl bg-[#174630] hover:bg-[#2D6A4F] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md"
                >
                  {isSubmittingWd ? 'Memproses...' : 'Tarik Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
