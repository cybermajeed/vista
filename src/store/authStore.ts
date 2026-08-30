import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  signOut: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
  initialize: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user || null;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      set({ user, profile, isLoading: false });
    } else {
      set({ user: null, profile: null, isLoading: false });
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();
        set({ user: currentUser, profile, isLoading: false });
      } else {
        set({ user: null, profile: null, isLoading: false });
      }
    });
  },
}));
