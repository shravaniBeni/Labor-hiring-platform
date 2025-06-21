import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { getJobs } from "@/api/apiJobs";

import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

console.log("🧐 getJobs Function:", getJobs);

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("");
  const [availability, setAvailability] = useState("");
  const [supabaseAccessToken, setSupabaseAccessToken] = useState(null);

  const { isLoaded, user } = useUser();
  const { getToken } = useAuth(); // ✅ Use useAuth() to get the token

  console.log("🔍 useUser() Output:", user);

  // Fetch jobs with filters
  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(async () => {
    if (!isLoaded) return [];
    const token = await getToken({ template: "supabase" }); // ✅ Correct way to get the token
    const jobs = await getJobs(token, {
      location,
      workType,
      availability,
      searchQuery,
    });
    console.log("🌐 Raw API Response:", jobs);
    console.log("📢 Component Rendered - Checking if getJobs is Called!");

    if (!jobs || jobs.length === 0) {
      console.error("API returned no jobs!");
    } else {
      console.log("Jobs fetched successfully:", jobs);
    }
    return jobs;
  });

  // Fetch Supabase Token
  useEffect(() => {
    const fetchToken = async () => {
      if (isLoaded) {
        const token = await getToken({ template: "supabase" });
        setSupabaseAccessToken(token);
        console.log("🔑 Supabase Token:", token);
      }
    };

    fetchToken();
  }, [isLoaded]);

  useEffect(() => {
    console.log("📢 Calling getJobs...");
    console.log("🛠 fnJobs Function:", fnJobs);
    if (isLoaded) {
      console.log("✅ isLoaded is TRUE, executing fnJobs()");
      fnJobs()
        .then((data) => {
          console.log("🎯 fnJobs() executed!");
          if (!data || data.length === 0) {
            console.error("API returned no jobs or undefined data!");
          } else {
            console.log("Fetched Jobs:", data);
          }
        })
        .catch((error) => console.error("Error fetching jobs:", error));
    }
  }, [isLoaded, location, workType, availability, searchQuery]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setLocation("");
    setWorkType("");
    setAvailability("");
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="">
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Hire Labors
      </h1>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="h-14 flex flex-row w-full gap-2 items-center mb-3"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title.."
          name="search-query"
          className="h-full flex-1 px-4 text-md"
        />
        <Button type="submit" className="h-full sm:w-28" variant="blue">
          Search
        </Button>
      </form>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Location Filter */}
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN")?.map(({ name }) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              )) || <SelectItem disabled>No locations found</SelectItem>}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Work Type Filter */}
        <Select value={workType} onValueChange={(value) => setWorkType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Work Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Farming">Farming</SelectItem>
              <SelectItem value="Harvesting">Harvesting</SelectItem>
              <SelectItem value="Plantation">Plantation</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Availability Filter */}
        <Select
          value={availability}
          onValueChange={(value) => setAvailability(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        <Button
          className="sm:w-1/2"
          variant="destructive"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

      {/* Jobs Loading State */}
      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {/* Jobs List */}
      {!loadingJobs && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savedInit={job?.saved?.length > 0}
              />
            ))
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
