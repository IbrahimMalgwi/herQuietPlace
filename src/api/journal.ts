// src/api/journal.ts
import { supabase } from "../lib/supabaseClient";
import { Journal } from "../types/journal";

export async function fetchUserJournals(userId: string): Promise<Journal[]> {
  const { data, error } = await supabase
    .from("journals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Journal[];
}

export async function createJournalEntry(
  userId: string,
  title: string,
  content: string
): Promise<Journal> {
  const { data, error } = await supabase
    .from("journals")
    .insert([{ user_id: userId, title, content }])
    .select()
    .single();

  if (error) throw error;
  return data as Journal;
}
