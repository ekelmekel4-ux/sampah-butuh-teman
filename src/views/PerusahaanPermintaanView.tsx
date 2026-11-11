import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

/** Header satu langkah di dalam card form: nomor + judul + keterangan opsional. */
const StepHeader: React.FC<{ n: number; title: string; hint?: string }> = ({ n, title, hint }) => (
  <div className="flex items-center gap-2">
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#C27D3A]/12 text-[11px] font-extrabold text-[#A0632B]">
      {n}
    </span>
    <span className="text-xs font-bold text-[#1A2E22]">{title}</span>
    {hint && <span className="ml-auto text-[10px] font-semibold text-[#C27D3A]">{hint}</span>}
  </div>
);

export const PerusahaanPermintaanView: React.FC = () => {
  const { createPermintaan, setActiveRoute, currentUser } = useApp();

  // Form kosong untuk akun baru: tidak ada pilihan yang sudah terisi/terpilih sebelumnya
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [kuotaKg, setKuotaKg] = useState<number>(0);
  const [kadarAir, setKadarAir] = useState<number>(12);

  const [qcRequirements, setQcRequirements] = useState<{ [key: string]: boolean }>({
    terikat: false,
    bebasMinyak: false,
    bebasKlip: false
  });

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [waktu, setWaktu] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const danaRiset = kuotaKg * 1500; // estimasi rata-rata (harga aktual tergantung kategori kertas)
  const ecoPoints = kuotaKg * 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (selectedTypes.length === 0) {
      setErrorMsg('Pilih minimal satu jenis kertas yang dibutuhkan.');
      return;
    }
    if (kuotaKg < 50) {
      setErrorMsg('Atur target kuota minimal 50 Kg per siklus.');
      return;
    }
    if (selectedDays.length === 0) {
      setErrorMsg('Pilih minimal satu hari penjemputan.');
      return;
    }
    if (!waktu.trim()) {
      setErrorMsg('Isi jendela waktu operasional (contoh: 13:00 - 16:00 WIB).');
      return;
    }

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
      <div className="bg-[#FFF8EE] rounded-2xl p-4 shadow-sm border border-[#C27D3A]/10 flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#C27D3A] text-white flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            factory
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#A0632B]">
              MITRA INDUSTRI AKTIF
            </span>
            {currentUser?.perusahaan_id && (
              <span className="text-[10px] text-[#52645A] font-semibold">
                ID: {currentUser.perusahaan_id}
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-[#1A2E22] truncate mt-1">
            {currentUser?.nama?.replace(' (Dispatcher)', '').replace(/\(NIB:.*\)/, '').trim() || 'Mitra Industri'}
          </h2>
          <p className="text-xs text-[#52645A] truncate">
            Mitra Pengolah Daur Ulang Kertas Terverifikasi
          </p>
        </div>
      </div>

      {/* Main Demand Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#C27D3A]/10">
          <div className="border-b border-gray-100 pb-2">
            <h3 className="text-sm font-bold text-[#1A2E22]">Buat Permintaan Pasokan Kertas</h3>
            <p className="text-xs text-[#52645A] mt-0.5">
              Tentukan kuota dan spesifikasi bahan baku untuk matching dengan tong unit kampus.
            </p>
          </div>
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

        {/* 1. Jenis Kertas */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#C27D3A]/10 space-y-2">
          <StepHeader n={1} title="Jenis Kertas yang Dibutuhkan" hint="Pilih satu atau lebih" />

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'HVS / Arsip Putih', sub: 'Grade A, Kantor & Kampus', icon: 'description', fg: '#C27D3A', tint: '#FEF3C7' },
              { id: 'Kardus Box Corrugated', sub: 'Tebal, Packaging', icon: 'inventory_2', fg: '#C27D3A', tint: '#FBEADB' },
              { id: 'Koran / Buram', sub: 'Percetakan & Cetak', icon: 'newspaper', fg: '#C85C42', tint: '#FDEBE3' },
              { id: 'Campuran Bersih', sub: 'Sortir Pabrik Kering', icon: 'layers', fg: '#5B7A90', tint: '#E7EFF4' }
            ].map(item => {
              const active = selectedTypes.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleType(item.id)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    active
                      ? 'bg-[#C27D3A] text-white border-[#C27D3A] shadow-xs'
                      : 'bg-[#FFFCF5] text-[#1A2E22] border-[#E7E0CF] hover:border-[#D8CDB2] hover:bg-[#FFF6E8]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: active ? 'rgba(255,255,255,0.16)' : item.tint, color: active ? '#FFFFFF' : item.fg }}
                    >
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </span>
                    {active && <span className="material-symbols-outlined text-sm">check_circle</span>}
                  </div>
                  <div className="text-xs font-bold leading-tight">{item.id}</div>
                  <div className={`text-[10px] mt-0.5 ${active ? 'text-white/80' : 'text-[#52645A]'}`}>
                    {item.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Target Kuota Pasokan Mingguan */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#C27D3A]/10 space-y-2">
          <StepHeader n={2} title="Target Kuota Pasokan Mingguan" hint="Min 50 Kg per siklus" />

          <div className="bg-[#FFF8EE] p-3 rounded-xl flex items-center justify-between">
            <button
              type="button"
              onClick={() => setKuotaKg(prev => (prev <= 50 ? 0 : prev - 25))}
              aria-label="Kurangi kuota"
              className="w-10 h-10 rounded-lg bg-white text-[#C27D3A] flex items-center justify-center font-bold text-lg shadow-xs active:scale-95 transition-all"
            >
              −
            </button>

            <div className="text-center">
              <div className="text-2xl font-extrabold text-[#C27D3A] tabular-nums">
                {kuotaKg} <span className="text-sm font-normal text-[#1A2E22]">Kg</span>
              </div>
              <span className="text-[10px] text-[#52645A]">
                {kuotaKg === 0 ? 'Atur kuota minimal 50 Kg per siklus' : 'Rekomendasi pikap: Armada L300 / Pickup'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setKuotaKg(prev => (prev === 0 ? 50 : prev + 25))}
              aria-label="Tambah kuota"
              className="w-10 h-10 rounded-lg bg-[#C27D3A] hover:bg-[#A0632B] text-white flex items-center justify-center font-bold text-lg shadow-xs active:scale-95 transition-all"
            >
              +
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] text-[#52645A]">Pilihan Cepat:</span>
            {[50, 100, 250, 500].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setKuotaKg(val)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  kuotaKg === val
                    ? 'bg-[#C27D3A] text-white'
                    : 'bg-[#F3EFE2] text-[#1A2E22] hover:bg-[#EAE3CF]'
                }`}
              >
                {val} Kg
              </button>
            ))}
          </div>
        </section>

        {/* 3. Parameter & Kriteria Kualitas */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#C27D3A]/10 space-y-2.5">
          <StepHeader n={3} title="Parameter & Kriteria Kualitas" />

          <div className="p-3 rounded-xl bg-[#FFF8EE] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#52645A]">Toleransi Kadar Air Maksimal</span>
              <strong className="text-[#C27D3A]">{kadarAir}% (Kering Optimal)</strong>
            </div>
            <input
              type="range"
              min={8}
              max={20}
              value={kadarAir}
              onChange={e => setKadarAir(Number(e.target.value))}
              className="w-full accent-[#C27D3A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>8% Sangat Kering</span>
              <span>12% Standar SNI</span>
              <span>20% Maksimal</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-[#52645A] block">
              Syarat Wajib QC Kampus (Checklist):
            </span>

            <label className="flex items-start gap-2.5 p-2 rounded-lg bg-[#FFF8EE] cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={qcRequirements.terikat}
                onChange={() => toggleQc('terikat')}
                className="mt-0.5 accent-[#C27D3A]"
              />
              <span className="text-[#1A2E22]">Kertas sudah terikat rapi per tumpukan</span>
            </label>

            <label className="flex items-start gap-2.5 p-2 rounded-lg bg-[#FFF8EE] cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={qcRequirements.bebasMinyak}
                onChange={() => toggleQc('bebasMinyak')}
                className="mt-0.5 accent-[#C27D3A]"
              />
              <span className="text-[#1A2E22]">Bebas kotoran minyak, cairan, & sisa makanan</span>
            </label>

            <label className="flex items-start gap-2.5 p-2 rounded-lg bg-[#FFF8EE] cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={qcRequirements.bebasKlip}
                onChange={() => toggleQc('bebasKlip')}
                className="mt-0.5 accent-[#C27D3A]"
              />
              <span className="text-[#1A2E22]">Bebas klip kawat tebal & lakban jilid plastik</span>
            </label>
          </div>
        </section>

        {/* 4. Jadwal Armada & Titik Jemput */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#C27D3A]/10 space-y-2">
          <StepHeader n={4} title="Jadwal Armada & Titik Jemput" />

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
                        ? 'bg-[#C27D3A] text-white'
                        : 'bg-[#F3EFE2] text-[#52645A] hover:bg-[#EAE3CF]'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F7F3E8]">
                <span className="text-[10px] text-[#52645A] block">Jendela Waktu Operasional</span>
                <input
                  type="text"
                  value={waktu}
                  onChange={e => setWaktu(e.target.value)}
                  placeholder="Contoh: 13:00 - 16:00 WIB"
                  className="w-full bg-transparent font-bold text-[#1A2E22] outline-none placeholder:font-normal placeholder:text-[#8CA090]"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-[#F7F3E8]">
                <span className="text-[10px] text-[#52645A] block">Titik Kumpul Terpusat</span>
                <span className="font-bold text-[#C27D3A] truncate block">
                  Drop Point Serbaguna (Sayap Barat)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Calculation Preview */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FEF3C7] via-[#FFF6E8] to-[#FBEADB] border border-[#C27D3A]/20 shadow-sm space-y-1.5">
          <div className="text-[10px] font-bold text-[#A0632B] uppercase tracking-wider">
            Estimasi Nilai Dampak Edukasi
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#52645A]">Kontribusi Dana Riset Kampus:</span>
            <strong className="text-[#A0632B] tabular-nums">
              Rp {danaRiset.toLocaleString('id-ID')}
            </strong>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#52645A]">Alokasi Eco-Points Unit:</span>
            <strong className="text-[#C27D3A] tabular-nums">+{ecoPoints} Poin</strong>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-[#C27D3A] hover:bg-[#A0632B] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
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
          <div className="p-3 bg-[#FEF3C7]/30 border border-[#A0632B]/30 rounded-xl text-xs text-[#A0632B] font-semibold text-center animate-in fade-in">
            Permintaan pasokan aktif! Mengalihkan ke sistem matching...
          </div>
        )}
      </form>
    </div>
  );
};
