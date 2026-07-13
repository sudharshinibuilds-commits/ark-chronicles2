"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", college: "", role: "Reader"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email: form.email,
        name: form.name,
        college: form.college,
        role: "member",
      });
    }
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#faf9f6",
      }}>
        <div style={{
          background: "#fff",
          padding: "48px",
          borderRadius: "16px",
          textAlign: "center",
          maxWidth: "420px",
          borderTop: "6px solid #D4A017",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0A0A0A" }}>
            Welcome to ARK Chronicles!
          </h2>
          <p style={{ color: "#666", marginTop: "12px", marginBottom: "24px" }}>
            Check your email to verify your account then login!
          </p>
          <Link href="/login" style={{
            background: "#1B2A6B",
            color: "#fff",
            padding: "12px 32px",
            borderRadius: "999px",
            fontWeight: 700,
            textDecoration: "none",
            fontSize: "14px",
          }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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
          <div style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "2px" }}>
            <span style={{ color: "#D4A017" }}>A.R.K</span>
            <span style={{ color: "#0A0A0A", marginLeft: "8px" }}>CHRONICLES</span>
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, marginTop: "24px" }}>
            Join the Community
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

        {[
          ["Full Name", "name", "text", "Your full name"],
          ["Email", "email", "email", "your@email.com"],
          ["Password", "password", "password", "Min 6 characters"],
          ["College / Institution", "college", "text", "IIT Delhi, BITS Pilani..."],
        ].map(([label, key, type, placeholder]) => (
          <div key={key} style={{ marginBottom: "16px" }}>
            <label style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#555",
              display: "block",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}>
              {label}
            </label>
            <input
              type={type}
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e5e5",
                borderRadius: "8px",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />
          </div>
        ))}

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
            I am a
          </label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e5e5e5",
              borderRadius: "8px",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          >
            <option>Reader</option>
            <option>Founder</option>
            <option>Investor</option>
            <option>Journalist</option>
          </select>
        </div>

        <button
          onClick={handleSignup}
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
          {loading ? "Creating account..." : "Join Ark →"}
        </button>

        <div style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "14px",
          color: "#666",
        }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#1B2A6B", fontWeight: 700 }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}