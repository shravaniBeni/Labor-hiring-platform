import supabaseClient from "@/utils/supabase";

// Fetch Jobs
export async function getJobs(
  token,
  { location, workType, availability, searchQuery, limit = 10, offset = 0 }
) {
  console.log("🚀 getJobs function called!");
  const supabase = await supabaseClient(token);
  let query = supabase.from("jobs").select("*");

  // Apply filters
  if (location) query = query.eq("location", location);
  if (workType) query = query.eq("work_type", workType);
  if (availability) query = query.eq("availability", availability);
  if (searchQuery) query = query.ilike("title", `%${searchQuery}%`);

  // Add pagination
  query = query.range(offset, offset + limit - 1);

  try {
    const { data, error } = await query;

    if (error) {
      console.error("❌ Supabase Fetch Error:", error);
      throw new Error("Failed to fetch jobs");
    }

    console.log("✅ Fetched Jobs:", data);
    return data;
  } catch (err) {
    console.error("❌ Error in getJobs():", err);
    return [];
  }
}

// Read Saved Jobs
export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*)");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}

// Read single job
export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .select("*, applications: applications(*)")
    .eq("id", job_id)
    .single();

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  return data;
}

// Add / Remove Saved Job
export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    // If the job is already saved, remove it
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id);

    if (deleteError) {
      console.error("Error removing saved job:", deleteError);
      return data;
    }

    return data;
  } else {
    // If the job is not saved, add it to saved jobs
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error saving job:", insertError);
      return data;
    }

    return data;
  }
}

// Toggle Job Open/Close Status
export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Updating Hiring Status:", error);
    return null;
  }

  return data;
}

// Get Jobs Created by Recruiter
export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching My Jobs:", error);
    return null;
  }

  return data;
}

// Delete a Job
export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error deleting job:", error);
  }

  return data;
}

// Upload Image to Supabase Storage
export async function uploadImage(file) {
  try {
    // ✅ Ensure the user is authenticated
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("User is not authenticated", sessionError);
      return null;
    }

    console.log("✅ Authenticated User:", session.user);

    const filePath = `profile/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("profile")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    console.log("✅ Image uploaded successfully:", data);
    return data.path;
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    return null;
  }
}

// Post a Job
export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error Creating Job");
  }

  return data;
}
