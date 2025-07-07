"use client";
import { useState, useRef } from "react";
import { getFirebaseAuth } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Suggestion type for review highlights
export type Suggestion = {
  type: "original" | "suggestion" | "plain";
  text: string;
  accepted?: boolean;
  rejected?: boolean;
  modified?: boolean;
};

export function ReviewResult({ input, suggestions, onBack }: { input: string; suggestions: Suggestion[]; onBack: () => void }) {
  // Track accept/reject/modify state for each suggestion
  const [results, setResults] = useState(suggestions);
  const [modifyIdx, setModifyIdx] = useState<number | null>(null);
  const [modifyText, setModifyText] = useState("");
  const [modifying, setModifying] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownIdx, setDropdownIdx] = useState<number | null>(null);

  function handleAccept(idx: number) {
    // Accept: remove the yellow (original) before, keep green (suggestion) as plain text
    setResults(prev => {
      const newResults = [...prev];
      if (idx > 0 && newResults[idx - 1].type === "original" && newResults[idx].type === "suggestion") {
        // Remove yellow
        newResults.splice(idx - 1, 1);
        // Remove green highlight
        newResults[idx - 1] = { ...newResults[idx - 1], type: "plain", accepted: undefined, rejected: undefined };
        // Remove dropdown
        setDropdownIdx(null);
        return newResults;
      }
      return prev;
    });
  }
  function handleReject(idx: number) {
    // Reject: remove the green (suggestion), keep yellow (original) as plain text
    setResults(prev => {
      const newResults = [...prev];
      if (idx > 0 && newResults[idx - 1].type === "original" && newResults[idx].type === "suggestion") {
        // Remove green
        newResults.splice(idx, 1);
        // Remove yellow highlight
        newResults[idx - 1] = { ...newResults[idx - 1], type: "plain", accepted: undefined, rejected: undefined };
        // Remove dropdown
        setDropdownIdx(null);
        return newResults;
      }
      return prev;
    });
  }
  function handleModify(idx: number) {
    setModifyIdx(idx);
    setModifyText(results[idx].text);
  }

  async function getIdTokenOrSignIn() {
    const auth = getFirebaseAuth();
    if (!auth.currentUser) {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    }
    return auth.currentUser ? await auth.currentUser.getIdToken() : null;
  }

  async function handleModifySubmit() {
    if (modifyIdx !== null) {
      setModifying(true);
      try {
        const idToken = await getIdTokenOrSignIn();
        if (!idToken) throw new Error("Authentication failed");
        // Find the original/yellow for this green
        let start = 0, end = 0;
        const original = input;
        for (let i = modifyIdx - 1; i >= 0; i--) {
          if (results[i].type === "original") {
            start = original.indexOf(results[i].text);
            end = start + results[i].text.length;
            break;
          }
        }
        const res = await fetch("http://localhost:55000/api/modify", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            original,
            suggested: results[modifyIdx].text,
            start,
            end,
            user_prompt: modifyText,
          }),
        });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setResults(results.map((s, i) =>
          i === modifyIdx ? { ...s, text: data.suggested, modified: true } : s
        ));
        setModifyIdx(null);
        setModifyText("");
      } catch (e) {
        alert("Failed to modify: " + (e as Error).message);
      } finally {
        setModifying(false);
      }
    }
  }
  function handleDropdown(idx: number) {
    setDropdownIdx(dropdownIdx === idx ? null : idx);
  }

  return (
    <div className="w-full max-w-3xl bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 flex flex-col items-center transition-all">
      <div className="w-full mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Review Results</h2>
        <button className="text-blue-600 underline text-sm" onClick={onBack}>Back to editor</button>
      </div>
      <div className="w-full">
        <div className="w-full h-[75vh] min-h-[300px] rounded-3xl shadow-xl p-8 text-lg bg-white/70 backdrop-blur-lg border border-white/30 font-medium mb-4 overflow-y-auto whitespace-pre-wrap text-black relative">
          {results.map((s, i) => {
            if (s.type === "original") {
              return (
                <span key={i} className="bg-yellow-200/60 rounded px-1 mx-0.5 line-through text-gray-500 transition-all duration-300">{s.text}</span>
              );
            }
            if (s.type === "suggestion") {
              return (
                <span key={i} className={`relative bg-green-200/60 rounded px-1 mx-0.5 transition-all cursor-pointer`}
                  onClick={() => handleDropdown(i)}
                  tabIndex={0}
                  onBlur={() => setDropdownIdx(null)}
                >
                  {s.text}
                  {dropdownIdx === i && (
                    <div ref={dropdownRef} className="absolute left-1/2 -translate-x-1/2 top-full mt-2 flex flex-col bg-white/95 border border-blue-100/60 rounded-xl shadow-lg z-20 min-w-[120px] animate-fade-in">
                      <button className="px-4 py-2 text-left hover:bg-green-100 rounded-t-xl text-green-700 font-medium" onMouseDown={() => handleAccept(i)}>Accept</button>
                      <button className="px-4 py-2 text-left hover:bg-red-100 text-red-700 font-medium" onMouseDown={() => handleReject(i)}>Reject</button>
                      <button className="px-4 py-2 text-left hover:bg-purple-100 rounded-b-xl text-purple-700 font-medium" onMouseDown={() => handleModify(i)}>Modify</button>
                    </div>
                  )}
                </span>
              );
            }
            // plain text
            return <span key={i}>{s.text}</span>;
          })}
        </div>
      </div>
      {/* Modify popup */}
      {modifyIdx !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-purple-200/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-xs border border-purple-400 flex flex-col items-center">
            <div className="mb-2 text-purple-900 font-bold">Modify suggestion</div>
            <textarea
              className="w-full h-24 rounded-xl p-2 border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-4 text-black"
              maxLength={200}
              value={modifyText}
              onChange={e => setModifyText(e.target.value)}
              disabled={modifying}
            />
            <button
              className="w-full py-2 rounded-xl bg-purple-500 text-white font-bold shadow hover:bg-purple-600 transition mb-2 disabled:opacity-50"
              onClick={handleModifySubmit}
              disabled={modifying}
            >
              {modifying ? "Modifying..." : "Modify"}
            </button>
            <button className="text-xs text-purple-700 underline" onClick={() => setModifyIdx(null)} disabled={modifying}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
