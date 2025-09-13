import { supabase } from "../lib/supabaseClient";
import { Prayer } from "../types/db";

// Create
export async function createPrayer(userId: string, content: string): Promise<Prayer> {
  const { data, error } = await supabase
    .from("prayer")
    .insert([{ user_id: userId, content }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Fetch (with approved filter)
export async function fetchPrayers(onlyApproved: boolean, userId?: string): Promise<Prayer[]> {
  let query = supabase.from("prayer").select("*");

  if (onlyApproved) query = query.eq("approved", true);
  if (userId) query = query.eq("user_id", userId);

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
