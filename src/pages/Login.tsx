import React, { useState } from "react";
import { motion } from "framer-motion";
import { getBackendUrl } from "@/utils/backend";
import { useNavigate } from "react-router-dom"; // Add this import
import Footer from "@/components/Footer";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Add this line

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body = new URLSearchParams({
        grant_type: "password",
        username: email,
        password: password,
        scope: "",
        client_id: "",
        client_secret: "",
      }).toString();

      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Invalid email or password");
        } else if (res.status === 422) {
          throw new Error("Invalid request format");
        } else {
          throw new Error(`Server error: ${res.status}`);
        }
      }

      const data = await res.json();
      // Save token in localStorage
      localStorage.setItem("access_token", data.access_token);
      setLoading(false);
      // Redirect to home page
      navigate("/");
    } catch (err: any) {
      let errorMessage = "Login failed";

      if (err instanceof TypeError) {
        if (err.message.includes("Failed to fetch")) {
          errorMessage = "Cannot connect to server. Please check your internet connection and try again.";
        } else {
          errorMessage = err.message;
        }
      } else {
        errorMessage = err.message || "Login failed";
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <motion.div
          className="glass-card p-8 rounded-2xl shadow-xl w-full max-w-md border border-border"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-1">Welcome Back</h2>
            <p className="text-muted-foreground text-sm">Sign in to your account</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-primary">Email</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-primary">Password</label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
