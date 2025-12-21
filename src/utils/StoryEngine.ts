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
  const summaryEn = data?.patientSummaryEn

  let title = isChild
    ? `${patientName}'s Genetic Health Journey`
    : `Understanding ${patientName}'s Genetic Health`;

  const paragraphs: string[] = [];

  // Opening paragraph
  if (isChild) {
    paragraphs.push(
summaryEn    );
  } else {
    paragraphs.push(
summaryEn    );
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
  const summaryAr = data?.patientSummaryAR

  const isChild = level === "child";
  const isShort = length === "short";

  let title = isChild
    ? `رحلة ${patientName} الصحية الجينية`
    : `فهم الملف الجيني لـ ${patientName}`;

  const paragraphs: string[] = [];

  // Opening paragraph
  if (isChild) {
    paragraphs.push(
summaryAr    );
  } else {
    paragraphs.push(
summaryAr    );
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
