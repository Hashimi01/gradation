"use client"
import { updateRatingAtIndex } from "../firebase/firebase-operations";

// ✅ دالة إرسال الرسائل إلى الذكاء الاصطناعي


// ✅ دالة تحليل التصويتات
const handleAnalyze = async (votes, setError, setRatings, setAnalyzing, loadInitialData) => {
  if (votes.length === 0) {
    setError("لا توجد بيانات لتحليلها.");
    return;
  }

  setAnalyzing(true);
  setError("");

  // 🚀 إعداد الرسالة التي سيتم إرسالها إلى الذكاء الاصطناعي
  const message = `
ما هو المعنى الأكثر شمولًا بين هذه الأسماء المقترحة للدفعة؟
المعنى الشامل هو الذي يغطي أكبر عدد من الأسماء المقترحة، بحيث يمثل نسبة تزيد عن 37% من الأسماء.

إذا كانت القائمة تحتوي على معنى واحد أو اثنين فقط، فيرجى إكمال النتيجة ليصبح المجموع ثلاثة معانٍ باستخدام معانٍ منطقية ومناسبة.
يجب أن يكون عدد الأسماء في المعاني المضافة أقل من العدد الأساسي لتجنب التكرار غير المنطقي.

📌 **التعليمات الصارمة للإجابة:**
- يجب أن تتكون الإجابة من 3 عناصر بالضبط، حتى إذا لم يكن هناك بيانات كافية.
- أجب فقط بصيغة JSON بدون أي نص إضافي.
- تأكد من أن النتيجة تتضمن **3 معانٍ بالضبط**.
- كل معنى يجب أن يكون **جملة من 2 إلى 4 كلمات كحد أقصى**.
- عدد الأسماء لكل معنى يجب أن يكون منطقيًا وفقًا للبيانات.

🔹 **مثال على النتيجة المطلوبة:**
\`\`\`json
[
  {"المعنى": "دفعة الأمل", "العدد": 15},
  {"المعنى": "عاشق التجارب", "العدد": 12},
  {"المعنى": "محبي الابتكار", "العدد": 9}
]
\`\`\`

### هذه هي قائمة الأسماء المقترحة:
${JSON.stringify(votes, null, 2)}
`;



  try {
    // 🔹 إرسال الرسالة إلى الذكاء الاصطناعي
    const response = await sendMessage(message);
    if (!response || !response.content) {
      throw new Error("❌ الاستجابة من الخادم غير صالحة.");
    }

    console.log("🔍 الرد الخام:", response.content);

    // ✅ تنظيف وإزالة أي أكواد غير لازمة
    const cleanedContent = response.content.replace(/```json|```/g, "").trim();
    const parsedContent = JSON.parse(cleanedContent);
    console.log("✅ المحتوى المحلل:", parsedContent);

    if (Array.isArray(parsedContent)) {
      for (let i = 0; i < parsedContent.length; i++) {
        const { المعنى, العدد } = parsedContent[i];
        const success = await updateRatingAtIndex(i, المعنى, العدد);
        console.log(`🔄 تحديث الفهرس ${i} بـ: ${المعنى}, العدد: ${العدد}, النجاح: ${success}`);

        if (!success) {
          setError(`⚠️ فشل تحديث العنصر في الفهرس ${i}`);
          break;
        }
      }

      setRatings(parsedContent);
    } else {
      setError("⚠️ الرد غير صالح.");
    }
  } catch (err) {
    setError("❌ حدث خطأ أثناء تحليل البيانات.");
    console.error(err);
  } finally {
    setAnalyzing(false);
  }
};
export const sendMessage = async (message) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: message }] }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('❌ Chat Error:', error);
      throw error; // رمي الخطأ ليتم التعامل معه في المستدعي
    }
  };
export default handleAnalyze;
