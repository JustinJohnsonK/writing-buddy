"use client";
import { useState, useEffect } from "react";
import { UserProfileDropdown } from "../../components/UserProfileDropdown";
import { ReviewResult, Suggestion } from "../../components/ReviewResult";
import { getFirebaseAuth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

export default function EditorPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [authChecked, setAuthChecked] = useState(false);

  // Persist input to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("editorInput");
    if (saved) setInput(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("editorInput", input);
  }, [input]);

  // Redirect to / if not authenticated
  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/");
      } else {
        setAuthChecked(true);
      }
    });
    return () => unsubscribe();
  }, [router]);

  async function getIdTokenOrSignIn() {
    const auth = getFirebaseAuth();
    if (!auth.currentUser) {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    }
    return auth.currentUser ? await auth.currentUser.getIdToken() : null;
  }

  async function handleReview() {
    setReviewed(false);
    try {
      const idToken = await getIdTokenOrSignIn();
      if (!idToken) throw new Error("Authentication failed");
      const res = await fetch("/api/proofread", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      // Transform API suggestions to our highlight format
      const result: Suggestion[] = [];
      let lastIdx = 0;
      for (const s of data.suggestions) {
        if (s.start > lastIdx) {
          result.push({ type: "plain", text: data.original_text.slice(lastIdx, s.start) });
        }
        result.push({ type: "original", text: s.original });
        result.push({ type: "suggestion", text: s.suggested });
        lastIdx = s.end;
      }
      if (lastIdx < data.original_text.length) {
        result.push({ type: "plain", text: data.original_text.slice(lastIdx) });
      }
      setSuggestions(result);
      setReviewed(true);
    } catch (e) {
      alert("Failed to proofread: " + (e as Error).message);
    }
  }

  if (!authChecked) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-purple-200">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur-xl shadow-lg rounded-b-3xl border-b border-blue-100/60 ring-1 ring-blue-100/60" style={{boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)'}}>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 shadow-md">
            <span className="text-white text-2xl font-bold">✍️</span>
          </span>
          <span className="font-extrabold text-2xl text-blue-700 tracking-tight drop-shadow-sm select-none">WritingBuddies</span>
        </div>
        <UserProfileDropdown />
      </header>
      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {!reviewed ? (
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="w-full max-w-3xl bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 flex flex-col items-center transition-all">
              <textarea
                className="w-full h-[75vh] min-h-[300px] rounded-3xl shadow-xl p-8 text-lg bg-white/70 backdrop-blur-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none mb-8 placeholder:text-gray-400 text-black font-medium"
                placeholder="Paste or write your text here..."
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{maxWidth: '100%'}}
              />
              <button
                className="mt-2 px-10 py-5 rounded-2xl bg-red-200 text-red-700 font-bold text-xl shadow-lg hover:scale-105 transition-all"
                onClick={handleReview}
                disabled={!input.trim()}
              >
                Review my text
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="w-full bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 flex flex-col items-center transition-all">
              <ReviewResult input={input} suggestions={suggestions} onBack={() => setReviewed(false)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
