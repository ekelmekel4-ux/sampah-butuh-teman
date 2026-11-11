import puppeteer from 'puppeteer';

async function main() {
  console.log('🚀 Membuka Chrome untuk demonstrasi interaktif...');
  
  // Launch visible Chrome with a fresh profile
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--start-maximized',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const pages = await browser.pages();
  const page = pages[0] || (await browser.newPage());

  const baseUrl = 'http://localhost:3000';

  // Helper delay
  const delay = ms => new Promise(r => setTimeout(r, ms));

  try {
    // ══════════════════════════════════════════════════════
    // LANGKAH 1: Masuk sebagai UNIT KAMPUS (FTD)
    // ══════════════════════════════════════════════════════
    console.log('▶ [1/4] Membuka Beranda Unit Kampus...');
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });

    // Set localStorage as Unit Kampus
    await page.evaluate(() => {
      localStorage.setItem('sbt_seen_onboarding_v3', 'true');
      localStorage.setItem('sbt_logged_in_v3', 'true');
      localStorage.setItem('sbt_current_role_v3', 'unit');
      localStorage.setItem('sbt_current_user_v3', JSON.stringify({
        id: 'user-unit-ftd',
        nama: 'Dr. Ir. Hendra Saputra',
        email: 'penyalur@ft.univ.ac.id',
        role: 'unit',
        unit_id: 'unit-ftd',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      }));
    });
    await page.goto(baseUrl + '/unit/beranda', { waitUntil: 'networkidle2' });
    await delay(3500);

    // ══════════════════════════════════════════════════════
    // LANGKAH 2: Setor Kertas di Unit
    // ══════════════════════════════════════════════════════
    console.log('▶ [2/4] Simulasi Unit Menyetor 30 Kg Kertas...');
    await page.goto(baseUrl + '/unit/setor-kertas', { waitUntil: 'networkidle2' });
    await delay(3500);

    // ══════════════════════════════════════════════════════
    // LANGKAH 3: Masuk sebagai MITRA INDUSTRI (Pabrik)
    // ══════════════════════════════════════════════════════
    console.log('▶ [3/4] Beralih ke Mitra Industri (PT Mandiri Daur Lestari)...');
    await page.evaluate(() => {
      localStorage.setItem('sbt_current_role_v3', 'perusahaan');
      localStorage.setItem('sbt_current_user_v3', JSON.stringify({
        id: 'user-perusahaan-mdl',
        nama: 'PT Mandiri Daur Lestari',
        email: 'mitra@pt-mdl.com',
        role: 'perusahaan',
        perusahaan_id: 'perusahaan-mdl',
        kontak: '081987654321',
        avatar_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80'
      }));
    });
    await page.goto(baseUrl + '/perusahaan/dashboard', { waitUntil: 'networkidle2' });
    await delay(4000);

    // ══════════════════════════════════════════════════════
    // LANGKAH 4: Masuk ke ADMIN DASHBOARD (Pusat Komando)
    // ══════════════════════════════════════════════════════
    console.log('▶ [4/4] Membuka Pusat Komando Admin Dashboard UPJ...');
    await page.evaluate(() => {
      localStorage.setItem('sbt_current_role_v3', 'admin');
      localStorage.setItem('sbt_current_user_v3', JSON.stringify({
        id: 'user-admin-1',
        nama: 'Superadmin Kampus Hijau UPJ',
        email: 'admin.kampushijau@univ.ac.id',
        role: 'admin',
        kontak: '081122334455',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
      }));
    });
    await page.goto(baseUrl + '/admin/dashboard', { waitUntil: 'networkidle2' });
    
    // Scroll smoothly to let user see everything
    await delay(2000);
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await delay(2500);
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
    await delay(2500);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));

    console.log('🎉 Demonstrasi selesai! Browser dibiarkan tetap terbuka.');
  } catch (err) {
    console.error('Error saat demo:', err);
  }
}

main();

