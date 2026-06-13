import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  BookOpen,
  Home,
  Info,
  Library,
  Mail,
  ShoppingBag,
  Search,
  ShoppingCart,
  UserCircle,
  LayoutDashboard,
  LogOut,
  Heart,
  X,
  Menu,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useCollection } from "../context/CollectionContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useCart();
  const { collectionItems = [] } = useCollection() || {};

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const baseLinks = [
    { name: "Home", path: "/", icon: <Home className="w-4 h-4" /> },
    { name: "About", path: "/about", icon: <Info className="w-4 h-4" /> },
    { name: "Books", path: "/explore", icon: <Library className="w-4 h-4" /> },
    { name: "Contact", path: "/contact", icon: <Mail className="w-4 h-4" /> },
  ];

  if (user) {
    baseLinks.push({
      name: "My Orders",
      path: "/orders",
      icon: <ShoppingBag className="w-4 h-4" />,
    });
  }

  if (user && user.role === "admin") {
    baseLinks.push({
      name: "Manage",
      path: "/admin/manage",
      icon: <LayoutDashboard className="w-4 h-4" />,
    });
  }

  const navLinks = baseLinks;

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out! See you again.");
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-5 lg:px-10 py-4 sticky top-0 z-50">
      <div className="grid grid-cols-2 md:grid-cols-3 items-center w-full">
        
        <div className="flex justify-start">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-600 transition-colors duration-300">
              <BookOpen className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <span className="text-xl font-bold text-[#2d5a5a] tracking-tighter uppercase whitespace-nowrap">
              Chapter<span className="text-green-600">Green</span>
            </span>
          </Link>
        </div>

        <div className="hidden md:flex justify-center items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative flex items-center gap-2 pb-1 text-sm font-medium transition-colors whitespace-nowrap ${
                location.pathname === link.path
                  ? "text-green-600"
                  : "text-gray-500 hover:text-green-600"
              }`}
            >
              <span
                className={
                  location.pathname === link.path
                    ? "text-green-600"
                    : "text-gray-400"
                }
              >
                {link.icon}
              </span>
              {link.name}

              {location.pathname === link.path && (
                <span className="absolute bottom-[-4px] left-0 w-full h-0.5 bg-green-500 rounded-full"></span>
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-end space-x-4 sm:space-x-6 text-gray-500">
          
          <div className="relative hidden md:flex items-center h-9">
            <div
              className={`absolute right-full mr-4 transition-all duration-350 ease-in-out transform ${
                isSearchOpen
                  ? "w-40 sm:w-56 opacity-100 scale-100 pointer-events-auto"
                  : "w-0 opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-full shadow-sm"
              >
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus={isSearchOpen}
                  className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="text-gray-400 hover:text-green-600 transition-colors mr-1.5 flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`hover:text-green-600 transition-colors z-20 ${
                isSearchOpen ? "text-green-600 rotate-90" : "text-gray-500"
              } duration-300`}
            >
              {isSearchOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>

          {user && (
            <>
              <Link
                to="/collection"
                className={`relative transition-colors flex items-center ${
                  location.pathname === "/collection"
                    ? "text-green-500"
                    : "hover:text-green-500"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    location.pathname === "/collection"
                      ? "fill-green-500 text-green-500"
                      : ""
                  }`}
                />
                {collectionItems?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {collectionItems.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative hover:text-green-600 transition-colors flex items-center"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-900 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-sm font-medium text-gray-600 hidden lg:inline">
                Hi, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="hover:text-green-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hover:text-green-600 transition-colors flex-shrink-0"
            >
              <UserCircle className="w-6 h-6" />
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 justify-self-end flex items-center"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen
            ? "max-h-[600px] opacity-100 mt-4"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "text-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}

          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-1"
          >
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-gray-700 outline-none flex-1 placeholder-gray-400"
            />
            <button type="submit" className="text-gray-400 hover:text-green-600 transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {user && (
            <>
              <Link
                to="/collection"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-green-600"
              >
                <Heart className="w-4 h-4" />
                My Collection ({collectionItems.length})
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-green-600"
              >
                <ShoppingCart className="w-4 h-4" />
                Cart ({cartCount})
              </Link>
            </>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-sm font-medium text-red-500 hover:text-red-600 pt-2 border-t border-gray-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-green-600"
            >
              <UserCircle className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;