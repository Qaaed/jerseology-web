import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { formatPrice } from '../lib/format';
import { useStore } from '../store/useStore';
import { ResilientImage } from './ResilientImage';

export function CartDrawer() {
  const isCartOpen = useStore((s) => s.isCartOpen);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const cart = useStore((s) => s.cart);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const clearCart = useStore((s) => s.clearCart);
  const currency = useStore((s) => s.currency);

  const [checkingOut, setCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Card'>('COD');
  const [confirmedOrderRef, setConfirmedOrderRef] = useState<string | null>(null);

  const subtotalLkr = cart.reduce((sum, item) => sum + item.unitPriceLkr * item.quantity, 0);
  const freeShippingThreshold = 15000;
  const shippingLkr = subtotalLkr === 0 || subtotalLkr >= freeShippingThreshold ? 0 : 450;
  const totalLkr = subtotalLkr + shippingLkr;

  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    const ref = `JRS-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedOrderRef(ref);
    clearCart();
    setCheckingOut(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setCartOpen(false);
              setConfirmedOrderRef(null);
            }}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col justify-between bg-[#F3EADB] p-6 shadow-2xl"
            aria-label="Shopping Bag"
          >
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <h2 className="font-display text-2xl uppercase tracking-tight text-[#111111]">
                Your Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  setConfirmedOrderRef(null);
                }}
                aria-label="Close bag"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              {confirmedOrderRef ? (
                <div className="mt-6 rounded-xl border border-black/10 bg-white p-6 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                  <h3 className="mt-3 font-display text-2xl uppercase text-[#111111]">
                    Order #{confirmedOrderRef} Confirmed
                  </h3>
                  <p className="mt-2 text-sm text-[#111111]/70">
                    Preparing shipment from our Colombo studio. Island-wide dispatch within 24–48 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmedOrderRef(null);
                      setCartOpen(false);
                    }}
                    className="mt-6 h-11 w-full rounded-md bg-[#111111] text-xs font-semibold uppercase tracking-wider text-[#F3EADB]"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <ShoppingBag className="h-10 w-10 text-[#111111]/30" strokeWidth={1.5} />
                  <p className="mt-4 text-sm font-medium text-[#111111]">
                    Nothing here yet. The squad is warming up.
                  </p>
                  <Link
                    to="/collection"
                    onClick={() => setCartOpen(false)}
                    className="mt-5 inline-flex h-10 items-center rounded-md bg-[#111111] px-5 text-xs font-semibold uppercase tracking-wider text-[#F3EADB] hover:bg-[#AD2828] transition-colors"
                  >
                    Explore Our Collection
                  </Link>
                </div>
              ) : checkingOut ? (
                <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono-label text-xs uppercase tracking-wider text-[#111111]/60">
                      Island-Wide Delivery Details
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCheckingOut(false)}
                      className="text-xs underline text-[#111111]/70"
                    >
                      Back to bag
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#111111]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Kavinda Perera"
                      className="mt-1 h-11 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#111111]">
                      WhatsApp / Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="mt-1 h-11 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#111111]">
                      Delivery Address & City
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="No. 24 Ward Place, Colombo 07"
                      className="mt-1 w-full rounded-md border border-black/15 bg-white p-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#111111]">Payment Method</label>
                    <div className="mt-1.5 grid grid-cols-2 gap-2">
                      {(['COD', 'Card'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`h-10 rounded-md border text-xs font-medium ${
                            paymentMethod === method
                              ? 'border-[#111111] bg-[#111111] text-[#F3EADB]'
                              : 'border-black/15 bg-white text-[#111111]'
                          }`}
                        >
                          {method === 'COD' ? 'Cash on Delivery' : 'Card / Bank Transfer'}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              ) : (
                <ul className="divide-y divide-black/10">
                  {cart.map((item) => (
                    <li key={item.cartKey} className="flex gap-4 py-4">
                      <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-[#E7E1D6]">
                        <ResilientImage src={item.image} alt={item.name} />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/product/${item.slug}`}
                              onClick={() => setCartOpen(false)}
                              className="text-sm font-semibold text-[#111111] hover:text-[#AD2828]"
                            >
                              {item.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.cartKey)}
                              aria-label={`Remove ${item.name}`}
                              className="text-[#111111]/40 hover:text-[#AD2828]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="font-mono-label mt-1 text-[11px] uppercase tracking-wider text-[#111111]/60">
                            {item.version} · {item.sleeve} · Size {item.size}
                          </p>
                          {(item.customName || item.customNumber || item.patches.length > 0) && (
                            <p className="font-mono-label mt-1 text-[11px] text-[#0B1B3A]">
                              {[
                                item.customName && `Name: ${item.customName}`,
                                item.customNumber && `#${item.customNumber}`,
                                item.patches.length > 0 && `Patches: ${item.patches.join(', ')}`,
                              ]
                                .filter(Boolean)
                                .join(' · ')}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded border border-black/15 bg-white">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartKey, -1)}
                              aria-label="Decrease quantity"
                              className="inline-flex h-7 w-7 items-center justify-center hover:bg-black/5"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-mono-label px-2.5 text-xs font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartKey, 1)}
                              aria-label="Increase quantity"
                              className="inline-flex h-7 w-7 items-center justify-center hover:bg-black/5"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="font-mono-label text-sm font-semibold tabular-nums">
                            {formatPrice(item.unitPriceLkr * item.quantity, currency)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && !confirmedOrderRef && (
              <div className="border-t border-black/10 pt-4">
                <div className="space-y-1.5 text-xs text-[#111111]/75">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono-label tabular-nums">
                      {formatPrice(subtotalLkr, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Island-Wide Delivery (Free over 15,000 LKR)</span>
                    <span className="font-mono-label tabular-nums">
                      {shippingLkr === 0 ? 'FREE' : formatPrice(shippingLkr, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 text-sm font-semibold text-[#111111]">
                    <span>Total</span>
                    <span className="font-mono-label tabular-nums">
                      {formatPrice(totalLkr, currency)}
                    </span>
                  </div>
                </div>

                {checkingOut ? (
                  <button
                    type="submit"
                    form="checkout-form"
                    className="mt-4 h-12 w-full rounded-md bg-[#AD2828] text-xs font-semibold uppercase tracking-wider text-[#F3EADB] hover:bg-[#a92a24] transition-colors"
                  >
                    Confirm Order ({paymentMethod}) · {formatPrice(totalLkr, currency)}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCheckingOut(true)}
                    className="mt-4 h-12 w-full rounded-md bg-[#AD2828] text-xs font-semibold uppercase tracking-wider text-[#F3EADB] hover:bg-[#a92a24] transition-colors"
                  >
                    Checkout Island Wide
                  </button>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
