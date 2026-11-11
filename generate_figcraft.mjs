import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const commands = [];
let nextId = 2;

function addFrame({ name, x, y, width = 390, height = 844, fills = ["#F7F8F5"] }) {
  const id = nextId++;
  commands.push({
    command: "frame.create",
    params: {
      name,
      x,
      y,
      width,
      height,
      props: { fills }
    }
  });
  return id;
}

function addRect(parentId, { name, x, y, width, height, cornerRadius = 0, fills = ["#FFFFFF"], strokes, strokeWeight }) {
  const id = nextId++;
  const props = { fills };
  if (cornerRadius > 0) props.cornerRadius = cornerRadius;
  if (strokes) props.strokes = strokes;
  if (strokeWeight) props.strokeWeight = strokeWeight;

  commands.push({
    command: "node.create",
    params: {
      type: "rectangle",
      name,
      parent: parentId,
      x,
      y,
      width,
      height,
      props
    }
  });
  return id;
}

function addText(parentId, { text, x, y, fontSize = 14, fills = ["#141E18"], fontFamily = "Plus Jakarta Sans" }) {
  const id = nextId++;
  commands.push({
    command: "text.create",
    params: {
      parent: parentId,
      x,
      y,
      text,
      props: {
        fontSize,
        fills,
        fontFamily
      }
    }
  });
  return id;
}

function addBottomNav(frameId, activeTab = 'beranda', tabs = [
  { key: 'beranda', label: 'Beranda' },
  { key: 'status', label: 'Status Tong' },
  { key: 'peringkat', label: 'Peringkat' }
]) {
  addRect(frameId, {
    name: "Bottom Navigation Bar",
    x: 0,
    y: 770,
    width: 390,
    height: 74,
    fills: ["#FFFFFF"],
    strokes: ["#E0E5E2"],
    strokeWeight: 1
  });

  const tabWidth = 390 / tabs.length;
  tabs.forEach((tab, index) => {
    const tabX = index * tabWidth;
    const isActive = tab.key === activeTab;
    if (isActive) {
      addRect(frameId, {
        name: `Active Indicator - ${tab.label}`,
        x: tabX + (tabWidth - 64) / 2,
        y: 782,
        width: 64,
        height: 32,
        cornerRadius: 16,
        fills: ["#E8F5EE"]
      });
      addText(frameId, {
        text: `● ${tab.label}`,
        x: tabX + (tabWidth - 60) / 2,
        y: 791,
        fontSize: 12,
        fills: ["#176B4D"]
      });
    } else {
      addText(frameId, {
        text: tab.label,
        x: tabX + (tabWidth - 50) / 2,
        y: 791,
        fontSize: 12,
        fills: ["#8A9E94"]
      });
    }
  });
}

// ══════════════════════════════════════════════════════════════
// BARIS 1 (Y: 0): ONBOARDING & AUTENTIKASI (6 LAYAR)
// ══════════════════════════════════════════════════════════════

// 1. Splash Screen
const s1 = addFrame({ name: "01 - Splash Screen", x: 0, y: 0, fills: ["#176B4D"] });
addRect(s1, { name: "Logo Circle", x: 145, y: 300, width: 100, height: 100, cornerRadius: 50, fills: ["#FFFFFF"] });
addText(s1, { text: "🌱", x: 175, y: 330, fontSize: 40, fills: ["#176B4D"] });
addText(s1, { text: "Sampah Butuh Teman", x: 92, y: 430, fontSize: 22, fills: ["#FFFFFF"] });
addText(s1, { text: "Sampah yang menemukan temannya.", x: 88, y: 462, fontSize: 13, fills: ["#A4F3CC"] });
addText(s1, { text: "Platform Sirkular Kertas Kampus UPJ", x: 98, y: 730, fontSize: 11, fills: ["#89D6B1"] });

// 2. Onboarding 1
const s2 = addFrame({ name: "02 - Onboarding 1: Siklus Sirkular", x: 420, y: 0 });
addRect(s2, { name: "Illustration Box", x: 20, y: 100, width: 350, height: 320, cornerRadius: 20, fills: ["#E8F5EE"], strokes: ["#C8D5CC"], strokeWeight: 1 });
addText(s2, { text: "📦 ⇄ 🌱", x: 140, y: 230, fontSize: 36, fills: ["#176B4D"] });
addText(s2, { text: "Model Pre-Order Bebas Mismatch", x: 20, y: 460, fontSize: 20, fills: ["#141E18"] });
addText(s2, { text: "Kertas kampus dikumpulkan terstruktur per unit.", x: 20, y: 494, fontSize: 13, fills: ["#4A5C52"] });
addText(s2, { text: "Mitra industri hanya menjemput saat kuota tercapai.", x: 20, y: 516, fontSize: 13, fills: ["#4A5C52"] });
addRect(s2, { name: "Dots Indicator", x: 175, y: 680, width: 40, height: 8, cornerRadius: 4, fills: ["#176B4D"] });
addRect(s2, { name: "Next Btn", x: 20, y: 720, width: 350, height: 50, cornerRadius: 12, fills: ["#176B4D"] });
addText(s2, { text: "Lanjutkan →", x: 156, y: 736, fontSize: 14, fills: ["#FFFFFF"] });

// 3. Onboarding 2
const s3 = addFrame({ name: "03 - Onboarding 2: Tong Bernomor", x: 840, y: 0 });
addRect(s3, { name: "Illustration Box", x: 20, y: 100, width: 350, height: 320, cornerRadius: 20, fills: ["#FEF3C7"], strokes: ["#FDE68A"], strokeWeight: 1 });
addText(s3, { text: "🏛️ ⇄ 🚛", x: 140, y: 230, fontSize: 36, fills: ["#D97706"] });
addText(s3, { text: "Alokasi Tong Bernomor Per Unit", x: 20, y: 460, fontSize: 20, fills: ["#141E18"] });
addText(s3, { text: "Tiap fakultas (FTD, FEB, dll) memiliki tong khusus.", x: 20, y: 494, fontSize: 13, fills: ["#4A5C52"] });
addText(s3, { text: "Terpantau sensor kapasitas dan jadwal angkut pasti.", x: 20, y: 516, fontSize: 13, fills: ["#4A5C52"] });
addRect(s3, { name: "Next Btn", x: 20, y: 720, width: 350, height: 50, cornerRadius: 12, fills: ["#176B4D"] });
addText(s3, { text: "Lanjutkan →", x: 156, y: 736, fontSize: 14, fills: ["#FFFFFF"] });

// 4. Onboarding 3
const s4 = addFrame({ name: "04 - Onboarding 3: Kas & Poin", x: 1260, y: 0 });
addRect(s4, { name: "Illustration Box", x: 20, y: 100, width: 350, height: 320, cornerRadius: 20, fills: ["#E8F5EE"], strokes: ["#C8D5CC"], strokeWeight: 1 });
addText(s4, { text: "💰 + 🏅", x: 145, y: 230, fontSize: 36, fills: ["#176B4D"] });
addText(s4, { text: "Kas Masuk Otomatis & Eco-Points", x: 20, y: 460, fontSize: 20, fills: ["#141E18"] });
addText(s4, { text: "Hasil penimbangan kertas langsung cair ke kas unit.", x: 20, y: 494, fontSize: 13, fills: ["#4A5C52"] });
addText(s4, { text: "Dapatkan juga poin sirkular untuk ditukar reward.", x: 20, y: 516, fontSize: 13, fills: ["#4A5C52"] });
addRect(s4, { name: "Start Btn", x: 20, y: 720, width: 350, height: 50, cornerRadius: 12, fills: ["#176B4D"] });
addText(s4, { text: "Mulai Sekarang →", x: 140, y: 736, fontSize: 14, fills: ["#FFFFFF"] });

// 5. Auth Gate (Pilih Peran)
const s5 = addFrame({ name: "05 - Pilih Peran (Auth Gate)", x: 1680, y: 0 });
addText(s5, { text: "Selamat Datang di SBT", x: 20, y: 50, fontSize: 22, fills: ["#141E18"] });
addText(s5, { text: "Pilih peran Anda untuk melanjutkan:", x: 20, y: 78, fontSize: 13, fills: ["#8A9E94"] });

// Role 1
addRect(s5, { name: "Role Penyalur Card", x: 20, y: 120, width: 350, height: 110, cornerRadius: 16, fills: ["#FFFFFF"], strokes: ["#176B4D"], strokeWeight: 2 });
addText(s5, { text: "🏫 Unit Kampus (Penyalur)", x: 36, y: 140, fontSize: 15, fills: ["#176B4D"] });
addText(s5, { text: "Fakultas, prodi, dan unit kerja UPJ.", x: 36, y: 164, fontSize: 12, fills: ["#4A5C52"] });
addText(s5, { text: "Setor kertas, pantau tong, & terima kas.", x: 36, y: 184, fontSize: 11, fills: ["#8A9E94"] });

// Role 2
addRect(s5, { name: "Role Mitra Card", x: 20, y: 246, width: 350, height: 110, cornerRadius: 16, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s5, { text: "🏢 Mitra Industri (Penerima)", x: 36, y: 266, fontSize: 15, fills: ["#141E18"] });
addText(s5, { text: "Pabrik, vendor daur ulang & pengepul.", x: 36, y: 290, fontSize: 12, fills: ["#4A5C52"] });
addText(s5, { text: "Ambil pasokan kertas terverifikasi.", x: 36, y: 310, fontSize: 11, fills: ["#8A9E94"] });

// Role 3
addRect(s5, { name: "Role Admin Card", x: 20, y: 372, width: 350, height: 110, cornerRadius: 16, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s5, { text: "🛡️ Pengelola Kampus (Admin)", x: 36, y: 392, fontSize: 15, fills: ["#141E18"] });
addText(s5, { text: "Tim pengelola lingkungan & logistik UPJ.", x: 36, y: 416, fontSize: 12, fills: ["#4A5C52"] });
addText(s5, { text: "Pusat kendali, verifikasi, & analitik.", x: 36, y: 436, fontSize: 11, fills: ["#8A9E94"] });

// 6. Layar Login
const s6 = addFrame({ name: "06 - Layar Login Akun", x: 2100, y: 0 });
addText(s6, { text: "Masuk ke Akun", x: 20, y: 60, fontSize: 22, fills: ["#141E18"] });
addText(s6, { text: "Gunakan email resmi institusi atau akun mitra", x: 20, y: 88, fontSize: 12, fills: ["#8A9E94"] });

addText(s6, { text: "EMAIL", x: 20, y: 140, fontSize: 10, fills: ["#8A9E94"] });
addRect(s6, { name: "Input Email", x: 20, y: 156, width: 350, height: 46, cornerRadius: 10, fills: ["#EEEEF0"] });
addText(s6, { text: "penyalur@ft.univ.ac.id", x: 34, y: 171, fontSize: 13, fills: ["#141E18"] });

addText(s6, { text: "PASSWORD", x: 20, y: 220, fontSize: 10, fills: ["#8A9E94"] });
addRect(s6, { name: "Input Pass", x: 20, y: 236, width: 350, height: 46, cornerRadius: 10, fills: ["#EEEEF0"] });
addText(s6, { text: "••••••••••••", x: 34, y: 251, fontSize: 13, fills: ["#141E18"] });

addRect(s6, { name: "Btn Login", x: 20, y: 304, width: 350, height: 50, cornerRadius: 12, fills: ["#176B4D"] });
addText(s6, { text: "Masuk Sekarang →", x: 134, y: 320, fontSize: 14, fills: ["#FFFFFF"] });

// Demo Switcher Box
addRect(s6, { name: "Demo Box", x: 20, y: 420, width: 350, height: 160, cornerRadius: 14, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s6, { text: "AKUN DEMO CEPAT (SATU KLIK):", x: 34, y: 436, fontSize: 10, fills: ["#8A9E94"] });
addRect(s6, { name: "Btn Demo Unit", x: 34, y: 456, width: 322, height: 32, cornerRadius: 8, fills: ["#E8F5EE"] });
addText(s6, { text: "Masuk sebagai FTD UPJ (Unit)", x: 92, y: 465, fontSize: 11, fills: ["#176B4D"] });
addRect(s6, { name: "Btn Demo Mitra", x: 34, y: 496, width: 322, height: 32, cornerRadius: 8, fills: ["#EEEEF0"] });
addText(s6, { text: "Masuk sebagai PT Daur Lestari (Mitra)", x: 74, y: 505, fontSize: 11, fills: ["#141E18"] });
addRect(s6, { name: "Btn Demo Admin", x: 34, y: 536, width: 322, height: 32, cornerRadius: 8, fills: ["#EEEEF0"] });
addText(s6, { text: "Masuk sebagai Admin Pengelola UPJ", x: 82, y: 545, fontSize: 11, fills: ["#141E18"] });


// ══════════════════════════════════════════════════════════════
// BARIS 2 (Y: 920): UNIT KAMPUS & LEADERBOARD (5 LAYAR)
// ══════════════════════════════════════════════════════════════

// 7. Beranda Unit
const s7 = addFrame({ name: "07 - Unit Beranda", x: 0, y: 920 });
addRect(s7, { name: "Header Background", x: 0, y: 0, width: 390, height: 70, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addRect(s7, { name: "Avatar FTD", x: 20, y: 18, width: 36, height: 36, cornerRadius: 18, fills: ["#176B4D"] });
addText(s7, { text: "FTD", x: 28, y: 28, fontSize: 13, fills: ["#FFFFFF"] });
addText(s7, { text: "Fakultas Teknik & Desain", x: 66, y: 19, fontSize: 13, fills: ["#141E18"] });
addText(s7, { text: "Universitas Pembangunan Jaya", x: 66, y: 36, fontSize: 11, fills: ["#8A9E94"] });

addRect(s7, { name: "Saldo Card Container", x: 20, y: 86, width: 350, height: 96, cornerRadius: 16, fills: ["#176B4D"] });
addText(s7, { text: "SALDO KAS DAUR ULANG", x: 36, y: 104, fontSize: 10, fills: ["#A4F3CC"] });
addText(s7, { text: "Rp 450.000", x: 36, y: 122, fontSize: 24, fills: ["#FFFFFF"] });
addText(s7, { text: "120 Eco-Points", x: 245, y: 127, fontSize: 13, fills: ["#D8F3DC"] });

addRect(s7, { name: "Mascot Card", x: 20, y: 196, width: 350, height: 106, cornerRadius: 16, fills: ["#E8F5EE"], strokes: ["#C8D5CC"], strokeWeight: 1 });
addText(s7, { text: "🌱", x: 48, y: 228, fontSize: 20, fills: ["#FFFFFF"] });
addText(s7, { text: "Halo Teman Sirkular FTD!", x: 96, y: 216, fontSize: 14, fills: ["#176B4D"] });
addText(s7, { text: "Pilah rapi tugas & maket sebelum tong penuh!", x: 96, y: 240, fontSize: 11, fills: ["#4A5C52"] });

addRect(s7, { name: "Status Tong Card", x: 20, y: 316, width: 350, height: 160, cornerRadius: 16, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s7, { text: "Tong Gedung B Lt. 2 (Studio Desain)", x: 36, y: 340, fontSize: 14, fills: ["#141E18"] });
addRect(s7, { name: "Badge Waspada", x: 270, y: 336, width: 85, height: 22, cornerRadius: 11, fills: ["#FEF3C7"] });
addText(s7, { text: "Waspada 85%", x: 278, y: 341, fontSize: 10, fills: ["#D97706"] });
addRect(s7, { name: "Progress Track", x: 36, y: 374, width: 318, height: 10, cornerRadius: 5, fills: ["#EEEEF0"] });
addRect(s7, { name: "Progress Fill", x: 36, y: 374, width: 270, height: 10, cornerRadius: 5, fills: ["#D97706"] });
addText(s7, { text: "Kapasitas terisi: 42.5 / 50 Kg (Sisa Kuota: 7.5 Kg)", x: 36, y: 396, fontSize: 11, fills: ["#4A5C52"] });

addRect(s7, { name: "CTA Setor Kertas", x: 20, y: 494, width: 350, height: 52, cornerRadius: 12, fills: ["#176B4D"] });
addText(s7, { text: "Setor Kertas Sekarang", x: 124, y: 511, fontSize: 14, fills: ["#FFFFFF"] });
addBottomNav(s7, 'beranda');

// 8. Unit Setor Kertas
const s8 = addFrame({ name: "08 - Unit Setor Kertas", x: 420, y: 920 });
addRect(s8, { name: "Nav Header", x: 0, y: 0, width: 390, height: 60, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s8, { text: "← Setor Sampah Kertas", x: 20, y: 22, fontSize: 15, fills: ["#141E18"] });

addRect(s8, { name: "Tong Box", x: 20, y: 80, width: 350, height: 50, cornerRadius: 10, fills: ["#FFFFFF"], strokes: ["#C8D5CC"], strokeWeight: 1 });
addText(s8, { text: "Tong Gedung B Lt. 2 (Studio Arsitektur)", x: 34, y: 96, fontSize: 12, fills: ["#141E18"] });

addRect(s8, { name: "Kat HVS Selected", x: 20, y: 150, width: 170, height: 70, cornerRadius: 12, fills: ["#E8F5EE"], strokes: ["#176B4D"], strokeWeight: 2 });
addText(s8, { text: "HVS Putih ✓ (Rp 2.000)", x: 32, y: 174, fontSize: 12, fills: ["#176B4D"] });

addRect(s8, { name: "Kat Kardus", x: 200, y: 150, width: 170, height: 70, cornerRadius: 12, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s8, { text: "Kardus (Rp 1.500)", x: 212, y: 174, fontSize: 12, fills: ["#141E18"] });

addRect(s8, { name: "Stepper Box", x: 20, y: 240, width: 350, height: 80, cornerRadius: 12, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s8, { text: "12.5 Kg", x: 160, y: 270, fontSize: 24, fills: ["#176B4D"] });

addRect(s8, { name: "Kalkulator Saldo Card", x: 20, y: 340, width: 350, height: 80, cornerRadius: 12, fills: ["#E8F5EE"], strokes: ["#C8D5CC"], strokeWeight: 1 });
addText(s8, { text: "Kas Masuk: + Rp 25.000 (+12 Pts)", x: 34, y: 372, fontSize: 16, fills: ["#176B4D"] });

addRect(s8, { name: "Submit Setor", x: 20, y: 440, width: 350, height: 50, cornerRadius: 12, fills: ["#176B4D"] });
addText(s8, { text: "Konfirmasi & Masukkan ke Tong →", x: 92, y: 456, fontSize: 13, fills: ["#FFFFFF"] });

// 9. Unit Status Tong
const s9 = addFrame({ name: "09 - Unit Status Tong", x: 840, y: 920 });
addRect(s9, { name: "Header Nav", x: 0, y: 0, width: 390, height: 60, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s9, { text: "Status Tong Kampus", x: 20, y: 22, fontSize: 16, fills: ["#141E18"] });

const listTong = [
  { n: "Tong FTD Gedung B Lt. 2", p: 92, s: "Kritis 92%", c: "#C0392B" },
  { n: "Tong FEB Gedung A Lt. 1", p: 78, s: "Waspada 78%", c: "#D97706" },
  { n: "Tong Perpustakaan Lt. 2", p: 45, s: "Aman 45%", c: "#1B7A4E" },
  { n: "Tong Rektorat UPJ Lt. 3", p: 30, s: "Aman 30%", c: "#1B7A4E" }
];
listTong.forEach((t, i) => {
  const cy = 80 + i * 110;
  addRect(s9, { name: t.n, x: 20, y: cy, width: 350, height: 96, cornerRadius: 14, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
  addText(s9, { text: t.n, x: 36, y: cy + 18, fontSize: 13, fills: ["#141E18"] });
  addText(s9, { text: t.s, x: 280, y: cy + 18, fontSize: 11, fills: [t.c] });
  addRect(s9, { name: "Bar Fill", x: 36, y: cy + 48, width: Math.round(318 * (t.p / 100)), height: 8, cornerRadius: 4, fills: [t.c] });
});
addBottomNav(s9, 'status');

// 10. Unit Dompet & Poin
const s10 = addFrame({ name: "10 - Unit Dompet & Poin", x: 1260, y: 920 });
addRect(s10, { name: "Header Nav", x: 0, y: 0, width: 390, height: 60, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s10, { text: "Dompet Kas & Poin", x: 20, y: 22, fontSize: 16, fills: ["#141E18"] });

addRect(s10, { name: "Kas Box", x: 20, y: 80, width: 350, height: 110, cornerRadius: 16, fills: ["#176B4D"] });
addText(s10, { text: "SALDO KAS TERSEDIA", x: 36, y: 98, fontSize: 10, fills: ["#A4F3CC"] });
addText(s10, { text: "Rp 450.000", x: 36, y: 120, fontSize: 26, fills: ["#FFFFFF"] });
addRect(s10, { name: "Btn Tarik", x: 36, y: 154, width: 140, height: 26, cornerRadius: 6, fills: ["#FFFFFF"] });
addText(s10, { text: "Tarik ke Rek BNI", x: 54, y: 160, fontSize: 11, fills: ["#176B4D"] });

addText(s10, { text: "RIWAYAT PENJUALAN TERAKHIR", x: 20, y: 216, fontSize: 10, fills: ["#8A9E94"] });
const mutasi = [
  { d: "Setor 12.5 kg HVS (PT Daur Lestari)", n: "+Rp 25.000", t: "24 Okt 2024" },
  { d: "Setor 20 kg Kardus (CV Mandiri)", n: "+Rp 30.000", t: "20 Okt 2024" },
  { d: "Pencairan ke Kas FTD BNI", n: "-Rp 300.000", t: "15 Okt 2024" }
];
mutasi.forEach((m, idx) => {
  const my = 236 + idx * 64;
  addRect(s10, { name: `Mutasi ${idx}`, x: 20, y: my, width: 350, height: 54, cornerRadius: 10, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
  addText(s10, { text: m.d, x: 34, y: my + 14, fontSize: 11, fills: ["#141E18"] });
  addText(s10, { text: m.t, x: 34, y: my + 32, fontSize: 9, fills: ["#8A9E94"] });
  addText(s10, { text: m.n, x: 270, y: my + 18, fontSize: 12, fills: [m.n.startsWith('+') ? "#176B4D" : "#C0392B"] });
});
addBottomNav(s10, 'beranda');

// 11. Leaderboard
const s11 = addFrame({ name: "11 - Papan Peringkat Kampus", x: 1680, y: 920 });
addRect(s11, { name: "Header Nav", x: 0, y: 0, width: 390, height: 60, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s11, { text: "Papan Peringkat Sirkular", x: 20, y: 22, fontSize: 16, fills: ["#141E18"] });

addRect(s11, { name: "Podium Container", x: 20, y: 80, width: 350, height: 160, cornerRadius: 16, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s11, { text: "👑 🥇 FIKOM (480 Kg)", x: 120, y: 110, fontSize: 14, fills: ["#D97706"] });
addText(s11, { text: "🥈 FTD UPJ (415 Kg) - Unit Anda", x: 80, y: 150, fontSize: 13, fills: ["#176B4D"] });
addText(s11, { text: "🥉 FEB UPJ (340 Kg)", x: 125, y: 190, fontSize: 13, fills: ["#8B6045"] });

addRect(s11, { name: "Eco Impact Card", x: 20, y: 260, width: 350, height: 70, cornerRadius: 14, fills: ["#176B4D"] });
addText(s11, { text: "1.850 Kg Terkumpul = 31 Pohon Terselamatkan", x: 44, y: 290, fontSize: 13, fills: ["#FFFFFF"] });
addBottomNav(s11, 'peringkat');


// ══════════════════════════════════════════════════════════════
// BARIS 3 (Y: 1840): MITRA INDUSTRI / PERUSAHAAN (4 LAYAR)
// ══════════════════════════════════════════════════════════════

// 12. Pasokan Industri
const s12 = addFrame({ name: "12 - Pasokan Mitra Industri", x: 0, y: 1840 });
addRect(s12, { name: "Header Nav", x: 0, y: 0, width: 390, height: 60, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s12, { text: "PT Daur Kertas Lestari", x: 20, y: 22, fontSize: 15, fills: ["#141E18"] });

addRect(s12, { name: "Banner Kuota", x: 20, y: 76, width: 350, height: 90, cornerRadius: 14, fills: ["#176B4D"] });
addText(s12, { text: "850 Kg Pasokan Siap Jemput di UPJ", x: 36, y: 110, fontSize: 18, fills: ["#FFFFFF"] });
addText(s12, { text: "Nilai: Rp 1.375.000", x: 36, y: 136, fontSize: 12, fills: ["#A4F3CC"] });

addRect(s12, { name: "Card HVS", x: 20, y: 180, width: 350, height: 100, cornerRadius: 12, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s12, { text: "Kertas HVS & Arsip: 320 Kg", x: 36, y: 200, fontSize: 14, fills: ["#141E18"] });
addText(s12, { text: "Rp 640.000 • FTD Gedung B", x: 36, y: 224, fontSize: 12, fills: ["#176B4D"] });
addRect(s12, { name: "Btn Ambil", x: 36, y: 246, width: 318, height: 26, cornerRadius: 6, fills: ["#176B4D"] });
addText(s12, { text: "Jadwalkan Penjemputan Truk →", x: 108, y: 252, fontSize: 11, fills: ["#FFFFFF"] });
addBottomNav(s12, 'beranda', [
  { key: 'beranda', label: 'Pasokan' },
  { key: 'kebutuhan', label: 'Kebutuhan' },
  { key: 'riwayat', label: 'Riwayat' }
]);

// 13. Matching & Jadwal Armada
const s13 = addFrame({ name: "13 - Jadwal Armada Truk", x: 420, y: 1840 });
addRect(s13, { name: "Header Nav", x: 0, y: 0, width: 390, height: 60, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s13, { text: "← Detail Penjemputan", x: 20, y: 22, fontSize: 15, fills: ["#141E18"] });

addRect(s13, { name: "Detail Box", x: 20, y: 80, width: 350, height: 170, cornerRadius: 14, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s13, { text: "STATUS: MENUNGGU PENJEMPUTAN", x: 36, y: 98, fontSize: 10, fills: ["#D97706"] });
addText(s13, { text: "Kamis, 24 Okt 2024 • 14:30 WIB", x: 36, y: 120, fontSize: 14, fills: ["#141E18"] });
addText(s13, { text: "Armada: B 9821 PQL (Truk 6-Roda)", x: 36, y: 146, fontSize: 12, fills: ["#4A5C52"] });
addText(s13, { text: "Driver: Joko Susilo (0812-9876-5432)", x: 36, y: 168, fontSize: 12, fills: ["#4A5C52"] });
addText(s13, { text: "Lokasi: Gerbang Barat Kampus UPJ", x: 36, y: 190, fontSize: 12, fills: ["#176B4D"] });

// 14. Buat Permintaan Pasokan Pabrik
const s14 = addFrame({ name: "14 - Permintaan Pabrik Baru", x: 840, y: 1840 });
addRect(s14, { name: "Header Nav", x: 0, y: 0, width: 390, height: 60, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s14, { text: "Posting Kebutuhan Kertas", x: 20, y: 22, fontSize: 15, fills: ["#141E18"] });

addText(s14, { text: "TARGET TONASE BULAN INI", x: 20, y: 80, fontSize: 10, fills: ["#8A9E94"] });
addRect(s14, { name: "Input Tonase", x: 20, y: 96, width: 350, height: 46, cornerRadius: 10, fills: ["#EEEEF0"] });
addText(s14, { text: "500 Kg Kertas HVS Bersih", x: 34, y: 111, fontSize: 13, fills: ["#141E18"] });

addRect(s14, { name: "Btn Buat", x: 20, y: 160, width: 350, height: 48, cornerRadius: 12, fills: ["#176B4D"] });
addText(s14, { text: "Publikasikan ke Kampus UPJ →", x: 100, y: 175, fontSize: 13, fills: ["#FFFFFF"] });

// 15. Riwayat & Nota Transaksi
const s15 = addFrame({ name: "15 - Riwayat & Nota Industri", x: 1260, y: 1840 });
addRect(s15, { name: "Header Nav", x: 0, y: 0, width: 390, height: 60, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s15, { text: "Riwayat Serah Terima", x: 20, y: 22, fontSize: 16, fills: ["#141E18"] });

const riwayatPabrik = [
  { t: "Surat Jalan #SBT-2024-001", k: "320 Kg HVS (FTD)", s: "Selesai Ditimbang", n: "Rp 640.000" },
  { t: "Surat Jalan #SBT-2024-002", k: "410 Kg Kardus (FEB)", s: "Selesai Ditimbang", n: "Rp 615.000" }
];
riwayatPabrik.forEach((r, idx) => {
  const ry = 80 + idx * 84;
  addRect(s15, { name: r.t, x: 20, y: ry, width: 350, height: 72, cornerRadius: 12, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
  addText(s15, { text: r.t, x: 34, y: ry + 16, fontSize: 12, fills: ["#141E18"] });
  addText(s15, { text: r.k, x: 34, y: ry + 36, fontSize: 11, fills: ["#4A5C52"] });
  addText(s15, { text: r.n, x: 265, y: ry + 26, fontSize: 13, fills: ["#176B4D"] });
});


// ══════════════════════════════════════════════════════════════
// BARIS 4 (Y: 2760): ADMIN PENGELOLA SIRKULAR KAMPUS (3 LAYAR)
// ══════════════════════════════════════════════════════════════

// 16. Admin Kendali Utama
const s16 = addFrame({ name: "16 - Admin Dashboard Kendali", x: 0, y: 2760 });
addRect(s16, { name: "Header Nav", x: 0, y: 0, width: 390, height: 60, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s16, { text: "Pusat Kendali Sirkular", x: 20, y: 22, fontSize: 16, fills: ["#141E18"] });
addText(s16, { text: "Admin UPJ", x: 310, y: 24, fontSize: 11, fills: ["#C0392B"] });

const kpis = [
  { label: "TOTAL TERKUMPUL", val: "1.850 Kg", col: "#176B4D" },
  { label: "NILAI TRANSAKSI", val: "Rp 3.25 Jt", col: "#D97706" },
  { label: "TONG KRITIS", val: "2 Tong", col: "#C0392B" },
  { label: "MITRA PENGOLAH", val: "4 Industri", col: "#176B4D" }
];
kpis.forEach((k, i) => {
  const gx = 20 + (i % 2) * 180;
  const gy = 76 + Math.floor(i / 2) * 78;
  addRect(s16, { name: `KPI ${k.label}`, x: gx, y: gy, width: 170, height: 68, cornerRadius: 12, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
  addText(s16, { text: k.label, x: gx + 14, y: gy + 12, fontSize: 9, fills: ["#8A9E94"] });
  addText(s16, { text: k.val, x: gx + 14, y: gy + 32, fontSize: 16, fills: [k.col] });
});

addRect(s16, { name: "Verifikasi Card", x: 20, y: 250, width: 350, height: 110, cornerRadius: 14, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s16, { text: "Truk PT Daur Lestari (B 9821 PQL)", x: 36, y: 268, fontSize: 13, fills: ["#141E18"] });
addText(s16, { text: "Muatan 320 Kg HVS siap diverifikasi", x: 36, y: 288, fontSize: 11, fills: ["#4A5C52"] });
addRect(s16, { name: "Btn Verif", x: 36, y: 312, width: 318, height: 30, cornerRadius: 6, fills: ["#176B4D"] });
addText(s16, { text: "Verifikasi Timbangan Digital ✓", x: 110, y: 320, fontSize: 11, fills: ["#FFFFFF"] });
addBottomNav(s16, 'beranda', [
  { key: 'beranda', label: 'Dashboard' },
  { key: 'unit', label: 'Unit & Tong' },
  { key: 'laporan', label: 'Laporan' }
]);

// 17. Admin Kelola Unit & Tong
const s17 = addFrame({ name: "17 - Admin Kelola Unit & Tong", x: 420, y: 2760 });
addRect(s17, { name: "Header Nav", x: 0, y: 0, width: 390, height: 60, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s17, { text: "Kelola Unit & Tong UPJ", x: 20, y: 22, fontSize: 16, fills: ["#141E18"] });

const unitAdmin = [
  { u: "Fakultas Teknik & Desain (FTD)", t: "2 Tong Aktif", k: "Kas: Rp 450.000" },
  { u: "Fakultas Ekonomi & Bisnis (FEB)", t: "2 Tong Aktif", k: "Kas: Rp 320.000" },
  { u: "Biro Administrasi Rektorat", t: "1 Tong Aktif", k: "Kas: Rp 180.000" },
  { u: "Perpustakaan Pusat", t: "1 Tong Aktif", k: "Kas: Rp 210.000" }
];
unitAdmin.forEach((u, i) => {
  const uy = 80 + i * 80;
  addRect(s17, { name: u.u, x: 20, y: uy, width: 350, height: 68, cornerRadius: 12, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
  addText(s17, { text: u.u, x: 34, y: uy + 14, fontSize: 12, fills: ["#141E18"] });
  addText(s17, { text: `${u.t} • ${u.k}`, x: 34, y: uy + 36, fontSize: 10, fills: ["#8A9E94"] });
});

// 18. Admin Laporan & Flag Masalah
const s18 = addFrame({ name: "18 - Admin Laporan & Flag", x: 840, y: 2760 });
addRect(s18, { name: "Header Nav", x: 0, y: 0, width: 390, height: 60, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s18, { text: "Laporan & Flag Kendala", x: 20, y: 22, fontSize: 16, fills: ["#141E18"] });

const laporans = [
  { j: "Tong FTD Gedung B Penuh Meluap", u: "Kapasitas 92% butuh angkut", s: "Prioritas Tinggi", c: "#C0392B" },
  { j: "Tutup Tong Perpustakaan Macet", u: "Sensor macet di 45%", s: "Sedang Ditangani", c: "#D97706" },
  { j: "Ada Plastik di Tong FEB Lt. 1", u: "Telah dibersihkan petugas", s: "Terselesaikan", c: "#1B7A4E" }
];
laporans.forEach((lp, i) => {
  const ly = 80 + i * 86;
  addRect(s18, { name: lp.j, x: 20, y: ly, width: 350, height: 74, cornerRadius: 12, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
  addText(s18, { text: lp.j, x: 34, y: ly + 14, fontSize: 12, fills: ["#141E18"] });
  addText(s18, { text: lp.u, x: 34, y: ly + 34, fontSize: 10, fills: ["#8A9E94"] });
  addText(s18, { text: lp.s, x: 34, y: ly + 52, fontSize: 10, fills: [lp.c] });
});


// ══════════════════════════════════════════════════════════════
// BARIS 5: MASTER DESKTOP DASHBOARD (1440 × 960)
// Terinspirasi dari referensi Finora & kaidah design-taste-frontend
// ══════════════════════════════════════════════════════════════
const s19 = addFrame({ name: "19 - Master Desktop Dashboard (Web)", x: 2600, y: 0, width: 1440, height: 960 });

// ── Sidebar Navigasi Kiri (Width: 240) ──
addRect(s19, { name: "Sidebar Background", x: 0, y: 0, width: 240, height: 960, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });

// Logo & Brand
addRect(s19, { name: "Logo Circle", x: 24, y: 24, width: 32, height: 32, cornerRadius: 16, fills: ["#176B4D"] });
addText(s19, { text: "🌱", x: 31, y: 32, fontSize: 16, fills: ["#FFFFFF"] });
addText(s19, { text: "Sampah Butuh Teman", x: 64, y: 24, fontSize: 14, fills: ["#141E18"] });
addText(s19, { text: "Sirkular Kampus UPJ", x: 64, y: 40, fontSize: 10, fills: ["#8A9E94"] });

// Nav Items
const navItems = [
  { label: "Dashboard", active: true },
  { label: "Katalog Pasokan", active: false },
  { label: "Monitoring Tong", active: false },
  { label: "Verifikasi Armada", active: false },
  { label: "Papan Peringkat", active: false },
  { label: "Dompet & Kas Unit", active: false },
  { label: "Laporan Kendala", active: false },
  { label: "Pengaturan Sistem", active: false }
];

navItems.forEach((item, idx) => {
  const ny = 90 + idx * 46;
  if (item.active) {
    addRect(s19, { name: "Active Nav Pill", x: 16, y: ny, width: 208, height: 38, cornerRadius: 10, fills: ["#E8F5EE"] });
    addText(s19, { text: `● ${item.label}`, x: 32, y: ny + 11, fontSize: 13, fills: ["#176B4D"] });
  } else {
    addText(s19, { text: item.label, x: 32, y: ny + 11, fontSize: 13, fills: ["#4A5C52"] });
  }
});

// ── Top Header Bar ──
// Search bar
addRect(s19, { name: "Search Bar", x: 270, y: 20, width: 440, height: 40, cornerRadius: 20, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s19, { text: "🔍 Cari unit fakultas, nomor tong, atau armada...", x: 290, y: 32, fontSize: 12, fills: ["#8A9E94"] });

// Right controls
addRect(s19, { name: "Date Filter", x: 960, y: 22, width: 170, height: 36, cornerRadius: 18, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s19, { text: "📅 Rabu, 4 Nov 2026 ▾", x: 976, y: 32, fontSize: 11, fills: ["#4A5C52"] });

addRect(s19, { name: "Notif Btn", x: 1145, y: 22, width: 36, height: 36, cornerRadius: 18, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s19, { text: "🔔", x: 1155, y: 31, fontSize: 14, fills: ["#4A5C52"] });

addRect(s19, { name: "Profile Pill", x: 1195, y: 22, width: 215, height: 36, cornerRadius: 18, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addRect(s19, { name: "Profile Avatar", x: 1200, y: 26, width: 28, height: 28, cornerRadius: 14, fills: ["#176B4D"] });
addText(s19, { text: "HS", x: 1206, y: 33, fontSize: 11, fills: ["#FFFFFF"] });
addText(s19, { text: "Dr. Hendra (Admin UPJ) ▾", x: 1236, y: 32, fontSize: 11, fills: ["#141E18"] });

// ── Hero Greeting ──
addText(s19, { text: "Selamat Pagi, Tim Sirkular UPJ! ☀️", x: 270, y: 80, fontSize: 22, fills: ["#141E18"] });
addText(s19, { text: "Berikut ringkasan operasional daur ulang kertas dan logistik kampus hari ini.", x: 270, y: 108, fontSize: 12, fills: ["#8A9E94"] });

// ── 4 Top KPI Cards (Side-by-Side) ──
const desktopKPIs = [
  { title: "Total Kertas Terkumpul", val: "1.850 Kg", delta: "↑ 18%", deltaColor: "#1B7A4E", deltaBg: "#D1FAE5", sub: "vs bulan lalu", icon: "⚖️" },
  { title: "Nilai Transaksi Sirkular", val: "Rp 3.250.000", delta: "↑ 12%", deltaColor: "#1B7A4E", deltaBg: "#D1FAE5", sub: "masuk kas unit", icon: "💰" },
  { title: "Status Tong Terpantau", val: "6 Titik UPJ", delta: "2 Kritis", deltaColor: "#D97706", deltaBg: "#FEF3C7", sub: "perlu jemput", icon: "📦" },
  { title: "Dampak Lingkungan", val: "31 Pohon", delta: "2.4T CO₂", deltaColor: "#1B7A4E", deltaBg: "#D1FAE5", sub: "jejak ditekan", icon: "🌱" }
];

desktopKPIs.forEach((kpi, idx) => {
  const kx = 270 + idx * 285;
  addRect(s19, { name: `KPI Card ${kpi.title}`, x: kx, y: 136, width: 270, height: 100, cornerRadius: 16, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
  addText(s19, { text: kpi.icon, x: kx + 18, y: 152, fontSize: 18, fills: ["#176B4D"] });
  addText(s19, { text: kpi.title, x: kx + 46, y: 154, fontSize: 11, fills: ["#8A9E94"] });
  addText(s19, { text: kpi.val, x: kx + 18, y: 180, fontSize: 20, fills: ["#141E18"] });

  addRect(s19, { name: "Delta Pill", x: kx + 18, y: 208, width: 56, height: 18, cornerRadius: 9, fills: [kpi.deltaBg] });
  addText(s19, { text: kpi.delta, x: kx + 24, y: 211, fontSize: 10, fills: [kpi.deltaColor] });
  addText(s19, { text: kpi.sub, x: kx + 80, y: 211, fontSize: 10, fills: ["#8A9E94"] });
});

// ── Middle Section ──
// 1. Chart Kiri: Tren Pengumpulan Kertas 6 Bulan (Width: 730)
addRect(s19, { name: "Chart Container", x: 270, y: 252, width: 730, height: 260, cornerRadius: 16, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s19, { text: "Tren Pengumpulan Kertas Kampus (Kg)", x: 292, y: 270, fontSize: 14, fills: ["#141E18"] });
addText(s19, { text: "Total akumulasi per bulan seluruh unit", x: 292, y: 290, fontSize: 11, fills: ["#8A9E94"] });
addText(s19, { text: "6 Bulan Terakhir ▾", x: 890, y: 272, fontSize: 11, fills: ["#4A5C52"] });

// Sumbu grafik & kurva tren
addRect(s19, { name: "Chart Gridline 1", x: 330, y: 320, width: 640, height: 1, fills: ["#F0F3F1"] });
addRect(s19, { name: "Chart Gridline 2", x: 330, y: 360, width: 640, height: 1, fills: ["#F0F3F1"] });
addRect(s19, { name: "Chart Gridline 3", x: 330, y: 400, width: 640, height: 1, fills: ["#F0F3F1"] });
addRect(s19, { name: "Chart Gridline 4", x: 330, y: 440, width: 640, height: 1, fills: ["#F0F3F1"] });

addText(s19, { text: "400 kg", x: 285, y: 314, fontSize: 9, fills: ["#8A9E94"] });
addText(s19, { text: "300 kg", x: 285, y: 354, fontSize: 9, fills: ["#8A9E94"] });
addText(s19, { text: "200 kg", x: 285, y: 394, fontSize: 9, fills: ["#8A9E94"] });
addText(s19, { text: "100 kg", x: 285, y: 434, fontSize: 9, fills: ["#8A9E94"] });

// Batang data visual per bulan
const monthData = [
  { m: "Mei", h: 60, kg: "210" },
  { m: "Jun", h: 80, kg: "260" },
  { m: "Jul", h: 100, kg: "310" },
  { m: "Agu", h: 90, kg: "285" },
  { m: "Sep", h: 125, kg: "365" },
  { m: "Okt", h: 140, kg: "420" }
];
monthData.forEach((d, i) => {
  const bx = 370 + i * 105;
  addRect(s19, { name: `Bar ${d.m}`, x: bx, y: 450 - d.h, width: 36, height: d.h, cornerRadius: 6, fills: [i === 5 ? "#176B4D" : "#A4F3CC"] });
  addText(s19, { text: d.m, x: bx + 8, y: 458, fontSize: 10, fills: ["#4A5C52"] });
  addText(s19, { text: d.kg, x: bx + 6, y: 435 - d.h, fontSize: 9, fills: ["#141E18"] });
});

// 2. Donut Box Kanan: Komposisi Sampah Kertas (Width: 385)
addRect(s19, { name: "Donut Container", x: 1025, y: 252, width: 385, height: 260, cornerRadius: 16, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s19, { text: "Komposisi Jenis Kertas", x: 1045, y: 270, fontSize: 14, fills: ["#141E18"] });
addText(s19, { text: "Persentase perolehan berdasarkan grade", x: 1045, y: 290, fontSize: 11, fills: ["#8A9E94"] });

// Donut Graphic Simulation
addRect(s19, { name: "Donut Outer Ring", x: 1060, y: 320, width: 100, height: 100, cornerRadius: 50, fills: ["#176B4D"] });
addRect(s19, { name: "Donut Inner Cut", x: 1080, y: 340, width: 60, height: 60, cornerRadius: 30, fills: ["#FFFFFF"] });
addText(s19, { text: "1.85T", x: 1092, y: 360, fontSize: 13, fills: ["#176B4D"] });

// Donut Legends
const legends = [
  { label: "HVS & Arsip", pct: "45% (832 Kg)", col: "#176B4D" },
  { label: "Kardus & Karton", pct: "30% (555 Kg)", col: "#D97706" },
  { label: "Koran & Tabloid", pct: "15% (277 Kg)", col: "#52A66F" },
  { label: "Kertas Campuran", pct: "10% (185 Kg)", col: "#8A9E94" }
];
legends.forEach((leg, i) => {
  const ly = 320 + i * 26;
  addRect(s19, { name: "Dot", x: 1180, y: ly + 4, width: 10, height: 10, cornerRadius: 5, fills: [leg.col] });
  addText(s19, { text: leg.label, x: 1198, y: ly, fontSize: 11, fills: ["#141E18"] });
  addText(s19, { text: leg.pct, x: 1300, y: ly, fontSize: 10, fills: ["#8A9E94"] });
});

// ── Lower Section ──
// 1. Tabel Kiri: Log Transaksi Penjemputan Armada (Width: 730)
addRect(s19, { name: "Table Container", x: 270, y: 530, width: 730, height: 280, cornerRadius: 16, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s19, { text: "Log Penjemputan Armada & Verifikasi Timbangan", x: 292, y: 550, fontSize: 14, fills: ["#141E18"] });
addText(s19, { text: "Lihat Semua (24) →", x: 885, y: 552, fontSize: 11, fills: ["#176B4D"] });

// Table Header Row
addRect(s19, { name: "TH Row", x: 292, y: 580, width: 686, height: 28, cornerRadius: 6, fills: ["#F7F8F5"] });
addText(s19, { text: "TANGGAL", x: 304, y: 588, fontSize: 10, fills: ["#8A9E94"] });
addText(s19, { text: "UNIT KAMPUS", x: 375, y: 588, fontSize: 10, fills: ["#8A9E94"] });
addText(s19, { text: "KATEGORI", x: 500, y: 588, fontSize: 10, fills: ["#8A9E94"] });
addText(s19, { text: "BERAT", x: 620, y: 588, fontSize: 10, fills: ["#8A9E94"] });
addText(s19, { text: "NILAI KAS", x: 710, y: 588, fontSize: 10, fills: ["#8A9E94"] });
addText(s19, { text: "STATUS", x: 830, y: 588, fontSize: 10, fills: ["#8A9E94"] });

const rows = [
  { t: "4 Nov", u: "FTD Gedung B", k: "HVS Putih", b: "320 Kg", n: "Rp 640.000", s: "Terverifikasi" },
  { t: "3 Nov", u: "FEB Gedung A", k: "Kardus Box", b: "410 Kg", n: "Rp 615.000", s: "Terverifikasi" },
  { t: "2 Nov", u: "Perpustakaan", k: "Koran/Tabloid", b: "120 Kg", n: "Rp 120.000", s: "Terverifikasi" },
  { t: "1 Nov", u: "Rektorat UPJ", k: "Arsip Kantor", b: "85 Kg", n: "Rp 170.000", s: "Terverifikasi" }
];

rows.forEach((r, i) => {
  const ry = 620 + i * 42;
  addText(s19, { text: r.t, x: 304, y: ry, fontSize: 11, fills: ["#8A9E94"] });
  addText(s19, { text: r.u, x: 375, y: ry, fontSize: 11, fills: ["#141E18"] });
  addText(s19, { text: r.k, x: 500, y: ry, fontSize: 11, fills: ["#4A5C52"] });
  addText(s19, { text: r.b, x: 620, y: ry, fontSize: 11, fills: ["#176B4D"] });
  addText(s19, { text: r.n, x: 710, y: ry, fontSize: 11, fills: ["#141E18"] });
  addRect(s19, { name: "Status Pill", x: 825, y: ry - 4, width: 85, height: 20, cornerRadius: 10, fills: ["#D1FAE5"] });
  addText(s19, { text: r.s, x: 835, y: ry, fontSize: 9, fills: ["#1B7A4E"] });
});

// 2. Monitoring Tong Kanan (Width: 385)
addRect(s19, { name: "Tong Monitor Container", x: 1025, y: 530, width: 385, height: 280, cornerRadius: 16, fills: ["#FFFFFF"], strokes: ["#E0E5E2"], strokeWeight: 1 });
addText(s19, { text: "Status Kapasitas Tong UPJ", x: 1045, y: 550, fontSize: 14, fills: ["#141E18"] });
addText(s19, { text: "Kelola Sensor →", x: 1315, y: 552, fontSize: 11, fills: ["#176B4D"] });

const dtTong = [
  { name: "Tong FTD Gedung B Lt. 2", fill: "92%", color: "#C0392B", bg: "#FEECEC", label: "Kritis (46/50 kg)", w: 310 },
  { name: "Tong FEB Gedung A Lt. 1", fill: "78%", color: "#D97706", bg: "#FEF3C7", label: "Waspada (39/50 kg)", w: 260 },
  { name: "Tong Perpustakaan Lt. 2", fill: "45%", color: "#1B7A4E", bg: "#D1FAE5", label: "Aman (22.5/50 kg)", w: 150 },
  { name: "Tong Rektorat Lt. 3", fill: "30%", color: "#1B7A4E", bg: "#D1FAE5", label: "Aman (15/50 kg)", w: 100 }
];

dtTong.forEach((tg, i) => {
  const ty = 586 + i * 54;
  addText(s19, { text: tg.name, x: 1045, y: ty, fontSize: 11, fills: ["#141E18"] });
  addText(s19, { text: tg.label, x: 1250, y: ty, fontSize: 10, fills: [tg.color] });
  addRect(s19, { name: "Bar Track", x: 1045, y: ty + 18, width: 345, height: 8, cornerRadius: 4, fills: ["#EEEEF0"] });
  addRect(s19, { name: "Bar Value", x: 1045, y: ty + 18, width: tg.w, height: 8, cornerRadius: 4, fills: [tg.color] });
});

// ── Callout Banner Bawah ──
addRect(s19, { name: "Bottom Banner", x: 270, y: 830, width: 1140, height: 60, cornerRadius: 14, fills: ["#E8F5EE"], strokes: ["#C8D5CC"], strokeWeight: 1 });
addText(s19, { text: "🌱", x: 290, y: 846, fontSize: 24, fills: ["#176B4D"] });
addText(s19, { text: "Target Daur Ulang Kampus UPJ Tercapai 85% Bulan Ini!", x: 330, y: 844, fontSize: 13, fills: ["#176B4D"] });
addText(s19, { text: "Penjemputan armada truk berikutnya: Hari ini pukul 14:30 WIB melalui Gerbang Barat UPJ.", x: 330, y: 864, fontSize: 11, fills: ["#4A5C52"] });

addRect(s19, { name: "Banner Action Btn", x: 1220, y: 842, width: 170, height: 36, cornerRadius: 8, fills: ["#176B4D"] });
addText(s19, { text: "Lihat Rincian Armada →", x: 1238, y: 852, fontSize: 11, fills: ["#FFFFFF"] });

// Write JSON & compile
const outJson = path.join(process.cwd(), 'figcraft_commands.json');
const outFig = path.join(process.cwd(), 'sampah-butuh-teman.figcraft');

fs.writeFileSync(outJson, JSON.stringify(commands, null, 2), 'utf-8');
console.log(`Saved ${commands.length} commands to ${outJson}`);

try {
  execSync(`"C:\\Program Files\\FigCraft\\figcraft-cli.exe" run "${outJson}" --out "${outFig}"`, { stdio: 'inherit' });
  console.log(`\nSuccessfully created: ${outFig}`);
} catch (e) {
  console.error("Failed to run figcraft-cli:", e);
}
