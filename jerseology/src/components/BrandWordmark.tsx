import wordmarkUrl from '../assets/images/jerseyology-wordmark.png';

interface BrandWordmarkProps {
  className?: string;
  /** @deprecated retained for API compatibility; the raster wordmark has fixed colors. */
  color?: string;
}

export function BrandWordmark({ className = 'h-8 w-auto' }: BrandWordmarkProps) {
  return (
    <span className="inline-flex items-center whitespace-nowrap shrink-0" aria-label="Jerseyology">
      <img
        src={wordmarkUrl}
        alt="Jerseyology"
        className={className}
        draggable={false}
      />
    </span>
  );
}
