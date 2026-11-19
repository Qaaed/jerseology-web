import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { BrandWordmark } from './BrandWordmark';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#8BC8B9] text-[#1A1A1A] border-t border-[#1A1A1A]/10">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        {/* Top newsletter + brand row */}
        <div className="grid grid-cols-1 gap-10 border-b border-[#1A1A1A]/15 pb-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <BrandWordmark className="h-16 w-auto sm:h-20" color="#C93636" />
            <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/65 max-w-md">
              Wear What Legends Wear. Futuristic matchday silhouettes, archival retro reissues, motorsport paddock outerwear, and bespoke team kits.
            </p>
          </div>

          <div className="lg:col-span-7 lg:flex lg:justify-end">
            <div className="w-full max-w-lg">
              <p className="text-sm font-medium text-[#1A1A1A]">
                Join the Jerseology list — first drops, first dibs.
              </p>
              {subscribed ? (
                <div className="mt-3 flex items-center gap-2 rounded border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>You are on the list. Watch your inbox for Season 25/26 limited drops.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    aria-label="Email address for Jerseology drops"
                    className="h-11 flex-1 rounded border border-[#1A1A1A]/20 bg-[#F3EADB] px-4 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/45 focus:border-[#C93636] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center gap-2 rounded bg-[#AD2828] px-5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#C93636] transition-colors whitespace-nowrap shrink-0"
                  >
                    Join <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4 Footer columns */}
        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-4">
          <div>
            <h3 className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#1A1A1A]/65">
              Shop
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#1A1A1A]/85">
              <li><Link to="/collection?sport=Football" className="hover:text-[#AD2828] transition-colors">Football</Link></li>
              <li><Link to="/collection?sport=F1" className="hover:text-[#AD2828] transition-colors">F1</Link></li>
              <li><Link to="/collection?category=Retro" className="hover:text-[#AD2828] transition-colors">Retro</Link></li>
              <li><Link to="/collection?category=Kids" className="hover:text-[#AD2828] transition-colors">Kids</Link></li>
              <li><Link to="/collection?category=Socks" className="hover:text-[#AD2828] transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#1A1A1A]/65">
              Help
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#1A1A1A]/85">
              <li><Link to="/contact#faq" className="hover:text-[#AD2828] transition-colors">Shipping</Link></li>
              <li><Link to="/contact#faq" className="hover:text-[#AD2828] transition-colors">Returns</Link></li>
              <li><Link to="/contact#faq" className="hover:text-[#AD2828] transition-colors">Size Guide</Link></li>
              <li><Link to="/contact#faq" className="hover:text-[#AD2828] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#1A1A1A]/65">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#1A1A1A]/85">
              <li><Link to="/about" className="hover:text-[#AD2828] transition-colors">About</Link></li>
              <li><Link to="/about#chapters" className="hover:text-[#AD2828] transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-[#AD2828] transition-colors">Contact</Link></li>
              <li><Link to="/collection" className="hover:text-[#AD2828] transition-colors">Our Collection</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#1A1A1A]/65">
              Follow
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#1A1A1A]/85">
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#AD2828] transition-colors">Instagram</a></li>
              <li><a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-[#AD2828] transition-colors">TikTok</a></li>
              <li><a href="https://wa.me/94771234567" target="_blank" rel="noreferrer" className="hover:text-[#AD2828] transition-colors">WhatsApp</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#AD2828] transition-colors">YouTube</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#1A1A1A]/15 pt-8 text-xs text-[#1A1A1A]/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Jerseology. All rights reserved.</p>
          <p className="font-mono-label uppercase tracking-wider">
            Worldwide & Island-Wide Dispatch · Season 25/26
          </p>
        </div>
      </div>
    </footer>
  );
}
