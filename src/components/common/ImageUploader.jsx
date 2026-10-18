import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export const ImageUploader = ({
  onImagesChange,
  maxImages = 3,
  className = ''
}) => {
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const currentCount = previews.length;
    const allowedNewCount = maxImages - currentCount;
    const filesToProcess = files.slice(0, allowedNewCount);

    filesToProcess.forEach(file => {
      if (!file.type.startsWith('image/')) {
        return; // Skip non-images
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviews(prev => {
          const updated = [...prev, base64String];
          if (onImagesChange) onImagesChange(updated);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const removeImage = (index) => {
    setPreviews(prev => {
      const updated = prev.filter((_, idx) => idx !== index);
      if (onImagesChange) onImagesChange(updated);
      return updated;
    });
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
        Upload Images (Max {maxImages})
      </span>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerInput}
        className="glass-input border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-brand-blue/50 dark:hover:border-brand-purple/50 transition-colors py-8 text-center"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 mb-3">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Drag & drop images here or <span className="text-brand-blue dark:text-brand-purple">browse</span>
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Supports JPG, PNG, WEBP (up to 5MB each)
        </p>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-1">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group shadow-sm">
              <img
                src={preview}
                alt={`preview-${index}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ImageUploader;
