import React, { useState } from 'react';
import { 
  HiUser, 
  HiBriefcase, 
  HiAcademicCap, 
  HiWrench, 
  HiSparkles, 
  HiPlus, 
  HiTrash,
  HiDocumentText,
  HiLanguage
} from 'react-icons/hi2';
import { HiBadgeCheck } from 'react-icons/hi';
import API_BASE_URL from '../config';

export default function CvForm({ cvData, setCvData }) {
  const [loadingSection, setLoadingSection] = useState(null);

  const handlePersonalChange = (field, value) => {
    setCvData({
      ...cvData,
      personal: { ...cvData.personal, [field]: value }
    });
  };

  const handleGenerateSummary = async () => {
    setLoadingSection('summary');
    try {
      const res = await fetch(`${API_BASE_URL}/api/builder-assist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'summary',
          payload: {
            targetRole: cvData.personal.role,
            rawBackground: `${cvData.personal.fullName}, skills: ${cvData.skills.hard}`
          }
        })
      });
      const data = await res.json();
      if (data.result) {
        handlePersonalChange('summary', data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSection(null);
    }
  };

  // Generic Handlers for Arrays (experiences, education, portfolio, certifications)
  const addArrayItem = (key, emptyItem) => {
    setCvData({ ...cvData, [key]: [...cvData[key], { id: Date.now(), ...emptyItem }] });
  };
  const updateArrayItem = (key, id, field, value) => {
    setCvData({
      ...cvData,
      [key]: cvData[key].map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };
  const removeArrayItem = (key, id) => {
    setCvData({ ...cvData, [key]: cvData[key].filter(item => item.id !== id) });
  };

  const handlePolishBullet = async (id, currentText) => {
    if (!currentText) return;
    setLoadingSection(`exp-${id}`);
    try {
      const res = await fetch(`${API_BASE_URL}/api/builder-assist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'polish-bullet',
          payload: { bullet: currentText }
        })
      });
      const data = await res.json();
      if (data.result) {
        updateArrayItem('experiences', id, 'description', data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSection(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Personal Information */}
      <div className="card-modern">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><HiUser className="w-5 h-5" /></div>
          <h2 className="font-bold text-slate-800 text-base sm:text-lg">Informasi Pribadi</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Nama Lengkap</label><input type="text" value={cvData.personal.fullName} onChange={(e) => handlePersonalChange('fullName', e.target.value)} className="input-modern" /></div>
          <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Target Posisi / Role</label><input type="text" value={cvData.personal.role} onChange={(e) => handlePersonalChange('role', e.target.value)} className="input-modern" /></div>
          <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Email</label><input type="email" value={cvData.personal.email} onChange={(e) => handlePersonalChange('email', e.target.value)} className="input-modern" /></div>
          <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">No. Telepon</label><input type="text" value={cvData.personal.phone} onChange={(e) => handlePersonalChange('phone', e.target.value)} className="input-modern" /></div>
          <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Lokasi / Kota</label><input type="text" value={cvData.personal.location} onChange={(e) => handlePersonalChange('location', e.target.value)} className="input-modern" /></div>
          <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">LinkedIn</label><input type="text" value={cvData.personal.linkedin} onChange={(e) => handlePersonalChange('linkedin', e.target.value)} className="input-modern" /></div>
          <div className="sm:col-span-2"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">GitHub / Portofolio</label><input type="text" value={cvData.personal.github} onChange={(e) => handlePersonalChange('github', e.target.value)} className="input-modern" /></div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Ringkasan Profil (Summary)</label>
            <button onClick={handleGenerateSummary} disabled={loadingSection === 'summary'} className="btn-ai">
              {loadingSection === 'summary' ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : <HiSparkles className="w-3.5 h-3.5" />} 
              {loadingSection === 'summary' ? 'Generating...' : 'Auto-Write with AI'}
            </button>
          </div>
          <textarea rows={3} value={cvData.personal.summary} onChange={(e) => handlePersonalChange('summary', e.target.value)} className="input-modern resize-y" placeholder="Ceritakan singkat tentang keahlian dan fokus karir Anda..." />
        </div>
      </div>

      {/* 2. Work Experience */}
      <div className="card-modern">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><HiBriefcase className="w-5 h-5" /></div>
            <h2 className="font-bold text-slate-800 text-base sm:text-lg">Pengalaman Kerja</h2>
          </div>
          <button onClick={() => addArrayItem('experiences', {company:'', role:'', period:'', description:''})} className="btn-outline"><HiPlus className="w-3.5 h-3.5" /> Tambah</button>
        </div>
        <div className="flex flex-col gap-4">
          {cvData.experiences.map((exp) => (
            <div key={exp.id} className="p-4 sm:p-5 border border-slate-100 rounded-xl bg-slate-50/50 relative group transition-all hover:border-slate-200">
              <button onClick={() => removeArrayItem('experiences', exp.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors bg-white p-1.5 rounded-md shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100"><HiTrash className="w-4 h-4" /></button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 pr-8">
                <input type="text" placeholder="Perusahaan" value={exp.company} onChange={(e) => updateArrayItem('experiences', exp.id, 'company', e.target.value)} className="input-modern" />
                <input type="text" placeholder="Jabatan / Role" value={exp.role} onChange={(e) => updateArrayItem('experiences', exp.id, 'role', e.target.value)} className="input-modern" />
                <input type="text" placeholder="Periode (e.g. 2022 - Sekarang)" value={exp.period} onChange={(e) => updateArrayItem('experiences', exp.id, 'period', e.target.value)} className="input-modern" />
              </div>
              <div className="relative">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-2 mt-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Pencapaian Kerja (Bullet Points)</label>
                  <button onClick={() => handlePolishBullet(exp.id, exp.description)} disabled={loadingSection === `exp-${exp.id}`} className="btn-ai text-[10px] py-1 px-2.5">
                    {loadingSection === `exp-${exp.id}` ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <HiSparkles className="w-3 h-3" />} 
                    {loadingSection === `exp-${exp.id}` ? 'Polishing...' : 'Improve with AI'}
                  </button>
                </div>
                <textarea rows={2} placeholder="Sebutkan tindakan, metrik, dan dampak (Mengerjakan X menghasilkan Y)..." value={exp.description} onChange={(e) => updateArrayItem('experiences', exp.id, 'description', e.target.value)} className="input-modern resize-y leading-relaxed" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Education */}
      <div className="card-modern">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
             <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><HiAcademicCap className="w-5 h-5" /></div>
             <h2 className="font-bold text-slate-800 text-base sm:text-lg">Pendidikan</h2>
          </div>
          <button onClick={() => addArrayItem('education', {school:'', degree:'', year:'', gpa:''})} className="btn-outline"><HiPlus className="w-3.5 h-3.5" /> Tambah</button>
        </div>
        <div className="flex flex-col gap-3">
          {cvData.education.map((edu) => (
            <div key={edu.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100 relative group">
              <button onClick={() => removeArrayItem('education', edu.id)} className="absolute -top-2 -right-2 text-slate-400 hover:text-red-500 bg-white p-1 rounded-full shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"><HiTrash className="w-3.5 h-3.5" /></button>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Institusi</label>
                <input type="text" placeholder="Universitas / Sekolah" value={edu.school} onChange={(e) => updateArrayItem('education', edu.id, 'school', e.target.value)} className="input-modern" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Gelar</label>
                <input type="text" placeholder="S1 Teknik..." value={edu.degree} onChange={(e) => updateArrayItem('education', edu.id, 'degree', e.target.value)} className="input-modern" />
              </div>
              <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Tahun</label>
                 <input type="text" placeholder="2019-2023" value={edu.year} onChange={(e) => updateArrayItem('education', edu.id, 'year', e.target.value)} className="input-modern" />
              </div>
              <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">IPK</label>
                 <input type="text" placeholder="3.80" value={edu.gpa} onChange={(e) => updateArrayItem('education', edu.id, 'gpa', e.target.value)} className="input-modern" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Portfolio / Projects */}
      <div className="card-modern">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><HiDocumentText className="w-5 h-5" /></div>
            <h2 className="font-bold text-slate-800 text-base sm:text-lg">Portofolio & Proyek</h2>
          </div>
          <button onClick={() => addArrayItem('portfolio', {name:'', link:'', description:''})} className="btn-outline"><HiPlus className="w-3.5 h-3.5" /> Tambah</button>
        </div>
        <div className="flex flex-col gap-4">
          {cvData.portfolio.map((port) => (
            <div key={port.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 relative group">
              <button onClick={() => removeArrayItem('portfolio', port.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-white p-1.5 rounded-md shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100"><HiTrash className="w-4 h-4" /></button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 pr-8">
                <div>
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Nama Proyek</label>
                   <input type="text" placeholder="e.g. E-Commerce Dashboard" value={port.name} onChange={(e) => updateArrayItem('portfolio', port.id, 'name', e.target.value)} className="input-modern" />
                </div>
                <div>
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Link URL</label>
                   <input type="text" placeholder="demo.com" value={port.link} onChange={(e) => updateArrayItem('portfolio', port.id, 'link', e.target.value)} className="input-modern" />
                </div>
              </div>
              <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Deskripsi & Teknologi (Bisa Multibaris)</label>
                 <textarea rows={3} placeholder="Baris 1: Aplikasi untuk...&#10;Baris 2: Menggunakan React..." value={port.description} onChange={(e) => updateArrayItem('portfolio', port.id, 'description', e.target.value)} className="input-modern resize-y leading-relaxed" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Certifications */}
      <div className="card-modern">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
             <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><HiBadgeCheck className="w-5 h-5" /></div>
             <h2 className="font-bold text-slate-800 text-base sm:text-lg">Sertifikasi & Kursus</h2>
          </div>
          <button onClick={() => addArrayItem('certifications', {title:'', issuer:'', year:''})} className="btn-outline"><HiPlus className="w-3.5 h-3.5" /> Tambah</button>
        </div>
        <div className="flex flex-col gap-3">
          {cvData.certifications.map((cert) => (
            <div key={cert.id} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end bg-slate-50/50 p-4 rounded-xl border border-slate-100 relative group">
              <button onClick={() => removeArrayItem('certifications', cert.id)} className="absolute -top-2 -right-2 text-slate-400 hover:text-red-500 bg-white p-1 rounded-full shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"><HiTrash className="w-3.5 h-3.5" /></button>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Nama Sertifikat</label>
                <input type="text" value={cert.title} onChange={(e) => updateArrayItem('certifications', cert.id, 'title', e.target.value)} className="input-modern" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Penerbit</label>
                <input type="text" value={cert.issuer} onChange={(e) => updateArrayItem('certifications', cert.id, 'issuer', e.target.value)} className="input-modern" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Tahun</label>
                <input type="text" value={cert.year} onChange={(e) => updateArrayItem('certifications', cert.id, 'year', e.target.value)} className="input-modern" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Skills & Languages */}
      <div className="card-modern">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><HiWrench className="w-5 h-5" /></div>
          <h2 className="font-bold text-slate-800 text-base sm:text-lg">Keahlian (Skills)</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Hard Skills (pisahkan koma)</label><input type="text" placeholder="React, Node.js..." value={cvData.skills.hard} onChange={(e) => setCvData({ ...cvData, skills: { ...cvData.skills, hard: e.target.value } })} className="input-modern" /></div>
          <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Soft Skills (pisahkan koma)</label><input type="text" placeholder="Teamwork, Leadership..." value={cvData.skills.soft} onChange={(e) => setCvData({ ...cvData, skills: { ...cvData.skills, soft: e.target.value } })} className="input-modern" /></div>
        </div>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mt-6 mb-4">
          <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><HiLanguage className="w-5 h-5" /></div>
          <h2 className="font-bold text-slate-800 text-base sm:text-lg">Bahasa (Languages)</h2>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Kefasihan Bahasa</label>
          <input type="text" placeholder="e.g. Indonesia (Native), English (Fluent)" value={cvData.languages} onChange={(e) => setCvData({ ...cvData, languages: e.target.value })} className="input-modern" />
        </div>
      </div>
    </div>
  );
}
