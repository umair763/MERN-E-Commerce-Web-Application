import { Outlet } from "react-router-dom";
import { AdminNavbar } from "./admin.navbar.jsx";
import { AdminSidebar } from "./admin.sidebar.jsx";
import { Footer } from "../../../../layout/footer.jsx";

export const AdminMainLayout = () => {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
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
