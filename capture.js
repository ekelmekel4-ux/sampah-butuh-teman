import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureScreenshots() {
  console.log('Memulai browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport to mobile size (iPhone 13 PRO MAX size)
  await page.setViewport({ width: 428, height: 926, isMobile: true, hasTouch: true });

  const url = 'http://localhost:3001/';
  
  try {
    console.log('Membuka aplikasi...');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Screenshot 1: Onboarding / Gate
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(__dirname, 'Screenshot_1_Awal.png') });
    console.log('✅ Screenshot Awal berhasil disimpan');

    // Coba bypass onboarding dengan mengklik tombol (jika ada tombol dengan teks "Mulai" atau "Lanjut")
    const buttons = await page.$$('button');
    if (buttons.length > 0) {
      // Click the primary button to go to Auth Gate
      await buttons[buttons.length - 1].click();
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(__dirname, 'Screenshot_2_PilihPeran.png') });
      console.log('✅ Screenshot Pilih Peran berhasil disimpan');
    }

    // Paksa masuk sebagai Unit menggunakan URL hash atau localStorage
    await page.evaluate(() => {
       localStorage.setItem('sbt_seen_onboarding_v3', 'true');
       localStorage.setItem('sbt_logged_in_v3', 'true');
       localStorage.setItem('sbt_current_role_v3', 'unit');
       localStorage.setItem('sbt_current_user_v3', JSON.stringify({
         id: 'user-unit-ftd',
         nama: 'Dr. Ir. Hendra Saputra',
         email: 'penyalur@ft.univ.ac.id',
         role: 'unit',
         unit_id: 'unit-ftd'
       }));
    });
    
    console.log('Reloading halaman sebagai Unit...');
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise(r => setTimeout(r, 1500));
    
    // Screenshot 3: Dashboard Unit
    await page.screenshot({ path: path.join(__dirname, 'Screenshot_3_BerandaUnit.png') });
    console.log('✅ Screenshot Beranda Unit berhasil disimpan');

    // Pindah ke Dompet Unit dengan mengubah role/url
    const dompetIcons = await page.$$('span.material-symbols-outlined');
    for (const icon of dompetIcons) {
       const text = await page.evaluate(el => el.textContent, icon);
       if (text === 'payments') {
           await icon.click();
           break;
       }
    }
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(__dirname, 'Screenshot_4_DompetUnit.png') });
    console.log('✅ Screenshot Dompet Unit berhasil disimpan');

  } catch (err) {
    console.error('Terjadi kesalahan:', err);
  } finally {
    await browser.close();
    console.log('Browser ditutup. Selesai!');
  }
}

captureScreenshots();
