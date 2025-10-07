/**
 * Converts a decimal oz value to a nicely formatted fraction string
 * e.g., 3.00 -> "3", 3.25 -> "3¼", 3.5 -> "3½", 0.75 -> "¾"
 */
export function formatOzAsFraction(oz: number): string {
  // Round to nearest quarter ounce
  const rounded = Math.round(oz / 0.25) * 0.25;
  
  const wholeNumber = Math.floor(rounded);
  const fraction = rounded - wholeNumber;
  
  // Unicode fraction characters
  const fractionMap: { [key: number]: string } = {
    0: '',
    0.25: '¼',
    0.5: '½',
    0.75: '¾'
  };
  
  const fractionStr = fractionMap[fraction] || '';
  
  // Handle zero case
  if (rounded === 0) {
    return '0';
  }
  
  // Handle whole numbers
  if (fraction === 0) {
    return wholeNumber.toString();
  }
  
  // Handle fractions without whole numbers
  if (wholeNumber === 0) {
    return fractionStr;
  }
  
  // Combine whole number and fraction with a thin space
  return `${wholeNumber} ${fractionStr}`;
}
