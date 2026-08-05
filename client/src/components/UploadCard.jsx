import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, Lock, Clock, Download, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadCard = ({ onStartUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [expirationHours, setExpirationHours] = useState('24');
  const [downloadLimit, setDownloadLimit] = useState('0');

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      const err = rejectedFiles[0].errors[0];
      if (err?.code === 'file-too-large') {
        toast.error('File size exceeds maximum limit of 100 MB.');
      } else {
        toast.error(err?.message || 'File upload rejected.');
      }
      return;
    }
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 100 * 1024 * 1024 // 100 MB
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    onStartUpload({
      file: selectedFile,
      password: password.trim(),
      expirationHours,
      downloadLimit
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
            : selectedFile
            ? 'border-brand-cyan/50 bg-slate-800/40'
            : 'border-slate-700/80 hover:border-brand-500/50 hover:bg-slate-800/30'
        }`}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 shadow-lg shadow-brand-500/10">
              <File className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-100 truncate max-w-xs sm:max-w-md">
                {selectedFile.name}
              </p>
              <p className="text-xs text-brand-cyan font-mono mt-1">
                {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown Type'}
              </p>
            </div>
            <span className="text-xs text-slate-400 underline hover:text-slate-200 mt-2">
              Click or drag another file to replace
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 group-hover:text-brand-500 transition-colors">
              <UploadCloud className="w-8 h-8 text-brand-500 animate-pulse" />
            </div>
            <div>
              <p className="text-base font-medium text-slate-200">
                {isDragActive ? 'Drop your file here...' : 'Drag & Drop your file here, or browse'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports Images, Documents, Videos, PDFs, ZIP up to <span className="text-slate-200 font-semibold">100 MB</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Security & Expiration Options Form */}
      <form onSubmit={handleUploadSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Expiration Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-cyan" /> Link Expiration
            </label>
            <select
              value={expirationHours}
              onChange={(e) => setExpirationHours(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="1">1 Hour</option>
              <option value="6">6 Hours</option>
              <option value="24">24 Hours (1 Day)</option>
              <option value="168">7 Days</option>
              <option value="720">30 Days</option>
              <option value="0">Never Expire</option>
            </select>
          </div>

          {/* Download Limits Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-brand-violet" /> Download Limit
            </label>
            <select
              value={downloadLimit}
              onChange={(e) => setDownloadLimit(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="0">Unlimited Downloads</option>
              <option value="1">1 Download Only (Self-Destruct)</option>
              <option value="5">5 Downloads</option>
              <option value="10">10 Downloads</option>
              <option value="50">50 Downloads</option>
            </select>
          </div>
        </div>

        {/* Optional Password Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-brand-500" /> Password Protection (Optional)
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank for no password"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            If set, receivers will be required to enter this password before decrypting the file.
          </p>
        </div>

        {/* Submit Upload Button */}
        <button
          type="submit"
          disabled={!selectedFile}
          className={`w-full py-3.5 rounded-xl font-heading font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-xl ${
            selectedFile
              ? 'bg-gradient-to-r from-brand-500 via-brand-cyan to-brand-violet hover:opacity-95 text-slate-950 shadow-brand-500/25 cursor-pointer transform active:scale-[0.99]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
          }`}
        >
          <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          Encrypt & Upload File Now
        </button>
      </form>
    </div>
  );
};

export default UploadCard;
