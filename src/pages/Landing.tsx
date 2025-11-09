import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  SparklesIcon,
  HeartIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { ThemeToggleButton } from "@/components/Header";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const floatVariants = {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background dark:via-medical-dark text-foreground overflow-hidden">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-medical-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-medical-blue to-medical-teal flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-medical-blue via-medical-teal to-medical-purple bg-clip-text text-transparent">
              Baseerah
            </h1>
          </motion.div>

          <div className="flex items-center gap-4">
            <ThemeToggleButton />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-medical-blue to-medical-teal text-white font-semibold hover:shadow-lg hover:shadow-medical-blue/50 transition-all"
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-10 w-72 h-72 bg-gradient-radial from-medical-blue/20 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-40 left-10 w-96 h-96 bg-gradient-radial from-medical-purple/20 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-radial from-medical-teal/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center space-y-8"
          >
            <motion.h2
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight"
            >
              Transform Lab Results into{" "}
              <span className="bg-gradient-to-r from-medical-blue via-medical-teal to-medical-purple bg-clip-text text-transparent">
                Actionable Insights
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Baseerah revolutionizes healthcare by converting complex medical data into clear, 
              AI-powered insights. Bridging the gap between lab results and informed decisions.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-medical-blue to-medical-teal text-white font-bold text-lg hover:shadow-xl hover:shadow-medical-blue/50 transition-all flex items-center justify-center gap-2"
              >
                Launch Baseerah AI
                <ArrowRightIcon className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-lg border-2 border-medical-blue text-medical-blue font-bold text-lg hover:bg-medical-blue/10 transition-all"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Floating Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          >
            {[
              {
                icon: HeartIcon,
                title: "Patient Empowerment",
                description: "Millions in Saudi Arabia now understand their health",
                color: "from-medical-red",
              },
              {
                icon: LightBulbIcon,
                title: "Smart Detection",
                description: "AI detects health risks early for better outcomes",
                color: "from-medical-amber",
              },
              {
                icon: CheckCircleIcon,
                title: "Faster Decisions",
                description: "Guide users to the right care in minutes, not hours",
                color: "from-medical-green",
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                animate="float"
                whileHover={{ y: -10 }}
                className="relative"
              >
                <div className={`bg-gradient-to-br ${card.color} to-transparent/10 rounded-2xl p-8 border border-medical-glass-border backdrop-blur-xl h-full`}>
                  <card.icon className="w-12 h-12 mb-4 text-foreground" />
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-muted-foreground">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50 border-y border-medical-glass-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold">Our Mission</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                <strong>Baseerah aims to revolutionize healthcare</strong> by transforming lab results 
                into clear, actionable insights using AI-powered technology.
              </p>
              <p>
                Millions in Saudi Arabia receive lab reports they can't interpret, leading to delayed 
                diagnoses and unnecessary hospital visits, while overwhelmed clinics struggle to 
                manage patient flow.
              </p>
              <p>
                <strong>Baseerah converts medical data, detects health risks early, and guides users 
                to the right care</strong>, bridging the gap between lab results and informed decisions.
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-medical-blue via-medical-teal to-medical-purple bg-clip-text text-transparent">
                Smarter insights. Faster decisions. A healthier future with Baseerah.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Goals Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Vision & Goals
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "2025-2026: Foundation & Growth",
                goals: [
                  "Establish market leadership in healthcare AI diagnostics",
                  "Achieve 100,000+ active users across Saudi Arabia",
                  "Partner with 50+ hospitals and diagnostic centers",
                  "Develop multi-language support for region expansion",
                ],
              },
              {
                title: "2027-2030: Regional Expansion",
                goals: [
                  "Expand to UAE, Egypt, and rest of Middle East",
                  "Integrate with major healthcare systems and EHR platforms",
                  "Launch specialized modules for different medical specialties",
                  "Achieve 1M+ lives impacted across the region",
                ],
              },
            ].map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-card/80 rounded-2xl p-8 border border-medical-glass-border backdrop-blur-xl"
              >
                <h3 className="text-2xl font-bold mb-6 text-medical-blue">{section.title}</h3>
                <ul className="space-y-4">
                  {section.goals.map((goal, goalIdx) => (
                    <motion.li
                      key={goalIdx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: goalIdx * 0.1 }}
                      viewport={{ once: true }}
                      className="flex gap-3 items-start"
                    >
                      <CheckCircleIcon className="w-5 h-5 text-medical-teal flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">{goal}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50 border-y border-medical-glass-border">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Our Products
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative max-w-2xl mx-auto"
          >
            {/* Product Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative group cursor-pointer"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-medical-blue via-medical-teal to-medical-purple rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition-opacity duration-300" />

              {/* Card Content */}
              <div className="relative bg-gradient-to-br from-card to-card/80 rounded-2xl p-12 border border-medical-glass-border backdrop-blur-xl overflow-hidden">
                {/* Animated Background Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-medical-blue/30 to-transparent rounded-full blur-3xl -mr-48 -mt-48"
                />

                <div className="relative z-10 text-center space-y-6">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex justify-center"
                  >
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-medical-blue to-medical-teal flex items-center justify-center shadow-lg shadow-medical-blue/50">
                      <SparklesIcon className="w-12 h-12 text-white" />
                    </div>
                  </motion.div>

                  <div>
                    <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-medical-blue via-medical-teal to-medical-purple bg-clip-text text-transparent">
                      Baseerah AI
                    </h3>
                    <p className="text-medical-blue font-semibold text-lg">Healthcare Intelligence Platform</p>
                  </div>

                  <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
                    Transform complex lab results into clear, AI-powered insights. Make faster, 
                    more informed healthcare decisions with our intelligent analysis platform.
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/login")}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-medical-blue to-medical-teal text-white font-bold text-lg hover:shadow-xl hover:shadow-medical-blue/50 transition-all"
                  >
                    Access Baseerah AI
                    <ArrowRightIcon className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-12 text-center"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">About Baseerah Technologies</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded in <strong>2025</strong>, Baseerah Technologies is at the forefront of AI-driven 
                healthcare innovation. We're committed to making healthcare more accessible, intelligent, 
                and responsive to patient needs across the Middle East and beyond.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                { label: "Founded", value: "2025" },
                { label: "Focus", value: "Healthcare AI" },
                { label: "Mission", value: "Smarter Health" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <p className="text-3xl font-bold text-medical-blue">{stat.value}</p>
                  <p className="text-muted-foreground text-lg">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-medical-blue/10 via-medical-teal/10 to-medical-purple/10 border-t border-medical-glass-border">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold"
          >
            Ready to Transform Healthcare?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground"
          >
            Join thousands of patients and healthcare providers already using Baseerah AI
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 px-10 py-5 rounded-lg bg-gradient-to-r from-medical-blue to-medical-teal text-white font-bold text-lg hover:shadow-2xl hover:shadow-medical-blue/50 transition-all"
          >
            Get Started Now
            <ArrowRightIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-medical-glass-border py-12 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-medical-blue to-medical-teal flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Baseerah Technologies. All rights reserved.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Transforming Healthcare with AI-Powered Insights
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
