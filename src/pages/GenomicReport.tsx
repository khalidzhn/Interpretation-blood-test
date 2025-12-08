import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ClinicalContextSection } from "@/components/genomic/ClinicalContextSection";
import { EvidenceMatrixSection } from "@/components/genomic/EvidenceMatrixSection";
import { TieredVariantAnalysisSection } from "@/components/genomic/TieredVariantAnalysisSection";
import { ActionsOrdersSection } from "@/components/genomic/ActionsOrdersSection";
import { ArabicStory } from "@/components/genomic/ArabicStory";
import { ChevronRight, ArrowLeft, Sparkles } from "lucide-react";

interface SectionState {
  [key: string]: boolean;
}

const GenomicReport = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sectionStates, setSectionStates] = useState<SectionState>({
    clinical: true,
    evidence: false,
    variants: false,
    actions: false,
    patient: false,
  });

  const toggleSection = (section: string) => {
    setSectionStates((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Mock data - in real scenario, this would be fetched based on the ID
  const reportData = useMemo(() => ({
    patient: {
      name: "Ahmed Ali Mohammad",
      mrn: "MRN-2024-001",
      age: 35,
      dob: "1989-03-15",
    },
    clinicalContext: {
      conditions: [
        "Hypertrophic Cardiomyopathy (HCM)",
        "Family History of Sudden Cardiac Death",
      ],
      medicalHistory:
        "Patient presents with symptoms of chest pain and shortness of breath. ECG shows left ventricular hypertrophy. Family history significant for sudden cardiac death in paternal grandfather.",
      familyHistory: [
        "Father: Hypertrophic Cardiomyopathy diagnosed at age 45",
        "Paternal Grandfather: Sudden cardiac death at age 52",
        "Sister: Asymptomatic carrier of pathogenic variant",
      ],
      medications: ["Metoprolol 100mg daily", "Atorvastatin 20mg daily"],
      assessment:
        "A 35-year-old male with clinical features suggestive of HCM. Genetic testing is indicated to identify potential pathogenic variants and assess family risk.",
    },
    evidenceMatrix: {
      levels: [
        {
          name: "ACMG Evidence",
          quality: "high",
          status: "confirmed",
          description:
            "Evidence supporting pathogenicity from American College of Medical Genetics",
        },
        {
          name: "ClinVar",
          quality: "high",
          status: "confirmed",
          description: "Variant confirmed in ClinVar database as pathogenic",
        },
        {
          name: "Literature Review",
          quality: "medium",
          status: "pending",
          description: "Ongoing evaluation of recent publications",
        },
      ],
      references: ["33215644", "32393761", "31375395"],
    },
    qualityControl: {
      coverage: 150,
      mappingQuality: 98,
      depthUniformity: 94,
      callRate: 99.5,
      overallQuality:
        "High-quality genomic data meeting all QC thresholds. Results are reliable for clinical interpretation.",
    },
    variants: [
      {
        hgvs: "NM_000257.3:c.2827A>G (p.Glu943Gly)",
        gene: "MYH7",
        tier: "Tier 1",
        zygosity: "Heterozygous",
        vaf: 50,
        clinicalSignificance: "Pathogenic",
        inheritance: "Autosomal Dominant",
        frequency: "Rare",
        acmgClassification: "Pathogenic (PVS1, PM2, PM5, PP2)",
        description:
          "Well-characterized pathogenic variant in MYH7 gene associated with Hypertrophic Cardiomyopathy. Multiple cases reported in literature with clear clinical phenotype.",
      },
      {
        hgvs: "NM_000023.3:c.3142G>A (p.Arg1048His)",
        gene: "MYBPC3",
        tier: "Tier 2",
        zygosity: "Heterozygous",
        vaf: 49,
        clinicalSignificance: "Likely Pathogenic",
        inheritance: "Autosomal Dominant",
        frequency: "Rare",
        acmgClassification: "Likely Pathogenic (PM1, PM2, PP2, PP3)",
        description:
          "Novel missense variant in MYBPC3. In silico predictions suggest deleterious effect. Segregates with disease in family.",
      },
      {
        hgvs: "NM_000160.4:c.1234T>C (p.Ile412Thr)",
        gene: "TNNT2",
        tier: "Tier 3",
        zygosity: "Heterozygous",
        vaf: 48,
        clinicalSignificance: "Uncertain Significance",
        inheritance: "Autosomal Dominant",
        frequency: "Rare",
        acmgClassification: "VUS (PM2, PP3)",
        description:
          "Variant of uncertain significance. Requires further functional studies or family segregation data for definitive classification.",
      },
    ],
    tieredAnalysis: {
      summary:
        "Genomic analysis identified 3 significant variants: 1 pathogenic (Tier 1), 1 likely pathogenic (Tier 2), and 1 variant of uncertain significance (Tier 3). The pathogenic MYH7 variant is sufficient to explain the clinical phenotype and warrants immediate clinical intervention.",
      guidelines: [
        "Pathogenic variants should prompt cardiac assessment and family screening",
        "Patients with HCM-related variants should avoid strenuous exercise pending cardiology evaluation",
        "Cascade testing is recommended for first-degree relatives",
        "Regular cardiac imaging (echocardiography/MRI) is indicated",
      ],
    },
    actionsOrders: {
      actions: [
        {
          title: "Immediate Cardiology Consultation",
          description:
            "Patient should be referred to a cardiologist for comprehensive evaluation",
          status: "pending",
          timeline: "Within 1 week",
        },
        {
          title: "Advanced Cardiac Imaging",
          description:
            "Cardiac MRI recommended to assess myocardial fibrosis and structure",
          status: "pending",
          timeline: "Within 2 weeks",
        },
        {
          title: "Genetic Counseling",
          description:
            "Pre- and post-test genetic counseling for patient and at-risk relatives",
          status: "ordered",
          timeline: "Scheduled",
        },
        {
          title: "Family Cascade Testing",
          description:
            "Genetic testing for first-degree relatives to identify carriers",
          status: "pending",
          timeline: "Within 1 month",
        },
      ],
      orders: [
        {
          orderName: "Cardiac MRI",
          status: "ordered",
          priority: "high",
          testType: "Advanced Imaging",
          specimen: "In-vivo",
          turnaround: "1-2 weeks",
          instructions:
            "Patient should be scheduled at approved imaging center. No IV contrast contraindications documented.",
        },
        {
          orderName: "Cascade Genetic Testing",
          status: "pending",
          priority: "high",
          testType: "Targeted Mutation Testing",
          specimen: "Saliva or Blood",
          requiredTests: "3 family members",
          instructions:
            "Send genetic testing requisition to family members. Provide patient education materials.",
        },
        {
          orderName: "Cardiac Assessment Panel",
          status: "ordered",
          priority: "medium",
          testType: "Echocardiography, ECG, Holter Monitor",
          specimen: "In-vivo",
          turnaround: "1 week",
          instructions:
            "Schedule with cardiology department. Include stress test if clinically indicated.",
        },
      ],
      recommendations: [
        "Avoid strenuous exercise and competitive sports until clearance from cardiology",
        "Consider beta-blocker or calcium channel blocker therapy",
        "Evaluate for ICD (Implantable Cardioverter-Defibrillator) indication",
        "Implement regular cardiac monitoring schedule",
        "Counsel patient on inheritance pattern (autosomal dominant) and family implications",
      ],
      followUp:
        "Recheck with cardiology in 4 weeks following imaging studies. Plan family genetic counseling session. Annual cardiac assessments recommended.",
    },
  }), []);

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
      id: "clinical",
      title: "Clinical Context & Assessment",
      count: 1,
      component: <ClinicalContextSection data={reportData} />,
    },
    {
      id: "evidence",
      title: "Evidence Matrix & Quality Control",
      count: reportData.evidenceMatrix?.levels?.length || 0,
      component: <EvidenceMatrixSection data={reportData} />,
    },
    {
      id: "variants",
      title: "Tiered Variant Analysis",
      count: reportData.variants?.length || 0,
      component: <TieredVariantAnalysisSection data={reportData} />,
    },
    {
      id: "actions",
      title: "Actions & Orders",
      count:
        (reportData.actionsOrders?.actions?.length || 0) +
        (reportData.actionsOrders?.orders?.length || 0),
      component: <ActionsOrdersSection data={reportData} />,
    },
    {
      id: "patient",
      title: "Patient Story",
      count: 1,
      component: <ArabicStory data={reportData} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-6">
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
                <h1 className="text-4xl font-bold text-foreground">
                  Genomic Report
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                {reportData.patient.name} • MRN: {reportData.patient.mrn} • Report ID:{" "}
                <code className="text-sm bg-muted px-2 py-1 rounded">{id}</code>
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
                            {section.count > 0 && (
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
                          <div className="p-6 bg-muted/30">
                            {section.component}
                          </div>
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
                <strong>Clinical Use:</strong> This genomic report is intended for
                healthcare provider review only. Results should be interpreted in the
                context of clinical presentation and family history.
              </p>
              <p className="text-xs text-muted-foreground mt-4 flex items-center justify-between">
                <span>
                  Report Generated: {new Date().toLocaleDateString()} at{" "}
                  {new Date().toLocaleTimeString()}
                </span>
                <span className="font-mono text-xs">ID: {id}</span>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default GenomicReport;
