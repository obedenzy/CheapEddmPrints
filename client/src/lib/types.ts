// Type definitions for the application

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface Address {
  id: number;
  userId: number;
  company?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface SavedDesign {
  id: number;
  userId: number;
  name: string;
  frontImageUrl: string;
  backImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface USPSRoute {
  id: number;
  routeId: string;
  routeName: string;
  city: string;
  state: string;
  zipCode: string;
  residentialAddresses: number;
  businessAddresses: number | null;
  totalAddresses: number;
  routeType: string | null;
}

export interface CartItem {
  id: string;
  size: string;
  quantity: number;
  paperType: string;
  finishType: string;
  printType: string;
  indiciaOption: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  uspsRoutes?: USPSRoute[];
  pricePerPiece: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  userId?: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingAmount?: number;
  taxAmount?: number;
  billingAddress: any;
  shippingAddress: any;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  size: string;
  quantity: number;
  paperType: string;
  finishType: string;
  printType: string;
  indiciaOption: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  uspsRoutes?: USPSRoute[];
  pricePerPiece: number;
  totalPrice: number;
}

export interface PostcardFormData {
  size: string;
  quantity: string;
  paperType: string;
  finishType: string;
  printType: string;
  indiciaOption: string;
  frontImage?: File;
  backImage?: File;
  uspsRoutes?: USPSRoute[];
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  specialInstructions?: string;
  paymentMethod: string;
  cardNumber?: string;
  expirationDate?: string;
  cvv?: string;
  nameOnCard?: string;
  sameAsBilling: boolean;
  billingStreet?: string;
  billingCity?: string;
  billingState?: string;
  billingZipCode?: string;
}
