"use client";
import { useEffect, useState } from "react";
import { getFirebaseAuth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

type UserProfile = {
  id: string;
  email: string;
  name: string;
  created_at: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError("Not signed in.");
        setLoading(false);
        return;
      }
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
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading profile...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/30 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Your Profile</h2>
        <div className="w-full text-left space-y-2">
          <div><span className="font-semibold">Name:</span> {profile.name}</div>
          <div><span className="font-semibold">Email:</span> {profile.email}</div>
          <div><span className="font-semibold">Created At:</span> {profile.created_at}</div>
        </div>
      </div>
    </div>
  );
}
