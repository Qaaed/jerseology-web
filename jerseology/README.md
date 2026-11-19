# Jerseology — Wear What Legends Wear

Boutique fashion-meets-sport editorial storefront and kit configurator built with React 19, TypeScript, Tailwind CSS v4, Motion, and Zustand.

## Getting Started

```bash
npm install && npm run dev
```

Open `http://localhost:3000` in your browser.

For a production build:

```bash
npm run build
```

## Architecture & Key Modules

- `src/data/clubs.json` & `src/data/products.json`: Seeded catalogue of 17 clubs (Football and Formula 1) and 22 products including matchday jerseys, shorts, retro kits, jackets, tracksuits, and add-on pricing deltas.
- `src/store/useStore.ts`: Persisted Zustand store managing cart items with configured options (version, sleeve, size, custom name/number, patches), wishlist, currency toggle (`LKR` / `USD`), drawers, and toast notifications.
- `src/components/ClubHero.tsx`: Split-diagonal editorial club hero with mouse-tilt jersey preview, scroll drift, vector country silhouette, debut match review modal, and next-club teaser.
- `src/pages/*`: Home, Our Collection (club index + URL-synced multi-filter bar), Club Page ("The Full Kit"), Product Detail Page (360° drag spin viewer, live print preview overlay, sticky configurator), About Us, and Contact + FAQ.

## Swapping in Shopify or Medusa for Real Commerce

1. **Catalogue Fetch (`src/data/catalog.ts`)**: Replace static JSON imports with async queries to either Shopify's Storefront GraphQL API (`@shopify/storefront-api-client`) or Medusa's `@medusajs/js-sdk` (`medusa.store.product.list()`). Map Shopify/Medusa product metafields to `Club` metadata (`primaryColor`, `tintColor`, `worldRanking`, `debutMatch`).
2. **Variant & Add-On Pricing (`src/lib/format.ts`)**: Map Version + Sleeve options directly to Shopify/Medusa Product Variants, and pass `customName`, `customNumber`, and `patches` as Cart Line Item Attributes (`attributes` in Shopify Cart API or `metadata` in Medusa Line Items).
3. **Cart & Checkout (`src/store/useStore.ts` & `src/components/CartDrawer.tsx`)**: Sync `addToCart` / `updateQuantity` / `removeFromCart` mutations with Shopify's `cartLinesAdd` or Medusa's `medusa.store.cart.createLineItem`, then redirect the "Checkout Island Wide" CTA to `cart.checkoutUrl` (Shopify) or Medusa's Payment Session / PayHere Sri Lanka gateway.
