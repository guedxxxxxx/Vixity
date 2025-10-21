export function CategoryNav({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex gap-2 mb-8 border-b-2 border-gray-200">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-3 font-semibold transition-all ${
            selectedCategory === category
              ? "text-[#66CCFF] border-b-2 border-[#66CCFF]"
              : "text-black text-opacity-50 hover:text-opacity-100"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
