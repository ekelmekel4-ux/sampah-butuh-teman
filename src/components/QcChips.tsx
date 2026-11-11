import React from 'react';

type ListingQc = { kondisi?: string[] };

/** Membaca hasil QC unit dari daftar kondisi listing. */
export const getQcInfo = (listing: ListingQc) => {
  const kondisi = listing.kondisi || [];
  const qcLolos = kondisi.some(k => k.toLowerCase().includes('qc unit: lolos'));
  const qcRecorded = kondisi.some(k => k.toLowerCase().includes('qc unit:'));
  const kadarAir = kondisi.find(k => k.toLowerCase().includes('kadar air'));
  const lain = kondisi.filter(
    k => !k.toLowerCase().includes('qc unit:') && !k.toLowerCase().includes('kadar air')
  );

  return { qcLolos, qcRecorded, kadarAir, lain };
};

/** Deretan chip QC (lolos/perlu sortir) + info lain dari kondisi batch. */
export const QcChips: React.FC<{ listing: ListingQc; max?: number }> = ({ listing, max = 3 }) => {
  const { qcLolos, qcRecorded, kadarAir, lain } = getQcInfo(listing);

  return (
    <div className="flex flex-wrap gap-1">
      {qcRecorded ? (
        <span
          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
            qcLolos ? 'bg-[#D8F3DC] text-[#174630]' : 'bg-[#FEF3C7] text-[#8A5A12]'
          }`}
        >
          {qcLolos ? 'Lolos QC' : 'Perlu sortir'}
        </span>
      ) : (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5F6F3] text-[#8CA090]">
          QC belum dicatat
        </span>
      )}

      {kadarAir && (
        <span className="text-[10px] bg-[#FAFAF7] text-[#52645A] px-2 py-0.5 rounded-full">{kadarAir}</span>
      )}

      {lain.slice(0, max).map((k, i) => (
        <span key={i} className="text-[10px] bg-[#FAFAF7] text-[#52645A] px-2 py-0.5 rounded-full">
          {k.length > 28 ? `${k.slice(0, 28)}...` : k}
        </span>
      ))}

      {lain.length > max && (
        <span className="text-[10px] text-[#C27D3A] font-semibold">+{lain.length - max} lagi</span>
      )}
    </div>
  );
};
