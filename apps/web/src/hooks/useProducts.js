import { useState, useEffect } from "react";

export function useProducts(selectedCategory, user) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (user && user.role !== "admin") {
      loadProducts();
    }
  }, [selectedCategory, user]);

  const loadProducts = async () => {
    try {
      const response = await fetch(`/api/products?category=${selectedCategory}`);
      if (!response.ok) throw new Error("Failed to load products");
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      console.error(err);
    }
  };

  const saveProduct = async (productData, editingProduct) => {
    try {
      if (editingProduct?.id) {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (!response.ok) throw new Error("Failed to update product");
      } else {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...productData, category: selectedCategory }),
        });
        if (!response.ok) throw new Error("Failed to create product");
      }
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    products,
    setProducts,
    loadProducts,
    saveProduct,
    deleteProduct,
  };
}
