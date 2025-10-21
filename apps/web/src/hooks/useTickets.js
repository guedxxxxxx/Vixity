import { useState } from "react";

export function useTickets(user) {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [message, setMessage] = useState("");

  const createTicket = async (cart) => {
    const orderSummary = cart.map(item => `${item.name} x${item.quantity}`).join(", ");
    const totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, orderSummary, totalPrice }),
      });
      if (!response.ok) throw new Error("Failed to create ticket");
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const loadTickets = async () => {
    try {
      const isAdmin = user.role === "admin";
      const response = await fetch(`/api/tickets?userId=${user.id}&isAdmin=${isAdmin}`);
      if (!response.ok) throw new Error("Failed to load tickets");
      const data = await response.json();
      setTickets(data.tickets);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTicketMessages = async (ticketId) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`);
      if (!response.ok) throw new Error("Failed to load ticket");
      const data = await response.json();
      setSelectedTicket(data.ticket);
      setTicketMessages(data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const sendTicketMessage = async () => {
    if (!message.trim()) return;
    
    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: user.id, message }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      setMessage("");
      loadTicketMessages(selectedTicket.id);
    } catch (err) {
      console.error(err);
    }
  };

  const uploadImage = async (ticketId, upload) => {
    try {
      const url = await upload();
      if (url) {
        const response = await fetch(`/api/tickets/${ticketId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senderId: user.id, imageUrl: url }),
        });
        if (!response.ok) throw new Error("Failed to upload image");
        loadTicketMessages(ticketId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    tickets,
    selectedTicket,
    setSelectedTicket,
    ticketMessages,
    message,
    setMessage,
    createTicket,
    loadTickets,
    loadTicketMessages,
    sendTicketMessage,
    uploadImage,
  };
}
