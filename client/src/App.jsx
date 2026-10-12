import React, { useState, useRef, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import CvForm from './components/CvForm';
import CvPreview from './components/CvPreview';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import JobMatcherModal from './components/JobMatcherModal';
import { supabase } from './supabase';
import { HiPencil, HiEye, HiSparkles } from 'react-icons/hi2';

const initialCvData = {
  personal: {
    fullName: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: ''
  },
  experiences: [],
  education: [],
  portfolio: [],
  certifications: [],
  skills: {
    hard: '',
    soft: ''
  },
  languages: ''
};

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'dashboard' | 'builder'
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [jobMatcherOpen, setJobMatcherOpen] = useState(false);
  const [currentCvId, setCurrentCvId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [cvTitle, setCvTitle] = useState('Untitled CV');

  const cvPrintRef = useRef(null);
  const [mobileView, setMobileView] = useState('form');
  const [cvData, setCvData] = useState(initialCvData);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const completionRate = useMemo(() => {
    let score = 0;
    if (cvData.personal?.fullName) score += 10;
    if (cvData.personal?.role) score += 10;
    if (cvData.personal?.email && cvData.personal?.phone) score += 10;
    if (cvData.personal?.summary && cvData.personal.summary.length > 50) score += 15;
    if (cvData.experiences?.length > 0 && cvData.experiences[0].description) score += 15;
    if (cvData.education?.length > 0 && cvData.education[0].school) score += 10;
    if (cvData.portfolio?.length > 0 && cvData.portfolio[0].name) score += 10;
    if (cvData.skills?.hard && cvData.skills.hard.split(',').length > 2) score += 10;
    if (cvData.certifications?.length > 0) score += 10;
    return Math.min(score, 100);
  }, [cvData]);

  const handlePrint = () => window.print();

  const handleStart = () => {
    if (user) {
      setView('dashboard');
    } else {
      setView('builder');
    }
  };

  const handleNewCv = () => {
    setCurrentCvId(null);
    setCvTitle('CV Baru');
    setCvData(JSON.parse(JSON.stringify(initialCvData)));
    setView('builder');
  };

  const handleSelectCv = (cv) => {
    setCurrentCvId(cv.id);
    setCvTitle(cv.title || 'Untitled CV');
    
    // Merge database CV with initial data to prevent undefined errors in form
    const loadedData = cv.data || {};
    const safeData = {
      personal: { ...initialCvData.personal, ...(loadedData.personal || {}) },
      experiences: Array.isArray(loadedData.experiences) ? loadedData.experiences : [],
      education: Array.isArray(loadedData.education) ? loadedData.education : [],
      portfolio: Array.isArray(loadedData.portfolio) ? loadedData.portfolio : [],
      certifications: Array.isArray(loadedData.certifications) ? loadedData.certifications : [],
      skills: { ...initialCvData.skills, ...(loadedData.skills || {}) },
      languages: loadedData.languages || ''
    };
    
    setCvData(safeData);
    setView('builder');
  };

  const handleSaveCv = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setSaving(true);
    try {
      const titleToSave = cvData.personal?.role
        ? `CV - ${cvData.personal.role}`
        : cvTitle || 'Untitled CV';

      if (currentCvId) {
        const { error } = await supabase
          .from('cvs')
          .update({
            title: titleToSave,
            data: cvData,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentCvId);
        if (error) throw error;
        // Hapus alert
      } else {
        const { data, error } = await supabase
          .from('cvs')
          .insert([
            {
              user_id: user.id,
              title: titleToSave,
              data: cvData
            }
          ])
          .select()
          .single();
        if (error) throw error;
        setCurrentCvId(data.id);
        // Hapus alert
      }
    } catch (err) {
      console.error('Gagal menyimpan:', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView('landing');
  };

  return (
    <>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          setView('dashboard');
        }}
      />

      <JobMatcherModal
        isOpen={jobMatcherOpen}
        onClose={() => setJobMatcherOpen(false)}
        cvData={cvData}
      />

      {view === 'landing' && (
        <LandingPage
          onStart={handleStart}
          onOpenAuth={() => setAuthModalOpen(true)}
          user={user}
        />
      )}

      {view === 'dashboard' && user && (
        <Dashboard
          user={user}
          onSelectCv={handleSelectCv}
          onNewCv={handleNewCv}
          onLogout={handleLogout}
        />
      )}

      {view === 'builder' && (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
          <div className="print:hidden">
            <Navbar
              onPrint={handlePrint}
              completionRate={completionRate}
              onSave={handleSaveCv}
              onGoDashboard={() => {
                if (user) setView('dashboard');
                else setView('landing');
              }}
              onOpenJobMatcher={() => setJobMatcherOpen(true)}
              user={user}
              saving={saving}
            />
          </div>

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative">
            <div className="flex lg:hidden mb-6 bg-white border border-slate-200 p-1 rounded-xl shadow-sm print:hidden">
              <button
                onClick={() => setMobileView('form')}
                className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  mobileView === 'form'
                    ? 'bg-teal-50 text-teal-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <HiPencil className="w-4 h-4" /> Edit Data
              </button>
              <button
                onClick={() => setMobileView('preview')}
                className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  mobileView === 'preview'
                    ? 'bg-teal-50 text-teal-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <HiEye className="w-4 h-4" /> Live Preview
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div
                className={`w-full lg:w-[45%] xl:w-[50%] flex-col gap-6 print:hidden ${
                  mobileView === 'form' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2.5">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black">AI Resume Builder</h1>
                    <p className="text-slate-500 text-xs sm:text-sm">
                      Isi data Anda dan gunakan fitur AI untuk menyusun teks standar ATS.
                    </p>
                  </div>
                  <button
                    onClick={() => setJobMatcherOpen(true)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md shadow-teal-200/50 transition-all active:scale-95 shrink-0"
                    title="Bandingkan CV dengan lowongan pekerjaan"
                  >
                    <HiSparkles className="w-4 h-4 shrink-0" />
                    <span>Job Matcher</span>
                  </button>
                </div>
                <CvForm cvData={cvData} setCvData={setCvData} />
              </div>

              <div
                className={`w-full lg:w-[55%] xl:w-[50%] flex justify-center print:w-full print:block ${
                  mobileView === 'preview' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                <div className="w-full max-w-[210mm]">
                  <CvPreview cvData={cvData} innerRef={cvPrintRef} />
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}

export default App;
