import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const LoginAdminView: React.FC = () => {
  const { login, setAuthStep } = useApp();
  const [email, setEmail] = useState('admin.kampushijau@univ.ac.id');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(email, 'admin', password);
    if (!res.success) {
      setErrorMsg(res.message || 'Kredensial admin tidak valid.');
    }
  };

  const handleDemoFill = () => {
    setEmail('admin.kampushijau@univ.ac.id');
    setPassword('admin123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#1C1C16] flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto">
      {/* Top Bar Back */}
      <div className="pt-2">
        <button
          onClick={() => setAuthStep('gate')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57635A] hover:text-gray-900 transition-colors px-2 py-1 rounded-lg hover:bg-black/5"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Pilihan Akun</span>
        </button>
      </div>

      {/* Main Form Box */}
      <div className="my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-300 shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-[26px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                admin_panel_settings
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                Otoritas Kampus
              </span>
              <h1 className="text-xl font-black text-[#1C1C16] tracking-tight mt-0.5">
                Panel Admin Pusat
              </h1>
            </div>
          </div>

          {/* Warning Notice about Invitation only */}
          <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-amber-600 shrink-0 mt-0.5">
              shield
            </span>
            <div className="leading-relaxed">
              <strong>Akses Terbatas:</strong> Akun admin hanya diterbitkan oleh Biro Sarana Prasarana Kampus untuk petugas drop point dan verifikator timbangan.
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1C16] mb-1.5">
                Email Administrator
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin.kampushijau@univ.ac.id"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-hidden transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C16] mb-1.5">
                Kata Sandi Otoritas
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                  lock
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#1C1C16] focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Quick Demo Pill */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleDemoFill}
                className="w-full py-1.5 px-3 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>Gunakan Akun Demo Admin (Siti Rahmawati)</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Buka Dashboard Operasional</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </form>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#6F7A73] pb-2">
        Pusat Operasional Logistik Gedung Serbaguna • Kampus Hijau
      </div>
    </div>
  );
};
