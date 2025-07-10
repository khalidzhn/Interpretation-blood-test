import React from "react";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface LabResult {
  test: string;
  value: string;
  normalRange: string;
  status: "normal" | "warning" | "critical";
  aiExplanation: string;
}

interface LabResultsTableProps {
  results?: LabResult[];
  aiConfidence?: number;
  className?: string;
}

const LabResultsTable: React.FC<LabResultsTableProps> = ({
  results,
  aiConfidence = 94,
  className = "",
}) => {
  const defaultResults: LabResult[] = [
    {
      test: "HbA1c",
      value: "6.2 %",
      normalRange: "4.0–5.6 %",
      status: "warning",
      aiExplanation: "Early pre-diabetes risk.",
    },
    {
      test: "LDL",
      value: "160 mg/dL",
      normalRange: "< 100 mg/dL",
      status: "critical",
      aiExplanation: "High cardiac risk.",
    },
  ];

  const labResults = results || defaultResults;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return "🟢";
      case "warning":
        return "🟡";
      case "critical":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-medical-green";
      case "warning":
        return "text-medical-amber";
      case "critical":
        return "text-medical-red";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <motion.div
      className={`glass-enhanced rounded-xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Table Header */}
      <div className="p-6 border-b border-medical-glass-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              AI Lab Interpretation
            </h3>
            <p className="text-sm text-muted-foreground">
              Automated analysis with clinical insights
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-medical-blue/20 rounded-full">
            <SparklesIcon className="w-4 h-4 text-medical-blue" />
            <span className="text-sm font-medium text-medical-blue">
              AI Confidence {aiConfidence}%
            </span>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-medical-glass-border">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Test
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Value
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Normal Range
              </th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                AI Explanation
              </th>
            </tr>
          </thead>
          <tbody>
            {labResults.map((result, index) => (
              <motion.tr
                key={`${result.test}-${index}`}
                className="border-b border-medical-glass-border/50 hover:bg-medical-glass/30 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <td className="p-4">
                  <span className="font-medium text-foreground">
                    {result.test}
                  </span>
                </td>
                <td className="p-4">
                  <span className="font-mono text-foreground">
                    {result.value}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-muted-foreground font-mono">
                    {result.normalRange}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">
                      {getStatusIcon(result.status)}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`text-sm ${getStatusColor(result.status)} font-medium`}
                  >
                    {result.aiExplanation}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 bg-medical-dark/30 text-center">
        <p className="text-xs text-muted-foreground">
          AI analysis completed in 0.9 seconds • Last updated:{" "}
          {new Date().toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
};

export default LabResultsTable;
