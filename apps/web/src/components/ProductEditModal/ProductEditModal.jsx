import { useState } from "react";
import { X, Upload } from "lucide-react";

export function ProductEditModal({ product, onClose, onSave, onUpload }) {
  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    stock: product.stock || 0,
    image_url: product.image_url || "",
  });
  const [uploading, setUploading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleUpload = async () => {
    setUploading(true);
    const url = await onUpload();
    if (url) {
      setFormData({ ...formData, image_url: url });
    }
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">{product.id ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-[#66CCFF]"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-[#66CCFF] h-32"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-[#66CCFF]"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-[#66CCFF]"
            required
          />
          
          <div className="mb-4">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="w-full px-4 py-3 border-2 border-[#66CCFF] text-[#66CCFF] rounded-lg font-semibold hover:bg-[#66CCFF] hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
            {formData.image_url && (
              <img src={formData.image_url} alt="Preview" className="mt-4 w-full h-48 object-cover rounded-lg" />
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#66CCFF] text-white rounded-lg font-bold hover:bg-[#55BBEE] transition-all"
          >
            Save Product
          </button>
        </form>
      </div>
    </div>
  );
}
