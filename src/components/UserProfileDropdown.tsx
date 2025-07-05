"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserProfileDropdown() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-md border border-white/40 hover:bg-blue-100/80 transition-all ring-1 ring-blue-100/60 backdrop-blur-md"
        onClick={() => setOpen((v) => !v)}
        style={{ boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)' }}
        aria-label="Open profile menu"
      >
        <span className="font-semibold text-blue-700">Profile</span>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-3 w-44 bg-white/95 rounded-2xl shadow-2xl border border-blue-100/60 z-30 ring-1 ring-blue-100/60 backdrop-blur-md animate-fade-in">
          <button
            className="w-full text-left px-5 py-3 hover:bg-blue-50 rounded-t-2xl transition-all font-medium text-blue-700"
            onClick={() => { setOpen(false); router.push("/profile"); }}
          >
            Profile
          </button>
          <button
            className="w-full text-left px-5 py-3 hover:bg-blue-50 rounded-b-2xl transition-all font-medium text-blue-700"
            onClick={() => { setOpen(false); }}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
