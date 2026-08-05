import React from 'react';
import { Shield, Lock, Cpu, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-dark-900/50 backdrop-blur-sm py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-500" />
          <span>AES-256-GCM Encrypted Storage & Anonymous Transfers</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-brand-cyan" /> No Login Required
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-brand-violet" /> Auto Expire & Purge
          </span>
        </div>

        <div>
          <span>SecureShare &copy; {new Date().getFullYear()} — Built with React & Express</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
