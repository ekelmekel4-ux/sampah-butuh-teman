import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const PerusahaanPermintaanView: React.FC = () => {
  const { createPermintaan, setActiveRoute } = useApp();

  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    'HVS / Arsip Putih',
    'Kardus Box Corrugated'
  ]);
  const [kuotaKg, setKuotaKg] = useState<number>(100);
  const [kadarAir, setKadarAir] = useState<number>(12);

  const [qcRequirements, setQcRequirements] = useState<{ [key: string]: boolean }>({
    terikat: true,
    bebasMinyak: true,
    bebasKlip: true
  });

  const [selectedDays, setSelectedDays] = useState<string[]>(['Senin', 'Selasa', 'Rabu', 'Kamis']);
  const [waktu, setWaktu] = useState<string>('13:00 - 16:00 WIB');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<boolean>(false);

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleQc = (key: string) => {
    setQcRequirements(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const danaRiset = kuotaKg * 1500;
  const ecoPoints = kuotaKg * 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const activeQcList = [
        qcRequirements.terikat ? 'Kertas sudah terikat rapi per tumpukan' : '',
        qcRequirements.bebasMinyak ? 'Bebas kotoran minyak, cairan, & sisa makanan' : '',
        qcRequirements.bebasKlip ? 'Bebas klip kawat tebal & lakban jilid plastik' : ''
      ].filter(Boolean);

      createPermintaan({
        jenisKertas: selectedTypes,
        jumlahKg: kuotaKg,
        toleransiKadarAir: kadarAir,
        syaratQc: activeQcList,
        hariPickup: selectedDays,
        waktuOperasional: waktu
      });

      setIsSubmitting(false);
      setSuccessToast(true);

      setTimeout(() => {
        setSuccessToast(false);
        setActiveRoute('/perusahaan/matching');
      }, 1200);
    }, 800);
  };

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4">
      {/* Company Context Header Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#8B6045] text-white flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            factory
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFDBC8] text-[#8B6045]">
              MITRA INDUSTRI AKTIF
            </span>
            <span className="text-[10px] text-[#57635A] font-semibold">
              ID: MDL-2024-K09
            </span>
          </div>
          <h2 className="text-base font-bold text-[#1C1C16] truncate mt-1">
            PT Mandiri Daur Lestari
          </h2>
          <p className="text-xs text-[#57635A] truncate">
            Mitra Pengolah Daur Ulang Kertas Terverifikasi
          </p>
        </div>
      </div>

      {/* Main Demand Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 space-y-4">
        <div className="border-b border-gray-100 pb-2">
          <h3 className="text-sm font-bold text-[#1C1C16]">Buat Permintaan Pasokan Kertas</h3>
          <p className="text-xs text-[#57635A] mt-0.5">
            Tentukan kuota dan spesifikasi bahan baku untuk matching dengan tong unit kampus.
          </p>
        </div>

        {/* 1. Jenis Kertas */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1C1C16] block">
            1. Jenis Kertas yang Dibutuhkan (Pilih satu atau lebih)
          </label>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'HVS / Arsip Putih', sub: 'Grade A, Kantor & Kampus', icon: 'description' },
              { id: 'Kardus Box Corrugated', sub: 'Tebal, Packaging', icon: 'inventory_2' },
              { id: 'Koran / Buram', sub: 'Percetakan & Cetak', icon: 'newspaper' },
              { id: 'Campuran Bersih', sub: 'Sortir Pabrik Kering', icon: 'layers' }
            ].map(item => {
              const active = selectedTypes.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleType(item.id)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    active
                      ? 'bg-[#8B6045] text-white border-[#8B6045] shadow-xs'
                      : 'bg-[#F7F3EA] text-[#1C1C16] border-transparent hover:bg-[#ECE8DF]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    {active && <span className="material-symbols-outlined text-sm">check_circle</span>}
                  </div>
                  <div className="text-xs font-bold leading-tight">{item.id}</div>
                  <div className={`text-[10px] mt-0.5 ${active ? 'text-white/80' : 'text-[#57635A]'}`}>
                    {item.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Target Kuota Pasokan Mingguan */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold text-[#1C1C16]">2. Target Kuota Pasokan Mingguan</label>
            <span className="text-[10px] text-[#8B6045] font-semibold">Min 50 Kg per siklus</span>
          </div>

          <div className="bg-[#F7F3EA] p-3 rounded-xl flex items-center justify-between">
            <button
              type="button"
              onClick={() => setKuotaKg(prev => Math.max(50, prev - 25))}
              className="w-10 h-10 rounded-lg bg-white text-[#1C1C16] flex items-center justify-center font-bold text-lg shadow-xs active:scale-95 transition-all"
            >
              −
            </button>

            <div className="text-center">
              <div className="text-2xl font-extrabold text-[#8B6045]">
                {kuotaKg} <span className="text-sm font-normal text-[#1C1C16]">Kg</span>
              </div>
              <span className="text-[10px] text-[#57635A]">
                Rekomendasi pikap: Armada L300 / Pickup
              </span>
            </div>

            <button
              type="button"
              onClick={() => setKuotaKg(prev => prev + 25)}
              className="w-10 h-10 rounded-lg bg-[#8B6045] text-white flex items-center justify-center font-bold text-lg shadow-xs active:scale-95 transition-all"
            >
              +
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] text-[#57635A]">Pilihan Cepat:</span>
            {[50, 100, 250, 500].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setKuotaKg(val)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  kuotaKg === val
                    ? 'bg-[#8B6045] text-white'
                    : 'bg-[#ECE8DF] text-[#1C1C16] hover:bg-[#E6E2D9]'
                }`}
              >
                {val} Kg
              </button>
            ))}
          </div>
        </div>

        {/* 3. Parameter & Kriteria Kualitas */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-[#1C1C16] block">
            3. Parameter & Kriteria Kualitas
          </label>

          <div className="p-3 rounded-xl bg-[#F7F3EA] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#57635A]">Toleransi Kadar Air Maksimal</span>
              <strong className="text-[#8B6045]">{kadarAir}% (Kering Optimal)</strong>
            </div>
            <input
              type="range"
              min={8}
              max={20}
              value={kadarAir}
              onChange={e => setKadarAir(Number(e.target.value))}
              className="w-full accent-[#8B6045] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>8% Sangat Kering</span>
              <span>12% Standar SNI</span>
              <span>20% Maksimal</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-[#57635A] block">
              Syarat Wajib QC Kampus (Checklist):
            </span>

            <label className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F7F3EA] cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={qcRequirements.terikat}
                onChange={() => toggleQc('terikat')}
                className="mt-0.5 accent-[#8B6045]"
              />
              <span className="text-[#1C1C16]">Kertas sudah terikat rapi per tumpukan</span>
            </label>

            <label className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F7F3EA] cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={qcRequirements.bebasMinyak}
                onChange={() => toggleQc('bebasMinyak')}
                className="mt-0.5 accent-[#8B6045]"
              />
              <span className="text-[#1C1C16]">Bebas kotoran minyak, cairan, & sisa makanan</span>
            </label>

            <label className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F7F3EA] cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={qcRequirements.bebasKlip}
                onChange={() => toggleQc('bebasKlip')}
                className="mt-0.5 accent-[#8B6045]"
              />
              <span className="text-[#1C1C16]">Bebas klip kawat tebal & lakban jilid plastik</span>
            </label>
          </div>
        </div>

        {/* 4. Jadwal Armada & Titik Jemput */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1C1C16] block">
            4. Jadwal Armada & Titik Jemput
          </label>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(d => {
                const active = selectedDays.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#176B4D] text-white'
                        : 'bg-[#F7F3EA] text-[#57635A] hover:bg-[#ECE8DF]'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F7F3EA]">
                <span className="text-[10px] text-[#57635A] block">Jendela Waktu Operasional</span>
                <input
                  type="text"
                  value={waktu}
                  onChange={e => setWaktu(e.target.value)}
                  className="w-full bg-transparent font-bold text-[#1C1C16] outline-none"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-[#F7F3EA]">
                <span className="text-[10px] text-[#57635A] block">Titik Kumpul Terpusat</span>
                <span className="font-bold text-[#176B4D] truncate block">
                  Drop Point Serbaguna (Sayap Barat)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Calculation Preview */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-[#A4F3CC]/20 to-[#FFDBC8]/20 border border-[#176B4D]/15 space-y-1.5">
          <div className="text-[10px] font-bold text-[#005138] uppercase tracking-wider">
            Estimasi Nilai Dampak Edukasi
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#57635A]">Kontribusi Dana Riset Kampus:</span>
            <strong className="text-[#005138]">
              Rp {danaRiset.toLocaleString('id-ID')}
            </strong>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#57635A]">Alokasi Eco-Points Unit:</span>
            <strong className="text-[#8B6045]">+{ecoPoints} Poin</strong>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || selectedTypes.length === 0}
          className="w-full py-3.5 px-4 rounded-xl bg-[#8B6045] hover:bg-[#633E25] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined text-lg animate-spin">sync</span>
              <span>Mengaktifkan Sistem Matching...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                published_with_changes
              </span>
              <span>Terbitkan Permintaan & Aktifkan Smart Matching</span>
            </>
          )}
        </button>

        {successToast && (
          <div className="p-3 bg-[#9CF2B5]/30 border border-[#157140]/30 rounded-xl text-xs text-[#157140] font-semibold text-center animate-in fade-in">
            Permintaan pasokan aktif! Mengalihkan ke sistem matching...
          </div>
        )}
      </form>
    </div>
  );
};
