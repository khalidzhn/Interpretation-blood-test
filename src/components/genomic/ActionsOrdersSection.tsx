import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import {
  FlaskConical,
  UserCheck,
  RotateCcw,
  Copy,
  Printer,
  Plus,
  Check,
  Clock,
} from "lucide-react";

interface ActionsOrdersSectionProps {
  data: any;
}

export function ActionsOrdersSection({ data }: ActionsOrdersSectionProps) {
  const variants = data?.variants || [];
  const [confirmatory, setConfirmatory] = useState<Map<string, boolean>>(
    new Map()
  );
  const [referrals, setReferrals] = useState<Map<string, boolean>>(new Map());
  const [reanalysisEnabled, setReanalysisEnabled] = useState(false);

  const toggleConfirmatory = (gene: string) => {
    const newMap = new Map(confirmatory);
    newMap.set(gene, !newMap.get(gene));
    setConfirmatory(newMap);
  };

  const toggleReferral = (type: string) => {
    const newMap = new Map(referrals);
    newMap.set(type, !newMap.get(type));
    setReferrals(newMap);
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

  const pathogenicVariants = variants.filter(
    (v: any) => v.tier === "Tier 1" || v.tier === "Tier 2"
  );

  let cardIndex = 0;

  return (
    <div className="space-y-6">
      {/* Auto-generated Checklists */}
      <motion.div custom={cardIndex++} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" />
            Confirmatory Testing
          </h3>

          <div className="space-y-4">
            {pathogenicVariants.length > 0 ? (
              pathogenicVariants.map((variant: any) => (
                <div
                  key={variant.gene}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={
                          variant.tier === "Tier 1" ? "destructive" : "default"
                        }
                        className="text-xs"
                      >
                        {variant.tier}
                      </Badge>
                      <span className="font-medium text-foreground">
                        {variant.gene}
                      </span>
                      <span className="text-sm text-muted-foreground font-mono">
                        {variant.hgvs || variant.variant}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sanger sequencing confirmation recommended
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => toggleConfirmatory(variant.gene)}
                    variant={confirmatory.get(variant.gene) ? "default" : "outline"}
                    className="gap-2"
                  >
                    {confirmatory.get(variant.gene) ? (
                      <>
                        <Check className="w-4 h-4" /> Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Add Sanger
                      </>
                    )}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No pathogenic variants found requiring confirmatory testing</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Referrals */}
      <motion.div custom={cardIndex++} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-accent" />
            Specialist Referrals
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                type: "cardiology",
                label: "Cardiology",
                icon: "🫀",
                indication: "Cardiac assessment & risk stratification",
              },
              {
                type: "genetics",
                label: "Genetics Counseling",
                icon: "🧬",
                indication: "Family counseling & cascade testing",
              },
              {
                type: "imaging",
                label: "Advanced Imaging",
                icon: "🖼️",
                indication: "Cardiac MRI & functional assessment",
              },
            ].map((referral) => (
              <div
                key={referral.type}
                className="p-4 border border-border rounded-lg space-y-3 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{referral.icon}</span>
                  <div>
                    <h4 className="font-medium text-foreground">
                      {referral.label}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {referral.indication}
                    </p>
                  </div>
                </div>

                <Input placeholder="Quick notes..." className="text-sm" />

                <Button
                  size="sm"
                  variant={referrals.get(referral.type) ? "default" : "outline"}
                  className="w-full gap-2"
                  onClick={() => toggleReferral(referral.type)}
                >
                  {referrals.get(referral.type) ? (
                    <>
                      <Check className="w-4 h-4" /> Added
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Add Referral
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Re-analysis */}
      <motion.div custom={cardIndex++} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              Re-analysis Schedule
            </h3>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Enable 12-month re-analysis
              </span>
              <Switch
                checked={reanalysisEnabled}
                onCheckedChange={setReanalysisEnabled}
              />
            </div>
          </div>

          {reanalysisEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="font-medium text-amber-900">
                  Re-analysis Scheduled
                </span>
              </div>
              <p className="text-sm text-amber-800/80 mb-3">
                Automatic review in 12 months to check for new evidence and
                updated classifications. This ensures that any variants of
                uncertain significance can be reclassified as evidence evolves.
              </p>
              <Textarea
                placeholder="Additional re-analysis notes or specific areas of focus..."
                className="text-sm"
                rows={3}
              />
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Recommendations Section */}
      {data?.actionsOrders?.recommendations && (
        <motion.div custom={cardIndex++} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="p-6 border border-blue-200/50 bg-blue-50/30">
            <h3 className="font-semibold text-blue-900 mb-4">
              Clinical Recommendations
            </h3>
            <div className="space-y-3 text-sm">
              {Array.isArray(data.actionsOrders.recommendations) ? (
                data.actionsOrders.recommendations.map(
                  (rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                      <span className="text-blue-900/80 leading-relaxed">{rec}</span>
                    </div>
                  )
                )
              ) : (
                <p className="text-blue-900/80 whitespace-pre-wrap leading-relaxed">
                  {data.actionsOrders.recommendations}
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Follow-up Plan */}
      {data?.actionsOrders?.followUp && (
        <motion.div custom={cardIndex++} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="p-6 border border-green-200/50 bg-green-50/30">
            <h3 className="font-semibold text-green-900 mb-3">Follow-up Plan</h3>
            <p className="text-sm text-green-800/80 whitespace-pre-wrap leading-relaxed">
              {data.actionsOrders.followUp}
            </p>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div custom={cardIndex} variants={cardVariants} initial="hidden" animate="visible" className="flex items-center gap-3 flex-wrap">
        <Button variant="outline" size="sm" className="gap-2">
          <Printer className="w-4 h-4" />
          Print Orders
        </Button>

        <Button
          className="bg-primary hover:bg-primary/90 gap-2"
          size="sm"
        >
          Create Tasks (
          {confirmatory.size + referrals.size + (reanalysisEnabled ? 1 : 0)})
        </Button>

        <Button variant="outline" size="sm" className="gap-2 ml-auto">
          <Copy className="w-4 h-4" />
          Copy Report
        </Button>
      </motion.div>
    </div>
  );
}
