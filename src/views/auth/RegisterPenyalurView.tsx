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
    <div className="min-h-screen bg-[#FAFAF7] text-[#1A2E22] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto font-sans select-none">
      {/* Back Button */}
      <div className="pt-2">
        <button
          onClick={() => setAuthStep('login-penyalur')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#52645A] hover:text-[#2D6A4F] transition-colors px-3 py-1.5 rounded-full bg-white border border-[#2D6A4F]/10 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Masuk Penyalur</span>
        </button>
      </div>

      {/* Main Registration Box */}
      <div className="my-auto py-6">
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#2D6A4F]/10 shadow-xl space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                how_to_reg
              </span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F] bg-[#D8F3DC] px-2.5 py-0.5 rounded-full">
                Registrasi Unit Kampus
              </span>
              <h1 className="text-xl font-black text-[#1A2E22] tracking-tight mt-1">
                Daftar Penyalur Baru
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-extrabold text-[#1A2E22] block mb-1">
                Nama Resmi Unit Kampus *
              </label>
              <input
                type="text"
                required
                value={namaUnit}
                onChange={e => setNamaUnit(e.target.value)}
                placeholder="contoh: Fakultas Teknik & Desain"
                className="w-full h-11 px-4 rounded-2xl bg-[#F2F7F4] border border-[#2D6A4F]/15 text-xs font-bold text-[#1A2E22] outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/15 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-extrabold text-[#1A2E22] block mb-1">
                  Kode / Inisial Unit *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={inisial}
                  onChange={e => setInisial(e.target.value.toUpperCase())}
                  placeholder="contoh: FTD"
                  className="w-full h-11 px-4 rounded-2xl bg-[#F2F7F4] border border-[#2D6A4F]/15 text-xs font-black text-[#2D6A4F] uppercase outline-none focus:border-[#2D6A4F] transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-[#1A2E22] block mb-1">
                  Kategori Unit *
                </label>
                <select
                  value={jenis}
                  onChange={e => setJenis(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-2xl bg-[#F2F7F4] border border-[#2D6A4F]/15 text-xs font-bold text-[#1A2E22] outline-none focus:border-[#2D6A4F] transition-all"
                >
                  <option value="fakultas">Fakultas</option>
                  <option value="biro">Biro / Lembaga</option>
                  <option value="prodi">Prodi / BEM</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-extrabold text-[#1A2E22] block mb-1">
                  Nama Penanggung Jawab (PIC) *
                </label>
                <input
                  type="text"
                  required
                  value={picNama}
                  onChange={e => setPicNama(e.target.value)}
                  placeholder="Nama lengkap PIC"
                  className="w-full h-11 px-4 rounded-2xl bg-[#F2F7F4] border border-[#2D6A4F]/15 text-xs font-bold text-[#1A2E22] outline-none focus:border-[#2D6A4F] transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-[#1A2E22] block mb-1">
                  Nomor HP / WA PIC *
                </label>
                <input
                  type="text"
                  required
                  value={kontak}
                  onChange={e => setKontak(e.target.value)}
                  placeholder="0812-3456-7890"
                  className="w-full h-11 px-4 rounded-2xl bg-[#F2F7F4] border border-[#2D6A4F]/15 text-xs font-bold text-[#1A2E22] outline-none focus:border-[#2D6A4F] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#1A2E22] block mb-1">
                Email Resmi Unit *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="unit@univ.ac.id"
                className="w-full h-11 px-4 rounded-2xl bg-[#F2F7F4] border border-[#2D6A4F]/15 text-xs font-bold text-[#1A2E22] outline-none focus:border-[#2D6A4F] transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#1A2E22] block mb-1">
                Alamat / Titik Koordinat
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Gedung A Lt. 1 / -6.208, 106.845"
                className="w-full py-2.5 px-4 rounded-2xl bg-[#F2F7F4] border border-[#2D6A4F]/15 text-xs font-bold text-[#1A2E22] outline-none focus:border-[#2D6A4F] transition-all resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#1A2E22] block mb-1">
                Armada Kendaraan (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Motor Tossa / B 1234 CD"
                className="w-full h-11 px-4 rounded-2xl bg-[#F2F7F4] border border-[#2D6A4F]/15 text-xs font-bold text-[#1A2E22] outline-none focus:border-[#2D6A4F] transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#1A2E22] block mb-1">
                Kata Sandi *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full h-11 px-4 rounded-2xl bg-[#F2F7F4] border border-[#2D6A4F]/15 text-xs font-bold text-[#1A2E22] outline-none focus:border-[#2D6A4F] transition-all"
              />
            </div>

            {/* Pakta integritas */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="agree"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[#2D6A4F]"
              />
              <label htmlFor="agree" className="text-[11px] text-[#52645A] font-medium leading-tight">
                Saya mengonfirmasi bahwa unit kami bersedia menyalurkan sampah kertas ke wadah unit terdaftar dan berpartisipasi dalam leaderboard sirkularitas kampus.
              </label>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-[#E76F51]/10 border border-[#E76F51]/30 text-[#B04030] text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-base shrink-0">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#2D6A4F] hover:bg-[#1A4235] active:bg-[#0F2E22] text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Daftarkan Unit Sekarang</span>
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </button>
          </form>
        </div>

        {/* Switch to Login */}
        <div className="text-center mt-4 text-xs text-[#52645A] font-medium">
          Sudah memiliki akun unit?{' '}
          <button
            onClick={() => setAuthStep('login-penyalur')}
            className="font-extrabold text-[#2D6A4F] hover:underline"
          >
            Masuk Penyalur
          </button>
        </div>
      </div>

      <div className="text-center pb-2 text-[11px] font-semibold text-[#8CA090]">
        Sampah Butuh Teman • Kampus Hijau
      </div>
    </div>
  );
};
