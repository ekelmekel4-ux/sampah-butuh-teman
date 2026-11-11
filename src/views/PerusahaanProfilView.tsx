import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';

/** Ringkasan data profil untuk deteksi perubahan (dirty state). */
type ProfilSnapshot = {
  nama: string;
  email: string;
  alamat: string;
  kota: string;
  kodePos: string;
  avatar: string;
  armada: { id: number; plat: string; driver: string }[];
};

const buildSnapshot = (values: ProfilSnapshot) => JSON.stringify(values);

const compressImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 480;
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas tidak tersedia.'));
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('Foto tidak bisa dibaca.'));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('Foto gagal dimuat.'));
    reader.readAsDataURL(file);
  });

export const PerusahaanProfilView: React.FC = () => {
  const { currentUser, updateProfile, showToast, setActiveRoute } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Nilai awal form (dipakai juga sebagai baseline "data tersimpan").
  const INITIAL = useMemo(
    () => ({
      nama: (currentUser?.nama || 'PT Mandiri Daur Lestari').trim(),
      email: (currentUser?.email || '').trim().toLowerCase(),
      alamat: (
        currentUser?.alamat || 'Jl. Industri Daur Ulang No. 45\nKawasan Industri Surya Cipta'
      ).trim(),
      kota: (currentUser?.kota || 'Karawang').trim(),
      kodePos: (currentUser?.kode_pos || '41361').trim(),
      avatar:
        currentUser?.avatar_url && currentUser.avatar_url !== APP_BRAND.avatarUrl
          ? currentUser.avatar_url
          : '',
      armada: [
        { id: 1, plat: 'B 9821 PQL', driver: 'Pak Joko Susilo' },
        { id: 2, plat: 'D 8122 XZ', driver: 'Kang Maman' },
      ],
    }),
    [currentUser]
  );

  const [namaPerusahaan, setNamaPerusahaan] = useState(INITIAL.nama);
  const [emailPerusahaan, setEmailPerusahaan] = useState(INITIAL.email);
  const [alamat, setAlamat] = useState(INITIAL.alamat);
  const [kota, setKota] = useState(INITIAL.kota);
  const [kodePos, setKodePos] = useState(INITIAL.kodePos);
  const [avatarPreview, setAvatarPreview] = useState<string>(INITIAL.avatar);
  const [photoError, setPhotoError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [armadaList, setArmadaList] = useState(INITIAL.armada);

  // Snapshot data tersimpan — dasar tombol Simpan (hanya aktif bila ada perubahan).
  const [savedSnapshot, setSavedSnapshot] = useState(() => buildSnapshot(INITIAL));

  const currentSnapshot = buildSnapshot({
    nama: namaPerusahaan.trim(),
    email: emailPerusahaan.trim().toLowerCase(),
    alamat: alamat.trim(),
    kota: kota.trim(),
    kodePos: kodePos.trim(),
    avatar: avatarPreview,
    armada: armadaList,
  });

  const isDirty = currentSnapshot !== savedSnapshot;

  const initial = namaPerusahaan.trim() ? namaPerusahaan.trim().charAt(0).toUpperCase() : 'PT';

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Pilih file gambar (JPG, PNG, atau WebP).');
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

  const handleSave = async () => {
    const namaTrim = namaPerusahaan.trim();
    const emailTrim = emailPerusahaan.trim().toLowerCase();
    if (!namaTrim) {
      showToast('Nama perusahaan wajib diisi.', 'error');
      return;
    }
    if (!emailTrim || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailTrim)) {
      showToast('Masukkan alamat email perusahaan yang valid.', 'error');
      return;
    }
    setIsSaving(true);
    const result = await updateProfile({
      nama: namaTrim,
      email: emailTrim,
      avatar_url: avatarPreview || undefined,
      alamat: alamat.trim(),
      kota: kota.trim(),
      kode_pos: kodePos.trim(),
    });
    setIsSaving(false);
    if (!result.success) {
      showToast(result.message || 'Profil mitra gagal disimpan.', 'error');
      return;
    }
    setSavedSnapshot(
      buildSnapshot({
        nama: namaTrim,
        email: emailTrim,
        alamat: alamat.trim(),
        kota: kota.trim(),
        kodePos: kodePos.trim(),
        avatar: avatarPreview,
        armada: armadaList,
      })
    );
    showToast('Profil mitra berhasil disimpan!', 'success');
  };

  const handleAddArmada = () => {
    const plat = prompt('Masukkan Nomor Polisi Armada:');
    if (!plat) return;
    const driver = prompt('Masukkan Nama Driver Utama:');
    if (!driver) return;

    setArmadaList([...armadaList, { id: Date.now(), plat, driver }]);
  };

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4">
      {/* Header halaman (navbar disembunyikan di sub-halaman) */}
      <div className="flex items-center gap-3 px-1 py-1">
        <button
          type="button"
          onClick={() => setActiveRoute('/perusahaan/dashboard')}
          aria-label="Kembali ke beranda mitra"
          className="w-10 h-10 rounded-full bg-white border border-[#C27D3A]/15 flex items-center justify-center text-[#C27D3A] hover:bg-[#FFF8EE] transition-colors focus-visible:outline-2 focus-visible:outline-[#C27D3A] focus-visible:outline-offset-2"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-[#6B7C70]">Pengaturan akun</p>
          <h1 className="text-xl font-extrabold tracking-tight text-[#1A2E22] truncate">Profil mitra</h1>
        </div>
      </div>

      {/* Header Profile */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#F4A261] via-[#C27D3A] to-[#A0632B] p-5 text-white border border-[#F4A261]/30 shadow-[0_18px_40px_rgba(62,39,20,0.22)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FDE68A]/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute right-16 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />

        <div className="relative flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-[#FEF3C7] text-[#A0632B] flex items-center justify-center text-2xl font-bold overflow-hidden ring-4 ring-white/15">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={`Foto profil ${currentUser?.nama || 'mitra'}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                initial
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Unggah foto profil"
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#C27D3A] hover:bg-[#A8652C] text-white border-2 border-[#A0632B] flex items-center justify-center shadow-md transition-colors focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="sr-only"
              aria-label="Pilih foto profil"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-white truncate">{namaPerusahaan.trim() || currentUser?.nama || 'PT Mandiri Daur Lestari'}</h2>
            <p className="text-xs font-semibold text-white/85 truncate">{emailPerusahaan.trim() || currentUser?.email || 'daurulang@nusantara.com'}</p>
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-white/15 text-white text-[10px] font-bold">
              <span className="material-symbols-outlined text-[12px]">verified</span>
              Mitra Industri (Penerima)
            </span>
            {photoError && (
              <p className="mt-1 text-[10px] font-semibold text-[#FFDBC8]">{photoError}</p>
            )}
            <p className="mt-1 text-[10px] font-medium text-white/70">
              Ketuk ikon kamera pada foto untuk {avatarPreview ? 'mengganti' : 'mengunggah'} foto profil.
            </p>
          </div>
        </div>
      </div>

      {/* Data Perusahaan Section */}
      <div className="bg-[#FFF8EE] rounded-2xl p-4 shadow-sm border border-[#C27D3A]/10 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-[#C27D3A]">business</span>
          <h3 className="text-sm font-bold text-[#1A2E22]">Data Perusahaan</h3>
        </div>
        <div>
          <label htmlFor="nama-perusahaan" className="block text-[11px] font-bold text-[#52645A] mb-1">Nama Perusahaan</label>
          <input
            id="nama-perusahaan"
            type="text"
            value={namaPerusahaan}
            onChange={(e) => setNamaPerusahaan(e.target.value)}
            placeholder="PT Mandiri Daur Lestari"
            className="w-full rounded-xl bg-white border border-[#C27D3A]/10 px-3 py-2 text-sm focus:outline-none focus:border-[#C27D3A]/40 focus:ring-2 focus:ring-[#C27D3A]/10"
          />
          <p className="mt-1 text-[11px] text-[#8CA090]">Ditampilkan di header profil dan dashboard mitra.</p>
        </div>
        <div>
          <label htmlFor="email-perusahaan" className="block text-[11px] font-bold text-[#52645A] mb-1">Email Perusahaan</label>
          <input
            id="email-perusahaan"
            type="email"
            value={emailPerusahaan}
            onChange={(e) => setEmailPerusahaan(e.target.value)}
            placeholder="logistik@perusahaan.co.id"
            className="w-full rounded-xl bg-white border border-[#C27D3A]/10 px-3 py-2 text-sm focus:outline-none focus:border-[#C27D3A]/40 focus:ring-2 focus:ring-[#C27D3A]/10"
          />
          <p className="mt-1 text-[11px] text-[#8CA090]">Dipakai untuk login mitra, sama seperti saat registrasi.</p>
        </div>
      </div>

      {/* Alamat Section */}
      <div className="bg-[#FFF8EE] rounded-2xl p-4 shadow-sm border border-[#C27D3A]/10 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-[#C27D3A]">location_on</span>
          <h3 className="text-sm font-bold text-[#1A2E22]">Pengaturan Alamat</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-[#52645A] mb-1">Alamat Lengkap</label>
            <textarea
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full rounded-xl bg-white border border-[#C27D3A]/10 px-3 py-2 text-sm focus:outline-none focus:border-[#C27D3A]/40 focus:ring-2 focus:ring-[#C27D3A]/10"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#52645A] mb-1">Kota/Kabupaten</label>
              <input
                type="text"
                value={kota}
                onChange={(e) => setKota(e.target.value)}
                className="w-full rounded-xl bg-white border border-[#C27D3A]/10 px-3 py-2 text-sm focus:outline-none focus:border-[#C27D3A]/40 focus:ring-2 focus:ring-[#C27D3A]/10"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#52645A] mb-1">Kode Pos</label>
              <input
                type="text"
                value={kodePos}
                onChange={(e) => setKodePos(e.target.value)}
                className="w-full rounded-xl bg-white border border-[#C27D3A]/10 px-3 py-2 text-sm focus:outline-none focus:border-[#C27D3A]/40 focus:ring-2 focus:ring-[#C27D3A]/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Armada & Driver Section */}
      <div className="bg-[#FFF8EE] rounded-2xl p-4 shadow-sm border border-[#C27D3A]/10 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C27D3A]">local_shipping</span>
            <h3 className="text-sm font-bold text-[#1A2E22]">Data Armada & Driver</h3>
          </div>
          <button onClick={handleAddArmada} className="text-[#C27D3A] text-xs font-bold bg-white px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#C27D3A]/15 hover:bg-[#FEF3C7] transition-colors">
            <span className="material-symbols-outlined text-[14px]">add</span> Tambah
          </button>
        </div>

        <div className="space-y-2">
          {armadaList.map((armada) => (
            <div key={armada.id} className="p-3 rounded-xl border border-[#C27D3A]/10 bg-white flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-[#1A2E22]">{armada.plat}</p>
                <p className="text-[11px] text-[#52645A]">Driver: {armada.driver}</p>
              </div>
              <button
                onClick={() => setArmadaList(armadaList.filter(a => a.id !== armada.id))}
                className="text-red-500 p-1 hover:bg-red-50 rounded-full"
                aria-label={`Hapus armada ${armada.plat}`}
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          ))}
          {armadaList.length === 0 && (
            <p className="text-xs text-center text-[#52645A] py-4 bg-white/70 rounded-xl">Belum ada armada terdaftar.</p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2 space-y-2">
        <button
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="w-full min-h-[48px] py-3 rounded-full bg-[#C27D3A] hover:bg-[#A0632B] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span className={`material-symbols-outlined text-[18px] ${isSaving ? 'animate-spin' : ''}`}>
            {isSaving ? 'progress_activity' : 'save'}
          </span>
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
        <p className="text-center text-[11px] font-medium text-[#6B7C70]">
          {isDirty
            ? 'Ada perubahan yang belum disimpan.'
            : 'Semua perubahan sudah tersimpan.'}
        </p>
      </div>

    </div>
  );
};
