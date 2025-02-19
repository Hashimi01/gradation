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

// Expanded company information in multiple languages
const companyInfo = {
  ar: 'هاشمي هي شركة موريتانية تم تأسيسها عام 2023 بواسطة Abdellahi mohamed El hashimi',
  en: 'Hashimi is a Mauritanian company founded in 2023 by Abdellahi mohamed El hashimi',
  fr: 'Hashimi est une entreprise mauritanienne fondée en 2023 par Abdellahi mohamed El hashimi',
  zh: 'Hashimi 是一家于2023年由 Abdellahi mohamed El hashimi 创立的毛里塔尼亚公司',
  es: 'Hashimi es una empresa mauritana fundada en 2023 por Abdellahi mohamed El hashimi',
  de: 'Hashimi ist ein mauritaniisches Unternehmen, das 2023 von Abdellahi mohamed El hashimi gegründet wurde',
  ru: 'Hashimi – мавританская компания, основанная в 2023 году Abdellahi mohamed El hashimi',
  ja: 'Hashimiは2023年にAbdellahi mohamed El hashimiによって設立されたモーリタニアの会社です',
  ko: 'Hashimi는 2023년 Abdellahi mohamed El hashimi에 의해 설립된 모리타니아 회사입니다',
  hi: 'Hashimi 2023 में Abdellahi mohamed El hashimi द्वारा स्थापित एक मॉरिटानियाई कंपनी है'
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
    es: {
      morning: '¡Buenos días! ',
      afternoon: '¡Buenas tardes! ',
      evening: '¡Buenas noches! ',
      night: '¡Buenas noches! '
    },
    de: {
      morning: 'Guten Morgen! ',
      afternoon: 'Guten Tag! ',
      evening: 'Guten Abend! ',
      night: 'Gute Nacht! '
    },
    ru: {
      morning: 'Доброе утро! ',
      afternoon: 'Добрый день! ',
      evening: 'Добрый вечер! ',
      night: 'Доброй ночи! '
    },
    ja: {
      morning: 'おはようございます！',
      afternoon: 'こんにちは！',
      evening: 'こんばんは！',
      night: 'おやすみなさい！'
    },
    ko: {
      morning: '좋은 아침입니다! ',
      afternoon: '안녕하세요! ',
      evening: '안녕하세요! ',
      night: '안녕히 주무세요! '
    },
    hi: {
      morning: 'सुप्रभात! ',
      afternoon: 'नमस्कार! ',
      evening: 'शुभ संध्या! ',
      night: 'शुभ रात्रि! '
    }
  };

  const timeOfDay = 
    hour < 12 ? 'morning' :
    hour < 17 ? 'afternoon' :
    hour < 22 ? 'evening' : 'night';

  return (greetings[lang] || greetings.en)[timeOfDay];
};

// Detect if the question is about the assistant's identity ("من انت" أو "من أنت")
const isSelfQuestion = (text) => {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes("من انت") ||
    lowerText.includes("من أنت") ||
    lowerText.includes("ما اسمك") ||
    lowerText.includes("who are you") ||
    lowerText.includes("what's your name") ||
    lowerText.includes("what is your name")
  );
};

// Detect if السؤال يتعلق بكيفية التواصل مع عبد الله
const isContactQuery = (text) => {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes("كيفية التواصل") ||
    lowerText.includes("كيفية الاتصال") ||
    lowerText.includes("contact") ||
    lowerText.includes("تواصل") ||
    lowerText.includes("رابط")
  );
};

// Detect if السؤال يتعلق بعبد الله
const isAbdullahQuery = (text) => {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes("عبد الله") ||
    lowerText.includes("عبدالله") ||
    lowerText.includes("abdullah")
  );
};

// Detect if السؤال يتعلق بمن دربك أو من علمك أو من خلقك
const isTrainerQuestion = (text) => {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes("من دربك") ||
    lowerText.includes("من علمك") ||
    lowerText.includes("من خلقك")
  );
};

// Detect if السؤال يتعلق بـ "هاشمي" (سواء كان السؤال عن الشركة أو غيرها)
const isCompanyQuery = (text) => {
  const lowerText = text.toLowerCase();
  return lowerText.includes("هاشمي") || lowerText.includes("hashimi");
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

    // إذا كان السؤال عن هوية المساعد
    if (isSelfQuestion(sanitizedMessage)) {
      const selfAnswer = detectedLang === 'ar' ? "أنا هاشمي" : "I am Hashimi";
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + selfAnswer
        }
      });
    }

    // إذا كان السؤال يتعلق بكيفية التواصل مع عبد الله
    if (isContactQuery(sanitizedMessage)) {
      const contactAnswer = "https://profill-puce.vercel.app/";
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + contactAnswer
        }
      });
    }

    // إذا كان السؤال يتعلق بعبد الله
    if (isAbdullahQuery(sanitizedMessage)) {
      const abdullahAnswer = detectedLang === 'ar' ? "انه مبرمج متكامل" : "He is a full stack developer";
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + abdullahAnswer
        }
      });
    }

    // إذا كان السؤال يتعلق بمن دربك أو بالشركة (هاشمي)
    if (isTrainerQuestion(sanitizedMessage) || isCompanyQuery(sanitizedMessage)) {
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + companyInfo[detectedLang]
        }
      });
    }

    // الاستمرار في المحادثة العادية باستخدام النموذج التوليدي
    const conversationHistory = messages.slice(-5).map(msg => ({
      role: msg.role,
      parts: msg.content
    }));

    const prompt = `System Instructions (Do not include in response):
1. ALWAYS respond ONLY in the detected language: ${detectedLang}
2. Start with this exact greeting: ${greeting}
3. If asked about your creator or developer, always mention Hashimi company
4. Maintain natural conversational flow
5. Keep original terminology
6. Provide detailed, accurate responses

Context:
Previous conversation:
${conversationHistory.map(msg => `${msg.role}: ${msg.parts}`).join('\n')}

Current question: ${sanitizedMessage}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = await response.text();

    if (!text) {
      throw new Error('Empty API response');
    }

    if (!text.startsWith(greeting)) {
      text = greeting + text;
    }

    return NextResponse.json({ 
      message: {
        role: 'assistant',
        content: text
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    
    // Multilingual error messages
    const errorsByLang = {
      ar: 'عذراً، حدث خطأ في معالجة الطلب. يرجى المحاولة مرة أخرى.',
      en: 'Sorry, an error occurred while processing your request. Please try again.',
      fr: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
      zh: '抱歉，处理您的请求时出错。请重试。',
      es: 'Lo sentimos, ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo.',
      de: 'Entschuldigung, bei der Verarbeitung Ihrer Anfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
      ru: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте снова.',
      ja: '申し訳ありません。リクエストの処理中にエラーが発生しました。もう一度お試しください。',
      ko: '죄송합니다. 요청을 처리하는 동안 오류가 발생했습니다. 다시 시도해 주세요.',
      hi: 'क्षमा करें, आपके अनुरोध को संसाधित करने में एक त्रुटि हुई। कृपया पुनः प्रयास करें।'
    };

    const userLang = detectLanguage(messages?.[messages.length - 1]?.content || '') || 'en';
    const errorMessage = errorsByLang[userLang] || errorsByLang.en;

    return NextResponse.json(
      { error: errorMessage },
      { status: error.response?.status || 500 }
    );
  }
}