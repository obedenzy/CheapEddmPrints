import { useEffect, useState } from 'react';
import {
  calculatePricePerPiece,
  calculateTotalPrice,
  formatCurrency
} from '@/lib/pricing';

interface PriceCalculatorProps {
  quantity: string;
  size: string;
  paperType: string;
  finishType: string;
  printType: string;
}

const PriceCalculator = ({
  quantity,
  size,
  paperType,
  finishType,
  printType,
}: PriceCalculatorProps) => {
  const [pricePerPiece, setPricePerPiece] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const pricePerPiece = calculatePricePerPiece({
      quantity,
      size,
      paperType,
      finishType,
      printType,
    });
    
    setPricePerPiece(pricePerPiece);
    setTotalPrice(calculateTotalPrice(pricePerPiece, parseInt(quantity)));
  }, [quantity, size, paperType, finishType, printType]);

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Pricing</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Price per piece:</span>
          <span className="font-medium">{formatCurrency(pricePerPiece)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <span>Total price:</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;
