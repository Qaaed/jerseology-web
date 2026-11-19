import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface VersionDiffSheetProps {
  open: boolean;
  onClose: () => void;
}

const VERSIONS = [
  {
    name: 'Fan Version',
    weight: '165 GSM Interlock',
    fit: 'Relaxed straight terrace cut',
    crest: 'Dense woven embroidered crest',
    priceNote: 'Base price (e.g. 4,850 LKR)',
    bestFor: 'Everyday street styling, layering, and comfort in tropical humidity.',
  },
  {
    name: 'Player Version',
    weight: '135 GSM Body-Mapped Jacquard',
    fit: 'Athletic slim-fit taper (size up 1 for relaxed fit)',
    crest: 'Featherlight heat-transferred TPU crest',
    priceNote: '+600 LKR over Fan',
    bestFor: '5-a-side matches, training, and ultra-light breathability.',
  },
  {
    name: 'GK Version',
    weight: '160 GSM Abrasion-Resistant Knit',
    fit: 'Roomy shoulder & underarm gusset',
    crest: 'Woven embroidered crest + padded cuff rib',
    priceNote: '+350 LKR over Fan',
    bestFor: 'Goalkeepers and collectors seeking standout contrast colourways.',
  },
  {
    name: 'Retro Reissue',
    weight: '210 GSM Heritage Poly-Cotton Jacquard',
    fit: 'Boxy 1990s / 2000s archival drape',
    crest: 'Embroidered crest + fold-over collar',
    priceNote: '6,350 LKR standard',
    bestFor: 'Heritage collectors and high-fashion editorial streetwear looks.',
  },
];

export function VersionDiffSheet({ open, onClose }: VersionDiffSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#F3EADB] p-6 shadow-2xl overflow-y-auto"
            aria-label="Kit Version Comparison"
          >
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div>
                <p className="font-mono-label text-[11px] uppercase tracking-wider text-[#AD2828]">
                  Specification Breakdown
                </p>
                <h3 className="font-display text-2xl uppercase text-[#111111]">
                  What&apos;s the difference?
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close comparison"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 divide-y divide-black/10">
              {VERSIONS.map((v) => (
                <div key={v.name} className="py-5 first:pt-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-display text-xl uppercase text-[#111111]">{v.name}</h4>
                    <span className="font-mono-label text-[11px] uppercase text-[#AD2828]">
                      {v.priceNote}
                    </span>
                  </div>
                  <dl className="mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#111111]/55">Fabric</dt>
                      <dd className="text-right font-medium text-[#111111]">{v.weight}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#111111]/55">Fit</dt>
                      <dd className="text-right font-medium text-[#111111]">{v.fit}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#111111]/55">Crest</dt>
                      <dd className="text-right font-medium text-[#111111]">{v.crest}</dd>
                    </div>
                  </dl>
                  <p className="mt-2.5 text-xs leading-relaxed text-[#111111]/70">{v.bestFor}</p>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
