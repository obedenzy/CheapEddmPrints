import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { USPSRoute } from '@/lib/types';

// Mock USPS route data for demonstration
const mockRoutes: USPSRoute[] = [
  { id: '85705-C031', name: 'Route 85705-C031', addressCount: 458 },
  { id: '85705-C032', name: 'Route 85705-C032', addressCount: 418 },
  { id: '85705-C033', name: 'Route 85705-C033', addressCount: 356 },
  { id: '85705-C034', name: 'Route 85705-C034', addressCount: 487 },
  { id: '85705-C035', name: 'Route 85705-C035', addressCount: 411 }
];

interface USPSRouteSelectorProps {
  selectedRoutes: USPSRoute[];
  onSelectRoutes: (routes: USPSRoute[]) => void;
}

const USPSRouteSelector = ({ selectedRoutes, onSelectRoutes }: USPSRouteSelectorProps) => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
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
  
  // Calculate total addresses
  const totalAddresses = selectedRoutes.reduce((sum, route) => sum + route.addressCount, 0);
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Select USPS Routes</h2>
      <div className="rounded-lg border overflow-hidden">
        <div className="h-80 bg-gray-100 relative">
          {/* Map placeholder with interactive elements */}
          <div className="absolute inset-0 flex flex-col">
            {isSelectionMode ? (
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {mockRoutes.map(route => (
                    <div 
                      key={route.id}
                      onClick={() => toggleRoute(route)}
                      className={`p-3 rounded border cursor-pointer transition-colors ${
                        selectedRoutes.some(r => r.id === route.id)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="font-medium">{route.name}</div>
                      <div className="text-sm">{route.addressCount} addresses</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-4">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3l-6-3m6-3l6-3m6 3v7.382a1 1 0 01-1.447.894L15 17" />
                  </svg>
                  <p className="text-gray-600 mt-2">USPS Route Selection Map</p>
                  <p className="text-sm text-gray-500 mt-2">Click "Select Routes" to choose postal routes</p>
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
            {selectedRoutes.map(route => (
              <span key={route.id} className="bg-primary text-white text-sm py-1 px-3 rounded-full flex items-center">
                {route.name}
                <button 
                  onClick={() => toggleRoute(route)}
                  className="ml-2 text-white"
                  aria-label={`Remove ${route.name}`}
                >
                  <i className="fas fa-times-circle"></i>
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
