import { useState, useEffect, useRef } from "react";
import { T } from "../tokens";

interface Props {
  onRegister: (username: string) => void;
  error?: string;
  loading?: boolean;
}

export function RegisterScreen({
  onRegister,
  error: externalError,
  loading,
}: Props) {
  const [value, setValue] = useState("");
  const [localError, setLocalError] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const error = externalError || localError;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function submit() {
    if (loading) return;
    const v = value.trim();
    if (!v) {
      setLocalError("enter a username");
      return;
    }
    if (v.length < 2) {
      setLocalError("at least 2 characters");
      return;
    }
    if (!/^[a-z0-9._-]+$/i.test(v)) {
      setLocalError("letters, numbers, . _ - only");
      return;
    }
    onRegister(v);
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") submit();
    if (localError) setLocalError("");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "0 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 360 }}>
        {/* wordmark */}
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 11,
            letterSpacing: "0.2em",
            color: T.muted,
            textTransform: "uppercase",
            marginBottom: 56,
            userSelect: "none",
          }}
        >
          stonemire
        </div>

        {/* label */}
        <label
          style={{
            display: "block",
            fontFamily: T.mono,
            fontSize: 11,
            letterSpacing: "0.12em",
            color: T.dim,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          choose a username
        </label>

        {/* input */}
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (localError) setLocalError("");
          }}
          onKeyDown={onKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="e.g. atlas"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            borderBottom: `1px solid ${error ? "var(--danger)" : focused ? T.accent : T.line}`,
            padding: "10px 0",
            fontSize: 20,
            fontFamily: T.mono,
            color: T.text,
            outline: "none",
            transition: "border-color 0.15s",
            caretColor: T.accent,
          }}
        />

        {/* error */}
        <div
          style={{
            height: 20,
            marginTop: 6,
            fontFamily: T.mono,
            fontSize: 11,
            color: "var(--danger)",
            opacity: error ? 1 : 0,
            transition: "opacity 0.15s",
          }}
        >
          {error || " "}
        </div>

        {/* button */}
        <button
          onClick={submit}
          disabled={loading}
          style={{
            display: "block",
            width: "100%",
            marginTop: 24,
            padding: "14px 0",
            background: loading ? T.bg3 : T.accent,
            color: loading ? T.muted : "#000",
            border: "none",
            cursor: loading ? "default" : "pointer",
            fontFamily: T.mono,
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 600,
            transition: "opacity 0.12s",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.opacity = "0.85";
          }}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {loading ? "connecting..." : "continue"}
        </button>

        {/* fine print */}
        <div
          style={{
            marginTop: 32,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {[
            "end-to-end encrypted",
            "all messages and your username are permanently deleted when you close or reload this tab - nothing is ever stored",
          ].map((text) => (
            <div
              key={text}
              style={{
                fontSize: 11,
                color: T.muted,
                lineHeight: 1.5,
                fontFamily: T.sans,
                fontWeight: 300,
              }}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
