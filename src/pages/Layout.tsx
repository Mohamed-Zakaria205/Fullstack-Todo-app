import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const RootLayout = () => {
  return (
    <div className="root-layout min-h-screen bg-gray-50 flex flex-col font-sans text-slate-800">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 flex-grow mb-10">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
