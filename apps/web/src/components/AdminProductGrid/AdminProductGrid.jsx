import { Edit2, Trash2 } from "lucide-react";

export function AdminProductGrid({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#66CCFF] transition-all">
          {product.image_url && (
            <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
          )}
          <h3 className="text-xl font-bold text-black mb-2">{product.name}</h3>
          <p className="text-black text-opacity-70 text-sm mb-4">{product.description}</p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-[#66CCFF]">${parseFloat(product.price).toFixed(2)}</span>
            <span className="text-sm text-black text-opacity-50">Stock: {product.stock}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 px-4 py-2 bg-[#66CCFF] text-white rounded-lg font-semibold hover:bg-[#55BBEE] transition-all flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
