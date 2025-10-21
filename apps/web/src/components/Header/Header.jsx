import { ShoppingCart } from "lucide-react";

export function Header({ user, cartCount, onCartClick, onTicketsClick, onLogout }) {
  return (
    <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-black">Vixity</h1>
        <div className="flex items-center gap-4">
          {user.role === "customer" && (
            <button
              onClick={onTicketsClick}
              className="px-4 py-2 border-2 border-[#66CCFF] text-[#66CCFF] rounded-lg font-semibold hover:bg-[#66CCFF] hover:text-white transition-all"
            >
              My Tickets
            </button>
          )}
          <button
            onClick={onCartClick}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ShoppingCart className="w-6 h-6 text-black" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#66CCFF] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
