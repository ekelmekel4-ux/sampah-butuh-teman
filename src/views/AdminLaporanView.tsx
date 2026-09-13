import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AdminLaporanView: React.FC = () => {
  const { laporanList, resolveLaporan, setActiveRoute } = useApp();

  const [filterStatus, setFilterStatus] = useState<'semua' | 'menunggu' | 'selesai'>('semua');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    filterStatus === 'menunggu'
      ? laporanList.filter(l => l.status === 'menunggu_tindakan')
      : filterStatus === 'selesai'
      ? laporanList.filter(l => l.status === 'sudah_selesai')
      : laporanList;

  const pendingCount = laporanList.filter(l => l.status === 'menunggu_tindakan').length;
  const selesaiCount = laporanList.filter(l => l.status === 'sudah_selesai').length;

  const handleResolve = (id: string, tong: string) => {
    resolveLaporan(id);
    setActionNotice(`Laporan ${tong} telah diselesaikan. Tong dinyatakan steril & siap digunakan.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleWarnPic = (unitNama: string) => {
    setActionNotice(`Peringatan resmi SOP pemilahan telah dikirimkan ke WhatsApp PIC ${unitNama}.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleAssignVolunteer = (tongNama: string) => {
    setActionNotice(`Tim relawan sirkular mahasiswa ditugaskan untuk sortir ulang ${tongNama}.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const getLevelStyle = (level: string) => {
    if (level === 'kritis') return { bg: 'bg-[#FFDAD6]', text: 'text-[#BA1A1A]', border: 'border-[#BA1A1A]/30', icon: 'emergency' };
    if (level === 'sedang') return { bg: 'bg-[#FFF3E0]', text: 'text-[#E65100]', border: 'border-orange-200', icon: 'warning' };
    return { bg: 'bg-[#9CF2B5]/20', text: 'text-[#157140]', border: 'border-[#157140]/20', icon: 'check_circle' };
  };

  return (
    <div className="w-full pb-20 max-w-xl mx-auto space-y-4">

      {/* Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#176B4D]/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#176B4D] uppercase tracking-wider block">
              Moderasi & Kontrol Kualitas
            </span>
            <h1 className="text-base font-bold text-[#1C1C16]">Daftar Laporan / Flag</h1>
          </div>
          <button
            onClick={() => setActiveRoute('/admin/dashboard')}
            className="text-xs text-[#57635A] hover:text-[#176B4D] flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Dashboard
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 bg-[#FFDAD6] rounded-xl text-center">
            <span className="text-lg font-extrabold text-[#BA1A1A] block">{pendingCount}</span>
            <span className="text-[10px] text-[#BA1A1A]">Menunggu</span>
          </div>
          <div className="p-2.5 bg-[#9CF2B5]/20 rounded-xl text-center">
            <span className="text-lg font-extrabold text-[#157140] block">{selesaiCount}</span>
            <span className="text-[10px] text-[#57635A]">Selesai</span>
          </div>
          <div className="p-2.5 bg-[#F7F3EA] rounded-xl text-center">
            <span className="text-lg font-extrabold text-[#176B4D] block">{laporanList.length}</span>
            <span className="text-[10px] text-[#57635A]">Total</span>
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

      {/* Filter Tabs */}
      <div className="bg-[#F1EEE5] p-1 rounded-xl flex items-center gap-1 text-xs">
        {(['semua', 'menunggu', 'selesai'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`flex-1 py-2 rounded-lg text-center font-bold transition-all relative ${
              filterStatus === f ? 'bg-white text-[#176B4D] shadow-xs' : 'text-[#57635A]'
            }`}
          >
            {f === 'semua' ? `Semua (${laporanList.length})` :
             f === 'menunggu' ? (
              <>
                Menunggu
                {pendingCount > 0 && (
                  <span className="ml-1 px-1.5 bg-[#BA1A1A] text-white text-[9px] font-bold rounded-full">
                    {pendingCount}
                  </span>
                )}
              </>
             ) : `Selesai (${selesaiCount})`}
          </button>
        ))}
      </div>

      {/* Laporan List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center space-y-2 border border-dashed border-gray-200">
            <span className="material-symbols-outlined text-4xl text-gray-300">check_circle</span>
            <p className="text-sm text-gray-400">Tidak ada laporan di kategori ini.</p>
          </div>
        )}

        {filtered.map(lap => {
          const isPending = lap.status === 'menunggu_tindakan';
          const levelStyle = getLevelStyle(lap.level);
          const isExpanded = expandedId === lap.id;

          return (
            <div
              key={lap.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm border ${levelStyle.border} transition-all`}
            >
              {/* Card Header */}
              <div
                className={`p-4 cursor-pointer ${isPending ? '' : 'opacity-80'}`}
                onClick={() => setExpandedId(isExpanded ? null : lap.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${levelStyle.bg}`}>
                      <span className={`material-symbols-outlined text-base ${levelStyle.text}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        {levelStyle.icon}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-extrabold text-[#1C1C16]">#{lap.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPending ? 'bg-[#FFDAD6] text-[#BA1A1A]' : 'bg-[#9CF2B5] text-[#157140]'
                        }`}>
                          {isPending ? 'MENUNGGU TINDAKAN' : 'SELESAI'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${levelStyle.bg} ${levelStyle.text}`}>
                          {lap.level}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-[#1C1C16] mt-1">
                        {lap.tong_nama}
                      </h3>
                      <p className="text-[11px] text-[#57635A] mt-0.5">{lap.unit_nama}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] font-bold text-[#BA1A1A] bg-[#FFDAD6] px-2 py-0.5 rounded">
                      {lap.alasan}
                    </span>
                    <span className="text-[10px] text-[#57635A]">{lap.tanggal}</span>
                    <span className={`material-symbols-outlined text-sm text-[#57635A] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                  {/* Pelapor */}
                  <div className="text-[11px] text-[#57635A]">
                    <strong className="text-[#1C1C16]">Pelapor:</strong> {lap.pelapor_nama}
                  </div>

                  {/* Detail Masalah */}
                  <div className="p-2.5 rounded-xl bg-[#F7F3EA] text-xs text-[#3F4943] leading-relaxed">
                    {lap.detail}
                  </div>

                  {/* Foto Bukti */}
                  {lap.foto && lap.foto.length > 0 && (
                    <div>
                      <span className="text-[10px] font-semibold text-gray-500 block mb-1.5">
                        Foto Bukti ({lap.foto.length}):
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {lap.foto.map((img, idx) => (
                          <div key={idx} className="relative rounded-xl overflow-hidden h-28 bg-gray-100 border border-gray-200">
                            <img src={img} alt={`Bukti ${idx + 1}`} className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px]">
                              Foto {idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Aksi — hanya jika masih pending */}
                  {isPending && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => handleWarnPic(lap.unit_nama)}
                        className="py-2 px-2.5 rounded-xl bg-white border border-[#BA1A1A]/40 text-[#BA1A1A] text-[11px] font-semibold hover:bg-red-50 flex items-center justify-center gap-1 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">warning</span>
                        Peringatkan PIC
                      </button>

                      <button
                        onClick={() => handleAssignVolunteer(lap.tong_nama)}
                        className="py-2 px-2.5 rounded-xl bg-white border border-[#176B4D]/40 text-[#176B4D] text-[11px] font-semibold hover:bg-green-50 flex items-center justify-center gap-1 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">groups</span>
                        Tugaskan Relawan
                      </button>

                      <button
                        onClick={() => handleResolve(lap.id, lap.tong_nama)}
                        className="py-2 px-2.5 rounded-xl bg-[#176B4D] hover:bg-[#005138] text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">task_alt</span>
                        Selesaikan
                      </button>
                    </div>
                  )}

                  {/* Jika sudah selesai */}
                  {!isPending && (
                    <div className="p-2.5 bg-[#9CF2B5]/20 border border-[#157140]/20 rounded-xl text-[11px] text-[#157140] font-semibold flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      Laporan ini telah ditangani dan diselesaikan.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {laporanList.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center space-y-3 border border-dashed border-[#176B4D]/20">
          <span className="material-symbols-outlined text-5xl text-[#9CF2B5]">shield_check</span>
          <h3 className="text-sm font-bold text-[#1C1C16]">Tidak Ada Laporan</h3>
          <p className="text-xs text-[#57635A]">Drop point dalam kondisi bersih dan terawat.</p>
        </div>
      )}
    </div>
  );
};
