import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { compressImage } from '../lib/image';
import { getTongState, TONG_STATE_META } from '../lib/tong';
import { KategoriKertas, ListingKertas } from '../types';

type KategoriOption = {
  key: KategoriKertas;
  label: string;
  sub: string;
  icon: string;
  price: number;
};

const KATEGORI_OPTIONS: KategoriOption[] = [
  {
    key: 'hvs',
    label: 'HVS & Arsip',
    sub: 'Dokumen kantor, printer A4/F4 putih',
    icon: 'description',
    price: 1500,
  },
  {
    key: 'kardus',
    label: 'Kardus Box',
    sub: 'Kardus kemasan cokelat, dilipat pipih',
    icon: 'inventory_2',
    price: 1300,
  },
  {
    key: 'koran',
    label: 'Koran & Majalah',
    sub: 'Koran bekas, majalah kampus, brosur',
    icon: 'newspaper',
    price: 1100,
  },
  {
    key: 'campur',
    label: 'Campuran Kering',
    sub: 'Arsip campur bersih non-minyak',
    icon: 'auto_stories',
    price: 900,
  },
];

const MAX_KADAR_AIR = 14;
const KUOTA_JEMPUT = 10;

export const UnitSetorKertasView: React.FC = () => {
  const { currentUser, units, tongList, listings, createListing, setActiveRoute, showToast, preselectTongId, setPreselectTongId } =
    useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUnit =
    units.find(u => u.id === currentUser?.unit_id) ||
    units.find(u => u.inisial === 'FTD') ||
    units[0] ||
    {
      id: 'unit-ftd',
      nama_unit: 'Fakultas Teknik & Desain',
      inisial: 'FTD',
      total_kg_tersalurkan: 0,
      eco_points: 0,
    };

  const unitTongs = useMemo(
    () =>
      [...tongList]
        .filter(t => t.unit_id === currentUnit.id)
        .sort((a, b) => a.nomor.localeCompare(b.nomor)),
    [tongList, currentUnit.id]
  );

  const availableTongs = useMemo(
    () =>
      unitTongs.length > 0
        ? unitTongs
        : [
            {
              id: 'tong-ftd-1',
              nama_tong: 'Tong FTD No. 1',
              nomor: 'FTD-01',
              berat_kg: 0,
              kapasitas_max_kg: 120,
              lokasi_spesifik: 'Gedung Serbaguna',
              unit_id: currentUnit.id,
              unit_nama: currentUnit.nama_unit,
              status: 'kosong' as const,
            },
          ],
    [unitTongs, currentUnit.id, currentUnit.nama_unit]
  );

  const firstAvailable =
    availableTongs.find(t => t.kapasitas_max_kg - t.berat_kg >= 10) || availableTongs[0];

  const initialTongId =
    preselectTongId && availableTongs.some(t => t.id === preselectTongId)
      ? preselectTongId
      : firstAvailable?.id || '';

  const [selectedTongId, setSelectedTongId] = useState<string>(initialTongId);
  const [kategori, setKategori] = useState<KategoriKertas>('hvs');
  const [beratKg, setBeratKg] = useState<number>(10);
  const [isTied, setIsTied] = useState<boolean>(true);
  const [isClean, setIsClean] = useState<boolean>(true);
  const [isBebasKlip, setIsBebasKlip] = useState<boolean>(true);
  const [isTimbangan, setIsTimbangan] = useState<boolean>(true);
  const [qcKadarAir, setQcKadarAir] = useState<number>(12);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoError, setPhotoError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<{
    id: string;
    tongNama: string;
    jumlahKg: number;
    kategoriLabel: string;
    ecoPoints: number;
    nilai: number;
    batchKg: number;
    siapJemput: boolean;
  } | null>(null);

  // Terapkan tong yang dipilih dari halaman Status Tong.
  useEffect(() => {
    if (!preselectTongId) return;
    const target = availableTongs.find(t => t.id === preselectTongId);
    if (target) {
      setSelectedTongId(target.id);
      const sisaTong = Math.max(0, target.kapasitas_max_kg - target.berat_kg);
      setBeratKg(prev => Math.min(Math.max(10, prev), Math.max(10, sisaTong)));
      setErrorMsg('');
    }
    setPreselectTongId(null);
  }, [preselectTongId, availableTongs, setPreselectTongId]);

  const activeTong = availableTongs.find(t => t.id === selectedTongId) || availableTongs[0];
  const sisaKapasitas = Math.max(0, activeTong.kapasitas_max_kg - activeTong.berat_kg);
  const currentOption = KATEGORI_OPTIONS.find(k => k.key === kategori) || KATEGORI_OPTIONS[0];
  const estimasiNilai = Math.max(0, beratKg) * currentOption.price;
  const estimasiPoin = Math.max(0, beratKg) * 2;
  const semuaTongPenuh = availableTongs.every(t => t.kapasitas_max_kg - t.berat_kg < 10);
  const qcLolos =
    isTied && isClean && isBebasKlip && isTimbangan && qcKadarAir <= MAX_KADAR_AIR;

  // Batch = tumpukan kertas yang sedang terkumpul di satu tong.
  const openBatch = useMemo(
    () => listings.find(l => l.tong_id === activeTong.id && l.status !== 'sudah_diambil') || null,
    [listings, activeTong.id]
  );
  const batchKg = openBatch?.jumlah_kg || 0;
  const batchSetelahSetoran = batchKg + Math.max(0, beratKg);
  const batchSiapJemput = batchSetelahSetoran >= KUOTA_JEMPUT;

  const presets = [10, 20, 35, 50, 75].filter(val => val <= sisaKapasitas);
  const activeTongState = getTongState(activeTong);
  const activeTongMeta = TONG_STATE_META[activeTongState];

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Pilih file gambar JPG, PNG, atau WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Ukuran foto maksimal 5 MB.');
      return;
    }

    setPhotoError('');
    try {
      const dataUrl = await compressImage(file, 720);
      setPhotoUrl(dataUrl);
    } catch {
      setPhotoError('Foto gagal diproses. Coba gambar lain.');
    }
  };

  const resetForm = () => {
    setKategori('hvs');
    setBeratKg(10);
    setIsTied(true);
    setIsClean(true);
    setIsBebasKlip(true);
    setIsTimbangan(true);
    setQcKadarAir(12);
    setPhotoUrl('');
    setPhotoError('');
    setErrorMsg('');
    setSuccessData(null);
    setShowSuccessModal(false);
    const nextTong = availableTongs.find(t => t.kapasitas_max_kg - t.berat_kg >= 10);
    if (nextTong) setSelectedTongId(nextTong.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeTong) {
      setErrorMsg('Pilih tong tujuan terlebih dahulu.');
      return;
    }
    if (beratKg < 10) {
      setErrorMsg('Berat setoran minimal 10 Kg agar memenuhi kuota logistik.');
      return;
    }
    if (beratKg > sisaKapasitas) {
      setErrorMsg(`Berat melebihi sisa kapasitas ${activeTong.nama_tong} (${sisaKapasitas} Kg).`);
      return;
    }
    if (!qcLolos && !photoUrl) {
      setErrorMsg('QC belum lolos. Lampirkan foto kondisi kertas sebagai bukti untuk mitra.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 650));
      const kondisi = [
        isTied ? 'Terikat rapi' : 'Belum terikat rapi',
        isClean ? 'Kering & bebas minyak' : 'Perlu sortir ulang',
        isBebasKlip ? 'Bebas klip & lakban' : 'Klip terlarut',
        isTimbangan ? 'Berat sesuai timbangan' : 'Berat perlu ditimbang ulang',
        `Kadar air ${qcKadarAir}%`,
        qcLolos ? 'QC unit: Lolos' : 'QC unit: Perlu sortir',
      ];
      const listing: ListingKertas | undefined = await createListing({
        unitId: currentUnit.id,
        tongId: activeTong.id,
        jumlahKg: beratKg,
        kategori: currentOption.key,
        kategoriLabel: currentOption.label,
        kondisi,
        foto: photoUrl,
      });

      setSuccessData({
        id: listing?.id || `LST-${Date.now().toString().slice(-4)}`,
        tongNama: activeTong.nama_tong,
        jumlahKg: beratKg,
        kategoriLabel: currentOption.label,
        ecoPoints: estimasiPoin,
        nilai: estimasiNilai,
        batchKg: batchSetelahSetoran,
        siapJemput: batchSiapJemput,
      });
      setShowSuccessModal(true);
    } catch {
      setErrorMsg('Setoran gagal disimpan. Periksa koneksi lalu coba lagi.');
      showToast('Setoran gagal disimpan.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pb-24 font-sans text-[#1A2E22]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-1 py-1">
        <div className="flex min-w-0 items-start gap-3">
          <button
            onClick={() => setActiveRoute('/unit/status')}
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2D6A4F]/15 bg-white text-[#2D6A4F] shadow-xs transition-colors hover:bg-[#D8F3DC] focus-visible:outline-2 focus-visible:outline-[#2D6A4F] focus-visible:outline-offset-2"
            aria-label="Kembali ke daftar tong"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[#8CA090]">Penyalur · {currentUnit.inisial}</p>
            <h1 className="mt-0.5 text-[24px] font-extrabold leading-tight tracking-tight text-[#1A2E22]">
              Setor kertas
            </h1>
          </div>
        </div>
        <span className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-full bg-[#D8F3DC] px-2.5 py-1 text-[10px] font-extrabold text-[#174630]">
          <span className="material-symbols-outlined text-[13px]">recycling</span>
          Sirkular
        </span>
      </div>

      {/* Intro banner */}
      <section className="relative overflow-hidden rounded-[24px] border border-[#52B788]/30 bg-gradient-to-br from-[#52B788] via-[#2D6A4F] to-[#174630] p-5 text-white shadow-[0_18px_40px_rgba(23,70,48,0.22)]">
        <div className="pointer-events-none absolute -right-14 -top-16 h-52 w-52 rounded-full bg-[#A7F3D0]/20 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-[#D1FAE5]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A7F3D0]" />
              Setoran baru
            </span>
            <h2 className="mt-2 text-[20px] font-extrabold leading-tight tracking-tight text-white">
              Catat kertas, jaga sirkularitas.
            </h2>
            <p className="mt-1 max-w-[300px] text-[11px] font-medium leading-relaxed text-white/80">
              Satu setoran otomatis menambah kas unit dan Eco-Points. Minimal 10 Kg per wadah.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
            <span className="material-symbols-outlined text-[26px]">post_add</span>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* 1. Tong tujuan — dipilih dari halaman Status tong */}
        <section className="rounded-[22px] border border-[#2D6A4F]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2D6A4F] text-[11px] font-black text-white">
                1
              </span>
              <div>
                <h2 className="text-[13px] font-extrabold text-[#1A2E22]">Tong tujuan</h2>
                <p className="text-[10px] font-medium text-[#8CA090]">Wadah fisik unit {currentUnit.inisial}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveRoute('/unit/status')}
              className="shrink-0 text-[10px] font-extrabold text-[#2D6A4F] hover:underline"
            >
              Ubah tong
            </button>
          </div>

          {semuaTongPenuh ? (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#FEF3C7] px-3 py-2.5 text-[11px] font-semibold leading-relaxed text-[#8A5A12]">
              <span className="material-symbols-outlined mt-0.5 text-[16px]">warning</span>
              <span>
                Semua tong terisi penuh. Kosongkan tong lewat halaman Status tong sebelum menambah setoran.
              </span>
            </div>
          ) : (
            <>
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#2D6A4F]/15 bg-[#F2F7F4] p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2D6A4F] text-white">
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[12px] font-extrabold text-[#1A2E22]">{activeTong.nama_tong}</span>
                  <span
                    className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-extrabold ${activeTongMeta.className}`}
                  >
                    {activeTongMeta.label}
                  </span>
                </div>
                <div className="mt-0.5 truncate text-[10px] font-medium text-[#6B7C70]">
                  {activeTong.nomor} · Sisa {sisaKapasitas} Kg dari {activeTong.kapasitas_max_kg} Kg
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-[#2D6A4F]/10 bg-white px-3 py-2 text-[10px]">
              <span className="font-semibold text-[#52645A]">
                {openBatch ? 'Batch terkumpul' : 'Batch baru'}
              </span>
              <span className="font-extrabold tabular-nums text-[#1A2E22]">
                {batchKg} Kg {batchKg > 0 ? `/ kuota ${KUOTA_JEMPUT} Kg` : ''}
              </span>
            </div>
            <p className="mt-1.5 text-[10px] font-medium leading-relaxed text-[#6B7C70]">
              {openBatch
                ? 'Setoran ini digabung ke batch yang sedang terkumpul di tong ini, jadi tidak perlu daftar baru.'
                : `Setoran pertama pada tong ini. Batch masuk antrean mitra setelah terkumpul ${KUOTA_JEMPUT} Kg.`}
            </p>
            </>
          )}
        </section>

        {/* 2. Kategori */}
        <section className="rounded-[22px] border border-[#2D6A4F]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2D6A4F] text-[11px] font-black text-white">
              2
            </span>
            <div>
              <h2 className="text-[13px] font-extrabold text-[#1A2E22]">Kategori kertas</h2>
              <p className="text-[10px] font-medium text-[#8CA090]">Harga per kilogram menentukan nilai kas</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {KATEGORI_OPTIONS.map(option => {
              const isSelected = option.key === kategori;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => {
                    setKategori(option.key);
                    setErrorMsg('');
                  }}
                  aria-pressed={isSelected}
                  className={`flex items-start gap-2.5 rounded-2xl border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-[#2D6A4F] bg-[#F2F7F4] ring-2 ring-[#2D6A4F]/15'
                      : 'border-[#2D6A4F]/10 bg-white hover:border-[#2D6A4F]/25 hover:bg-[#F7FAF8]'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      isSelected ? 'bg-[#2D6A4F] text-white' : 'bg-[#F2F7F4] text-[#2D6A4F]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{option.icon}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-extrabold text-[#1A2E22]">{option.label}</span>
                    <span className="mt-0.5 block text-[9px] font-medium leading-tight text-[#6B7C70]">{option.sub}</span>
                    <span className="mt-1 block text-[10px] font-extrabold tabular-nums text-[#2D6A4F]">
                      Rp {option.price.toLocaleString('id-ID')}/Kg
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Berat */}
        <section className="rounded-[22px] border border-[#2D6A4F]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2D6A4F] text-[11px] font-black text-white">
                3
              </span>
              <div>
                <h2 className="text-[13px] font-extrabold text-[#1A2E22]">Berat kertas</h2>
                <p className="text-[10px] font-medium text-[#8CA090]">Minimal 10 Kg per setoran</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-[#F2F7F4] px-2 py-1 text-[10px] font-bold tabular-nums text-[#52645A]">
              Sisa {sisaKapasitas} Kg
            </span>
          </div>

          <div className="mt-3 flex items-center justify-center gap-3 rounded-2xl border border-[#2D6A4F]/8 bg-[#F7FAF8] p-3">
            <button
              type="button"
              onClick={() => setBeratKg(prev => Math.max(10, prev - 5))}
              disabled={beratKg <= 10}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-black text-[#1A2E22] shadow-xs transition-transform active:scale-95 disabled:opacity-40"
              aria-label="Kurangi 5 kilogram"
            >
              −
            </button>
            <div className="flex min-w-[100px] items-baseline justify-center gap-1">
              <input
                type="number"
                min="10"
                max={Math.max(10, sisaKapasitas)}
                value={beratKg}
                onChange={e => {
                  setBeratKg(Math.max(0, Number(e.target.value)));
                  setErrorMsg('');
                }}
                className="w-20 bg-transparent text-center text-3xl font-black tabular-nums text-[#2D6A4F] outline-none"
                aria-label="Berat kertas dalam kilogram"
              />
              <span className="text-sm font-extrabold text-[#1A2E22]">Kg</span>
            </div>
            <button
              type="button"
              onClick={() => setBeratKg(prev => Math.min(Math.max(10, sisaKapasitas), prev + 5))}
              disabled={beratKg >= sisaKapasitas || sisaKapasitas < 10}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-black text-[#1A2E22] shadow-xs transition-transform active:scale-95 disabled:opacity-40"
              aria-label="Tambah 5 kilogram"
            >
              +
            </button>
          </div>

          {presets.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
              {presets.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setBeratKg(val);
                    setErrorMsg('');
                  }}
                  className={`min-h-[32px] rounded-full px-3 text-[10px] font-extrabold transition-all ${
                    beratKg === val
                      ? 'bg-[#2D6A4F] text-white shadow-xs'
                      : 'bg-[#F2F7F4] text-[#52645A] hover:bg-[#DDE7E0]'
                  }`}
                >
                  {val} Kg
                </button>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-[#2D6A4F]/15 bg-[#D8F3DC]/45 p-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2D6A4F] text-white">
                <span className="material-symbols-outlined text-lg">payments</span>
              </span>
              <div>
                <p className="text-[10px] font-bold text-[#52645A]">Estimasi kas unit</p>
                <p className="text-[10px] font-medium tabular-nums text-[#1A2E22]">
                  {Math.max(0, beratKg)} Kg × Rp {currentOption.price.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-base font-black tabular-nums text-[#2D6A4F]">
                Rp {estimasiNilai.toLocaleString('id-ID')}
              </p>
              <p className="text-[9px] font-extrabold text-[#52645A]">+{estimasiPoin} Eco-Points</p>
            </div>
          </div>
        </section>

        {/* 4. QC unit */}
        <section className="rounded-[22px] border border-[#2D6A4F]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2D6A4F] text-[11px] font-black text-white">
                4
              </span>
              <div>
                <h2 className="text-[13px] font-extrabold text-[#1A2E22]">Pemeriksaan QC</h2>
                <p className="text-[10px] font-medium text-[#8CA090]">Diperiksa sendiri oleh unit kampus</p>
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                qcLolos ? 'bg-[#D8F3DC] text-[#174630]' : 'bg-[#FEF3C7] text-[#8A5A12]'
              }`}
            >
              {qcLolos ? 'Lolos QC' : 'Perlu sortir'}
            </span>
          </div>

          {/* Kadar air */}
          <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-[#2D6A4F]/10 bg-[#F7FAF8] p-3">
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold text-[#1A2E22]">Kadar air</p>
              <p className="mt-0.5 text-[10px] font-medium leading-relaxed text-[#8CA090]">
                Batas {MAX_KADAR_AIR}% agar diterima pabrik
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setQcKadarAir(prev => Math.max(0, prev - 1))}
                disabled={qcKadarAir <= 0}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-black text-[#1A2E22] shadow-xs transition-transform active:scale-95 disabled:opacity-40"
                aria-label="Kurangi kadar air 1 persen"
              >
                −
              </button>
              <div className="flex min-w-[64px] items-baseline justify-center gap-0.5">
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={qcKadarAir}
                  onChange={e => setQcKadarAir(Math.max(0, Math.min(30, Number(e.target.value))))}
                  className="w-12 bg-transparent text-center text-lg font-black tabular-nums text-[#2D6A4F] outline-none"
                  aria-label="Kadar air dalam persen"
                />
                <span className="text-[11px] font-extrabold text-[#1A2E22]">%</span>
              </div>
              <button
                type="button"
                onClick={() => setQcKadarAir(prev => Math.min(30, prev + 1))}
                disabled={qcKadarAir >= 30}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-black text-[#1A2E22] shadow-xs transition-transform active:scale-95 disabled:opacity-40"
                aria-label="Tambah kadar air 1 persen"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {[
              {
                checked: isTied,
                onChange: () => setIsTied(v => !v),
                icon: 'link',
                title: 'Terikat rapi',
                desc: 'Tumpukan diikat tali atau dilipat pipih agar mudah diangkut.',
              },
              {
                checked: isClean,
                onChange: () => setIsClean(v => !v),
                icon: 'water_drop',
                title: 'Kering & bebas minyak',
                desc: 'Tidak basah, tidak berminyak, dan bebas sisa makanan.',
              },
              {
                checked: isBebasKlip,
                onChange: () => setIsBebasKlip(v => !v),
                icon: 'content_cut',
                title: 'Bebas klip & lakban',
                desc: 'Klip kawat tebal dan lakban jilid plastik sudah dibuang.',
              },
              {
                checked: isTimbangan,
                onChange: () => setIsTimbangan(v => !v),
                icon: 'scale',
                title: 'Berat sesuai timbangan',
                desc: 'Berat pada timbangan tong sudah dicatat dan sesuai/SP.',
              },
            ].map(item => (
              <button
                key={item.title}
                type="button"
                role="checkbox"
                aria-checked={item.checked}
                onClick={item.onChange}
                className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-colors ${
                  item.checked
                    ? 'border-[#2D6A4F]/20 bg-[#F2F7F4]'
                    : 'border-[#F4A261]/35 bg-[#FEF9EE]'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                    item.checked ? 'border-[#2D6A4F] bg-[#2D6A4F] text-white' : 'border-[#C9B98E] bg-white'
                  }`}
                  aria-hidden="true"
                >
                  {item.checked && <span className="material-symbols-outlined text-[14px]">check</span>}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#1A2E22]">
                    <span className="material-symbols-outlined text-[15px] text-[#2D6A4F]">{item.icon}</span>
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-medium leading-relaxed text-[#6B7C70]">
                    {item.desc}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {!qcLolos && (
            <p className="mt-2 flex items-start gap-1.5 text-[10px] font-semibold leading-relaxed text-[#8A5A12]">
              <span className="material-symbols-outlined mt-0.5 text-[14px]">warning</span>
              Setoran akan ditandai perlu sortir ulang oleh mitra karena belum lolos seluruh kriteria QC.
            </p>
          )}
        </section>

        {/* 5. Foto */}
        <section className="rounded-[22px] border border-[#2D6A4F]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2D6A4F] text-[11px] font-black text-white">
                5
              </span>
              <div>
                <h2 className="text-[13px] font-extrabold text-[#1A2E22]">Foto setoran</h2>
                <p className="text-[10px] font-medium text-[#8CA090]">
                  Cukup 1 foto per batch · wajib bila QC perlu sortir
                </p>
              </div>
            </div>
            {photoUrl && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 text-[10px] font-extrabold text-[#2D6A4F] hover:underline"
              >
                Ganti foto
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="sr-only"
            aria-label="Pilih foto setoran"
          />

          {photoUrl ? (
            <div className="relative mt-3 overflow-hidden rounded-2xl border border-[#2D6A4F]/10">
              <img src={photoUrl} alt="Pratinjau foto setoran kertas" className="h-40 w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/65 to-transparent px-3 pb-2.5 pt-6">
                <span className="text-[10px] font-bold text-white">Foto siap dilampirkan</span>
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="flex min-h-[30px] items-center gap-1 rounded-full bg-white/20 px-2.5 text-[10px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                  Hapus
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-[#2D6A4F]/25 bg-[#F7FAF8] px-4 py-6 text-center transition-colors hover:border-[#2D6A4F]/45 hover:bg-[#F2F7F4]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2D6A4F] shadow-xs">
                <span className="material-symbols-outlined text-[21px]">add_a_photo</span>
              </span>
              <span className="text-[11px] font-extrabold text-[#1A2E22]">Tambahkan foto setoran</span>
              <span className="text-[10px] font-medium text-[#8CA090]">JPG, PNG, atau WebP · maks. 5 MB</span>
            </button>
          )}

          {photoError && (
            <p className="mt-2 text-[10px] font-semibold text-[#C0392B]" role="alert">
              {photoError}
            </p>
          )}
        </section>

        {/* Ringkasan */}
        <section className="rounded-[22px] border border-[#2D6A4F]/15 bg-[#F2F7F4] p-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[19px] text-[#2D6A4F]">fact_check</span>
            <h2 className="text-[13px] font-extrabold text-[#1A2E22]">Ringkasan setoran</h2>
          </div>
          <dl className="mt-3 space-y-2">
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <dt className="font-medium text-[#52645A]">Tong tujuan</dt>
              <dd className="max-w-[60%] truncate text-right font-extrabold text-[#1A2E22]">{activeTong.nama_tong}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <dt className="font-medium text-[#52645A]">Kategori</dt>
              <dd className="text-right font-extrabold text-[#1A2E22]">{currentOption.label}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <dt className="font-medium text-[#52645A]">Berat</dt>
              <dd className="text-right font-extrabold tabular-nums text-[#1A2E22]">{Math.max(0, beratKg)} Kg</dd>
            </div>
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <dt className="font-medium text-[#52645A]">QC unit</dt>
              <dd className={`text-right font-extrabold ${qcLolos ? 'text-[#2D6A4F]' : 'text-[#8A5A12]'}`}>
                {qcLolos ? 'Lolos QC' : 'Perlu sortir'}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <dt className="font-medium text-[#52645A]">Kadar air</dt>
              <dd className={`text-right font-extrabold tabular-nums ${qcKadarAir <= MAX_KADAR_AIR ? 'text-[#1A2E22]' : 'text-[#8A5A12]'}`}>
                {qcKadarAir}% {qcKadarAir > MAX_KADAR_AIR && '(di atas batas)'}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[#2D6A4F]/10 pt-2 text-[12px]">
              <dt className="font-bold text-[#1A2E22]">Estimasi kas unit</dt>
              <dd className="text-right font-black tabular-nums text-[#2D6A4F]">
                Rp {estimasiNilai.toLocaleString('id-ID')}
              </dd>
            </div>
          </dl>
        </section>

        {errorMsg && (
          <div className="flex items-start gap-2 rounded-2xl border border-[#E76F51]/30 bg-[#FEECEC] p-3 text-[11px] font-bold leading-relaxed text-[#C0392B]" role="alert">
            <span className="material-symbols-outlined mt-0.5 text-[17px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || semuaTongPenuh || sisaKapasitas < 10}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#2D6A4F] px-4 text-[13px] font-extrabold text-white shadow-md transition-all hover:bg-[#1A4235] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[19px]">progress_activity</span>
              Menyimpan setoran...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[19px]">check_circle</span>
              Simpan & setor ke tong
            </>
          )}
        </button>
        <p className="px-2 text-center text-[10px] font-medium leading-relaxed text-[#8CA090]">
          Dengan menyimpan, setoran dicatat atas nama {currentUnit.nama_unit}.
        </p>
      </form>

      {/* Success modal */}
      {showSuccessModal && successData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F241A]/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="setoran-sukses-title"
        >
          <div className="w-full max-w-sm animate-in zoom-in-95 rounded-[24px] border border-[#2D6A4F]/15 bg-white p-5 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D8F3DC] text-[#2D6A4F]">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <span className="mt-3 inline-block rounded-full bg-[#F2F7F4] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F]">
              Setoran tercatat
            </span>
            <h3 id="setoran-sukses-title" className="mt-2 text-xl font-black tracking-tight text-[#1A2E22]">
              {successData.jumlahKg} Kg {successData.kategoriLabel}
            </h3>
            <p className="mt-1 text-[11px] font-medium leading-relaxed text-[#52645A]">
              Tercatat di {successData.tongNama}. Estimasi kas{' '}
              <strong className="font-extrabold text-[#2D6A4F]">Rp {successData.nilai.toLocaleString('id-ID')}</strong>{' '}
              dan <strong className="font-extrabold text-[#2D6A4F]">+{successData.ecoPoints} Eco-Points</strong> untuk unit.
            </p>
            <div className="mt-3 rounded-xl bg-[#F7FAF8] px-3 py-2.5 text-[10px] font-medium leading-relaxed text-[#6B7C70]">
              <p className="font-extrabold text-[#1A2E22]">
                {successData.siapJemput
                  ? `Batch ${successData.batchKg} Kg — siap dijemput mitra`
                  : `Batch terkumpul ${successData.batchKg} Kg — kurang ${Math.max(0, KUOTA_JEMPUT - successData.batchKg)} Kg lagi`}
              </p>
              <p className="mt-0.5">
                {successData.siapJemput
                  ? 'Batch otomatis masuk antrean penjemputan mitra.'
                  : 'Setoran berikutnya digabung ke batch yang sama, jadi tidak perlu daftar baru.'}
              </p>
            </div>
            <div className="mt-2 rounded-xl bg-[#F7FAF8] px-3 py-2 text-[10px] font-medium text-[#6B7C70]">
              ID setoran: <span className="font-mono font-semibold text-[#1A2E22]">{successData.id}</span>
            </div>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => setActiveRoute('/unit/beranda')}
                className="min-h-[48px] w-full rounded-full bg-[#2D6A4F] text-[13px] font-extrabold text-white shadow-md transition-colors hover:bg-[#1A4235]"
              >
                Kembali ke beranda
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="min-h-[44px] w-full rounded-full border border-[#2D6A4F]/20 bg-white text-[12px] font-extrabold text-[#2D6A4F] transition-colors hover:bg-[#F2F7F4]"
              >
                Catat setoran lain
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
