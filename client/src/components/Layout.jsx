import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  BarChart2,
  CreditCard,
  FileText,
  TrendingUp,
} from "lucide-react";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeRoute, setActiveRoute] = useState("");
  const location = useLocation();

  // Simulated user and notification data (replace with actual context)
  const user = {
    name: "Alex Thompson",
    role: "Finance Manager",
    avatar: "/api/placeholder/80/80",
  };

  const notifications = [
    { id: 1, message: "Quarterly report ready", time: "2m ago" },
    { id: 2, message: "New investment opportunity", time: "15m ago" },
  ];

  const sidebarItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutGrid,
      color: "text-blue-500",
    },
    {
      name: "Investments",
      path: "/investments",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: CreditCard,
      color: "text-purple-500",
    },
    {
      name: "Reports",
      path: "/reports",
      icon: FileText,
      color: "text-indigo-500",
    },
  ];

  // Update active route on location change
  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          fixed md:relative z-40 h-full bg-white shadow-xl transition-all duration-300
          ${isSidebarOpen ? "w-64" : "w-20"} 
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          {isSidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">FT</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Finance Pro</h2>
            </div>
          )}
          <button
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              setIsMobileMenuOpen(false);
            }}
            className="focus:outline-none text-gray-600 hover:text-gray-900"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center p-4 hover:bg-gray-100 
                  ${isActive ? "bg-blue-50 border-r-4 border-blue-500" : ""}
                `}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                }}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    size={20}
                    className={`
                      ${item.color} 
                      ${isActive ? "opacity-100" : "opacity-60"}
                    `}
                  />
                  {isSidebarOpen && (
                    <span
                      className={`
                        text-sm font-medium 
                        ${isActive ? "text-blue-600" : "text-gray-700"}
                      `}
                    >
                      {item.name}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        {user && (
          <div
            className={`
              absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 
              ${isSidebarOpen ? "block" : "flex justify-center"}
            `}
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {isSidebarOpen && (
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              )}
              <button
                onClick={() => {
                  /* logout logic */
                }}
                className="ml-auto focus:outline-none text-gray-500 hover:text-red-600"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="focus:outline-none"
            >
              <Menu size={24} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Finance Pro</h1>
          </div>
          <div className="relative">
            <Bell size={20} className="text-gray-600" />
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between p-6 bg-white shadow-md">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {sidebarItems.find((item) => activeRoute.startsWith(item.path))
                ?.name || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center space-x-6">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button className="focus:outline-none">
                <Bell size={24} className="text-gray-600 hover:text-blue-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              {notifications.length > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Notifications
                    </h3>
                  </div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                    >
                      <p className="text-sm text-gray-800">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


export default Layout