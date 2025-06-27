import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ChatHistory } from './components/ChatHistory';
import { ChatInput } from './components/ChatInput';
import { StatusIndicator } from './components/StatusIndicator';
import { useAppSelector } from './hooks/redux';
import { SocketProvider } from './contexts/SocketContext';

const ChatApp: React.FC = () => {
  const { status, error } = useAppSelector((state) => state.chat);

  return (
    <div className="app-container">
      <div className="chat-container">
        <header className="chat-header">
          <div className="header-content">
            <div className="logo-container">
              <div className="logo">
                <span className="logo-text">AI</span>
              </div>
            </div>
            <div className="header-text">
              <h1 className="app-title">AI Chat Assistant</h1>
            </div>
          </div>
          <StatusIndicator status={status} error={error} />
        </header>
        <ChatHistory />
        <ChatInput />
      </div>
      <footer className="app-footer">
        <p>Built with React, TypeScript, Redux Toolkit & CSS</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SocketProvider>
        <ChatApp />
      </SocketProvider>
    </Provider>
  );
};

export default App;
