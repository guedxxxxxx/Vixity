export function AuthModal({ 
  authMode, 
  setAuthMode, 
  username, 
  setUsername, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  error, 
  onSubmit 
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 font-inter">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-black mb-2">Vixity</h1>
          <p className="text-black text-opacity-70">Your gaming store</p>
        </div>

        <div className="bg-white border-2 border-[#66CCFF] rounded-lg p-8">
          <div className="flex border-b-2 border-gray-200 mb-6">
            <button
              onClick={() => setAuthMode("login")}
              className={`flex-1 pb-3 text-sm font-semibold transition-all ${
                authMode === "login"
                  ? "text-[#66CCFF] border-b-2 border-[#66CCFF]"
                  : "text-black text-opacity-50"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setAuthMode("signup")}
              className={`flex-1 pb-3 text-sm font-semibold transition-all ${
                authMode === "signup"
                  ? "text-[#66CCFF] border-b-2 border-[#66CCFF]"
                  : "text-black text-opacity-50"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 text-sm focus:outline-none focus:border-[#66CCFF]"
              required
            />
            {authMode === "signup" && (
              <input
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 text-sm focus:outline-none focus:border-[#66CCFF]"
              />
            )}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 text-sm focus:outline-none focus:border-[#66CCFF]"
              required
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#66CCFF] text-white py-3 rounded-lg font-semibold hover:bg-[#55BBEE] transition-all"
            >
              {authMode === "login" ? "Log In" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
