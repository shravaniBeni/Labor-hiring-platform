import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseClient = async (supabaseAccessToken) => {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
  });
  // set Supabase JWT on the client object,
  // so it is sent up with all Supabase requests

  console.log("Env Variables Loaded?");
  console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
  console.log(
    "VITE_SUPABASE_ANON_KEY:",
    import.meta.env.VITE_SUPABASE_ANON_KEY ? "Loaded" : "Not Loaded"
  );

  return supabase;
};

export default supabaseClient;
