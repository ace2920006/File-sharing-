import React from 'react';
import { Loader2, HardDriveUpload } from 'lucide-react';

const ProgressBar = ({ progress, fileName, loadedBytes, totalBytes }) => {
  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full glass-card rounded-2xl p-6 border border-brand-500/30 shadow-xl shadow-brand-500/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
            <HardDriveUpload className="w-5 h-5 text-brand-500 animate-bounce" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-xs">
              {fileName || 'Uploading file...'}
            </h4>
            <p className="text-xs text-slate-400 font-mono">
              {formatSize(loadedBytes)} / {formatSize(totalBytes)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-brand-cyan animate-spin" />
          <span className="text-sm font-bold text-brand-500 font-mono">{progress}%</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <div
          className="h-full bg-gradient-to-r from-brand-500 via-brand-cyan to-brand-violet rounded-full transition-all duration-300 shadow-md shadow-brand-500/30"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-center text-xs text-slate-400 font-medium animate-pulse">
        Encrypting with AES-256-GCM and uploading file payload...
      </p>
    </div>
  );
};

export default ProgressBar;
