import React, { useState } from 'react';
import API_BASE_URL from '../config';
import {
  HiXMark,
  HiSparkles,
  HiCheckCircle,
  HiExclamationCircle,
  HiLightBulb,
  HiBriefcase
} from 'react-icons/hi2';

export default function JobMatcherModal({ isOpen, onClose, cvData }) {
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState(cvData?.personal?.role || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setErrorMsg('Tempel deskripsi lowongan kerja terlebih dahulu.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/match-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvData,
          jobDescription,
          targetRole: targetRole || cvData?.personal?.role || 'Job Candidate'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal memproses analisis.');
      }
      setResult(data);
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const scoreBarColor = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-2xl border border-slate-100 flex flex-col my-4 sm:my-8 shrink-0">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          title="Tutup"
        >
          <HiXMark className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start sm:items-center gap-3 pr-8 mb-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center rounded-xl shadow-md shadow-teal-200 text-white shrink-0">
            <HiBriefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-800 leading-tight">Job Matcher</h2>
              <span className="text-[9px] sm:text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                ATS AI
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Analisa kecocokan CV Anda dengan kualifikasi lowongan kerja.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-100 flex items-center gap-2">
            <HiExclamationCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <div className="mt-4 space-y-3.5">
          <div>
            <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Target Posisi (Role)
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Frontend Developer, Data Analyst..."
              className="input-modern text-xs sm:text-sm"
            />
          </div>

          <div>
            <div className="flex flex-wrap justify-between items-center gap-1 mb-1">
              <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Deskripsi Lowongan Kerja (Job Description)
              </label>
              <span className="text-[10px] text-slate-400">Salin dari LinkedIn / Jobstreet</span>
            </div>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Tempel syarat dan kualifikasi pekerjaan di sini..."
              className="input-modern resize-y text-xs sm:text-sm leading-relaxed"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                <span>Menganalisis Algoritma ATS...</span>
              </>
            ) : (
              <>
                <HiSparkles className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Analisis Kecocokan CV</span>
              </>
            )}
          </button>
        </div>

        {/* Analysis Results View */}
        {result && (
          <div className="mt-5 pt-5 border-t border-slate-100 space-y-4 animate-fade-in">
            {/* Score Banner */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-black shrink-0 ${scoreColor(result.matchScore)}`}>
                  <span className="text-lg sm:text-xl leading-none">{result.matchScore}%</span>
                  <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-tight mt-0.5">Match</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border ${scoreColor(result.matchScore)}`}>
                      {result.verdict}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    {result.summary}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full sm:w-28 md:w-36 bg-slate-200 rounded-full h-2 overflow-hidden shrink-0 mt-1 sm:mt-0">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ease-out ${scoreBarColor(result.matchScore)}`}
                  style={{ width: `${result.matchScore}%` }}
                />
              </div>
            </div>

            {/* Keyword Comparison (Grid Responsive) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Matched Keywords */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-emerald-100 bg-emerald-50/40">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] sm:text-xs mb-2">
                  <HiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kata Kunci Ditemukan ({result.matchedKeywords?.length || 0})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedKeywords && result.matchedKeywords.length > 0 ? (
                    result.matchedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[10px] sm:text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md break-all"
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">Belum ada kata kunci yang cocok</span>
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-rose-100 bg-rose-50/40">
                <div className="flex items-center gap-1.5 text-rose-800 font-bold text-[11px] sm:text-xs mb-2">
                  <HiExclamationCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Kata Kunci Kurang ({result.missingKeywords?.length || 0})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords && result.missingKeywords.length > 0 ? (
                    result.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[10px] sm:text-[11px] font-medium bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md break-all"
                      >
                        + {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-600 font-medium">Semua kata kunci utama sudah ada di CV</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actionable Tips */}
            {result.tips && result.tips.length > 0 && (
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold text-[11px] sm:text-xs mb-2">
                  <HiLightBulb className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Saran Optimasi ATS</span>
                </div>
                <ul className="space-y-1.5">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="text-[11px] sm:text-xs text-slate-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
