import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AdminUnitTongView: React.FC = () => {
  const {
    units,
    tongList,
    addNewUnitAndTong,
    emptyTong,
    setActiveRoute,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'denah' | 'daftar_unit'>('denah');
  const [selectedTong, setSelectedTong] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUnitNama, setNewUnitNama] = useState('');
  const [newUnitInisial, setNewUnitInisial] = useState('');
  const [newUnitJenis, setNewUnitJenis] = useState<'fakultas' | 'biro' | 'prodi'>('fakultas');
  const [newUnitLokasi, setNewUnitLokasi] = useState('');
  const [newKapasitas, setNewKapasitas] = useState(120);
  const [newPicNama, setNewPicNama] = useState('');
  const [newKontakPic, setNewKontakPic] = useState('');
  const [addSuccess, setAddSuccess] = useState<string | null>(null);
  const [filterJenis, setFilterJenis] = useState<'semua' | 'fakultas' | 'biro' | 'prodi'>('semua');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredUnits = filterJenis === 'semua'
    ? units
    : units.filter(u => u.jenis === filterJenis);

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitNama || !newUnitInisial) return;

    addNewUnitAndTong({
      namaUnit: newUnitNama,
      inisial: newUnitInisial,
      jenis: newUnitJenis,
      lokasiDetail: newUnitLokasi || 'Kampus Utama',
      kapasitasMax: newKapasitas,
      picNama: newPicNama || 'Koordinator Unit',
      kontakPic: newKontakPic || '08123456789',
    });

    setAddSuccess(`Unit ${newUnitNama} & Tong ${newUnitInisial.toUpperCase()} No. 1 berhasil didaftarkan!`);
    setTimeout(() => {
      setAddSuccess(null);
      setShowAddModal(false);
      setNewUnitNama('');
      setNewUnitInisial('');
      setNewUnitLokasi('');
      setNewPicNama('');
      setNewKontakPic('');
    }, 1800);
  };

  const getTongForUnit = (unitId: string) => tongList.find(t => t.unit_id === unitId);

  const getTongStatusStyle = (status: string) => {
    if (status === 'siap_pickup') return { bg: 'bg-[#FFDBC8]', text: 'text-[#8B6045]', label: 'Siap Pickup', dot: 'bg-[#8B6045] animate-ping' };
    if (status === 'terisi') return { bg: 'bg-[#A4F3CC]/30', text: 'text-[#176B4D]', label: 'Terisi', dot: 'bg-[#176B4D]' };
    return { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Kosong', dot: 'bg-gray-300' };
  };

  const totalTong = tongList.length;
  const tongTerisi = tongList.filter(t => t.status === 'terisi' || t.status === 'siap_pickup').length;
  const tongKosong = tongList.filter(t => t.status === 'kosong').length;

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4">

      {/* Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#176B4D] uppercase tracking-wider block">
              Manajemen Drop Point
            </span>
            <h1 className="text-base font-bold text-[#1C1C16]">Kelola Unit & Tong</h1>
          </div>
          <button
            onClick={() => setActiveRoute('/admin/dashboard')}
            className="text-xs text-[#57635A] hover:text-[#176B4D] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Dashboard
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 bg-[#F7F3EA] rounded-xl text-center">
            <span className="text-lg font-extrabold text-[#176B4D] block">{units.length}</span>
            <span className="text-[10px] text-[#57635A]">Total Unit</span>
          </div>
          <div className="p-2.5 bg-[#A4F3CC]/20 rounded-xl text-center">
            <span className="text-lg font-extrabold text-[#176B4D] block">{tongTerisi}</span>
            <span className="text-[10px] text-[#57635A]">Tong Aktif</span>
          </div>
          <div className="p-2.5 bg-gray-50 rounded-xl text-center">
            <span className="text-lg font-extrabold text-gray-500 block">{tongKosong}</span>
            <span className="text-[10px] text-[#57635A]">Tong Kosong</span>
          </div>
        </div>
      </div>

      {/* Action Notice */}
      {actionNotice && (
        <div className="p-3 bg-[#9CF2B5]/30 border border-[#157140]/30 rounded-xl text-xs text-[#157140] font-semibold flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-base shrink-0">check_circle</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Sub-Tab Navigation: Denah Fisik & Log vs. Daftar Unit */}
      <div className="bg-[#F1EEE5] p-1 rounded-xl flex items-center gap-1 text-xs">
        <button
          onClick={() => setActiveTab('denah')}
          className={`flex-1 py-2.5 rounded-lg text-center font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'denah'
              ? 'bg-white text-[#176B4D] shadow-xs'
              : 'text-[#57635A] hover:text-[#1C1C16]'
          }`}
        >
          <span className="material-symbols-outlined text-base">grid_view</span>
          <span>Denah Fisik & Log Drop Point</span>
        </button>

        <button
          onClick={() => setActiveTab('daftar_unit')}
          className={`flex-1 py-2.5 rounded-lg text-center font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'daftar_unit'
              ? 'bg-white text-[#176B4D] shadow-xs'
              : 'text-[#57635A] hover:text-[#1C1C16]'
          }`}
        >
          <span className="material-symbols-outlined text-base">domain</span>
          <span>Daftar Unit Penyalur ({units.length})</span>
        </button>
      </div>

      {/* TAB 1: DENAH DROP POINT & LOG AKTIVITAS */}
      {activeTab === 'denah' && (
        <div className="space-y-4">
          {/* Denah Visual Terorganisir Per Baris (5 Kotak per Fakultas) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#176B4D]/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-gray-100">
              <div>
                <h2 className="text-base font-black text-[#1C1C16] flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-[#176B4D]">floor</span>
                  Denah Tong Drop Point Serbaguna (Tata Letak Per Baris)
                </h2>
                <p className="text-xs text-[#57635A] mt-0.5">
                  Tersusun rapi per baris fakultas (5 slot tong per baris, kapasitas maks 120 Kg per tong)
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#57635A]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                  <span>Standby (0 Kg)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Siap Jemput (≥10 Kg)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  <span>Penuh (120 Kg)</span>
                </span>
              </div>
            </div>

            {/* Rows of Faculty Tongs */}
            <div className="space-y-3.5">
              {(() => {
                const standardOrder = ['unit-ftd', 'unit-feb', 'unit-fikom', 'unit-baa'];
                const orderedUnits = units
                  .filter(u => standardOrder.includes(u.id))
                  .sort((a, b) => standardOrder.indexOf(a.id) - standardOrder.indexOf(b.id));

                return orderedUnits.map((unit, unitIdx) => {
                  const rowTongs = tongList
                    .filter(t => t.unit_id === unit.id)
                    .sort((a, b) => a.nomor.localeCompare(b.nomor));

                  const rowTotalKg = rowTongs.reduce((acc, t) => acc + t.berat_kg, 0);
                  const hasFullTong = rowTongs.some(t => t.berat_kg >= t.kapasitas_max_kg);
                  const hasReadyTong = rowTongs.some(t => t.berat_kg >= 10 && t.berat_kg < t.kapasitas_max_kg);
                  const globalRowNumber = standardOrder.indexOf(unit.id) !== -1
                    ? standardOrder.indexOf(unit.id) + 1
                    : unitIdx + 1;

                  return (
                    <div
                      key={unit.id}
                      className="border border-gray-200/90 rounded-2xl p-3 sm:p-3.5 bg-[#FAF8F5] space-y-2.5"
                    >
                      {/* Row Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#176B4D] text-white font-black text-[10px] tracking-wider">
                            BARIS {globalRowNumber}
                          </span>
                          <strong className="text-xs text-[#1C1C16]">
                            {unit.nama_unit} ({unit.inisial})
                          </strong>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#57635A]">
                            Akumulasi: <strong className="text-[#176B4D]">{rowTotalKg}</strong> Kg
                          </span>
                          {hasFullTong && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[9px] font-black animate-pulse">
                              Penuh (120 Kg)
                            </span>
                          )}
                          {hasReadyTong && !hasFullTong && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                              Siap Jemput
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 5 Tong Boxes Row */}
                      <div className="grid grid-cols-5 gap-2">
                        {rowTongs.map((tong, tongIdx) => {
                          const isFull = tong.berat_kg >= tong.kapasitas_max_kg;
                          const isReady = tong.berat_kg >= 10 && !isFull;
                          const isCollecting = tong.berat_kg > 0 && tong.berat_kg < 10;
                          const isEmpty = tong.berat_kg === 0;
                          const pct = Math.min(100, Math.round((tong.berat_kg / tong.kapasitas_max_kg) * 100));

                          return (
                            <div
                              key={tong.id}
                              onClick={() => setSelectedTong(tong)}
                              className={`rounded-xl p-2 sm:p-2.5 border transition-all cursor-pointer flex flex-col justify-between relative group hover:shadow-md ${
                                isFull
                                  ? 'bg-rose-50/90 border-rose-400 hover:border-rose-600 ring-1 ring-rose-300'
                                  : isReady
                                  ? 'bg-emerald-50/90 border-emerald-400 hover:border-emerald-600 ring-1 ring-emerald-300'
                                  : isCollecting
                                  ? 'bg-amber-50/70 border-amber-300 hover:border-amber-500'
                                  : 'bg-white border-gray-200 hover:border-gray-400'
                              }`}
                            >
                              {/* Box Header */}
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-[#1C1C16]">
                                  #{tongIdx + 1}
                                </span>
                                <span
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    isFull
                                      ? 'bg-rose-600 animate-ping'
                                      : isReady
                                      ? 'bg-emerald-600 animate-pulse'
                                      : isCollecting
                                      ? 'bg-amber-500'
                                      : 'bg-gray-300'
                                  }`}
                                />
                              </div>

                              {/* Box Center Icon & Code */}
                              <div className="py-1 text-center">
                                <div
                                  className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center font-mono font-black text-[11px] mb-1 transition-transform group-hover:scale-110 ${
                                    isFull
                                      ? 'bg-rose-600 text-white shadow-xs'
                                      : isReady
                                      ? 'bg-[#176B4D] text-white shadow-xs'
                                      : isCollecting
                                      ? 'bg-amber-100 text-amber-900'
                                      : 'bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  {tong.nomor.replace(/^[^-]+-/, '')}
                                </div>
                                <div className="text-[10px] font-black text-[#1C1C16]">
                                  {tong.berat_kg} <span className="text-[8px] font-normal text-gray-500">Kg</span>
                                </div>
                              </div>

                              {/* Mini Fill Progress Bar */}
                              <div className="space-y-1">
                                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      isFull
                                        ? 'bg-rose-600'
                                        : isReady
                                        ? 'bg-emerald-600'
                                        : isCollecting
                                        ? 'bg-amber-500'
                                        : 'bg-transparent'
                                    }`}
                                    style={{ width: `${isEmpty ? 0 : Math.max(10, pct)}%` }}
                                  />
                                </div>

                                <span className="text-[8px] text-[#57635A] truncate pt-0.5 border-t border-gray-100 block">
                                  {tong.tipe_kertas || 'Standby'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Log Aktivitas Drop Point Terkini */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#176B4D] text-lg">history</span>
                <h3 className="text-sm font-bold text-[#1C1C16]">Log Aktivitas Drop Point Serbaguna</h3>
              </div>
              <span className="text-[10px] text-[#57635A]">Hari ini</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F7F3EA]">
                <span className="material-symbols-outlined text-[#176B4D] text-base shrink-0 mt-0.5">
                  move_to_inbox
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-[#1C1C16]">FTD menyetorkan 15 Kg HVS</span>
                  <p className="text-[11px] text-[#57635A]">Tersimpan di Tong FTD No. 1 • 14:30 WIB</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F7F3EA]">
                <span className="material-symbols-outlined text-[#8B6045] text-base shrink-0 mt-0.5">
                  local_shipping
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-[#1C1C16]">PT Mandiri Daur Menjadwalkan Armada</span>
                  <p className="text-[11px] text-[#57635A]">Truk Pickup B 9821 PQL siap ambil muatan • 12:00 WIB</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F7F3EA]">
                <span className="material-symbols-outlined text-[#176B4D] text-base shrink-0 mt-0.5">
                  inventory_2
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-[#1C1C16]">BAA menyetorkan 55 Kg Kardus Box</span>
                  <p className="text-[11px] text-[#57635A]">Tersimpan di Tong BAA No. 1 • 09:15 WIB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DAFTAR UNIT PENYALUR & ALOKASI */}
      {activeTab === 'daftar_unit' && (
        <div className="space-y-3">
          {/* Filter + Add Button */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#F1EEE5] p-1 rounded-xl flex items-center gap-1 text-xs">
              {(['semua', 'fakultas', 'biro', 'prodi'] as const).map(jenis => (
                <button
                  key={jenis}
                  onClick={() => setFilterJenis(jenis)}
                  className={`flex-1 py-1.5 rounded-lg text-center font-semibold transition-all capitalize cursor-pointer ${
                    filterJenis === jenis ? 'bg-white text-[#176B4D] shadow-xs' : 'text-[#57635A]'
                  }`}
                >
                  {jenis === 'semua' ? 'Semua' : jenis.charAt(0).toUpperCase() + jenis.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2.5 rounded-xl bg-[#176B4D] hover:bg-[#005138] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs whitespace-nowrap transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              + Unit Baru
            </button>
          </div>

          {/* Unit Cards */}
          <div className="space-y-3">
            {filteredUnits.map(unit => {
              const tong = getTongForUnit(unit.id);
              const statusStyle = tong ? getTongStatusStyle(tong.status) : null;
              const loadPercent = tong ? Math.round((tong.berat_kg / tong.kapasitas_max_kg) * 100) : 0;

              return (
                <div
                  key={unit.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/8 space-y-3"
                >
                  {/* Unit Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#A4F3CC] flex items-center justify-center text-[#005138] font-extrabold text-sm shrink-0">
                        {unit.inisial}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#1C1C16]">{unit.nama_unit}</h3>
                        <p className="text-[11px] text-[#57635A] mt-0.5">{unit.lokasi_detail}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded capitalize ${
                            unit.jenis === 'fakultas' ? 'bg-blue-50 text-blue-600' :
                            unit.jenis === 'biro' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {unit.jenis}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-[#005138] block">{unit.total_kg_tersalurkan} Kg</span>
                      <span className="text-[10px] text-[#8B6045] font-semibold">{unit.eco_points} Pts</span>
                    </div>
                  </div>

                  {/* Tong Info */}
                  {tong ? (
                    <div className={`p-3 rounded-xl border ${statusStyle?.bg} border-current/10 space-y-2`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${statusStyle?.dot}`} />
                          <span className={`text-xs font-bold ${statusStyle?.text}`}>
                            {tong.nama_tong} — {statusStyle?.label}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#57635A] font-mono">{tong.nomor}</span>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-[#57635A]">{tong.berat_kg} Kg terisi</span>
                          <span className="font-bold text-[#1C1C16]">{loadPercent}% dari {tong.kapasitas_max_kg} Kg</span>
                        </div>
                        <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              loadPercent > 80 ? 'bg-red-500' : loadPercent > 50 ? 'bg-[#8B6045]' : 'bg-[#176B4D]'
                            }`}
                            style={{ width: `${loadPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-[10px] text-[#57635A]">
                        {tong.lokasi_spesifik} • {tong.tipe_kertas}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-gray-50 rounded-xl text-xs text-gray-400 text-center">
                      Belum ada tong dialokasikan
                    </div>
                  )}

                  {/* PIC Info */}
                  <div className="flex items-center justify-between text-[11px] text-[#57635A] border-t border-gray-100 pt-2">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">person</span>
                      PIC: {unit.pic_nama}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">call</span>
                      {unit.kontak_pic}
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setActionNotice(`Notifikasi pengisian tong dikirim ke PIC ${unit.nama_unit}.`);
                        setTimeout(() => setActionNotice(null), 3000);
                      }}
                      className="py-2 px-3 rounded-lg bg-[#F7F3EA] text-[#57635A] text-[11px] font-semibold hover:bg-[#ECE8DF] flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">notifications</span>
                      Notif PIC
                    </button>
                    <button
                      onClick={() => {
                        setActionNotice(`Status tong ${tong?.nama_tong || unit.tong_nama} berhasil di-reset ke Kosong.`);
                        setTimeout(() => setActionNotice(null), 3000);
                      }}
                      className="py-2 px-3 rounded-lg bg-[#F7F3EA] text-[#57635A] text-[11px] font-semibold hover:bg-[#ECE8DF] flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">refresh</span>
                      Reset Tong
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredUnits.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center space-y-2 border border-dashed border-gray-200">
                <span className="material-symbols-outlined text-4xl text-gray-300">domain</span>
                <p className="text-sm text-gray-400">Belum ada unit terdaftar untuk kategori ini.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Add Unit */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-2xl animate-in zoom-in-95 border border-[#176B4D]/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#176B4D]">add_circle</span>
                <h3 className="font-bold text-sm text-[#1C1C16]">Daftarkan Unit & Tong Baru</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddUnit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nama Unit / Fakultas *</label>
                <input
                  type="text"
                  value={newUnitNama}
                  onChange={e => setNewUnitNama(e.target.value)}
                  placeholder="Contoh: Fakultas Kedokteran"
                  required
                  className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-[#176B4D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Inisial / Singkatan *</label>
                  <input
                    type="text"
                    value={newUnitInisial}
                    onChange={e => setNewUnitInisial(e.target.value)}
                    placeholder="FK"
                    maxLength={6}
                    required
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none uppercase font-bold focus:border-[#176B4D]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Jenis Unit</label>
                  <select
                    value={newUnitJenis}
                    onChange={e => setNewUnitJenis(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none font-medium"
                  >
                    <option value="fakultas">Fakultas</option>
                    <option value="biro">Biro</option>
                    <option value="prodi">Program Studi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Lokasi Fisik Unit</label>
                <input
                  type="text"
                  value={newUnitLokasi}
                  onChange={e => setNewUnitLokasi(e.target.value)}
                  placeholder="Gedung C Lantai 2"
                  className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-[#176B4D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Nama PIC Unit</label>
                  <input
                    type="text"
                    value={newPicNama}
                    onChange={e => setNewPicNama(e.target.value)}
                    placeholder="Nama PIC"
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-[#176B4D]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Kontak WA PIC</label>
                  <input
                    type="text"
                    value={newKontakPic}
                    onChange={e => setNewKontakPic(e.target.value)}
                    placeholder="0812xxxx"
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-[#176B4D]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Kapasitas Tong Standar (Kg)</label>
                <input
                  type="number"
                  value={newKapasitas}
                  onChange={e => setNewKapasitas(Number(e.target.value))}
                  min={30}
                  max={200}
                  className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none"
                />
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  Sistem otomatis mengalokasikan 1 Tong Drop Point bernomor seri unit ini.
                </span>
              </div>

              {addSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold animate-in fade-in flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  {addSuccess}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#176B4D] hover:bg-[#005138] text-white font-bold transition-all shadow-xs cursor-pointer"
                >
                  Simpan & Alokasikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tong Detail & Empty Action */}
      {selectedTong && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 border border-[#176B4D]/20">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#176B4D] text-white flex items-center justify-center font-bold text-xs">
                  {selectedTong.nomor.split('-')[1] || '01'}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1C1C16]">Detail {selectedTong.nama_tong}</h3>
                  <p className="text-[10px] text-[#57635A] font-mono">{selectedTong.nomor}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTong(null)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Status & Load Display */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#57635A]">Status Muatan:</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    selectedTong.berat_kg >= selectedTong.kapasitas_max_kg
                      ? 'bg-rose-100 text-rose-700'
                      : selectedTong.berat_kg >= 10
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedTong.berat_kg > 0
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {selectedTong.berat_kg >= selectedTong.kapasitas_max_kg
                    ? '🔴 Penuh (120 Kg)'
                    : selectedTong.berat_kg >= 10
                    ? '🟢 Siap Pickup (≥10 Kg)'
                    : selectedTong.berat_kg > 0
                    ? '🟡 Mengumpulkan (<10 Kg)'
                    : '⚪ Standby Siap Diisi'}
                </span>
              </div>

              <div className="text-center py-1">
                <div className="text-3xl font-black text-[#1C1C16]">
                  {selectedTong.berat_kg}{' '}
                  <span className="text-sm font-bold text-[#57635A]">/ {selectedTong.kapasitas_max_kg} Kg</span>
                </div>
                <p className="text-xs text-[#57635A] mt-0.5">
                  Sisa Kapasitas: <strong>{Math.max(0, selectedTong.kapasitas_max_kg - selectedTong.berat_kg)} Kg</strong>
                </p>
              </div>

              {/* Meter bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedTong.berat_kg >= selectedTong.kapasitas_max_kg
                      ? 'bg-rose-600'
                      : selectedTong.berat_kg >= 10
                      ? 'bg-emerald-600'
                      : selectedTong.berat_kg > 0
                      ? 'bg-amber-500'
                      : 'bg-gray-300'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(selectedTong.berat_kg > 0 ? 8 : 0, Math.round((selectedTong.berat_kg / selectedTong.kapasitas_max_kg) * 100)))}%`
                  }}
                />
              </div>
            </div>

            {/* Detail Info */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Lokasi Drop Point:</span>
                  <strong className="text-gray-800 text-right">{selectedTong.lokasi_spesifik}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tipe Kertas Tampung:</span>
                  <strong className="text-[#176B4D]">{selectedTong.tipe_kertas || 'Campur Bersih'}</strong>
                </div>
                {selectedTong.catatan && (
                  <div className="flex justify-between pt-1 border-t border-gray-200/60">
                    <span className="text-gray-500">Catatan:</span>
                    <span className="text-gray-700 italic text-right">{selectedTong.catatan}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  emptyTong(selectedTong.id);
                  setActionNotice(`Tong ${selectedTong.nomor} berhasil dikosongkan (0 Kg).`);
                  setSelectedTong({ ...selectedTong, berat_kg: 0, status: 'kosong' });
                  setTimeout(() => setActionNotice(null), 3500);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">delete_sweep</span>
                <span>Kosongkan Tong Ini (Reset ke 0 Kg)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTong(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
