import React from 'react';
import { HiDocumentText, HiSparkles, HiShieldCheck, HiArrowRight, HiUser } from 'react-icons/hi2';

export default function LandingPage({ onStart, onOpenAuth, user }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center text-center px-6 sm:px-12 md:px-20 lg:px-32 relative overflow-hidden py-16">
      
      {/* Top Bar / Login button */}
      <div className="absolute top-6 right-6 sm:right-12 z-20">
        {user ? (
          <button
            onClick={onStart}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white/80 border border-slate-200 px-4 py-2 rounded-xl shadow-sm hover:bg-white transition-all"
          >
            <HiUser className="w-4 h-4 text-teal-600" /> Buka Dashboard
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white/80 border border-slate-200 px-4 py-2 rounded-xl shadow-sm hover:bg-white transition-all"
          >
            Masuk / Daftar
          </button>
        )}
      </div>

      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 sm:w-80 sm:h-80 bg-teal-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
      <div className="absolute top-1/4 right-0 w-64 h-64 sm:w-80 sm:h-80 bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-cyan-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center w-full">
        
        {/* Logo */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center rounded-2xl shadow-lg shadow-teal-200/50 mb-6 lg:mb-8 transform -rotate-3">
          <HiDocumentText className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
        </div>

        {/* Headlines */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[10px] sm:text-xs font-bold mb-5 lg:mb-6">
          <HiSparkles className="w-3 h-3 sm:w-4 sm:h-4" /> <span>Powered by AI</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5 lg:mb-6 max-w-3xl">
          Buat CV <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">ATS-Friendly</span> <br className="hidden sm:block" /> dalam Hitungan Menit
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed px-4">
          Tingkatkan peluang lolos seleksi kerja dengan CV yang terstruktur rapi. Gunakan asisten AI kami untuk menyusun ringkasan dan memoles pencapaian Anda secara otomatis.
        </p>

        {/* CTA Button */}
        <button 
          onClick={onStart}
          className="group flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm sm:text-base font-bold px-6 py-3 lg:px-8 lg:py-4 rounded-xl shadow-lg shadow-slate-200/50 transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
        >
          Mulai Buat CV Sekarang
          <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Feature Highlights */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left w-full max-w-4xl">
          <div className="bg-white/50 backdrop-blur-sm border border-slate-100 p-5 lg:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center mb-4">
              <HiShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1.5">Standar ATS</h3>
            <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">Format dokumen yang bersih dan terstruktur untuk sistem robot rekruter.</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm border border-slate-100 p-5 lg:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4">
              <HiSparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1.5">AI Assistant</h3>
            <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">Ketik poin singkat, AI akan memolesnya menjadi bahasa profesional.</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm border border-slate-100 p-5 lg:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <HiDocumentText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1.5">Live Preview</h3>
            <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">Lihat perubahan desain CV secara real-time. Langsung ekspor PDF.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
