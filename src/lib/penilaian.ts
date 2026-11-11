/** Kriteria QC yang diperiksa mitra setelah kertas diterima di tempat sortir. */
export interface KriteriaQc {
  key: string;
  label: string;
  desc: string;
  icon: string;
}

export const KRITERIA_QC_MITRA: KriteriaQc[] = [
  {
    key: 'bersih',
    label: 'Kertas bersih',
    desc: 'Bebas kotoran, sisa makanan, dan cairan.',
    icon: 'cleaning_services',
  },
  {
    key: 'rapi',
    label: 'Terikat rapi',
    desc: 'Tumpukan terikat tali atau dilipat, tidak berserakan.',
    icon: 'link',
  },
  {
    key: 'kering',
    label: 'Kering & bebas minyak',
    desc: 'Tidak lembap dan tidak ada noda minyak.',
    icon: 'water_drop',
  },
  {
    key: 'klip',
    label: 'Bebas klip & lakban',
    desc: 'Klip kawat tebal dan lakban jilid sudah dibuang.',
    icon: 'content_cut',
  },
  {
    key: 'berat',
    label: 'Berat sesuai timbangan',
    desc: 'Berat di timbangan tong sesuai dengan hasil timbang.',
    icon: 'scale',
  },
];

export const LABEL_RATING: Record<number, string> = {
  1: 'Buruk',
  2: 'Kurang',
  3: 'Cukup',
  4: 'Baik',
  5: 'Sangat Baik',
};

/** Konversi key kriteria -> label yang disimpan di transaksi. */
export const qcKeyToLabel = (key: string) =>
  KRITERIA_QC_MITRA.find(item => item.key === key)?.label || key;

/** Konversi label tersimpan -> key kriteria (untuk isi ulang form). */
export const qcLabelToKey = (label: string) =>
  KRITERIA_QC_MITRA.find(item => item.label === label)?.key || label;

/** Daftar ikon bintang terisi (1..5) untuk nilai rating bulat. */
export const ratingStars = (rating?: number) =>
  Array.from({ length: 5 }, (_, index) => index < Math.round(rating ?? 0));
