import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const FAQS = [
  {
    q: 'What are your shipping options?',
    a: 'We dispatch island-wide across Sri Lanka within 2–3 working days from Colombo. Orders over LKR 15,000 ship free; smaller orders carry a flat courier fee calculated at checkout. International express dispatch is available for most jerseys.',
  },
  {
    q: 'Can I personalise my jersey with a name and number?',
    a: 'Yes — Fan and Player versions support custom name sets (up to 12 uppercase characters) and squad numbers 0–99. Personalisation uses matte polyurethane heat press in the official club typeface and adds approximately 48 hours to dispatch.',
  },
  {
    q: 'What is your returns and exchange policy?',
    a: 'Unworn jerseys with tags intact can be exchanged for a different size within 14 days of delivery. Personalised items (name sets, patches, bespoke squad orders) are final sale once production has started.',
  },
  {
    q: 'How do I know which size will fit me best?',
    a: 'Each product page includes a detailed size guide with chest and length measurements per club. Fan versions run true to Sri Lankan and EU streetwear sizing; Player versions have an athletic taper — size up one for a looser drape.',
  },
  {
    q: 'Do you offer bulk pricing for squads and teams?',
    a: 'Yes — we outfit 7-a-side squads, academies, and corporate tournaments. Contact our Colombo studio via the Contact page for custom squad pricing, name-set pressing, and priority dispatch.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative bg-[#F3EADB] py-20 lg:py-28">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-10">
        <div className="text-center">
          <p className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C93636]">
            Answers Before Kick-Off
          </p>
          <h2
            className="font-editorial mt-3 uppercase leading-[0.9] text-[#1A1A1A]"
            style={{ fontSize: 'clamp(2.25rem, 4.6vw, 3.75rem)' }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-14 divide-y divide-[#D9CEBF] border-y border-[#D9CEBF]">
          {FAQS.map((faq, i) => {
            const open = openIndex === i;
            const id = `faq-panel-${i}`;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={id}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-[#C93636]"
                >
                  <div className="flex items-baseline gap-5">
                    <span className="font-mono-label text-sm font-semibold text-[#C93636]">
                      0{i + 1}
                    </span>
                    <span className="text-base font-semibold text-[#1A1A1A] sm:text-lg">
                      {faq.q}
                    </span>
                  </div>
                  <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="shrink-0 text-[#1A1A1A]/60"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={id}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-3xl pb-6 pl-10 pr-10 text-[15px] leading-relaxed text-[#1A1A1A]/80">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
