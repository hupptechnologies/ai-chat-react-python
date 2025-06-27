import React from 'react';
import type { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isStreaming = message.isStreaming;
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
              <span className="message-time">{message.timestamp.toLocaleTimeString()}</span>
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
