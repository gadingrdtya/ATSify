import React from 'react';
import { HiDocumentText, HiDownload } from 'react-icons/hi';
import { HiSquares2X2, HiCloudArrowUp, HiSparkles } from 'react-icons/hi2';

export default function Navbar({ onPrint, completionRate, onSave, onGoDashboard, onOpenJobMatcher, user, saving }) {
  return (
    <header className="sticky top-0 z-50 glass-panel px-3 py-2.5 sm:px-6 lg:px-8 flex justify-between items-center gap-2 sm:gap-4">
      {/* Brand Logo & Back to Dashboard */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onGoDashboard}
          title="Kembali ke Dashboard"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center rounded-xl shadow-lg shadow-teal-200 shrink-0">
            <HiDocumentText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="text-left">
            <span className="text-lg sm:text-xl font-black tracking-tight text-slate-800">ATSify</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              AI CV Builder
            </span>
          </div>
        </button>

        {user && (
          <button
            onClick={onGoDashboard}
            className="hidden sm:flex items-center gap-1.5 ml-2 text-xs font-bold text-slate-600 hover:text-teal-700 bg-slate-100/70 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <HiSquares2X2 className="w-4 h-4" /> Dashboard
          </button>
        )}
      </div>

      {/* Mini ATS Checklist Status */}
      <div className="hidden lg:flex items-center gap-3 bg-white border border-slate-100 px-3.5 py-1.5 rounded-full shadow-sm">
        <span className="text-[11px] font-semibold text-slate-500">Readiness:</span>
        <div className="w-20 xl:w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${
              completionRate >= 80 ? 'bg-teal-400' : completionRate >= 50 ? 'bg-amber-400' : 'bg-red-400'
            }`}
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <span className={`text-[11px] font-bold ${completionRate >= 80 ? 'text-teal-600' : 'text-slate-600'}`}>{completionRate}%</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onOpenJobMatcher}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 sm:px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95"
          title="Bandingkan CV dengan deskripsi lowongan"
        >
          <HiSparkles className="w-4 h-4 text-teal-600 shrink-0" />
          <span className="hidden md:inline">Job Matcher</span>
        </button>

        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 sm:px-3.5 py-2 rounded-xl transition-colors disabled:opacity-50"
        >
          <HiCloudArrowUp className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">{saving ? 'Menyimpan...' : 'Simpan CV'}</span>
        </button>

        <button onClick={onPrint} className="btn-ai flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm">
          <HiDownload className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Export PDF</span>
          <span className="sm:hidden font-bold">PDF</span>
        </button>
      </div>
    </header>
  );
}
