// src/types/prayer.ts
export type Prayer = {
  id: string;
  user_id: string | null;
  title: string;
  content: string | null;
  shared: boolean;
  approved: boolean;
  created_at: string;
};

export type PrayerInsert = {
  user_id?: string;
  title: string;
  content?: string;
  shared?: boolean;
  approved?: boolean;
};
