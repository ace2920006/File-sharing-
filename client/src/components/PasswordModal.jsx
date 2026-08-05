import React, { useState } from 'react';
import { Lock, KeyRound, ArrowRight, Eye, EyeOff } from 'lucide-react';

const PasswordModal = ({ onVerify, isVerifying, errorMsg }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    onVerify(password.trim());
  };

  return (
    <div className="w-full max-w-md mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-brand-500/30 shadow-2xl space-y-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-brand-violet/10 border border-brand-violet/30 text-brand-violet mx-auto flex items-center justify-center shadow-lg shadow-brand-violet/10">
        <Lock className="w-7 h-7" />
      </div>

      <div>
        <h3 className="text-xl font-heading font-bold text-slate-100">Password Protected File</h3>
        <p className="text-xs text-slate-400 mt-1">
          This file is encrypted with password security. Enter the password below to decrypt and download.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-brand-violet" /> Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter file password"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errorMsg && (
            <p className="text-xs text-rose-400 font-medium mt-1 animate-shake">
              {errorMsg}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isVerifying || !password.trim()}
          className="w-full py-3 rounded-xl font-heading font-bold text-sm bg-gradient-to-r from-brand-violet via-brand-cyan to-brand-500 hover:opacity-95 text-slate-950 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-brand-violet/20 disabled:opacity-50"
        >
          {isVerifying ? (
            <span>Verifying Password...</span>
          ) : (
            <>
              Unlock File <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PasswordModal;
