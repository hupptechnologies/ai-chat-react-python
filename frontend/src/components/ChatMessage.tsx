import React from 'react';
import type { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
}

const formatMessageDateTime = (created_at: string): string => {
  const date = new Date(created_at);
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  return created_at;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isStreaming = message.isStreaming;
  const formattedDateTime = formatMessageDateTime(message.created_at);
  return (
    <div className={`message-wrapper ${isUser ? 'message-user' : 'message-ai'}`}>
      <div className={`chat-message ${isUser ? 'user-message' : 'ai-message'} message-content`}>
        <div className="message-layout">
          {!isUser && (
            <div className="avatar-container">
              <div className="avatar ai-avatar">
                <span className="avatar-text">AI</span>
              </div>
            </div>
          )}
          <div className="message-body">
            <div className="message-author">{isUser ? 'You' : 'AI Assistant'}</div>
            <div className="message-text">
              {message.content}
              {isStreaming && <span className="streaming-indicator" />}
            </div>
            <div className="message-meta">
              <span className="message-time">{formattedDateTime}</span>
              {isStreaming && <span className="streaming-text">Typing...</span>}
            </div>
          </div>
          {isUser && (
            <div className="avatar-container">
              <div className="avatar user-avatar">
                <span className="avatar-text">U</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
