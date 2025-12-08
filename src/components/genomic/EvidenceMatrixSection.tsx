import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface EvidenceMatrixSectionProps {
  data: any;
}

export function EvidenceMatrixSection({ data }: EvidenceMatrixSectionProps) {
  const evidence = data?.evidenceMatrix || {};
  const qualityControl = data?.qualityControl || {};

  const getQualityBadge = (level: string) => {
    switch (level?.toLowerCase()) {
      case "high":
        return (
          <Badge className="bg-green-600 hover:bg-green-700 text-xs">High Quality</Badge>
        );
      case "medium":
        return (
          <Badge className="bg-amber-600 hover:bg-amber-700 text-xs">Medium Quality</Badge>
        );
      case "low":
        return (
          <Badge className="bg-red-600 hover:bg-red-700 text-xs">Low Quality</Badge>
        );
      default:
        return <Badge variant="outline" className="text-xs">Unknown</Badge>;
    }
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
      {/* Quality Control Metrics */}
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
        <div className="glass-card rounded-lg border border-border p-5 hover:border-primary/30 transition-colors">
          <h3 className="font-semibold text-foreground mb-5 flex items-center gap-2">
            <span className="text-lg">📊</span> Quality Control Metrics
          </h3>
          <div className="space-y-5">
            {qualityControl.coverage !== undefined && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">Coverage</span>
                  <span className="text-sm font-semibold text-primary">
                    {qualityControl.coverage}x
                  </span>
                </div>
                <Progress value={Math.min((qualityControl.coverage / 100) * 100, 100)} className="h-2" />
              </div>
            )}

            {qualityControl.mappingQuality !== undefined && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">Mapping Quality</span>
                  <span className="text-sm font-semibold text-primary">
                    {qualityControl.mappingQuality}%
                  </span>
                </div>
                <Progress value={qualityControl.mappingQuality} className="h-2" />
              </div>
            )}

            {qualityControl.depthUniformity !== undefined && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">Depth Uniformity</span>
                  <span className="text-sm font-semibold text-primary">
                    {qualityControl.depthUniformity}%
                  </span>
                </div>
                <Progress value={qualityControl.depthUniformity} className="h-2" />
              </div>
            )}

            {qualityControl.callRate !== undefined && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">Call Rate</span>
                  <span className="text-sm font-semibold text-primary">
                    {qualityControl.callRate}%
                  </span>
                </div>
                <Progress value={qualityControl.callRate} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Evidence Levels */}
      {evidence.levels && evidence.levels.length > 0 && (
        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
          <div className="glass-card rounded-lg border border-border p-5 hover:border-primary/30 transition-colors">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="text-lg">📋</span> Evidence Classification
            </h3>
            <div className="space-y-3">
              {evidence.levels.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/40 border border-border hover:bg-muted/60 transition-colors"
                >
                  <div className="pt-1 flex-shrink-0">
                    {item.status === "confirmed" && (
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    )}
                    {item.status === "pending" && (
                      <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
                    )}
                    {item.status === "rejected" && (
                      <XCircleIcon className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-medium text-foreground">{item.name}</span>
                      {getQualityBadge(item.quality)}
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Reference Information */}
      {evidence.references && evidence.references.length > 0 && (
        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
          <div className="glass-card rounded-lg border border-border p-5 hover:border-primary/30 transition-colors">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="text-lg">📚</span> Scientific References
            </h3>
            <div className="space-y-2">
              {evidence.references.map((ref: string, index: number) => (
                <a
                  key={index}
                  href={`https://pubmed.ncbi.nlm.nih.gov/${ref}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded hover:bg-primary/10 transition-colors text-sm text-primary hover:text-primary/80"
                >
                  <span>→</span>
                  <span className="font-mono">PMID: {ref}</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Overall Quality Summary */}
      {qualityControl.overallQuality && (
        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
          <div className="glass-card rounded-lg border border-green-200/50 bg-green-50/30 p-5 hover:border-green-300/50 transition-colors">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <span className="text-lg">✅</span> Quality Assessment Summary
            </h3>
            <p className="text-sm text-green-800/80 leading-relaxed">
              {qualityControl.overallQuality}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
