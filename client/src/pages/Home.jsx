import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Upload, Lock, Clock, Download, Cpu, Key, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-500 text-xs font-semibold tracking-wide uppercase shadow-lg shadow-brand-500/10 animate-pulse">
          <ShieldCheck className="w-4 h-4" /> Zero-Knowledge Anonymous File Host
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-slate-100 tracking-tight leading-tight">
          Share Encrypted Files <br />
          <span className="gradient-text">Without Accounts or Friction.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Upload any file up to 100 MB. Instant end-to-end AES-256-GCM encryption, optional password locks, custom expiration timers, and automatic purge.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/upload"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 via-brand-cyan to-brand-violet text-slate-950 font-heading font-bold text-base shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5 stroke-[2.5]" />
            Upload File Now
          </Link>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8">
        <div className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-heading font-bold text-slate-100">AES-256-GCM Encryption</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every payload is encrypted on disk using military-grade AES-256-GCM cipher before write operations.
          </p>
        </div>

        <div className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan shadow-md">
            <Key className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-heading font-bold text-slate-100">Password Locks</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Set an optional password hashed with bcrypt to ensure only authorized recipients can decrypt the file.
          </p>
        </div>

        <div className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-violet/10 border border-brand-violet/30 flex items-center justify-center text-brand-violet shadow-md">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-heading font-bold text-slate-100">Auto Expiry & Limits</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Specify download limits (e.g. self-destruct after 1 download) or custom expiration hours with background cron purge.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
