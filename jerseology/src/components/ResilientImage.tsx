import { useState } from 'react';
import { Shirt } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackBg?: string;
}

export function ResilientImage({
  src,
  alt,
  className = 'h-full w-full object-cover',
  fallbackBg = '#E7E1D6',
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center"
        style={{ backgroundColor: fallbackBg }}
        role="img"
        aria-label={alt}
      >
        <Shirt className="h-8 w-8 text-[#111111]/40" strokeWidth={1.5} />
        <span className="font-mono-label text-[11px] uppercase tracking-wider text-[#111111]/60">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
    />
  );
}
