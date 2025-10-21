import { X, Plus, Minus, Trash2 } from "lucide-react";

export function CartSidebar({ 
  cart, 
  cartCount, 
  cartTotal, 
  onClose, 
  onUpdateQuantity, 
  onRemove, 
  onCheckout 
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto animate-slide-in">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">Cart ({cartCount})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="p-6 text-center text-black text-opacity-50">Your cart is empty</p>
        ) : (
          <>
            <div className="p-6 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-black">{item.name}</h3>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[#66CCFF] font-bold mb-3">${parseFloat(item.price).toFixed(2)}</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-black">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-[#66CCFF] text-white rounded-lg flex items-center justify-center hover:bg-[#55BBEE] transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-black">Total</span>
                <span className="text-2xl font-bold text-[#66CCFF]">${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full py-3 bg-[#66CCFF] text-white rounded-lg font-bold hover:bg-[#55BBEE] transition-all"
              >
                Finish Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
