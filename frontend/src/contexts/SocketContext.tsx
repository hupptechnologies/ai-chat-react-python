import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAppDispatch } from '../hooks/redux';
import {
  setConnectionStatus,
  updateStreamingMessage,
  addMessage,
  clearMessages,
} from '../store/chatSlice';
import { socketService } from '../services/socketService';
import type { SocketEventHandlers } from '../services/socketService';
import type { StreamMessageResponse } from '../types/chat';

interface SocketContextType {
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  sendTyping: (isTyping: boolean) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useAppDispatch();

  const eventHandlers: SocketEventHandlers = {
    onConnect: () => {
      setIsConnected(true);
      dispatch(setConnectionStatus(true));
    },
    onDisconnect: () => {
      setIsConnected(false);
      dispatch(setConnectionStatus(false));
    },
    onError: (error) => {
      console.error('Socket error:', error);
      setIsConnected(false);
      dispatch(setConnectionStatus(false));
    },
    onMessage: (data: StreamMessageResponse) => {
      dispatch(
        updateStreamingMessage({
          messageId: data.messageId,
          content: data.content,
          isComplete: data.isComplete,
        })
      );
    },
    onTyping: (data) => {
      // Handle typing indicators if needed
      console.log('Typing event:', data);
    },
    onAllMessages: (messages) => {
      dispatch(clearMessages());
      messages.forEach((msg) => dispatch(addMessage(msg)));
    },
  };

  const connect = async (): Promise<void> => {
    try {
      await socketService.connect(eventHandlers);
    } catch (error) {
      console.error('Failed to connect socket:', error);
      throw error;
    }
  };

  const disconnect = (): void => {
    socketService.disconnect();
  };

  const sendMessage = (message: string): void => {
    socketService.sendMessage(message);
  };

  const sendTyping = (isTyping: boolean): void => {
    socketService.sendTyping(isTyping);
  };

  useEffect(() => {
    // Auto-connect on mount
    connect().catch(console.error);

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, []);

  const value: SocketContextType = {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    sendTyping,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
