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

interface AddedVariantAction {
  variant: any;
  actionType: string;
  id: string;
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
  const [addedVariantActions, setAddedVariantActions] = useState<AddedVariantAction[]>([]);

  const toggleSection = (section: string) => {
    setSectionStates((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAddVariantAction = (variant: any, actionType: string) => {
    const newAction: AddedVariantAction = {
      variant,
      actionType,
      id: `${variant.gene}-${actionType}-${Date.now()}`,
    };
    setAddedVariantActions((prev) => [...prev, newAction]);
  };

  const handleRemoveVariantAction = (actionId: string) => {
    setAddedVariantActions((prev) => prev.filter((a) => a.id !== actionId));
  };

  const handleUpdateVariantAction = (actionId: string, newActionType: string) => {
    setAddedVariantActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, actionType: newActionType } : a))
    );
  };

  // Mock data - in real scenario, this would be fetched based on the ID
  const reportData = useMemo(() => ({
  "patient": {
    "name": "{{name}}",
    "mrn": "{{mrn}}",
    "age": "{{age}}",
    "dob": "{{dob}}"
  },
  "clinicalContext": {
    "conditions": [
      "{{indication}}"
    ],
    "medicalHistory": "{{clinical_notes}}",
    "familyHistory": [
      "{{family_history}}"
    ],
    "medications": [],
    "assessment": "The patient's clinical indication is {{indication}}. Genetic analysis revealed multiple variants in genes associated with several conditions, notably Cystic Fibrosis (CFTR), Sickle Cell Anemia (HBB), and Hereditary Cancer (BRCA1/BRCA2). The co-occurrence of a homozygous likely pathogenic variant in HBB and two heterozygous likely pathogenic/pathogenic variants in CFTR requires careful consideration, particularly in the context of the reported clinical indications and ethnicity."
  },
  "evidenceMatrix": {
    "levels": [
      {
        "name": "ACMG Evidence",
        "quality": "High",
        "status": "Completed",
        "description": "ACMG/AMP criteria were applied to all variants. Four variants were classified as Pathogenic/Likely Pathogenic, one as VUS, and the remaining as Benign/Likely Benign."
      },
      {
        "name": "ClinVar",
        "quality": "High",
        "status": "Present",
        "description": "CLNSIG data was provided for all variants, indicating prior clinical classification ranging from Pathogenic to Benign."
      },
      {
        "name": "Literature Review",
        "quality": "Moderate",
        "status": "Present",
        "description": "OMIM, HGMD, and GenePanelX annotations provide initial context for gene-disease association and reported pathogenicity."
      }
    ],
    "references": []
  },
  "qualityControl": {
    "coverage": 0,
    "mappingQuality": 0,
    "depthUniformity": 0,
    "callRate": 0,
    "overallQuality": "Information not provided."
  },
  "variants": [
    {
      "hgvs": "NM_000492.4:exon4:c.350G>A:p.Arg117His",
      "gene": "CFTR",
      "tier": "Tier 1",
      "zygosity": "het",
      "vaf": 0.601,
      "clinicalSignificance": "Likely Pathogenic",
      "inheritance": "Autosomal Recessive (Second hit required for typical CF presentation, or associated with CFTR-related disorders)",
      "frequency": "KFSH\_AF\_Strict: 3.17e-06",
      "acmgClassificationCode": [
        "PS3",
        "PM1",
        "PM2",
        "PP3"
      ],
      "description": "Pathogenic variant p.Arg117His, frequently associated with a milder form of Cystic Fibrosis (CF) or CFTR-related disorders (e.g., CBAVD), depending on the second CFTR allele. Seen in a compound heterozygous state with p.Trp1282Ter and p.Arg553Ter. This is a nonsynonymous SNV in an exonic region."
    },
    {
      "hgvs": "NM_000518.5:exon1:c.20A>T:p.Glu7Val",
      "gene": "HBB",
      "tier": "Tier 1",
      "zygosity": "hom",
      "vaf": 0.95,
      "clinicalSignificance": "Pathogenic",
      "inheritance": "Autosomal Recessive (Homozygous state causes Sickle Cell Anemia)",
      "frequency": "KFSH\_AF\_Strict: 7.4e-06",
      "acmgClassificationCode": [
        "PS3",
        "PS4",
        "PM2",
        "PP3"
      ],
      "description": "Pathogenic variant p.Glu7Val, also known as HbS. Homozygosity for this variant is the cause of Sickle Cell Anemia (OMIM #141900). This is a nonsynonymous SNV in an exonic region."
    },
    {
      "hgvs": "NM_007294.3:exon2:c.68_69delAG:p.Glu23Valfs*17",
      "gene": "BRCA1",
      "tier": "Tier 1",
      "zygosity": "het",
      "vaf": 0.349,
      "clinicalSignificance": "Pathogenic",
      "inheritance": "Autosomal Dominant (Associated with Hereditary Breast and Ovarian Cancer)",
      "frequency": "KFSH\_AF\_Strict: 4.12e-06",
      "acmgClassificationCode": [
        "PVS1",
        "PS4",
        "PM2"
      ],
      "description": "Pathogenic frameshift deletion c.68\_69delAG leading to p.Glu23Valfs*17. This results in a truncated protein and is a known cause of Hereditary Breast and Ovarian Cancer (OMIM #113705). This is an exonic frameshift deletion."
    },
    {
      "hgvs": "NM_000492.3:exon23:c.3846G>A:p.Trp1282Ter",
      "gene": "CFTR",
      "tier": "Tier 1",
      "zygosity": "het",
      "vaf": 0.63,
      "clinicalSignificance": "Pathogenic",
      "inheritance": "Autosomal Recessive (Second hit required for typical CF presentation)",
      "frequency": "KFSH\_AF\_Strict: 4.66e-06",
      "acmgClassificationCode": [
        "PVS1",
        "PS4",
        "PM2"
      ],
      "description": "Pathogenic stop-gain variant p.Trp1282Ter, a severe CF-causing mutation. Found in a compound heterozygous state with p.Arg117His and p.Arg553Ter. This is an exonic stop-gain SNV."
    },
    {
      "hgvs": "NM_000492.3:exon12:c.1657C>T:p.Arg553Ter",
      "gene": "CFTR",
      "tier": "Tier 1",
      "zygosity": "het",
      "vaf": 0.301,
      "clinicalSignificance": "Pathogenic",
      "inheritance": "Autosomal Recessive (Second hit required for typical CF presentation)",
      "frequency": "KFSH\_AF\_Strict: 2.15e-05",
      "acmgClassificationCode": [
        "PVS1",
        "PM2",
        "PP3"
      ],
      "description": "Pathogenic stop-gain variant p.Arg553Ter, a severe CF-causing mutation. Found in a compound heterozygous state with p.Arg117His and p.Trp1282Ter. This is an exonic stop-gain SNV."
    },
    {
      "hgvs": "NM_432883.4:exon5:c.803G>T:p.Asp1308Phe",
      "gene": "GCK",
      "tier": "Tier 2",
      "zygosity": "hom",
      "vaf": 0.282,
      "clinicalSignificance": "VUS",
      "inheritance": "Autosomal Dominant (Associated with MODY2)",
      "frequency": "KFSH\_AF\_Strict: 4.24e-06",
      "acmgClassificationCode": [
        "PM2 and/or PP3"
      ],
      "description": "VUS p.Asp1308Phe in the GCK gene, associated with MODY-related diabetes (MODY2). Interpretation is complicated by a homozygous call but low VAF and VUS classification. This is a nonsynonymous SNV in an exonic region."
    },
    {
      "hgvs": "NM_647100.8:exon22:c.3365C>G:p.Thr716Gly",
      "gene": "FTO",
      "tier": "Tier 3",
      "zygosity": "het",
      "vaf": 0.477,
      "clinicalSignificance": "Likely Benign",
      "inheritance": "Uncertain/Likely Autosomal Dominant (Risk factor for obesity/T2DM)",
      "frequency": "KFSH\_AF\_Strict: 6.84e-06",
      "acmgClassificationCode": [
        "BS1",
        "BP4"
      ],
      "description": "Likely Benign nonsynonymous SNV in FTO. Not clearly related to the primary clinical indication. This is an exonic nonsynonymous SNV."
    },
    {
      "hgvs": "NM_697961.1:exon26:c.387T>G:p.His120Phe",
      "gene": "MMP14",
      "tier": "Tier 3",
      "zygosity": "het",
      "vaf": 0.227,
      "clinicalSignificance": "Benign",
      "inheritance": "Uncertain (Associated with Connective tissue/bone)",
      "frequency": "KFSH\_AF\_Strict: 4.3e-07",
      "acmgClassificationCode": [
        "BA1",
        "BS1"
      ],
      "description": "Benign nonsynonymous SNV in MMP14. Not clearly related to the primary clinical indication. This is an exonic nonsynonymous SNV."
    },
    {
      "hgvs": "NM_150788.6:exon8:c.3376T>G:p.Tyr1011Pro",
      "gene": "ABCA1",
      "tier": "Tier 3",
      "zygosity": "het",
      "vaf": 0.565,
      "clinicalSignificance": "Benign",
      "inheritance": "Autosomal Recessive (Associated with Tangier disease)",
      "frequency": "KFSH\_AF\_Strict: 2.401e-05",
      "acmgClassificationCode": [
        "BA1",
        "BS1"
      ],
      "description": "Benign nonsynonymous SNV in ABCA1. Not clearly related to the primary clinical indication. This is an exonic nonsynonymous SNV."
    },
    {
      "hgvs": "NM_797233.8:exon8:c.2334T>A:p.Gln533Val",
      "gene": "BRCA1",
      "tier": "Tier 3",
      "zygosity": "hom",
      "vaf": 0.366,
      "clinicalSignificance": "Likely Benign",
      "inheritance": "Autosomal Dominant (Associated with Hereditary Breast and Ovarian Cancer)",
      "frequency": "KFSH\_AF\_Strict: 7.87e-06",
      "acmgClassificationCode": [
        "BS1",
        "BP4"
      ],
      "description": "Likely Benign nonsynonymous SNV in BRCA1. Not clearly related to the primary clinical indication. This is an exonic nonsynonymous SNV."
    },
    {
      "hgvs": "NM_273261.3:exon28:c.1659T>A:p.Thr41Glu",
      "gene": "SLC30A8",
      "tier": "Tier 3",
      "zygosity": "het",
      "vaf": 0.621,
      "clinicalSignificance": "VUS",
      "inheritance": "Uncertain",
      "frequency": "KFSH\_AF\_Strict: 7.07e-06",
      "acmgClassificationCode": [
        "PM2 and/or PP3"
      ],
      "description": "VUS p.Thr41Glu in SLC30A8. Filter status 'LowQual' suggests caution in interpretation. This is a nonsynonymous SNV in an exonic region."
    },
    {
      "hgvs": "NM_863350.1:exon26:c.3632G>T:p.Asn772Phe",
      "gene": "BRCA1",
      "tier": "Tier 3",
      "zygosity": "het",
      "vaf": 0.372,
      "clinicalSignificance": "Benign",
      "inheritance": "Autosomal Dominant (Associated with Hereditary Breast and Ovarian Cancer)",
      "frequency": "KFSH\_AF\_Strict: 1.287e-05",
      "acmgClassificationCode": [
        "BA1",
        "BS1"
      ],
      "description": "Benign nonsynonymous SNV in BRCA1. Not clearly related to the primary clinical indication. This is an exonic nonsynonymous SNV."
    },
    {
      "hgvs": "NM_763800.7:exon3:c.2497T>A:p.Phe934Cys",
      "gene": "HNF1A",
      "tier": "Tier 3",
      "zygosity": "hom",
      "vaf": 0.755,
      "clinicalSignificance": "Benign",
      "inheritance": "Autosomal Dominant (Associated with MODY3)",
      "frequency": "KFSH\_AF\_Strict: 1.038e-05",
      "acmgClassificationCode": [
        "BA1",
        "BS1"
      ],
      "description": "Benign nonsynonymous SNV in HNF1A. Not clearly related to the primary clinical indication. Note: This variant is on the Y chromosome, but the gene HNF1A is on chromosome 12, indicating a likely reference/annotation error in the input data regarding chromosome/gene mapping. Interpreting based on gene (HNF1A) and clinical significance (Benign). This is an exonic nonsynonymous SNV."
    },
    {
      "hgvs": "NM_333300.1:exon14:c.3817T>G:p.Tyr1009Glu",
      "gene": "BRCA2",
      "tier": "Tier 2",
      "zygosity": "het",
      "vaf": 0.521,
      "clinicalSignificance": "VUS",
      "inheritance": "Autosomal Dominant (Associated with Hereditary Breast and Ovarian Cancer)",
      "frequency": "KFSH\_AF\_Strict: 1.485e-05",
      "acmgClassificationCode": [
        "PM2 and/or PP3"
      ],
      "description": "VUS p.Tyr1009Glu in BRCA2. Further segregation or functional studies are recommended. This is a nonsynonymous SNV in an exonic region."
    },
    {
      "hgvs": "NM_394424.4:exon10:c.567T>G:p.Ser1019Asn",
      "gene": "RYR2",
      "tier": "Tier 3",
      "zygosity": "hom",
      "vaf": 0.611,
      "clinicalSignificance": "VUS",
      "inheritance": "Autosomal Dominant (Associated with Catecholaminergic polymorphic ventricular tachycardia)",
      "frequency": "KFSH\_AF\_Strict: 2.883e-05",
      "acmgClassificationCode": [
        "PM2 and/or PP3"
      ],
      "description": "VUS p.Ser1019Asn in RYR2. Not clearly related to the primary clinical indication. This is a nonsynonymous SNV in an exonic region."
    },
    {
      "hgvs": "NM_773423.8:exon19:c.3849A>G:p.Arg228Glu",
      "gene": "ABCA1",
      "tier": "Tier 3",
      "zygosity": "het",
      "vaf": 0.719,
      "clinicalSignificance": "Likely Benign",
      "inheritance": "Autosomal Recessive (Associated with Tangier disease)",
      "frequency": "KFSH\_AF\_Strict: 4.62e-06",
      "acmgClassificationCode": [
        "BS1",
        "BP4"
      ],
      "description": "Likely Benign nonsynonymous SNV in ABCA1. Not clearly related to the primary clinical indication. This is an exonic nonsynonymous SNV."
    },
    {
      "hgvs": "NM_974251.7:exon18:c.196G>A:p.Leu755Tyr",
      "gene": "FTO",
      "tier": "Tier 3",
      "zygosity": "het",
      "vaf": 0.656,
      "clinicalSignificance": "VUS",
      "inheritance": "Uncertain/Likely Autosomal Dominant (Risk factor for obesity/T2DM)",
      "frequency": "KFSH\_AF\_Strict: 1.477e-05",
      "acmgClassificationCode": [
        "PM2 and/or PP3"
      ],
      "description": "VUS p.Leu755Tyr in FTO. Not clearly related to the primary clinical indication. This is a nonsynonymous SNV in an exonic region."
    },
    {
      "hgvs": "NM_522155.7:exon8:c.228C>T:p.Asp670Glu",
      "gene": "PRKD2",
      "tier": "Tier 3",
      "zygosity": "het",
      "vaf": 0.267,
      "clinicalSignificance": "VUS",
      "inheritance": "Uncertain",
      "frequency": "KFSH\_AF\_Strict: 2.597e-05",
      "acmgClassificationCode": [
        "PM2",
        "PP3"
      ],
      "description": "VUS p.Asp670Glu in PRKD2. Not clearly related to the primary clinical indication. This is a nonsynonymous SNV in an exonic region."
    }
  ],
  "tieredAnalysis": {
    "summary": "This analysis identified four Pathogenic/Likely Pathogenic variants: one homozygous variant in **HBB** causing **Sickle Cell Anemia**, and three heterozygous variants in **CFTR** (p.Arg117His, p.Trp1282Ter, p.Arg553Ter) indicating a potential for **Cystic Fibrosis** or **CFTR-related disorder**, and one pathogenic variant in **BRCA1** (c.68\_69delAG) associated with **Hereditary Breast and Ovarian Cancer**. The CFTR variants are complex as the patient carries three pathogenic/likely pathogenic alleles. The variants in HBB, CFTR, and BRCA1 are classified as **Tier 1** due to their established pathogenicity and clinical relevance. Variants with VUS classification in GCK and BRCA2 are assigned to **Tier 2** for potential relevance. The remaining VUS/Likely Benign/Benign variants are in **Tier 3**.",
    "guidelines": [
      "ACMG/AMP Guidelines for Sequence Variant Interpretation",
      "ACMG/Cystic Fibrosis Carrier Screening Guidelines",
      "ACMG/Sickle Cell Disease Screening Guidelines"
    ]
  },
  "actionsOrders": {
    "actions": [
      {
        "title": "Clinical Confirmation",
        "description": "Confirm HBB (c.20A>T) and CFTR (c.350G>A, c.3846G>A, c.1657C>T) variants via Sanger sequencing, focusing on phase/linkage of the three CFTR variants, although the presence of three is highly unusual and warrants verification.",
        "status": "Recommended",
        "timeline": "Immediate"
      },
      {
        "title": "Hematology Consultation",
        "description": "Consultation with a Hematologist regarding the homozygous pathogenic HBB variant (HbS) for management of Sickle Cell Anemia.",
        "status": "Recommended",
        "timeline": "Immediate"
      },
      {
        "title": "Pulmonology/Gastroenterology Consultation",
        "description": "Consultation with a Pulmonologist/Gastroenterologist and CF specialist for evaluation and management of Cystic Fibrosis based on the CFTR genotype.",
        "status": "Recommended",
        "timeline": "Immediate"
      },
      {
        "title": "Oncology/Genetic Counseling",
        "description": "Referral to an Oncologist and Cancer Genetic Counselor for the pathogenic BRCA1 variant for risk assessment and potential surveillance/management planning for Hereditary Breast and Ovarian Cancer.",
        "status": "Recommended",
        "timeline": "Immediate"
      }
    ],
    "orders": [
      {
        "orderName": "Sanger Sequencing for HBB and CFTR Variants",
        "status": "Pending",
        "priority": "STAT",
        "testType": "Confirmatory Sequencing",
        "specimen": "Blood/DNA",
        "turnaround": "1-2 Weeks",
        "instructions": "Confirm HBB c.20A>T (p.Glu7Val), CFTR c.350G>A (p.Arg117His), c.3846G>A (p.Trp1282Ter), and c.1657C>T (p.Arg553Ter) and determine phase of CFTR alleles."
      },
      {
        "orderName": "Sickle Cell Solubility Test / Hemoglobin Electrophoresis",
        "status": "Pending",
        "priority": "STAT",
        "testType": "Functional Assay",
        "specimen": "Blood",
        "turnaround": "Few days",
        "instructions": "Confirm presence and quantity of HbS."
      }
    ],
    "recommendations": [
      "Aggressive clinical management for Sickle Cell Anemia, considering the homozygous HBB genotype.",
      "Comprehensive evaluation for Cystic Fibrosis, despite the unusual finding of three pathogenic CFTR alleles. Given the high frequency of p.Trp1282Ter in the region, the possibility of an underlying technical issue or complex genetic arrangement must be ruled out.",
      "Surveillance and risk management for Hereditary Breast and Ovarian Cancer due to the pathogenic BRCA1 variant."
    ],
    "followUp": "Re-evaluation of clinical symptoms in light of genetic findings. Genetic counseling for the patient and family is strongly recommended."
  },
  "patientSummaryEn": "Your genetic test results show several significant findings. The most critical is a change in the **HBB** gene, which confirms that you have **Sickle Cell Anemia**. This condition affects your red blood cells. You also have three separate changes in the **CFTR** gene, which is associated with **Cystic Fibrosis (CF)**. The presence of these three changes suggests a high risk for a form of CF or a related disorder. You also have a pathogenic change in the **BRCA1** gene, which increases your risk for **Hereditary Breast and Ovarian Cancer**. Immediate consultations with specialists (Hematologist for Sickle Cell, CF specialist, and Cancer Genetic Counselor) are highly recommended to confirm these results and begin planning for your medical care and risk management.",
  "patientSummaryAR": "تُظهر نتائج الاختبارات الجينية الخاصة بك العديد من النتائج الهامة. وأهمها هو التغير في جين **HBB**، الذي يؤكد إصابتك بمرض **فقر الدم المنجلي (Sickle Cell Anemia)**. يؤثر هذا المرض على خلايا الدم الحمراء لديك. كما لديك ثلاثة تغيرات منفصلة في جين **CFTR**، المرتبط بمرض **التليف الكيسي (Cystic Fibrosis - CF)**. يشير وجود هذه التغيرات الثلاثة إلى خطر كبير للإصابة بشكل من أشكال التليف الكيسي أو اضطراب مرتبط به. لديك أيضاً تغير ممرض في جين **BRCA1**، مما يزيد من خطر إصابتك بـ **سرطان الثدي والمبيض الوراثي**. يوصى بشدة بإجراء استشارات فورية مع أخصائيين (أخصائي أمراض الدم لفقر الدم المنجلي، وأخصائي التليف الكيسي، ومستشار وراثي للسرطان) لتأكيد هذه النتائج والبدء في التخطيط لرعايتك الطبية وإدارة المخاطر."
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
      component: <ClinicalContextSection data={reportData} />,
    },
    {
      id: "evidence",
      title: "Evidence Matrix & Quality Control",
      component: <EvidenceMatrixSection data={reportData} />,
    },
    {
      id: "variants",
      title: "Tiered Variant Analysis",
      count: reportData.variants?.length || 0,
      component: (
        <TieredVariantAnalysisSection
          data={reportData}
          onAddVariantAction={handleAddVariantAction}
        />
      ),
    },
    {
      id: "actions",
      title: "Actions & Orders",
      component: (
        <ActionsOrdersSection
          data={reportData}
          addedVariantActions={addedVariantActions}
          onRemoveVariantAction={handleRemoveVariantAction}
          onUpdateVariantAction={handleUpdateVariantAction}
        />
      ),
    },
    {
      id: "patient",
      title: "Patient Story",
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
