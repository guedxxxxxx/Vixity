import { Upload, Send } from "lucide-react";

export function TicketConversation({ ticket, messages, user, message, setMessage, onSend, onUpload, onBack, onUserClick }) {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 border-2 border-gray-300 text-black rounded-lg font-semibold hover:bg-gray-100 transition-all"
      >
        ← Back
      </button>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-black">Ticket #{ticket.id}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            ticket.status === "open" ? "bg-green-100 text-green-700" :
            ticket.status === "in_progress" ? "bg-yellow-100 text-yellow-700" :
            "bg-gray-100 text-gray-700"
          }`}>
            {ticket.status}
          </span>
        </div>
        {user.role === "admin" && ticket.customer_username && (
          <p className="text-black text-opacity-70 mb-2">
            Customer: <button onClick={() => onUserClick && onUserClick(ticket.user_id)} className="text-[#66CCFF] hover:underline">{ticket.customer_username}</button>
          </p>
        )}
        <p className="text-black text-opacity-70 mb-2">{ticket.order_summary}</p>
        <p className="text-[#66CCFF] font-bold text-xl">${parseFloat(ticket.total_price).toFixed(2)}</p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-black text-opacity-50">No messages yet</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-4 py-3 rounded-lg ${
                  msg.sender_id === user.id 
                    ? "bg-[#66CCFF] text-white" 
                    : "bg-gray-200 text-black"
                }`}>
                  <p className="text-xs opacity-70 mb-1">{msg.username}</p>
                  {msg.message && <p>{msg.message}</p>}
                  {msg.image_url && <img src={msg.image_url} alt="Uploaded" className="mt-2 rounded" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex gap-2">
        <button
          onClick={onUpload}
          className="p-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all"
        >
          <Upload className="w-5 h-5" />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSend()}
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#66CCFF]"
        />
        <button
          onClick={onSend}
          className="px-6 py-2 bg-[#66CCFF] text-white rounded-lg font-semibold hover:bg-[#55BBEE] transition-all flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Send
        </button>
      </div>
    </div>
  );
}
