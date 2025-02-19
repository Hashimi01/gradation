export const sendMessage = async (message) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [{ role: 'user', content: message }] }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.error) {
        throw new Error(data.error);
      }
      console.log("رد الذكاء الاصطناعي:", response);

      return data.message;  // ترجع الرد من الخادم
    } catch (error) {
      console.error('Chat Error:', error);
      return { role: 'system', content: 'عذراً، حدث خطأ أثناء الإرسال.' };
    }
  };
  