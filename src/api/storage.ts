// src/api/storage.ts
import { supabase } from '../lib/supabaseClient'

// Upload audio file to storage
export async function uploadAudioFile(fileUri: string, fileName: string) {
  const response = await fetch(fileUri)
  const blob = await response.blob()

  const { data, error } = await supabase.storage
    .from('audio-files')
    .upload(fileName, blob, { upsert: true })

  if (error) throw error

  // get public URL
  const { data: publicUrl } = supabase.storage.from('audio-files').getPublicUrl(fileName)

  return publicUrl.publicUrl
}
