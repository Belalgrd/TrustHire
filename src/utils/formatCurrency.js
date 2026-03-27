export function formatSalary(min, max, currency = 'INR', period = 'yearly') {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  });

  if (min && max && min !== max) {
    return `${formatter.format(min)} - ${formatter.format(max)} / ${period}`;
  }

  if (max) {
    return `Up to ${formatter.format(max)} / ${period}`;
  }

  if (min) {
    return `From ${formatter.format(min)} / ${period}`;
  }

  return 'Not disclosed';
}

export function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}