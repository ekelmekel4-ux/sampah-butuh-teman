import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';
import { compressImage } from '../lib/image';
import { UnitKampus } from '../types';

const JENIS_LABEL: Record<UnitKampus['jenis'], string> = {
  fakultas: 'Fakultas',
  biro: 'Biro / Lembaga',
  prodi: 'Prodi / BEM',
  lembaga: 'Lembaga',
};

/** Ringkasan data profil untuk deteksi perubahan (dirty state). */
type ProfilSnapshot = {
  namaUnit: string;
  inisial: string;
  jenis: string;
  lokasi: string;
  picNama: string;
  kontak: string;
  email: string;
  avatar: string;
};

const buildSnapshot = (values: ProfilSnapshot) => JSON.stringify(values);

export const UnitProfilView: React.FC = () => {
  const { currentUser, units, setActiveRoute, updateUnitProfile, showToast, logout } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUnit =
    units.find(u => u.id === currentUser?.unit_id) ||
    units.find(u => u.inisial === 'FTD') ||
    units[0] ||
    ({
      id: 'unit-ftd',
      nama_unit: 'Fakultas Teknik & Desain (FTD)',
      inisial: 'FTD',
      jenis: 'fakultas',
      lokasi_detail: '',
      pic_nama: '',
      kontak_pic: '',
      tong_id: '',
      tong_nama: '',
      total_kg_tersalurkan: 0,
      eco_points: 0,
    } as UnitKampus);

  const [namaUnit, setNamaUnit] = useState(currentUnit.nama_unit);
  const [inisial, setInisial] = useState(currentUnit.inisial);
  const [jenis, setJenis] = useState<UnitKampus['jenis']>(currentUnit.jenis || 'fakultas');
  const [lokasi, setLokasi] = useState(currentUnit.lokasi_detail || '');
  const [picNama, setPicNama] = useState(currentUnit.pic_nama || currentUser?.nama || '');
  const [kontak, setKontak] = useState(currentUnit.kontak_pic || currentUser?.kontak || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [avatarPreview, setAvatarPreview] = useState<string>(() =>
    currentUser?.avatar_url && currentUser.avatar_url !== APP_BRAND.avatarUrl ? currentUser.avatar_url : ''
  );
  const [photoError, setPhotoError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedStamp, setSavedStamp] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Snapshot data tersimpan — dasar tombol Simpan (hanya aktif bila ada perubahan).
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    buildSnapshot({
      namaUnit: currentUnit.nama_unit,
      inisial: currentUnit.inisial,
      jenis: currentUnit.jenis || 'fakultas',
      lokasi: currentUnit.lokasi_detail || '',
      picNama: currentUnit.pic_nama || currentUser?.nama || '',
      kontak: currentUnit.kontak_pic || currentUser?.kontak || '',
      email: currentUser?.email || '',
      avatar:
        currentUser?.avatar_url && currentUser.avatar_url !== APP_BRAND.avatarUrl
          ? currentUser.avatar_url
          : '',
    })
  );

  const currentSnapshot = buildSnapshot({
    namaUnit: namaUnit.trim(),
    inisial: inisial.trim().toUpperCase(),
    jenis,
    lokasi: lokasi.trim(),
    picNama: picNama.trim(),
    kontak: kontak.trim(),
    email: email.trim().toLowerCase(),
    avatar: avatarPreview,
  });

  const isDirty = currentSnapshot !== savedSnapshot;

  const sortedUnits = [...units].sort((a, b) => b.total_kg_tersalurkan - a.total_kg_tersalurkan);
  const rank = Math.max(1, sortedUnits.findIndex(u => u.id === currentUnit.id) + 1);
  const initial = (namaUnit.trim() || inisial || 'U').charAt(0).toUpperCase();

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
      const dataUrl = await compressImage(file);
      setAvatarPreview(dataUrl);
    } catch {
      setPhotoError('Foto gagal diproses. Coba gambar lain.');
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!namaUnit.trim()) next.namaUnit = 'Nama unit wajib diisi.';
    if (!/^[A-Za-z0-9]{2,8}$/.test(inisial.trim())) {
      next.inisial = 'Gunakan 2–8 huruf/angka, tanpa spasi.';
    }
    if (!lokasi.trim()) next.lokasi = 'Lokasi unit wajib diisi.';
    if (!picNama.trim()) next.picNama = 'Nama PIC wajib diisi.';
    if (!kontak.trim()) next.kontak = 'Nomor kontak PIC wajib diisi.';
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      next.email = 'Masukkan alamat email yang valid.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      showToast('Periksa kembali data profil unit.', 'error');
      return;
    }

    setIsSaving(true);
    const result = await updateUnitProfile(
      {
        nama_unit: namaUnit.trim(),
        inisial: inisial.trim().toUpperCase(),
        jenis,
        lokasi_detail: lokasi.trim(),
        pic_nama: picNama.trim(),
        kontak_pic: kontak.trim(),
      },
      {
        nama: picNama.trim(),
        email: email.trim().toLowerCase(),
        kontak: kontak.trim(),
        avatar_url: avatarPreview || APP_BRAND.avatarUrl,
      }
    );
    setIsSaving(false);

    if (!result.success) {
      showToast(result.message || 'Profil unit gagal disimpan.', 'error');
      return;
    }

    setSavedStamp('Tersimpan');
    setSavedSnapshot(currentSnapshot);
    setTimeout(() => setSavedStamp(''), 2500);
    showToast('Profil unit berhasil diperbarui.', 'success');
  };

  const handleReset = () => {
    setNamaUnit(currentUnit.nama_unit);
    setInisial(currentUnit.inisial);
    setJenis(currentUnit.jenis || 'fakultas');
    setLokasi(currentUnit.lokasi_detail || '');
    setPicNama(currentUnit.pic_nama || currentUser?.nama || '');
    setKontak(currentUnit.kontak_pic || currentUser?.kontak || '');
    setEmail(currentUser?.email || '');
    setAvatarPreview(
      currentUser?.avatar_url && currentUser.avatar_url !== APP_BRAND.avatarUrl ? currentUser.avatar_url : ''
    );
    setErrors({});
    setPhotoError('');
  };

  const inputClass = (field: string) =>
    `w-full min-h-[48px] rounded-2xl border bg-[#F7F9F7] px-4 text-sm font-semibold text-[#1A2E22] outline-none transition-all placeholder:font-medium placeholder:text-[#9AA99E] focus:bg-white focus:ring-2 ${
      errors[field]
        ? 'border-[#E76F51] focus:border-[#E76F51] focus:ring-[#E76F51]/15'
        : 'border-[#2D6A4F]/15 focus:border-[#2D6A4F] focus:ring-[#2D6A4F]/15'
    }`;

  return (
    <div className="w-full pb-28 max-w-xl mx-auto space-y-4 font-sans text-[#1A2E22]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-1 py-1">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setActiveRoute('/unit/beranda')}
            className="w-10 h-10 rounded-full bg-white border border-[#2D6A4F]/15 flex items-center justify-center text-[#1A2E22] hover:bg-[#D8F3DC] transition-colors focus-visible:outline-2 focus-visible:outline-[#2D6A4F] focus-visible:outline-offset-2"
            aria-label="Kembali ke beranda unit"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[#6B7C70]">Pengaturan akun</p>
            <h1 className="text-xl font-extrabold tracking-tight text-[#1A2E22] truncate">Profil unit</h1>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#D8F3DC] px-2.5 py-1 text-[10px] font-extrabold text-[#174630] shrink-0">
          <span className="material-symbols-outlined text-[13px]">school</span>
          Unit kampus
        </span>
      </div>

      {/* Identity preview */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2D6A4F] via-[#2D6A4F] to-[#174630] p-5 text-white shadow-[0_18px_40px_rgba(23,70,48,0.22)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#A7F3D0]/15 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-white/8 blur-2xl" aria-hidden="true" />

        <div className="relative z-10 flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[24px] bg-[#D8F3DC] text-2xl font-black text-[#174630] ring-4 ring-white/15">
              {avatarPreview ? (
                <img src={avatarPreview} alt={`Foto profil ${namaUnit}`} className="h-full w-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#174630] bg-white text-[#174630] shadow-md transition-colors hover:bg-[#D8F3DC] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              aria-label="Ganti foto profil unit"
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="sr-only"
              aria-label="Pilih foto profil unit"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A7F3D0]">Profil publik unit</p>
            <h2 className="mt-1 text-[20px] font-extrabold leading-tight text-white">{namaUnit.trim() || currentUnit.nama_unit}</h2>
            <p className="mt-1 flex items-center gap-1 text-[12px] font-medium text-white/80">
              <span className="material-symbols-outlined text-[15px]">location_on</span>
              <span className="truncate">{lokasi.trim() || 'Lokasi unit belum diisi'}</span>
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-white">
                {inisial.trim().toUpperCase() || 'UNIT'}
              </span>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-white">
                {JENIS_LABEL[jenis]}
              </span>
              <button
                type="button"
                onClick={() => setActiveRoute('/leaderboard')}
                className="inline-flex items-center gap-1 rounded-full bg-[#FDE68A] px-2.5 py-1 text-[10px] font-extrabold text-[#5C3A0A] transition-colors hover:bg-[#FCD34D]"
              >
                <span className="material-symbols-outlined text-[12px]">trophy</span>
                Peringkat #{rank}
              </button>
            </div>
            {photoError && <p className="mt-1.5 text-[10px] font-semibold text-[#FFDBC8]">{photoError}</p>}
            <p className="mt-1.5 text-[10px] font-medium text-white/70">
              Ketuk ikon kamera pada foto untuk {avatarPreview ? 'mengganti' : 'mengunggah'} foto profil.
            </p>
            {avatarPreview && (
              <button
                type="button"
                onClick={() => setAvatarPreview('')}
                className="mt-0.5 text-[10px] font-bold text-white/85 underline decoration-white/40 underline-offset-2 hover:text-white"
              >
                Hapus foto profil
              </button>
            )}
          </div>
        </div>

        <div className="relative z-10 mt-4 grid grid-cols-3 gap-2 border-t border-white/15 pt-3">
          <div>
            <p className="text-[10px] font-medium text-white/65">Kertas tersalurkan</p>
            <p className="mt-0.5 text-sm font-extrabold tabular-nums text-white">{currentUnit.total_kg_tersalurkan.toLocaleString('id-ID')} Kg</p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-white/65">Eco-Points</p>
            <p className="mt-0.5 text-sm font-extrabold tabular-nums text-white">{currentUnit.eco_points.toLocaleString('id-ID')}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-white/65">PIC aktif</p>
            <p className="mt-0.5 truncate text-sm font-extrabold text-white">{picNama.trim() || 'Belum diisi'}</p>
          </div>
        </div>
      </section>

      {/* Identitas unit */}
      <section className="rounded-[24px] border border-[#2D6A4F]/10 bg-white p-4 shadow-xs space-y-4">
        <div className="flex items-start gap-2.5">
          <span className="material-symbols-outlined mt-0.5 text-[20px] text-[#2D6A4F]">account_balance</span>
          <div>
            <h2 className="text-sm font-extrabold text-[#1A2E22]">Identitas unit</h2>
            <p className="mt-0.5 text-[11px] font-medium text-[#6B7C70]">Nama ini tampil di beranda, tong, dan leaderboard kampus.</p>
          </div>
        </div>

        <div>
          <label htmlFor="unit-nama" className="mb-1.5 block text-[12px] font-bold text-[#1A2E22]">
            Nama resmi unit <span className="text-[#E76F51]">*</span>
          </label>
          <input
            id="unit-nama"
            type="text"
            value={namaUnit}
            onChange={e => setNamaUnit(e.target.value)}
            placeholder="Fakultas Teknik & Desain"
            className={inputClass('namaUnit')}
            aria-invalid={!!errors.namaUnit}
            aria-describedby={errors.namaUnit ? 'unit-nama-error' : undefined}
          />
          {errors.namaUnit && <p id="unit-nama-error" className="mt-1 text-[11px] font-semibold text-[#C0392B]">{errors.namaUnit}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="unit-inisial" className="mb-1.5 block text-[12px] font-bold text-[#1A2E22]">
              Inisial unit <span className="text-[#E76F51]">*</span>
            </label>
            <input
              id="unit-inisial"
              type="text"
              maxLength={8}
              value={inisial}
              onChange={e => setInisial(e.target.value.toUpperCase().replace(/\s/g, ''))}
              placeholder="FTD"
              className={`${inputClass('inisial')} uppercase tracking-wide`}
              aria-invalid={!!errors.inisial}
              aria-describedby={errors.inisial ? 'unit-inisial-error' : undefined}
            />
            {errors.inisial ? (
              <p id="unit-inisial-error" className="mt-1 text-[11px] font-semibold text-[#C0392B]">{errors.inisial}</p>
            ) : (
              <p className="mt-1 text-[10px] font-medium text-[#6B7C70]">Dipakai sebagai kode tong, mis. FTD-01.</p>
            )}
          </div>

          <div>
            <label htmlFor="unit-jenis" className="mb-1.5 block text-[12px] font-bold text-[#1A2E22]">
              Jenis unit <span className="text-[#E76F51]">*</span>
            </label>
            <select
              id="unit-jenis"
              value={jenis}
              onChange={e => setJenis(e.target.value as UnitKampus['jenis'])}
              className={`${inputClass('jenis')} appearance-none`}
            >
              {Object.entries(JENIS_LABEL).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="unit-lokasi" className="mb-1.5 block text-[12px] font-bold text-[#1A2E22]">
            Lokasi unit <span className="text-[#E76F51]">*</span>
          </label>
          <textarea
            id="unit-lokasi"
            rows={3}
            value={lokasi}
            onChange={e => setLokasi(e.target.value)}
            placeholder="Gedung B Lt. 2, Ruang 204"
            className={`${inputClass('lokasi')} py-3 leading-relaxed`}
            aria-invalid={!!errors.lokasi}
            aria-describedby={errors.lokasi ? 'unit-lokasi-error' : undefined}
          />
          {errors.lokasi ? (
            <p id="unit-lokasi-error" className="mt-1 text-[11px] font-semibold text-[#C0392B]">{errors.lokasi}</p>
          ) : (
            <p className="mt-1 text-[10px] font-medium text-[#6B7C70]">Lokasi ini membantu mitra dan admin menemukan titik jemput unit.</p>
          )}
        </div>
      </section>

      {/* Penanggung jawab */}
      <section className="rounded-[24px] border border-[#2D6A4F]/10 bg-white p-4 shadow-xs space-y-4">
        <div className="flex items-start gap-2.5">
          <span className="material-symbols-outlined mt-0.5 text-[20px] text-[#2D6A4F]">badge</span>
          <div>
            <h2 className="text-sm font-extrabold text-[#1A2E22]">Penanggung jawab</h2>
            <p className="mt-0.5 text-[11px] font-medium text-[#6B7C70]">Kontak yang dihubungi admin saat tong perlu dijemput.</p>
          </div>
        </div>

        <div>
          <label htmlFor="unit-pic" className="mb-1.5 block text-[12px] font-bold text-[#1A2E22]">
            Nama PIC <span className="text-[#E76F51]">*</span>
          </label>
          <input
            id="unit-pic"
            type="text"
            value={picNama}
            onChange={e => setPicNama(e.target.value)}
            placeholder="Nama lengkap penanggung jawab"
            className={inputClass('picNama')}
            aria-invalid={!!errors.picNama}
            aria-describedby={errors.picNama ? 'unit-pic-error' : undefined}
          />
          {errors.picNama && <p id="unit-pic-error" className="mt-1 text-[11px] font-semibold text-[#C0392B]">{errors.picNama}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="unit-kontak" className="mb-1.5 block text-[12px] font-bold text-[#1A2E22]">
              HP / WhatsApp PIC <span className="text-[#E76F51]">*</span>
            </label>
            <input
              id="unit-kontak"
              type="tel"
              value={kontak}
              onChange={e => setKontak(e.target.value)}
              placeholder="0812-3456-7890"
              className={inputClass('kontak')}
              aria-invalid={!!errors.kontak}
              aria-describedby={errors.kontak ? 'unit-kontak-error' : undefined}
            />
            {errors.kontak && <p id="unit-kontak-error" className="mt-1 text-[11px] font-semibold text-[#C0392B]">{errors.kontak}</p>}
          </div>

          <div>
            <label htmlFor="unit-email" className="mb-1.5 block text-[12px] font-bold text-[#1A2E22]">
              Email unit <span className="text-[#E76F51]">*</span>
            </label>
            <input
              id="unit-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="unit@univ.ac.id"
              className={inputClass('email')}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'unit-email-error' : 'unit-email-hint'}
            />
            {errors.email ? (
              <p id="unit-email-error" className="mt-1 text-[11px] font-semibold text-[#C0392B]">{errors.email}</p>
            ) : (
              <p id="unit-email-hint" className="mt-1 text-[10px] font-medium text-[#6B7C70]">Email ini juga dipakai untuk masuk ke akun unit.</p>
            )}
          </div>
        </div>
      </section>

      {/* Save actions */}
      <div className="space-y-2.5 pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#2D6A4F] px-4 text-sm font-extrabold text-white shadow-md transition-all hover:bg-[#1A4235] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[19px] ${isSaving ? 'animate-spin' : ''}`}>
            {isSaving ? 'progress_activity' : 'save'}
          </span>
          {isSaving ? 'Menyimpan profil...' : 'Simpan perubahan'}
        </button>
        <div className="flex items-center justify-between gap-2 px-1">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving || !isDirty}
            className="text-[12px] font-bold text-[#52645A] transition-colors hover:text-[#1A2E22] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batalkan perubahan
          </button>
          {savedStamp ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2D6A4F]" role="status">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              {savedStamp}
            </span>
          ) : (
            <span className="text-[11px] font-medium text-[#6B7C70]">
              {isDirty ? 'Ada perubahan yang belum disimpan.' : 'Semua perubahan sudah tersimpan.'}
            </span>
          )}
        </div>
      </div>

      {/* Account & logout */}
      <section className="rounded-[24px] border border-[#2D6A4F]/10 bg-white p-4 shadow-xs space-y-3">
        <div className="flex items-start gap-2.5">
          <span className="material-symbols-outlined mt-0.5 text-[20px] text-[#2D6A4F]">shield_person</span>
          <div>
            <h2 className="text-sm font-extrabold text-[#1A2E22]">Akun & akses</h2>
            <p className="mt-0.5 text-[11px] font-medium text-[#6B7C70]">Identitas akun yang dipakai untuk masuk ke aplikasi.</p>
          </div>
        </div>

        <dl className="divide-y divide-[#2D6A4F]/8 rounded-2xl bg-[#F7F9F7] px-3.5">
          <div className="flex items-center justify-between gap-3 py-3">
            <dt className="text-[11px] font-semibold text-[#6B7C70]">Peran</dt>
            <dd className="text-[12px] font-extrabold text-[#1A2E22]">Unit Kampus</dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-3">
            <dt className="text-[11px] font-semibold text-[#6B7C70]">Email login</dt>
            <dd className="max-w-[60%] truncate text-right text-[12px] font-extrabold text-[#1A2E22]">{email || currentUser?.email || '—'}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-3">
            <dt className="text-[11px] font-semibold text-[#6B7C70]">ID unit</dt>
            <dd className="max-w-[60%] truncate text-right font-mono text-[11px] font-semibold text-[#52645A]">{currentUnit.id}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-[#E76F51]/35 bg-white px-4 text-[13px] font-extrabold text-[#C0392B] transition-colors hover:bg-[#FEECEC] focus-visible:outline-2 focus-visible:outline-[#C0392B] focus-visible:outline-offset-2"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Keluar dari akun unit
        </button>
      </section>

      {/* Logout confirmation */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F241A]/60 p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowLogoutConfirm(false); }}
        >
          <div className="w-full max-w-sm rounded-[24px] border border-[#2D6A4F]/15 bg-white p-5 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FEECEC] text-[#C0392B]">
              <span className="material-symbols-outlined text-[22px]">logout</span>
            </div>
            <h3 className="mt-3 text-base font-extrabold text-[#1A2E22]">Keluar dari akun unit?</h3>
            <p className="mt-1 text-[12px] leading-relaxed text-[#52645A]">
              Anda akan kembali ke halaman pemilih peran. Perubahan yang belum disimpan akan hilang.
            </p>
            <div className="mt-4 flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="min-h-[46px] flex-1 rounded-full border border-[#CFC9B8] bg-white text-[12px] font-bold text-[#1A2E22] transition-colors hover:bg-[#FAFAF7]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={logout}
                className="min-h-[46px] flex-1 rounded-full bg-[#C0392B] text-[12px] font-bold text-white transition-colors hover:bg-[#A93226]"
              >
                Ya, keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
