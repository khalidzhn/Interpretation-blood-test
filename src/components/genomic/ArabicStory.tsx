import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateStory, StoryConfig, StoryOutput } from "@/utils/StoryEngine";
import { motion } from "framer-motion";
import {
  Languages,
  GraduationCap,
  RotateCcw,
  Printer,
  Book,
  Sparkles,
} from "lucide-react";

interface ArabicStoryProps {
  data: any;
}

export function ArabicStory({ data }: ArabicStoryProps) {
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [level, setLevel] = useState<"child" | "adult">("adult");
  const [length, setLength] = useState<"short" | "standard">("standard");
  const [story, setStory] = useState<StoryOutput | null>(null);

  useEffect(() => {
    generateNewStory();
  }, [language, level, length, data]);

  const generateNewStory = () => {
    const config: StoryConfig = {
      data,
      language,
      level,
      length,
    };
    const newStory = generateStory(config);
    setStory(newStory);
  };

  const printPatientPage = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow && story) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="${language}" dir="${language === "ar" ? "rtl" : "ltr"}">
        <head>
          <meta charset="UTF-8">
          <title>Patient Story - ${data.patient?.name}</title>
          <style>
            body { 
              font-family: ${
                language === "ar"
                  ? "'IBM Plex Sans Arabic', sans-serif"
                  : "system-ui, sans-serif"
              };
              line-height: 1.8; 
              padding: 2rem;
              direction: ${language === "ar" ? "rtl" : "ltr"};
              text-align: ${language === "ar" ? "right" : "left"};
            }
            .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem; margin-bottom: 2rem; }
            .patient-name { font-size: 1.5rem; font-weight: bold; color: #1f2937; }
            .story-title { font-size: 1.25rem; font-weight: 600; color: #2563eb; margin: 2rem 0 1rem 0; }
            .paragraph { margin-bottom: 1.5rem; font-size: 1.1rem; }
            .highlights { background: #f0f9ff; padding: 1.5rem; border-radius: 0.5rem; margin-top: 2rem; }
            .highlight-item { margin-bottom: 0.75rem; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="patient-name">${data.patient?.name}</div>
            <div>MRN: ${data.patient?.mrn || "N/A"} | DOB: ${data.patient?.dob || "N/A"}</div>
          </div>
          
          <div class="story-title">${story.title}</div>
          
          ${story.paragraphs.map((p) => `<div class="paragraph">${p}</div>`).join("")}
          
          <div class="highlights">
            <h3>${language === "ar" ? "الخطوات التالية" : "Next Steps"}</h3>
            ${story.highlights.map((h) => `<div class="highlight-item">• ${h}</div>`).join("")}
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!story) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-secondary rounded w-3/4"></div>
        <div className="h-4 bg-secondary rounded w-1/2"></div>
        <div className="h-4 bg-secondary rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="glass-card rounded-lg border border-border p-5">
          <div className="flex flex-wrap items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-muted-foreground" />
              <div className="flex rounded-lg border border-border overflow-hidden">
                <Button
                  variant={language === "ar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLanguage("ar")}
                  className="rounded-none text-xs"
                >
                  العربية
                </Button>
                <Button
                  variant={language === "en" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLanguage("en")}
                  className="rounded-none text-xs"
                >
                  English
                </Button>
              </div>
            </div>

            {/* Reading Level */}
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <div className="flex rounded-lg border border-border overflow-hidden">
                <Button
                  variant={level === "child" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLevel("child")}
                  className="rounded-none text-xs"
                >
                  {language === "ar" ? "للأطفال" : "Child"}
                </Button>
                <Button
                  variant={level === "adult" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLevel("adult")}
                  className="rounded-none text-xs"
                >
                  {language === "ar" ? "للكبار" : "Adult"}
                </Button>
              </div>
            </div>

            {/* Length */}
            <div className="flex items-center gap-2">
              <Book className="w-4 h-4 text-muted-foreground" />
              <div className="flex rounded-lg border border-border overflow-hidden">
                <Button
                  variant={length === "short" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLength("short")}
                  className="rounded-none text-xs"
                >
                  {language === "ar" ? "مختصر" : "Short"}
                </Button>
                <Button
                  variant={length === "standard" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLength("standard")}
                  className="rounded-none text-xs"
                >
                  {language === "ar" ? "مفصل" : "Standard"}
                </Button>
              </div>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={generateNewStory}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-2" />
              {language === "ar" ? "إعادة إنشاء" : "Regenerate"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={printPatientPage}
              className="text-xs"
            >
              <Printer className="w-3 h-3 mr-2" />
              {language === "ar" ? "طباعة" : "Print"}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Story Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass-card rounded-lg border border-border p-8"
      >
        <div className={`space-y-6 ${language === "ar" ? "text-right" : ""}`}>
          {/* Title */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary mb-3 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              {story.title}
            </h2>
            <Badge variant="outline" className="text-xs">
              {language === "ar"
                ? `${level === "child" ? "للأطفال" : "للكبار"} • ${length === "short" ? "مختصر" : "مفصل"}`
                : `${level === "child" ? "Child" : "Adult"} Level • ${length === "short" ? "Short" : "Standard"}`}
            </Badge>
          </div>

          <Separator />

          {/* Story Paragraphs */}
          <div className="space-y-5">
            {story.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                className={`text-base leading-relaxed ${
                  language === "ar" ? "text-right" : "text-left"
                } text-foreground`}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Highlights */}
          {story.highlights.length > 0 && (
            <>
              <Separator />
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-accent mb-4">
                  {language === "ar" ? "الخطوات التالية" : "Next Steps"}
                </h3>
                <div className="space-y-3">
                  {story.highlights.map((highlight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.4 + index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm leading-relaxed text-foreground">
                        {highlight}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="text-center pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {language === "ar"
                ? "تم إنشاء هذا التقرير تلقائياً بناءً على نتائج الفحص الجيني"
                : "This story was automatically generated from your genetic test results"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
