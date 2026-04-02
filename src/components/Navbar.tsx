import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/Button";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="text-2xl font-bold text-red-500">airbnb</div>
        </div>

        {/* Center - Search Bar */}
        <div className="hidden md:flex flex-1 mx-8">
          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Right - Auth */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/bookings")}
              >
                My Bookings
              </Button>
              <div className="relative group">
                <Button variant="secondary" size="sm">
                  {user?.username || "Account"}
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                  <div className="p-4 space-y-2">
                    <p className="text-sm text-gray-600">
                      {user?.email}
                    </p>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
