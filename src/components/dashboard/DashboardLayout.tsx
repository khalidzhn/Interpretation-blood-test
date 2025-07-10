import React, { useState, useEffect } from "react";
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
  MagnifyingGlassIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CloudIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import LanguageToggle from "./LanguageToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
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
  children,
  className = "",
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: HomeIcon,
      active: activeTab === "dashboard",
    },
    {
      id: "upload",
      label: "Upload Report",
      icon: DocumentTextIcon,
      active: activeTab === "upload",
    },
    {
      id: "interpretation",
      label: "AI Interpretation",
      icon: SparklesIcon,
      active: activeTab === "interpretation",
    },
    {
      id: "alerts",
      label: "Critical Alerts",
      icon: BellIcon,
      active: activeTab === "alerts",
      badge: 7,
    },
    {
      id: "generator",
      label: "Report Generator",
      icon: ChartBarIcon,
      active: activeTab === "generator",
    },
    {
      id: "lab-report",
      label: "Lab Report Page",
      icon: DocumentIcon,
      active: activeTab === "lab-report",
      href: "/lab-report-demo",
    },
    {
      id: "settings",
      label: "Settings",
      icon: CogIcon,
      active: activeTab === "settings",
    },
  ];

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`min-h-screen bg-medical-dark ${className}`}>
      {/* Sidebar */}
      <motion.aside
        className={`fixed left-0 top-0 h-full glass-enhanced border-r border-medical-glass-border z-40 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo & Brand */}
        <div className="p-4 border-b border-medical-glass-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-medical-blue to-medical-purple flex items-center justify-center glow-blue">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-lg font-bold text-medical-blue">
                  Baseerah
                </h2>
                <p className="text-xs text-muted-foreground">Technologies</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item, index) =>
            item.href ? (
              <motion.a
                key={item.id}
                href={item.href}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  item.active
                    ? "bg-medical-blue/20 text-medical-blue border border-medical-blue/30"
                    : "hover:bg-medical-glass/50 text-muted-foreground hover:text-foreground"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {isSidebarOpen && item.badge && (
                  <span className="ml-auto px-2 py-1 text-xs bg-medical-red rounded-full text-white">
                    {item.badge}
                  </span>
                )}
              </motion.a>
            ) : (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  item.active
                    ? "bg-medical-blue/20 text-medical-blue border border-medical-blue/30"
                    : "hover:bg-medical-glass/50 text-muted-foreground hover:text-foreground"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {isSidebarOpen && item.badge && (
                  <span className="ml-auto px-2 py-1 text-xs bg-medical-red rounded-full text-white">
                    {item.badge}
                  </span>
                )}
              </motion.button>
            ),
          )}
        </nav>

        {/* System Status */}
        {isSidebarOpen && (
          <motion.div
            className="absolute bottom-4 left-4 right-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="glass-card p-3 rounded-xl">
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
                  <span className="text-medical-blue">Cloud Sync</span>
                  <div className="flex items-center gap-1">
                    <CloudIcon className="w-3 h-3 text-medical-blue" />
                    <span className="text-medical-blue">Connected</span>
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
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {/* Top Header */}
        <motion.header
          className="glass-card border-b border-medical-glass-border p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-medical-glass/50 transition-colors"
              >
                <Bars3Icon className="w-5 h-5 text-medical-blue" />
              </button>

              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Lab Interpretation Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Center Section - Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-medical-blue" />
                <input
                  type="text"
                  placeholder="Search patients, reports, AI insights..."
                  className="w-full pl-10 pr-4 py-2 bg-medical-dark/50 border border-medical-glass-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-medical-blue/50 focus:border-medical-blue transition-all"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="flex items-center gap-1">
                    <BoltIcon className="w-3 h-3 text-medical-amber" />
                    <span className="text-xs text-medical-amber">AI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Real-time Clock */}
              <div className="text-right">
                <div className="text-sm font-mono text-medical-blue">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  UTC {new Date().getTimezoneOffset() / -60}
                </div>
              </div>

              {/* Language Toggle */}
              <LanguageToggle />

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-medical-glass/50 transition-colors">
                <BellIcon className="w-5 h-5 text-medical-blue" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-medical-red rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">5</span>
                </div>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-3 border-l border-medical-glass-border">
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    Dr. Sarah Chen
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Lead Diagnostician
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-medical-teal to-medical-purple flex items-center justify-center">
                  <span className="text-sm font-bold text-white">SC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-medical-green animate-neural-pulse" />
                <span className="text-xs text-medical-green">
                  AI Processing: 99.2% uptime
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-medical-blue animate-neural-pulse" />
                <span className="text-xs text-medical-blue">
                  Response Time: 0.3s avg
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-medical-purple animate-neural-pulse" />
                <span className="text-xs text-medical-purple">
                  Confidence: 94.7% avg
                </span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Neural Network v2.1.3 | Last updated: 2 minutes ago
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
            {children}
          </motion.div>
        </main>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Neural Network Pattern */}
        <div className="absolute inset-0 neural-bg opacity-10" />

        {/* Floating Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-medical-blue"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-medical-blue/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-medical-purple/10 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default DashboardLayout;
