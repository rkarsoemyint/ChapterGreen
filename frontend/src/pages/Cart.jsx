import React, { useState, useContext, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
    ShoppingCart, Truck, CheckSquare, Loader2, 
    MapPin, CreditCard, DollarSign, ArrowLeft,
    Minus, Plus, Trash2, ShoppingBag
} from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotalPrice, clearCart } = useCart();
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [isOpenCheckout, setIsOpenCheckout] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD'); 
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpenCheckout && user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || ''); 
    }
  }, [isOpenCheckout, user]);

  const subtotal = cartTotalPrice;
  const tax = cartTotalPrice * 0.05; 
  const total = subtotal + tax;

  const handleClearAllCartAction = () => {
    clearCart(); 
  };

  const confirmClearCart = () => {
    toast.warn(
      ({ closeToast }) => (
        <div className="text-sm p-1">
          <p className="font-semibold text-gray-800 mb-3">Are you sure you want to clear all items?</p>
          <div className="flex gap-2 justify-end">
            <button 
              className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-xl active:scale-95 transition-all"
              onClick={() => {
                handleClearAllCartAction(); 
                toast.success("All items removed from your cart!"); 
                closeToast(); 
              }}
            >
              Yes, Clear
            </button>
            <button 
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl active:scale-95 transition-all"
              onClick={closeToast}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };


  const handleDecreaseQuantity = (id, currentQty) => {
    if (currentQty <= 1) {
      toast.warn(
        ({ closeToast }) => (
          <div className="text-sm p-1">
            <p className="font-semibold text-gray-800 mb-3">Do you want to remove this item from the cart?</p>
            <div className="flex gap-2 justify-end">
              <button 
                className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-xl"
                onClick={() => {
                  removeFromCart(id);
                  toast.info("Item removed from cart");
                  closeToast();
                }}
              >
                Yes, Remove
              </button>
              <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl" onClick={closeToast}>
                Cancel
              </button>
            </div>
          </div>
        ),
        { position: "top-center", autoClose: false, closeOnClick: false }
      );
    } else {
      updateQuantity(id, -1);
    }
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      toast.warning('Please log in first to proceed to checkout.');
      navigate('/login');
      return;
    }
    setIsOpenCheckout(true);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in first to place an order.');
      navigate('/login');
      return;
    }

    if (!address || !phone || !name || !city) {
      toast.warning('Please fill in all the required delivery fields.');
      return;
    }

    if (paymentMethod === 'Online') {
      if (!cardNumber || !cardExpiry || !cardCvv) {
        toast.warning('Please fill in all credit card details for Online Payment.');
        return;
      }
    }

    setLoading(true);

    const orderData = {
      orderItems: cartItems.map(item => ({
        book: item._id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        coverImage: item.coverImage
      })),
      shippingAddress: { 
        name,
        email,
        phone, 
        city,
        address,
        state,
        zipCode
      },
      paymentMethod,
      isPaid: paymentMethod === 'Online', 
      paidAt: paymentMethod === 'Online' ? new Date() : null,
      totalPrice: total
    };

    try {
      const token = localStorage.getItem('token'); 

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success || response.ok) {
        toast.success('Your order has been placed successfully!');
        clearCart(); 
        setIsOpenCheckout(false);
        navigate('/orders'); 
      } else {
        toast.error(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect to the server. Please try again.');
    } finally {
      loading(false);
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 py-24 px-4">
        <ShoppingCart className="w-16 h-16 text-gray-300 mb-4 stroke-[1.5]" />
        <h3 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h3>
        <p className="text-gray-500 mt-2 mb-6 text-center">Looks like you haven't added any books to your cart yet.</p>
        <button 
          onClick={() => navigate('/explore')} 
          className="flex items-center gap-2 px-6 py-3 bg-[#2d5a5a] text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all shadow-md"
        >
          <ShoppingBag className="w-4 h-4" /> Start Shopping
        </button>
      </div>
    );
  }

  if (isOpenCheckout) {
    return (
      <div className="min-h-screen bg-gray-50/60 py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <button 
            onClick={() => setIsOpenCheckout(false)}
            className="flex items-center gap-2 text-sm text-[#2d5a5a] font-semibold hover:underline mb-6 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <form onSubmit={handlePlaceOrder} className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100/80">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Checkout Details</h2>
              <p className="text-xs text-gray-400 mb-6">Please enter your information to complete the order</p>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 text-[#2d5a5a] font-semibold text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>Shipping Address</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                    <input 
                      type="text" required placeholder="John Doe"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5a5a] transition-all bg-gray-50/30"
                      value={name} onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                    <input 
                      type="email" placeholder="johndoe@example.com"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5a5a] transition-all bg-gray-50/30"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number *</label>
                    <input 
                      type="tel" required placeholder="09123456789"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5a5a] transition-all bg-gray-50/30"
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">City *</label>
                    <input 
                      type="text" required placeholder="Yangon"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5a5a] transition-all bg-gray-50/30"
                      value={city} onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Street Address *</label>
                    <textarea 
                      rows="2" required placeholder="Building, Street, Township..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5a5a] transition-all bg-gray-50/30 resize-none"
                      value={address} onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
                    <input 
                      type="text" placeholder="Yangon Region"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5a5a] transition-all bg-gray-50/30"
                      value={state} onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">ZIP Code</label>
                    <input 
                      type="text" placeholder="11221"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5a5a] transition-all bg-gray-50/30"
                      value={zipCode} onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 text-[#2d5a5a] font-semibold text-sm mb-3">
                  <CreditCard className="w-4 h-4" />
                  <span>Payment Method</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div 
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3.5 border rounded-2xl flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'COD' 
                        ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${paymentMethod === 'COD' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Cash on Delivery</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Pay when you receive the order</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('Online')}
                    className={`p-3.5 border rounded-2xl flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'Online' 
                        ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${paymentMethod === 'Online' ? 'bg-[#2d5a5a]/10 text-[#2d5a5a]' : 'bg-gray-100 text-gray-500'}`}>
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Online Payment</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Simulate Credit or Debit Card</p>
                    </div>
                  </div>
                </div>
              </div>

              {paymentMethod === 'Online' && (
                <div className="p-5 border border-dashed border-gray-200 bg-gray-50/40 rounded-2xl mb-6 animate-fade-in">
                  <p className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#2d5a5a]" /> Enter Card Information (Simulation)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Card Number</label>
                      <input 
                        type="text" maxLength="16" placeholder="4242 4242 4242 4242"
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5a5a] bg-white transition-all"
                        value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Expiry Date</label>
                      <input
                        type="text" maxLength="5" 
                        placeholder="MM/YY"
                        maxlength="5"
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5a5a] bg-white transition-all text-center"
                        value={cardExpiry} 

                        onChange={(e) => {
                          let value = e.target.value;
                          let cleanValue = value.replace(/\D/g, '');

                          if (cleanValue.length > 2) {
                            const month = parseInt(cleanValue.substring(0, 2), 10);
                            if (month > 12) cleanValue = '12' + cleanValue.substring(2);
                            if (month === 0) cleanValue = '01' + cleanValue.substring(2);
                          }

                          if (cleanValue.length > 2) {
                            value = `${cleanValue.substring(0, 2)}/${cleanValue.substring(2, 4)}`;
                          } else {
                            value = cleanValue;
                          }
                          setCardExpiry(value);
                        }}
                          
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">CVV</label>
                      <input 
                        type="password" maxLength="3" placeholder="123"
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5a5a] bg-white transition-all text-center"
                        value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit" disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#1e3d3d] to-[#2d5a5a] hover:opacity-95 disabled:bg-gray-300 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-4 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    <span>{paymentMethod === 'Online' ? `Pay & Place Order $${total.toFixed(2)}` : 'Place Order'}</span>
                  </>
                )}
              </button>
            </form>

            <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80 sticky top-6">
              <div className="flex items-center gap-2 text-[#2d5a5a] font-bold text-lg mb-4">
                <ShoppingCart className="w-5 h-5" />
                <h3>Order Summary</h3>
              </div>

              <div className="max-h-56 overflow-y-auto mb-4 pr-1">
                <p className="text-xs font-semibold text-gray-400 mb-2">Your Items</p>
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <div className="w-11 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.coverImage || 'https://placehold.co/300x400?text=No+Image'} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-800 truncate">{item.title}</h4>
                      <p className="text-[10px] text-gray-400 truncate">by {item.author || 'Unknown'}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-700">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (5%)</span>
                  <span className="font-semibold text-gray-700">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-800 border-t border-dashed border-gray-100 pt-3 mt-1">
                  <span>Total</span>
                  <span className="text-[#2d5a5a] text-base">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-2xl p-3.5 mt-5">
                <p className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> Delivery Estimate
                </p>
                <p className="text-[10px] text-emerald-700/70 mt-1 leading-relaxed">
                  Your order will be delivered within 3-5 business days after processing.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 relative">
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-3xl font-extrabold text-[#2d5a5a] mb-8 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-[#2d5a5a]" />
          <span>Shopping Cart ({cartItems.length})</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-4 items-center">
                <div className="w-20 h-28 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                  <img src={item.coverImage || 'https://placehold.co/300x400?text=No+Image'} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-gray-800 text-base truncate" title={item.title}>{item.title}</h4>
                  <p className="text-gray-400 text-xs mb-2">By {item.author}</p>
                  <span className="text-lg font-black text-[#2d5a5a]">${item.price}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                  <button onClick={() => handleDecreaseQuantity(item._id, item.quantity)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-gray-700">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all active:scale-90">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <button onClick={() => { removeFromCart(item._id); toast.info("Item removed."); }} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90 shrink-0">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            
            <div className="flex justify-between items-center mt-2">
              <button onClick={() => navigate('/explore')} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#2d5a5a] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </button>

              <button 
                onClick={confirmClearCart} 
                className="text-sm font-semibold text-red-500 hover:text-red-700 hover:underline transition-all"
              >
                Clear All Items
              </button>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
              <div className="flex flex-col gap-3 border-b border-gray-50 pb-4 mb-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-700">${cartTotalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping Fee</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-base font-bold text-gray-800">Total Price</span>
                <span className="text-2xl font-black text-[#2d5a5a]">${cartTotalPrice.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-[#2d5a5a] hover:bg-green-700 text-white font-bold rounded-xl transition-all active:scale-98 flex items-center justify-center gap-3 shadow-lg shadow-gray-100"
              >
                <CreditCard className="w-5 h-5" /> Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;