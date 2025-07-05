"use client";
import { useState, useEffect } from "react";

const REVIEW_KEY = "writing-buddy-last-review";

export default function ProfilePage() {
  // Simulated user info
  const [name, setName] = useState("Jane Doe");
  const [email] = useState("jane@example.com");
  const [review, setReview] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [canReview, setCanReview] = useState(true);

  useEffect(() => {
    const last = localStorage.getItem(REVIEW_KEY);
    if (last) {
      const lastDate = new Date(parseInt(last, 10));
      const now = new Date();
      if (
        lastDate.getDate() === now.getDate() &&
        lastDate.getMonth() === now.getMonth() &&
        lastDate.getFullYear() === now.getFullYear()
      ) {
        setCanReview(false);
      }
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (captcha.trim().toLowerCase() !== "cat") {
      setError("CAPTCHA incorrect. Please type 'cat'.");
      return;
    }
    if (!review.trim()) {
      setError("Please enter a review.");
      return;
    }
    // Save review date
    localStorage.setItem(REVIEW_KEY, Date.now().toString());
    setCanReview(false);
    setSuccess("Thank you for your review!");
    setReview("");
    setCaptcha("");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/30 flex flex-col items-center">
        <h1 className="text-2xl font-extrabold mb-6 text-gray-800 drop-shadow">Profile</h1>
        <div className="w-full mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Email</label>
          <input
            className="w-full rounded-xl p-3 bg-gray-100 border border-white/30 mb-2 text-gray-500 cursor-not-allowed"
            value={email}
            disabled
          />
        </div>
        <div className="w-full mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Name</label>
          <input
            className="w-full rounded-xl p-3 bg-white border border-white/30 mb-2"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <form className="w-full" onSubmit={handleSubmit}>
          <label className="block text-gray-700 font-semibold mb-1">Submit a review</label>
          <textarea
            className="w-full rounded-xl p-3 bg-white border border-white/30 mb-2 resize-none"
            value={review}
            onChange={e => setReview(e.target.value)}
            maxLength={300}
            rows={3}
            disabled={!canReview}
            placeholder={canReview ? "Write your review here..." : "You can only submit one review per day."}
          />
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-700">Type this word: <span className="font-bold text-purple-700">cat</span></span>
            <input
              className="rounded-xl p-2 border border-purple-300 w-24"
              value={captcha}
              onChange={e => setCaptcha(e.target.value)}
              disabled={!canReview}
            />
          </div>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          {success && <div className="text-green-700 text-sm mb-2">{success}</div>}
          <button
            className="w-full py-3 rounded-2xl bg-purple-500 text-white font-bold shadow hover:bg-purple-600 transition-all mt-2 disabled:opacity-50"
            type="submit"
            disabled={!canReview}
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
