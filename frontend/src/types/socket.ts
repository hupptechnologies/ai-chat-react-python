import type { Message, StreamMessageResponse } from './chat';
import type { ReactNode } from 'react';

export interface SocketEventHandlers {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onMessage?: (data: StreamMessageResponse) => void;
  onTyping?: (data: { isTyping: boolean; userId?: string }) => void;
  onAllMessages?: (messages: Message[]) => void;
  onStreamingAIMessage?: (content: string) => void;
  onCompleteStreamingAIMessage?: () => void;
}

export interface SocketContextType {
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  sendTyping: (isTyping: boolean) => void;
}
export interface SocketProviderProps {
  children: ReactNode;
}
