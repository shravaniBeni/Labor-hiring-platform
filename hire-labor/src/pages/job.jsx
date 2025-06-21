import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Briefcase,
  DoorClosed,
  DoorOpen,
  MapPinIcon,
  PhoneCall,
  IndianRupee,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <img
          src={job?.photo}
          className="h-24 w-24 rounded-full border-2 border-gray-500"
          alt={job?.title}
        />
      </div>

      {/* Job Details */}
      <h2 className="text-2xl sm:text-3xl font-bold">About the Labor</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
        <div className="flex gap-2 items-center">
          <MapPinIcon /> <span className="font-semibold">{job?.location}</span>
        </div>
        <div className="flex gap-2 items-center">
          <IndianRupee />{" "}
          <span className="font-semibold">{job?.salary} per day</span>
        </div>
        <div className="flex gap-2 items-center">
          <Briefcase />{" "}
          <span className="font-semibold">
            {job?.experience} years of experience
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <PhoneCall />{" "}
          <span className="font-semibold">{job?.phoneNumber}</span>
        </div>
        <div className="flex gap-2">
          {job?.isOpen ? (
            <>
              <DoorOpen /> <span className="text-green-700">Available</span>
            </>
          ) : (
            <>
              <DoorClosed /> <span className="text-red-700">Not Available</span>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {/* <h2 className="text-2xl sm:text-3xl font-bold">About the Labor</h2> */}
      <p className="sm:text-lg">{job?.description}</p>

      {/* Skills & Requirements */}
      {/* <h2 className="text-2xl sm:text-3xl font-bold">
        Skills & Work Expertise
      </h2>
      <MDEditor.Markdown
        source={job?.requirements}
        className="bg-transparent sm:text-lg"
      /> */}

      {/* Hiring Status (Only for Recruiters) */}
      {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${
              job?.isOpen
                ? "bg-[#047857] text-white"
                : "bg-[#D2042D] text-white"
            }`}
          >
            <SelectValue
              placeholder={
                "Hiring Status " +
                (job?.isOpen ? "( Available )" : "( Not Available )")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Available</SelectItem>
            <SelectItem value="closed">Not Available</SelectItem>
          </SelectContent>
        </Select>
      )}

      {job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      )}
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-2">
          <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
          {job?.applications.map((application) => {
            return (
              <ApplicationCard key={application.id} application={application} />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobPage;
