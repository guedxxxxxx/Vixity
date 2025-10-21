import { useState, useRef } from "react";
import { ShoppingCart, X, Plus, Minus, Upload, Send, Edit2, Trash2, ArrowRight } from "lucide-react";
import useUpload from "@/utils/useUpload";

const CATEGORIES = ["99 Nights in the Forest", "Blox Fruits"];

export default function VixityStore() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTickets, setShowTickets] = useState(false);
  const [adminView, setAdminView] = useState("products");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [message, setMessage] = useState("");
  const upload = useUpload();

  // Auth form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Load user from localStorage on mount
  useState(() => {
    const savedUser = localStorage.getItem("vixity_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setShowAuthModal(false);
      loadCart(parsedUser.id);
      if (parsedUser.role === "admin") {
        loadProducts();
      }
    }
  }, []);

  // Load products when category or user changes
  useState(() => {
    if (user && user.role !== "admin") {
      loadProducts();
    }
  }, [selectedCategory, user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const body = authMode === "login" 
        ? { username, password }
        : { username, password, email };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Authentication failed");
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem("vixity_user", JSON.stringify(data.user));
      setShowAuthModal(false);
      loadCart(data.user.id);
      if (data.user.role === "admin") {
        loadProducts();
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(`/api/products?category=${selectedCategory}`);
      if (!response.ok) throw new Error("Failed to load products");
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCart = async (userId) => {
    try {
      const response = await fetch(`/api/cart?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to load cart");
      const data = await response.json();
      setCart(data.cartItems);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId, quantity: 1 }),
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      loadCart(user.id);
    } catch (err) {
      console.error(err);
    }
  };

  const updateCartQuantity = async (cartItemId, quantity) => {
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error("Failed to update cart");
      loadCart(user.id);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove from cart");
      loadCart(user.id);
    } catch (err) {
      console.error(err);
    }
  };

  const createTicket = async () => {
    const orderSummary = cart.map(item => `${item.name} x${item.quantity}`).join(", ");
    const totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, orderSummary, totalPrice }),
      });
      if (!response.ok) throw new Error("Failed to create ticket");
      setShowCheckout(false);
      setShowCart(false);
      setCart([]);
      alert("Ticket created successfully! Our team will contact you soon.");
    } catch (err) {
      console.error(err);
      alert("Failed to create ticket");
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

  const uploadImage = async (ticketId) => {
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

  const handlePasteImage = async (e, callback) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        
        try {
          const url = await upload();
          if (url && callback) {
            callback(url);
          }
        } catch (err) {
          console.error('Paste upload error:', err);
        }
      }
    }
  };

  const sendImageToTicket = async (imageUrl) => {
    if (!selectedTicket) return;
    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: user.id, imageUrl }),
      });
      if (!response.ok) throw new Error("Failed to send image");
      loadTicketMessages(selectedTicket.id);
    } catch (err) {
      console.error(err);
    }
  };

  const saveProduct = async (productData) => {
    try {
      if (editingProduct?.id) {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (!response.ok) throw new Error("Failed to update product");
      } else {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...productData, category: selectedCategory }),
        });
        if (!response.ok) throw new Error("Failed to create product");
      }
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const uploadProductImage = async () => {
    try {
      const url = await upload();
      return url;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

  if (showAuthModal) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 font-inter">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-extrabold text-white mb-3">Vixity</h1>
            <p className="text-gray-400 text-lg">Premium Gaming Store</p>
          </div>

          <div className="bg-[#151515] border border-[#66CCFF]/20 rounded-xl p-8 shadow-2xl">
            <div className="flex border-b border-gray-800 mb-6">
              <button
                onClick={() => setAuthMode("login")}
                className={`flex-1 pb-4 text-sm font-semibold transition-all ${
                  authMode === "login"
                    ? "text-[#66CCFF] border-b-2 border-[#66CCFF]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className={`flex-1 pb-4 text-sm font-semibold transition-all ${
                  authMode === "signup"
                    ? "text-[#66CCFF] border-b-2 border-[#66CCFF]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuth}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-800 rounded-lg mb-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#66CCFF] transition-all"
                required
              />
              {authMode === "signup" && (
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-800 rounded-lg mb-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#66CCFF] transition-all"
                />
              )}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-800 rounded-lg mb-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#66CCFF] transition-all"
                required
              />
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <button
                type="submit"
                className="w-full bg-[#66CCFF] text-black py-3 rounded-lg font-bold hover:bg-[#55BBEE] transition-all"
              >
                {authMode === "login" ? "Log In" : "Sign Up"}
              </button>
            </form>
          </div>
        </div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-inter">
      {/* Header */}
      <header className="bg-[#0A0A0A] border-b border-gray-900 sticky top-0 z-40 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-4xl font-black text-white tracking-tight">Vixity</h1>
          <div className="flex items-center gap-4">
            {user.role === "customer" && (
              <button
                onClick={() => {
                  setShowTickets(!showTickets);
                  if (!showTickets) loadTickets();
                }}
                className="px-5 py-2.5 border border-[#66CCFF] text-[#66CCFF] rounded-lg font-semibold hover:bg-[#66CCFF] hover:text-black transition-all"
              >
                My Tickets
              </button>
            )}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2.5 hover:bg-gray-900 rounded-lg transition-all"
            >
              <ShoppingCart className="w-6 h-6 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#66CCFF] text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("vixity_user");
                setUser(null);
                setShowAuthModal(true);
              }}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Category Navigation */}
        {user.role === "admin" ? (
          <div className="flex gap-2 mb-12 border-b border-gray-900">
            <button
              onClick={() => setAdminView("products")}
              className={`px-8 py-4 font-bold text-lg transition-all ${
                adminView === "products"
                  ? "text-[#66CCFF] border-b-2 border-[#66CCFF]"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => {
                setAdminView("tickets");
                loadTickets();
              }}
              className={`px-8 py-4 font-bold text-lg transition-all ${
                adminView === "tickets"
                  ? "text-[#66CCFF] border-b-2 border-[#66CCFF]"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Tickets
            </button>
          </div>
        ) : (
          <div className="flex gap-2 mb-12 border-b border-gray-900">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-8 py-4 font-bold text-lg transition-all ${
                  selectedCategory === category
                    ? "text-[#66CCFF] border-b-2 border-[#66CCFF]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Admin Product Management */}
        {user.role === "admin" && adminView === "products" && (
          <div>
            <div className="flex gap-3 mb-8">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-[#66CCFF] text-black"
                      : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <button
              onClick={() => setEditingProduct({})}
              className="mb-8 px-8 py-4 bg-[#66CCFF] text-black rounded-lg font-bold hover:bg-[#55BBEE] transition-all flex items-center gap-2 text-lg"
            >
              <Plus className="w-6 h-6" />
              Add Product
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-[#151515] border border-gray-900 rounded-xl p-6 hover:border-[#66CCFF]/50 transition-all">
                  {product.image_url && (
                    <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-[#66CCFF]">${parseFloat(product.price).toFixed(2)}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="flex-1 px-4 py-2.5 bg-[#66CCFF] text-black rounded-lg font-bold hover:bg-[#55BBEE] transition-all flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="px-4 py-2.5 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg font-bold hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Tickets View */}
        {user.role === "admin" && adminView === "tickets" && (
          <div>
            {selectedTicket ? (
              <TicketConversation
                ticket={selectedTicket}
                messages={ticketMessages}
                user={user}
                message={message}
                setMessage={setMessage}
                onSend={sendTicketMessage}
                onUpload={() => uploadImage(selectedTicket.id)}
                onPaste={(e) => handlePasteImage(e, sendImageToTicket)}
                onBack={() => setSelectedTicket(null)}
                onUserClick={(userId) => {
                  fetch(`/api/users/${userId}`)
                    .then(res => res.json())
                    .then(data => setEditingUser(data.user));
                }}
              />
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-[#151515] border border-gray-900 rounded-xl p-6 hover:border-[#66CCFF]/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">Ticket #{ticket.id}</h3>
                        <p className="text-gray-400 text-sm mb-2">Customer: {ticket.customer_username}</p>
                        <p className="text-gray-500 text-sm mb-3">{ticket.order_summary}</p>
                        <p className="text-[#66CCFF] font-bold text-xl">${parseFloat(ticket.total_price).toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                          ticket.status === "open" ? "bg-green-500/10 text-green-400 border border-green-500/30" :
                          ticket.status === "in_progress" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30" :
                          "bg-gray-800 text-gray-400 border border-gray-700"
                        }`}>
                          {ticket.status}
                        </span>
                        <button
                          onClick={() => loadTicketMessages(ticket.id)}
                          className="px-6 py-2.5 bg-[#66CCFF] text-black rounded-lg font-bold hover:bg-[#55BBEE] transition-all flex items-center gap-2"
                        >
                          Go to Ticket
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Customer Product Grid */}
        {user.role === "customer" && !showTickets && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-[#151515] border border-gray-900 rounded-xl p-6 hover:border-[#66CCFF]/50 transition-all cursor-pointer group"
                onClick={() => setSelectedProduct(product)}
              >
                {product.image_url && (
                  <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4 group-hover:opacity-90 transition-opacity" />
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-[#66CCFF]">${parseFloat(product.price).toFixed(2)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product.id);
                    }}
                    className="px-6 py-2.5 bg-[#66CCFF] text-black rounded-lg font-bold hover:bg-[#55BBEE] transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Customer Tickets View */}
        {user.role === "customer" && showTickets && (
          <div>
            {selectedTicket ? (
              <TicketConversation
                ticket={selectedTicket}
                messages={ticketMessages}
                user={user}
                message={message}
                setMessage={setMessage}
                onSend={sendTicketMessage}
                onUpload={() => uploadImage(selectedTicket.id)}
                onPaste={(e) => handlePasteImage(e, sendImageToTicket)}
                onBack={() => {
                  setSelectedTicket(null);
                  loadTickets();
                }}
              />
            ) : (
              <div className="space-y-4">
                {tickets.length === 0 ? (
                  <p className="text-center text-gray-500 text-lg py-12">No tickets yet</p>
                ) : (
                  tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-[#151515] border border-gray-900 rounded-xl p-6 hover:border-[#66CCFF]/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2">Ticket #{ticket.id}</h3>
                          <p className="text-gray-500 text-sm mb-3">{ticket.order_summary}</p>
                          <p className="text-[#66CCFF] font-bold text-xl">${parseFloat(ticket.total_price).toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                            ticket.status === "open" ? "bg-green-500/10 text-green-400 border border-green-500/30" :
                            ticket.status === "in_progress" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30" :
                            "bg-gray-800 text-gray-400 border border-gray-700"
                          }`}>
                            {ticket.status}
                          </span>
                          <button
                            onClick={() => loadTicketMessages(ticket.id)}
                            className="px-6 py-2.5 bg-[#66CCFF] text-black rounded-lg font-bold hover:bg-[#55BBEE] transition-all flex items-center gap-2"
                          >
                            Go to Ticket
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="relative w-full max-w-md bg-[#0A0A0A] h-full overflow-y-auto animate-slide-in border-l border-gray-900">
            <div className="sticky top-0 bg-[#0A0A0A] border-b border-gray-900 p-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Cart ({cartCount})</h2>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-900 rounded-lg transition-all">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="p-6 text-center text-gray-500 text-lg">Your cart is empty</p>
            ) : (
              <>
                <div className="p-6 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-[#151515] border border-gray-900 rounded-xl p-5">
                      <div className="flex justify-between mb-3">
                        <h3 className="font-bold text-white text-lg">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-[#66CCFF] font-bold text-xl mb-4">${parseFloat(item.price).toFixed(2)}</p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center hover:bg-gray-800 transition-all"
                        >
                          <Minus className="w-5 h-5 text-white" />
                        </button>
                        <span className="font-bold text-white text-lg">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 bg-[#66CCFF] text-black rounded-lg flex items-center justify-center hover:bg-[#55BBEE] transition-all"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sticky bottom-0 bg-[#0A0A0A] border-t border-gray-900 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-bold text-white">Total</span>
                    <span className="text-3xl font-bold text-[#66CCFF]">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowCheckout(true);
                      setShowCart(false);
                    }}
                    className="w-full py-4 bg-[#66CCFF] text-black rounded-lg font-bold text-lg hover:bg-[#55BBEE] transition-all"
                  >
                    Finish Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" onClick={() => setShowCheckout(false)} />
          <div className="relative bg-[#151515] border border-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-fade-in">
            <div className="sticky top-0 bg-[#151515] border-b border-gray-900 p-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Order Summary</h2>
              <button onClick={() => setShowCheckout(false)} className="p-2 hover:bg-gray-900 rounded-lg transition-all">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4 mb-8">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-900">
                    <div>
                      <p className="font-semibold text-white text-lg">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-white text-lg">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-900">
                <span className="text-3xl font-bold text-white">Total</span>
                <span className="text-4xl font-bold text-[#66CCFF]">${cartTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={createTicket}
                className="w-full py-5 bg-[#66CCFF] text-black rounded-lg text-xl font-bold hover:bg-[#55BBEE] transition-all"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Product Edit Modal */}
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={saveProduct}
          onUpload={uploadProductImage}
          onPaste={handlePasteImage}
        />
      )}

      {/* User Edit Modal */}
      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={async (userData) => {
            try {
              const response = await fetch(`/api/users/${editingUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
              });
              if (!response.ok) throw new Error("Failed to update user");
              setEditingUser(null);
            } catch (err) {
              console.error(err);
            }
          }}
        />
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

function ProductDetailModal({ product, onClose, onAddToCart }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#151515] border border-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-fade-in">
        <div className="sticky top-0 bg-[#151515] border-b border-gray-900 p-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">{product.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-900 rounded-lg transition-all">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6">
          {product.image_url && (
            <img src={product.image_url} alt={product.name} className="w-full h-64 object-cover rounded-lg mb-6" />
          )}
          <p className="text-gray-400 mb-8 text-lg">{product.description}</p>
          <div className="flex items-center justify-between mb-8">
            <span className="text-4xl font-bold text-[#66CCFF]">${parseFloat(product.price).toFixed(2)}</span>
            <span className="text-gray-500 text-lg">In stock: {product.stock}</span>
          </div>
          <button
            onClick={() => {
              onAddToCart(product.id);
              onClose();
            }}
            className="w-full py-4 bg-[#66CCFF] text-black rounded-lg font-bold text-lg hover:bg-[#55BBEE] transition-all"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductEditModal({ product, onClose, onSave, onUpload, onPaste }) {
  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    stock: product.stock || 0,
    image_url: product.image_url || "",
  });
  const [uploading, setUploading] = useState(false);
  const containerRef = useRef(null);

  useState(() => {
    const handlePaste = async (e) => {
      if (onPaste) {
        await onPaste(e, (url) => {
          setFormData({ ...formData, image_url: url });
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('paste', handlePaste);
      return () => container.removeEventListener('paste', handlePaste);
    }
  }, [formData, onPaste]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" ref={containerRef}>
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#151515] border border-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#151515] border-b border-gray-900 p-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">{product.id ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-900 rounded-lg transition-all">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-800 rounded-lg mb-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#66CCFF]"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-800 rounded-lg mb-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#66CCFF] h-32"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-800 rounded-lg mb-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#66CCFF]"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-800 rounded-lg mb-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#66CCFF]"
            required
          />
          
          <div className="mb-6">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="w-full px-4 py-3 border border-[#66CCFF] text-[#66CCFF] rounded-lg font-semibold hover:bg-[#66CCFF] hover:text-black transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              {uploading ? "Uploading..." : "Upload Image (or Ctrl+V to paste)"}
            </button>
            {formData.image_url && (
              <img src={formData.image_url} alt="Preview" className="mt-4 w-full h-48 object-cover rounded-lg border border-gray-800" />
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#66CCFF] text-black rounded-lg font-bold text-lg hover:bg-[#55BBEE] transition-all"
          >
            Save Product
          </button>
        </form>
      </div>
    </div>
  );
}

function UserEditModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    display_name: user.display_name || "",
    description: user.description || "",
    role_title: user.role_title || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#151515] border border-gray-900 rounded-xl max-w-md w-full">
        <div className="bg-[#151515] border-b border-gray-900 p-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-900 rounded-lg transition-all">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <input
            type="text"
            placeholder="Display Name"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-800 rounded-lg mb-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#66CCFF]"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-800 rounded-lg mb-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#66CCFF] h-24"
          />
          <input
            type="text"
            placeholder="Role Title"
            value={formData.role_title}
            onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-800 rounded-lg mb-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#66CCFF]"
          />
          <button
            type="submit"
            className="w-full py-4 bg-[#66CCFF] text-black rounded-lg font-bold text-lg hover:bg-[#55BBEE] transition-all"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

function TicketConversation({ ticket, messages, user, message, setMessage, onSend, onUpload, onPaste, onBack, onUserClick }) {
  const containerRef = useRef(null);

  useState(() => {
    const handlePaste = async (e) => {
      if (onPaste) {
        await onPaste(e);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('paste', handlePaste);
      return () => container.removeEventListener('paste', handlePaste);
    }
  }, [onPaste]);

  return (
    <div ref={containerRef}>
      <button
        onClick={onBack}
        className="mb-6 px-6 py-3 border border-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-900 transition-all"
      >
        ← Back
      </button>

      <div className="bg-[#151515] border border-gray-900 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-white">Ticket #{ticket.id}</h2>
          <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
            ticket.status === "open" ? "bg-green-500/10 text-green-400 border border-green-500/30" :
            ticket.status === "in_progress" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30" :
            "bg-gray-800 text-gray-400 border border-gray-700"
          }`}>
            {ticket.status}
          </span>
        </div>
        {user.role === "admin" && ticket.customer_username && (
          <p className="text-gray-400 mb-2 text-lg">
            Customer: <button onClick={() => onUserClick && onUserClick(ticket.user_id)} className="text-[#66CCFF] hover:underline">{ticket.customer_username}</button>
          </p>
        )}
        <p className="text-gray-500 mb-3 text-lg">{ticket.order_summary}</p>
        <p className="text-[#66CCFF] font-bold text-2xl">${parseFloat(ticket.total_price).toFixed(2)}</p>
      </div>

      <div className="bg-[#151515] border border-gray-900 rounded-xl p-6 mb-6 max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 text-lg py-8">No messages yet</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-5 py-3 rounded-xl ${
                  msg.sender_id === user.id 
                    ? "bg-[#66CCFF] text-black" 
                    : "bg-gray-900 text-white"
                }`}>
                  <p className="text-xs opacity-70 mb-1 font-semibold">{msg.username}</p>
                  {msg.message && <p>{msg.message}</p>}
                  {msg.image_url && <img src={msg.image_url} alt="Uploaded" className="mt-2 rounded-lg max-w-full" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#151515] border border-gray-900 rounded-xl p-4 flex gap-3">
        <button
          onClick={onUpload}
          className="p-3 bg-gray-900 hover:bg-gray-800 rounded-lg transition-all"
        >
          <Upload className="w-5 h-5 text-white" />
        </button>
        <input
          type="text"
          placeholder="Type a message or Ctrl+V to paste image..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSend()}
          className="flex-1 px-4 py-3 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#66CCFF]"
        />
        <button
          onClick={onSend}
          className="px-8 py-3 bg-[#66CCFF] text-black rounded-lg font-bold hover:bg-[#55BBEE] transition-all flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Send
        </button>
      </div>
    </div>
  );
}