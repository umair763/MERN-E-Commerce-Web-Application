import { Link } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, Shield, Tag, Ticket, RotateCcw, LogOut, ShoppingBag, Star } from "lucide-react";

export const AdminSidebar = () => {
  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/admin/signin";
    } catch (error) {
      console.log(error);
    }
  };

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/coupons", label: "Coupons", icon: Ticket },
    { href: "/admin/returns", label: "Returns", icon: RotateCcw },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
    { href: "/admin/permissions", label: "Permissions", icon: Shield },
    { href: "/admin/roles", label: "Roles", icon: Shield },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-5 flex flex-col">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <ShoppingBag size={24} />
        StyleHive Admin
      </h2>

      <nav className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-gray-300 hover:text-white"
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-gray-300 hover:text-white w-full"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};
