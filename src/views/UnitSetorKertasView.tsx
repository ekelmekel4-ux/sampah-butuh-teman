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

  // Assigned tongs for this unit (sorted 1 to 5)
  const unitTongs = [...tongList]
    .filter(t => t.unit_id === currentUnit.id)
    .sort((a, b) => a.nomor.localeCompare(b.nomor));
  const availableTongs = unitTongs.length > 0 ? unitTongs : [tongList[0]];

  // Selected tong: pick the first one that has remaining capacity, fallback to the first tong
  const firstAvailable = availableTongs.find(t => (t.kapasitas_max_kg - t.berat_kg) > 0) || availableTongs[0];
  const [selectedTongId, setSelectedTongId] = useState<string>(firstAvailable?.id || '');

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
    if (beratKg > sisaKapasitas) {
      setErrorMsg(`Berat melebihi sisa kapasitas tong (${sisaKapasitas} Kg).`);
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const ecoPts = beratKg * 2;
      createListing({
        unitId: currentUnit.id,
        tongId: activeTong.id,
        jumlahKg: beratKg,
        kategori: currentOption.key || 'hvs',
        kategoriLabel: currentOption.label,
        kondisi: isClean ? ['Kering Rendah (A+)'] : ['Standar Kering (B)'],
        foto: photoUrl
      });

      setSuccessData({
        id: 'LST-' + Math.floor(1000 + Math.random() * 9000),
        tongNama: activeTong.nama_tong,
        jumlahKg: beratKg,
        kategoriLabel: currentOption.label,
        ecoPoints: ecoPts
      });

      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 800);
  };

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4 font-sans text-[#1A2E22]">
      
      {/* Header Profile & Back Button */}
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveRoute('/unit/beranda')}
            className="w-9 h-9 rounded-full bg-white border border-black/5 flex items-center justify-center text-gray-700 hover:bg-gray-50 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <div className="text-[11px] font-bold text-[#52645A] tracking-tight">
              Penyalur ({currentUnit.inisial})
            </div>
            <h1 className="text-base font-extrabold text-[#1A2E22] tracking-tight leading-tight">
              Catat Setoran Kertas Baru
            </h1>
          </div>
        </div>

        <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20">
          Sirkularitas Unit Kampus
        </span>
      </div>

      {/* Vibrant Green Header Banner (#2D6A4F Figma Style) */}
      <div className="w-full rounded-[28px] p-6 text-white bg-[#2D6A4F] shadow-md shadow-[#2D6A4F]/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <span className="text-[10px] font-extrabold text-white/80 uppercase tracking-widest block">
              FORM SIRKULAR KAMPUS
            </span>
            <h2 className="text-xl font-black text-white leading-tight mt-0.5">
              Input Limbah Kertas Unit
            </h2>
            <p className="text-xs text-white/90 mt-1 leading-relaxed font-medium">
              Kertas yang disetor akan otomatis dihitung nilai rupiah (Rp) dan menambah skor leaderboard unit Anda.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 ml-3">
            <span className="material-symbols-outlined text-[28px] text-white">post_add</span>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* 1. Pilih Wadah Tong Unit */}
        <div className="bg-white rounded-[24px] p-5 shadow-xs border border-black/5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#1A2E22]">1. Pilih Wadah Tong Fisik</h2>
            <span className="text-xs font-bold text-[#2D6A4F]">{unitTongs.length} Wadah Terdaftar</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {availableTongs.map(t => {
              const isSelected = t.id === selectedTongId;
              const sisa = Math.max(0, t.kapasitas_max_kg - t.berat_kg);
              const isFull = sisa <= 0;

              return (
                <div
                  key={t.id}
                  onClick={() => !isFull && setSelectedTongId(t.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#2D6A4F] bg-[#2D6A4F]/10 shadow-xs'
                      : isFull
                      ? 'border-gray-200 bg-gray-100/70 opacity-70 cursor-not-allowed'
                      : 'border-black/5 bg-[#F5F6F3] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold text-[#1A2E22] truncate">{t.nama_tong}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#2D6A4F] text-white' : 'bg-gray-200 text-gray-700'}`}>
                      Tong {t.nomor}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#52645A] font-medium">
                    Sisa Kapasitas: <strong className="text-[#2D6A4F]">{sisa} Kg</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Pilih Kategori Kertas (Figma Waste Categories) */}
        <div className="bg-white rounded-[24px] p-5 shadow-xs border border-black/5 space-y-3">
          <h2 className="text-sm font-extrabold text-[#1A2E22]">2. Pilih Kategori Kertas</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {kategoriOptions.map(opt => {
              const isSel = opt.key === kategori;
              return (
                <div
                  key={opt.key}
                  onClick={() => setKategori(opt.key)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSel
                      ? 'border-[#2D6A4F] bg-[#2D6A4F]/10 shadow-xs ring-2 ring-[#2D6A4F]/20'
                      : 'border-black/5 bg-[#F5F6F3] hover:bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSel ? 'bg-[#2D6A4F] text-white' : 'bg-white text-[#2D6A4F] border border-black/5'}`}>
                    <span className="material-symbols-outlined text-[22px]">{opt.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-extrabold text-[#1A2E22] truncate">{opt.label}</div>
                    <div className="text-[10px] text-[#52645A] font-medium leading-tight mt-0.5">{opt.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Estimasi Berat (Kg) */}
        <div className="bg-white rounded-[24px] p-5 shadow-xs border border-black/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#1A2E22]">3. Jumlah Berat Kertas (Kg)</h2>
            <span className="text-xs font-bold text-[#2D6A4F]">Min. 10 Kg</span>
          </div>

          <div className="flex items-center justify-center gap-4 bg-[#F5F6F3] p-4 rounded-2xl border border-black/5">
            <button
              type="button"
              onClick={() => setBeratKg(prev => Math.max(10, prev - 5))}
              className="w-11 h-11 rounded-full bg-white hover:bg-gray-100 text-[#1A2E22] font-black text-xl flex items-center justify-center shadow-xs transition-transform active:scale-95"
            >
              -
            </button>
            <div className="flex items-baseline gap-1 text-center">
              <input
                type="number"
                min="10"
                max={sisaKapasitas || 120}
                value={beratKg}
                onChange={e => setBeratKg(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-20 text-center text-3xl font-black text-[#2D6A4F] bg-transparent outline-none"
              />
              <span className="text-sm font-extrabold text-[#1A2E22]">Kg</span>
            </div>
            <button
              type="button"
              onClick={() => setBeratKg(prev => Math.min(sisaKapasitas || 120, prev + 5))}
              className="w-11 h-11 rounded-full bg-white hover:bg-gray-100 text-[#1A2E22] font-black text-xl flex items-center justify-center shadow-xs transition-transform active:scale-95"
            >
              +
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex items-center justify-center gap-2">
            {[10, 20, 35, 50, 75].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setBeratKg(val)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                  beratKg === val
                    ? 'bg-[#2D6A4F] text-white shadow-xs'
                    : 'bg-[#F5F6F3] text-[#52645A] hover:bg-gray-200'
                }`}
              >
                {val} Kg
              </button>
            ))}
          </div>

          {/* Real-time Kurs Kalkulasi Rupiah */}
          <div className="p-4 rounded-2xl bg-[#D8F3DC]/40 border border-[#2D6A4F]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">payments</span>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#52645A]">Estimasi Kas Unit (Aktual):</div>
                <div className="text-xs text-[#1A2E22] font-semibold">
                  {beratKg} Kg × Rp {currentOption.price.toLocaleString('id-ID')}/Kg
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-black text-[#2D6A4F]">
                Rp {(beratKg * currentOption.price).toLocaleString('id-ID')}
              </div>
              <div className="text-[10px] font-extrabold text-[#52645A]">
                +{beratKg * 2} Eco-Points
              </div>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-full bg-[#2D6A4F] hover:bg-[#1A4235] active:bg-[#0F2E22] text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Proses Menyimpan...</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>Simpan & Setor Kertas Ke Tong</span>
            </>
          )}
        </button>

      </form>

      {/* Success Modal */}
      {showSuccessModal && successData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-[#2D6A4F] uppercase tracking-wider bg-[#2D6A4F]/10 px-3 py-1 rounded-full">
                Setoran Berhasil Terdaftar
              </span>
              <h3 className="text-xl font-black text-[#1A2E22] mt-2">
                {successData.jumlahKg} Kg {successData.kategoriLabel}
              </h3>
              <p className="text-xs text-[#52645A] font-medium mt-1">
                Kertas telah dicatat di {successData.tongNama}. Bonus +{successData.ecoPoints} Eco-Points ditambahkan ke unit Anda!
              </p>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                setActiveRoute('/unit/beranda');
              }}
              className="w-full py-3.5 rounded-full bg-[#2D6A4F] hover:bg-[#1A4235] text-white font-extrabold text-xs shadow-md transition-all"
            >
              Kembali Ke Beranda Unit
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
