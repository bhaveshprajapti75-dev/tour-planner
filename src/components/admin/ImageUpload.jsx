/**
 * Reusable image upload component with preview, drag-and-drop, and multi-file support.
 */
import { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

/**
 * @param {File[]}   files       - array of File objects (new uploads)
 * @param {Function} onChange    - (files: File[]) => void
 * @param {Object[]} existing    - [{ id, image }] already-saved images (for edit mode)
 * @param {Function} onRemoveExisting - (id) => void — called when user clicks X on an existing image
 * @param {boolean}  multiple    - allow multiple files (default true)
 * @param {string}   label       - field label
 */
export default function ImageUpload({
  files = [],
  onChange,
  existing = [],
  onRemoveExisting,
  multiple = true,
  label = 'Images',
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (newFiles) => {
    const fileList = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
    if (!fileList.length) return;
    onChange?.(multiple ? [...files, ...fileList] : [fileList[0]]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (idx) => {
    onChange?.(files.filter((_, i) => i !== idx));
  };

  const previews = files.map((f, i) => ({
    id: `new-${i}`,
    url: URL.createObjectURL(f),
    name: f.name,
    isNew: true,
    idx: i,
  }));

  const existingPreviews = existing.map(img => ({
    id: img.id,
    url: img.image,
    name: `Image #${img.id}`,
    isNew: false,
  }));

  const allPreviews = [...existingPreviews, ...previews];

  return (
    <div>
      {label && (
        <label className="block text-sm font-bold text-ink dark:text-white mb-1.5">{label}</label>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${
          dragOver
            ? 'border-brand bg-brand/5'
            : 'border-gray-200 dark:border-white/[0.12] hover:border-brand/50'
        }`}
      >
        <Upload className="w-5 h-5 text-ink-light dark:text-white/50 mb-1" />
        <span className="text-xs font-medium text-ink-light dark:text-white/50">
          {multiple ? 'Click or drag images here' : 'Click or drag an image here'}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Previews */}
      {allPreviews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {allPreviews.map((p) => (
            <div key={p.id} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-white/[0.08]">
              <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (p.isNew) removeFile(p.idx);
                  else onRemoveExisting?.(p.id);
                }}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
              {p.isNew && (
                <span className="absolute bottom-0 left-0 right-0 bg-brand/80 text-white text-[8px] text-center py-0.5 font-bold">NEW</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
