import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useSocket } from '../contexts/useSocket';
import { useAppDispatch } from '../hooks/redux';
import { addMessage } from '../store/chatSlice';

export const ChatInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isConnected } = useSocket();
  const dispatch = useAppDispatch();

  const isDisabled = !isConnected || !inputValue.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;

    const message = inputValue.trim();
    setInputValue('');

    dispatch(
      addMessage({
        id: Date.now(),
        content: message,
        role: 'user',
        created_at: new Date().toISOString(),
      })
    );
    sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <div className="input-container">
        <div className="textarea-wrapper">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            className="message-input"
            rows={1}
            disabled={!isConnected}
          />
        </div>
        <button type="submit" disabled={isDisabled} className="send-button">
          <PaperAirplaneIcon className="send-icon" />
          <span className="send-text">Send</span>
        </button>
      </div>
      {!isConnected && (
        <div className="loading-indicator">
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot" style={{ animationDelay: '0.1s' }}></div>
            <div className="loading-dot" style={{ animationDelay: '0.2s' }}></div>
          </div>
          Connecting to chat server...
        </div>
      )}
    </form>
  );
};
