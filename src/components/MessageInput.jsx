import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

export function MessageInput({ onSendMessage, disabled }) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API if supported
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert('Voice input is not supported in this browser.');
      }
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || disabled) return;
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={toggleListening}
          className={`absolute left-2 p-2 focus:outline-none transition-colors ${
            isListening 
              ? 'text-red-500 animate-pulse' 
              : 'text-gray-500 hover:text-blue-500'
          }`}
          title={isListening ? "Stop listening" : "Start voice input"}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : "Type your message and press Enter..."}
          className="w-full pl-12 pr-12 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={disabled}
        />
        
        <button
          type="submit"
          className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={!input.trim() || disabled}
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
}
