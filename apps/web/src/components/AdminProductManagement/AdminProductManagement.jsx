import { Plus } from "lucide-react";
import { AdminProductGrid } from "@/components/AdminProductGrid/AdminProductGrid";

export function AdminProductManagement({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  products, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct 
}) {
  return (
    <div>
      <div className="flex gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === category
                ? "bg-[#66CCFF] text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <button
        onClick={onAddProduct}
        className="mb-6 px-6 py-3 bg-[#66CCFF] text-white rounded-lg font-semibold hover:bg-[#55BBEE] transition-all flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Product
      </button>

      <AdminProductGrid 
        products={products} 
        onEdit={onEditProduct} 
        onDelete={onDeleteProduct} 
      />
    </div>
  );
}
