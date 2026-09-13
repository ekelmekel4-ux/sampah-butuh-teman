import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KategoriKertas } from '../types';

export const UnitSetorKertasView: React.FC = () => {
  const { currentUser, units, tongList, createListing, requestSecondTong, setActiveRoute } = useApp();

  // Active unit
  const currentUnit =
    units.find(u => u.id === currentUser?.unit_id) ||
    units.find(u => u.inisial === 'FTD') ||
    units[0];

  // Assigned tongs for this unit
  const unitTongs = tongList.filter(t => t.unit_id === currentUnit.id);
  const availableTongs = unitTongs.length > 0 ? unitTongs : [tongList[0]];

  // Selected tong (default to first tong of unit)
  const [selectedTongId, setSelectedTongId] = useState<string>(availableTongs[0]?.id || '');

  // Form states
  const [kategori, setKategori] = useState<KategoriKertas>('hvs');
  const [beratKg, setBeratKg] = useState<number>(10);
  const [isTied, setIsTied] = useState<boolean>(true);
  const [isClean, setIsClean] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<{
    id: string;
    tongNama: string;
    jumlahKg: number;
    kategoriLabel: string;
    ecoPoints: number;
  } | null>(null);

  const activeTong =
    availableTongs.find(t => t.id === selectedTongId) || availableTongs[0];
  const sisaKapasitas = Math.max(0, activeTong.kapasitas_max_kg - activeTong.berat_kg);
  const isTongPenuh = sisaKapasitas <= 0;

  const kategoriOptions: {
    key: KategoriKertas;
    label: string;
    sub: string;
    icon: string;
    price: number;
  }[] = [
    {
      key: 'hvs',
      label: 'Kertas HVS / Arsip',
      sub: 'Dokumen kantor, kertas printer A4/F4 putih',
      icon: 'description',
      price: 1500
    },
    {
      key: 'kardus',
      label: 'Kardus Box Corrugated',
      sub: 'Kardus kemasan cokelat, dilipat pipih',
      icon: 'inventory_2',
      price: 1300
    },
    {
      key: 'koran',
      label: 'Koran & Majalah',
      sub: 'Koran bekas, majalah kampus, brosur',
      icon: 'newspaper',
      price: 1100
    },
    {
      key: 'campur',
      label: 'Campuran Kering',
      sub: 'Kertas arsip campur bersih non-minyak',
      icon: 'auto_stories',
      price: 900
    }
  ];

  const currentOption = kategoriOptions.find(k => k.key === kategori) || kategoriOptions[0];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (beratKg < 10) {
      setErrorMsg('Berat setoran harus setidaknya 10 Kg agar memenuhi standar kuota logistik.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const newListing = createListing({
        unitId: currentUnit.id,
        tongId: activeTong.id,
        jumlahKg: beratKg,
        kategori,
        kategoriLabel: currentOption.label,
        kondisi: [
          isTied ? 'Kering & Rapi Diikat Tali' : 'Belum diikat tali',
          isClean ? 'Bebas Klip Besi / Staples Tebal' : 'Perlu pengecekan klip'
        ],
        foto: photoUrl
      });

      setIsSubmitting(false);
      setSuccessData({
        id: newListing.id,
        tongNama: activeTong.nama_tong,
        jumlahKg: beratKg,
        kategoriLabel: currentOption.label,
        ecoPoints: beratKg * 2
      });
      setShowSuccessModal(true);
    }, 600);
  };

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4">
      {/* Top Bar Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveRoute('/unit/beranda')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57635A] hover:text-[#176B4D] transition-colors px-2 py-1 rounded-lg hover:bg-black/5"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Beranda</span>
        </button>

        <span className="text-[11px] font-bold text-[#8B6045] bg-[#8B6045]/10 px-2.5 py-0.5 rounded-full">
          {currentUnit.nama_unit}
        </span>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#176B4D]/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#176B4D]/10 text-[#176B4D] flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              add_circle
            </span>
          </div>
          <div>
            <h1 className="text-lg font-black text-[#1C1C16] tracking-tight">
              Setor Limbah Kertas
            </h1>
            <p className="text-xs text-[#57635A] mt-0.5">
              Masukkan kertas ke wadah tong unit Anda di drop point serbaguna.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* SECTION 1: Pilihan Tong Unit */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#176B4D]/10 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#1C1C16] uppercase tracking-wide flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#8B6045]">
                delete
              </span>
              <span>1. Dimasukkan ke Tong No. Berapa di Bagian Anda?</span>
            </label>
            <span className="text-[10px] font-bold text-[#176B4D] bg-[#176B4D]/10 px-2 py-0.5 rounded-full">
              Wadah Unit Anda
            </span>
          </div>

          <p className="text-[11px] text-[#57635A] leading-relaxed">
            Pilih tong fisik resmi milik unit <strong>{currentUnit.nama_unit}</strong> di Drop Point Gedung Serbaguna yang menjadi wadah setoran ini:
          </p>

          <div className="grid grid-cols-1 gap-2">
            {availableTongs.map(tong => {
              const isSelected = tong.id === activeTong.id;
              const sisa = Math.max(0, tong.kapasitas_max_kg - tong.berat_kg);
              const isFull = sisa <= 0;
              return (
                <div
                  key={tong.id}
                  onClick={() => setSelectedTongId(tong.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? isFull
                        ? 'border-rose-500 bg-rose-50/50 shadow-xs'
                        : 'border-[#176B4D] bg-[#176B4D]/5 shadow-xs'
                      : isFull
                      ? 'border-gray-200 bg-gray-100/70 opacity-80'
                      : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                        isFull
                          ? 'bg-rose-500 text-white'
                          : isSelected
                          ? 'bg-[#176B4D] text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isFull ? 'report' : 'inventory_2'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#1C1C16] truncate flex items-center gap-1.5">
                        <span>{tong.nama_tong} ({tong.nomor})</span>
                        {isFull && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                            PENUH
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#57635A] truncate mt-0.5">
                        {tong.lokasi_spesifik}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-xs font-bold ${isFull ? 'text-rose-600' : 'text-[#176B4D]'}`}>
                      {tong.berat_kg}/{tong.kapasitas_max_kg} Kg
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {isFull ? 'Kapasitas Penuh' : `Sisa ruang: ${sisa} Kg`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* If Active Tong is Full */}
          {isTongPenuh && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
              <span className="material-symbols-outlined text-rose-600 text-[18px] shrink-0 mt-0.5">
                error
              </span>
              <div className="leading-relaxed">
                <strong>Wadah {activeTong.nama_tong} Sudah Penuh ({activeTong.kapasitas_max_kg} Kg):</strong> Tidak dapat menerima setoran tambahan. Gunakan tong cadangan unit atau tunggu pengosongan armada pabrik.
              </div>
            </div>
          )}

          {/* Button to Activate Second Tong if only 1 exists */}
          {availableTongs.length < 2 && (
            <button
              type="button"
              onClick={() => {
                const newTong = requestSecondTong(currentUnit.id);
                setSelectedTongId(newTong.id);
                setErrorMsg('');
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#176B4D]/30 hover:border-[#176B4D] bg-[#176B4D]/5 hover:bg-[#176B4D]/10 text-[#176B4D] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Aktifkan Wadah Cadangan (Tong {currentUnit.inisial} No. 2)</span>
            </button>
          )}
        </div>

        {/* SECTION 2: Jenis Kertas */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#176B4D]/10 space-y-3">
          <label className="text-xs font-bold text-[#1C1C16] uppercase tracking-wide flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#176B4D]">
              category
            </span>
            <span>2. Pilih Jenis Kertas</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {kategoriOptions.map(opt => {
              const isSelected = opt.key === kategori;
              return (
                <div
                  key={opt.key}
                  onClick={() => setKategori(opt.key)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#176B4D] bg-[#176B4D]/5 shadow-xs'
                      : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isSelected ? 'text-[#176B4D]' : 'text-gray-500'
                      }`}
                    >
                      {opt.icon}
                    </span>
                    <span className="text-xs font-bold text-[#1C1C16]">
                      {opt.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#57635A] leading-relaxed mb-2">
                    {opt.sub}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px]">
                    <span className="text-[#8B6045] font-bold">
                      Rp {opt.price.toLocaleString('id-ID')}/Kg
                    </span>
                    <span className="text-[#176B4D] font-bold">+2 Pts/Kg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: Berat Kertas (Kg) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#176B4D]/10 space-y-3">
          <label className="text-xs font-bold text-[#1C1C16] uppercase tracking-wide flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#176B4D]">
              scale
            </span>
            <span>3. Berat Kertas Yang Disetor (Kg)</span>
          </label>

          <div className="flex items-center justify-center gap-3 py-2">
            <button
              type="button"
              onClick={() => setBeratKg(prev => Math.max(10, prev - 5))}
              className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xl flex items-center justify-center transition-colors active:scale-95"
              title="Kurang 5 Kg (Minimal 10 Kg)"
            >
              -
            </button>
            <div className="flex items-baseline gap-1.5 px-4 py-2 bg-[#F5F1E8] rounded-2xl border border-[#176B4D]/15">
              <input
                type="number"
                min={10}
                max={500}
                value={beratKg}
                onChange={e => {
                  const val = Number(e.target.value);
                  setBeratKg(val);
                  if (val < 10) {
                    setErrorMsg('Berat setoran minimal 10 Kg agar memenuhi standar kuota logistik.');
                  } else {
                    setErrorMsg('');
                  }
                }}
                className="w-20 text-center text-3xl font-black text-[#176B4D] bg-transparent outline-hidden"
              />
              <span className="text-sm font-bold text-gray-600">Kg</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setBeratKg(prev => prev + 5);
                setErrorMsg('');
              }}
              className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xl flex items-center justify-center transition-colors active:scale-95"
              title="Tambah 5 Kg"
            >
              +
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {[10, 20, 30, 50].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  setBeratKg(val);
                  setErrorMsg('');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  beratKg === val
                    ? 'bg-[#176B4D] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {val} Kg
              </button>
            ))}
          </div>

          {/* Penjagaan Minimal 10 Kg Alert */}
          <div
            className={`p-3 rounded-2xl border flex items-start gap-2.5 text-xs transition-colors ${
              beratKg < 10
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
              {beratKg < 10 ? 'error' : 'verified_user'}
            </span>
            <div className="leading-relaxed">
              <strong>Penjagaan Minimal 10 Kg:</strong>{' '}
              {beratKg < 10
                ? 'Berat harus setidaknya 10 Kg agar dapat diproses dan siap dijemput oleh armada pabrik daur ulang.'
                : 'Setoran memenuhi kuota minimal logistik (≥ 10 Kg). Siap dijemput mitra industri!'}
            </div>
          </div>

          {/* Live Rewards Estimate */}
          <div className="p-3 bg-[#F5F1E8] rounded-2xl border border-[#176B4D]/10 flex items-center justify-around text-center text-xs">
            <div>
              <div className="text-[10px] text-[#57635A]">Eco-Points Didapat</div>
              <div className="text-sm font-black text-[#176B4D]">
                +{beratKg * 2} Pts
              </div>
            </div>
            <div className="w-px h-7 bg-gray-300" />
            <div>
              <div className="text-[10px] text-[#57635A]">Estimasi Dana Riset</div>
              <div className="text-sm font-black text-[#8B6045]">
                Rp {(beratKg * currentOption.price).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Foto Kertas */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#176B4D]/10 space-y-3">
          <label className="text-xs font-bold text-[#1C1C16] uppercase tracking-wide flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#176B4D]">
              photo_camera
            </span>
            <span>4. Foto Sampah Kertas (Opsional / Dokumentasi)</span>
          </label>

          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative group">
              <img
                src={photoUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-[11px] text-[#57635A] leading-relaxed">
                Foto kondisi tumpukan kertas membantu armada pabrik mengonfirmasi kualitas dan kesesuaian muatan sebelum pickup.
              </p>
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1C1C16] text-xs font-bold cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-[16px]">upload</span>
                <span>Unggah Foto Baru</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 5: QC Checklist */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#176B4D]/10 space-y-2.5">
          <label className="text-xs font-bold text-[#1C1C16] uppercase tracking-wide flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-[18px] text-[#176B4D]">
              checklist
            </span>
            <span>5. Verifikasi Kondisi Kertas</span>
          </label>

          <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={isTied}
              onChange={e => setIsTied(e.target.checked)}
              className="rounded-sm text-[#176B4D] focus:ring-[#176B4D]"
            />
            <span className="text-xs text-[#1C1C16]">
              Kertas dalam kondisi <strong>kering</strong> dan terikat rapi / tersusun dalam kardus
            </span>
          </label>

          <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={isClean}
              onChange={e => setIsClean(e.target.checked)}
              className="rounded-sm text-[#176B4D] focus:ring-[#176B4D]"
            />
            <span className="text-xs text-[#1C1C16]">
              Bebas dari klip besi binder besar, staples tebal, dan plastik pembungkus
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 rounded-2xl bg-[#176B4D] hover:bg-[#0E4632] disabled:opacity-50 text-white font-black text-sm shadow-lg shadow-[#176B4D]/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span>Menyimpan Setoran...</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">
                check_circle
              </span>
              <span>
                Konfirmasi Setor {beratKg} Kg ke {activeTong.nama_tong}
              </span>
            </>
          )}
        </button>
      </form>

      {/* Success Modal Dialog */}
      {showSuccessModal && successData && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#176B4D]/20 animate-in fade-in zoom-in-95 text-center">
            <div className="w-14 h-14 rounded-full bg-[#176B4D]/10 text-[#176B4D] flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">
                task_alt
              </span>
            </div>

            <h3 className="text-lg font-black text-[#1C1C16]">
              Setoran Berhasil Dicatat!
            </h3>
            <p className="text-xs text-[#57635A] mt-1 leading-relaxed">
              Kertas telah ditautkan ke <strong>{successData.tongNama}</strong> di drop point Gedung Serbaguna.
            </p>

            <div className="bg-[#F5F1E8] rounded-2xl p-4 my-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Jumlah:</span>
                <strong className="text-[#1C1C16]">{successData.jumlahKg} Kg</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Kategori:</span>
                <strong className="text-[#1C1C16]">{successData.kategoriLabel}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Wadah Tong:</span>
                <strong className="text-[#8B6045]">{successData.tongNama}</strong>
              </div>
              <div className="pt-1 border-t border-gray-200 flex justify-between text-[#176B4D] font-bold">
                <span>Eco-Points Tambahan:</span>
                <span>+{successData.ecoPoints} Pts</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                setActiveRoute('/unit/beranda');
              }}
              className="w-full h-11 rounded-xl bg-[#176B4D] hover:bg-[#0E4632] text-white text-xs font-bold transition-colors shadow-xs"
            >
              Kembali ke Beranda Penyalur
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
