import React, { useState } from 'react';
import { MatchingTransaksi } from '../types';
import { useApp } from '../context/AppContext';

interface PaymentModalProps {
  matching: MatchingTransaksi;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  matching,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { payTransaction, setActiveRoute, setRole } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<'dompet' | 'qris' | 'va'>('dompet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptRef, setReceiptRef] = useState<string>('');

  if (!isOpen) return null;

  const handlePay = async () => {
    setIsProcessing(true);
    
    const methodLabels: Record<string, string> = {
      dompet: 'Transfer Dompet Kampus (Instan)',
      qris: 'QRIS Sirkularitas Dinamis',
      va: 'Virtual Account Bank Mandiri/BNI',
    };

    setTimeout(async () => {
      const result = await payTransaction(matching.id, methodLabels[selectedMethod]);
      setIsProcessing(false);
      if (result.success) {
        setIsSuccess(true);
        setReceiptRef(`PAY-${Date.now().toString().slice(-8)}`);
        if (onSuccess) onSuccess();
      }
    }, 800);
  };

  const handleGoToUnitDompet = () => {
    onClose();
    setRole('unit');
    setActiveRoute('/unit/dompet');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0F241A]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget && !isProcessing) onClose();
      }}
    >
      <div
        className="bg-white rounded-[24px] max-w-md w-full border border-[#2D6A4F]/15 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ boxShadow: '0 20px 40px -15px rgba(23,70,48,0.25)' }}
      >
        {/* Header */}
        <div className="bg-[#174630] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#A7F3D0]">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight leading-none">
                {isSuccess ? 'Bukti Pembayaran Sah' : 'Pembayaran Kertas Mitra'}
              </h3>
              <p className="text-[10px] text-[#A7F3D0]/80 mt-0.5">
                {isSuccess ? 'Transaksi Terverifikasi' : 'Terhubung ke Dompet Digital Unit'}
              </p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors"
              aria-label="Tutup"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content Body */}
        {!isSuccess ? (
          <div className="p-6 space-y-5 text-[#1A2E22]">
            {/* Tagihan Card */}
            <div className="p-4 rounded-2xl bg-[#F7F8F5] border border-[#E0E5E2] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#52645A] font-medium">Unit Penyalur (Penerima):</span>
                <span className="font-extrabold text-[#174630]">{matching.unit_nama}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#52645A] font-medium">Jenis & Volume Kertas:</span>
                <span className="font-bold text-[#1A2E22]">{matching.jenis_kertas} ({matching.jumlah_kg} Kg)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#52645A] font-medium">Kode Surat Jalan:</span>
                <span className="font-mono text-[11px] text-[#52645A]">{matching.surat_jalan_kode || `#SJ-${matching.id}`}</span>
              </div>
              
              <div className="pt-2.5 border-t border-[#E0E5E2] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#52645A] block">
                    Total Pembayaran
                  </span>
                  <span className="text-xl font-black text-[#174630] tracking-tight">
                    Rp {matching.nilai_rupiah.toLocaleString('id-ID')}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#D8F3DC] text-[#005138] text-[10px] font-extrabold">
                  + {matching.eco_points} Eco-Points
                </span>
              </div>
            </div>

            {/* Pilihan Metode Pembayaran */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1A2E22]">
                Pilih Metode Pembayaran:
              </label>

              <div className="space-y-2">
                {/* Opsi 1: Dompet Digital Kampus */}
                <div
                  onClick={() => setSelectedMethod('dompet')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    selectedMethod === 'dompet'
                      ? 'border-[#2D6A4F] bg-[#E8F5E9]/60 shadow-xs'
                      : 'border-[#E0E5E2] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedMethod === 'dompet'}
                    onChange={() => setSelectedMethod('dompet')}
                    className="mt-1 accent-[#2D6A4F]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#1A2E22]">
                        Dompet Kas Digital Unit (Instan)
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#2D6A4F] text-white">
                        Rekomendasi
                      </span>
                    </div>
                    <p className="text-[11px] text-[#52645A] mt-0.5 leading-relaxed">
                      Dana Rp {matching.nilai_rupiah.toLocaleString('id-ID')} langsung ditransfer otomatis ke saldo kas unit penyalur.
                    </p>
                  </div>
                </div>

                {/* Opsi 2: QRIS Sirkular */}
                <div
                  onClick={() => setSelectedMethod('qris')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    selectedMethod === 'qris'
                      ? 'border-[#2D6A4F] bg-[#E8F5E9]/60 shadow-xs'
                      : 'border-[#E0E5E2] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedMethod === 'qris'}
                    onChange={() => setSelectedMethod('qris')}
                    className="mt-1 accent-[#2D6A4F]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#1A2E22]">
                        QRIS Dinamis Sirkularitas UPJ
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FEF3C7] text-[#92400E]">
                        Semua Bank / e-Wallet
                      </span>
                    </div>
                    <p className="text-[11px] text-[#52645A] mt-0.5 leading-relaxed">
                      Scan cepat via BCA Mobile, Livin Mandiri, GoPay, OVO, atau ShopeePay.
                    </p>
                  </div>
                </div>

                {/* Opsi 3: Virtual Account */}
                <div
                  onClick={() => setSelectedMethod('va')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    selectedMethod === 'va'
                      ? 'border-[#2D6A4F] bg-[#E8F5E9]/60 shadow-xs'
                      : 'border-[#E0E5E2] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedMethod === 'va'}
                    onChange={() => setSelectedMethod('va')}
                    className="mt-1 accent-[#2D6A4F]"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-extrabold text-[#1A2E22] block">
                      Virtual Account Mandiri / BNI Kampus
                    </span>
                    <p className="text-[11px] text-[#52645A] mt-0.5 leading-relaxed">
                      No. VA: <span className="font-mono font-bold text-[#174630]">8809 1024 9912 3014</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Eksekusi Bayar */}
            <div className="pt-2 flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl border border-[#CFC9B8] text-xs font-bold text-[#52645A] hover:bg-[#F7F8F5] transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="flex-2 py-3 px-4 rounded-xl bg-[#174630] hover:bg-[#2D6A4F] active:scale-[0.98] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memproses Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>Bayar Sekarang • Rp {matching.nilai_rupiah.toLocaleString('id-ID')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Success Receipt State */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#D8F3DC] text-[#174630] flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-[#174630] tracking-tight">
                Pembayaran Berhasil!
              </h4>
              <p className="text-xs text-[#52645A] max-w-xs mx-auto leading-relaxed">
                Dana <strong className="text-[#174630]">Rp {matching.nilai_rupiah.toLocaleString('id-ID')}</strong> telah otomatis masuk ke dompet digital <strong className="text-[#174630]">{matching.unit_nama}</strong>.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="p-4 rounded-2xl bg-[#F7F8F5] border border-[#E0E5E2] text-left text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[#52645A]">Nomor Referensi:</span>
                <span className="font-mono font-bold text-[#174630]">{receiptRef}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#52645A]">Waktu Transaksi:</span>
                <span className="font-medium text-[#1A2E22]">Baru Saja</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#52645A]">Penerima Dana:</span>
                <span className="font-bold text-[#174630]">{matching.unit_nama}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#52645A]">Status Notifikasi:</span>
                <span className="inline-flex items-center gap-1 text-[#059669] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                  Terkirim ke PIC Unit
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#174630] hover:bg-[#2D6A4F] text-white text-xs font-extrabold shadow-sm transition-all"
              >
                Selesai & Tutup
              </button>
              <button
                type="button"
                onClick={handleGoToUnitDompet}
                className="w-full py-2.5 rounded-xl border border-[#2D6A4F]/25 text-[#174630] text-xs font-bold hover:bg-[#E8F5E9]/50 transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                <span>Cek Saldo di Dompet Unit</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
