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
  Check,
  Info,
  Database,
  ChevronDown,
} from "lucide-react";

interface TieredVariantAnalysisSectionProps {
  data: any;
  onAddVariantAction?: (variant: any) => void;
  addedVariants?: Set<string>;
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

interface VariantCardProps {
  variant: any;
  index: number;
  onAddToActions?: (variant: any) => void;
  isAdded?: boolean;
}

function VariantCard({ variant, index, onAddToActions, isAdded = false }: VariantCardProps) {
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

  const handleToggleVariant = () => {
    if (onAddToActions) {
      onAddToActions(variant);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="p-6 border shadow-sm">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
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
          </div>

          {/* ACMG Classification as List */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Info className="w-4 h-4" />
              ACMG Classification Codes
            </h4>
            <div className="flex flex-wrap gap-2">
              {variant.acmgClassificationCode && variant.acmgClassificationCode.length > 0 ? (
                variant.acmgClassificationCode.map((code: string) => (
                  <Badge key={code} variant="outline" className="font-mono">
                    {code}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No classification codes</span>
              )}
            </div>
          </div>

          {/* Add to Actions & Orders Button */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isAdded ? "default" : "default"}
              className={cn(
                "gap-2 font-medium",
                isAdded
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
              )}
              onClick={handleToggleVariant}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add to Actions & Orders
                </>
              )}
            </Button>
          </div>

        </div>
      </Card>
    </motion.div>
  );
}

interface TieredVariantAnalysisSectionProps {
  data: any;
  onAddVariantAction?: (variant: any) => void;
  addedVariants?: Set<string>;
}

export function TieredVariantAnalysisSection({
  data,
  onAddVariantAction,
  addedVariants = new Set(),
}: TieredVariantAnalysisSectionProps) {
  const variants = data?.variants || [];
  const tiered = data?.tieredAnalysis || {};

  const getVariantKey = (variant: any) => {
    return `${variant.gene}-${variant.hgvs || variant.variant}`;
  };

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
          {variants.map((variant: any, index: number) => {
            const variantKey = getVariantKey(variant);
            const isAdded = addedVariants.has(variantKey);
            
            return (
              <VariantCard
                key={`${variant.gene}-${index}`}
                variant={variant}
                index={index}
                onAddToActions={onAddVariantAction}
                isAdded={isAdded}
              />
            );
          })}
        </motion.div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No variants found in analysis</p>
        </Card>
      )}
    </div>
  );
}
