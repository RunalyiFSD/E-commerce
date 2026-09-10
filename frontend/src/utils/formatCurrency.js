/**
 * Currency Formatter Utility
 * Formats numbers into Indian Rupee (₹) string format.
 * Supports compact formatting (K, M, B) for clean metric cards & charts.
 */

export function formatCurrency(amount = 0, options = {}) {
  const numericAmount = Number(amount) || 0;

  if (options.compact) {
    return formatCompactCurrency(numericAmount);
  }

  return `₹${numericAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCompactCurrency(amount = 0) {
  const num = Number(amount) || 0;
  const absNum = Math.abs(num);

  if (absNum >= 1_000_000_000) {
    return `₹${(num / 1_000_000_000).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}B`;
  }
  if (absNum >= 1_000_000) {
    return `₹${(num / 1_000_000).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}M`;
  }
  if (absNum >= 1_000) {
    return `₹${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return `₹${num.toFixed(2)}`;
}

export default formatCurrency;
