import React, { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { loadConversationHistory } from '../store/chatSlice';
import { ChatMessage } from './ChatMessage';

export const ChatHistory: React.FC = () => {
  const { messages } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(loadConversationHistory());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
