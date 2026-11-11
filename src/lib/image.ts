/**
 * Mengubah file gambar menjadi data URL JPEG yang ringkas.
 * Dipakai untuk foto profil unit/mitra agar tidak menyimpan file mentah
 * berukuran besar ke database.
 */
export const compressImage = (file: File, maxSize = 480): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas tidak tersedia.'));
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('Foto tidak bisa dibaca.'));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('Foto gagal dimuat.'));
    reader.readAsDataURL(file);
  });
