import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Dna,
  ExternalLink,
  Plus,
  ToggleLeft,
  ToggleRight,
  Info,
  Database,
  Target,
} from "lucide-react";

interface TieredVariantAnalysisSectionProps {
  data: any;
}

const ACMG_CRITERIA = [
  { code: "PVS1", type: "Very Strong", color: "destructive" },
  { code: "PS1", type: "Strong", color: "destructive" },
  { code: "PM1", type: "Moderate", color: "warning" },
  { code: "PM2", type: "Moderate", color: "warning" },
  { code: "PP3", type: "Supporting", color: "secondary" },
  { code: "PP4", type: "Supporting", color: "secondary" },
  { code: "BP1", type: "Supporting", color: "accent" },
  { code: "BS1", type: "Strong", color: "accent" },
];

function VariantCard({ variant, index }: { variant: any; index: number }) {
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>(
    variant.acmgClassification ? variant.acmgClassification.split(/[\s,]+/).filter((c: string) => c.match(/^[A-Z]+\d+$/)) : []
  );
  const [criteriaRationales, setCriteriaRationales] = useState<
    Record<string, string>
  >({});

  const toggleCriteria = (criteria: string) => {
    setSelectedCriteria((prev) =>
      prev.includes(criteria)
        ? prev.filter((c) => c !== criteria)
        : [...prev, criteria]
    );
  };

  const getTierClass = (tier: string) => {
    switch (tier?.replace("Tier ", "")) {
      case "1":
        return "border-red-300/50 bg-red-50/20";
      case "2":
        return "border-amber-300/50 bg-amber-50/20";
      case "3":
        return "border-blue-300/50 bg-blue-50/20";
      default:
        return "border-border";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier?.replace("Tier ", "")) {
      case "1":
        return "text-red-700";
      case "2":
        return "text-amber-700";
      case "3":
        return "text-blue-700";
      default:
        return "text-foreground";
    }
  };

  const getCallVariant = (call: string) => {
    if (call?.includes("Pathogenic")) return "destructive";
    if (call?.includes("VUS")) return "secondary";
    return "default";
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        delay: index * 0.05,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className={cn("p-6 border-2 shadow-sm", getTierClass(variant.tier))}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="text-xs font-mono bg-foreground text-background">
                  {variant.tier}
                </Badge>
                <div className={cn("flex items-center gap-2 text-lg font-semibold", getTierColor(variant.tier))}>
                  <Dna className="w-5 h-5" />
                  {variant.gene}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-mono text-muted-foreground">
                  {variant.hgvs || variant.variant || "Unknown variant"}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span>{variant.zygosity}</span>
                  <span>•</span>
                  <span>{variant.inheritance}</span>
                  {variant.clinicalSignificance && (
                    <>
                      <span>•</span>
                      <Badge
                        variant={getCallVariant(variant.clinicalSignificance)}
                        className="text-xs"
                      >
                        {variant.clinicalSignificance}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="w-4 h-4" />
              Add to Actions
            </Button>
          </div>

          {/* Impact */}
          {variant.description && (
            <div className="p-3 bg-secondary/50 rounded-lg">
              <p className="text-sm text-foreground font-medium">
                <Target className="w-4 h-4 inline mr-2 text-primary" />
                {variant.description}
              </p>
            </div>
          )}

          {/* ACMG Composer Inline */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Info className="w-4 h-4" />
              ACMG Classification Builder
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {ACMG_CRITERIA.map((criteria) => {
                const isSelected = selectedCriteria.includes(criteria.code);
                const hasRationale = criteriaRationales[criteria.code];

                return (
                  <Tooltip key={criteria.code}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleCriteria(criteria.code)}
                        className={cn(
                          "relative h-auto flex-col gap-1 p-2 text-xs",
                          isSelected && "ring-2 ring-primary/20"
                        )}
                      >
                        <div className="flex items-center gap-1">
                          {isSelected ? (
                            <ToggleRight className="w-3 h-3" />
                          ) : (
                            <ToggleLeft className="w-3 h-3" />
                          )}
                          <span className="font-mono text-xs">{criteria.code}</span>
                        </div>
                        <span className="text-xs opacity-75">
                          {criteria.type}
                        </span>
                        {hasRationale && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{criteria.type} Evidence</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Rationale textareas for selected criteria */}
            {selectedCriteria.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground">
                  Evidence Rationale
                </h5>
                {selectedCriteria.map((criteria) => (
                  <div key={criteria}>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      {criteria}
                    </label>
                    <Textarea
                      placeholder={`Rationale for ${criteria}...`}
                      value={criteriaRationales[criteria] || ""}
                      onChange={(e) =>
                        setCriteriaRationales((prev) => ({
                          ...prev,
                          [criteria]: e.target.value,
                        }))
                      }
                      className="text-sm min-h-[60px]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Evidence Drawer */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Database className="w-4 h-4 mr-2" />
                View Detailed Evidence
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <DrawerHeader>
                <DrawerTitle>
                  {variant.gene} • {variant.hgvs || variant.variant}
                </DrawerTitle>
              </DrawerHeader>
              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(80vh-100px)]">
                {/* Population Data */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    Population Frequency
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary/70 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-xs text-muted-foreground">gnomAD</div>
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <div className="font-mono text-sm text-primary">
                        {variant.frequency || "Rare"}
                      </div>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary/70 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-xs text-muted-foreground">ClinVar</div>
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <div className="font-mono text-sm text-primary">
                        {variant.clinicalSignificance || "Pathogenic"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* In-silico Prediction */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    In-silico Predictions
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-secondary/50 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground">CADD</div>
                      <div className="font-mono text-sm">28.4</div>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground">REVEL</div>
                      <div className="font-mono text-sm">0.78</div>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground">SpliceAI</div>
                      <div className="font-mono text-sm">0.92</div>
                    </div>
                  </div>
                </div>

                {/* Literature */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    Literature & Resources
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 border border-border rounded-lg hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <a
                          href={`https://pubmed.ncbi.nlm.nih.gov/12345678/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <span className="font-medium text-sm text-primary hover:text-primary/80">
                            PMID: 12345678
                          </span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </a>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Pathogenic variants in {variant.gene} associated with
                        clinical manifestations
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`https://www.omim.org/search/?index=entry&start=1&search=${variant.gene}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-border rounded text-center hover:bg-secondary/30 transition-colors"
                      >
                        <div className="text-xs text-muted-foreground">OMIM</div>
                        <div className="text-sm font-medium text-primary hover:text-primary/80">
                          Gene Info
                        </div>
                      </a>
                      <a
                        href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${variant.gene}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-border rounded text-center hover:bg-secondary/30 transition-colors"
                      >
                        <div className="text-xs text-muted-foreground">
                          GeneCards
                        </div>
                        <div className="text-sm font-medium text-primary hover:text-primary/80">
                          Summary
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </Card>
    </motion.div>
  );
}

export function TieredVariantAnalysisSection({
  data,
}: TieredVariantAnalysisSectionProps) {
  const variants = data?.variants || [];
  const tiered = data?.tieredAnalysis || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <div className="space-y-5">
      {/* Analysis Summary */}
      {tiered.summary && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 bg-blue-50/30 border border-blue-200/50">
            <h3 className="font-semibold text-blue-900 mb-3">
              Analysis Summary
            </h3>
            <p className="text-sm text-blue-800/80 leading-relaxed">
              {tiered.summary}
            </p>
          </Card>
        </motion.div>
      )}

      {/* Variant Cards */}
      {variants.length > 0 ? (
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {variants.map((variant: any, index: number) => (
            <VariantCard key={`${variant.gene}-${index}`} variant={variant} index={index} />
          ))}
        </motion.div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No variants found in analysis</p>
        </Card>
      )}

      {/* Interpretation Guidelines */}
      {tiered.guidelines && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6 border border-purple-200/50 bg-purple-50/30">
            <h3 className="font-semibold text-purple-900 mb-4">
              Interpretation Guidelines
            </h3>
            <div className="space-y-3 text-xs">
              {Array.isArray(tiered.guidelines) ? (
                tiered.guidelines.map((guideline: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
                    <span className="text-purple-900/80 leading-relaxed">
                      {guideline}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-purple-900/80 whitespace-pre-wrap leading-relaxed">
                  {tiered.guidelines}
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
