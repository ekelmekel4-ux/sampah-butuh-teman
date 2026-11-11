import { Tong } from '../types';

export type TongState = 'kosong' | 'terisi' | 'siap_pickup';

/** Status tampilan diturunkan dari berat aktual agar selalu konsisten dengan data tong. */
export const getTongState = (tong: Pick<Tong, 'berat_kg'>): TongState => {
  if (tong.berat_kg <= 0) return 'kosong';
  if (tong.berat_kg >= 10) return 'siap_pickup';
  return 'terisi';
};

export const TONG_STATE_META: Record<TongState, { label: string; className: string }> = {
  kosong: { label: 'Kosong', className: 'bg-[#F2F7F4] text-[#52645A] border-[#2D6A4F]/10' },
  terisi: { label: 'Terisi', className: 'bg-[#FEF3C7] text-[#8A5A12] border-[#F4A261]/30' },
  siap_pickup: { label: 'Siap jemput', className: 'bg-[#D8F3DC] text-[#174630] border-[#2D6A4F]/15' },
};
