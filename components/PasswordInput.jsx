"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Password field with a show/hide toggle. Shares the .auth-input styling used
// across login, register and the portal so every password box looks the same.
export default function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
  required = false,
  minLength,
  disabled = false,
  autoComplete = "current-password",
  className = "auth-input",
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-password">
      <input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className}
        required={required}
        minLength={minLength}
        disabled={disabled}
        autoComplete={autoComplete}
      />

      <button
        type="button"
        className="auth-password-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        tabIndex={-1}
        disabled={disabled}
      >
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
