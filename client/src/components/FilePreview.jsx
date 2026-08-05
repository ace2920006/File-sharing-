import React from 'react';
import { FileText, Image as ImageIcon, Film, Music, FileCode, Archive, File } from 'lucide-react';

const FilePreview = ({ mimeType, fileName, size }) => {
  const isImage = mimeType?.startsWith('image/');
  const isVideo = mimeType?.startsWith('video/');
  const isAudio = mimeType?.startsWith('audio/');
  const isPdf = mimeType === 'application/pdf';
  const isZip = mimeType?.includes('zip') || mimeType?.includes('compressed');

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderIcon = () => {
    if (isImage) return <ImageIcon className="w-10 h-10 text-brand-cyan" />;
    if (isVideo) return <Film className="w-10 h-10 text-brand-violet" />;
    if (isAudio) return <Music className="w-10 h-10 text-emerald-400" />;
    if (isPdf) return <FileText className="w-10 h-10 text-rose-400" />;
    if (isZip) return <Archive className="w-10 h-10 text-amber-400" />;
    return <File className="w-10 h-10 text-brand-500" />;
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 flex flex-col items-center gap-3 text-center">
      <div className="w-20 h-20 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center shadow-inner">
        {renderIcon()}
      </div>

      <div>
        <h4 className="text-base font-semibold text-slate-100 truncate max-w-xs sm:max-w-md">
          {fileName}
        </h4>
        <div className="flex items-center justify-center gap-3 text-xs text-slate-400 mt-1 font-mono">
          <span>{formatSize(size)}</span>
          <span>•</span>
          <span className="uppercase">{mimeType?.split('/')[1] || 'FILE'}</span>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
