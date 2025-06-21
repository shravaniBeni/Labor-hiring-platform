import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";
// import Translate from "@/components/translate";
const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-4">
      <section className="text-center max-w-5xl mx-auto px-4">
        <h1 className="flex flex-col items-center justify-center gradient-title font-extrabold text-4xl sm:text-5xl lg:text-7xl tracking-tighter py-4 text-[#047857]">
          Hire experienced agricultural workers for your farm
          <span className="flex items-center gap-2 sm:gap-6">
            or find the right job opportunity in the farming sector
          </span>
        </h1>
        <p className="text-[#047857] sm:mt-4 text-xs sm:text-xl">
          Explore thousands of labors or find the perfect candidate
        </p>
      </section>
      <div className="flex gap-6 justify-center -mt-4">
        <Link to={"/jobs"}>
          <Button
            className="bg-[#047857] text-white hover:bg-[#035f49] transition duration-300"
            size="xl"
          >
            Find Labors
          </Button>
        </Link>
        <Link to={"/post-job"}>
          <Button
            variant="outline"
            className="border-2 border-[#047857] text-[#047857] bg-white hover:bg-[#047857] hover:text-white transition duration-300"
            size="xl"
          >
            Register as Labor
          </Button>
        </Link>
      </div>
    </main>
  );
};
{
  /* <Translate />; */
}
export default LandingPage;
