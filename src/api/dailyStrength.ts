import { supabase } from "../lib/supabaseClient";
import { DailyStrength } from "../types/db";

// Create
export async function createDailyStrength(
  title: string,
  verse: string,
  message: string
): Promise<DailyStrength> {
  const { data, error } = await supabase
    .from("daily_strength")
    .insert([{ title, verse, message }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Fetch all
export async function fetchDailyStrengths(): Promise<DailyStrength[]> {
  const { data, error } = await supabase
    .from("daily_strength")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
