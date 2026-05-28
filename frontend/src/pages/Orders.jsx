import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, Clock, CheckCircle2, AlertCircle, ShoppingBag, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        let token = localStorage.getItem('token');
        if (!token && localStorage.getItem('userInfo')) {
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          token = userInfo?.token;
        }

        if (!token) {
          toast.warning("Please log in to view your order history.");
          setLoading(false);
          navigate('/login');
          return;
        }

        const res = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          toast.error("Session expired. Please log in again.");
          navigate('/login');
          return;
        }

        if (!res.ok) {
          throw new Error(`Server returned status: ${res.status}`);
        }

        const data = await res.json();
        
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else if (data && Array.isArray(data.data)) {
          setOrders(data.data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        toast.error("Failed to load your orders. Please try again later.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [navigate]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-100'; 
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Processing': return <Clock className="w-3.5 h-3.5 text-blue-600" />;
      default: return <AlertCircle className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/40 py-12">
        <div className="container mx-auto px-4 max-w-4xl animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-64 mb-8"></div>
          <div className="space-y-6">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-48 border border-gray-100 shadow-sm"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/40 px-4">
        <Package className="w-16 h-16 text-gray-300 mb-4 stroke-[1.5]" />
        <h3 className="text-xl font-bold text-gray-800">No Orders Found</h3>
        <p className="text-gray-500 text-sm mt-1 mb-6 text-center">You haven't placed any orders yet.</p>
        <button 
          onClick={() => navigate('/explore')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2d5a5a] text-white rounded-xl text-xs font-semibold hover:bg-green-700 transition-all shadow-md"
        >
          <ShoppingBag className="w-4 h-4" /> Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/40 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl font-black text-gray-800 mb-2 flex items-center gap-2.5">
          <Package className="w-6 h-6 text-[#2d5a5a]" />
          <span>My Order History</span>
        </h2>
        <p className="text-xs text-gray-400 mb-8">Track your active orders and view past receipts</p>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
         
              <div className="bg-gray-50/60 px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <p className="text-gray-400 font-medium mb-0.5">ORDER ID</p>
                    <p className="font-mono font-bold text-gray-700">#{order._id ? order._id.slice(-8).toUpperCase() : 'UNKNOWN'}</p>
                  </div>
                  <div className="hidden sm:block border-l border-gray-200 h-8"></div>
                  <div>
                    <p className="text-gray-400 font-medium mb-0.5">DATE PLACED</p>
                    <p className="font-semibold text-gray-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border flex items-center gap-1.5 ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status || 'Pending'}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${order.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                    {order.isPaid ? 'PAID' : 'UNPAID'}
                  </span>
                </div>
              </div>

             
              <div className="p-5 divide-y divide-gray-50">
                {order.orderItems && order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="w-10 h-14 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden shrink-0">
                      <img 
                        src={item.coverImage || item.image || 'https://placehold.co/300x400?text=No+Image'} 
                        alt={item.title} 
                        onError={(e) => { e.target.src = 'https://placehold.co/300x400?text=Error'; }}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-800 truncate" title={item.title}>{item.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-gray-800">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              
              <div className="bg-gray-50/30 px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                  Method: <strong className="text-gray-600 font-bold">{order.paymentMethod || 'N/A'}</strong>
                </span>
                <p className="text-gray-500 font-medium">Total Price: <strong className="text-sm font-black text-[#2d5a5a]">${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</strong></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;