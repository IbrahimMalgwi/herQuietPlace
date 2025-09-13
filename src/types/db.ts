import { Database } from "./supabase";

export type Journal = Database["public"]["Tables"]["journal"]["Row"];
export type Prayer = Database["public"]["Tables"]["prayers"]["Row"];
export type DailyStrength = Database["public"]["Tables"]["daily_strength"]["Row"];
