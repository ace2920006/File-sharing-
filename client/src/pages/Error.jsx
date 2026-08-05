import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AlertOctagon, ArrowLeft, Home, RefreshCw } from 'lucide-react';

const Error = () => {
  const location = useLocation();
  const errorMessage = location.state?.message || 'File not found, link has expired, or download limit reached.';

  return (
    <div className="py-16 px-4 max-w-md mx-auto text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-500 mx-auto flex items-center justify-center shadow-lg shadow-rose-500/10 animate-bounce">
        <AlertOctagon className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-heading font-bold text-slate-100">Link Unavailable</h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {errorMessage}
        </p>
      </div>

      <div className="glass-card rounded-2xl p-4 border border-slate-800 text-xs text-slate-400">
        <p>
          SecureShare automatically purges files when their expiration timer expires or when download limits are met for user privacy.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" /> Go to Home
        </Link>
        <Link
          to="/upload"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 transition-all"
        >
          Upload New File
        </Link>
      </div>
    </div>
  );
};

export default Error;
