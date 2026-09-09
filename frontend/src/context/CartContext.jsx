import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
      return [];
    }
  });

  // Save to localStorage on cart update
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  // Add product to cart
  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id || item.product._id === product.id);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prevItems, { product, quantity }];
    });
  }, []);

  // Remove product from cart
  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => item.product.id !== productId && item.product._id !== productId
      )
    );
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId || item.product._id === productId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  }, []);

  // Financial Calculations
  const cartSummary = useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => {
      const price = item.product.price || 0;
      return acc + price * item.quantity;
    }, 0);

    const discountTotal = cartItems.reduce((acc, item) => {
      if (item.product.discountPrice && item.product.discountPrice < item.product.price) {
        const savings = item.product.price - item.product.discountPrice;
        return acc + savings * item.quantity;
      }
      return acc;
    }, 0);

    const netSubtotal = subtotal - discountTotal;
    const shippingCost = netSubtotal > 100 || cartItems.length === 0 ? 0 : 14.99;
    const taxEstimate = netSubtotal * 0.08; // 8% estimated sales tax
    const grandTotal = netSubtotal + shippingCost + taxEstimate;

    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return {
      subtotal,
      discountTotal,
      netSubtotal,
      shippingCost,
      taxEstimate,
      grandTotal,
      itemCount,
    };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        ...cartSummary,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartProvider;
