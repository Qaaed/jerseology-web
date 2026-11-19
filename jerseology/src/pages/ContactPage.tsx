import { useState, type FormEvent } from 'react';
import { CheckCircle2, ChevronDown, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

const FAQS = [
  {
    q: 'How do Fan Version and Player Version sizes compare?',
    a: 'Fan Version kits use a relaxed European straight cut true to standard Sri Lankan sizing. Player Version kits use a tapered athletic fit — if you prefer room around the torso, order one size up.',
  },
  {
    q: 'How fast is Island-Wide Shipping?',
    a: 'Colombo & immediate suburbs receive same-day or next-day courier delivery. Outstation orders (Kandy, Galle, Jaffna, Kurunegala, Matara) arrive within 2–3 working days.',
  },
  {
    q: 'What is your return and size exchange policy?',
    a: 'Standard unworn kits with tags intact can be exchanged for a different size within 7 days of delivery. Custom name-set or patched kits are bespoke final sale.',
  },
  {
    q: 'Are crests embroidered or heat-pressed?',
    a: 'Fan and Retro kits feature dense woven embroidered crests built for longevity. Player Version kits feature featherweight heat-bonded TPU crests matching pitch-spec shirts.',
  },
  {
    q: 'What are the lead times for Custom Team Kits?',
    a: 'You receive a tailored quote and digital mockup within 48 hours of contacting our studio via WhatsApp or the enquiry form above. Full squad production takes 7–10 working days.',
  },
  {
    q: 'Why choose Player Version vs Fan Version?',
    a: 'Choose Player Version for high-humidity 5-a-side matches and lightweight breathability (135 GSM). Choose Fan Version for everyday streetwear layering and embroidered durability (165 GSM).',
  },
  {
    q: 'How should I wash kits with custom Name Sets and Patches?',
    a: 'Turn the jersey inside out, machine wash cold on a gentle cycle (max 30°C), never use fabric softener or tumble dryers, and never iron directly over prints or badges.',
  },
  {
    q: 'Do you offer wholesale or corporate futsal pricing?',
    a: 'Yes — orders of 10+ jerseys qualify for tiered studio pricing. Select "Wholesale" in the enquiry form or message us on WhatsApp with your squad count.',
  },
];

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [subject, setSubject] = useState('Order Enquiry');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div className="border-b border-black/10 pb-8">
        <p className="font-mono-label text-xs uppercase tracking-[0.18em] text-[#AD2828]">
          Studio Concierge · Colombo 07
        </p>
        <h1 className="mt-2 font-display text-[clamp(2.5rem,5vw,4.5rem)] uppercase leading-none text-[#111111]">
          Contact Us
        </h1>
      </div>

      {/* Split Layout: Left Form / Right Contact Card */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {submitted ? (
            <div className="rounded-2xl border border-black/10 bg-white p-8 text-center sm:p-12">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
              <h2 className="mt-3 font-display text-3xl uppercase text-[#111111]">
                Message Received
              </h2>
              <p className="mt-2 text-sm text-[#111111]/70">
                Thanks {name || 'there'} — our Colombo team replies to {subject.toLowerCase()} enquiries within 4 business hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="mt-6 h-11 rounded-md bg-[#111111] px-6 text-xs font-semibold uppercase tracking-wider text-[#F3EADB]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl border border-black/10 bg-white/80 p-6 sm:p-8"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Kavinda Perera"
                    className="mt-1 h-11 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="mt-1 h-11 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium">WhatsApp</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="mt-1 h-11 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 h-11 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
                  >
                    <option>Order Enquiry</option>
                    <option>Custom Request</option>
                    <option>Wholesale</option>
                    <option>Press</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium">Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us your order number, sizing question, or squad kit brief..."
                  className="mt-1 w-full rounded-md border border-black/15 bg-white p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium">Optional File Attachment</label>
                <input
                  type="file"
                  onChange={(e) => setAttachment(e.target.files?.[0]?.name ?? '')}
                  className="mt-1.5 block w-full text-xs text-[#111111]/70 file:mr-4 file:rounded file:border-0 file:bg-[#111111] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#F3EADB]"
                />
                {attachment && (
                  <p className="font-mono-label mt-1 text-[11px] text-[#AD2828]">
                    Attached: {attachment}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="h-12 w-full rounded-md bg-[#AD2828] text-xs font-semibold uppercase tracking-wider text-[#F3EADB] hover:bg-[#a92a24] transition-colors"
              >
                Send Enquiry
              </button>
            </form>
          )}
        </div>

        {/* Right Contact Card */}
        <aside className="lg:col-span-5">
          <div className="flex h-full flex-col justify-between rounded-2xl bg-[#111111] p-8 text-[#F3EADB]">
            <div>
              <p className="font-mono-label text-xs uppercase tracking-[0.18em] text-[#AD2828]">
                Direct Channels
              </p>
              <h2 className="mt-2 font-display text-3xl uppercase">
                Colombo Flagship Desk
              </h2>

              <div className="mt-8 space-y-5 text-sm">
                <a
                  href="https://wa.me/94771234567"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-4 hover:border-[#25D366] transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-[#25D366]" />
                  <div>
                    <span className="block font-semibold">WhatsApp Tap-to-Chat</span>
                    <span className="font-mono-label text-xs text-[#F3EADB]/65">+94 77 123 4567</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 text-[#F3EADB]/85">
                  <Phone className="h-4 w-4 text-[#AD2828]" />
                  <span className="font-mono-label text-xs">+94 11 269 8840</span>
                </div>
                <div className="flex items-center gap-3 text-[#F3EADB]/85">
                  <Mail className="h-4 w-4 text-[#AD2828]" />
                  <span>hello@jerseology.lk</span>
                </div>
                <div className="flex items-start gap-3 text-[#F3EADB]/85">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#AD2828]" />
                  <span>No. 24 Ward Place, Cinnamon Gardens, Colombo 07, Sri Lanka</span>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/15 pt-6">
              <p className="font-mono-label text-[11px] uppercase tracking-wider text-[#F3EADB]/55">
                Tue – Sun · 10:30 AM – 8:00 PM
              </p>
              <div className="mt-3 flex gap-4 text-xs font-semibold uppercase tracking-wider text-[#F3EADB]/80">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#AD2828]">Instagram</a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-[#AD2828]">TikTok</a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#AD2828]">YouTube</a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* 8-Question FAQ Accordion */}
      <section id="faq" className="mt-20 border-t border-black/10 pt-14">
        <p className="font-mono-label text-xs uppercase tracking-[0.18em] text-[#AD2828]">
          Answers Before Kick-Off
        </p>
        <h2 className="mt-2 font-display text-4xl uppercase text-[#111111]">
          Frequently Asked Questions
        </h2>

        <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-[#111111] hover:text-[#AD2828]"
                >
                  <span>
                    <span className="font-mono-label mr-3 text-xs text-[#AD2828]">
                      0{idx + 1}
                    </span>
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="pb-5 pl-7 text-sm leading-relaxed text-[#111111]/75">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
