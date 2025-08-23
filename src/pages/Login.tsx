import React, { useState } from "react";
import { motion } from "framer-motion";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <motion.div
        className="glass-card p-8 rounded-2xl shadow-xl w-full max-w-md border border-border"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-medical-blue to-medical-purple flex items-center justify-center mb-2">
            <span className="text-2xl font-bold text-white">B</span>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-1">Welcome Back</h2>
          <p className="text-muted-foreground text-sm">Sign in to your account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-primary">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
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
  );
};

export default Login;