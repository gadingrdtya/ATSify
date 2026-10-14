<div align="center">

# ATSify
### AI-Powered CV Builder & Intelligent ATS Screening Engine

Platform pembuatan dan optimasi Curriculum Vitae (CV) modern berbasis standar Applicant Tracking System (ATS), dilengkapi asisten penulisan AI cerdas dan penganalisis kecocokan deskripsi lowongan kerja secara real-time.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Groq](https://img.shields.io/badge/Groq-AI_LLM-F55036?style=for-the-badge&logo=fastapi&logoColor=white)](https://groq.com/)
[![Midtrans](https://img.shields.io/badge/Midtrans-Snap_Payment-002B49?style=for-the-badge)](https://midtrans.com/)

[Fitur Unggulan](#-fitur-unggulan) • [Tech Stack](#-arsitektur--tech-stack) • [Instalasi Lokal](#-panduan-instalasi-lokal) • [Deployment](#-panduan-deployment) • [Struktur Proyek](#-struktur-direktori)

</div>

---

## 🎯 Sekilas ATSify

**ATSify** dirancang untuk menyelesaikan masalah utama para pencari kerja: format CV yang ditolak oleh sistem penyaring otomatis (*Applicant Tracking System* / ATS) perusahaan karena tata letak rumit, grafik/tabel yang tidak terbaca mesin, ketiadaan kata kunci teknis yang relevan, serta minimnya metrik pencapaian yang terukur.

ATSify mengombinasikan **editor formulir CV terstruktur**, **live preview lembar A4 terstandarisasi**, **asisten AI untuk perumusan ringkasan dan poin pencapaian**, dan **fitur Job Description Matcher** untuk menganalisis probabilitas kelolosan CV terhadap kualifikasi lowongan kerja tertentu sebelum berkas dilayangkan ke rekruter.

---

## ✨ Fitur Unggulan

### 1. 📄 100% ATS-Compliant Layout & Live A4 Print
- Format tata letak dokumen A4 berbasis hirarki standar industri: *Personal Info*, *Professional Summary*, *Work Experience*, *Education*, *Projects & Portfolio*, *Certifications & Courses*, *Skills*, dan *Languages*.
- Kertas dokumen dioptimalkan khusus menggunakan tipografi universal (*Arial / Helvetica*), margin proporsional, serta dukungan export dokumen via native print engine (`Ctrl+P` / cetak PDF) tanpa glitch, karakter aneh, atau elemen grafik pemecah parser ATS.

### 2. ⚡ Groq AI Resume Assistant
- **Professional Summary Generator**: Merumuskan 2-3 kalimat ringkasan profesional yang kuat dan padat berdasarkan posisi target dan latar belakang pengguna.
- **XYZ Bullet Point Polisher**: Mentransformasi deskripsi tugas yang pasif menjadi pencapaian berdampak tinggi dengan formula baku rekruter Google: **Accomplished [X], as measured by [Y], by doing [Z]**.

### 3. 🎯 Job Description Matcher & Keyword Gap Analysis
- Pengguna dapat menyalin deskripsi lowongan kerja (dari LinkedIn, JobStreet, dsb.) ke sistem.
- Model AI melakukan kalkulasi persentase skor kecocokan (*ATS Match Score* 0–100%), menampilkan kata kunci teknis yang cocok, mengidentifikasi kata kunci penting yang masih absen di CV pengguna (*Missing Keywords*), serta memberikan rekomendasi tindakan konkret untuk lolos screening awal.

### 4. 🗄️ Multi-CV Dashboard & Cloud Synchronization
- Manajemen banyak resume untuk berbagai variasi posisi pekerjaan dalam satu akun terpusat.
- Didukung oleh **Supabase Auth** dan **PostgreSQL Database** dengan enkripsi serta perlindungan *Row Level Security* (RLS) data akun.

### 5. 💳 Integrasi Monetisasi Midtrans Snap
- Skema upgrade tier akun (*Free* ke *Pro Tier*) terintegrasi dengan gateway pembayaran nasional **Midtrans Snap**.
- Mendukung metode pembayaran instan: QRIS (GoPay, OVO, ShopeePay), Transfer Virtual Account (BCA, Mandiri, BNI, BRI), dan Kartu Kredit/Debit.

---

## 🛠️ Arsitektur & Tech Stack

| Lapisan | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS | Single Page Application (SPA), Plus Jakarta Sans font, responsive mobile/tablet/desktop |
| **Icons & UI** | `react-icons` (Heroicons 2, FontAwesome) | Modern Glassmorphism & Bento aesthetic tanpa emoji dekoratif |
| **Backend** | Node.js, Express.js | RESTful API server untuk orkestrasi AI, sinkronisasi data, dan payment bridge |
| **AI LLM Inference** | Groq Cloud SDK (`openai/gpt-oss-120b`) | Model inferensi ultra-cepat dengan latensi token minimal |
| **Database & Auth** | Supabase (PostgreSQL) | Manajemen otentikasi pengguna, profil, dan penyimpanan dokumen JSON |
| **Payment Gateway** | Midtrans Client Snap | Solusi transaksi multi-metode dengan popup drop-in UI |

---

## 📁 Struktur Direktori

```
ATSify/
├── client/                     # Frontend Application (React 19 + Vite + Tailwind CSS)
│   ├── public/                 # Favicon dan aset statis
│   ├── src/
│   │   ├── assets/             # Gambar & ilustrasi visual
│   │   ├── components/         # Komponen UI (Navbar, CvForm, CvPreview, JobMatcherModal, Dashboard, AuthModal, LandingPage)
│   │   ├── config.js           # Resolusi API URL lingkungan dinamis
│   │   ├── supabase.js         # Client instance Supabase
│   │   ├── App.jsx             # Root switcher tampilan, state manager & print engine
│   │   └── main.jsx            # Entry point aplikasi React
│   └── package.json
├── server/                     # Backend API (Node.js + Express)
│   ├── index.js                # API routes (/api/builder-assist, /api/match-job, /api/payment)
│   └── package.json
├── supabase_schema.sql         # Skema database Supabase, tabel profiles & cvs, dan RLS policies
├── .gitignore                  # Git ignore proteksi file rahasia (.env & dokumen internal)
└── README.md
```

---

## 🚀 Panduan Instalasi Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) v18+ dan npm
- Akun [Supabase](https://supabase.com/)
- Akun [Groq Console](https://console.groq.com/)
- Akun [Midtrans Sandbox](https://dashboard.sandbox.midtrans.com/)

---

### 1. Konfigurasi Database (Supabase)
1. Buka SQL Editor di Dashboard Supabase proyek Anda.
2. Jalankan seluruh skrip SQL yang ada pada berkas `supabase_schema.sql`.

---

### 2. Menjalankan Backend (Server)
```bash
# Masuk ke direktori server
cd server

# Install dependensi
npm install

# Buat berkas .env di dalam direktori server/
# Isi variabel berikut:
PORT=5000
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyxxxxxxxxxxxxxxxxxxxx
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false

# Jalankan backend service
npm run dev
```
Backend berjalan pada: `http://localhost:5000`

---

### 3. Menjalankan Frontend (Client)
```bash
# Buka terminal baru, masuk ke direktori client
cd client

# Install dependensi
npm install

# Buat berkas .env di dalam direktori client/
# Isi variabel berikut:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyxxxxxxxxxxxxxxxxxxxx
VITE_API_URL=http://localhost:5000

# Jalankan development server
npm run dev
```
Akses aplikasi melalui peramban di: `http://localhost:5173`

---

## 🌐 Panduan Deployment

### 1. Backend Deployment (Railway)
1. Buat project baru di [Railway.app](https://railway.app) melalui repositori GitHub ini.
2. Buka menu **Settings** pada service:
   - Atur **Root Directory** ke: `/server`
3. Buka menu **Variables**, tambahkan seluruh environment variables dari `server/.env`:
   - `GROQ_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `MIDTRANS_SERVER_KEY`
   - `MIDTRANS_CLIENT_KEY`
   - `MIDTRANS_IS_PRODUCTION` (`false` untuk Sandbox, `true` untuk Production)
4. Buka tab **Networking**, klik **Generate Domain** (contoh: `https://atsify-api-production.up.railway.app`).

### 2. Frontend Deployment (Vercel)
1. Import repositori GitHub Anda di [Vercel](https://vercel.com).
2. Konfigurasikan proyek:
   - Atur **Root Directory** ke: `client`
   - Framework Preset: **Vite**
3. Tambahkan **Environment Variables**:
   - `VITE_API_URL` = Domain backend Railway Anda (contoh: `https://atsify-api-production.up.railway.app` tanpa garis miring di akhir)
   - `VITE_SUPABASE_URL` = URL Supabase proyek Anda
   - `VITE_SUPABASE_ANON_KEY` = Anon Key publik Supabase Anda
4. Klik tombol **Deploy**.

---

## 📄 Lisensi
Proyek ini didistribusikan di bawah lisensi [MIT License](LICENSE).
Seluruh format dokumen dan kalkulasi algoritma difokuskan untuk standar transparansi screening karir pelamar.
