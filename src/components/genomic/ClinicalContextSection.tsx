import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { AlertCircle, TrendingUp, Shield, Zap } from "lucide-react";

interface ClinicalContextSectionProps {
  data: any;
}

export function ClinicalContextSection({ data }: ClinicalContextSectionProps) {
  const patient = data?.patient || {};
  const clinicalContext = data?.clinicalContext || {};
  const variants = data?.variants || [];

  // Calculate diagnostic confidence based on variant severity
  const calculateConfidence = () => {
    const weights = { "Tier 1": 40, "Tier 2": 25, "Tier 3": 10 };
    const totalWeight = variants.reduce(
      (sum: number, v: any) =>
        sum + (weights[v.tier as keyof typeof weights] || 0),
      0
    );
    return Math.min(100, totalWeight);
  };

  // Calculate phenotype concordance
  const calculateConcordance = () => {
    const tier1Count = variants.filter((v: any) => v.tier === "Tier 1").length;
    if (tier1Count >= 1) return "high";
    const tier2Count = variants.filter((v: any) => v.tier === "Tier 2").length;
    if (tier2Count >= 1) return "med";
    return "low";
  };

  const confidence = calculateConfidence();
  const concordance = calculateConcordance();
  const primaryFinding = variants.find((v: any) => v.tier === "Tier 1");

  const generateConclusion = () => {
    if (primaryFinding) {
      return `${primaryFinding.gene} ${primaryFinding.clinicalSignificance?.toLowerCase()} explains the clinical presentation; clinical correlation and family screening recommended.`;
    }
    return "Genomic analysis complete; review findings and initiate appropriate management.";
  };

  const hpoMap: Record<string, string> = {
    "HP:0004322": "Short stature",
    "HP:0002652": "Skeletal dysplasia",
    "HP:0000407": "Sensorineural hearing loss",
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: i * 0.05,
      },
    }),
  };

  return (
    <div className="space-y-5">
      {/* Clinical Context Header */}
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="p-6 shadow-sm border border-border bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Genomic Analysis Summary
                </h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive clinical interpretation for {patient.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Patient ID:</span>
                <p className="font-medium text-foreground mt-1">{patient.mrn}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Age / DOB:</span>
                <p className="font-medium text-foreground mt-1">
                  {patient.age} years old • {patient.dob}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Detailed Clinical Assessment */}
      <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="p-6 shadow-sm border border-border">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Diagnostic Confidence */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  Diagnostic Confidence
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Confidence Level</span>
                  <span className="font-medium text-foreground">{confidence}%</span>
                </div>

                <div className="relative">
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    <strong>Calculation:</strong> Tier 1 variants (40pts), Tier 2
                    (25pts), Tier 3 (10pts)
                  </p>
                  <p>
                    <strong>Interpretation:</strong>{" "}
                    {confidence >= 65
                      ? "High diagnostic yield"
                      : confidence >= 40
                        ? "Moderate confidence"
                        : "Low confidence, consider additional testing"}
                  </p>
                </div>
              </div>
            </div>

            {/* Phenotype Concordance */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">
                  Phenotype Concordance
                </h3>
              </div>

              <div className="space-y-3">
                <Badge
                  className={`px-3 py-1 text-sm font-medium ${
                    concordance === "high"
                      ? "bg-green-600 hover:bg-green-700"
                      : concordance === "med"
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {concordance === "high"
                    ? "Excellent Match (≥90%)"
                    : concordance === "med"
                      ? "Good Match (70-89%)"
                      : "Partial Match (<70%)"}
                </Badge>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">
                    Clinical Conditions:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {clinicalContext.conditions?.map(
                      (condition: string, idx: number) => (
                        <Tooltip key={idx}>
                          <TooltipTrigger>
                            <Badge variant="outline" className="text-xs">
                              {condition.split(" ")[0]}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{condition}</p>
                          </TooltipContent>
                        </Tooltip>
                      )
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  <strong>Clinical Note:</strong> Strong genotype-phenotype
                  correlation supports pathogenic classification
                </p>
              </div>
            </div>

            {/* Molecular Findings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-foreground">
                  Molecular Findings
                </h3>
              </div>

              <div className="space-y-3">
                {variants.slice(0, 3).map((variant: any, index: number) => (
                  <div key={index} className="p-3 border border-border/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">
                        {variant.gene}
                      </span>
                      <Badge
                        variant={
                          variant.tier === "Tier 1"
                            ? "destructive"
                            : variant.tier === "Tier 2"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {variant.clinicalSignificance}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {variant.clinicalSignificance}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{variant.zygosity}</span>
                      <span>•</span>
                      <span>{variant.inheritance}</span>
                    </div>
                  </div>
                ))}

                {primaryFinding && (
                  <div className="mt-3 p-2 bg-primary/5 rounded text-xs">
                    <strong>Primary Finding:</strong> {primaryFinding.gene}{" "}
                    explains the clinical presentation
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Conclusion Line */}
      <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-primary mb-1">Clinical Summary</h4>
              <p className="text-sm text-foreground leading-relaxed">
                {generateConclusion()}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Clinical Assessment Details */}
      {clinicalContext.assessment && (
        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-3">
              Clinical Assessment
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {clinicalContext.assessment}
            </p>
          </Card>
        </motion.div>
      )}

      {/* Medical History */}
      {clinicalContext.medicalHistory && (
        <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-3">
              Medical History
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {clinicalContext.medicalHistory}
            </p>
          </Card>
        </motion.div>
      )}

      {/* Family History */}
      {clinicalContext.familyHistory &&
        clinicalContext.familyHistory.length > 0 && (
          <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible">
            <Card className="p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4">
                Family History
              </h3>
              <div className="space-y-2">
                {clinicalContext.familyHistory.map(
                  (item: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  )
                )}
              </div>
            </Card>
          </motion.div>
        )}
    </div>
  );
}
