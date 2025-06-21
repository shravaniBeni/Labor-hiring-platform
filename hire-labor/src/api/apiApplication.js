import supabaseClient, { supabaseUrl } from "@/utils/supabase";

// - Apply to job ( candidate )

export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  console.log("🟢 Sending Job Application Data:", jobData);

  if (!jobData || !jobData.job_id || !jobData.candidate_id) {
    console.error("❌ Invalid job application data!", jobData);
    throw new Error("Invalid job application data!");
  }

  const { data, error } = await supabase
    .from("applications")
    .insert([{ ...jobData }])
    .select();

  console.log("🟢 Supabase Response Data:", data);
  console.log("❌ Supabase Error (if any):", error);

  if (error) {
    throw new Error("Error submitting Application");
  }

  return data; // ✅ Ensure this returns data
}

// - Edit Application Status ( recruiter )
export async function updateApplicationStatus(token, { job_id }, status) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }

  return data;
}

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title)")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}
