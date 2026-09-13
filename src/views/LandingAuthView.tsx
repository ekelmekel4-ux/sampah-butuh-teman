import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_BRAND } from '../data/initialData';
import { UserRole } from '../types';

export const LandingAuthView: React.FC = () => {
  const { setRole, setActiveRoute } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [selectedRole, setSelectedRole] = useState<'unit' | 'mitra'>('unit');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [unitName, setUnitName] = useState('Fakultas Teknik & Desain');
  const [picName, setPicName] = useState('Dr. Ir. Hendra Saputra, M.T.');
  const [email, setEmail] = useState('penyalur@ft.univ.ac.id');
  const [phone, setPhone] = useState('081234567890');
  const [password, setPassword] = useState('kampushijau2024');
  const [confirmPassword, setConfirmPassword] = useState('kampushijau2024');
  const [agreed, setAgreed] = useState(true);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roleTarget: UserRole = selectedRole === 'unit' ? 'unit' : 'perusahaan';
    setRole(roleTarget);

    const actionText = authMode === 'login' ? 'Masuk' : 'Pendaftaran';
    const roleLabel = selectedRole === 'unit' ? 'Unit Kampus (Penyalur)' : 'Mitra Industri (Penerima)';
    setSuccessNotice(`${actionText} berhasil! Selamat datang di Sampah Butuh Teman sebagai ${roleLabel}.`);

    setTimeout(() => {
      if (roleTarget === 'unit') {
        setActiveRoute('/unit/posting-baru');
      } else {
        setActiveRoute('/perusahaan/matching');
      }
    }, 1200);
  };

  const handleSSO = () => {
    setRole('unit');
    setSuccessNotice('Autentikasi SSO Kampus Terpadu Berhasil! Mengalihkan...');
    setTimeout(() => {
      setActiveRoute('/unit/posting-baru');
    }, 1000);
  };

  return (
    <div className="w-full pb-20 max-w-lg mx-auto">
      {/* Header Brand */}
      <div className="px-4 flex flex-col items-center text-center pt-2">
        <div className="relative flex items-center justify-center mb-3">
          <div className="w-20 h-20 rounded-full bg-[#F1EEE5] flex items-center justify-center p-2 shadow-sm">
            <img
              src={APP_BRAND.logoUrl}
              alt="Sampah Butuh Teman Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 bg-[#9CF2B5] text-[#157140] px-2 py-0.5 rounded-full text-[11px] font-bold shadow-xs">
            PjBL
          </span>
        </div>

        <h1 className="text-2xl font-extrabold text-[#005138] tracking-tight">
          Sampah Butuh Teman
        </h1>
        <p className="text-xs text-[#7E553B] mt-0.5 font-semibold">
          “Sampah yang menemukan temannya.”
        </p>
        <p className="text-xs text-[#3F4943] max-w-xs mt-1">
          Platform Sirkular Sampah Kertas Terintegrasi Kampus
        </p>
      </div>

      {/* Auth Toggle Tabs */}
      <div className="px-4 mt-5">
        <div className="bg-[#F1EEE5] p-1 rounded-xl flex items-center shadow-inner">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2.5 rounded-lg text-sm transition-all text-center ${
              authMode === 'login'
                ? 'bg-white text-[#005138] font-bold shadow-xs'
                : 'text-[#3F4943] font-medium'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2.5 rounded-lg text-sm transition-all text-center ${
              authMode === 'register'
                ? 'bg-white text-[#005138] font-bold shadow-xs'
                : 'text-[#3F4943] font-medium'
            }`}
          >
            Daftar Akun Baru
          </button>
        </div>
      </div>

      {/* Role Selection */}
      <div className="px-4 mt-4">
        <label className="text-xs text-[#1C1C16] font-bold mb-2 block">
          Pilih Peran Anda
        </label>
        <div className="grid grid-cols-1 gap-2.5">
          {/* Unit Kampus Option */}
          <button
            type="button"
            onClick={() => setSelectedRole('unit')}
            className={`w-full text-left p-3.5 rounded-xl shadow-xs transition-all relative overflow-hidden border ${
              selectedRole === 'unit'
                ? 'bg-white border-[#005138]'
                : 'bg-[#F7F3EA] border-transparent opacity-85 hover:opacity-100'
            }`}
          >
            {selectedRole === 'unit' && (
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#005138]"></div>
            )}
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedRole === 'unit'
                    ? 'bg-[#A4F3CC] text-[#005138]'
                    : 'bg-[#E6E2D9] text-[#6F7A73]'
                }`}
              >
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  account_balance
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm text-[#005138] font-bold">Unit Kampus</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#9CF2B5] text-[#157140] font-bold">
                    Penyalur
                  </span>
                </div>
                <p className="text-[11px] text-[#7E553B] mt-0.5 font-medium">
                  Fakultas / Biro / Lembaga Kemahasiswaan
                </p>
                <p className="text-xs text-[#3F4943] mt-1 leading-snug">
                  Pilah kertas arsip, setor ke tong bernomor terdekat, dan pantau akumulasi Eco-Points kampus.
                </p>
              </div>
            </div>
          </button>

          {/* Mitra Industri Option */}
          <button
            type="button"
            onClick={() => setSelectedRole('mitra')}
            className={`w-full text-left p-3.5 rounded-xl shadow-xs transition-all relative overflow-hidden border ${
              selectedRole === 'mitra'
                ? 'bg-white border-[#7E553B]'
                : 'bg-[#F7F3EA] border-transparent opacity-85 hover:opacity-100'
            }`}
          >
            {selectedRole === 'mitra' && (
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#7E553B]"></div>
            )}
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedRole === 'mitra'
                    ? 'bg-[#FFDBC8] text-[#7E553B]'
                    : 'bg-[#E6E2D9] text-[#6F7A73]'
                }`}
              >
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  factory
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm text-[#1C1C16] font-bold">Mitra Industri</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E6E2D9] text-[#3F4943] font-bold">
                    Penerima
                  </span>
                </div>
                <p className="text-[11px] text-[#7E553B] mt-0.5 font-medium">
                  Pabrik Kertas / Pengolah Daur Ulang
                </p>
                <p className="text-xs text-[#3F4943] mt-1 leading-snug">
                  Posting kuota pasokan, automasi alokasi tong kampus, dan jadwalkan armada angkut logistik.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#176B4D]/10">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Conditional Fields: Register Mode */}
            {authMode === 'register' && selectedRole === 'unit' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1C16] mb-1">
                    Nama Unit / Fakultas
                  </label>
                  <div className="flex items-center bg-[#F7F3EA] rounded-lg px-3 py-2.5">
                    <span className="material-symbols-outlined text-[#6F7A73] mr-2 text-lg">domain</span>
                    <input
                      type="text"
                      value={unitName}
                      onChange={e => setUnitName(e.target.value)}
                      required
                      placeholder="Contoh: Fakultas Teknik & Desain"
                      className="w-full bg-transparent border-none outline-none text-xs text-[#1C1C16] placeholder:text-[#6F7A73]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1C16] mb-1">
                    Penanggung Jawab (PIC)
                  </label>
                  <div className="flex items-center bg-[#F7F3EA] rounded-lg px-3 py-2.5">
                    <span className="material-symbols-outlined text-[#6F7A73] mr-2 text-lg">badge</span>
                    <input
                      type="text"
                      value={picName}
                      onChange={e => setPicName(e.target.value)}
                      required
                      placeholder="Nama lengkap koordinator unit"
                      className="w-full bg-transparent border-none outline-none text-xs text-[#1C1C16] placeholder:text-[#6F7A73]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1C16] mb-1">
                    Email Institusi Resmi
                  </label>
                  <div className="flex items-center bg-[#F7F3EA] rounded-lg px-3 py-2.5">
                    <span className="material-symbols-outlined text-[#6F7A73] mr-2 text-lg">alternate_email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="penyalur@ft.univ.ac.id"
                      className="w-full bg-transparent border-none outline-none text-xs text-[#1C1C16] placeholder:text-[#6F7A73]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1C16] mb-1">
                    Nomor WhatsApp PIC
                  </label>
                  <div className="flex items-center bg-[#F7F3EA] rounded-lg px-3 py-2.5">
                    <span className="material-symbols-outlined text-[#6F7A73] mr-2 text-lg">call</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                      placeholder="081234567890"
                      className="w-full bg-transparent border-none outline-none text-xs text-[#1C1C16] placeholder:text-[#6F7A73]"
                    />
                  </div>
                </div>
              </div>
            )}

            {authMode === 'register' && selectedRole === 'mitra' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1C16] mb-1">
                    Nama PT / Entitas Pabrik
                  </label>
                  <div className="flex items-center bg-[#F7F3EA] rounded-lg px-3 py-2.5">
                    <span className="material-symbols-outlined text-[#6F7A73] mr-2 text-lg">corporate_fare</span>
                    <input
                      type="text"
                      defaultValue="PT Mandiri Daur Lestari"
                      required
                      placeholder="Contoh: PT Mandiri Daur Lestari"
                      className="w-full bg-transparent border-none outline-none text-xs text-[#1C1C16] placeholder:text-[#6F7A73]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1C16] mb-1">
                    Nomor Induk Berusaha (NIB / Izin)
                  </label>
                  <div className="flex items-center bg-[#F7F3EA] rounded-lg px-3 py-2.5">
                    <span className="material-symbols-outlined text-[#6F7A73] mr-2 text-lg">verified</span>
                    <input
                      type="text"
                      defaultValue="9120001234567"
                      required
                      placeholder="9120001234567"
                      className="w-full bg-transparent border-none outline-none text-xs text-[#1C1C16] placeholder:text-[#6F7A73]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1C16] mb-1">
                    Email Logistik Perusahaan
                  </label>
                  <div className="flex items-center bg-[#F7F3EA] rounded-lg px-3 py-2.5">
                    <span className="material-symbols-outlined text-[#6F7A73] mr-2 text-lg">mail</span>
                    <input
                      type="email"
                      defaultValue="logistik@daurlestari.co.id"
                      required
                      placeholder="logistik@daurlestari.co.id"
                      className="w-full bg-transparent border-none outline-none text-xs text-[#1C1C16] placeholder:text-[#6F7A73]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1C16] mb-1">
                    WhatsApp Dispatcher Logistik
                  </label>
                  <div className="flex items-center bg-[#F7F3EA] rounded-lg px-3 py-2.5">
                    <span className="material-symbols-outlined text-[#6F7A73] mr-2 text-lg">local_shipping</span>
                    <input
                      type="tel"
                      defaultValue="081987654321"
                      required
                      placeholder="081987654321"
                      className="w-full bg-transparent border-none outline-none text-xs text-[#1C1C16] placeholder:text-[#6F7A73]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Login Mode Fields */}
            {authMode === 'login' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1C16] mb-1">
                    Email Akun Terdaftar
                  </label>
                  <div className="flex items-center bg-[#F7F3EA] rounded-lg px-3 py-2.5">
                    <span className="material-symbols-outlined text-[#6F7A73] mr-2 text-lg">mail</span>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="nama@institusi.ac.id atau nama@mitra.com"
                      className="w-full bg-transparent border-none outline-none text-xs text-[#1C1C16] placeholder:text-[#6F7A73]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#1C1C16] mb-1">
                Kata Sandi
              </label>
              <div className="flex items-center bg-[#F7F3EA] rounded-lg px-3 py-2.5 relative">
                <span className="material-symbols-outlined text-[#6F7A73] mr-2 text-lg">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Minimal 8 karakter"
                  className="w-full bg-transparent border-none outline-none text-xs text-[#1C1C16] placeholder:text-[#6F7A73] pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#6F7A73] hover:text-[#1C1C16]"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password (Register mode) */}
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#1C1C16] mb-1">
                  Konfirmasi Kata Sandi
                </label>
                <div className="flex items-center bg-[#F7F3EA] rounded-lg px-3 py-2.5 relative">
                  <span className="material-symbols-outlined text-[#6F7A73] mr-2 text-lg">lock_reset</span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Ulangi kata sandi Anda"
                    className="w-full bg-transparent border-none outline-none text-xs text-[#1C1C16] placeholder:text-[#6F7A73] pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-[#6F7A73] hover:text-[#1C1C16]"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Pakta Integritas Checkbox */}
            {authMode === 'register' && (
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    required
                    className="mt-0.5 w-4 h-4 rounded text-[#005138] accent-[#005138] cursor-pointer"
                  />
                  <span className="text-[11px] text-[#3F4943] leading-snug">
                    Saya menyetujui <strong className="text-[#005138]">Pakta Integritas Kampus Hijau</strong> & Standar Sortir Kertas Bersih Bebas Residu.
                  </span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all text-white ${
                  selectedRole === 'unit'
                    ? 'bg-[#005138] hover:bg-[#176B4D]'
                    : 'bg-[#7E553B] hover:bg-[#633E25]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {authMode === 'register' ? 'nature_people' : 'login'}
                </span>
                <span>
                  {authMode === 'register'
                    ? selectedRole === 'unit'
                      ? 'Daftar Sebagai Penyalur Kampus'
                      : 'Daftar Sebagai Mitra Pabrik'
                    : selectedRole === 'unit'
                    ? 'Masuk Sebagai Unit Kampus'
                    : 'Masuk Sebagai Mitra Pabrik'}
                </span>
              </button>
            </div>
          </form>

          {successNotice && (
            <div className="mt-3 p-2.5 bg-[#9CF2B5]/30 border border-[#157140]/20 rounded-lg text-xs text-[#157140] font-medium text-center animate-in fade-in">
              {successNotice}
            </div>
          )}
        </div>
      </div>

      {/* SSO & Quick Switcher */}
      <div className="px-4 mt-4 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center justify-center gap-2 w-full max-w-xs">
          <div className="h-[1px] bg-[#E6E2D9] flex-1"></div>
          <span className="text-[10px] font-bold text-[#6F7A73] uppercase tracking-wider">
            Atau Akses Cepat
          </span>
          <div className="h-[1px] bg-[#E6E2D9] flex-1"></div>
        </div>

        <button
          type="button"
          onClick={handleSSO}
          className="w-full max-w-sm py-2.5 px-4 rounded-xl bg-[#ECE8DF] hover:bg-[#E6E2D9] text-[#1C1C16] text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all"
        >
          <span className="material-symbols-outlined text-[#005138] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            domain_verification
          </span>
          <span>Masuk via SSO Kampus Terpadu</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[#3F4943]">
            {authMode === 'register' ? 'Sudah punya akun resmi?' : 'Belum memiliki akun unit atau mitra?'}
          </span>
          <button
            type="button"
            onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}
            className="text-[#005138] font-bold underline"
          >
            {authMode === 'register' ? 'Masuk di sini' : 'Daftar Akun Baru'}
          </button>
        </div>
      </div>

      {/* Live Campus Metric Badge */}
      <div className="px-4 mt-6">
        <div className="p-3.5 rounded-xl bg-[#F7F3EA] border border-[#176B4D]/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#9CF2B5] flex items-center justify-center text-[#157140] shrink-0">
            <span className="material-symbols-outlined text-xl">workspace_premium</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#1C1C16]">Terkoneksi 12 Fakultas & 8 Mitra Daur</p>
            <p className="text-[11px] text-[#3F4943] truncate">3.480 kg kertas tersortir bulan ini secara mandiri.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
