import { useState, useEffect } from "react";

export function useCart(user) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user) {
      loadCart(user.id);
    }
  }, [user]);

  const loadCart = async (userId) => {
    try {
      const response = await fetch(`/api/cart?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to load cart");
      const data = await response.json();
      setCart(data.cartItems || []);
    } catch (err) {
      console.error(err);
      setCart([]);
    }
  };

  const addToCart = async (productId, userId) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity: 1 }),
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      loadCart(userId);
    } catch (err) {
      console.error(err);
    }
  };

  const updateCartQuantity = async (cartItemId, quantity, userId) => {
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error("Failed to update cart");
      loadCart(userId);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (cartItemId, userId) => {
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove from cart");
      loadCart(userId);
    } catch (err) {
      console.error(err);
    }
  };

  const cartCount = (cart || []).reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = (cart || []).reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

  return {
    cart,
    setCart,
    loadCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    cartCount,
    cartTotal,
  };
}
