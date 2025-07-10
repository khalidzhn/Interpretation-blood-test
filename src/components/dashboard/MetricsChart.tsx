import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import {
  HeartIcon,
  BeakerIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface MetricsChartProps {
  type?: "line" | "area" | "bar" | "pie";
  title?: string;
  data?: any[];
  className?: string;
}

const MetricsChart: React.FC<MetricsChartProps> = ({
  type = "line",
  title = "Medical Metrics",
  data,
  className = "",
}) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [realTimeData, setRealTimeData] = useState(data || []);

  // Sample medical data
  const defaultLineData = [
    { time: "00:00", heartRate: 72, bloodPressure: 120, temperature: 98.6 },
    { time: "04:00", heartRate: 68, bloodPressure: 115, temperature: 98.4 },
    { time: "08:00", heartRate: 75, bloodPressure: 125, temperature: 98.8 },
    { time: "12:00", heartRate: 82, bloodPressure: 130, temperature: 99.1 },
    { time: "16:00", heartRate: 78, bloodPressure: 122, temperature: 98.9 },
    { time: "20:00", heartRate: 70, bloodPressure: 118, temperature: 98.5 },
  ];

  const defaultBarData = [
    { category: "Blood Tests", completed: 89, pending: 11, critical: 3 },
    { category: "X-Rays", completed: 95, pending: 5, critical: 1 },
    { category: "MRI Scans", completed: 78, pending: 22, critical: 5 },
    { category: "Lab Results", completed: 92, pending: 8, critical: 2 },
  ];

  const defaultPieData = [
    { name: "Normal", value: 78, color: "#10B981" },
    { name: "Warning", value: 15, color: "#F59E0B" },
    { name: "Critical", value: 7, color: "#EF4444" },
  ];

  useEffect(() => {
    setAnimationComplete(true);

    // Simulate real-time data updates
    const interval = setInterval(() => {
      if (type === "line") {
        setRealTimeData((prev) =>
          prev.map((item) => ({
            ...item,
            heartRate: Math.max(
              60,
              Math.min(100, item.heartRate + (Math.random() - 0.5) * 4),
            ),
            bloodPressure: Math.max(
              100,
              Math.min(140, item.bloodPressure + (Math.random() - 0.5) * 6),
            ),
            temperature: Math.max(
              97,
              Math.min(100, item.temperature + (Math.random() - 0.5) * 0.3),
            ),
          })),
        );
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [type]);

  useEffect(() => {
    if (!data) {
      switch (type) {
        case "line":
        case "area":
          setRealTimeData(defaultLineData);
          break;
        case "bar":
          setRealTimeData(defaultBarData);
          break;
        case "pie":
          setRealTimeData(defaultPieData);
          break;
      }
    }
  }, [type, data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-lg border-medical-glass-border">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-xs text-medical-blue"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value}
              {entry.name === "temperature" && "°F"}
              {entry.name === "heartRate" && " BPM"}
              {entry.name === "bloodPressure" && " mmHg"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={realTimeData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1E40AF"
                opacity={0.2}
              />
              <XAxis
                dataKey="time"
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="heartRate"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  style: { filter: "drop-shadow(0 0 6px #3B82F6)" },
                }}
                name="Heart Rate"
              />
              <Line
                type="monotone"
                dataKey="bloodPressure"
                stroke="#14B8A6"
                strokeWidth={3}
                dot={{ fill: "#14B8A6", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  style: { filter: "drop-shadow(0 0 6px #14B8A6)" },
                }}
                name="Blood Pressure"
              />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#A855F7"
                strokeWidth={3}
                dot={{ fill: "#A855F7", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  style: { filter: "drop-shadow(0 0 6px #A855F7)" },
                }}
                name="Temperature"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={realTimeData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1E40AF"
                opacity={0.2}
              />
              <XAxis
                dataKey="time"
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="heartRate"
                stroke="#3B82F6"
                fill="url(#blueGradient)"
                strokeWidth={2}
                name="Heart Rate"
              />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={realTimeData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1E40AF"
                opacity={0.2}
              />
              <XAxis
                dataKey="category"
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="completed"
                fill="#10B981"
                name="Completed"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pending"
                fill="#F59E0B"
                name="Pending"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="critical"
                fill="#EF4444"
                name="Critical"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={realTimeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {realTimeData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getMetricIcon = () => {
    switch (type) {
      case "line":
      case "area":
        return <HeartIcon className="w-5 h-5" />;
      case "bar":
        return <BeakerIcon className="w-5 h-5" />;
      case "pie":
        return <ChartBarIcon className="w-5 h-5" />;
      default:
        return <ChartBarIcon className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      className={`glass-enhanced p-6 rounded-2xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-medical-blue/20 text-medical-blue">
            {getMetricIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-medical-green animate-neural-pulse" />
          <span className="text-xs text-medical-green font-medium">Live</span>
        </div>
      </div>

      {/* Chart Container */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: animationComplete ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {renderChart()}

        {/* Overlay Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Data Points Glow */}
          {type === "line" && (
            <div className="absolute top-1/2 left-1/4 w-1 h-1 rounded-full bg-medical-blue glow-blue animate-neural-pulse" />
          )}
          {type === "line" && (
            <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-medical-teal glow-teal animate-neural-pulse" />
          )}
        </div>
      </motion.div>

      {/* Real-time Data Summary */}
      {type === "line" && realTimeData.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          {["heartRate", "bloodPressure", "temperature"].map(
            (metric, index) => {
              const latestValue =
                realTimeData[realTimeData.length - 1]?.[metric];
              const colors = ["medical-blue", "medical-teal", "medical-purple"];
              const units = ["BPM", "mmHg", "°F"];
              const labels = ["Heart Rate", "Blood Pressure", "Temperature"];

              return (
                <div
                  key={metric}
                  className="text-center p-3 rounded-lg bg-medical-dark/50"
                >
                  <div
                    className={`text-xs text-${colors[index]} font-medium mb-1`}
                  >
                    {labels[index]}
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {typeof latestValue === "number"
                      ? latestValue.toFixed(1)
                      : "—"}
                    <span className="text-xs text-muted-foreground ml-1">
                      {units[index]}
                    </span>
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}

      {/* Chart Type Indicator */}
      <div className="absolute top-4 right-4">
        <div className="px-2 py-1 rounded-full bg-medical-blue/20 text-medical-blue text-xs font-medium">
          {type.toUpperCase()}
        </div>
      </div>
    </motion.div>
  );
};

export default MetricsChart;
