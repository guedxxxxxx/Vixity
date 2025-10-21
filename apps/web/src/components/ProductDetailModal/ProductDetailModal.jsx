import { X } from "lucide-react";

export function ProductDetailModal({ product, onClose, onAddToCart }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-fade-in">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">{product.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        <div className="p-6">
          {product.image_url && (
            <img src={product.image_url} alt={product.name} className="w-full h-64 object-cover rounded-lg mb-6" />
          )}
          <p className="text-black text-opacity-70 mb-6">{product.description}</p>
          <div className="flex items-center justify-between mb-6">
            <span className="text-3xl font-bold text-[#66CCFF]">${parseFloat(product.price).toFixed(2)}</span>
            <span className="text-black text-opacity-50">In stock: {product.stock}</span>
          </div>
          <button
            onClick={() => {
              onAddToCart(product.id);
              onClose();
            }}
            className="w-full py-3 bg-[#66CCFF] text-white rounded-lg font-bold hover:bg-[#55BBEE] transition-all"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
