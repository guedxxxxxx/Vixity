import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("vixity_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setShowAuthModal(false);
    }
  }, []);

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
      return data.user;
    } catch (err) {
      setError(err.message);
      console.error(err);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("vixity_user");
    setUser(null);
    setShowAuthModal(true);
  };

  return {
    user,
    showAuthModal,
    authMode,
    setAuthMode,
    username,
    setUsername,
    password,
    setPassword,
    email,
    setEmail,
    error,
    handleAuth,
    logout,
  };
}
