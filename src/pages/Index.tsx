import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import FileUploadZone from "@/components/dashboard/FileUploadZone";
import MultiPatientOverview from "@/components/dashboard/MultiPatientOverview";

import CriticalAlertCard from "@/components/dashboard/CriticalAlertCard";
import SummaryMetrics from "@/components/dashboard/SummaryMetrics";
import ChatInterface from "@/components/dashboard/ChatInterface";

const Index = () => {
  const [isChatMinimized, setIsChatMinimized] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFileUpload = (files: File[]) => {
    console.log("Files uploaded:", files);
  };
  const handleUploadComplete = () => {
    setRefreshKey((k) => k + 1);
  };

  const toggleChat = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="text-center py-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Instant AI Clarity for Every Lab Report
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload. Interpret. Act. — in under 2 minutes.
          </p>
        </motion.div>

        {/* Summary Metrics Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SummaryMetrics />
        </motion.div>

        {/* Main Content Grid - 12 Column Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - 8 columns */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* File Upload Section */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Upload Lab Report
                </h2>
                <p className="text-sm text-muted-foreground">
                  AI-powered analysis starts the moment you upload your medical
                  data
                </p>
              </div>
              <FileUploadZone
                onFileUpload={handleFileUpload}
                onUploadComplete={handleUploadComplete} // <-- Add this prop
                acceptedFormats={[".pdf", ".csv"]}
                maxSize={10 * 1024 * 1024} // 10MB
              />
            </motion.div>

            {/* Multi-Patient Intelligence Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <MultiPatientOverview key={refreshKey} />
            </motion.div>
          </div>

          {/* Right Column - 4 columns */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {/* Critical Alert Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <CriticalAlertCard />
            </motion.div>

            {/* AI Processing Status */}
            <motion.div
              className="glass-enhanced rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">
                AI Processing Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Neural Models
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-medical-green animate-pulse" />
                    <span className="text-sm text-medical-green font-medium">
                      Active
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Processing Queue
                  </span>
                  <span className="text-sm text-foreground font-mono">
                    0 pending
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Analysis
                  </span>
                  <span className="text-sm text-foreground">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="glass-enhanced rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg bg-medical-blue/10 hover:bg-medical-blue/20 transition-colors">
                  <div className="text-sm font-medium text-medical-blue">
                    Generate Report
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Create patient summary
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-medical-teal/10 hover:bg-medical-teal/20 transition-colors">
                  <div className="text-sm font-medium text-medical-teal">
                    View History
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Previous analyses
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-medical-amber/10 hover:bg-medical-amber/20 transition-colors">
                  <div className="text-sm font-medium text-medical-amber">
                    Export Data
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Download results
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 glass-card rounded-full">
            <span className="text-xs text-muted-foreground">
              HIPAA • SFDA SaMD Ready
            </span>
          </div>
        </motion.div>

        {/* Hidden improvement annotations (not visible to end-users) */}
        <div style={{ display: "none" }}>
          {/* FUTURE ENHANCEMENTS:
          - Add trend-line spark charts beside each lab value once longitudinal data exists
          - Surface patient-specific lifestyle tips fed by knowledge base v2
          - Integrate in-app chat with referral clinic for real-time confirmations
          - Provide one-click WhatsApp share of the Patient-Friendly Summary */}
        </div>
      </div>

      {/* Floating Chat Interface */}
      <ChatInterface
        isMinimized={isChatMinimized}
        onToggle={toggleChat}
        className={
          isChatMinimized
            ? "fixed bottom-4 right-4 z-50"
            : "fixed bottom-4 right-4 w-96 z-50"
        }
      />
    </DashboardLayout>
  );
};

export default Index;
