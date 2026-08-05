import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, QrCode, ExternalLink, ShieldCheck, Download, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const QRCodeCard = ({ shareUrl, fileName, expiresAt, downloadLimit }) => {
  const [copied, setCopied] = useState(false);

  const fullUrl = `${window.location.origin}${shareUrl}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success('Share link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-brand-500/30 shadow-2xl space-y-6 text-center animate-fade-in">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-500 mb-1">
        <ShieldCheck className="w-8 h-8" />
      </div>

      <div>
        <h3 className="text-2xl font-heading font-bold text-slate-100">File Encrypted & Ready!</h3>
        <p className="text-xs text-slate-400 mt-1">
          Share this unique URL or scan the QR code to download <span className="text-slate-200 font-semibold">{fileName}</span>
        </p>
      </div>

      {/* Share Link Copy Box */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 block text-left">Shareable Encrypted Link</label>
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 pl-4">
          <input
            type="text"
            readOnly
            value={fullUrl}
            className="w-full bg-transparent text-sm font-mono text-brand-cyan focus:outline-none select-all"
          />
          <button
            onClick={copyToClipboard}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all duration-200 ${
              copied
                ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* QR Code Container */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 flex flex-col items-center gap-4">
        <div className="p-3 bg-white rounded-xl shadow-lg">
          <QRCodeSVG
            value={fullUrl}
            size={160}
            level="H"
            includeMargin={false}
          />
        </div>
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <QrCode className="w-3.5 h-3.5 text-brand-cyan" /> Scan with smartphone camera to open link
        </p>
      </div>

      {/* File Expiry / Limit Badges */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex flex-col items-center">
          <span className="text-slate-400">Expires At</span>
          <span className="font-semibold text-slate-200 mt-0.5">{formatDate(expiresAt)}</span>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex flex-col items-center">
          <span className="text-slate-400">Download Limit</span>
          <span className="font-semibold text-slate-200 mt-0.5">
            {downloadLimit ? `${downloadLimit} downloads` : 'Unlimited'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QRCodeCard;
