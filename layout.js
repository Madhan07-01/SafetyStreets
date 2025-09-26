import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Shield, 
  Navigation, 
  AlertTriangle, 
  Users, 
  User,
  Home
} from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      path: createPageUrl("Dashboard"),
      icon: Home,
    },
    {
      name: "Navigation",
      path: createPageUrl("SafeNavigation"),
      icon: Navigation,
    },
    {
      name: "Emergency",
      path: createPageUrl("Emergency"),
      icon: AlertTriangle,
    },
    {
      name: "Safety Reports",
      path: createPageUrl("SafetyReports"),
      icon: Shield,
    },
    {
      name: "Profile",
      path: createPageUrl("Profile"),
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 relative">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Safe Streets</h1>
                <p className="text-sm text-emerald-600 font-medium">Guardian Ecosystem</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-emerald-50 text-emerald-700 shadow-sm"
                      : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-emerald-100 z-50">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? "text-emerald-600"
                  : "text-slate-500 hover:text-emerald-600"
              }`}
            >
              <item.icon className={`w-5 h-5 ${location.pathname === item.path ? "text-emerald-600" : ""}`} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}