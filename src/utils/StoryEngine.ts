export interface StoryConfig {
  data: any;
  language: "ar" | "en";
  level: "child" | "adult";
  length: "short" | "standard";
}

export interface StoryOutput {
  title: string;
  paragraphs: string[];
  highlights: string[];
}

function generateEnglishStory(
  data: any,
  level: "child" | "adult",
  length: "short" | "standard"
): StoryOutput {
  const patientName = data?.patient?.name || "Patient";
  const age = data?.patient?.age || "unknown age";
  const conditions = data?.clinicalContext?.conditions || [];
  const variants = data?.variants || [];

  const isChild = level === "child";
  const isShort = length === "short";

  let title = isChild
    ? `${patientName}'s Genetic Health Journey`
    : `Understanding ${patientName}'s Genetic Health`;

  const paragraphs: string[] = [];

  // Opening paragraph
  if (isChild) {
    paragraphs.push(
      `Hello! Let me tell you about ${patientName}'s genes and what they mean for health. Our genes are like instructions in our body that tell it how to work.`
    );
  } else {
    paragraphs.push(
      `This report provides a comprehensive overview of ${patientName}'s genetic profile and what it means for their health management. Genetic testing helps us understand inherited predispositions and make informed healthcare decisions.`
    );
  }

  // Clinical context paragraph
  if (conditions.length > 0) {
    const conditionText = conditions.join(", ");
    if (isChild) {
      paragraphs.push(
        `${patientName} has been evaluated for ${conditionText}. These are conditions that can sometimes run in families.`
      );
    } else {
      paragraphs.push(
        `The clinical evaluation indicates assessment for ${conditionText}. Understanding genetic factors helps personalize treatment approaches.`
      );
    }
  }

  // Variants paragraph
  if (variants.length > 0) {
    const variantCount = variants.length;
    if (isChild) {
      paragraphs.push(
        `We found ${variantCount} important ${variantCount === 1 ? "change" : "changes"} in ${patientName}'s genes that doctors should know about.`
      );
    } else {
      paragraphs.push(
        `The analysis identified ${variantCount} significant genetic variant${variantCount === 1 ? "" : "s"} with clinical relevance. These findings should guide therapeutic and preventive strategies.`
      );
    }
  }

  // Closing paragraph
  if (!isShort) {
    if (isChild) {
      paragraphs.push(
        `The good news is that doctors can now use this information to help ${patientName} stay as healthy as possible. Regular check-ups and following doctor's advice will help keep ${patientName} well.`
      );
    } else {
      paragraphs.push(
        `This genetic information provides valuable insights for personalized medical management. It's important to discuss these findings with healthcare providers to develop an appropriate care plan.`
      );
    }
  }

  const highlights: string[] = [];

  if (isChild) {
    highlights.push("See your doctor regularly for check-ups");
    if (variants.length > 0) {
      highlights.push(`Tell your doctor about the ${variants.length} genetic finding${variants.length === 1 ? "" : "s"}`);
    }
    highlights.push("Ask questions about what these genes mean");
    highlights.push("Learn about staying healthy");
  } else {
    highlights.push("Schedule comprehensive review with genetic counselor");
    if (variants.length > 0) {
      highlights.push(`Review the ${variants.length} identified variant${variants.length === 1 ? "" : "s"} with your physician`);
    }
    highlights.push("Develop personalized care plan based on findings");
    highlights.push("Consider cascade testing if indicated for family members");
  }

  return { title, paragraphs, highlights };
}

function generateArabicStory(
  data: any,
  level: "child" | "adult",
  length: "short" | "standard"
): StoryOutput {
  const patientName = data?.patient?.name || "المريض";
  const conditions = data?.clinicalContext?.conditions || [];
  const variants = data?.variants || [];

  const isChild = level === "child";
  const isShort = length === "short";

  let title = isChild
    ? `رحلة ${patientName} الصحية الجينية`
    : `فهم الملف الجيني لـ ${patientName}`;

  const paragraphs: string[] = [];

  // Opening paragraph
  if (isChild) {
    paragraphs.push(
      `مرحباً! دعني أخبرك عن الجينات لدى ${patientName} وما تعني لصحته. جيناتنا مثل التعليمات في أجسامنا التي تخبر الجسم بكيفية العمل.`
    );
  } else {
    paragraphs.push(
      `يوفر هذا التقرير نظرة ش��ملة على الملف الجيني لـ ${patientName} وما يعنيه لإدارة صحته. يساعدنا الاختبار الجيني على فهم الاستعدادات الوراثية واتخاذ قرارات صحية مستنيرة.`
    );
  }

  // Clinical context paragraph
  if (conditions.length > 0) {
    const conditionText = conditions.join("، ");
    if (isChild) {
      paragraphs.push(
        `تم تقييم ${patientName} لـ ${conditionText}. هذه حالات قد تسري أحياناً في العائلات.`
      );
    } else {
      paragraphs.push(
        `يشير التقييم السريري إلى تقييم لـ ${conditionText}. يساعد فهم العوامل الوراثية على تخصيص نهج العلاج.`
      );
    }
  }

  // Variants paragraph
  if (variants.length > 0) {
    const variantCount = variants.length;
    if (isChild) {
      paragraphs.push(
        `وجدنا ${variantCount} تغيير${variantCount === 1 ? "" : "ات"} مهم${variantCount === 1 ? "ة" : "ة"} في جينات ${patientName} يجب أن يعرفها الأطباء.`
      );
    } else {
      paragraphs.push(
        `حددت التحليلات ${variantCount} متغير${variantCount === 1 ? "" : "ات"} وراثي${variantCount === 1 ? "" : "ة"} ذات صلة ��ريرية. يجب أن توجه هذه النتائج الاستراتيجيات العلاجية والوقائية.`
      );
    }
  }

  // Closing paragraph
  if (!isShort) {
    if (isChild) {
      paragraphs.push(
        `الخبر السار هو أن الأطباء يمكنهم الآن استخدام هذه المعلومات لمساعدة ${patientName} على البقاء بصحة جيدة قدر الإمكان. الفحوصات المنتظمة واتباع نصائح الطبيب ستساعد في الحفاظ على صحة ${patientName}.`
      );
    } else {
      paragraphs.push(
        `توفر هذه المعلومات الوراثية رؤى قيمة لإدارة طبية مخصصة. من المهم مناقشة هذه النتائج مع مقدمي الرعاية الصحية لتطوير خطة رعاية مناسبة.`
      );
    }
  }

  const highlights: string[] = [];

  if (isChild) {
    highlights.push("زيارة الطبيب بشكل منتظم للفحوصات الدورية");
    if (variants.length > 0) {
      highlights.push(`إخبار الطبيب عن الاستنتاجات الجينية البالغ عددها ${variants.length}`);
    }
    highlights.push("اطرح أسئلة حول معنى هذه الجينات");
    highlights.push("تعلم كيفية البقاء ��صحة جيدة");
  } else {
    highlights.push("جدولة مراجعة شاملة مع مستشار وراثي");
    if (variants.length > 0) {
      highlights.push(`مراجعة المتغير${variants.length === 1 ? "" : "ات"} الوراثي${variants.length === 1 ? "" : "ة"} المحدد${variants.length === 1 ? "" : "ة"} مع طبيبك`);
    }
    highlights.push("تطوير خطة رعاية مخصصة بناءً على النتائج");
    highlights.push("النظر في الاختبار المتسلسل إذا لزم الأمر لأفراد الأسرة");
  }

  return { title, paragraphs, highlights };
}

export function generateStory(config: StoryConfig): StoryOutput {
  if (config.language === "ar") {
    return generateArabicStory(config.data, config.level, config.length);
  } else {
    return generateEnglishStory(config.data, config.level, config.length);
  }
}
