// scripts/deleteUsers.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

async function deleteUsers() {
  const ids = [
    "630fa5f1-fa2f-48d4-be86-b7458ebf9b91",
    "e3e4c9ef-81cc-4fa2-8007-ef9f899158a3",
  ];

  for (const id of ids) {
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) {
      console.error(`❌ Failed to delete user ${id}:`, error.message);
    } else {
      console.log(`✅ Deleted user ${id}`);
    }
  }
}

deleteUsers();
