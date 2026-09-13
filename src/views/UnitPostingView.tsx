import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KategoriKertas } from '../types';

export const UnitPostingView: React.FC = () => {
  const { units, tongList, listings, createListing, setActiveRoute } = useApp();

  // Active unit representation (FTD by default)
  const currentUnit = units.find(u => u.inisial === 'FTD') || units[0];
  const assignedTong = tongList.find(t => t.unit_id === currentUnit.id) || tongList[0];

  // Form states
  const [kategori, setKategori] = useState<KategoriKertas>('hvs');
  const [beratKg, setBeratKg] = useState<number>(45);
  const [isTied, setIsTied] = useState<boolean>(true);
  const [isClean, setIsClean] = useState<boolean>(true);
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getKategoriLabel = (cat: KategoriKertas) => {
    switch (cat) {
      case 'hvs':
        return 'Kertas HVS / Arsip';
      case 'kardus':
        return 'Kardus Box Corrugated';
      case 'koran':
        return 'Koran / Majalah';
      case 'campur':
        return 'Campuran Bersih';
    }
  };

  const handleIncrement = () => setBeratKg(prev => prev + 5);
  const handleDecrement = () => setBeratKg(prev => Math.max(5, prev - 5));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handlePosting = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      createListing({
        unitId: currentUnit.id,
        jumlahKg: beratKg,
        kategori,
        kategoriLabel: getKategoriLabel(kategori),
        kondisi: [
          isTied ? 'Kering & Rapi Diikat Tali' : 'Belum diikat tali',
          isClean ? 'Bebas Klip Besi / Staples Tebal' : 'Perlu pembersihan klip'
        ],
        foto: photoUrl
      });

      setIsSubmitting(false);
      setToastMessage(`Berhasil! ${beratKg} Kg ${getKategoriLabel(kategori)} ditautkan ke ${assignedTong.nama_tong}.`);

      // Scroll smoothly down to view in history
      setTimeout(() => setToastMessage(null), 4000);
    }, 800);
  };

  // Unit specific listings
  const unitListings = listings.filter(l => l.unit_id === currentUnit.id);

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4">
      {/* Unit Profile Header Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#176B4D] text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9CF2B5] text-[#157140]">
                UNIT TERVERIFIKASI
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFDBC8] text-[#8B6045]">
                {assignedTong.nama_tong}
              </span>
            </div>
            <h2 className="text-base font-bold text-[#1C1C16] truncate mt-1">
              {currentUnit.nama_unit}
            </h2>
            <p className="text-xs text-[#57635A] truncate">
              {currentUnit.lokasi_detail}
            </p>
          </div>
        </div>

        {/* Eco-Points & Rank Stats */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-[#F7F3EA] rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#A4F3CC] flex items-center justify-center text-[#005138]">
              <span className="material-symbols-outlined text-xl">eco</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-[#57635A] block uppercase tracking-wider">
                ECO-POINTS
              </span>
              <span className="text-base font-extrabold text-[#005138]">
                {currentUnit.eco_points.toLocaleString('id-ID')} <span className="text-xs font-normal">Pts</span>
              </span>
            </div>
          </div>

          <div className="bg-[#F7F3EA] rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FFDBC8] flex items-center justify-center text-[#8B6045]">
              <span className="material-symbols-outlined text-xl">military_tech</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-[#57635A] block uppercase tracking-wider">
                PERINGKAT
              </span>
              <span className="text-base font-extrabold text-[#8B6045]">
                #1 <span className="text-xs font-normal text-[#57635A]">Se-Kampus</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form: Input Setor Kertas Baru */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#176B4D] rounded-full"></div>
            <h3 className="text-sm font-bold text-[#1C1C16]">Input Setor Kertas Baru</h3>
          </div>
          <span className="text-[10px] font-bold text-[#176B4D] bg-[#A4F3CC]/50 px-2 py-0.5 rounded-full">
            Langkah Cepat
          </span>
        </div>

        {/* 1. Pilih Kategori Kertas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-[#1C1C16]">Pilih Kategori Kertas</label>
            <span className="text-[10px] text-[#57635A]">Wajib dipilih</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* HVS */}
            <button
              type="button"
              onClick={() => setKategori('hvs')}
              className={`p-3 rounded-xl text-left transition-all border ${
                kategori === 'hvs'
                  ? 'bg-[#176B4D] text-white border-[#176B4D] shadow-xs'
                  : 'bg-[#F7F3EA] text-[#1C1C16] border-transparent hover:bg-[#ECE8DF]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="material-symbols-outlined text-xl">description</span>
                {kategori === 'hvs' && (
                  <span className="material-symbols-outlined text-base text-[#A4F3CC]">check_circle</span>
                )}
              </div>
              <div className="text-xs font-bold leading-tight">HVS / Arsip</div>
              <div className={`text-[10px] mt-0.5 ${kategori === 'hvs' ? 'text-white/80' : 'text-[#57635A]'}`}>
                Kertas kerja putih
              </div>
            </button>

            {/* Kardus */}
            <button
              type="button"
              onClick={() => setKategori('kardus')}
              className={`p-3 rounded-xl text-left transition-all border ${
                kategori === 'kardus'
                  ? 'bg-[#8B6045] text-white border-[#8B6045] shadow-xs'
                  : 'bg-[#F7F3EA] text-[#1C1C16] border-transparent hover:bg-[#ECE8DF]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="material-symbols-outlined text-xl">inventory_2</span>
                {kategori === 'kardus' && (
                  <span className="material-symbols-outlined text-base text-[#FFDBC8]">check_circle</span>
                )}
              </div>
              <div className="text-xs font-bold leading-tight">Kardus Box</div>
              <div className={`text-[10px] mt-0.5 ${kategori === 'kardus' ? 'text-white/80' : 'text-[#57635A]'}`}>
                Karton & tebal
              </div>
            </button>

            {/* Koran */}
            <button
              type="button"
              onClick={() => setKategori('koran')}
              className={`p-3 rounded-xl text-left transition-all border ${
                kategori === 'koran'
                  ? 'bg-[#176B4D] text-white border-[#176B4D] shadow-xs'
                  : 'bg-[#F7F3EA] text-[#1C1C16] border-transparent hover:bg-[#ECE8DF]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="material-symbols-outlined text-xl">newspaper</span>
                {kategori === 'koran' && (
                  <span className="material-symbols-outlined text-base text-[#A4F3CC]">check_circle</span>
                )}
              </div>
              <div className="text-xs font-bold leading-tight">Koran / Majalah</div>
              <div className={`text-[10px] mt-0.5 ${kategori === 'koran' ? 'text-white/80' : 'text-[#57635A]'}`}>
                Warna & buram
              </div>
            </button>

            {/* Campuran Bersih */}
            <button
              type="button"
              onClick={() => setKategori('campur')}
              className={`p-3 rounded-xl text-left transition-all border ${
                kategori === 'campur'
                  ? 'bg-[#176B4D] text-white border-[#176B4D] shadow-xs'
                  : 'bg-[#F7F3EA] text-[#1C1C16] border-transparent hover:bg-[#ECE8DF]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="material-symbols-outlined text-xl">layers</span>
                {kategori === 'campur' && (
                  <span className="material-symbols-outlined text-base text-[#A4F3CC]">check_circle</span>
                )}
              </div>
              <div className="text-xs font-bold leading-tight">Campuran Bersih</div>
              <div className={`text-[10px] mt-0.5 ${kategori === 'campur' ? 'text-white/80' : 'text-[#57635A]'}`}>
                Brosur & amplop
              </div>
            </button>
          </div>
        </div>

        {/* 2. Estimasi Berat Total Stepper */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-[#1C1C16]">Estimasi Berat Total</label>
            <span className="text-[10px] text-[#0D6D3C] font-semibold">Kelipatan 5 Kg disarankan</span>
          </div>

          <div className="bg-[#F7F3EA] p-3 rounded-xl flex items-center justify-between">
            <button
              type="button"
              onClick={handleDecrement}
              className="w-10 h-10 rounded-lg bg-white text-[#1C1C16] flex items-center justify-center font-bold text-lg shadow-xs active:scale-95 transition-all"
            >
              −
            </button>

            <div className="text-center">
              <div className="text-2xl font-extrabold text-[#005138]">
                {beratKg} <span className="text-sm font-normal text-[#1C1C16]">Kg</span>
              </div>
              <span className="text-[10px] text-[#57635A]">
                Kapasitas tong tersisa: {assignedTong.kapasitas_max_kg - assignedTong.berat_kg} Kg
              </span>
            </div>

            <button
              type="button"
              onClick={handleIncrement}
              className="w-10 h-10 rounded-lg bg-[#176B4D] text-white flex items-center justify-center font-bold text-lg shadow-xs active:scale-95 transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* 3. Standar Kerapihan Kertas */}
        <div className="space-y-2">
          <label className="font-bold text-xs text-[#1C1C16] block">
            Standar Kerapihan Kertas
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-[#F7F3EA] cursor-pointer hover:bg-[#ECE8DF] transition-colors">
            <input
              type="checkbox"
              checked={isTied}
              onChange={e => setIsTied(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#176B4D] accent-[#176B4D] cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1C1C16]">Kering & Rapi Diikat Tali</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#9CF2B5] text-[#157140]">
                  Rekomendasi
                </span>
              </div>
              <p className="text-[11px] text-[#57635A] mt-0.5">
                Mencegah lembaran berserakan saat penimbangan mitra pabrik.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-[#F7F3EA] cursor-pointer hover:bg-[#ECE8DF] transition-colors">
            <input
              type="checkbox"
              checked={isClean}
              onChange={e => setIsClean(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#176B4D] accent-[#176B4D] cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#1C1C16] block">
                Bebas Klip Besi / Staples Tebal / Plastik
              </span>
              <p className="text-[11px] text-[#57635A] mt-0.5">
                Mempercepat proses bubur kertas daur ulang tanpa merusak pisau pulper.
              </p>
            </div>
          </label>
        </div>

        {/* 4. Dokumentasi Tumpukan Kertas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-[#1C1C16]">Dokumentasi Tumpukan Kertas</label>
            <span className="text-[10px] text-[#57635A]">1 Foto wajib</span>
          </div>

          <div className="rounded-xl overflow-hidden border border-[#176B4D]/15 bg-[#F7F3EA]">
            <div className="relative h-44 w-full bg-gray-100">
              <img
                src={photoUrl}
                alt="Dokumentasi Kertas"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] backdrop-blur-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-[#9CF2B5]">verified</span>
                Foto arsip terdeteksi rapi & valid
              </div>
            </div>

            <div className="p-2.5 flex items-center justify-between">
              <span className="text-[11px] text-[#57635A]">Foto dokumen & kardus riil</span>
              <label className="cursor-pointer text-xs font-bold text-[#176B4D] hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
                <span>Ganti Foto Lainnya</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* 5. Alokasi Tong Otomatis (Central Drop Point Concept) */}
        <div className="p-3.5 rounded-xl bg-[#F7F3EA] border border-[#176B4D]/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1C1C16] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#176B4D]"></span>
              Alokasi Tong Otomatis
            </span>
            <span className="text-[10px] font-bold text-[#157140] bg-[#9CF2B5] px-2 py-0.5 rounded-full">
              Siap Isi
            </span>
          </div>

          <p className="text-xs text-[#57635A]">
            Kertas dialokasikan ke: <strong className="text-[#005138]">Drop Point Pusat (Gedung Serbaguna Kampus)</strong>
          </p>

          <div className="flex items-center gap-3 p-2 rounded-lg bg-white border border-[#176B4D]/10">
            <div className="w-8 h-8 rounded-md bg-[#FFDBC8] text-[#8B6045] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-lg">delete</span>
            </div>
            <div>
              <span className="text-[10px] text-[#57635A] uppercase tracking-wider block font-semibold">
                KODE TONG KHUSUS UNIT
              </span>
              <span className="text-xs font-extrabold text-[#176B4D]">
                {assignedTong.nama_tong}
              </span>
            </div>
          </div>
        </div>

        {/* CTA Posting */}
        <button
          type="button"
          onClick={handlePosting}
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-[#005138] hover:bg-[#176B4D] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined text-lg animate-spin">sync</span>
              <span>Memproses Alokasi Tong...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                task_alt
              </span>
              <span>Posting & Konfirmasi Kertas di Tong</span>
            </>
          )}
        </button>

        {toastMessage && (
          <div className="p-3 bg-[#9CF2B5]/30 border border-[#157140]/30 rounded-xl text-xs text-[#157140] font-semibold flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-base shrink-0">check_circle</span>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Motivational Research Banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#F7F3EA] to-[#ECE8DF] border border-[#176B4D]/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#FFDBC8] flex items-center justify-center text-[#8B6045] shrink-0">
          <span className="material-symbols-outlined text-lg">school</span>
        </div>
        <div className="text-xs">
          <strong className="text-[#1C1C16] block">Kertas Anda Membantu Beasiswa Riset!</strong>
          <span className="text-[#57635A] text-[11px]">
            Tiap 100 kg terdistribusi dialihkan jadi dana riset operasional unit kampus.
          </span>
        </div>
      </div>

      {/* Riwayat Setor Unit */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#176B4D] text-lg">history</span>
            <h3 className="text-sm font-bold text-[#1C1C16]">Riwayat Setor Unit</h3>
          </div>
          <span className="text-[10px] font-bold text-[#57635A] bg-[#F1EEE5] px-2 py-0.5 rounded-full">
            {unitListings.length} Batch Aktif
          </span>
        </div>

        <div className="space-y-2.5">
          {unitListings.map(item => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-[#F7F3EA] border border-gray-100 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#176B4D] shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-xl">
                      {item.kategori === 'kardus' ? 'inventory_2' : 'description'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1C1C16]">
                      {item.jumlah_kg} Kg {item.kategori_label}
                    </h4>
                    <span className="text-[11px] text-[#57635A] block mt-0.5">
                      {item.tong_nama} • {item.tanggal_post}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    item.status === 'sudah_diambil'
                      ? 'bg-[#9CF2B5] text-[#157140]'
                      : 'bg-[#FFDBC8] text-[#8B6045]'
                  }`}
                >
                  {item.status === 'sudah_diambil' ? '✓ Selesai Diambil' : '• Menunggu Mitra'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-gray-200/50 text-[11px]">
                <span className="text-[#57635A] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">local_shipping</span>
                  PT Mandiri Daur Lestari
                </span>
                <span className="font-bold text-[#005138]">
                  +{item.jumlah_kg * 2} Potensi Poin
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
