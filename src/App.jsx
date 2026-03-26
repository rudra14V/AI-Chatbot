import React, { useState, useEffect, useRef } from 'react';
import { MessageBubble } from './components/MessageBubble';
import { MessageInput } from './components/MessageInput';
import { ThemeToggle } from './components/ThemeToggle';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Bot, Download, Trash2 } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useLocalStorage('chat-history', []);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    // Create new messages array to use for both state and API call
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Free open-source API placeholder (replace with OpenAI if you have a key)
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`,
          'HTTP-Referer': window.location.href, // Recommended for OpenRouter
          'X-Title': 'React Chatbot' // Recommended for OpenRouter
        },
        body: JSON.stringify({
          model: 'openrouter/auto', // Tells OpenRouter to automatically use the best available model for your key
          messages: [
            { role: 'system', content: 'You are a friendly, conversational AI companion. You just want to chat casually like a normal person. Keep responses relatively concise and natural.' },
            ...updatedMessages.map(m => ({ 
              role: m.role === 'bot' ? 'assistant' : 'user', 
              content: m.content 
            }))
          ]
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;

      const botMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: botResponse,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: `Connection Error: ${error.message}\n\n(Note: To unlock unlimited chat, create a .env file with VITE_OPENAI_API_KEY=your_key)`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      setMessages([]);
    }
  };

  const exportChat = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(messages, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'chat_history.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col items-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col overflow-hidden" style={{ height: '90vh' }}>
        
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Bot className="text-blue-600 dark:text-blue-300" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">AI Assistant</h1>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Online
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button onClick={exportChat} title="Export Chat" className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
              <Download size={20} />
            </button>
            <button onClick={clearHistory} title="Clear Chat" className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
              <Trash2 size={20} />
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
               <Bot size={48} className="mb-4 opacity-50" />
               <p>Send a message to start a conversation.</p>
            </div>
          ) : (
             messages.map(msg => (
               <MessageBubble key={msg.id} message={msg} />
             ))
          )}
          
          {isTyping && <MessageBubble isTyping={true} message={{role:'bot'}} />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}
