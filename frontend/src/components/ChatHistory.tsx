import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchChatHistory } from '../store/chatSlice';

export const ChatHistory: React.FC = () => {
  const { messages, status } = useAppSelector((state) => state.chat);
  const bottomRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchChatHistory());
  }, [dispatch]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (status === 'loading') {
    return (
      <div className="chat-history">
        <div className="loading-state">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading chat history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-history">
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-content">
            <div className="empty-icon">
              <span className="empty-emoji">💬</span>
            </div>
            <h3 className="empty-title">Start a conversation</h3>
            <p className="empty-description">
              Send a message to begin chatting with the AI assistant.
            </p>
          </div>
        </div>
      ) : (
        messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
      )}
      <div ref={bottomRef} />
    </div>
  );
};
