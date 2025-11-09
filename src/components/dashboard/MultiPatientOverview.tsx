import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { getBackendUrl } from "@/utils/backend";

interface PatientCase {
  id: string;
  name: string;
  age: number;
  gender: string;
  criticalFlags: number;
  aiConfidence: number;
  status: "critical" | "warning" | "normal" | "processing";
  lastUpdate: string;
  keyFindings: string[];
  nextAction: string;
  riskScore: "High" | "Moderate" | "Low";
  trends: {
    improving: boolean;
    metric: string;
  };
}
interface AnalysisResult {
  patient_id: string;
  pdf_filename: string;
  patient_name?: string;
  DoctorInterpretation: string;
  AutoReferralBlock: {
    needed: boolean;
    specialty: string;
    urgency: string;
    bookedStatus: string;
    suggestedDate: string;
  };
  IntelligenceHubCard: {
    riskLevel: string;
    aiConfidence: string;
    hpiPmhSummary: string;
  };
  keyFindings: string[];
}
interface MultiPatientOverviewProps {
  className?: string;
}

const MultiPatientOverview: React.FC<MultiPatientOverviewProps> = ({
  className = "",
}) => {
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    const backendUrl = getBackendUrl();
    fetch(`${backendUrl}/analysis-results/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setAnalysisResults(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch analysis results:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);
  const getStatusColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "High":
        return "medical-red";
      case "Moderate":
        return "medical-amber";
      case "Low":
        return "medical-green";
      default:
        return "medical-blue";
    }
  };

  const toggleExpanded = (caseId: string) => {
    setExpandedCase(expandedCase === caseId ? null : caseId);
  };

  const handleViewFullReport = (patientId: string) => {
    window.location.href = `http://interpretation-frontend-dev-bucket.s3-website-us-west-2.amazonaws.com/lab-report-demo/${patientId}`;
  };
  return (
    <div className={className}>
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-medical-blue flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-medical-blue" />
          AI Patient Intelligence Hub
        </h2>
        {loading && (
          <div className="text-center py-8 text-muted-foreground">
            Loading patient analysis results...
          </div>
        )}
        {error && (
          <div className="text-center py-8 text-medical-red">
            Error loading results: {error}
          </div>
        )}
        {!loading && analysisResults.length === 0 && !error && (
          <div className="text-center py-8 text-muted-foreground">
            No analysis results available
          </div>
        )}
        {analysisResults.map((patient, index) => {
          if (!patient.IntelligenceHubCard) return null;

          // Define Tailwind-safe background/text classes for risk levels
          const riskLevel = patient.IntelligenceHubCard?.riskLevel || "Unknown";
          const statusBg =
            riskLevel === "High"
              ? "bg-medical-red/20 text-medical-red"
              : riskLevel === "Moderate"
                ? "bg-medical-amber/20 text-medical-amber"
                : riskLevel === "Low"
                  ? "bg-medical-green/20 text-medical-green"
                  : "bg-medical-blue/20 text-medical-blue";
          return (

            <motion.div
              key={patient.patient_id}
              className="glass-card rounded-xl border border-medical-glass-border overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div
                className="p-4 cursor-pointer hover:bg-medical-glass/30 transition-colors"
                onClick={() => toggleExpanded(patient.patient_id)}
                aria-expanded={expandedCase === patient.patient_id}

              >
                <div className="flex items-center justify-between">
                  <div>
<h4 className="font-semibold text-foreground">
  {patient.patient_name || patient.pdf_filename}
</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${statusBg}`}>
                        <span className="capitalize">{patient.IntelligenceHubCard.riskLevel} Risk</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        AI Confidance: {patient.IntelligenceHubCard.aiConfidence}
                      </span>
                    </div>
                  </div>
                  {expandedCase === patient.patient_id ? (
                    <ChevronDownIcon className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
                  )}
                  <motion.div
                    animate={{ rotate: expandedCase === patient.patient_id ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedCase === patient.patient_id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-medical-glass-border"
                  >
                    <div className="p-4 bg-medical-dark/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Key Findings */}
                        <div>
                          <h5 className="font-semibold text-foreground mb-2">
                            Key Findings
                          </h5>
                          <ul className="space-y-1">
                            {Array.isArray(patient.keyFindings) && patient.keyFindings.length > 0 ? (
                              patient.keyFindings.map((point, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="w-1 h-1 rounded-full bg-medical-blue mt-2 flex-shrink-0" />
                                  {point}
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-medical-blue mt-2 flex-shrink-0" />
                                No key findings
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Actions & Trends */}
                        <div>
                          <h5 className="font-semibold text-foreground mb-2">
                            Next Action
                          </h5>
                          {patient.AutoReferralBlock && patient.AutoReferralBlock.needed ? (
                            <div className="text-sm text-medical-blue mb-3">
                              Referral to {patient.AutoReferralBlock.specialty} ({patient.AutoReferralBlock.urgency})<br />
                              Status: {patient.AutoReferralBlock.bookedStatus}<br />
                              Date: {patient.AutoReferralBlock.suggestedDate
                                ? new Date(patient.AutoReferralBlock.suggestedDate).toLocaleString()
                                : "—"}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground mb-3">
                              No referral needed
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-4 flex gap-2">
                        <button
                          className="px-3 py-1 bg-medical-blue hover:bg-medical-blue/80 text-white rounded text-xs transition-colors"
                          onClick={() => handleViewFullReport(patient.patient_id)}
                        >
                          View Full Report
                        </button>
                        <button className="px-3 py-1 bg-medical-dark/50 hover:bg-medical-dark/70 text-foreground border border-medical-glass-border rounded text-xs transition-colors">
                          Send to Patient
                        </button>
                        {patient.AutoReferralBlock && patient.AutoReferralBlock.needed && (
                          <button className="px-3 py-1 bg-medical-red hover:bg-medical-red/80 text-white rounded text-xs transition-colors">
                            Urgent Action
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
};

export default MultiPatientOverview;
