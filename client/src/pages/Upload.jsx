import React, { useState } from 'react';
import UploadCard from '../components/UploadCard';
import ProgressBar from '../components/ProgressBar';
import QRCodeCard from '../components/QRCodeCard';
import { uploadFileApi } from '../services/api';
import toast from 'react-hot-toast';

const Upload = () => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'uploading' | 'success'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadedBytes, setLoadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);
  const [resultData, setResultData] = useState(null);

  const handleStartUpload = async ({ file, password, expirationHours, downloadLimit }) => {
    try {
      setCurrentFile(file);
      setStatus('uploading');
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', file);
      if (password) formData.append('password', password);
      if (expirationHours) formData.append('expirationHours', expirationHours);
      if (downloadLimit) formData.append('downloadLimit', downloadLimit);

      const response = await uploadFileApi(formData, (percent, loaded, total) => {
        setUploadProgress(percent);
        setLoadedBytes(loaded);
        setTotalBytes(total);
      });

      if (response && response.success) {
        setResultData(response);
        setStatus('success');
        toast.success('File uploaded and encrypted successfully!');
      } else {
        throw new Error(response?.message || 'Upload failed.');
      }
    } catch (error) {
      console.error('[Upload Page Error]:', error);
      setStatus('idle');
      toast.error(error.response?.data?.message || error.message || 'Failed to upload file.');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setUploadProgress(0);
    setCurrentFile(null);
    setResultData(null);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-heading font-bold text-slate-100">Upload Secure File</h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Files are encrypted before storage and given a secure, non-guessable URL.
        </p>
      </div>

      {status === 'idle' && (
        <UploadCard onStartUpload={handleStartUpload} />
      )}

      {status === 'uploading' && (
        <ProgressBar
          progress={uploadProgress}
          fileName={currentFile?.name}
          loadedBytes={loadedBytes}
          totalBytes={totalBytes}
        />
      )}

      {status === 'success' && resultData && (
        <div className="space-y-6">
          <QRCodeCard
            shareUrl={resultData.url}
            fileName={resultData.originalName}
            expiresAt={resultData.expiresAt}
            downloadLimit={resultData.downloadLimit}
          />
          <div className="text-center">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Upload Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
