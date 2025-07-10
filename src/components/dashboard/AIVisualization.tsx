import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AIVisualizationProps {
  isProcessing?: boolean;
  confidence?: number;
  className?: string;
}

const AIVisualization: React.FC<AIVisualizationProps> = ({
  isProcessing = false,
  confidence = 85,
  className = "",
}) => {
  const [nodes, setNodes] = useState<
    Array<{ id: number; x: number; y: number; active: boolean }>
  >([]);
  const [connections, setConnections] = useState<
    Array<{ from: number; to: number; strength: number }>
  >([]);

  useEffect(() => {
    // Generate neural network nodes
    const nodeCount = 24;
    const newNodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      x: Math.random() * 280 + 20,
      y: Math.random() * 180 + 20,
      active: false,
    }));

    // Generate connections between nodes
    const newConnections = [];
    for (let i = 0; i < nodeCount; i++) {
      const connectionCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < connectionCount; j++) {
        const targetId = Math.floor(Math.random() * nodeCount);
        if (targetId !== i) {
          newConnections.push({
            from: i,
            to: targetId,
            strength: Math.random(),
          });
        }
      }
    }

    setNodes(newNodes);
    setConnections(newConnections);
  }, []);

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setNodes((prevNodes) =>
          prevNodes.map((node) => ({
            ...node,
            active: Math.random() > 0.7,
          })),
        );
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 neural-bg opacity-30" />

      {/* Main Neural Network */}
      <svg
        viewBox="0 0 320 220"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))" }}
      >
        {/* Connections */}
        {connections.map((connection, index) => {
          const fromNode = nodes[connection.from];
          const toNode = nodes[connection.to];
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`connection-${index}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="url(#connectionGradient)"
              strokeWidth={connection.strength * 2}
              opacity={0.6}
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: isProcessing ? 1 : 0.5,
                opacity: isProcessing ? [0.3, 0.8, 0.3] : 0.4,
              }}
              transition={{
                duration: 2,
                repeat: isProcessing ? Infinity : 0,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, index) => (
          <motion.circle
            key={`node-${node.id}`}
            cx={node.x}
            cy={node.y}
            r={node.active ? 6 : 4}
            fill={node.active ? "#3B82F6" : "#1E40AF"}
            className="drop-shadow-lg"
            initial={{ scale: 0 }}
            animate={{
              scale: node.active ? [1, 1.3, 1] : 1,
              opacity: node.active ? [0.7, 1, 0.7] : 0.8,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            style={{
              filter: node.active
                ? "drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))"
                : "drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))",
            }}
          />
        ))}

        {/* Gradient Definitions */}
        <defs>
          <linearGradient
            id="connectionGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#1D4ED8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Central Brain Icon */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={
          isProcessing
            ? {
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: isProcessing ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-medical-blue to-medical-purple flex items-center justify-center glow-blue">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>

          {/* Pulsing Ring */}
          {isProcessing && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-medical-blue"
              animate={{
                scale: [1, 2, 1],
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </div>
      </motion.div>

      {/* Confidence Score */}
      <div className="absolute bottom-4 right-4">
        <div className="glass-card p-3 rounded-lg">
          <div className="text-xs text-medical-blue font-medium mb-1">
            AI Confidence
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-medical-dark rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-medical-blue to-medical-teal"
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className="text-sm font-bold text-medical-blue">
              {confidence}%
            </span>
          </div>
        </div>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2 glass-card p-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-medical-blue animate-neural-pulse" />
            <span className="text-xs text-medical-blue font-medium">
              Processing...
            </span>
          </div>
        </div>
      )}

      {/* Data Flow Indicators */}
      {isProcessing &&
        Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`flow-${i}`}
            className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-medical-blue to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeInOut",
            }}
          />
        ))}
    </div>
  );
};

export default AIVisualization;
