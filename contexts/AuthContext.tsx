"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: any } | undefined>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: any } | undefined>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        // Get current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error.message);
          setIsLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            // Check if user is admin
            const { data, error } = await supabase
              .from("admin_users")
              .select("role")
              .eq("id", session.user.id)
              .single();

            if (error) {
              console.error("Error fetching admin role:", error.message);
            } else {
              setIsAdmin(data?.role === "admin");
            }
          } catch (err) {
            console.error("Error checking admin status:", err);
          }
        }

        // Listen for auth changes
        const {
          data: { subscription },
        } = await supabase.auth.onAuthStateChange(async (event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user ?? null);

          if (newSession?.user) {
            try {
              const { data } = await supabase
                .from("admin_users")
                .select("role")
                .eq("id", newSession.user.id)
                .single();

              setIsAdmin(data?.role === "admin");
            } catch (err) {
              console.error("Error checking admin status on auth change:", err);
              setIsAdmin(false);
            }
          } else {
            setIsAdmin(false);
          }

          if (event === "SIGNED_OUT") {
            router.push("/login");
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [router]);

  // Sign up new user
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Sign up error:", error.message);
        return { error };
      }

      return undefined;
    } catch (error) {
      console.error("Unexpected sign up error:", error);
      return { error };
    }
  };

  // Sign in existing user
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error.message);
        return { error };
      }

      router.push("/admin");
      return undefined;
    } catch (error) {
      console.error("Unexpected sign in error:", error);
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
