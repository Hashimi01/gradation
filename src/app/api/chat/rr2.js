import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('Missing Google API Key');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// دالة لاكتشاف اللغة مع دعم المزيد من اللغات
const detectLanguage = (text) => {
  const patterns = {
    ar: /[\u0600-\u06FF]/, // العربية
    en: /^[A-Za-z\s.,!?-]+$/, // الإنجليزية
    fr: /[àâäéèêëîïôöùûüÿçœæ]/i, // الفرنسية
    zh: /[\u4e00-\u9fff]/, // الصينية
    es: /[áéíóúñ¿¡]/i, // الإسبانية
    de: /[äöüß]/i, // الألمانية
    ru: /[\u0400-\u04FF]/, // الروسية
    ja: /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/, // اليابانية
    ko: /[\uAC00-\uD7AF\u1100-\u11FF]/, // الكورية
    hi: /[\u0900-\u097F]/, // الهندية
  };

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) return lang;
  }
  return 'en'; // الافتراضي الإنجليزية
};

// معلومات الشركة الموسعة بعدة لغات
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

// معلومات التواصل مع الشركة بعدة لغات
const companyContactInfo = {
  ar: 'يمكنك التواصل مع شركة هاشمي عبر <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">هذا الرابط</a> أو عبر البريد الإلكتروني: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.',
  en: 'You can contact Hashimi company via <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">this link</a> or by email: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.',
  fr: 'Vous pouvez contacter la société Hashimi via <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">ce lien</a> ou par e-mail: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.',
  zh: '您可以通过<a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">此链接</a>或发送邮件至<a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>联系Hashimi公司。',
  es: 'You can contact Hashimi company via <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">this link</a> or by email: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.',
  de: 'Sie können die Hashimi Firma über <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">diesen Link</a> oder per E-Mail unter <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a> kontaktieren.',
  ru: 'Вы можете связаться с компанией Hashimi через <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">эту ссылку</a> или по электронной почте: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.',
  ja: 'Hashimi社へのお問い合わせは、<a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">こちらのリンク</a>またはメールで<a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>までご連絡ください。',
  ko: 'Hashimi 회사에 연락하려면 <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">이 링크</a> 또는 이메일 <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>을 이용하세요.',
  hi: 'आप Hashimi कंपनी से <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">इस लिंक</a> के माध्यम से या <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a> पर ईमेल द्वारा संपर्क कर सकते हैं।'
};

// معلومات عن عبد الله (بجانب الوصف العام) بعدة لغات
const abdullahAnswers = {
  ar: 'عبد الله هو مطور متكامل ذو خبرة واسعة، جاهز دائمًا لتقديم أفضل الحلول.',
  en: 'Abdullah is a skilled full-stack developer with extensive experience, always ready to deliver top-notch solutions.',
  fr: 'Abdullah est un développeur full-stack compétent avec une vaste expérience, toujours prêt à fournir des solutions de premier ordre.',
  zh: 'Abdullah 是一位全栈开发者，拥有丰富经验，总是准备提供一流的解决方案。',
  es: 'Abdullah is a skilled full-stack developer with extensive experience, always ready to deliver top-notch solutions.',
  de: 'Abdullah ist ein erfahrener Full-Stack-Entwickler, der stets bereit ist, erstklassige Lösungen zu liefern.',
  ru: 'Абдулла — опытный full-stack разработчик, всегда готов предоставить первоклассные решения.',
  ja: 'Abdullahは経験豊富なフルスタック開発者で、常に最高のソリューションを提供する準備ができています。',
  ko: 'Abdullah는 경험이 풍부한 풀스택 개발자로, 항상 최고의 솔루션을 제공할 준비가 되어 있습니다.',
  hi: 'Abdullah एक कुशल full-stack डेवलपर हैं, जिनके पास व्यापक अनुभव है और जो हमेशा बेहतरीन समाधान देने के लिए तैयार रहते हैं।'
};

// معلومات التواصل مع عبد الله بعدة لغات (استخدم عنوان بريد إلكتروني افتراضي أو استبدله بالعنوان الصحيح)
const abdullahContactInfo = {
  ar: 'يمكنك التواصل مع عبد الله عبر البريد الإلكتروني: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  en: 'You can contact Abdullah via email: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  fr: 'Vous pouvez contacter Abdullah par e-mail: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  zh: '您可以通过电子邮件联系Abdullah: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  es: 'You can contact Abdullah via email: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  de: 'Sie können Abdullah per E-Mail kontaktieren: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  ru: 'Вы можете связаться с Абдуллой по электронной почте: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  ja: 'Abdullahにはメールで連絡できます: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  ko: 'Abdullah에게는 이메일로 연락할 수 있습니다: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  hi: 'आप Abdullah से ईमेल द्वारा संपर्क कर सकते हैं: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.'
};

// تحيات متعددة اللغات
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

// دوال تحديد نوع السؤال

// السؤال عن هوية المساعد ("من انت" أو "ما اسمك")
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

// السؤال عن كيفية التواصل (عبارات مثل "كيفية التواصل" أو "تواصل" أو "رابط")
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

// السؤال العام عن عبد الله (دون تفاصيل التواصل)
const isAbdullahQuery = (text) => {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes("عبد الله") ||
    lowerText.includes("عبدالله") ||
    lowerText.includes("abdullah")
  );
};

// السؤال عن من دربك أو من علمك أو من خلقك
const isTrainerQuestion = (text) => {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes("من دربك") ||
    lowerText.includes("من علمك") ||
    lowerText.includes("من خلقك")
  );
};

// السؤال المتعلق بالشركة (هاشمي)
const isCompanyQuery = (text) => {
  const lowerText = text.toLowerCase();
  return lowerText.includes("هاشمي") || lowerText.includes("hashimi");
};

// دالة لتحديد إذا كان السؤال يتعلق بالتواصل مع عبد الله بشكل محدد
const isAbdullahContactQuery = (text) => {
  const lowerText = text.toLowerCase();
  return (
    (lowerText.includes("عبد الله") || lowerText.includes("abdullah")) &&
    (lowerText.includes("contact") ||
     lowerText.includes("تواصل") ||
     lowerText.includes("كيفية التواصل") ||
     lowerText.includes("كيفية الاتصال"))
  );
};

// دالة لتحديد إذا كان السؤال يتعلق بالتواصل مع الشركة (هاشمي) بشكل محدد
const isCompanyContactQuery = (text) => {
  const lowerText = text.toLowerCase();
  return (
    (lowerText.includes("هاشمي") || lowerText.includes("hashimi")) &&
    (lowerText.includes("contact") ||
     lowerText.includes("تواصل") ||
     lowerText.includes("كيفية التواصل") ||
     lowerText.includes("كيفية الاتصال") ||
     lowerText.includes("رابط"))
  );
};

// إجابات متعددة اللغات لهوية المساعد
const selfAnswers = {
  ar: "أنا Hashimi، مساعدك الافتراضي من هاشمي، هنا لأقدم لك الدعم. كيف يمكنني مساعدتك اليوم؟",
  en: "I am Hashimi, your virtual assistant from Hashimi, here to help you. How can I assist you today?",
  fr: "Je suis Hashimi, votre assistant virtuel de Hashimi, ici pour vous aider. Comment puis-je vous assister aujourd'hui?",
  zh: "我是 Hashimi，你的 Hashimi 虚拟助手，很高兴为您服务。有什么我可以帮忙的吗？",
  es: "I am Hashimi, your virtual assistant from Hashimi, here to help you. How can I assist you today?",
  de: "Ich bin Hashimi, dein virtueller Assistent von Hashimi, hier um dir zu helfen. Wie kann ich dir heute behilflich sein?",
  ru: "Я Hashimi, ваш виртуальный ассистент от Hashimi, готов помочь. Чем могу быть полезен сегодня?",
  ja: "私は Hashimi、Hashimiのバーチャルアシスタントです。どのようにお手伝いできますか？",
  ko: "저는 Hashimi, Hashimi의 가상 어시스턴트입니다. 오늘 무엇을 도와드릴까요?",
  hi: "मैं Hashimi हूँ, Hashimi का आपका वर्चुअल असिस्टेंट, आपकी सहायता के लिए यहाँ हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?"
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

    // فرع السؤال عن هوية المساعد
    if (isSelfQuestion(sanitizedMessage)) {
      const selfAnswer = selfAnswers[detectedLang] || selfAnswers.en;
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + selfAnswer
        }
      });
    }

    // فرع السؤال عن كيفية التواصل مع عبد الله بشكل محدد
    if (isAbdullahContactQuery(sanitizedMessage)) {
      const abdullahContact = abdullahContactInfo[detectedLang] || abdullahContactInfo.en;
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + abdullahContact
        }
      });
    }

    // فرع السؤال عن كيفية التواصل مع الشركة (هاشمي) بشكل محدد
    if (isCompanyContactQuery(sanitizedMessage)) {
      const companyContact = companyContactInfo[detectedLang] || companyContactInfo.en;
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + companyContact
        }
      });
    }

    // فرع السؤال العام عن كيفية التواصل (يُرجح أن يكون تواصل مع الشركة)
    if (isContactQuery(sanitizedMessage)) {
      const contactAnswer = companyContactInfo[detectedLang] || companyContactInfo.en;
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + contactAnswer
        }
      });
    }

    // فرع السؤال المتعلق بعبد الله (غير التواصل)
    if (isAbdullahQuery(sanitizedMessage)) {
      const abdullahAnswer = abdullahAnswers[detectedLang] || abdullahAnswers.en;
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + abdullahAnswer
        }
      });
    }

    // فرع السؤال المتعلق بمن دربك أو بالشركة (هاشمي)
    if (isTrainerQuestion(sanitizedMessage) || isCompanyQuery(sanitizedMessage)) {
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + (companyInfo[detectedLang] || companyInfo.en)
        }
      });
    }

    // متابعة المحادثة العادية باستخدام النموذج التوليدي
    const conversationHistory = messages.slice(-5).map(msg => ({
      role: msg.role,
      parts: msg.content
    }));

    // 1. ALWAYS respond ONLY in the detected language: ${detectedLang}
    // 2. Start with this exact greeting: ${greeting}
    // 3. If asked about your creator or developer, always mention Hashimi company.
    // 4. Maintain natural conversational flow.
    // 5. Keep original terminology.
    // 6. Provide detailed, accurate responses.


    const prompt = `System Instructions (Do not include in response):
1. ALWAYS respond exclusively in the language detected from the user's input (support all languages worldwide; if the language is undetected, default to English).
2. Begin every response with the exact greeting provided in that language: ${greeting}.
3. When asked about your creator or developer, always mention the Hashimi company along with the provided details.
4. Maintain a natural and fluent conversational flow in the detected language.
5. Preserve all original terminology and context from the user's query.
6. Provide responses that are comprehensive, detailed, and accurate, tailored to the nuances of the detected language.


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

    // if (!text.startsWith(greeting)) {
    //   text = greeting + text;
    // }

    return NextResponse.json({ 
      message: {
        role: 'assistant',
        content: text
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    
    // رسائل الخطأ متعددة اللغات
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
