import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SparklesIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/info" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Baseerah", href: "/info" },
        { label: "Careers", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    // Twitter/X - leave empty for now
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="border-t border-medical-glass-border mt-20 bg-gradient-to-t from-card/50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
          >
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-medical-blue to-medical-teal flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-medical-blue via-medical-teal to-medical-purple bg-clip-text text-transparent">
                  Baseerah
                </h3>
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerSections.map((section, idx) => (
              <motion.div key={idx} variants={itemVariants} className="flex flex-col gap-4">
                <h4 className="font-semibold text-foreground">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <motion.a
                        whileHover={{ x: 4 }}
                        onClick={(e) => {
                          if (link.href.startsWith("/")) {
                            e.preventDefault();
                            navigate(link.href);
                          }
                        }}
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-medical-blue transition-colors cursor-pointer"
                      >
                        {link.label}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Contact Section */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <h4 className="font-semibold text-foreground">Get In Touch</h4>
              <div className="space-y-3">
                <a
                  href="mailto:support@baseerah-ai.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-medical-blue transition-colors group"
                >
                  <EnvelopeIcon className="w-4 h-4 group-hover:text-medical-teal transition-colors" />
                  support@baseerah-ai.com
                </a>
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="pt-4 border-t border-medical-glass-border">
                  <p className="text-xs text-muted-foreground mb-3">Follow Us</p>
                  <div className="flex gap-3">
                    {socialLinks.map((social, idx) => (
                      <motion.a
                        key={idx}
                        whileHover={{ scale: 1.1 }}
                        href={social.url}
                        aria-label={social.label}
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-medical-glass-border/50 hover:bg-medical-blue/20 transition-colors"
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-medical-glass-border py-8 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Baseerah Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-medical-blue transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-medical-blue transition-colors">
              Terms of Service
            </a>
            <a href="/contact" className="hover:text-medical-blue transition-colors">
              Contact
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
