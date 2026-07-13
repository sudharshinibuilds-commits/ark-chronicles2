"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function AuthModal() {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"login"|"signup">("signup");
  const [step, setStep] = useState<"form"|"otp">("form");
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    college: "", role: "Reader"
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const colleges = [
    "IIT Bombay","IIT Delhi","IIT Madras","IIT Hyderabad",
    "BITS Pilani","NIT Warangal","NIT Trichy","VIT Vellore",
    "JNTU Hyderabad","KL University","Osmania University",
    "CBIT Hyderabad","Mahindra University","Woxsen University",
    "GITAM University","Amrita University","SRM University",
    "Manipal University","Christ University","Symbiosis",
  ];
  const [collegeSuggestions, setCollegeSuggestions] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
      } else {
        const seen = sessionStorage.getItem("ark_auth_seen");
        if (!seen) {
          setTimeout(() => setShow(true), 1500);
          sessionStorage.setItem("ark_auth_seen", "true");
        }
      }
    });
  }, []);

  const handleCollegeInput = (val: string) => {
    setForm({ ...form, college: val });
    if (val.length > 1) {
      setCollegeSuggestions(
        colleges.filter(c => c.toLowerCase().includes(val.toLowerCase()))
      );
    } else {
      setCollegeSuggestions([]);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name, college: form.college, role: form.role }
      }
    });
    if (error) { setError(error.message); setLoading(false); return; }
    await supabase.from("profiles").insert({
      email: form.email,
      name: form.name,
      college: form.college,
      role: "member",
    });
    setStep("otp");
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setShow(false);
    window.location.reload();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (!show && !user) return null;

  if (user) {
    return (
      <div style={{
        position: "fixed", top: 16, right: 16, zIndex: 99999,
        background: "#1B2A6B", color: "#fff", borderRadius: "999px",
        padding: "8px 20px", fontSize: "13px", fontWeight: 700,
        display: "flex", gap: "12px", alignItems: "center",
      }}>
        <span>👋 {user.email?.split("@")[0]}</span>
        <button onClick={handleLogout} style={{
          background: "rgba(255,255,255,0.2)", border: "none",
          color: "#fff", padding: "4px 12px", borderRadius: "999px",
          fontSize: "12px", cursor: "pointer", fontWeight: 700,
        }}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px",
        padding: "40px", width: "100%", maxWidth: "440px",
        borderTop: "6px solid #1B2A6B", position: "relative",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <button
          onClick={() => setShow(false)}
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "#f5f5f5", border: "none", borderRadius: "50%",
            width: "32px", height: "32px", cursor: "pointer",
            fontSize: "16px", fontWeight: 700,
          }}
        >✕</button>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "24px", fontWeight: 900 }}>
            <span style={{ color: "#D4A017" }}>A.R.K</span>
            <span style={{ color: "#0A0A0A", marginLeft: "8px" }}>CHRONICLES</span>
          </div>
          <div style={{ fontSize: "10px", color: "#888", letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px" }}>
            Architects of Rising Knowledge
          </div>
        </div>

        {step === "otp" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📧</div>
            <h3 style={{ fontSize: "20px", fontWeight: 800 }}>Verify Your Email</h3>
            <p style={{ color: "#666", fontSize: "14px", marginTop: "8px", marginBottom: "24px" }}>
              We sent a verification link to <strong>{form.email}</strong>
              <br />Click the link in your email to activate your account!
            </p>
            <button
              onClick={() => { setShow(false); setStep("form"); }}
              style={{
                background: "#1B2A6B", color: "#fff", border: "none",
                borderRadius: "999px", padding: "12px 32px",
                fontWeight: 700, fontSize: "14px", cursor: "pointer",
              }}
            >
              Got it! Close
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", marginBottom: "24px", background: "#f5f5f5", borderRadius: "999px", padding: "4px" }}>
              {(["signup", "login"] as const).map(m => (
                <button key={m} onClick={() => setMode(m)} style={{
                  flex: 1, padding: "10px", border: "none", borderRadius: "999px",
                  fontWeight: 700, fontSize: "13px", cursor: "pointer",
                  background: mode === m ? "#1B2A6B" : "transparent",
                  color: mode === m ? "#fff" : "#666",
                  transition: "all 0.2s",
                }}>
                  {m === "signup" ? "Join Ark" : "Login"}
                </button>
              ))}
            </div>

            {error && (
              <div style={{
                background: "#fff5f5", border: "1px solid #fed7d7",
                color: "#c53030", padding: "10px 14px", borderRadius: "8px",
                fontSize: "13px", marginBottom: "16px",
              }}>
                {error}
              </div>
            )}

            {mode === "signup" && (
              <>
                {[
                  ["Full Name", "name", "text", "Your full name"],
                  ["Email", "email", "email", "your@email.com"],
                  ["Password", "password", "password", "Min 6 characters"],
                ].map(([label, key, type, ph]) => (
                  <div key={key} style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "#555", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={ph}
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", border: "2px solid #e5e5e5", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: "14px", position: "relative" }}>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "#555", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    College / Institution
                  </label>
                  <input
                    type="text"
                    placeholder="Start typing your college..."
                    value={form.college}
                    onChange={e => handleCollegeInput(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "2px solid #e5e5e5", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
                  />
                  {collegeSuggestions.length > 0 && (
                    <div style={{
                      position: "absolute", top: "100%", left: 0, right: 0,
                      background: "#fff", border: "1px solid #e5e5e5",
                      borderRadius: "8px", zIndex: 100,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      maxHeight: "160px", overflowY: "auto",
                    }}>
                      {collegeSuggestions.map(c => (
                        <div key={c} onClick={() => { setForm({ ...form, college: c }); setCollegeSuggestions([]); }}
                          style={{ padding: "10px 14px", cursor: "pointer", fontSize: "13px", borderBottom: "1px solid #f5f5f5" }}
                          onMouseOver={e => (e.currentTarget.style.background = "#f0f4ff")}
                          onMouseOut={e => (e.currentTarget.style.background = "#fff")}
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "#555", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    I am a
                  </label>
                  <select
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", border: "2px solid #e5e5e5", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
                  >
                    <option>Reader</option>
                    <option>Founder</option>
                    <option>Investor</option>
                    <option>Journalist</option>
                  </select>
                </div>
                <button onClick={handleSignup} disabled={loading} style={{
                  width: "100%", background: "#1B2A6B", color: "#fff",
                  border: "none", borderRadius: "999px", padding: "14px",
                  fontSize: "15px", fontWeight: 700, cursor: "pointer",
                }}>
                  {loading ? "Creating account..." : "Join Ark →"}
                </button>
              </>
            )}

            {mode === "login" && (
              <>
                {[
                  ["Email", "email", "email", "your@email.com"],
                  ["Password", "password", "password", "••••••••"],
                ].map(([label, key, type, ph]) => (
                  <div key={key} style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "#555", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={ph}
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", border: "2px solid #e5e5e5", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
                    />
                  </div>
                ))}
                <button onClick={handleLogin} disabled={loading} style={{
                  width: "100%", background: "#1B2A6B", color: "#fff",
                  border: "none", borderRadius: "999px", padding: "14px",
                  fontSize: "15px", fontWeight: 700, cursor: "pointer", marginTop: "8px",
                }}>
                  {loading ? "Logging in..." : "Login →"}
                </button>
              </>
            )}

            <div style={{
              marginTop: "20px", padding: "16px",
              background: "#f0f4ff", borderRadius: "12px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#1B2A6B", marginBottom: "10px" }}>
                🤝 Join Our Community
              </div>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                <a href="https://linkedin.com/company/arkchronicles" target="_blank"
                  style={{ background: "#0077B5", color: "#fff", padding: "8px 16px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}>
                  LinkedIn
                </a>
                <a href="https://instagram.com/arkchronicles" target="_blank"
                  style={{ background: "#E1306C", color: "#fff", padding: "8px 16px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}>
                  Instagram
                </a>
                <a href="https://wa.me/+919999999999" target="_blank"
                  style={{ background: "#25D366", color: "#fff", padding: "8px 16px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}>
                  WhatsApp
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}