import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Copy, Check, AlertTriangle } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error loading saved messages:', e);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopyMessage = async (messageId, content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const Message = ({ message, index }) => (
    <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}>
      <div className={`
        max-w-[85%] md:max-w-[75%] p-4 rounded-2xl
        ${message.role === 'user' 
          ? 'bg-blue-600/20 text-white ml-auto' 
          : 'bg-gray-800/50 text-gray-100'
        }
        relative group
      `}>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleCopyMessage(index, message.content)}
            className="p-1 rounded hover:bg-gray-700/50 transition-colors"
            title="Copy message"
          >
            {copiedMessageId === index ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
        <MessageContent content={message.content} />
      </div>
    </div>
  );

  const MessageContent = ({ content }) => {
    const parseContent = (text) => {
      const parts = [];
      let lastIndex = 0;
      
      const combinedRegex = 
        /```(\w+)?\n([\s\S]*?)```|<a\s+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>|🔢 Math:([\s\S]*?)(?=\n\n|$)|📊 Analysis:([\s\S]*?)(?=\n\n|$)|(https?:\/\/[^\s]+)/g;
      
      let match;
      while ((match = combinedRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            content: text.slice(lastIndex, match.index),
          });
        }
        
        if (match[0].startsWith('<a')) {
          parts.push({
            type: 'link',
            url: match[3],
            content: match[4],
          });
        } else if (match[0].startsWith('http')) {
          parts.push({
            type: 'link',
            url: match[0],
            content: match[0],
          });
        } else if (match[0].startsWith('```')) {
          parts.push({
            type: 'code',
            language: match[1] || 'code',
            content: match[2].trim(),
          });
        } else if (match[0].startsWith('🔢 Math:')) {
          parts.push({
            type: 'math',
            content: match[5].trim(),
          });
        } else if (match[0].startsWith('📊 Analysis:')) {
          parts.push({
            type: 'analysis',
            content: match[6].trim(),
          });
        }
        
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < text.length) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex),
        });
      }

      return parts;
    };

    const parts = parseContent(content);
    return (
      <div className="space-y-2">
        {parts.map((part, index) => {
          switch (part.type) {
            case 'link':
              return (
                <a
                  key={index}
                  href={part.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 hover:underline transition-colors"
                >
                  {part.content}
                </a>
              );
            case 'code':
              return (
                <div key={index} className="relative rounded-lg bg-gray-800/50 p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{part.content}</code>
                  </pre>
                </div>
              );
            case 'math':
            case 'analysis':
              return (
                <div key={index} className="bg-gray-800/30 rounded-lg p-4">
                  <p className="whitespace-pre-wrap">{part.content}</p>
                </div>
              );
            default:
              return (
                <p key={index} className="whitespace-pre-wrap leading-relaxed">
                  {part.content}
                </p>
              );
          }
        })}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage = {
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newMessage],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, data.message]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-900">
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-5xl mx-auto px-4 py-6">
          <div
            ref={chatContainerRef}
            className="h-full flex flex-col bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-700/30"
          >
            {error && (
              <div className="p-4 bg-red-500/10 border-b border-red-500/20">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message, index) => (
                <Message key={index} message={message} index={index} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-700/50 bg-gray-900/30 p-4">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                      text-white placeholder-gray-400 transition-all duration-200 
                      min-h-[52px] max-h-[200px] resize-none
                      scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
                    disabled={isLoading}
                    style={{
                      direction: 'rtl',
                      lineHeight: '1.5'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 
                    flex items-center justify-center min-w-[4rem]"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}