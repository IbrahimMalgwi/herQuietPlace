// src/api/content.ts
import { supabase } from '../lib/supabaseClient'

// Fetch audio list
export async function fetchAudio() {
  const { data, error } = await supabase.from('audio').select('*')
  if (error) throw error
  return data
}

// Fetch daily strength
export async function fetchDailyStrength() {
  const { data, error } = await supabase.from('daily_strength').select('*').order('date', { ascending: false }).limit(1)
  if (error) throw error
  return data[0]
}
