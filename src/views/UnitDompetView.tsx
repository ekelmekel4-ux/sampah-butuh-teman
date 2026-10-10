import React from 'react';
import { useApp } from '../context/AppContext';

export const UnitDompetView: React.FC = () => {
  const { currentUser, units, saldoSekarang, riwayatSaldo, setActiveRoute } = useApp();

  const currentUnit = units.find(u => u.id === currentUser?.unit_id) || units[0];

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4 font-sans text-[#1A2E22]">
      {/* Header */}
      <div className="flex items-center gap-3 px-1 py-1">
        <button
          onClick={() => setActiveRoute('/unit/beranda')}
          className="w-9 h-9 rounded-full bg-white hover:bg-[#D8F3DC] border border-[#2D6A4F]/20 flex items-center justify-center text-[#2D6A4F] transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <h1 className="text-lg font-extrabold tracking-tight">Dompet Unit</h1>
      </div>

      {/* Saldo Card */}
      <div className="bg-[#2D6A4F] rounded-[24px] p-6 text-white relative overflow-hidden shadow-lg shadow-[#2D6A4F]/20">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
        <div className="relative z-10">
          <div className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">
            Total Saldo Tersedia
          </div>
          <div className="text-3xl font-black tracking-tight flex items-center gap-2">
            Rp {saldoSekarang.toLocaleString('id-ID')}
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 py-2.5 rounded-full bg-white text-[#2D6A4F] font-extrabold text-xs shadow-md hover:bg-gray-50 active:scale-95 transition-all">
              Tarik Dana
            </button>
            <button className="flex-1 py-2.5 rounded-full bg-[#1A4235] text-white font-extrabold text-xs border border-white/20 hover:bg-[#0F2E22] active:scale-95 transition-all">
              Riwayat Penarikan
            </button>
          </div>
        </div>
      </div>

      {/* Riwayat Transaksi */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-extrabold tracking-tight px-1">Riwayat Transaksi</h2>
        
        {riwayatSaldo.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-xs text-[#52645A] border border-[#2D6A4F]/8">
            Belum ada riwayat transaksi pembayaran.
          </div>
        ) : (
          <div className="space-y-2">
            {riwayatSaldo.map((trx) => (
              <div key={trx.id} className="bg-white rounded-2xl p-4 border border-[#2D6A4F]/8 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      {trx.jenis === 'pembayaran_kertas' ? 'payments' : 'account_balance_wallet'}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1A2E22]">{trx.catatan || 'Pembayaran'}</div>
                    <div className="text-[10px] text-[#52645A] mt-0.5">{new Date(trx.created_at || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-black ${trx.jenis === 'penarikan' ? 'text-red-500' : 'text-[#2D6A4F]'}`}>
                    {trx.jenis === 'penarikan' ? '-' : '+'}Rp {trx.jumlah.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] font-bold text-[#52645A] uppercase">{trx.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
