import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar.jsx";
import { Sidebar } from "./sidebar.jsx";
import { Footer } from "./footer.jsx";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1 flex-col ml-0 min-w-40">
          <main className="flex-1 p-5 lg:p-6 w-full min-w-0">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};
