import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { USPSRoute } from '@/lib/types';
import { getQueryFn } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { X, Search, MapPin } from 'lucide-react';

interface USPSRouteSelectorProps {
  selectedRoutes: USPSRoute[];
  onSelectRoutes: (routes: USPSRoute[]) => void;
}

const USPSRouteSelector = ({ selectedRoutes, onSelectRoutes }: USPSRouteSelectorProps) => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Fetch routes from our API
  const routesQuery = useQuery({
    queryKey: ['/api/eddm/routes'],
    queryFn: getQueryFn<USPSRoute[]>({ on401: 'returnNull' }),
    enabled: isSelectionMode && !zipCode // Only fetch all routes when in selection mode and no ZIP filter
  });

  // Filtered routes by ZIP code
  const filteredRoutesQuery = useQuery({
    queryKey: ['/api/eddm/routes/zip', zipCode],
    queryFn: getQueryFn<USPSRoute[]>({ on401: 'returnNull' }),
    enabled: !!zipCode && zipCode.length >= 5 && searchPerformed
  });

  // Reset search status when zip code changes
  useEffect(() => {
    setSearchPerformed(false);
  }, [zipCode]);
  
  // Toggle route selection
  const toggleRoute = (route: USPSRoute) => {
    const isSelected = selectedRoutes.some(r => r.id === route.id);
    
    if (isSelected) {
      onSelectRoutes(selectedRoutes.filter(r => r.id !== route.id));
    } else {
      onSelectRoutes([...selectedRoutes, route]);
    }
  };
  
  // Clear all selected routes
  const clearSelection = () => {
    onSelectRoutes([]);
  };
  
  // Search for routes by ZIP code
  const handleSearch = () => {
    if (zipCode && zipCode.length >= 5) {
      setSearchPerformed(true);
    }
  };
  
  // Get the routes to display based on query state
  const getRoutesToDisplay = () => {
    if (zipCode && searchPerformed && filteredRoutesQuery.data) {
      return filteredRoutesQuery.data;
    }
    return routesQuery.data || [];
  };
  
  // Calculate total addresses
  const totalAddresses = selectedRoutes.reduce((sum, route) => sum + route.totalAddresses, 0);
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Select USPS Routes</h2>
      <div className="rounded-lg border overflow-hidden">
        <div className="h-80 bg-gray-100 relative">
          {/* Route selection interface */}
          <div className="absolute inset-0 flex flex-col">
            {isSelectionMode ? (
              <div className="flex-1 flex flex-col">
                <div className="p-3 border-b bg-white">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="relative">
                        <Input 
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="Enter ZIP code to filter routes"
                          className="pr-10"
                        />
                        <button 
                          onClick={handleSearch}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          <Search size={18} />
                        </button>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsSelectionMode(false)}
                      size="sm"
                    >
                      Close
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto">
                  {(routesQuery.isLoading || filteredRoutesQuery.isLoading) && (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  )}

                  {!routesQuery.isLoading && !filteredRoutesQuery.isLoading && (
                    <>
                      {zipCode && searchPerformed && filteredRoutesQuery.data?.length === 0 && (
                        <div className="text-center p-4">
                          <p className="text-gray-500">No routes found for ZIP code {zipCode}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {getRoutesToDisplay().map(route => (
                          <div 
                            key={route.id}
                            onClick={() => toggleRoute(route)}
                            className={`p-3 rounded border cursor-pointer transition-colors ${
                              selectedRoutes.some(r => r.id === route.id)
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white hover:bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="font-medium">{route.routeName}</div>
                            <div className="text-sm flex items-center gap-1">
                              <MapPin size={14} />
                              {route.city}, {route.state} {route.zipCode}
                            </div>
                            <div className="text-sm mt-1">{route.totalAddresses.toLocaleString()} addresses</div>
                            <div className="text-xs">
                              ({route.residentialAddresses} res, {route.businessAddresses || 0} bus)
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-4">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3l-6-3m6-3l6-3m6 3v7.382a1 1 0 01-1.447.894L15 17" />
                  </svg>
                  <p className="text-gray-600 mt-2">USPS Route Selection</p>
                  <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                    Select postal carrier routes to target specific neighborhoods for your EDDM campaign
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => setIsSelectionMode(true)}
                    className="mt-4"
                  >
                    Select Routes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedRoutes.length === 0 && (
              <p className="text-gray-500 text-sm">No routes selected. Select routes to target specific areas.</p>
            )}
            
            {selectedRoutes.map(route => (
              <span key={route.id} className="bg-primary text-white text-sm py-1 px-3 rounded-full flex items-center">
                {route.routeName} ({route.zipCode})
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRoute(route);
                  }}
                  className="ml-2 text-white hover:text-white/80"
                  aria-label={`Remove ${route.routeName}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold">Total Selected: </span>
              <span>{selectedRoutes.length} Routes ({totalAddresses.toLocaleString()} addresses)</span>
            </div>
            {selectedRoutes.length > 0 && (
              <Button 
                variant="ghost" 
                onClick={clearSelection}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Clear Selection
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default USPSRouteSelector;
