import Header from "@/components/header";
import { Outlet } from "react-router-dom";
import Translate from "@/components/translate";
const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
        <Translate />
      </main>
    </div>
  );
};

export default AppLayout;
