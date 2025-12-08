import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background dark:via-medical-dark text-foreground flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <motion.h1
            className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-medical-blue via-medical-teal to-medical-purple bg-clip-text text-transparent"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            404
          </motion.h1>
          <div className="space-y-2">
            <p className="text-2xl md:text-3xl font-bold">Page Not Found</p>
            <p className="text-muted-foreground text-lg">
              Sorry, the page you're looking for doesn't exist.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-medical-blue to-medical-teal text-white font-bold text-lg hover:shadow-xl hover:shadow-medical-blue/50 transition-all"
          >
            Return to Home
          </motion.button>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
