import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
}

const ADULT_SIZES = [
  { size: 'XS', chest: '34–36 in', length: '27.0 in', height: '160–168 cm' },
  { size: 'S', chest: '36–38 in', length: '27.8 in', height: '168–174 cm' },
  { size: 'M', chest: '38–40 in', length: '28.5 in', height: '174–180 cm' },
  { size: 'L', chest: '41–43 in', length: '29.3 in', height: '180–186 cm' },
  { size: 'XL', chest: '44–46 in', length: '30.2 in', height: '186–192 cm' },
  { size: 'XXL', chest: '47–49 in', length: '31.0 in', height: '192–198 cm' },
];

export function SizeGuideModal({ open, onClose }: SizeGuideModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#F3EADB] p-6 shadow-2xl"
            role="dialog"
            aria-label="Jerseology Size Guide"
          >
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div>
                <p className="font-mono-label text-[11px] uppercase tracking-wider text-[#AD2828]">
                  Fit & Measurements
                </p>
                <h3 className="font-display text-2xl uppercase text-[#111111]">
                  Jerseology Size Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close size guide"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#111111]/75">
              Fan Version kits follow a relaxed European straight cut. For Player Version athletic slim-fit kits, we recommend sizing up one size if you prefer a casual street drape.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-black/15 font-mono-label uppercase text-[#111111]/60">
                    <th className="py-2.5 pr-4">Size</th>
                    <th className="py-2.5 pr-4">Chest</th>
                    <th className="py-2.5 pr-4">Garment Length</th>
                    <th className="py-2.5">Recommended Height</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 font-mono-label tabular-nums">
                  {ADULT_SIZES.map((row) => (
                    <tr key={row.size}>
                      <td className="py-2.5 pr-4 font-semibold text-[#111111]">{row.size}</td>
                      <td className="py-2.5 pr-4 text-[#111111]/80">{row.chest}</td>
                      <td className="py-2.5 pr-4 text-[#111111]/80">{row.length}</td>
                      <td className="py-2.5 text-[#111111]/80">{row.height}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
