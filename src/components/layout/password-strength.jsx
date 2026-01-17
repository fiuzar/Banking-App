// components/auth/PasswordStrength.tsx
"use client";

import { useState, useEffect } from "react";

export default function PasswordStrength({ password, onScoreChange }) {
  const [score, setScore] = useState(0);

  const calculateStrength = (p) => {
    let s = 0;
    if (p.length > 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  useEffect(() => {
    const newScore = calculateStrength(password);
    setScore(newScore);
    if (onScoreChange) onScoreChange(newScore);
  }, [password, onScoreChange]);

  const getLabel = () => {
    if (password.length === 0) return "";
    if (score <= 1) return "Weak";
    if (score === 2) return "Fair";
    if (score === 3) return "Good";
    return "Strong";
  };

  const getColor = () => {
    if (score <= 1) return "bg-bank-error";
    if (score === 2) return "bg-bank-warning";
    return "bg-bank-success";
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex h-1 gap-1">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full flex-1 rounded-full transition-colors duration-300 ${
              step <= score ? getColor() : "bg-n-300"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <p className={`text-[11px] font-bold uppercase tracking-wider ${password.length > 0 ? "opacity-100" : "opacity-0"}`} 
           style={{ color: password.length > 0 ? 'var(--color-n-500)' : 'transparent' }}>
          Strength: <span className={score >= 3 ? "text-bank-success" : ""}>{getLabel()}</span>
        </p>
      </div>
    </div>
  );
}