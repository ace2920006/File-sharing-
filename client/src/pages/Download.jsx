import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFileInfoApi, verifyPasswordApi, getDownloadUrl } from '../services/api';
import FilePreview from '../components/FilePreview';
import PasswordModal from '../components/PasswordModal';
import { Download as DownloadIcon, ShieldCheck, Lock, Clock, AlertTriangle, FileCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Download = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [fileInfo, setFileInfo] = useState(null);
  const [verifiedPassword, setVerifiedPassword] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true);
        const data = await getFileInfoApi(token);
        if (data.success) {
          setFileInfo(data);
          if (data.isPasswordProtected) {
            setNeedsPassword(true);
          }
        }
      } catch (err) {
        console.error('[Download Page Info Error]:', err);
        const errorMsg = err.response?.data?.message || 'File not found or expired.';
        navigate('/error', { state: { message: errorMsg } });
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [token, navigate]);

  const handlePasswordVerify = async (password) => {
    try {
      setIsVerifying(true);
      setPasswordError('');
      const res = await verifyPasswordApi(token, password);
      if (res.verified) {
        setVerifiedPassword(password);
        setNeedsPassword(false);
        toast.success('Password verified! File unlocked.');
      } else {
        setPasswordError('Incorrect password. Please try again.');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to verify password.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTriggerDownload = () => {
    try {
      setDownloading(true);
      const downloadUrl = getDownloadUrl(token, verifiedPassword);

      // Create invisible anchor to trigger browser download prompt
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileInfo?.originalName || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Decrypting & downloading file...');

      // Update remaining download count locally after 2s
      setTimeout(() => {
        setDownloading(false);
        if (fileInfo?.downloadLimit && fileInfo?.downloadLimit > 0) {
          setFileInfo((prev) => ({
            ...prev,
            downloadCount: (prev.downloadCount || 0) + 1,
            remainingDownloads: Math.max(0, (prev.remainingDownloads || 1) - 1)
          }));
        }
      }, 2000);
    } catch (e) {
      setDownloading(false);
      toast.error('Download failed.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-400">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium">Fetching file metadata & verifying link...</p>
      </div>
    );
  }

  if (needsPassword) {
    return (
      <div className="py-12 px-4 max-w-xl mx-auto">
        <PasswordModal
          onVerify={handlePasswordVerify}
          isVerifying={isVerifying}
          errorMsg={passwordError}
        />
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-500 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" /> Ready for Decryption
        </div>
        <h2 className="text-3xl font-heading font-bold text-slate-100">Download Encrypted File</h2>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        {/* File Preview Header */}
        <FilePreview
          mimeType={fileInfo?.mimeType}
          fileName={fileInfo?.originalName}
          size={fileInfo?.size}
        />

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-brand-cyan shrink-0" />
            <div>
              <p className="text-slate-400">Expiration</p>
              <p className="font-semibold text-slate-200 truncate">{formatDate(fileInfo?.expiresAt)}</p>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 flex items-center gap-2.5">
            <FileCheck className="w-4 h-4 text-brand-violet shrink-0" />
            <div>
              <p className="text-slate-400">Downloads Remaining</p>
              <p className="font-semibold text-slate-200">
                {fileInfo?.downloadLimit ? fileInfo?.remainingDownloads : 'Unlimited'}
              </p>
            </div>
          </div>
        </div>

        {/* Download Action Button */}
        <button
          onClick={handleTriggerDownload}
          disabled={downloading}
          className="w-full py-4 rounded-2xl font-heading font-bold text-base bg-gradient-to-r from-brand-500 via-brand-cyan to-brand-violet hover:opacity-95 text-slate-950 flex items-center justify-center gap-2.5 shadow-xl shadow-brand-500/25 transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          <DownloadIcon className="w-5 h-5 stroke-[2.5]" />
          {downloading ? 'Decrypting Payload...' : 'Decrypt & Download File'}
        </button>
      </div>
    </div>
  );
};

export default Download;
