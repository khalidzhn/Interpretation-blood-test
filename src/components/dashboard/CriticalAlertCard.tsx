import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExclamationTriangleIcon,
  UserPlusIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface CriticalAlertCardProps {
  className?: string;
}

const CriticalAlertCard: React.FC<CriticalAlertCardProps> = ({
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`glass-enhanced rounded-xl border-2 border-medical-red/30 relative overflow-hidden ${className}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
            boxShadow: [
              "0 0 0 rgba(239, 68, 68, 0.3)",
              "0 0 20px rgba(239, 68, 68, 0.4)",
              "0 0 0 rgba(239, 68, 68, 0.3)",
            ],
          }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 0.3,
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {/* Pulsing border animation */}
          <div className="absolute inset-0 rounded-xl border-2 border-medical-red/50 animate-pulse" />

          {/* Header */}
          <div className="p-4 border-b border-medical-red/20 bg-medical-red/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-medical-red/20">
                  <ExclamationTriangleIcon className="w-5 h-5 text-medical-red" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-medical-green">
                    Auto-Booked Referral
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Appointment successfully scheduled
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 rounded-full hover:bg-medical-red/20 transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-muted-foreground hover:text-medical-red" />
              </button>
            </div>
          </div>

          {/* Referral Content */}
          <div className="p-4">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-base font-medium text-foreground">
                  🚨 Elevated Creatinine — Nephrology referral booked
                </h4>
                <div className="px-2 py-1 bg-medical-green/20 text-medical-green rounded-full text-xs font-medium flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-medical-green" />
                  Booked
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-3 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Appointment:</span>
                <span className="text-foreground font-medium">
                  04 July 2025 • 10:00 AM
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="text-foreground">
                  King Faisal Specialist Hospital, Clinic B
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Physician:</span>
                <span className="text-foreground">
                  Dr. A. Al-Qahtani (Nephrologist)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI Confidence:</span>
                <span className="text-medical-blue font-medium">96%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-medical-blue hover:bg-medical-blue/80 text-white rounded-lg text-sm font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <EyeIcon className="w-4 h-4" />
                View Referral Details
              </motion.button>
              <motion.button
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-medical-dark/50 hover:bg-medical-dark/70 text-foreground border border-medical-glass-border rounded-lg text-sm font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UserPlusIcon className="w-4 h-4" />
                Reschedule
              </motion.button>
            </div>
          </div>

          {/* Priority Indicator */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-medical-red" />

          {/* Timestamp */}
          <div className="px-4 pb-3">
            <p className="text-xs text-muted-foreground">
              Detected {new Date().toLocaleTimeString()} • AI Confidence: 96%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CriticalAlertCard;
