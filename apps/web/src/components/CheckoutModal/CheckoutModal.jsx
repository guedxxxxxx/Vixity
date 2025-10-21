import { X } from "lucide-react";

export function CheckoutModal({ cart, cartTotal, onClose, onCreateTicket }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-fade-in">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">Order Summary</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-3 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                <div>
                  <p className="font-semibold text-black">{item.name}</p>
                  <p className="text-sm text-black text-opacity-50">Quantity: {item.quantity}</p>
                </div>
                <p className="font-bold text-black">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-6 pb-6 border-b-2 border-gray-200">
            <span className="text-2xl font-bold text-black">Total</span>
            <span className="text-3xl font-bold text-[#66CCFF]">${cartTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={onCreateTicket}
            className="w-full py-4 bg-[#66CCFF] text-white rounded-lg text-lg font-bold hover:bg-[#55BBEE] transition-all"
          >
            Create Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
