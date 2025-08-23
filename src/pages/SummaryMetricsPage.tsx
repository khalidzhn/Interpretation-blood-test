import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import SummaryMetrics from "@/components/dashboard/SummaryMetrics";

const SummaryMetricsPage: React.FC = () => (
  <DashboardLayout>
    <div className="max-w-7xl mx-auto py-10">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <SummaryMetrics />
      </motion.div>
    </div>
  </DashboardLayout>
);

export default SummaryMetricsPage;