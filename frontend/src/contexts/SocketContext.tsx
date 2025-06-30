import React, { createContext, useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '../hooks/redux';
import {
  setConnectionStatus,
  updateStreamingMessage,
  addMessage,
  clearMessages,
} from '../store/chatSlice';
import { socketService } from '../services/socketService';
import type {
  SocketContextType,
  SocketProviderProps,
  Message,
  StreamMessageResponse,
} from '../types/index';

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useAppDispatch();
  const connect = useCallback(async (): Promise<void> => {
    const eventHandlers = {
      onConnect: () => {
        setIsConnected(true);
        dispatch(setConnectionStatus(true));
      },
      onDisconnect: () => {
        setIsConnected(false);
        dispatch(setConnectionStatus(false));
      },
      onError: (error: Error) => {
        console.error('Socket error:', error);
        setIsConnected(false);
        dispatch(setConnectionStatus(false));
        dispatch({ type: 'chat/setError', payload: error.message });
      },
      onMessage: (data: StreamMessageResponse) => {
        dispatch(
          updateStreamingMessage({
            messageId: data.messageId.toString(),
            content: data.content,
            isComplete: data.isComplete,
          })
        );
      },
      onTyping: (data: { isTyping: boolean; userId?: string }) => {
        console.info('Typing event:', data);
      },
      onAllMessages: (messages: Message[]) => {
        dispatch(clearMessages());
        messages.forEach((msg: Message) => dispatch(addMessage(msg)));
      },
      onStreamingAIMessage: (content: string) => {
        dispatch({ type: 'chat/updateStreamingAIMessage', payload: { content } });
      },
      onCompleteStreamingAIMessage: () => {
        dispatch({ type: 'chat/completeStreamingAIMessage' });
      },
    };

    try {
      await socketService.connect(eventHandlers);
    } catch (error) {
      console.error('Failed to connect socket:', error);
      throw error;
    }
  }, [dispatch]);

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
    connect().catch(console.error);

    return () => {
      disconnect();
    };
  }, [connect]);

  const value: SocketContextType = {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    sendTyping,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export { SocketContext };
