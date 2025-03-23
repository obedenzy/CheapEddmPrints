import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DesignUploader from './DesignUploader';
import USPSRouteSelector from './USPSRouteSelector';
import { 
  calculatePricePerPiece,
  calculateTotalPrice,
  formatCurrency 
} from '@/lib/pricing';
import { PostcardFormData, USPSRoute } from '@/lib/types';
import { uploadDesignFile } from '@/lib/supabase';

// Form validation schema
const formSchema = z.object({
  size: z.enum(['6.25x8', '6.5x9', '6.5x11', '8.5x11']),
  quantity: z.string(),
  paperType: z.enum(['14pt', '16pt']),
  finishType: z.enum(['gloss-both', 'matte-both', 'uv-both', 'uv-front']),
  printType: z.enum(['single', 'double']),
  indiciaOption: z.enum(['artwork', 'retail']),
});

const ProductCustomizer = () => {
  const { toast } = useToast();
  const { addToCart, toggleCart } = useCart();
  
  // Form state
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: '6.5x9',
      quantity: '2000',
      paperType: '14pt',
      finishType: 'gloss-both',
      printType: 'double',
      indiciaOption: 'artwork',
    },
  });
  
  // State for uploaded files
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [selectedRoutes, setSelectedRoutes] = useState<USPSRoute[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Calculate current price
  const [pricePerPiece, setPricePerPiece] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Update pricing when form values change
  const formValues = form.watch();
  useEffect(() => {
    const pricePerPiece = calculatePricePerPiece({
      quantity: formValues.quantity,
      size: formValues.size,
      paperType: formValues.paperType,
      finishType: formValues.finishType,
      printType: formValues.printType,
    });
    
    setPricePerPiece(pricePerPiece);
    setTotalPrice(calculateTotalPrice(pricePerPiece, parseInt(formValues.quantity)));
  }, [formValues]);
  
  // Handle form submit and add to cart
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!frontImage) {
      toast({
        title: "Front image required",
        description: "Please upload your front design image",
        variant: "destructive"
      });
      return;
    }
    
    if (data.printType === 'double' && !backImage) {
      toast({
        title: "Back image required",
        description: "Please upload your back design image for double-sided printing",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload images to Supabase
      const frontImageUrl = await uploadDesignFile(frontImage);
      const backImageUrl = data.printType === 'double' ? await uploadDesignFile(backImage) : null;
      
      if (!frontImageUrl) {
        throw new Error("Failed to upload front image");
      }
      
      // Add item to cart
      addToCart({
        id: nanoid(),
        size: data.size,
        quantity: parseInt(data.quantity),
        paperType: data.paperType,
        finishType: data.finishType,
        printType: data.printType,
        indiciaOption: data.indiciaOption,
        frontImageUrl,
        backImageUrl: backImageUrl || undefined,
        uspsRoutes: selectedRoutes.length > 0 ? selectedRoutes : undefined,
        pricePerPiece,
        totalPrice,
      });
      
      // Show success message
      toast({
        title: "Added to cart",
        description: "Your customized postcards have been added to your cart",
      });
      
      // Open cart
      toggleCart();
      
      // Reset form (optional)
      // form.reset();
      // setFrontImage(null);
      // setBackImage(null);
      // setFrontPreview(null);
      // setBackPreview(null);
      // setSelectedRoutes([]);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Customize Your EDDM Postcard</h2>
          
          {/* Product Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border rounded-lg overflow-hidden aspect-[4/3] bg-gray-100 flex items-center justify-center">
              {frontPreview ? (
                <img 
                  src={frontPreview} 
                  alt="Front Preview" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center p-4">
                  <i className="fas fa-image text-gray-400 text-5xl mb-2"></i>
                  <p className="text-gray-500">Front Preview</p>
                  <p className="text-sm text-gray-400 mt-2">Upload your design to see preview</p>
                </div>
              )}
            </div>
            
            <div className="border rounded-lg overflow-hidden aspect-[4/3] bg-gray-100 flex items-center justify-center">
              {backPreview ? (
                <img 
                  src={backPreview} 
                  alt="Back Preview" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center p-4">
                  <i className="fas fa-image text-gray-400 text-5xl mb-2"></i>
                  <p className="text-gray-500">Back Preview</p>
                  <p className="text-sm text-gray-400 mt-2">Upload your design to see preview</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Size Selection */}
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel className="block text-gray-700 font-medium mb-2">Postcard Size</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                  >
                    <FormItem className="border rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="6.25x8" className="mr-2" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">6.25" x 8"</FormLabel>
                    </FormItem>
                    <FormItem className="border rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="6.5x9" className="mr-2" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">6.5" x 9"</FormLabel>
                    </FormItem>
                    <FormItem className="border rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="6.5x11" className="mr-2" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">6.5" x 11"</FormLabel>
                    </FormItem>
                    <FormItem className="border rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="8.5x11" className="mr-2" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">8.5" x 11"</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Quantity Selection */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel className="block text-gray-700 font-medium mb-2">Quantity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary">
                      <SelectValue placeholder="Select quantity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="500">500 Postcards</SelectItem>
                    <SelectItem value="1000">1,000 Postcards</SelectItem>
                    <SelectItem value="2000">2,000 Postcards</SelectItem>
                    <SelectItem value="3000">3,000 Postcards</SelectItem>
                    <SelectItem value="4000">4,000 Postcards</SelectItem>
                    <SelectItem value="5000">5,000 Postcards</SelectItem>
                    <SelectItem value="6000">6,000 Postcards</SelectItem>
                    <SelectItem value="7000">7,000 Postcards</SelectItem>
                    <SelectItem value="8000">8,000 Postcards</SelectItem>
                    <SelectItem value="9000">9,000 Postcards</SelectItem>
                    <SelectItem value="10000">10,000 Postcards</SelectItem>
                    <SelectItem value="15000">15,000 Postcards</SelectItem>
                    <SelectItem value="20000">20,000 Postcards</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Paper Type */}
          <FormField
            control={form.control}
            name="paperType"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel className="block text-gray-700 font-medium mb-2">Paper Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    <FormItem className="border rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="14pt" className="mr-2" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">14 pt. Cardstock</FormLabel>
                    </FormItem>
                    <FormItem className="border rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="16pt" className="mr-2" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">16 pt. Cardstock</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Finish Type */}
          <FormField
            control={form.control}
            name="finishType"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel className="block text-gray-700 font-medium mb-2">Finish Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    <FormItem className="border rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="gloss-both" className="mr-2" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Gloss Both Sides</FormLabel>
                    </FormItem>
                    <FormItem className="border rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="matte-both" className="mr-2" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Matte Both Sides</FormLabel>
                    </FormItem>
                    <FormItem className="border rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="uv-both" className="mr-2" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">High Gloss UV Both Sides</FormLabel>
                    </FormItem>
                    <FormItem className="border rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="uv-front" className="mr-2" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">High Gloss UV Front, Uncoated Back</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Print Type */}
          <FormField
            control={form.control}
            name="printType"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel className="block text-gray-700 font-medium mb-2">Print Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    <FormItem className="border rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="single" className="mr-2" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">4/0 Single Sided</FormLabel>
                    </FormItem>
                    <FormItem className="border rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="double" className="mr-2" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">4/4 Double Sided</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Indicia Option */}
          <FormField
            control={form.control}
            name="indiciaOption"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel className="block text-gray-700 font-medium mb-2">Indicia Option</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    <FormItem className="border rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="artwork" className="mr-2" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Use Indicia on artwork file</FormLabel>
                    </FormItem>
                    <FormItem className="border rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="retail" className="mr-2" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Use EDDM Retail Indicia</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Upload Design */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Upload Your Design</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DesignUploader 
                side="front"
                onFileSelect={(file) => {
                  setFrontImage(file);
                  // Create preview URL
                  const previewUrl = URL.createObjectURL(file);
                  setFrontPreview(previewUrl);
                }}
              />
              
              {form.watch('printType') === 'double' && (
                <DesignUploader 
                  side="back"
                  onFileSelect={(file) => {
                    setBackImage(file);
                    // Create preview URL
                    const previewUrl = URL.createObjectURL(file);
                    setBackPreview(previewUrl);
                  }}
                />
              )}
            </div>
          </div>
        </div>
        
        {/* USPS Route Selection */}
        <USPSRouteSelector 
          selectedRoutes={selectedRoutes} 
          onSelectRoutes={setSelectedRoutes} 
        />
        
        {/* Order Summary & Price Calculator */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {form.watch('size').replace('x', '" x ') + '"'} Postcards
              </span>
              <span>{parseInt(form.watch('quantity')).toLocaleString()} pcs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Paper Type</span>
              <span>{form.watch('paperType') === '14pt' ? '14 pt. Cardstock' : '16 pt. Cardstock'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Finish</span>
              <span>
                {form.watch('finishType') === 'gloss-both' ? 'Gloss Both Sides' : 
                 form.watch('finishType') === 'matte-both' ? 'Matte Both Sides' : 
                 form.watch('finishType') === 'uv-both' ? 'High Gloss UV Both Sides' : 
                 'High Gloss UV Front, Uncoated Back'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Print Type</span>
              <span>
                {form.watch('printType') === 'single' ? '4/0 Single Sided' : '4/4 Double Sided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Time</span>
              <span>7-10 Business Days</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Price</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="text-sm text-gray-500 text-right">
                {formatCurrency(pricePerPiece)} per piece
              </div>
            </div>
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <Button
          type="submit"
          disabled={isUploading}
          className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-md font-semibold transition-colors"
        >
          {isUploading ? "Adding to Cart..." : "Add to Cart"}
        </Button>
      </form>
    </Form>
  );
};

export default ProductCustomizer;
