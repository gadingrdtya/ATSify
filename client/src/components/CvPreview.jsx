import React from 'react';
import { HiEnvelope, HiPhone, HiMapPin } from 'react-icons/hi2';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

export default function CvPreview({ cvData, innerRef }) {
  const safeData = cvData || {};
  const personal = safeData.personal || {};
  const experiences = Array.isArray(safeData.experiences) ? safeData.experiences : [];
  const education = Array.isArray(safeData.education) ? safeData.education : [];
  const portfolio = Array.isArray(safeData.portfolio) ? safeData.portfolio : [];
  const certifications = Array.isArray(safeData.certifications) ? safeData.certifications : [];
  const skills = safeData.skills || { hard: '', soft: '' };
  const languages = safeData.languages || '';

  const hardSkills = skills.hard ? skills.hard.split(',').map(s => s.trim()).filter(Boolean) : [];
  const softSkills = skills.soft ? skills.soft.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 px-1 print:hidden">
        <span>PREVIEW DOKUMEN ATS (A4)</span>
        <span className="text-teal-500 flex items-center gap-1.5 font-semibold">
          <HiSparkles className="w-3.5 h-3.5 text-teal-500" /> Live ATS Ready
        </span>
      </div>

      <div
        ref={innerRef}
        id="cv-paper"
        className="w-full bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-xl p-6 sm:p-10 font-cv text-slate-800 min-h-[900px] flex flex-col gap-4 print:border-none print:shadow-none print:m-0 print:p-8 print:rounded-none"
      >
        {/* Header */}
        <div className="print-section text-center mb-1 border-b-2 border-slate-100 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 capitalize">
            {personal.fullName || 'Nama Lengkap'}
          </h1>
          <p className="text-sm font-semibold text-teal-600 tracking-wide uppercase mt-1">
            {personal.role || 'Target Posisi Pekerjaan'}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-[11px] text-slate-500 mt-3">
            {personal.location && (
              <span className="flex items-center gap-1"><HiMapPin className="w-3.5 h-3.5 text-slate-400" /> {personal.location}</span>
            )}
            {personal.phone && (
              <span className="flex items-center gap-1"><HiPhone className="w-3.5 h-3.5 text-slate-400" /> {personal.phone}</span>
            )}
            {personal.email && (
              <span className="flex items-center gap-1"><HiEnvelope className="w-3.5 h-3.5 text-slate-400" /> {personal.email}</span>
            )}
            {personal.linkedin && (
              <span className="flex items-center gap-1"><FaLinkedin className="w-3.5 h-3.5 text-slate-400" /> {personal.linkedin.replace('https://', '')}</span>
            )}
            {personal.github && (
              <span className="flex items-center gap-1"><FaGithub className="w-3.5 h-3.5 text-slate-400" /> {personal.github.replace('https://', '')}</span>
            )}
          </div>
        </div>

        {/* Summary */}
        {personal.summary && (
          <div className="print-section mb-2">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-900 border-b-2 border-teal-50 pb-0.5 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-[11px] sm:text-xs leading-relaxed text-slate-700 text-justify">
              {personal.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-2">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-900 border-b-2 border-teal-50 pb-0.5 mb-2">
              Work Experience
            </h2>
            <div className="flex flex-col gap-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="print-section flex flex-col gap-0.5">
                  <div className="flex justify-between items-baseline text-[12px]">
                    <span className="font-bold text-slate-800">
                      {exp.role} <span className="font-normal text-slate-500">| {exp.company}</span>
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">{exp.period}</span>
                  </div>
                  {exp.description && (
                    <ul className="text-[11px] sm:text-xs leading-relaxed text-slate-700 list-disc list-outside ml-3 mt-1 space-y-0.5 marker:text-slate-400">
                      {exp.description.split('\n').filter(Boolean).map((line, i) => (
                        <li key={i} className="pl-1">{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-2">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-900 border-b-2 border-teal-50 pb-0.5 mb-2">
              Education
            </h2>
            <div className="flex flex-col gap-1.5">
              {education.map((edu) => (
                <div key={edu.id} className="print-section flex justify-between items-baseline text-[11px] sm:text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block sm:inline">{edu.school}</span>
                    <span className="text-slate-800 hidden sm:inline">, </span>
                    <span className="text-slate-600 italic">{edu.degree}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 block">{edu.year}</span>
                    {edu.gpa && <span className="text-[10px] text-slate-500">GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio / Projects */}
        {portfolio.length > 0 && (
          <div className="mb-2">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-900 border-b-2 border-teal-50 pb-0.5 mb-2">
              Projects & Portfolio
            </h2>
            <div className="flex flex-col gap-2.5">
              {portfolio.map((port) => (
                <div key={port.id} className="print-section flex flex-col gap-0.5 text-[11px] sm:text-xs">
                  <div className="font-bold text-slate-800">
                    {port.name} {port.link && <span className="font-normal text-teal-600 underline ml-1"><a href={port.link.startsWith('http') ? port.link : `https://${port.link}`} target="_blank" rel="noreferrer">{port.link.replace('https://', '')}</a></span>}
                  </div>
                  {port.description && (
                    <ul className="text-slate-700 leading-relaxed list-disc list-outside ml-3 mt-1 space-y-0.5 marker:text-slate-400">
                      {port.description.split('\n').filter(Boolean).map((line, i) => (
                        <li key={i} className="pl-1">{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mb-2">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-900 border-b-2 border-teal-50 pb-0.5 mb-2">
              Certifications & Courses
            </h2>
            <div className="flex flex-col gap-1">
              {certifications.map((cert) => (
                <div key={cert.id} className="print-section flex justify-between items-baseline text-[11px] sm:text-xs">
                  <span className="font-bold text-slate-800">{cert.title} <span className="font-normal text-slate-500">({cert.issuer})</span></span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">{cert.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills & Languages (2 Columns) */}
        <div className="print-section grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
          <div>
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-900 border-b-2 border-teal-50 pb-0.5 mb-2">
              Technical Skills
            </h2>
            <div className="flex flex-wrap gap-1">
              {hardSkills.map((skill, idx) => (
                <span key={idx} className="text-slate-700 border border-slate-200 bg-slate-50 text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            {softSkills.length > 0 && (
              <div>
                <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-900 border-b-2 border-teal-50 pb-0.5 mb-1.5">
                  Soft Skills
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-700 leading-relaxed">
                  {softSkills.join(' • ')}
                </p>
              </div>
            )}
            {languages && (
              <div>
                <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-900 border-b-2 border-teal-50 pb-0.5 mb-1.5">
                  Languages
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-700 leading-relaxed">
                  {languages}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}