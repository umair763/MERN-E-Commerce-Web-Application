import { Link } from "react-router-dom";
import { LayoutDashboard, Users, Shield, Settings, FileText, LogOut, Crown, Package, Tag, ShoppingCart, Ticket, RotateCcw, Star } from "lucide-react";

export const SuperAdminSidebar = () => {
  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/super-admin/signin";
    } catch (error) {
      console.log(error);
    }
  };

  const menuItems = [
    { href: "/super-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/super-admin/products", label: "Products", icon: Package },
    { href: "/super-admin/categories", label: "Categories", icon: Tag },
    { href: "/super-admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/super-admin/coupons", label: "Coupons", icon: Ticket },
    { href: "/super-admin/returns", label: "Returns", icon: RotateCcw },
    { href: "/super-admin/users", label: "Users", icon: Users },
    { href: "/super-admin/reviews", label: "Reviews", icon: Star },
    { href: "/super-admin/permissions", label: "Permissions", icon: Shield },
    { href: "/super-admin/roles", label: "Roles", icon: Shield },
    { href: "/super-admin/settings", label: "Settings", icon: Settings },
    { href: "/super-admin/audit", label: "Audit Logs", icon: FileText },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-5 flex flex-col">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Crown size={24} className="text-purple-400" />
        StyleHive Super Admin
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
