// import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
// import AddCompanyDrawer from "@/components/add-company-drawer";
import { uploadImage } from "@/api/apiJobs"; // Adjust the path if needed

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
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
// import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  workType: z.string().min(1, { message: "Select Work Type" }),
  availability: z.string().min(1, { message: "Select Availability" }),
  // requirements: z.string().min(1, { message: "Requirements are required" }),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, { message: "Enter a valid phone number" }),
  salary: z.string().min(1, { message: "Expected Salary is required" }),
  photo: z.any().refine((file) => file instanceof FileList && file.length > 0, {
    message: "Photo is required",
  }),
});

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", workType: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateJob) navigate("/jobs");
  }, [dataCreateJob, navigate]);

  // const {
  //   loading: loadingCompanies,
  //   data: companies,
  //   fn: fnCompanies,
  // } = useFetch(getCompanies);

  // useEffect(() => {
  //   if (isLoaded && user) {
  //     fnCompanies();
  //   }
  // }, [isLoaded, user]);

  // if (!isLoaded || loadingCompanies) {
  //   return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  // }

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Register as Labor
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >
        <Input placeholder="Your Name/Group Name" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Input placeholder="Phone Number" {...register("phoneNumber")} />
        {errors.phoneNumber && (
          <p className="text-red-500">{errors.phoneNumber.message}</p>
        )}

        <Textarea placeholder="Address" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="workType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Type of Work" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="farming">Farming</SelectItem>
                    <SelectItem value="harvesting">Harvesting</SelectItem>
                    <SelectItem value="plantation">Plantation</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.workType && (
          <p className="text-red-500">{errors.workType.message}</p>
        )}
        {/* <div className="font-bold text-xl ">Skills and Experience</div>
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )} */}

        <Controller
          name="availability"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="full-time">Full-Time</SelectItem>
                  <SelectItem value="part-time">Part-Time</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.availability && (
          <p className="text-red-500">{errors.availability.message}</p>
        )}

        <Input placeholder="Expected Salary" {...register("salary")} />
        {errors.salary && (
          <p className="text-red-500">{errors.salary.message}</p>
        )}

        <Input type="file" {...register("photo")} />
        {errors.photo && <p className="text-red-500">{errors.photo.message}</p>}

        {errorCreateJob && (
          <p className="text-red-500">{errorCreateJob.message}</p>
        )}

        {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}
        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
