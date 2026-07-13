"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#faf9f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "48px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
        borderTop: "6px solid #1B2A6B",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            fontSize: "28px",
            fontWeight: 900,
            letterSpacing: "2px",
          }}>
            <span style={{ color: "#D4A017" }}>A.R.K</span>
            <span style={{ color: "#0A0A0A", marginLeft: "8px" }}>CHRONICLES</span>
          </div>
          <div style={{
            fontSize: "11px",
            color: "#888",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginTop: "4px",
          }}>
            Architects of Rising Knowledge
          </div>
          <h2 style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#0A0A0A",
            marginTop: "24px",
          }}>
            Welcome Back
          </h2>
        </div>

        {error && (
          <div style={{
            background: "#fff5f5",
            border: "1px solid #fed7d7",
            color: "#c53030",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "13px",
            marginBottom: "16px",
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#555",
            display: "block",
            marginBottom: "6px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e5e5e5",
              borderRadius: "8px",
              fontSize: "15px",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#555",
            display: "block",
            marginBottom: "6px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e5e5e5",
              borderRadius: "8px",
              fontSize: "15px",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            background: "#1B2A6B",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "999px",
            padding: "14px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Logging in..." : "Login →"}
        </button>

        <div style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "14px",
          color: "#666",
        }}>
          Don't have an account?{" "}
          <Link href="/signup" style={{ color: "#1B2A6B", fontWeight: 700 }}>
            Join Ark
          </Link>
        </div>
      </div>
    </div>
  );
}