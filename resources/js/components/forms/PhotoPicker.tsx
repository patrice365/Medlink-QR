import React, { useRef, useState } from 'react';
import { CameraIcon } from 'lucide-react';

interface PhotoPickerProps {
  value: string;
  onChange: (dataUrl: string) => void;
}

const OUTPUT_SIZE = 360;

export function PhotoPicker({ value, onChange }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = OUTPUT_SIZE;
        canvas.height = OUTPUT_SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const side = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
        onChange(canvas.toDataURL('image/jpeg', 0.82));
        setError('');
      };
      img.onerror = () => setError('That photo could not be read. Try another one.');
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-2 sm:items-start">
      <span className="text-sm font-medium text-ink">2×2 ID photo</span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label={value ? 'Change ID photo' : 'Add ID photo'}
        className={`grid h-36 w-36 place-items-center overflow-hidden rounded-2xl border transition-[border-color,background-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20 ${
        value ? 'border-line' : 'border-dashed border-ink-faint bg-canvas hover:border-brand-royal hover:bg-tint'}`
        }>
        
        {value ?
        <img src={value} alt="Your ID photo" className="h-full w-full object-cover" /> :

        <span className="flex flex-col items-center gap-2 px-3 text-center text-sm font-medium text-brand-royal">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary">
              <CameraIcon className="h-5 w-5 text-secondary-ink" aria-hidden="true" />
            </span>
            Take or upload
          </span>
        }
      </button>
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
      
      <p className="text-[13px] text-ink-soft">{value ? 'Tap the photo to retake' : 'Taken within the last 6 months'}</p>
      {error && <p className="text-[13px] text-danger">{error}</p>}
    </div>);

}