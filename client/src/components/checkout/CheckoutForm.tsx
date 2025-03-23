import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// US States array for dropdown
const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" }
];

// Form validation schema
const checkoutFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  specialInstructions: z.string().optional(),
  sameAsBilling: z.boolean().default(true),
  billingStreet: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingZipCode: z.string().optional(),
  paymentMethod: z.enum(["credit", "paypal", "apple", "google"]),
  cardNumber: z.string().optional(),
  expirationDate: z.string().optional(),
  cvv: z.string().optional(),
  nameOnCard: z.string().optional(),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  })
}).refine(data => {
  // If payment method is credit, additional validation for card details
  if (data.paymentMethod === 'credit') {
    return !!data.cardNumber && !!data.expirationDate && !!data.cvv && !!data.nameOnCard;
  }
  return true;
}, {
  message: "Credit card details are required",
  path: ["cardNumber"]
}).refine(data => {
  // If billing address is different, check those fields
  if (!data.sameAsBilling) {
    return !!data.billingStreet && !!data.billingCity && !!data.billingState && !!data.billingZipCode;
  }
  return true;
}, {
  message: "Billing address is required",
  path: ["billingStreet"]
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const CheckoutForm = () => {
  const [, navigate] = useLocation();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate shipping and tax
  const subtotal = getCartTotal();
  const shipping = 25.00;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  // Initialize form with default values
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      company: "",
      email: user?.email || "",
      phone: user?.phone || "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      specialInstructions: "",
      sameAsBilling: true,
      paymentMethod: "credit",
      termsAgreed: false
    }
  });

  // Handle credit card payment section visibility
  const watchPaymentMethod = form.watch("paymentMethod");
  const showCreditCardFields = watchPaymentMethod === "credit";

  // Handle billing address section visibility
  const watchSameAsBilling = form.watch("sameAsBilling");

  // Form submission handler
  const onSubmit = async (data: CheckoutFormValues) => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Please add items before checking out.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare billing address (either same as shipping or separate)
      const billingAddress = data.sameAsBilling
        ? {
            street: data.street,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode
          }
        : {
            street: data.billingStreet,
            city: data.billingCity,
            state: data.billingState,
            zipCode: data.billingZipCode
          };

      // Prepare shipping address
      const shippingAddress = {
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode
      };

      // Create order object
      const orderData = {
        order: {
          userId: user?.id,
          orderNumber: `EDDM-${nanoid(6).toUpperCase()}`,
          status: "pending",
          totalAmount: total,
          shippingAmount: shipping,
          taxAmount: tax,
          billingAddress,
          shippingAddress,
          paymentMethod: data.paymentMethod,
          notes: data.specialInstructions || ""
        },
        items: cartItems.map(item => ({
          size: item.size,
          quantity: item.quantity,
          paperType: item.paperType,
          finishType: item.finishType,
          printType: item.printType,
          indiciaOption: item.indiciaOption,
          frontImageUrl: item.frontImageUrl,
          backImageUrl: item.backImageUrl,
          uspsRoutes: item.uspsRoutes,
          pricePerPiece: item.pricePerPiece,
          totalPrice: item.totalPrice
        }))
      };

      // Submit order to API
      const response = await apiRequest('POST', '/api/orders', orderData);
      const result = await response.json();

      // Clear cart and navigate to confirmation page
      clearCart();
      navigate('/confirmation');

      // Show success message
      toast({
        title: "Order Placed Successfully",
        description: `Your order #${result.orderNumber} has been placed.`
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Shipping Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-gray-700 font-medium mb-2">First Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-gray-700 font-medium mb-2">Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-gray-700 font-medium mb-2">Company Name (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-gray-700 font-medium mb-2">Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email"
                      className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-gray-700 font-medium mb-2">Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="tel"
                      className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-gray-700 font-medium mb-2">Street Address</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-gray-700 font-medium mb-2">City</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-gray-700 font-medium mb-2">State</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-gray-700 font-medium mb-2">ZIP Code</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="specialInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-gray-700 font-medium mb-2">Special Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Payment Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-gray-700 font-medium mb-2">Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 md:grid-cols-4 gap-3"
                    >
                      <FormItem className="border rounded-lg p-3 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <FormControl>
                          <RadioGroupItem value="credit" className="sr-only" />
                        </FormControl>
                        <div className={`flex flex-col items-center ${field.value === "credit" ? "text-primary" : "text-gray-600"}`}>
                          <i className="fas fa-credit-card text-2xl mt-2"></i>
                          <FormLabel className="cursor-pointer text-sm mt-1">Credit Card</FormLabel>
                        </div>
                      </FormItem>
                      
                      <FormItem className="border rounded-lg p-3 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <FormControl>
                          <RadioGroupItem value="paypal" className="sr-only" />
                        </FormControl>
                        <div className={`flex flex-col items-center ${field.value === "paypal" ? "text-primary" : "text-gray-600"}`}>
                          <i className="fab fa-paypal text-2xl mt-2"></i>
                          <FormLabel className="cursor-pointer text-sm mt-1">PayPal</FormLabel>
                        </div>
                      </FormItem>
                      
                      <FormItem className="border rounded-lg p-3 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <FormControl>
                          <RadioGroupItem value="apple" className="sr-only" />
                        </FormControl>
                        <div className={`flex flex-col items-center ${field.value === "apple" ? "text-primary" : "text-gray-600"}`}>
                          <i className="fab fa-apple-pay text-2xl mt-2"></i>
                          <FormLabel className="cursor-pointer text-sm mt-1">Apple Pay</FormLabel>
                        </div>
                      </FormItem>
                      
                      <FormItem className="border rounded-lg p-3 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <FormControl>
                          <RadioGroupItem value="google" className="sr-only" />
                        </FormControl>
                        <div className={`flex flex-col items-center ${field.value === "google" ? "text-primary" : "text-gray-600"}`}>
                          <i className="fab fa-google-pay text-2xl mt-2"></i>
                          <FormLabel className="cursor-pointer text-sm mt-1">Google Pay</FormLabel>
                        </div>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {showCreditCardFields && (
              <div id="creditCardForm" className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-700 font-medium mb-2">Card Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="•••• •••• •••• ••••"
                          className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-gray-700 font-medium mb-2">Expiration Date</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="MM/YY"
                            className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-gray-700 font-medium mb-2">Security Code (CVV)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="•••"
                            className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="nameOnCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-700 font-medium mb-2">Name on Card</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <FormField
              control={form.control}
              name="sameAsBilling"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Billing address is the same as shipping address
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            {!watchSameAsBilling && (
              <div className="space-y-4 mt-4 p-4 border rounded-md bg-gray-50">
                <h3 className="font-medium">Billing Address</h3>
                
                <FormField
                  control={form.control}
                  name="billingStreet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-700 font-medium mb-2">Street Address</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="billingCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-gray-700 font-medium mb-2">City</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="billingState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-gray-700 font-medium mb-2">State</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary">
                              <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="billingZipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-gray-700 font-medium mb-2">ZIP Code</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            
            <FormField
              control={form.control}
              name="termsAgreed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-md font-semibold transition-colors mt-6"
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
            
            <div className="mt-6">
              <div className="flex items-center justify-center mb-4">
                <i className="fas fa-lock text-gray-500 mr-2"></i>
                <span className="text-gray-500 text-sm">Secure Checkout</span>
              </div>
              <div className="flex justify-center space-x-2">
                <i className="fab fa-cc-visa text-gray-600 text-2xl"></i>
                <i className="fab fa-cc-mastercard text-gray-600 text-2xl"></i>
                <i className="fab fa-cc-amex text-gray-600 text-2xl"></i>
                <i className="fab fa-cc-discover text-gray-600 text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CheckoutForm;
