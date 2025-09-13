import { supabase } from "../lib/supabaseClient";
import { Journal } from "../types/db";

// Create
export async function createJournalEntry(userId: string, content: string): Promise<Journal> {
  const { data, error } = await supabase
    .from("journal")
    .insert([{ user_id: userId, content }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Fetch
export async function fetchUserJournals(userId: string): Promise<Journal[]> {
  const { data, error } = await supabase
    .from("journal")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
