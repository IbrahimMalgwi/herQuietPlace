// src/types/journal.ts
export type Journal = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
};

// Type for inserting a new journal
export type JournalInsert = {
  user_id: string;
  content: string;
};
