import { createClient } from "@supabase/supabase-js";
import { ExpoSecureStoreAdapter } from "./storage";

// Existing CampusTracker Supabase backend endpoint
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://znvyuimftngikskfawtr.supabase.co";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpudnl1aW1mdG5naWtza2Zhd3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY4ODg4ODgsImV4cCI6MjAzMjQ2NDzgOH0.dummyAnonKeySignature";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
