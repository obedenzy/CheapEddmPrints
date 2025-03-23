// Pricing logic for postcard order calculations

// Base price per piece based on quantity
export const quantityPricing: Record<string, number> = {
  '500': 0.72,
  '1000': 0.69,
  '2000': 0.55,
  '3000': 0.49,
  '4000': 0.45,
  '5000': 0.42,
  '6000': 0.41,
  '7000': 0.41,
  '8000': 0.41,
  '9000': 0.41,
  '10000': 0.39,
  '15000': 0.38,
  '20000': 0.38,
};

// Size adjustment pricing
export const sizeAdjustments: Record<string, number> = {
  '6.25x8': -0.07,
  '6.5x9': 0,
  '6.5x11': 0.08,
  '8.5x11': 0.09,
};

// Paper type adjustment pricing (percentage increase)
export const paperTypeAdjustments: Record<string, number> = {
  '14pt': 0,
  '16pt': 0.05, // 5% increase for 16pt
};

// Finish type adjustment pricing (percentage increase)
export const finishTypeAdjustments: Record<string, number> = {
  'gloss-both': 0,
  'matte-both': 0.02, // 2% increase for matte
  'uv-both': 0.08, // 8% increase for UV both sides
  'uv-front': 0.05, // 5% increase for UV front only
};

// Print type adjustment pricing (percentage increase)
export const printTypeAdjustments: Record<string, number> = {
  'single': 0,
  'double': 0.12, // 12% increase for double-sided
};

export interface PriceCalculationOptions {
  quantity: string; // e.g. '1000'
  size: string; // e.g. '6.5x9'
  paperType: string; // e.g. '14pt'
  finishType: string; // e.g. 'gloss-both'
  printType: string; // e.g. 'double'
}

// Calculate the price per piece based on options
export function calculatePricePerPiece(options: PriceCalculationOptions): number {
  // Get base price for quantity
  const basePrice = quantityPricing[options.quantity] || 0.39; // default to 0.39 for quantities not specifically listed
  
  // Get size adjustment
  const sizeAdjustment = sizeAdjustments[options.size] || 0;
  
  // Apply base adjustments
  let pricePerPiece = basePrice + sizeAdjustment;
  
  // Apply percentage-based adjustments
  const paperAdjustment = paperTypeAdjustments[options.paperType] || 0;
  const finishAdjustment = finishTypeAdjustments[options.finishType] || 0;
  const printAdjustment = printTypeAdjustments[options.printType] || 0;
  
  pricePerPiece *= (1 + paperAdjustment + finishAdjustment + printAdjustment);
  
  // Round to 4 decimal places for precision
  return parseFloat(pricePerPiece.toFixed(4));
}

// Calculate the total price based on quantity and price per piece
export function calculateTotalPrice(pricePerPiece: number, quantity: number): number {
  const total = pricePerPiece * quantity;
  
  // Round to 2 decimal places for currency
  return parseFloat(total.toFixed(2));
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}
