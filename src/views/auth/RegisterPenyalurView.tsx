import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const RegisterPenyalurView: React.FC = () => {
  const { registerPenyalur, setAuthStep } = useApp();
  const [namaUnit, setNamaUnit] = useState('');
  const [inisial, setInisial] = useState('');
  const [jenis, setJenis] = useState<'fakultas' | 'biro' | 'prodi'>('fakultas');
  const [picNama, setPicNama] = useState('');
  const [email, setEmail] = useState('');
  const [kontak, setKontak] = useState('');
  const [lokasiDetail, setLokasiDetail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!agreeTerms) {
      setErrorMsg('Anda harus menyetujui Pakta Integritas Sirkularitas Kampus.');
      return;
    }

    if (!namaUnit || !inisial || !picNama || !email || !kontak) {
      setErrorMsg('Mohon lengkapi seluruh formulir yang wajib.');
      return;
    }

    const res = registerPenyalur({
      namaUnit,
      inisial: inisial.toUpperCase().trim(),
      jenis,
      picNama,
      email,
      kontak,
      lokasiDetail: lokasiDetail || `Gedung ${namaUnit}`
    });

    if (!res.success) {
      setErrorMsg(res.message || 'Gagal mendaftarkan unit.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#1C1C16] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      {/* Top Bar Back */}
      <div className="pt-2">
        <button
          onClick={() => setAuthStep('login-penyalur')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57635A] hover:text-[#176B4D] transition-colors px-2 py-1 rounded-lg hover:bg-black/5"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Masuk Penyalur</span>
        </button>
      </div>

      {/* Main Registration Box */}
      <div className="my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#176B4D]/15 shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#176B4D]/10 text-[#176B4D] flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-[26px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                app_registration
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B4D] bg-[#176B4D]/10 px-2 py-0.5 rounded-full">
                Registrasi Unit Kampus
              </span>
              <h1 className="text-xl font-black text-[#1C1C16] tracking-tight mt-0.5">
                Daftar Akun Penyalur
              </h1>
            </div>
          </div>

          <p className="text-xs text-[#57635A] mb-5 leading-relaxed">
            Daftarkan unit atau organisasi Anda (BEM, Fakultas, Biro, Prodi) untuk mendapatkan wadah tong resmi di drop point serbaguna.
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Nama Unit & Inisial */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-[#1C1C16] mb-1">
                  Nama Unit / Organisasi *
                </label>
                <input
                  type="text"
                  value={namaUnit}
                  onChange={e => setNamaUnit(e.target.value)}
                  required
                  placeholder="Contoh: BEM Fakultas Hukum"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#176B4D] outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1C1C16] mb-1">
                  Inisial *
                </label>
                <input
                  type="text"
                  value={inisial}
                  onChange={e => setInisial(e.target.value)}
                  required
                  maxLength={5}
                  placeholder="FHUK"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] uppercase font-bold focus:bg-white focus:border-[#176B4D] outline-hidden text-center"
                />
              </div>
            </div>

            {/* Jenis Unit */}
            <div>
              <label className="block text-xs font-bold text-[#1C1C16] mb-1">
                Kategori Unit *
              </label>
              <select
                value={jenis}
                onChange={e => setJenis(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#176B4D] outline-hidden font-medium"
              >
                <option value="fakultas">Fakultas / Sekolah Tinggi</option>
                <option value="biro">Biro / Lembaga Administrasi</option>
                <option value="prodi">Program Studi / BEM / Himpunan</option>
              </select>
            </div>

            {/* PIC Nama & Kontak */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-[#1C1C16] mb-1">
                  Nama Penanggung Jawab *
                </label>
                <input
                  type="text"
                  value={picNama}
                  onChange={e => setPicNama(e.target.value)}
                  required
                  placeholder="Contoh: Rian Pratama"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#176B4D] outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1C1C16] mb-1">
                  No. WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  value={kontak}
                  onChange={e => setKontak(e.target.value)}
                  required
                  placeholder="081234567890"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#176B4D] outline-hidden"
                />
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-[#1C1C16] mb-1">
                  Email Institusi *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="unit@univ.ac.id"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#176B4D] outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1C1C16] mb-1">
                  Kata Sandi *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#176B4D] outline-hidden"
                />
              </div>
            </div>

            {/* Lokasi Detail */}
            <div>
              <label className="block text-xs font-bold text-[#1C1C16] mb-1">
                Lokasi Sekretariat / Ruang Unit
              </label>
              <input
                type="text"
                value={lokasiDetail}
                onChange={e => setLokasiDetail(e.target.value)}
                placeholder="Gedung Sayap Timur Lt. 2 Ruang 204"
                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-[#176B4D] outline-hidden"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded-sm border-gray-300 text-[#176B4D] focus:ring-[#176B4D]"
                />
                <span className="text-[11px] text-[#57635A] leading-relaxed">
                  Menyetujui <strong>Pakta Integritas Sirkularitas Kampus</strong>: menjaga kebersihan kertas dari kontaminasi basah/minyak dan mengalokasikan konversi hasil untuk riset/kegiatan unit.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#176B4D] hover:bg-[#0E4632] text-white font-bold text-xs shadow-md shadow-[#176B4D]/20 transition-all flex items-center justify-center gap-2 mt-3"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Daftarkan Unit & Dapatkan Tong Resmi</span>
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-5 text-center text-xs text-[#57635A]">
            Sudah memiliki akun unit?{' '}
            <button
              onClick={() => setAuthStep('login-penyalur')}
              className="font-bold text-[#176B4D] hover:underline"
            >
              Masuk di sini
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#6F7A73] pb-2">
        Sampah Butuh Teman • Pendaftaran Penyalur Kampus
      </div>
    </div>
  );
};
