import { Truck, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../store/useStore';

export function ShippingModal() {
  const open = useStore((s) => s.isShippingModalOpen);
  const setOpen = useStore((s) => s.setShippingModalOpen);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#F3EADB] p-6 shadow-2xl"
            role="dialog"
            aria-label="Island-Wide Shipping Details"
          >
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Truck className="h-5 w-5 text-[#AD2828]" />
                <h3 className="font-display text-2xl uppercase text-[#111111]">
                  Island-Wide Delivery
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close shipping modal"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#111111]/80">
              <p>
                <strong>Colombo & Suburbs (1–24 hours):</strong> Same-day or next-morning rider dispatch from our Colombo 07 studio.
              </p>
              <p>
                <strong>Outstation Sri Lanka (2–3 working days):</strong> Tracked courier delivery to Kandy, Galle, Jaffna, Kurunegala, Negombo, and every district island-wide.
              </p>
              <p>
                <strong>Rates & COD:</strong> Flat 450 LKR courier fee, or complimentary on orders over 15,000 LKR. Cash on Delivery, Visa/Mastercard, and LankaQR bank transfer accepted.
              </p>
              <p className="text-xs text-[#111111]/60">
                Custom name-set and patch orders require an additional 24 hours for studio heat-press curing.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
