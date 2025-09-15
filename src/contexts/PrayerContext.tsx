// src/contexts/PrayerContext.tsx
import React, { createContext, useState, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

// Define a non-optional Prayer type
export type Prayer = {
  id: string;
  title: string;
  content?: string;
  approved: boolean; // required
  shared: boolean; // required
  user_id: string;
  created_at: string;
};

interface PrayerContextProps {
  prayers: Prayer[];
  loading: boolean;
  addPrayer: (title: string, content?: string) => Promise<void>;
  refreshPrayers: () => void;
}

export const PrayerContext = createContext<PrayerContextProps>({
  prayers: [],
  loading: false,
  addPrayer: async () => {},
  refreshPrayers: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const PrayerProvider: React.FC<ProviderProps> = ({ children }) => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPrayers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("prayers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Ensure approved and shared are booleans
      const safeData: Prayer[] = (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        content: p.content,
        approved: !!p.approved,
        shared: !!p.shared,
        user_id: p.user_id,
        created_at: p.created_at,
      }));

      setPrayers(safeData);
    } catch (err) {
      console.error("Failed to fetch prayers:", err);
    } finally {
      setLoading(false);
    }
  };

  const addPrayer = async (title: string, content?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("prayers")
        .insert([{ title, content, approved: false, shared: false }])
        .select()
        .single();

      if (error) throw error;

      setPrayers((prev) => [
        { ...data, approved: false, shared: false },
        ...prev,
      ]);
    } catch (err) {
      console.error("Failed to add prayer:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshPrayers = () => fetchPrayers();

  return (
    <PrayerContext.Provider
      value={{ prayers, loading, addPrayer, refreshPrayers }}
    >
      {children}
    </PrayerContext.Provider>
  );
};
