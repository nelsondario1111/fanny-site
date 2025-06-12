"use client";
import { useEffect, useState } from "react";

// SVG Arrow Icon
function ArrowUp() {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <circle cx={12} cy={12} r={11} stroke="currentColor" className="opacity-20" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 17V7m0 0l-4 4m4-4l4 4"
      />
    </svg>
  );
}

export default function BackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handle = () => setShow(window.scrollY > 250);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-8 right-6 z-50 bg-brand-green text-white shadow-xl rounded-full p-3 
        hover:bg-brand-gold hover:text-brand-green transition-all duration-200 border-2 border-brand-gold 
        focus:outline-none active:scale-90"
      style={{
        boxShadow:
          "0 4px 24px 0 rgba(60,80,60,0.15), 0 2px 4px 0 rgba(60,80,60,0.10)",
      }}
    >
      <ArrowUp />
    </button>
  );
}
