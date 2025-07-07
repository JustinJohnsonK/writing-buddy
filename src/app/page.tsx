"use client";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function Home() {
  const router = useRouter();
  // Hardcoded reviews
  const reviews = [
    { user: "Alice", rating: 5, text: "Amazing tool! Helped me a lot." },
    { user: "Bob", rating: 4, text: "Very useful and easy to use." },
    { user: "Charlie", rating: 5, text: "Best writing assistant ever!" },
  ];

  async function handleGoogleSignIn() {
    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/editor");
    } catch (e) {
      alert("Google sign-in failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 relative">
      {/* Reviews background */}
      <div className="absolute inset-0 flex flex-col justify-end items-center pointer-events-none select-none z-0">
        <div className="mb-16 flex gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="backdrop-blur-md bg-white/40 rounded-2xl shadow-lg px-6 py-4 w-64 border border-white/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-700">{r.user}</span>
                <span className="text-yellow-400">{'★'.repeat(r.rating)}</span>
              </div>
              <div className="text-gray-600 text-sm">{r.text}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Glassy box */}
      <div className="relative z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/30">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 drop-shadow">WritingBuddies</h1>
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold py-3 rounded-2xl shadow-lg hover:scale-105 transition-all mb-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.383 0-6.148-2.797-6.148-6.25s2.765-6.25 6.148-6.25c1.93 0 3.227.82 3.969 1.523l2.719-2.648c-1.711-1.594-3.93-2.574-6.688-2.574-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.031 9.547-9.719 0-.656-.07-1.156-.156-1.457z" fill="#4285F4"></path><path d="M3.152 7.548l3.281 2.406c.891-1.719 2.422-2.797 4.172-2.797 1.18 0 2.031.477 2.5.875l3.047-2.969c-1.383-1.281-3.164-2.063-5.547-2.063-3.672 0-6.75 2.406-7.867 5.719z" fill="#34A853"></path><path d="M12 22c2.43 0 4.469-.805 5.953-2.188l-3.438-2.805c-.953.672-2.242 1.141-3.516 1.141-2.734 0-5.055-1.844-5.891-4.344l-3.32 2.563c1.617 3.281 5.055 5.633 10.212 5.633z" fill="#FBBC05"></path><path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.383 0-6.148-2.797-6.148-6.25s2.765-6.25 6.148-6.25c1.93 0 3.227.82 3.969 1.523l2.719-2.648c-1.711-1.594-3.93-2.574-6.688-2.574-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.031 9.547-9.719 0-.656-.07-1.156-.156-1.457z" fill="none"></path></g></svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
