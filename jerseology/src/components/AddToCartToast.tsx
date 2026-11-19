import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { ResilientImage } from './ResilientImage';

export function AddToCartToast() {
  const toast = useStore((s) => s.toast);
  const dismissToast = useStore((s) => s.dismissToast);
  const setCartOpen = useStore((s) => s.setCartOpen);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-4 top-24 z-50 flex w-80 items-center gap-3 rounded-lg border border-black/10 bg-[#111111] p-3 text-[#F3EADB] shadow-2xl"
          role="status"
          aria-live="polite"
        >
          <div className="h-12 w-10 shrink-0 overflow-hidden rounded bg-[#E7E1D6]">
            <ResilientImage src={toast.image} alt={toast.subtitle} />
          </div>
          <div className="flex-1 min-w-0">
            <button
              type="button"
              onClick={() => {
                dismissToast();
                setCartOpen(true);
              }}
              className="text-left text-xs font-semibold text-[#F3EADB] hover:text-[#AD2828] transition-colors"
            >
              {toast.title}
            </button>
            <p className="truncate font-mono-label text-[11px] text-[#F3EADB]/65">
              {toast.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={dismissToast}
            aria-label="Dismiss notification"
            className="inline-flex h-7 w-7 items-center justify-center rounded text-[#F3EADB]/60 hover:text-[#F3EADB]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
