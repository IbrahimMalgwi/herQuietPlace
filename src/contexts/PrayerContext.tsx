import React, { createContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

export interface Prayer {
  id: string;
  title: string;
  content?: string;
  created_at: string;
  approved?: boolean;
  shared?: boolean;
}

interface PrayerContextType {
  prayers: Prayer[];
  loading: boolean;
  refreshPrayers: () => void;
  addPrayer: (title: string, content?: string) => Promise<void>;
}

export const PrayerContext = createContext<PrayerContextType>({
  prayers: [],
  loading: false,
  refreshPrayers: () => {},
  addPrayer: async () => {},
});

export const PrayerProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshPrayers = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const table = user ? "prayers" : "public_prayers";
      const { data, error } = await supabase
        .from(table)
        .select("id, title, content, created_at, approved, shared")
        .order("created_at", { ascending: false });

      if (!error && data) setPrayers(data);
    } finally {
      setLoading(false);
    }
  };

  const addPrayer = async (title: string, content?: string) => {
    if (!user) return;
    try {
      const { data: newPrayer, error } = await supabase
        .from("prayers")
        .insert({ user_id: user.id, title, content })
        .select()
        .single();

      if (!error && newPrayer) {
        setPrayers((prev) => [newPrayer, ...prev]);
      }
    } catch (err) {
      console.log("Error adding prayer:", err);
    }
  };

  useEffect(() => {
    refreshPrayers();
  }, [user]);

  return (
    <PrayerContext.Provider
      value={{ prayers, loading, refreshPrayers, addPrayer }}
    >
      {children}
    </PrayerContext.Provider>
  );
};
