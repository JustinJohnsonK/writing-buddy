"use client";
import { useState } from "react";
import { UserProfileDropdown } from "../../components/UserProfileDropdown";
import { ReviewResult } from "../../components/ReviewResult";

export default function EditorPage() {
  const [input, setInput] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  function handleReview() {
    // Simulate API call
    setReviewed(false);
    setTimeout(() => {
      // Fake suggestion: replace 'bad' with 'good'
      const regex = /bad/gi;
      let match;
      let result = [];
      let lastIndex = 0;
      let idx = 0;
      while ((match = regex.exec(input))) {
        result.push({
          type: "original",
          text: input.slice(lastIndex, match.index),
        });
        result.push({
          type: "suggestion",
          text: "good",
          original: match[0],
          id: idx++,
        });
        lastIndex = match.index + match[0].length;
      }
      result.push({ type: "original", text: input.slice(lastIndex) });
      setSuggestions(result);
      setReviewed(true);
    }, 1200);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-purple-200">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur-xl shadow-lg rounded-b-3xl border-b border-blue-100/60 ring-1 ring-blue-100/60" style={{boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)'}}>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 shadow-md">
            <span className="text-white text-2xl font-bold">✍️</span>
          </span>
          <span className="font-extrabold text-2xl text-blue-700 tracking-tight drop-shadow-sm select-none">Writing Buddy</span>
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
