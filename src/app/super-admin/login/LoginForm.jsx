"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminIcon from "@/components/admin/AdminIcon";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import styles from "./login.module.css";

const MESSAGES = {
  forbidden: { tone: "error", text: "This account doesn’t have Super Admin access. You’ve been signed out." },
  signedOut: { tone: "info", text: "You’ve been signed out securely." },
};

export default function LoginForm({ next = "/super-admin", reason = "", signedOut = false }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(() =>
    reason === "forbidden" ? MESSAGES.forbidden : signedOut ? MESSAGES.signedOut : null
  );
  const emailRef = useRef(null);

  // A signed-in but non-admin session was bounced here by the middleware:
  // make sure it is fully signed out so the "authenticated" role grants nothing.
  useEffect(() => {
    if (reason !== "forbidden") return;
    getBrowserSupabase().auth.signOut().catch(() => {});
    router.replace("/super-admin/login");
  }, [reason, router]);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    setNotice(null);
    setLoading(true);

    const supabase = getBrowserSupabase();

    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setNotice({ tone: "error", text: "Invalid email or password." });
        setPassword("");
        return;
      }

      // Authorisation: only allow-listed super admins may continue. The check
      // runs inside Postgres; a plain authenticated user gets `false`.
      const { data: isAdmin, error: roleError } = await supabase.rpc("is_super_admin");
      if (roleError || isAdmin !== true) {
        await supabase.auth.signOut();
        setNotice({ tone: "error", text: "This account doesn’t have Super Admin access." });
        setPassword("");
        return;
      }

      router.replace(next);
      router.refresh();
    } catch {
      setNotice({ tone: "error", text: "We couldn’t sign you in right now. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {notice && (
        <p className={`${styles.notice} ${styles[notice.tone]}`} role={notice.tone === "error" ? "alert" : "status"}>
          <AdminIcon name={notice.tone === "error" ? "alert" : "check"} size={15} />
          {notice.text}
        </p>
      )}

      <label className={styles.field}>
        <span>Email</span>
        <input
          ref={emailRef}
          type="email"
          name="email"
          autoComplete="username"
          inputMode="email"
          placeholder="admin@signalreach.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </label>

      <label className={styles.field}>
        <span>Password</span>
        <span className={styles.passwordWrap}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="button"
            className={styles.eye}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            tabIndex={-1}
          >
            <AdminIcon name={showPassword ? "eyeOff" : "eye"} size={17} />
          </button>
        </span>
      </label>

      <button className={styles.submit} type="submit" disabled={loading || !email || !password} aria-busy={loading}>
        {loading ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            Signing in…
          </>
        ) : (
          <>
            Sign In
            <AdminIcon name="arrowRight" size={16} />
          </>
        )}
      </button>
    </form>
  );
}
