import { useState } from "react";
import { Search, ShoppingBag, Menu, X, User as UserIcon, LogOut, Shield, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

const ADMIN_LINKS = [
  { name: "Products", path: "/admin/products" },
  { name: "Orders", path: "/admin/orders" },
  { name: "Users", path: "/admin/users" },
  { name: "Reviews", path: "/admin/reviews" },
  { name: "Reports", path: "/admin/dashboard" },
];

export const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/signin");
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="h-16 bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={24} className="text-blue-400" />
            <span className="text-lg font-semibold tracking-tight">StyleHive Admin</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {ADMIN_LINKS.map((link) => (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className="text-sm font-medium text-neutral-300 hover:text-white transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              className="p-2 text-neutral-400 hover:text-white transition-colors duration-200 hover:bg-neutral-800 rounded-lg"
            >
              <Search size={18} strokeWidth={2} />
            </button>
            
            {/* User Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-800 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <UserIcon size={16} className="text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-neutral-300">
                    {user?.name || "Admin"}
                  </span>
                  <ChevronDown size={14} className="text-neutral-400" />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl py-2 animate-in slide-in-from-top">
                    <div className="px-4 py-2 border-b border-neutral-800">
                      <p className="text-sm font-medium text-white">{user?.name || "Admin"}</p>
                      <p className="text-xs text-neutral-400">{user?.email || ""}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-neutral-800 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <UserIcon size={16} className="text-white" />
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1 text-sm text-neutral-300 hover:text-white transition-colors duration-200"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
            
            <button
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors duration-200 hover:bg-neutral-800 rounded-lg"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-neutral-950 border-t border-neutral-800 px-4 sm:px-6 py-4 flex flex-col gap-2 animate-in slide-down-from-top">
            {ADMIN_LINKS.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  navigate(link.path);
                  setMenuOpen(false);
                }}
                className="text-sm font-medium text-neutral-300 hover:text-white py-2 px-3 rounded-lg hover:bg-neutral-800 transition-colors duration-200 text-left"
              >
                {link.name}
              </button>
            ))}
            {/* Mobile Auth Section */}
            {user ? (
              <>
                <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-neutral-800">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <UserIcon size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-300">{user?.name || "Admin"}</p>
                    <p className="text-xs text-neutral-400">{user?.email || ""}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 py-2 px-3 rounded-lg hover:bg-neutral-800 transition-colors duration-200"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 text-sm font-medium text-neutral-300 hover:text-white py-2 px-3 rounded-lg hover:bg-neutral-800 transition-colors duration-200"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
