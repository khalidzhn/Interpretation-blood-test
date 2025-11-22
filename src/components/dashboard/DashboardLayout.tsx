import React, { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Bars3Icon,
  HomeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  DocumentIcon,
  UsersIcon,
  CogIcon,
  BellIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CloudIcon,
} from "@heroicons/react/24/outline";
import LanguageToggle from "./LanguageToggle";
import Header from "@/components/Header";
import * as jwtDecodeLib from "jwt-decode";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { ThemeToggleButton } from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  className?: string;
  children?: React.ReactNode;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  active?: boolean;
  badge?: number;
  href?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  className = "",
  children,
}) => {

  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    navigate("/login");
  }, [navigate]);

  let userTitle = "";
  let userFullName = "";
  try {
    const token = localStorage.getItem("access_token");
    if (token) {
      const jwtDecode: any = (jwtDecodeLib as any).default ?? (jwtDecodeLib as any).jwtDecode ?? jwtDecodeLib;
      const decoded: any = jwtDecode(token);
      userTitle = decoded.title || "";
      userFullName = decoded.full_name || decoded.name || "";
    }
  } catch (e) {
    // Invalid token or not logged in
  }

  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigationItems: NavigationItem[] = useMemo(() => ([
    { id: "dashboard", label: "Dashboard", icon: HomeIcon, href: "/" },
    { id: "users", label: "Users", icon: UsersIcon, href: "/users" },
    { id: "hospitals", label: "Hospitals", icon: ChartBarIcon, href: "/hospitals" },
    { id: "summary-metrics", label: "Summary Metrics", icon: ChartBarIcon, href: "/summary-metrics" },
  ]), []);


  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <motion.aside
        className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"
          }`}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo & Brand */}
        <div className="p-4 border-b border-medical-glass-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">              <SparklesIcon className="w-6 h-6 text-foreground" />
            </div>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-lg font-bold text-primary">
                  Baseerah
                </h2>
                <p className="text-xs text-muted-foreground">Technologies</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.href || "/"}
                className={({ isActive }) => `w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${isActive ? "bg-primary/20 text-primary border border-primary/30" : "hover:bg-accent text-muted-foreground hover:text-foreground"}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {isSidebarOpen && item.badge && (
                  <span className="ml-auto px-2 py-1 text-xs bg-medical-red rounded-full text-foreground">{item.badge}</span>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* System Status */}
        {isSidebarOpen && (
          <motion.div
            className="absolute bottom-4 left-4 right-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-card border border-card-foreground p-3 rounded-xl">
              <div className="text-xs text-muted-foreground mb-2">
                System Status
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-medical-green">AI Models</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-medical-green animate-neural-pulse" />
                    <span className="text-medical-green">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-primary">Cloud Sync</span>
                  <div className="flex items-center gap-1">
                    <CloudIcon className="w-3 h-3 text-primary" />
                    <span className="text-primary">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-medical-purple">Security</span>
                  <div className="flex items-center gap-1">
                    <ShieldCheckIcon className="w-3 h-3 text-medical-purple" />
                    <span className="text-medical-purple">HIPAA</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"
          }`}
      >
        {/* Top Header */}
        <motion.header
          className="glass-card border-b border-medical-glass-border p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between gap-2">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-popover/50 transition-colors"
                aria-label="Toggle sidebar"
              >
                <Bars3Icon className="w-5 h-5 text-primary" />
              </button>
              <h1 className="font-bold text-foreground text-base sm:text-lg md:text-xl truncate max-w-[60vw] sm:max-w-none">Lab Interpretation Dashboard</h1>
            </div>


            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <ThemeToggleButton />
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 rounded-lg bg-destructive text-white text-sm font-semibold hover:bg-destructive/80 transition"
                title="Logout"
              >
                Logout
              </button>
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-foreground">
                  {userTitle}. {userFullName}
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-medical-teal to-medical-purple flex items-center justify-center">
                <span className="text-sm font-bold text-foreground">{userTitle}</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Suspense fallback={<div className="space-y-4"><div className="h-6 w-40 bg-muted animate-pulse rounded" /><div className="h-40 bg-muted animate-pulse rounded" /><div className="h-40 bg-muted animate-pulse rounded" /></div>}>
              {children ?? <Outlet />}
            </Suspense>
          </motion.div>
        </main>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 hidden md:block">
        {/* Neural Network Pattern */}
        <div className="absolute inset-0 neural-bg opacity-10" />

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-medical-blue/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-medical-purple/10 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default DashboardLayout;
