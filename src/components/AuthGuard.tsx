"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getFirebaseAuth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Allow access to root (login) page without auth
      if (!user && pathname !== "/") {
        router.replace("/");
      }
    });
    return () => unsubscribe();
  }, [router, pathname]);

  return <>{children}</>;
}
