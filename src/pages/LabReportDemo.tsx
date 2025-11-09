import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";
import { getBackendUrl } from "@/utils/backend";
type LabResult = {
  testName: string;
  value: string | number;
  units: string;
  refRange: string;
  classification: string;
  status: string; // <-- add this line

};

type LabReportJSON = {
  results: LabResult[];
};


const LabReportDemo = () => {
  const navigate = useNavigate();
  const { labResultId } = useParams<{ labResultId: string }>();
  const [results, setResults] = useState<LabResult[]>([]);
  const [demographics, setDemographics] = useState<any>({});
  const [doctorInterpretation, setDoctorInterpretation] = useState<string>("");
  const [aiInterpretationEN, setAiInterpretationEN] = useState<string>("");
  const [patientStoryEN, setPatientStoryEN] = useState<string>("");
  const [patientStoryAR, setPatientStoryAR] = useState<string>("");
  const [referral, setReferral] = useState<any>(null);
  const [aiConfidence, setAiConfidence] = useState<string>("");
  const [riskLevel, setRiskLevel] = useState<string>("");
  const [aiClinicalInterpretation, setAiClinicalInterpretation] = useState<any>(null);
  const [intelligentPatientReport, setIntelligentPatientReport] = useState<any>(null);

  useEffect(() => {
    console.log("labResultId:", labResultId);
    fetch(`${getBackendUrl()}/lab-result/${labResultId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setResults(data.LabReportJSON?.results || []);
        setDemographics(data.LabReportJSON?.demographics || {});
        setDoctorInterpretation(data.DoctorInterpretation || "");
        setAiInterpretationEN(data.LabReportJSON?.aiInterpretationEN || data.aiInterpretationEN || "");
        setPatientStoryEN(data.PatientStoryTelling?.english || "");
        setPatientStoryAR(data.PatientStoryTelling?.arabic || "");
        setReferral(data.AutoReferralBlock || data.LabReportJSON?.referral || null);
        setAiConfidence(data.IntelligenceHubCard?.AIConfidence || "");
        setRiskLevel(data.IntelligenceHubCard?.RiskLevel || "");
        setAiClinicalInterpretation(data.AI_ClinicalInterpretation || null);
        setIntelligentPatientReport(data.IntelligentPatientReport || null);
      });
  }, [labResultId]);

  return (
    <div
      className="min-h-screen bg-white text-black"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Back to Dashboard Button */}
      <div className="p-6">
        <motion.button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Dashboard
        </motion.button>
      </div>

      {/* A4 Document Container */}
      <div className="flex justify-center">
        <motion.div
          className="bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            width: "816px",
            minHeight: "1056px", // A4 height
            paddingLeft: "48px",
            paddingRight: "48px",
            paddingTop: "64px",
            paddingBottom: "64px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          {/* Header */}
          <div className="border-b border-blue-600 pb-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-blue-600">
                    Baseerah Technologies
                  </h1>
                  <p className="text-gray-600 text-sm">
                    AI-Powered Lab Interpretation
                  </p>
                </div>
              </div>
              <div className="text-right text-sm" style={{ color: "#111827" }}>
                <div className="font-semibold">Patient ID #12847</div>
                <div className="text-gray-600">Date 24 Jun 2025</div>
                <div className="text-gray-600">Generated 7:16 PM</div>
              </div>
            </div>
          </div>

          {/* Patient Demographics */}
          <div className="mb-8">
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "#111827" }}
            >
              Patient Demographics
            </h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="mb-3">
                  <span className="font-bold" style={{ color: "#374151" }}>
                    Name:
                  </span>
                  <span className="ml-2 font-normal">{demographics.name || "—"}</span>
                </div>
                <div className="mb-3">
                  <span className="font-bold" style={{ color: "#374151" }}>
                    Age:
                  </span>
                  <span className="ml-2 font-normal">{demographics.age ? `${demographics.age} years` : "—"}</span>
                </div>
                <div className="mb-3">
                  <span className="font-bold" style={{ color: "#374151" }}>
                    Gender:
                  </span>
                  <span className="ml-2 font-normal">{demographics.gender || "—"}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-bold" style={{ color: "#374151" }}>
                    MRN:
                  </span>
                  <span className="ml-2 font-normal">{demographics.mrn || "—"}</span>                </div>
                <div className="mb-3">
                  <span className="font-bold" style={{ color: "#374151" }}>
                    Collection Date:
                  </span>
                  <span className="ml-2 font-normal">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="font-bold" style={{ color: "#374151" }}>
                    Ordering Physician:
                  </span>
                  <span className="ml-2 font-normal">Dr. Sarah Al-Zahra</span>
                </div>
              </div>
            </div>
          </div>

          {/* Laboratory Results Table */}
          <div className="mb-8">
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "#111827" }}
            >
              Laboratory Results
            </h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr style={{ backgroundColor: "#1E3A8A" }}>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-white">
                    Test
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold text-white">
                    Result
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold text-white">
                    Range
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold text-white">
                    Status
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold text-white">
                    Units
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? "bg-gray-50" : ""}>
                    <td className="border border-gray-300 p-3 font-medium">
                      {result.testName}
                    </td>
                    <td className="border border-gray-300 p-3 text-center font-mono">
                      {result.value}
                    </td>
                    <td className="border border-gray-300 p-3 text-center">
                      {result.refRange}
                    </td>
                    <td className="border border-gray-300 p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm font-medium ${result.classification === "Critical"
                          ? "bg-red-500"
                          : result.status === "High"
                            ? "bg-yellow-500"
                            : result.status === "Low"
                              ? "bg-blue-500"
                              : result.status === "Borderline"
                                ? "bg-orange-500"
                                : "bg-green-600"
                          }`}
                      >
                        {result.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-3 text-center">
                      {result.units}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Clinical Interpretation */}
          <div className="mb-8">
            <div
              className="p-6 rounded-lg border-l-4"
              style={{
                borderLeftColor: "#3B82F6",
                backgroundColor: "#F8FAFC",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: "#111827" }}
                >
                  AI Clinical Interpretation
                </h2>
                <div
                  className="px-3 py-1 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: "#3B82F6" }}
                >
                  AI Confidence: {aiConfidence} | Risk Level: {riskLevel}
                </div>
              </div>

              <div className="space-y-6">
                {/* Integrated Clinical Context */}
                <div>
                  <h3 className="font-bold mb-3" style={{ color: "#111827" }}>
                    Integrated Clinical Context
                  </h3>
                  <div className="bg-gray-100 p-4 rounded-lg border-l-2 border-gray-400">
                    {aiClinicalInterpretation?.integratedClinicalContext}
                  </div>
                </div>

                {/* Result-Linked Analysis */}
                <div>
                  <h3 className="font-bold mb-3" style={{ color: "#111827" }}>
                    Result-Linked Analysis
                  </h3>
                  <div className="space-y-3">
                    {aiClinicalInterpretation?.resultLinkedAnalysis?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="font-mono text-sm bg-yellow-100 px-2 py-1 rounded">
                          {item.finding}
                        </span>
                        <p className="text-gray-700 text-sm">
                          → {item.analysis}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Evidence-Based Recommendations */}
                <div>
                  <h3 className="font-bold mb-3" style={{ color: "#111827" }}>
                    Evidence-Based Recommendations
                  </h3>
                  <ol className="text-gray-700 space-y-2">
                    {aiClinicalInterpretation?.evidenceBasedRecommendations?.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-3 font-bold">{idx + 1}.</span>
                        {rec}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-Referral Panel */}
          <div className="mb-8">
            <div
              className="p-4 rounded-lg flex items-center gap-3"
              style={{ backgroundColor: "#DBEAFE" }}
            >
              <CheckCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
              {referral && referral.needed && (
                <div className="font-semibold text-blue-900">
                  🚀 Referral Booked ➜ {referral.specialty}
                </div>
              )}
              {referral && referral.suggestedDate && (
                <div className="text-blue-700 text-sm">
                  Appointment: {new Date(referral.suggestedDate).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* What do these results mean for me? - Doctor-tone */}
          <div className="mb-8">
            <div
              className="p-6 rounded-lg"
              style={{
                backgroundColor: "#F8FAFC",
                borderLeft: "4px solid #6B7280",
              }}
            >
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: "#111827" }}
              >
                What do these results mean for me?
              </h2>
              <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: doctorInterpretation }} />
            </div>
          </div>

          {/* Intelligent Patient Report Sent */}
          <div className="mb-8">
            <div
              className="p-6 rounded-xl border-2 border-green-200"
              style={{ backgroundColor: "#F0FDF4" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "#111827" }}
                  >
                    Intelligent Patient Report Sent 📨
                  </h2>
                  <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                    AI-Personalized
                  </span>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div>📱 Baseerah Mobile App</div>
                  <div>🕒 24 Jun 2025, 7:18 PM</div>
                  <div>✅ Read Receipt: 7:23 PM</div>
                </div>
              </div>
              {/* Personalized Summary Section */}
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-blue-600 font-semibold">
                      🧠 AI-Generated Personalized Summary
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Based on your profile
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* English Version */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-600 mb-3 flex items-center gap-2">
                        🇺🇸 ENGLISH REPORT
                        <span className="text-xs bg-blue-200 px-2 py-0.5 rounded">
                          Tailored for you
                        </span>
                      </div>
                      <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
                        {/* Intro */}
                        <p>
                          <strong>{intelligentPatientReport?.introEN}</strong>
                        </p>
                        {/* Abnormal Tests */}
                        {intelligentPatientReport?.abnormalTests?.map((test: any, idx: number) => (
                          <div
                            key={idx}
                            className={`bg-white p-3 rounded border-l-4 ${test.status === "Critical"
                                ? "border-red-600"
                                : test.status === "High"
                                  ? "border-yellow-400"
                                  : test.status === "Low"
                                    ? "border-blue-400"
                                    : test.status === "Borderline"
                                      ? "border-orange-400"
                                      : "border-green-400"
                              }`}
                          >
                            <p>
                              <strong>
                                {test.emoji} {test.testNameEN}: {test.resultDisplay}
                              </strong>
                              <br />
                              {test.storyEN}
                            </p>
                          </div>
                        ))}
                        {intelligentPatientReport?.patientActionPlan && (
  <div className="bg-green-50 p-3 rounded">
    <p>
      <strong>🎯 Your Action Plan:</strong>
    </p>
    <ul className="mt-2 space-y-1 text-xs">
      {intelligentPatientReport.patientActionPlan.map(
        (action: any, idx: number) => (
          <li key={idx} dangerouslySetInnerHTML={{ __html: `• ${action.actionEn}` }} />
        )
      )}
    </ul>
  </div>
)}
                      </div>
                    </div>

                    {/* Arabic Version */}
                    <div className="p-4 bg-teal-50 rounded-lg" dir="rtl">
                      <div className="text-sm font-medium text-teal-600 mb-3 flex items-center gap-2 justify-end">
                        <span className="text-xs bg-teal-200 px-2 py-0.5 rounded">
                          مُخصص لك
                        </span>
                        🇸🇦 التقرير العربي
                      </div>
                      <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
                        {/* Intro */}
                        <p>
                          <strong>{intelligentPatientReport?.introAR}</strong>
                        </p>
                        {/* Abnormal Tests */}
                        {intelligentPatientReport?.abnormalTests?.map((test: any, idx: number) => (
                          <div
                            key={idx}
                            className={`bg-white p-3 rounded border-r-4 ${test.status === "Critical"
                                ? "border-red-600"
                                : test.status === "High"
                                  ? "border-yellow-400"
                                  : test.status === "Low"
                                    ? "border-blue-400"
                                    : test.status === "Borderline"
                                      ? "border-orange-400"
                                      : "border-green-400"
                              }`}
                          >
                            <p>
                              <strong>
                                {test.emoji} {test.testNameAR}: {test.resultDisplay}
                              </strong>
                              <br />
                              {test.storyAR}
                            </p>
                          </div>

                        ))}
{intelligentPatientReport?.patientActionPlan && (
  <div className="bg-green-50 p-3 rounded">
    <p>
      <strong>🎯 خطة العلاج:</strong>
    </p>
    <ul className="mt-2 space-y-1 text-xs">
      {intelligentPatientReport.patientActionPlan.map(
        (action: any, idx: number) => (
          <li key={idx} dangerouslySetInnerHTML={{ __html: `• ${action.actionAr}` }} />
        )
      )}
    </ul>
  </div>
)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mb-8">
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                🔄 Re-generate in Arabic-only
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors">
                📈 View Trend Graphs
              </button>
            </div>
          </div>

          {/* Digital Access Footer */}
          <div className="mb-8">
            <div className="flex items-center gap-6">
              <div
                className="w-18 h-18 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center"
                style={{ width: "72px", height: "72px" }}
              >
                <div className="text-4xl">⚏</div>
              </div>
              <div>
                <h3 className="font-bold mb-1" style={{ color: "#111827" }}>
                  Scan to view full history & trends
                </h3>
                <p className="text-sm text-gray-600">
                  Access complete medical records, trending data, and detailed
                  AI analysis reports through our secure patient portal.
                </p>
              </div>
            </div>
          </div>

          {/* Page Footer */}
          <div className="border-t border-gray-300 pt-4">
            <div className="text-center text-xs text-gray-500 mb-2">
              Generated by Baseerah AI | HIPAA & SFDA SaMD Ready | Report ID
              RPT-1750781784537
            </div>
            <div
              className="border-t pt-2 text-center text-sm text-gray-600"
              style={{ borderColor: "#E5E7EB" }}
            >
              Page 1 of 1
            </div>
          </div>
        </motion.div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { margin: 0; }
          .p-6 { display: none; }
          .bg-white { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default LabReportDemo;
