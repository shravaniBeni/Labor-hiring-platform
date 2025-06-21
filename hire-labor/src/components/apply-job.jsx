/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useFetch from "@/hooks/use-fetch";
import { applyToJob } from "@/api/apiApplication";
import { BarLoader } from "react-spinners";

const schema = z.object({
  days_required: z.number().min(0, { message: "required" }).int(),
  expected_pay: z.number().min(0, { message: "required" }).int(),
  name: z.string().min(1, { message: " required" }),
  workType: z.enum(["Farming", "Harvesting", "Plantation"], {
    message: " is required",
  }),
});

export function ApplyJobDrawer({ user, job, fetchJob, applied = false }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  const onSubmit = (data) => {
    fnApply({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "requested",
    }).then(() => {
      fetchJob();
      reset();
    });
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job?.isOpen && !applied ? "blue" : "destructive"}
          disabled={!job?.isOpen || applied}
        >
          {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Hire {job?.title}</DrawerTitle>
          <DrawerDescription>Please Fill the form below</DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0"
        >
          <Input
            type="number"
            placeholder="Days required..."
            className="flex-1"
            {...register("days_required", {
              valueAsNumber: true,
            })}
          />
          {errors.days_required && (
            <p className="text-red-500">{errors.days_required.message}</p>
          )}

          <Input
            type="number"
            placeholder="Expected Pay"
            className="flex-1"
            {...register("expected_pay", {
              valueAsNumber: true,
            })}
          />
          {errors.expected_pay && (
            <p className="text-red-500">{errors.expected_pay.message}</p>
          )}

          <Input
            type="text"
            placeholder="Address"
            className="flex-1"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <Controller
            name="workType"
            control={control}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} {...field}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Farming" id="farming" />
                  <Label htmlFor="farming">Farming</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Harvesting" id="harvesting" />
                  <Label htmlFor="harvesting">Harvesting</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Plantation" id="plantation" />
                  <Label htmlFor="plantation">Plantation</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.workType && (
            <p className="text-red-500">{errors.workType.message}</p>
          )}

          {errorApply?.message && (
            <p className="text-red-500">{errorApply?.message}</p>
          )}
          {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}

          <Button type="submit" variant="blue" size="lg">
            Hire
          </Button>
        </form>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
