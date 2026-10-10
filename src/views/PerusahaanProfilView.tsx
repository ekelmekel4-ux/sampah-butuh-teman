import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const PerusahaanProfilView: React.FC = () => {
  const { role, currentUser, saldoSekarang } = useApp();
  
  // Dummy data for state
  const [alamat, setAlamat] = useState('Jl. Industri Daur Ulang No. 45\nKawasan Industri Surya Cipta');
  const [kota, setKota] = useState('Karawang');
  const [kodePos, setKodePos] = useState('41361');
  
  const [armadaList, setArmadaList] = useState([
    { id: 1, plat: 'B 9821 PQL', driver: 'Pak Joko Susilo' },
    { id: 2, plat: 'D 8122 XZ', driver: 'Kang Maman' }
  ]);

  const handleSave = () => {
    alert('Profil berhasil disimpan!');
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
      {/* Header Profile */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#2D6A4F]/10 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-2xl font-bold shadow-md">
          {currentUser?.nama ? currentUser.nama.charAt(0).toUpperCase() : 'PT'}
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#1A2E22]">{currentUser?.nama || 'PT Mandiri Daur Lestari'}</h2>
          <p className="text-xs text-[#52645A]">{currentUser?.email || 'daurulang@nusantara.com'}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#E5F6EB] text-[#2D6A4F] text-[10px] font-bold">
            Mitra Industri (Penerima)
          </span>
        </div>
      </div>

      {/* Saldo Perusahaan */}
      <div className="bg-[#2D6A4F] rounded-2xl p-4 shadow-md text-white relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
        <div className="relative z-10">
          <div className="text-xs font-bold text-white/80 uppercase mb-1">Tagihan Tersedia</div>
          <div className="text-2xl font-black">Rp {saldoSekarang.toLocaleString('id-ID')}</div>
        </div>
      </div>

      {/* Alamat Section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#2D6A4F]/10 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-[#2D6A4F]">location_on</span>
          <h3 className="text-sm font-bold text-[#1A2E22]">Pengaturan Alamat</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-[#52645A] mb-1">Alamat Lengkap</label>
            <textarea
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full rounded-xl bg-[#F2F7F4] border border-[#2D6A4F]/10 px-3 py-2 text-sm focus:outline-none focus:border-[#2D6A4F]/30"
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
                className="w-full rounded-xl bg-[#F2F7F4] border border-[#2D6A4F]/10 px-3 py-2 text-sm focus:outline-none focus:border-[#2D6A4F]/30"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#52645A] mb-1">Kode Pos</label>
              <input
                type="text"
                value={kodePos}
                onChange={(e) => setKodePos(e.target.value)}
                className="w-full rounded-xl bg-[#F2F7F4] border border-[#2D6A4F]/10 px-3 py-2 text-sm focus:outline-none focus:border-[#2D6A4F]/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Armada & Driver Section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#2D6A4F]/10 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2D6A4F]">local_shipping</span>
            <h3 className="text-sm font-bold text-[#1A2E22]">Data Armada & Driver</h3>
          </div>
          <button onClick={handleAddArmada} className="text-[#2D6A4F] text-xs font-bold bg-[#E5F6EB] px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">add</span> Tambah
          </button>
        </div>
        
        <div className="space-y-2">
          {armadaList.map((armada) => (
            <div key={armada.id} className="p-3 rounded-xl border border-gray-100 bg-[#F9FBFA] flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-[#1A2E22]">{armada.plat}</p>
                <p className="text-[11px] text-[#52645A]">Driver: {armada.driver}</p>
              </div>
              <button 
                onClick={() => setArmadaList(armadaList.filter(a => a.id !== armada.id))}
                className="text-red-500 p-1 hover:bg-red-50 rounded-full"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          ))}
          {armadaList.length === 0 && (
            <p className="text-xs text-center text-[#52645A] py-4 bg-gray-50 rounded-xl">Belum ada armada terdaftar.</p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button 
          onClick={handleSave}
          className="w-full py-3 rounded-full bg-[#2D6A4F] hover:bg-[#1A4235] text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          Simpan Perubahan
        </button>
      </div>

    </div>
  );
};
