export function TicketList({ tickets, onTicketClick, showEmpty = false }) {
  if (tickets.length === 0 && showEmpty) {
    return <p className="text-center text-black text-opacity-50">No tickets yet</p>;
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          onClick={() => onTicketClick(ticket.id)}
          className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#66CCFF] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-black">Ticket #{ticket.id}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              ticket.status === "open" ? "bg-green-100 text-green-700" :
              ticket.status === "in_progress" ? "bg-yellow-100 text-yellow-700" :
              "bg-gray-100 text-gray-700"
            }`}>
              {ticket.status}
            </span>
          </div>
          {ticket.customer_username && (
            <p className="text-black text-opacity-70 text-sm mb-2">Customer: {ticket.customer_username}</p>
          )}
          <p className="text-black text-opacity-70 text-sm mb-2">{ticket.order_summary}</p>
          <p className="text-[#66CCFF] font-bold">${parseFloat(ticket.total_price).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
