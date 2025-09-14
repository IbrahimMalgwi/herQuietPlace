// src/api/prayer.ts
import { supabase } from "../lib/supabaseClient";
import { Prayer } from "../types/prayers";

// Fetch prayers
export async function fetchPrayers(
  communityOnly: boolean,
  userId: string
): Promise<Prayer[]> {
  let query = supabase
    .from("prayers")
    .select("*")
    .order("created_at", { ascending: false });

  if (communityOnly) {
    // community prayers (shared + approved)
    query = query.eq("approved", true).eq("shared", true);
  } else {
    // personal prayers
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Prayer[];
}

// Create prayer (user submission)
export async function createPrayer(
  userId: string,
  title: string,
  content?: string
): Promise<Prayer> {
  const { data, error } = await supabase
    .from("prayers")
    .insert([{ user_id: userId, title, content, shared: false, approved: false }])
    .select()
    .single();

  if (error) throw error;
  return data as Prayer;
}
