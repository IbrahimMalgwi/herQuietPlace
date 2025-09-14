// src/api/admin.ts
import { supabase } from '../lib/supabaseClient'

/* ===============================
   TYPES
================================= */
export type Prayer = {
  id: string;
  content: string;
  approved: boolean;
  is_shared: boolean;
  user_id: string;
  created_at?: string;
};

export type Audio = {
  id: string;
  title: string;
  url: string;
  created_at?: string;
};

export type DailyStrength = {
  id: string;
  title: string;
  content: string;
  display_date: string; // yyyy-mm-dd
  created_at?: string;
};

/* ===============================
   PRAYERS (Admin Actions)
================================= */

// Approve a prayer → mark as shared & approved
export async function approvePrayer(prayerId: string): Promise<Prayer> {
  const { data, error } = await supabase
    .from("prayers")
    .update({ is_shared: true, approved: true })
    .eq("id", prayerId)
    .select()
    .single();

  if (error) throw error;
  return data as Prayer;
}

// Reject a prayer → delete from table
export async function rejectPrayer(prayerId: string): Promise<boolean> {
  const { error } = await supabase.from("prayers").delete().eq("id", prayerId);
  if (error) throw error;
  return true;
}

/* ===============================
   AUDIO (Admin Actions)
================================= */

// Add new audio (admin upload or external link)
export async function addAudio(title: string, url: string): Promise<Audio> {
  const { data, error } = await supabase
    .from("audio")
    .insert([{ title, url }])
    .select()
    .single();

  if (error) throw error;
  return data as Audio;
}

// Fetch all audio files
export async function fetchAudio(): Promise<Audio[]> {
  const { data, error } = await supabase
    .from("audio")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Audio[];
}

/* ===============================
   DAILY STRENGTH (Admin Actions)
================================= */

// Add daily strength message
export async function addDailyStrength(
  title: string,
  content: string,
  displayDate: string
): Promise<DailyStrength> {
  const { data, error } = await supabase
    .from("daily_strength")
    .insert([{ title, content, display_date: displayDate }])
    .select()
    .single();

  if (error) throw error;
  return data as DailyStrength;
}

// Fetch today's daily strength
export async function fetchTodayStrength(): Promise<DailyStrength | null> {
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
  const { data, error } = await supabase
    .from("daily_strength")
    .select("*")
    .eq("display_date", today)
    .maybeSingle();

  if (error) throw error;
  return data as DailyStrength | null;
}
