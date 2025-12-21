import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { getBackendUrl } from "@/utils/backend";
import LanguageToggle from "@/components/dashboard/LanguageToggle";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronRight, ArrowLeft, Sparkles, CheckCircle, Edit2, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type LabResult = {
  testName: string;
  value: string | number;
  units: string;
  refRange: string;
  classification: string;
  status: string;
};

type LabReportJSON = {
  results: LabResult[];
};

interface SectionState {
  [key: string]: boolean;
}

const CLINIC_SPECIALTIES = [
  "Cardiology",
  "Pediatrics",
  "Neurology",
  "Orthopedics",
  "Gastroenterology",
  "Endocrinology",
  "Pulmonology",
  "Nephrology",
  "Rheumatology",
  "Oncology",
  "Dermatology",
  "Psychiatry",
  "General Medicine",
];

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
  const [language, setLanguage] = useState<string>("en");
  const [isEditingReferral, setIsEditingReferral] = useState(false);
  const [editedReferral, setEditedReferral] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sectionStates, setSectionStates] = useState<SectionState>({
    demographics: true,
    results: true,
    aiInterpretation: false,
    doctorInterpretation: false,
    referral: false,
    patientReport: false,
  });

  const [isProcessed, setIsProcessed] = useState<boolean>(true);

  useEffect(() => {
    console.log("labResultId:", labResultId);
    fetch(`${getBackendUrl()}/lab-result/${labResultId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        const analysis = data.analysis || {};
        const labReportJSON = analysis.LabReportJSON || {};
        const patientStoryTelling = analysis.PatientStoryTelling || {};

        setResults(labReportJSON.results || []);
        setDemographics(labReportJSON.demographics || {});
        setDoctorInterpretation(analysis.DoctorInterpretation || "");
        setAiInterpretationEN(labReportJSON.aiInterpretationEN || "");
        setPatientStoryEN(patientStoryTelling.english || "");
        setPatientStoryAR(patientStoryTelling.arabic || "");
        setReferral(analysis.AutoReferralBlock || labReportJSON.referral || null);
        setAiConfidence(analysis.IntelligenceHubCard?.aiConfidence || "");
        setRiskLevel(analysis.IntelligenceHubCard?.riskLevel || "");
        setAiClinicalInterpretation(analysis.AI_ClinicalInterpretation || null);
        setIntelligentPatientReport(analysis.IntelligentPatientReport || null);
        setIsProcessed(data.is_processed ?? true);
      });
  }, [labResultId]);

  const toggleSection = (section: string) => {
    setSectionStates((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleEditReferral = () => {
    setIsEditingReferral(true);
    setEditedReferral({
      specialty: referral?.specialty || "",
      suggestedDate: referral?.suggestedDate ? new Date(referral.suggestedDate).toISOString().slice(0, 16) : "",
    });
  };

  const handleConfirmReferral = async () => {
    setIsProcessing(true);
    try {
      const payload = {
        is_processed: true,
      };

      // Only include referral if it was edited
      if (editedReferral && (editedReferral.specialty !== referral?.specialty || editedReferral.suggestedDate !== referral?.suggestedDate)) {
        payload.referral = {
          specialty: editedReferral.specialty,
          suggestedDate: editedReferral.suggestedDate,
        };
      }

      console.log("Sending payload:", payload);
      console.log("URL:", `${getBackendUrl()}/process/${labResultId}`);

      const response = await fetch(`${getBackendUrl()}/process/${labResultId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json().catch(() => ({}));
      console.log("Response status:", response.status);
      console.log("Response data:", responseData);

      if (response.ok) {
        setIsEditingReferral(false);
        if (editedReferral) {
          setReferral(editedReferral);
        }
        setIsProcessed(true);
      } else {
        console.error("Failed to process report. Status:", response.status, "Error:", responseData);
      }
    } catch (error) {
      console.error("Error processing report:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingReferral(false);
    setEditedReferral(null);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: i * 0.1,
      },
    }),
  };

  const sections = [
    {
      id: "demographics",
      title: "Patient Demographics",
      component: (
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="mb-3">
              <span className="font-bold text-foreground">Name:</span>
              <span className="ml-2 font-normal">{demographics.name || "—"}</span>
            </div>
            <div className="mb-3">
              <span className="font-bold text-foreground">Age:</span>
              <span className="ml-2 font-normal">{demographics.age ? `${demographics.age} years` : "—"}</span>
            </div>
            <div className="mb-3">
              <span className="font-bold text-foreground">Gender:</span>
              <span className="ml-2 font-normal">{demographics.gender || "—"}</span>
            </div>
          </div>
          <div>
            <div className="mb-3">
              <span className="font-bold text-foreground">MRN:</span>
              <span className="ml-2 font-normal">{demographics.mrn || "—"}</span>
            </div>
            <div className="mb-3">
              <span className="font-bold text-foreground">Collection Date:</span>
              <span className="ml-2 font-normal">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="mb-3">
              <span className="font-bold text-foreground">Ordering Physician:</span>
              <span className="ml-2 font-normal">Dr. Sarah Al-Zahra</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "results",
      title: "Laboratory Results",
      count: results.length,
      component: (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary/10">
                <th className="p-3 text-left font-semibold text-foreground">Test</th>
                <th className="p-3 text-center font-semibold text-foreground">Result</th>
                <th className="p-3 text-center font-semibold text-foreground">Range</th>
                <th className="p-3 text-center font-semibold text-foreground">Status</th>
                <th className="p-3 text-center font-semibold text-foreground">Units</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr key={idx} className={idx % 2 === 1 ? "bg-muted/30" : ""}>
                  <td className="p-3 font-medium text-foreground">{result.testName}</td>
                  <td className="p-3 text-center font-mono text-foreground">{result.value}</td>
                  <td className="p-3 text-center text-foreground">{result.refRange}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm font-medium whitespace-nowrap ${
                        result.classification === "Critical" || result.status === "Critical"
                          ? "bg-red-900 animate-pulse"
                          : result.status === "High"
                          ? "bg-red-500"
                          : result.status === "Low"
                          ? "bg-red-500"
                          : result.status === "Normal"
                          ? "bg-green-600"
                          : result.status === "Borderline Low" || result.status === "Borderline High"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {result.status}
                    </span>
                  </td>
                  <td className="p-3 text-center text-foreground">{result.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "aiInterpretation",
      title: "AI Clinical Interpretation",
      component: (
        <div className="space-y-6">
          {(aiConfidence || riskLevel) && (
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary">
                {aiConfidence && <span>AI Confidence: {aiConfidence}</span>}
                {aiConfidence && riskLevel && <span> | </span>}
                {riskLevel && <span>Risk Level: {riskLevel}</span>}
              </Badge>
            </div>
          )}

          {aiClinicalInterpretation?.integratedClinicalContext && (
            <div>
              <h3 className="font-bold mb-3 text-foreground">Integrated Clinical Context</h3>
              <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                <p className="text-foreground">{aiClinicalInterpretation.integratedClinicalContext}</p>
              </div>
            </div>
          )}

          {aiClinicalInterpretation?.resultLinkedAnalysis && (
            <div>
              <h3 className="font-bold mb-3 text-foreground">Result-Linked Analysis</h3>
              <div className="space-y-3">
                {aiClinicalInterpretation.resultLinkedAnalysis.map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-wrap items-start gap-3">
                    <span className="font-mono text-sm bg-yellow-100 text-yellow-900 px-2 py-1 rounded max-w-xs break-words">
                      {item.finding}
                    </span>
                    <p className="text-foreground text-sm">{item.analysis}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {aiClinicalInterpretation?.evidenceBasedRecommendations && (
            <div>
              <h3 className="font-bold mb-3 text-foreground">Evidence-Based Recommendations</h3>
              <ol className="text-foreground space-y-2">
                {aiClinicalInterpretation.evidenceBasedRecommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-3 font-bold">{idx + 1}.</span>
                    {rec}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "doctorInterpretation",
      title: "What do these results mean for me?",
      component: (
        <div className="space-y-4">
          <div className="text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: doctorInterpretation }} />
        </div>
      ),
    },
    {
      id: "referral",
      title: "Referral Status",
      component: (
        <div className="space-y-4">
          {!isEditingReferral ? (
            <div className="flex items-start justify-between gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3 flex-1">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                {referral && referral.needed ? (
                  <div>
                    <div className="font-semibold text-foreground">
                      🚀 Referral Booked ➜ {referral.specialty}
                    </div>
                    {referral.suggestedDate && (
                      <div className="text-sm text-muted-foreground">
                        Appointment: {new Date(referral.suggestedDate).toLocaleString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-foreground">No referral needed at this time</div>
                )}
              </div>
              {referral && referral.needed && (
                <button
                  onClick={handleEditReferral}
                  className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors flex-shrink-0"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Edit Referral</h3>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Clinic / Specialty</label>
                  <Select value={editedReferral?.specialty || ""} onValueChange={(value) => setEditedReferral({ ...editedReferral, specialty: value })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a clinic" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLINIC_SPECIALTIES.map((clinic) => (
                        <SelectItem key={clinic} value={clinic}>
                          {clinic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Appointment Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={editedReferral?.suggestedDate || ""}
                    onChange={(e) => setEditedReferral({ ...editedReferral, suggestedDate: e.target.value })}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReferral}
                    disabled={isProcessing}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded transition-colors"
                  >
                    {isProcessing ? "Confirming..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "patientReport",
      title: "Intelligent Patient Report 📨",
      component: (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary">AI-Personalized Report</Badge>
            <LanguageToggle onLanguageChange={(lang) => setLanguage(lang.code)} />
          </div>

          <div className="bg-white dark:bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary font-semibold">🧠 AI-Generated Personalized Summary</span>
              <Badge variant="outline" className="text-xs">Based on your profile</Badge>
            </div>

            {language === "en" && (
              <div className="space-y-3 text-foreground text-sm">
                {intelligentPatientReport?.introEN && (
                  <p>
                    <strong>{intelligentPatientReport.introEN}</strong>
                  </p>
                )}

                {intelligentPatientReport?.abnormalTests?.map((test: any, idx: number) => (
                  <div
                    key={idx}
                    className={`bg-muted/50 p-3 rounded border-l-4 ${
                      test.status === "Critical"
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
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                    <p>
                      <strong className="text-green-900 dark:text-green-400">🎯 Your Action Plan:</strong>
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-foreground">
                      {intelligentPatientReport.patientActionPlan.map((action: any, idx: number) => (
                        <li key={idx} dangerouslySetInnerHTML={{ __html: `• ${action.actionEn}` }} />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {language === "ar" && (
              <div className="space-y-3 text-foreground text-sm" dir="rtl">
                {intelligentPatientReport?.introAR && (
                  <p>
                    <strong>{intelligentPatientReport.introAR}</strong>
                  </p>
                )}

                {intelligentPatientReport?.abnormalTests?.map((test: any, idx: number) => (
                  <div
                    key={idx}
                    className={`bg-muted/50 p-3 rounded border-r-4 ${
                      test.status === "Critical"
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
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                    <p>
                      <strong className="text-green-900 dark:text-green-400">🎯 خطة العلاج:</strong>
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-foreground">
                      {intelligentPatientReport.patientActionPlan.map((action: any, idx: number) => (
                        <li key={idx} dangerouslySetInnerHTML={{ __html: `• ${action.actionAr}` }} />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-6">
        {/* Process Alert Banner */}
        {!isProcessed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-6 py-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    Please confirm the findings and referral to complete the analysis
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2 mb-6 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-bold text-foreground">Lab Report</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Patient ID: {demographics.mrn || "—"} • Generated {new Date().toLocaleDateString()} • Report ID:{" "}
                <code className="text-sm bg-muted px-2 py-1 rounded">{labResultId}</code>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-4">
          <AnimatePresence>
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                custom={index}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <Collapsible
                  open={sectionStates[section.id]}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <div className="glass-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-colors">
                    <CollapsibleTrigger asChild>
                      <button className="w-full">
                        <div className="p-5 cursor-pointer hover:bg-primary/5 transition-colors flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="text-left">
                              <h2 className="text-xl font-semibold text-foreground">
                                {section.title}
                              </h2>
                            </div>
                            {section.count && (
                              <Badge variant="secondary" className="ml-auto mr-3">
                                {section.count}
                              </Badge>
                            )}
                          </div>
                          <motion.div
                            animate={{
                              rotate: sectionStates[section.id] ? 90 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0"
                          >
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </motion.div>
                        </div>
                      </button>
                    </CollapsibleTrigger>

                    <AnimatePresence>
                      {sectionStates[section.id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden border-t border-border"
                        >
                          <div className="p-6 bg-muted/30">{section.component}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Collapsible>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="p-6 border border-border bg-muted/20">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Clinical Use:</strong> This lab report is intended for healthcare provider review only. Results should be interpreted in the context of clinical presentation.
              </p>
              <p className="text-xs text-muted-foreground mt-4 flex items-center justify-between">
                <span>
                  Report Generated: {new Date().toLocaleDateString()} at{" "}
                  {new Date().toLocaleTimeString()}
                </span>
                <span className="font-mono text-xs">ID: {labResultId}</span>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default LabReportDemo;
