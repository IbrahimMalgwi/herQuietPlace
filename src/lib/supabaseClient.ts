// src/lib/supabaseClient.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// Your Supabase project settings
const SUPABASE_URL = 'https://dhkayufackfdpsutywdg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoa2F5dWZhY2tmZHBzdXR5d2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3Nzc0OTIsImV4cCI6MjA3MzM1MzQ5Mn0.Kdzodq25weNqlIRRtZfcTSq2ebGfag5sCw3PQtm_zik'

// Create client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // for mobile
  },
})
