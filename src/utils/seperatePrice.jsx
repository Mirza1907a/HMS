export function formatPrice(number, maximumFractionDigits = 2) {
    return number.toLocaleString('en-IN', {
      maximumFractionDigits: maximumFractionDigits
    });
  }