import React, { useState } from "react";
import { motion } from "framer-motion";
import { LanguageIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: "ltr" | "rtl";
}

interface LanguageToggleProps {
  className?: string;
  onLanguageChange?: (language: Language) => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className = "",
  onLanguageChange,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");
  const [isOpen, setIsOpen] = useState(false);

  const languages: Language[] = [
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇺🇸",
      direction: "ltr",
    },
    {
      code: "ar",
      name: "Arabic",
      nativeName: "العربية",
      flag: "🇸🇦",
      direction: "rtl",
    },
  ];

  const currentLang = languages.find((lang) => lang.code === currentLanguage)!;

  const handleLanguageSelect = (language: Language) => {
    setCurrentLanguage(language.code);
    setIsOpen(false);
    onLanguageChange?.(language);

    // Apply RTL/LTR direction to the document
    document.documentElement.dir = language.direction;
    document.documentElement.lang = language.code;
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Language Toggle Button */}
      <motion.button
        onClick={toggleDropdown}
        className="flex items-center gap-2 p-3 glass-card rounded-xl hover:bg-medical-glass/50 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <GlobeAltIcon className="w-5 h-5 text-medical-blue" />
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentLang.flag}</span>
          <span className="text-sm font-medium text-foreground">
            {currentLang.code.toUpperCase()}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-medical-blue"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      </motion.button>

      {/* Language Dropdown */}
      {isOpen && (
        <motion.div
          className="absolute top-full mt-2 right-0 w-64 glass-enhanced rounded-xl border border-medical-glass-border overflow-hidden z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="p-3 border-b border-medical-glass-border">
            <div className="flex items-center gap-2">
              <LanguageIcon className="w-4 h-4 text-medical-blue" />
              <span className="text-sm font-medium text-foreground">
                Select Language
              </span>
            </div>
          </div>

          {/* Language Options */}
          <div className="py-2">
            {languages.map((language) => (
              <motion.button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-medical-blue/10 transition-colors ${
                  currentLanguage === language.code
                    ? "bg-medical-blue/20 border-r-2 border-medical-blue"
                    : ""
                }`}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                {/* Flag */}
                <span className="text-2xl">{language.flag}</span>

                {/* Language Info */}
                <div
                  className={`flex-1 text-left ${
                    language.direction === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  <div className="text-sm font-medium text-foreground">
                    {language.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {language.nativeName}
                  </div>
                </div>

                {/* Direction Indicator */}
                <div className="text-xs text-medical-blue font-mono">
                  {language.direction.toUpperCase()}
                </div>

                {/* Selection Indicator */}
                {currentLanguage === language.code && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-medical-blue"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-medical-glass-border">
            <div className="text-xs text-muted-foreground text-center">
              Language changes apply to the entire interface
            </div>
          </div>
        </motion.div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Language Status Indicator */}
      <div className="absolute -top-1 -right-1">
        <motion.div
          className="w-3 h-3 rounded-full bg-medical-green"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Translation Animation */}
      {isOpen && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-medical-blue"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                x: [0, Math.random() * 20 - 10],
                y: [0, Math.random() * 20 - 10],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
