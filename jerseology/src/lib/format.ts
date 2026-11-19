export type CurrencyCode = 'LKR' | 'USD';

const LKR_TO_USD = 1 / 298;

export function formatPrice(amountLkr: number, currency: CurrencyCode = 'LKR'): string {
  if (currency === 'USD') {
    const usd = amountLkr * LKR_TO_USD;
    return `$${usd.toFixed(2)} USD`;
  }
  return `${Math.round(amountLkr).toLocaleString('en-US')} LKR`;
}

export const OPTION_DELTAS = {
  version: {
    Fan: 0,
    Player: 600,
    GK: 350,
    Retro: 1500,
  },
  sleeve: {
    Short: 0,
    Long: 720,
  },
  nameSet: 950,
  patchEach: 380,
} as const;

export const AVAILABLE_PATCHES = [
  { id: 'ucl', label: 'Champions League Starball', priceLkr: 380, badge: 'UCL' },
  { id: 'laliga', label: 'La Liga / Domestic Crest', priceLkr: 380, badge: 'LIGA' },
  { id: 'cwc', label: 'Club World Cup Champions', priceLkr: 380, badge: 'CWC' },
] as const;

export function calculateConfiguredUnitPrice(params: {
  basePriceLkr: number;
  defaultVersion: 'Fan' | 'Player' | 'GK' | 'Retro';
  selectedVersion: 'Fan' | 'Player' | 'GK' | 'Retro';
  selectedSleeve: 'Short' | 'Long';
  hasNameSet: boolean;
  patchesCount: number;
}): number {
  const baseDelta = OPTION_DELTAS.version[params.defaultVersion] ?? 0;
  const targetDelta = OPTION_DELTAS.version[params.selectedVersion] ?? 0;
  const versionDiff =
    params.selectedVersion === params.defaultVersion ? 0 : Math.max(-400, targetDelta - baseDelta);
  const sleeveCost = params.selectedSleeve === 'Long' ? OPTION_DELTAS.sleeve.Long : 0;
  const nameCost = params.hasNameSet ? OPTION_DELTAS.nameSet : 0;
  const patchCost = params.patchesCount * OPTION_DELTAS.patchEach;

  return Math.max(1000, params.basePriceLkr + versionDiff + sleeveCost + nameCost + patchCost);
}
