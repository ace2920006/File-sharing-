import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Upload, Lock, ExternalLink } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-dark-900/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 via-brand-cyan to-brand-violet p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-brand-500 group-hover:text-brand-cyan transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              Secure<span className="gradient-text">Share</span>
            </span>
            <span className="text-[10px] tracking-wider text-slate-400 font-mono uppercase -mt-1">
              Encrypted & Anonymous
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              location.pathname === '/'
                ? 'bg-slate-800 text-brand-500 border border-slate-700/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Home
          </Link>
          <Link
            to="/upload"
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 shadow-md ${
              location.pathname === '/upload'
                ? 'bg-gradient-to-r from-brand-500 to-brand-cyan text-slate-950 shadow-brand-500/25 ring-2 ring-brand-500/30'
                : 'bg-brand-500 hover:bg-brand-600 text-slate-950 shadow-brand-500/20 hover:shadow-brand-500/30'
            }`}
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            Upload File
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
