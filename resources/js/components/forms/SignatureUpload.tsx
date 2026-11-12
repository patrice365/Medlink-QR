import React, { useId, useRef, useState } from 'react';
import { ImageUpIcon, RefreshCwIcon, Trash2Icon } from 'lucide-react';

interface SignatureUploadProps {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  required?: boolean;
  error?: string;
  hint?: string;
}

const MAX_WIDTH = 640;

export function SignatureUpload({ label, value, onChange, required, error, hint }: SignatureUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [readError, setReadError] = useState('');

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setReadError('Please choose an image file (PNG or JPG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, MAX_WIDTH / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        onChange(canvas.toDataURL('image/png'));
        setReadError('');
      };
      img.onerror = () => setReadError('That image could not be read. Try another one.');
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const shownError = readError || error;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span id={id} className="text-sm font-medium text-ink">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </span>
        {hint && <span className="text-[13px] text-ink-soft">{hint}</span>}
      </div>

      {value ?
      <div className={`rounded-[10px] border bg-white p-4 ${shownError ? 'border-danger' : 'border-line'}`}>
          <img src={value} alt="Uploaded guardian signature" className="mx-auto h-28 w-full object-contain" />
          <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-line pt-3">
            <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-secondary-ink transition-colors duration-150 hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20">
            
              <RefreshCwIcon className="h-4 w-4" aria-hidden="true" /> Replace
            </button>
            <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-danger transition-colors duration-150 hover:bg-danger-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-danger/20">
            
              <Trash2Icon className="h-4 w-4" aria-hidden="true" /> Remove
            </button>
          </div>
        </div> :

      <button
        type="button"
        aria-labelledby={id}
        onClick={() => inputRef.current?.click()}
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed px-4 py-8 text-center transition-[border-color,background-color] duration-150 ease-out hover:border-brand-royal hover:bg-tint focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20 ${
        shownError ? 'border-danger bg-white' : 'border-ink-faint bg-canvas'}`
        }>
        
          <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary">
            <ImageUpIcon className="h-5 w-5 text-secondary-ink" aria-hidden="true" />
          </span>
          <span className="text-[15px] font-medium text-brand-royal">Upload photo of signature</span>
          <span className="text-[13px] text-ink-soft">Take a photo or choose a PNG / JPG file</span>
        </button>
      }

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = '';
        }} />
      
      {shownError && <p className="mt-1.5 text-[13px] text-danger">{shownError}</p>}
    </div>);

}