import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import { supabase } from '../supabase';
import {
  HiPlus,
  HiDocumentText,
  HiTrash,
  HiPencilSquare,
  HiArrowRightOnRectangle,
  HiSparkles
} from 'react-icons/hi2';

export default function Dashboard({ user, onSelectCv, onNewCv, onLogout }) {
  const [cvList, setCvList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchCvs();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!error && data) setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCvs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      setCvList(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCv = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Hapus CV ini?')) return;
    try {
      const { error } = await supabase.from('cvs').delete().eq('id', id);
      if (error) throw error;
      setCvList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const isPro = profile?.tier === 'pro';

  const handleUpgrade = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      const response = await fetch(`${API_BASE_URL}/api/payment/token`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData?.session?.access_token || ''}`
        },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email
        })
      });
      const data = await response.json();
      
      if (data.token) {
        window.snap.pay(data.token, {
          onSuccess: async function(result){
            try {
              // 1. Eksekusi update langsung via Frontend menggunakan auth user login
              const { error } = await supabase
                .from('profiles')
                .update({ tier: 'pro' })
                .eq('id', user.id);
                
              if (error) {
                console.error("Gagal update profil:", error);
                alert('Pembayaran sukses namun gagal mengupdate status.');
              } else {
                // Berhasil! Paksa refresh halaman
                window.location.reload();
              }
            } catch (err) {
              console.error("Kesalahan jaringan:", err);
            }
          },
          onPending: function(result){
            console.log('Menunggu pembayaran Anda...');
          },
          onError: function(result){
            console.error('Pembayaran gagal');
          },
          onClose: function(){
            console.log('Customer closed the popup without finishing the payment');
          }
        });
      } else {
        console.error('Gagal mengambil token pembayaran');
      }
    } catch (err) {
      console.error('Terjadi kesalahan jaringan');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center rounded-xl text-white">
            <HiDocumentText className="w-5 h-5" />
          </div>
          <span className="font-black text-slate-800 text-lg">ATSify</span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              isPro ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {isPro ? 'PRO PLAN' : 'FREE PLAN'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 hidden sm:inline">{user.email}</span>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-red-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <HiArrowRightOnRectangle className="w-4 h-4" /> Keluar
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8">
        {!isPro && (
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HiSparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-lg">Tingkatkan ke ATSify Pro</h3>
              </div>
              <p className="text-xs text-teal-100 max-w-xl">
                Buka Job Description Matcher, Cover Letter Generator instan, multi-template ATS premium, dan hapus watermark PDF.
              </p>
            </div>
            <button
              onClick={handleUpgrade}
              className="bg-white text-teal-900 font-black text-xs px-5 py-2.5 rounded-xl hover:bg-teal-50 transition-colors shrink-0 shadow-sm"
            >
              Upgrade Sekarang
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Daftar CV Anda</h1>
            <p className="text-xs text-slate-500">Kelola dan edit versi CV yang Anda simpan</p>
          </div>
          <button
            onClick={onNewCv}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <HiPlus className="w-4 h-4" /> Buat CV Baru
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Memuat data CV...</div>
        ) : cvList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <HiDocumentText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-sm mb-1">Belum ada CV tersimpan</h3>
            <p className="text-xs text-slate-400 mb-4">Buat CV pertama Anda sekarang</p>
            <button
              onClick={onNewCv}
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              <HiPlus className="w-4 h-4" /> Buat Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {cvList.map((cv) => (
              <div
                key={cv.id}
                onClick={() => onSelectCv(cv)}
                className="bg-white border border-slate-200 hover:border-teal-400 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                      <HiDocumentText className="w-5 h-5" />
                    </span>
                    <button
                      onClick={(e) => deleteCv(cv.id, e)}
                      className="text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-teal-700 transition-colors">
                    {cv.title || 'Untitled CV'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Target: {cv.data?.personal?.role || 'Belum diisi'}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Update: {new Date(cv.updated_at).toLocaleDateString('id-ID')}</span>
                  <span className="flex items-center gap-1 font-bold text-teal-600 group-hover:translate-x-0.5 transition-transform">
                    Edit <HiPencilSquare className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
