"use client";
import { useState } from "react";

export function ReviewResult({ input, suggestions, onBack }: { input: string; suggestions: any[]; onBack: () => void }) {
  // Track accept/reject/modify state for each suggestion
  const [results, setResults] = useState(suggestions);
  const [modifyIdx, setModifyIdx] = useState<number | null>(null);
  const [modifyText, setModifyText] = useState("");

  function handleAccept(idx: number) {
    setResults(results.map((s, i) => (i === idx ? { ...s, accepted: true } : s)));
  }
  function handleReject(idx: number) {
    setResults(results.map((s, i) => (i === idx ? { ...s, rejected: true } : s)));
  }
  function handleModify(idx: number) {
    setModifyIdx(idx);
    setModifyText(results[idx].text);
  }
  function handleModifySubmit() {
    if (modifyIdx !== null) {
      setResults(results.map((s, i) => (i === modifyIdx ? { ...s, text: modifyText, accepted: true, modified: true } : s)));
      setModifyIdx(null);
      setModifyText("");
    }
  }

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <div className="w-full mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Review Results</h2>
        <button className="text-blue-600 underline text-sm" onClick={onBack}>Back to editor</button>
      </div>
      <div className="w-full bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/30">
        <div className="text-gray-700 mb-2 font-semibold">Your text:</div>
        <div className="whitespace-pre-wrap">
          {results.map((s, i) =>
            s.type === "original" ? (
              <span key={i} className="bg-yellow-200/60 rounded px-1 mx-0.5">
                {s.text}
              </span>
            ) : (
              <span key={i} className={`relative group bg-green-200/60 rounded px-1 mx-0.5 transition-all ${s.accepted ? "bg-green-400/80" : ""} ${s.rejected ? "bg-yellow-200/60" : ""}`}>
                {s.text}
                {!s.accepted && !s.rejected && (
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 flex gap-1 opacity-0 group-hover:opacity-100 transition pointer-events-auto z-10">
                    <button className="px-2 py-1 rounded-lg bg-green-500 text-white text-xs shadow hover:bg-green-600" onClick={() => handleAccept(i)}>Accept</button>
                    <button className="px-2 py-1 rounded-lg bg-red-500 text-white text-xs shadow hover:bg-red-600" onClick={() => handleReject(i)}>Reject</button>
                    <button className="px-2 py-1 rounded-lg bg-purple-500 text-white text-xs shadow hover:bg-purple-600" onClick={() => handleModify(i)}>Modify</button>
                  </span>
                )}
              </span>
            )
          )}
        </div>
      </div>
      {/* Modify popup */}
      {modifyIdx !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-purple-200/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-xs border border-purple-400 flex flex-col items-center">
            <div className="mb-2 text-purple-900 font-bold">Modify suggestion</div>
            <textarea
              className="w-full h-24 rounded-xl p-2 border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-4"
              maxLength={200}
              value={modifyText}
              onChange={e => setModifyText(e.target.value)}
            />
            <button
              className="w-full py-2 rounded-xl bg-purple-500 text-white font-bold shadow hover:bg-purple-600 transition mb-2"
              onClick={handleModifySubmit}
            >
              Modify
            </button>
            <button className="text-xs text-purple-700 underline" onClick={() => setModifyIdx(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
