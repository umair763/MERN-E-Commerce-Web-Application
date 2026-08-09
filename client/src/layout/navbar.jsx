import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GLOBAL_LINKS = ["Headphones", "Earphones", "Speakers", "Accessories", "Support"];

/**
 * Navbar — Premium single-row navigation with black background
 * Features smooth transitions, hover states, and responsive design
 */
export const Navbar = ({
  brand = "NOVA",
  category = "Shop",
  cartCount = 0,
  onSearchClick = () => {},
  onCartClick = () => {},
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/signin");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const navigateToDashboard = () => {
    navigate("/dashboard");
    setUserMenuOpen(false);
  };

  const handleCategoryClick = (category) => {
    navigate("/");
  };

  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-50">
      {/* Global Navigation */}
      <div className="h-16 bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight hover:text-neutral-200 transition-colors duration-200"
          >
            {brand}
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {GLOBAL_LINKS.map((link) => (
              <button
                key={link}
                onClick={handleCategoryClick}
                className="text-sm font-medium text-neutral-300 hover:text-white transition-colors duration-200 relative group"
              >
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              onClick={onSearchClick}
              className="p-2 text-neutral-400 hover:text-white transition-colors duration-200 hover:bg-neutral-800 rounded-lg"
            >
              <Search size={18} strokeWidth={2} />
            </button>
            <button
              aria-label={`Bag, ${cartCount} items`}
              onClick={onCartClick}
              className="relative p-2 text-neutral-400 hover:text-white transition-colors duration-200 hover:bg-neutral-800 rounded-lg"
            >
              <ShoppingBag size={18} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>
            
            {/* User Auth Section */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-800 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <UserIcon size={16} className="text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-neutral-300">
                    {user?.name || "User"}
                  </span>
                  <ChevronDown size={14} className="text-neutral-400" />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl py-2 animate-in slide-in-from-top">
                    <button
                      onClick={navigateToDashboard}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      <UserIcon size={16} />
                      <span>Dashboard</span>
                    </button>
                    <div className="border-t border-neutral-800 my-1" />
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
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200"
              >
                <UserIcon size={16} />
                <span className="hidden sm:inline">Login</span>
              </button>
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

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-neutral-950 border-t border-neutral-800 px-4 sm:px-6 py-4 flex flex-col gap-2 animate-in slide-down-from-top">
            {GLOBAL_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => {
                  handleCategoryClick();
                  setMenuOpen(false);
                }}
                className="text-sm font-medium text-neutral-300 hover:text-white py-2 px-3 rounded-lg hover:bg-neutral-800 transition-colors duration-200 text-left"
              >
                {link}
              </button>
            ))}
            {/* Mobile Auth Section */}
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-neutral-800">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <UserIcon size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-neutral-300">
                    {user?.name || "User"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigateToDashboard();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-neutral-300 hover:text-white py-2 px-3 rounded-lg hover:bg-neutral-800 transition-colors duration-200"
                >
                  <UserIcon size={16} />
                  <span>Dashboard</span>
                </button>
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
                  handleLogin();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200"
              >
                <UserIcon size={16} />
                <span>Login</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
