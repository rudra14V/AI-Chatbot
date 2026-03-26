import React from 'react';
import { Bot, User } from 'lucide-react';

export function MessageBubble({ message, isTyping }) {
  const isUser = message.role === 'user';

  if (isTyping) {
    return (
      <div className="flex w-full mt-2 space-x-3 max-w-xs">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Bot size={20} className="text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-r-lg rounded-bl-lg">
            <div className="flex space-x-1 items-center h-4">
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full mt-2 space-x-3 max-w-sm ${isUser ? 'ml-auto justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <Bot size={20} className="text-blue-600 dark:text-blue-300" />
        </div>
      )}
      
      <div>
        <div className={`p-3 text-sm ${
          isUser 
            ? 'bg-blue-600 text-white rounded-l-lg rounded-br-lg' 
            : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-r-lg rounded-bl-lg'
        }`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-gray-400 leading-none mt-1 inline-block">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {isUser && (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <User size={20} className="text-gray-500 dark:text-gray-300" />
        </div>
      )}
    </div>
  );
}
