import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  BellIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: Date;
  priority: number;
  category: string;
  patientId?: string;
  actionRequired?: boolean;
  isRead?: boolean;
}

interface AlertSystemProps {
  className?: string;
  maxVisible?: number;
}

const AlertSystem: React.FC<AlertSystemProps> = ({
  className = "",
  maxVisible = 5,
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Sample medical alerts
  const sampleAlerts: Omit<Alert, "id" | "timestamp">[] = [
    {
      type: "critical",
      title: "Critical Lab Result",
      message: "Patient ID 12345: Elevated troponin levels detected",
      priority: 1,
      category: "Lab Results",
      patientId: "12345",
      actionRequired: true,
      isRead: false,
    },
    {
      type: "warning",
      title: "AI Analysis Alert",
      message: "Potential drug interaction detected in prescription review",
      priority: 2,
      category: "AI Analysis",
      actionRequired: true,
      isRead: false,
    },
    {
      type: "info",
      title: "System Update",
      message: "New AI model version 2.1.3 deployed successfully",
      priority: 3,
      category: "System",
      actionRequired: false,
      isRead: false,
    },
    {
      type: "success",
      title: "Analysis Complete",
      message: "Batch processing of 150 lab reports completed",
      priority: 4,
      category: "Processing",
      actionRequired: false,
      isRead: true,
    },
    {
      type: "warning",
      title: "Abnormal Pattern",
      message: "Patient ID 67890: Irregular heart rhythm pattern detected",
      priority: 2,
      category: "Monitoring",
      patientId: "67890",
      actionRequired: true,
      isRead: false,
    },
  ];

  useEffect(() => {
    // Initialize with sample alerts
    const initialAlerts = sampleAlerts.map((alert, index) => ({
      ...alert,
      id: `alert-${Date.now()}-${index}`,
      timestamp: new Date(Date.now() - index * 300000), // Spaced 5 minutes apart
    }));

    setAlerts(initialAlerts);

    // Simulate new alerts coming in
    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: `alert-${Date.now()}`,
        type: ["critical", "warning", "info", "success"][
          Math.floor(Math.random() * 4)
        ] as Alert["type"],
        title: "New Alert",
        message: "Real-time monitoring has detected a new condition",
        timestamp: new Date(),
        priority: Math.floor(Math.random() * 4) + 1,
        category: "Real-time",
        actionRequired: Math.random() > 0.5,
        isRead: false,
      };

      setAlerts((prev) => [newAlert, ...prev].slice(0, 20)); // Keep max 20 alerts
    }, 15000); // New alert every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return <FireIcon className="w-5 h-5" />;
      case "warning":
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      case "info":
        return <InformationCircleIcon className="w-5 h-5" />;
      case "success":
        return <CheckCircleIcon className="w-5 h-5" />;
    }
  };

  const getAlertColors = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return {
          bg: "bg-medical-red/20",
          border: "border-medical-red/30",
          text: "text-medical-red",
          glow: "glow-red",
        };
      case "warning":
        return {
          bg: "bg-medical-amber/20",
          border: "border-medical-amber/30",
          text: "text-medical-amber",
          glow: "glow-amber",
        };
      case "info":
        return {
          bg: "bg-medical-blue/20",
          border: "border-medical-blue/30",
          text: "text-medical-blue",
          glow: "glow-blue",
        };
      case "success":
        return {
          bg: "bg-medical-green/20",
          border: "border-medical-green/30",
          text: "text-medical-green",
          glow: "glow-green",
        };
    }
  };

  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, isRead: true } : alert,
      ),
    );
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - timestamp.getTime()) / 1000,
    );

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const unreadCount = alerts.filter((alert) => !alert.isRead).length;
  const criticalCount = alerts.filter(
    (alert) => alert.type === "critical" && !alert.isRead,
  ).length;

  const sortedAlerts = alerts.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const visibleAlerts = isExpanded
    ? sortedAlerts
    : sortedAlerts.slice(0, maxVisible);

  return (
    <div className={`relative ${className}`}>
      {/* Alert System Header */}
      <motion.div
        className="glass-enhanced rounded-2xl p-4 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <BellIcon className="w-6 h-6 text-medical-blue" />
              {unreadCount > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-medical-red flex items-center justify-center text-xs font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Alert System
              </h3>
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread notifications
              </p>
            </div>
          </div>

          {/* Critical Alert Indicator */}
          {criticalCount > 0 && (
            <motion.div
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-medical-red/20 border border-medical-red/30"
              animate={{
                boxShadow: [
                  "0 0 0 rgba(239, 68, 68, 0)",
                  "0 0 20px rgba(239, 68, 68, 0.5)",
                  "0 0 0 rgba(239, 68, 68, 0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FireIcon className="w-4 h-4 text-medical-red" />
              <span className="text-xs font-medium text-medical-red">
                {criticalCount} Critical
              </span>
            </motion.div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          {[
            { label: "Critical", count: criticalCount, color: "medical-red" },
            {
              label: "Warning",
              count: alerts.filter((a) => a.type === "warning" && !a.isRead)
                .length,
              color: "medical-amber",
            },
            {
              label: "Info",
              count: alerts.filter((a) => a.type === "info" && !a.isRead)
                .length,
              color: "medical-blue",
            },
            {
              label: "Success",
              count: alerts.filter((a) => a.type === "success" && !a.isRead)
                .length,
              color: "medical-green",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-2 rounded-lg bg-medical-dark/30"
            >
              <div className={`text-lg font-bold text-${stat.color}`}>
                {stat.count}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Alerts List */}
      <div className="space-y-3">
        <AnimatePresence>
          {visibleAlerts.map((alert, index) => {
            const colors = getAlertColors(alert.type);
            return (
              <motion.div
                key={alert.id}
                className={`glass-card p-4 rounded-xl border ${colors.border} ${
                  alert.isRead ? "opacity-60" : ""
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-3">
                  {/* Alert Icon */}
                  <div
                    className={`p-2 rounded-lg ${colors.bg} ${colors.text} ${colors.glow}`}
                  >
                    {getAlertIcon(alert.type)}
                  </div>

                  {/* Alert Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-semibold text-foreground">
                        {alert.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {getTimeAgo(alert.timestamp)}
                        </span>
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="p-1 rounded-full hover:bg-medical-red/20 transition-colors"
                        >
                          <XMarkIcon className="w-3 h-3 text-muted-foreground hover:text-medical-red" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.message}
                    </p>

                    {/* Alert Metadata */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}
                        >
                          {alert.category}
                        </span>
                        {alert.patientId && (
                          <span className="text-xs px-2 py-1 rounded-full bg-medical-blue/20 text-medical-blue">
                            {alert.patientId}
                          </span>
                        )}
                        {alert.actionRequired && (
                          <span className="text-xs px-2 py-1 rounded-full bg-medical-amber/20 text-medical-amber">
                            Action Required
                          </span>
                        )}
                      </div>

                      {/* Read/Unread Toggle */}
                      {!alert.isRead && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="text-xs text-medical-blue hover:text-medical-teal transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Priority Indicator */}
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b from-transparent via-current to-transparent opacity-30" />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Expand/Collapse Button */}
        {alerts.length > maxVisible && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full glass-card p-3 rounded-xl text-center text-sm text-medical-blue hover:text-medical-teal transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isExpanded
              ? "Show less"
              : `Show ${alerts.length - maxVisible} more alerts`}
          </motion.button>
        )}
      </div>

      {/* Emergency Overlay for Critical Alerts */}
      <AnimatePresence>
        {criticalCount > 0 && (
          <motion.div
            className="fixed inset-0 bg-medical-red/5 pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlertSystem;
