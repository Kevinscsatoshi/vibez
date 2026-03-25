"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

type Mode = "signin" | "signup";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const supabase = createClient();
  const getAppOrigin = () => {
    const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (configured) {
      return configured.replace(/\/+$/, "");
    }
    if (typeof window === "undefined") return "";
    return window.location.origin;
  };

  const toSafeNextPath = (raw: string | null) => {
    if (!raw) return "/";
    // Only allow in-app relative paths like "/profile/123".
    if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
    return "/";
  };

  const getNextPath = () => {
    if (typeof window === "undefined") return "/";
    const params = new URLSearchParams(window.location.search);
    return toSafeNextPath(params.get("next"));
  };

  const formatAuthError = (raw: string) => {
    const msg = raw.toLowerCase();
    if (msg.includes("email rate limit")) {
      return "Email sending is rate-limited. Please wait a minute and try again.";
    }
    if (msg.includes("invalid email")) {
      return "This email format looks invalid. Please check and try again.";
    }
    if (msg.includes("smtp")) {
      return "Email delivery is currently unavailable (SMTP issue). Please retry later.";
    }
    if (msg.includes("user already registered")) {
      return "This email is already registered. Try signing in or reset password.";
    }
    if (msg.includes("signup is disabled")) {
      return "Email sign-up is currently disabled by server configuration.";
    }
    return raw;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get("error");
    if (!errorCode) return;
    if (errorCode === "auth_callback_failed") {
      setError("GitHub callback failed. Please retry the sign-in flow.");
      return;
    }
    if (errorCode === "missing_auth_code") {
      setError("Missing auth code in callback. Please sign in again.");
    }
  }, []);

  const handleGitHubSignIn = async () => {
    setLoading(true);
    setError("");
    setMessage("Redirecting to GitHub...");
    const nextPath = getNextPath();
    const origin = getAppOrigin();
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo,
      },
    });

    if (oauthError) {
      setMessage("");
      setError(oauthError.message);
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const nextPath = getNextPath();

    if (mode === "signup") {
      const origin = getAppOrigin();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
          data: {
            display_name: name.trim(),
          },
        },
      });

      setLoading(false);
      if (signUpError) {
        setError(formatAuthError(signUpError.message));
      } else {
        setMessage(`Confirmation email sent to ${email}.`);
      }
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (signInError) {
      setError(formatAuthError(signInError.message));
      return;
    }

    router.push(nextPath);
    router.refresh();
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    setResending(true);
    setError("");
    const origin = getAppOrigin();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
      },
    });
    setResending(false);

    if (resendError) {
      setError(formatAuthError(resendError.message));
      return;
    }
    setMessage(`Confirmation email resent to ${email}.`);
  };

  const canSubmit =
    mode === "signin"
      ? email && password
      : email && password && name && password.length >= 6;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex flex-col items-center gap-2">
          <Image
            src="/logo.svg"
              alt="VibeZ"
            width={48}
            height={48}
            className="brand-logo"
          />
          <span className="text-2xl font-bold tracking-tight">
            Vibe<span className="font-black">Z</span>
          </span>
        </Link>
        <p className="mt-2 text-sm text-muted">
          {mode === "signin"
            ? "Sign in to your builder account"
            : "Create your builder account"}
        </p>
      </div>

      {/* GitHub OAuth */}
      <button
        onClick={handleGitHubSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 border border-border py-2.5 text-sm font-medium rounded-full hover:border-foreground/30 transition-colors mb-6 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        Continue with GitHub
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Email form */}
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              Display name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-foreground/30 transition-colors rounded-xl"
              placeholder="Your name"
              maxLength={50}
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-foreground/30 transition-colors rounded-xl"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-foreground/30 transition-colors rounded-xl"
            placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className={`w-full py-2.5 text-sm font-medium rounded-full transition-opacity ${
            canSubmit && !loading
              ? "bg-foreground text-background hover:opacity-90"
              : "bg-border text-muted cursor-not-allowed"
          }`}
        >
          {loading
            ? "..."
            : mode === "signin"
            ? "Sign in"
            : "Create account"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <div className="mt-4 rounded-xl bg-tag-bg px-3 py-2">
          <p className="text-xs text-center text-muted">{message}</p>
          {mode === "signup" && (
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resending || loading}
                className="text-xs text-foreground hover:underline disabled:text-muted disabled:no-underline"
              >
                {resending ? "Resending..." : "Resend confirmation email"}
              </button>
            </div>
          )}
        </div>
      )}
      {error && (
        <p className="mt-4 text-xs text-center text-red-600 bg-red-50 px-3 py-2 rounded-xl">
          {error}
        </p>
      )}

      {/* Toggle mode */}
      <p className="mt-6 text-xs text-center text-muted">
        {mode === "signin" ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              onClick={() => { setMode("signup"); setMessage(""); }}
              className="text-foreground font-medium hover:underline"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => { setMode("signin"); setMessage(""); }}
              className="text-foreground font-medium hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  );
}
