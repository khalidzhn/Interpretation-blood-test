import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Edit2,
  X,
  Trash2,
} from "lucide-react";

interface AddedVariantAction {
  variant: any;
  actionType: string;
  id: string;
}

interface ActionsOrdersSectionProps {
  data: any;
  addedVariantActions?: AddedVariantAction[];
  onRemoveVariantAction?: (actionId: string) => void;
  onUpdateVariantAction?: (actionId: string, newActionType: string) => void;
}

const TEST_OPTIONS = [
  { value: "sanger", label: "Sanger Sequencing" },
  { value: "blood-test", label: "Blood Test" },
  { value: "peripheral-blood", label: "Peripheral Blood Smear" },
  { value: "parental-testing", label: "Parental Testing" },
  { value: "hemoglobin", label: "Hemoglobin Electrophoresis" },
  { value: "counseling", label: "Genetic Counseling" },
  { value: "cancer-risk", label: "Cancer Risk Assessment" },
];

export function ActionsOrdersSection({
  data,
  addedVariantActions = [],
  onRemoveVariantAction,
  onUpdateVariantAction,
}: ActionsOrdersSectionProps) {
  const [isEditingActions, setIsEditingActions] = useState(false);
  const [reanalysisEnabled, setReanalysisEnabled] = useState(false);

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

  const getTestLabel = (value: string) => {
    return TEST_OPTIONS.find((opt) => opt.value === value)?.label || value;
  };

  let cardIndex = 0;

  return (
    <div className="space-y-6">
      {/* Added Variant Actions */}
      {addedVariantActions.length > 0 && (
        <motion.div custom={cardIndex++} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-primary" />
                Confirmatory Testing
              </h3>
              <Button
                size="sm"
                variant={isEditingActions ? "default" : "outline"}
                onClick={() => setIsEditingActions(!isEditingActions)}
                className="gap-2"
              >
                {isEditingActions ? (
                  <>
                    <Check className="w-4 h-4" />
                    Done
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-3">
              {addedVariantActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-medium text-foreground">
                        {action.variant.gene}
                      </span>
                      <span className="text-sm text-muted-foreground font-mono">
                        {action.variant.hgvs || action.variant.variant}
                      </span>
                    </div>
                    {isEditingActions ? (
                      <Select value={action.actionType} onValueChange={(value) => onUpdateVariantAction?.(action.id, value)}>
                        <SelectTrigger className="w-full md:w-64">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TEST_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {getTestLabel(action.actionType)}
                      </p>
                    )}
                  </div>

                  {isEditingActions && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveVariantAction?.(action.id)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

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
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Referral
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
          Create Tasks ({addedVariantActions.length})
        </Button>

        <Button variant="outline" size="sm" className="gap-2 ml-auto">
          <Copy className="w-4 h-4" />
          Copy Report
        </Button>
      </motion.div>
    </div>
  );
}
