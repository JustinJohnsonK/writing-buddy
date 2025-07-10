"use client";
import { useEffect, useState } from "react";
import { getFirebaseAuth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";

type UserProfile = {
  id: string;
  email: string;
  name: string;
  created_at: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Redirect to /login if not authenticated
  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setIsAuthenticated(true);
        setAuthChecked(true);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch profile only if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (!user) return;
    (async () => {
      try {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/user/profile", {
          headers: {
            "Authorization": `Bearer ${idToken}`,
          },
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfile(data);
      } catch {
        setError("Could not load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated]);

  // Only render after auth check
  if (!authChecked) return null;
  if (!isAuthenticated) return null;

  if (loading) return <div className="p-10 text-center">Loading profile...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!profile) return null;

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
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 rounded-full bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition-all"
            onClick={() => router.push("/editor")}
          >
            Editor
          </button>
          <button
            className="px-4 py-2 rounded-full bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 transition-all"
            onClick={async () => {
              const auth = getFirebaseAuth();
              await signOut(auth);
              router.replace("/");
            }}
          >
            Log out
          </button>
        </div>
      </header>
      {/* Profile Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/30 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Your Profile</h2>
          <div className="w-full flex flex-col gap-4">
            <div className="bg-white/90 rounded-2xl shadow border border-blue-100/40 px-6 py-4 flex flex-col">
              <span className="text-xs font-semibold text-gray-500 mb-1">Name</span>
              <span className="text-lg font-bold text-black">{profile.name}</span>
            </div>
            <div className="bg-white/90 rounded-2xl shadow border border-blue-100/40 px-6 py-4 flex flex-col">
              <span className="text-xs font-semibold text-gray-500 mb-1">Email</span>
              <span className="text-lg font-bold text-black">{profile.email}</span>
            </div>
            <div className="bg-white/90 rounded-2xl shadow border border-blue-100/40 px-6 py-4 flex flex-col">
              <span className="text-xs font-semibold text-gray-500 mb-1">Created At</span>
              <span className="text-lg font-bold text-black">{profile.created_at}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
