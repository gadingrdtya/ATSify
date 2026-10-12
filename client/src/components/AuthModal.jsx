import React, { useState } from 'react';
import { supabase } from '../supabase';
import { HiXMark, HiEnvelope, HiLockClosed } from 'react-icons/hi2';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        if (data?.user && !data.session) {
          setInfoMsg('Cek inbox email untuk verifikasi akun.');
        } else {
          onSuccess(data.user);
          onClose();
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        onSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <HiXMark className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-slate-800 mb-1">
          {isSignUp ? 'Buat Akun ATSify' : 'Masuk ke Akun'}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          {isSignUp
            ? 'Simpan banyak CV dan akses fitur AI pro'
            : 'Akses CV tersimpan dan fitur akun'}
        </p>

        {errorMsg && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-100">
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 border border-emerald-100">
            {infoMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Email
            </label>
            <div className="relative flex items-center">
              <HiEnvelope className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="input-modern !pl-10 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <HiLockClosed className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="input-modern !pl-10 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Memproses...' : isSignUp ? 'Daftar' : 'Masuk'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-500">
          {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
              setInfoMsg('');
            }}
            className="font-bold text-teal-600 hover:underline"
          >
            {isSignUp ? 'Masuk' : 'Daftar sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
}
