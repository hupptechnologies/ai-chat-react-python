export interface Message {
  id: number;
  content: string;
  role: 'user' | 'ai';
  created_at: string;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export type AppStatus = 'idle' | 'loading' | 'error';

export interface ChatState {
  messages: Message[];
  status: AppStatus;
  error: string | null;
  isConnected: boolean;
}

export interface SendMessageRequest {
  message: string;
}

export interface SendMessageResponse {
  message: Message;
  conversationId: string;
}

export interface StreamMessageResponse {
  content: string;
  messageId: string;
  isComplete: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
}
