import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('Missing Google API Key');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Enhanced language detection with support for more languages
const detectLanguage = (text) => {
  const patterns = {
    ar: /[\u0600-\u06FF]/, // Arabic
    en: /^[A-Za-z\s.,!?-]+$/, // English
    fr: /[àâäéèêëîïôöùûüÿçœæ]/i, // French
    zh: /[\u4e00-\u9fff]/, // Chinese
    es: /[áéíóúñ¿¡]/i, // Spanish
    de: /[äöüß]/i, // German
    ru: /[\u0400-\u04FF]/, // Russian
    ja: /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/, // Japanese
    ko: /[\uAC00-\uD7AF\u1100-\u11FF]/, // Korean
    hi: /[\u0900-\u097F]/, // Hindi
  };

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) return lang;
  }
  return 'en'; // Default to English
};

// Expanded company information in multiple languages with friendly tone and clickable links
const companyInfo = {
  ar: `مرحباً! شركة هاشمي تأسست في 2023-04-07 في موريتانيا (النواكشوط). مهمتها إنشاء تطبيقات حديثة تساعد الناس في مجالات التكنولوجيا وخاصة البرمجة. رؤيتها تطمح لتوسيع أعمالها لتشمل استخدام منتجاتها في الأجهزة والأنظمة المستخدمة يوميًا مثل المستشفيات، المترو، المطارات وغيرها. نقدم خدمات إنشاء مواقع وتطبيقات وإنجاز مشاريع برمجية ضخمة. مؤسسنا، عبد الله محمد الهاشمي، يمتلك خبرة واسعة في مجالات البرمجة والذكاء الاصطناعي والفولستاك. للمزيد من المعلومات، تفضل بزيارة <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">هذا الرابط</a> أو راسلنا عبر البريد الإلكتروني: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.`,
  en: `Hello! Hashimi was founded on 2023-04-07 in Mauritania (Nouakchott). Our mission is to create modern applications that help people in various tech fields, especially programming. Our vision is to expand our business to include our products in everyday devices and systems like hospitals, metros, airports, and more. We offer services including website development, app creation, and large-scale programming projects. Our founder, Abdallah Mohamed Al Hashimi, has extensive experience in programming, artificial intelligence, and full-stack development. For more information, please visit <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">this link</a> or email us at <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.`,
  // يمكن إضافة ترجمات لغات أخرى بنفس النمط...
};

// Multilingual greetings
const getGreeting = (lang) => {
  const hour = new Date().getHours();
  const greetings = {
    ar: {
      morning: 'صباح الخير! ',
      afternoon: 'مساء الخير! ',
      evening: 'مساء الخير! ',
      night: 'مساء الخير! '
    },
    en: {
      morning: 'Good morning! ',
      afternoon: 'Good afternoon! ',
      evening: 'Good evening! ',
      night: 'Good evening! '
    },
    // يمكن إضافة تحيات للغات أخرى...
  };

  const timeOfDay = hour < 12 ? 'morning' :
                    hour < 17 ? 'afternoon' :
                    hour < 22 ? 'evening' : 'night';

  return (greetings[lang] || greetings.en)[timeOfDay];
};

// Enhanced query detection
const isSelfQuestion = (text) => {
  const lowerText = text.toLowerCase();
  const selfQuestions = [
    "من انت", "من أنت", "ما اسمك",
    "who are you", "what's your name", "what is your name",
    "who created you", "who made you", "من صنعك", "من برمجك",
    "what company", "which company", "اي شركة", "أي شركة",
    "what model", "اي موديل", "أي موديل",
    "what are you", "ما هو نوعك",
    "what version", "ما هو إصدارك",
    "who developed you", "من طورك",
    "تعتبرها" // يمكن إضافة عبارات أخرى تدل على السؤال عن البوت نفسه
  ];
  return selfQuestions.some(q => lowerText.includes(q));
};

const isGoogleProductQuery = (text) => {
  const lowerText = text.toLowerCase();
  const googleProducts = [
    "firebase", "gemini", "فايربيس", "جيميني",
    "google cloud", "جوجل كلاود",
    "google maps", "خرائط جوجل"
  ];
  return googleProducts.some(product => lowerText.includes(product));
};

const isContactQuery = (text) => {
  const lowerText = text.toLowerCase();
  const contactTerms = [
    "كيفية التواصل", "كيفية الاتصال", "contact",
    "تواصل", "رابط"
  ];
  return contactTerms.some(term => lowerText.includes(term));
};

const isAbdullahQuery = (text) => {
  const lowerText = text.toLowerCase();
  const abdullahTerms = ["عبد الله", "عبدالله", "abdullah"];
  return abdullahTerms.some(term => lowerText.includes(term));
};

const isTrainerQuestion = (text) => {
  const lowerText = text.toLowerCase();
  const trainerTerms = ["من دربك", "من علمك", "من خلقك"];
  return trainerTerms.some(term => lowerText.includes(term));
};

const isCompanyQuery = (text) => {
  const lowerText = text.toLowerCase();
  return lowerText.includes("هاشمي") || lowerText.includes("hashimi");
};

const constructPrompt = (detectedLang, greeting, conversationHistory, sanitizedMessage) => {
  let systemInstructions = `System Instructions (Do not include in response):
1. ALWAYS respond ONLY in the detected language: ${detectedLang}
2. Start with this exact greeting: ${greeting}
3. If asked about your creator or developer, always mention Hashimi company with the following details:
   - Founded on 2023-04-07 in Mauritania (Nouakchott)
   - Mission: Create modern applications to help people in various tech fields, especially programming
   - Vision: Expand business to include products in everyday devices/systems
   - Services: Website/app development and large-scale programming projects
   - Founder: Abdallah Mohamed Al Hashimi with extensive experience in AI and full-stack development
   - Contact: <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">this link</a>
4. Maintain natural conversational flow and use a friendly tone
5. Keep original terminology
6. Provide detailed, accurate responses`;

  if (isSelfQuestion(sanitizedMessage) && !isGoogleProductQuery(sanitizedMessage)) {
    systemInstructions += `
7. IMPORTANT: When discussing your own creation or development:
   - Always attribute your development to Hashimi company
   - Never mention Google or any other company in relation to your development
   - Emphasize that you are a Hashimi AI assistant
   - Focus on Hashimi's mission and expertise in AI development`;
  }

  return `${systemInstructions}

Context:
Previous conversation:
${conversationHistory.map(msg => `${msg.role}: ${msg.parts}`).join('\n')}

Current question: ${sanitizedMessage}`;
};

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1].content;
    const sanitizedMessage = lastMessage
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .trim();
    
    const detectedLang = detectLanguage(sanitizedMessage);
    const greeting = getGreeting(detectedLang);

    // Handle predefined responses for special queries
    if (isSelfQuestion(sanitizedMessage) && !isGoogleProductQuery(sanitizedMessage)) {
      const selfAnswer = detectedLang === 'ar' 
        ? "أنا مساعد هاشمي الذكي، تم تطويري بواسطة شركة هاشمي. كيف يمكنني مساعدتك اليوم؟" 
        : "I am Hashimi's AI assistant, developed by Hashimi company. How can I help you today?";
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + selfAnswer
        }
      });
    }

    if (isContactQuery(sanitizedMessage)) {
      const contactAnswer = detectedLang === 'ar'
        ? `يمكنك التواصل معنا عبر <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">هذا الرابط</a> أو عبر البريد الإلكتروني: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.`
        : `You can contact us via <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">this link</a> or email us at <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.`;
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + contactAnswer
        }
      });
    }

    if (isAbdullahQuery(sanitizedMessage) || isTrainerQuestion(sanitizedMessage) || isCompanyQuery(sanitizedMessage)) {
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + companyInfo[detectedLang]
        }
      });
    }

    // Handle regular conversation with the enhanced prompt
    const conversationHistory = messages.slice(-5).map(msg => ({
      role: msg.role,
      parts: msg.content
    }));

    const prompt = constructPrompt(detectedLang, greeting, conversationHistory, sanitizedMessage);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = await response.text();

    if (!text) {
      throw new Error('Empty API response');
    }

    if (!text.startsWith(greeting)) {
      text = greeting + text;
    }

    // تعديل عبارة "بواسطة جوجل" إلى "بواسطة شركة هاشمي" إذا كان السؤال يتعلق ببوت الدردشة نفسه
    if (isSelfQuestion(sanitizedMessage)) {
      text = text.replace(/بواسطة\s+جوجل\b/gi, "بواسطة شركة هاشمي");
    }

    return NextResponse.json({ 
      message: {
        role: 'assistant',
        content: text
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    
    const errorsByLang = {
      ar: 'عذراً، حدث خطأ في معالجة الطلب. يرجى المحاولة مرة أخرى.',
      en: 'Sorry, an error occurred while processing your request. Please try again.',
      // يمكن إضافة رسائل خطأ بلغات أخرى...
    };

    const userLang = detectLanguage(messages?.[messages.length - 1]?.content || '') || 'en';
    const errorMessage = errorsByLang[userLang] || errorsByLang.en;

    return NextResponse.json(
      { error: errorMessage },
      { status: error.response?.status || 500 }
    );
  }
}
