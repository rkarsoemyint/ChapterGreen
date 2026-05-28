import React, { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('bookbound_cart');
    return localData ? JSON.parse(localData) : [];
  });


  useEffect(() => {
    localStorage.setItem('bookbound_cart', JSON.stringify(cartItems));
  }, [cartItems]);


  const addToCart = (book) => {
    setCartItems((prevItems) => {
      
      const isExist = prevItems.find(item => item._id === book._id);
      
      if (isExist) {
       
        return prevItems.map(item =>
          item._id === book._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
     
      return [...prevItems, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== bookId));
  };

  const updateQuantity = (bookId, amount) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item._id === bookId) {
          const newQuantity = item.quantity + amount;
         
          return { ...item, quantity: newQuantity < 1 ? 1 : newQuantity };
        }
        return item;
      })
    );
  };


  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartCount, 
      cartTotalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);