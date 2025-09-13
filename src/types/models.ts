// src/types/models.ts
import { Database } from "./supabase";

export type Journal = Database["public"]["Tables"]["journal"]["Row"];
export type Prayer = Database["public"]["Tables"]["prayers"]["Row"];
export type DailyStrength = Database["public"]["Tables"]["daily_strength"]["Row"];

// If you need inserts/updates too:
export type JournalInsert = Database["public"]["Tables"]["journal"]["Insert"];
export type JournalUpdate = Database["public"]["Tables"]["journal"]["Update"];

export type PrayerInsert = Database["public"]["Tables"]["prayers"]["Insert"];
export type PrayerUpdate = Database["public"]["Tables"]["prayers"]["Update"];

export type DailyStrengthInsert = Database["public"]["Tables"]["daily_strength"]["Insert"];
export type DailyStrengthUpdate = Database["public"]["Tables"]["daily_strength"]["Update"];
