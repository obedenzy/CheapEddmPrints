import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Order, SavedDesign } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/pricing';
import { format } from 'date-fns';

type ProfileTab = 'orders' | 'designs' | 'profile' | 'addresses' | 'settings';

const Profile = () => {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<ProfileTab>('orders');
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Fetch user orders
  const { 
    data: orders,
    isLoading: isLoadingOrders
  } = useQuery<Order[]>({
    queryKey: [user ? `/api/users/${user.id}/orders` : null],
    enabled: !!user
  });
  
  // Fetch saved designs
  const { 
    data: savedDesigns,
    isLoading: isLoadingDesigns
  } = useQuery<SavedDesign[]>({
    queryKey: [user ? `/api/users/${user.id}/designs` : null],
    enabled: !!user
  });
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <section>
      <div className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">My Account</h1>
          <p className="mt-2">Manage your orders and profile</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Account Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-light/10 text-primary mb-3">
                  <i className="fas fa-user text-3xl"></i>
                </div>
                <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
              
              <nav>
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className={`block w-full text-left py-2 px-3 rounded font-medium ${
                        activeTab === 'orders' 
                          ? 'bg-primary-light/10 text-primary' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <i className="fas fa-box-open mr-2"></i> My Orders
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className={`block w-full text-left py-2 px-3 rounded font-medium ${
                        activeTab === 'profile' 
                          ? 'bg-primary-light/10 text-primary' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <i className="fas fa-user-edit mr-2"></i> Edit Profile
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('designs')}
                      className={`block w-full text-left py-2 px-3 rounded font-medium ${
                        activeTab === 'designs' 
                          ? 'bg-primary-light/10 text-primary' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <i className="fas fa-images mr-2"></i> Saved Designs
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('addresses')}
                      className={`block w-full text-left py-2 px-3 rounded font-medium ${
                        activeTab === 'addresses' 
                          ? 'bg-primary-light/10 text-primary' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <i className="fas fa-map-marker-alt mr-2"></i> Addresses
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className={`block w-full text-left py-2 px-3 rounded font-medium ${
                        activeTab === 'settings' 
                          ? 'bg-primary-light/10 text-primary' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <i className="fas fa-cog mr-2"></i> Account Settings
                    </button>
                  </li>
                  <li className="pt-4 border-t mt-4">
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left py-2 px-3 text-red-500 hover:bg-red-50 rounded font-medium"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Account Content */}
          <div className="lg:w-3/4">
            {/* Orders Section */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-6">My Orders</h2>
                
                {isLoadingOrders ? (
                  <div className="py-8 text-center">
                    <i className="fas fa-spinner fa-spin text-primary text-2xl mb-2"></i>
                    <p>Loading your orders...</p>
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">{order.orderNumber}</td>
                            <td className="px-6 py-4">
                              {format(new Date(order.createdAt), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4">
                              {order.items ? 
                                order.items.length === 1 
                                  ? `${order.items[0].size.replace('x', '" x ')}": ${order.items[0].quantity.toLocaleString()} pcs` 
                                  : `${order.items.length} items` 
                                : 'Loading...'}
                            </td>
                            <td className="px-6 py-4">{formatCurrency(order.totalAmount)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                order.status === 'completed' 
                                  ? 'bg-accent-light/10 text-accent' 
                                  : order.status === 'shipped' 
                                  ? 'bg-blue-100 text-blue-600' 
                                  : 'bg-yellow-100 text-yellow-600'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Button variant="link" className="text-primary hover:text-primary-dark font-medium text-sm">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center bg-gray-50 rounded-lg">
                    <i className="fas fa-shopping-bag text-gray-300 text-5xl mb-4"></i>
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                    <Button 
                      onClick={() => navigate('/shop')}
                      className="mt-4 bg-primary hover:bg-primary-dark text-white"
                    >
                      Start Shopping
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Saved Designs */}
            {activeTab === 'designs' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Saved Designs</h2>
                
                {isLoadingDesigns ? (
                  <div className="py-8 text-center">
                    <i className="fas fa-spinner fa-spin text-primary text-2xl mb-2"></i>
                    <p>Loading your designs...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedDesigns && savedDesigns.length > 0 ? (
                      savedDesigns.map((design) => (
                        <div key={design.id} className="border rounded-lg overflow-hidden group">
                          <div className="h-48 overflow-hidden relative">
                            <img 
                              src={design.frontImageUrl} 
                              alt={design.name} 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button className="bg-white text-primary hover:bg-gray-100 py-2 px-4 rounded font-medium text-sm">
                                Edit Design
                              </Button>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium">{design.name}</h3>
                            <p className="text-sm text-gray-500">
                              Last modified: {format(new Date(design.updatedAt), 'MMM d, yyyy')}
                            </p>
                            <div className="flex justify-between items-center mt-3">
                              <Button variant="link" className="text-primary hover:text-primary-dark text-sm font-medium">
                                Use Design
                              </Button>
                              <Button variant="link" className="text-red-500 hover:text-red-600 text-sm">
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : null}
                    
                    {/* Upload New Design */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-full hover:bg-gray-50 cursor-pointer">
                      <div className="text-gray-400 mb-3">
                        <i className="fas fa-plus-circle text-4xl"></i>
                      </div>
                      <p className="font-medium text-gray-700">Create New Design</p>
                      <p className="text-sm text-gray-500 text-center mt-2">Upload a new design or create one from scratch</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Profile Edit Section (Placeholder) */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
                <p className="text-gray-500 mb-4">Update your personal information below</p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">First Name</label>
                      <input 
                        type="text" 
                        defaultValue={user.firstName} 
                        className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                      <input 
                        type="text" 
                        defaultValue={user.lastName} 
                        className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={user.email} 
                      className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      defaultValue={user.phone || ''} 
                      className="w-full border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                    />
                  </div>
                  
                  <Button className="bg-primary hover:bg-primary-dark text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
            
            {/* Other tabs (placeholders) */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Saved Addresses</h2>
                <p className="text-gray-500">Manage your shipping and billing addresses</p>
                {/* Address management UI would go here */}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                <p className="text-gray-500">Manage your account preferences and security settings</p>
                {/* Settings UI would go here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
