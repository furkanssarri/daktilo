import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey)
  throw new Error("SUPABASE_URL or SUPABASE_KEY not defined in the .env");

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
