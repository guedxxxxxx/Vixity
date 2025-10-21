export function AdminNav({ activeView, onViewChange, onLoadTickets }) {
  return (
    <div className="flex gap-2 mb-8 border-b-2 border-gray-200">
      <button
        onClick={() => onViewChange("products")}
        className={`px-6 py-3 font-semibold transition-all ${
          activeView === "products"
            ? "text-[#66CCFF] border-b-2 border-[#66CCFF]"
            : "text-black text-opacity-50 hover:text-opacity-100"
        }`}
      >
        Products
      </button>
      <button
        onClick={() => {
          onViewChange("tickets");
          onLoadTickets();
        }}
        className={`px-6 py-3 font-semibold transition-all ${
          activeView === "tickets"
            ? "text-[#66CCFF] border-b-2 border-[#66CCFF]"
            : "text-black text-opacity-50 hover:text-opacity-100"
        }`}
      >
        Tickets
      </button>
    </div>
  );
}
