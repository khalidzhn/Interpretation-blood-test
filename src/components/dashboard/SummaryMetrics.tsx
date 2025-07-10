import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  SparklesIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface Metric {
  label: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
}

interface SummaryMetricsProps {
  className?: string;
}

const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ className = "" }) => {
  const [realtimeData, setRealtimeData] = useState({
    reportsToday: 132,
    avgAccuracy: 94.2,
    avgProcessTime: 0.9,
    criticalFlags: 7,
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealtimeData((prev) => ({
        ...prev,
        reportsToday: prev.reportsToday + Math.floor(Math.random() * 2),
        avgAccuracy: Math.max(
          90,
          Math.min(99, prev.avgAccuracy + (Math.random() - 0.5) * 0.5),
        ),
        avgProcessTime: Math.max(
          0.5,
          Math.min(2.0, prev.avgProcessTime + (Math.random() - 0.5) * 0.1),
        ),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const metrics: Metric[] = [
    {
      label: "Reports Today",
      value: realtimeData.reportsToday,
      icon: DocumentTextIcon,
      color: "medical-blue",
    },
    {
      label: "Avg AI Accuracy",
      value: `${realtimeData.avgAccuracy.toFixed(1)} %`,
      icon: SparklesIcon,
      color: "medical-green",
    },
    {
      label: "Avg Process Time",
      value: `${realtimeData.avgProcessTime.toFixed(1)} s`,
      icon: ClockIcon,
      color: "medical-teal",
    },
    {
      label: "Critical Flags",
      value: realtimeData.criticalFlags,
      icon: ExclamationTriangleIcon,
      color: "medical-red",
    },
  ];

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          className="glass-enhanced p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-lg bg-${metric.color}/20`}>
              <metric.icon className={`w-5 h-5 text-${metric.color}`} />
            </div>
            {metric.label === "Critical Flags" && (
              <div className="w-2 h-2 rounded-full bg-medical-red animate-pulse" />
            )}
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">
              {metric.value}
            </div>
            <div className="text-sm text-muted-foreground">{metric.label}</div>
          </div>

          {/* Real-time indicator */}
          <div className="mt-3 flex items-center gap-2">
            <div
              className={`w-1 h-1 rounded-full bg-${metric.color} animate-pulse`}
            />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SummaryMetrics;
