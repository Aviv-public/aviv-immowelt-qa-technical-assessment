import { describe, it, expect } from 'vitest';
import { formatCurrency } from './format';

describe('formatCurrency', () => {
  it('formats whole numbers with the EUR symbol and no decimals', () => {
    expect(formatCurrency(1_000_000)).toMatch(/€/);
    expect(formatCurrency(1_000_000)).not.toMatch(/\.|,\d{2}\b/);
  });

  it('rounds away fractional cents (maximumFractionDigits=0)', () => {
    const result = formatCurrency(1234.56);
    expect(result).not.toContain('.56');
    expect(result).not.toContain(',56');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toMatch(/€\s?0/);
  });

  it('handles negative amounts', () => {
    expect(formatCurrency(-500)).toMatch(/-/);
  });
});
