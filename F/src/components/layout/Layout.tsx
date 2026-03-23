import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Droplets, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Layout: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: "Routines", path: "/", icon: <Droplets className="w-5 h-5 mr-2" /> },
    { name: "Valves Settings", path: "/settings", icon: <Settings className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Droplets className="h-8 w-8 text-blue-500 mr-2" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">Sprinkler Control</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? "border-blue-500 text-gray-900 dark:text-white"
                        : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Button variant="ghost" onClick={logout} className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50">
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
