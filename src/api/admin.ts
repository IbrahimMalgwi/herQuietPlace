// src/api/admin.ts
import { supabase } from '../lib/supabaseClient'

/** ========== PRAYERS ========== */
// Approve a prayer (make it shared + approved)
export async function approvePrayer(prayerId: string) {
  const { data, error } = await supabase
    .from('prayers')
    .update({ is_shared: true, approved: true })
    .eq('id', prayerId)
    .select()

  if (error) throw error
  return data[0]
}

// Reject a prayer (optional: delete it)
export async function rejectPrayer(prayerId: string) {
  const { error } = await supabase.from('prayers').delete().eq('id', prayerId)
  if (error) throw error
  return true
}

/** ========== AUDIO ========== */
// Add new audio (Admin uploads URL, e.g. from Supabase storage or external)
export async function addAudio(title: string, url: string) {
  const { data, error } = await supabase
    .from('audio')
    .insert([{ title, url }])
    .select()

  if (error) throw error
  return data[0]
}

// Fetch all audio files
export async function fetchAudio() {
  const { data, error } = await supabase
    .from('audio')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/** ========== DAILY STRENGTH ========== */
// Add daily strength message
export async function addDailyStrength(title: string, content: string, displayDate: string) {
  const { data, error } = await supabase
    .from('daily_strength')
    .insert([{ title, content, display_date: displayDate }])
    .select()

  if (error) throw error
  return data[0]
}

// Fetch today's daily strength
export async function fetchTodayStrength() {
  const today = new Date().toISOString().split('T')[0] // yyyy-mm-dd
  const { data, error } = await supabase
    .from('daily_strength')
    .select('*')
    .eq('display_date', today)
    .maybeSingle()

  if (error) throw error
  return data
}
