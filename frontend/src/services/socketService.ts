import { io, Socket } from 'socket.io-client';
import type { StreamMessageResponse, Message } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface SocketEventHandlers {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onMessage?: (data: StreamMessageResponse) => void;
  onTyping?: (data: { isTyping: boolean; userId?: string }) => void;
  onAllMessages?: (messages: Message[]) => void;
}

class SocketService {
  private socket: Socket | null = null;
  private eventHandlers: SocketEventHandlers = {};
  private isConnecting = false;

  connect(handlers: SocketEventHandlers = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;
      this.eventHandlers = handlers;

      console.log('Attempting to connect to socket at:', API_BASE_URL);

      try {
        this.socket = io(API_BASE_URL, {
          path: '/socket.io',
          transports: ['websocket', 'polling'],
          autoConnect: true,
          timeout: 20000,
        });

        this.socket.on('connect', () => {
          console.log('Socket.io connected successfully');
          this.isConnecting = false;
          this.eventHandlers.onConnect?.();
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket.io disconnected:', reason);
          this.eventHandlers.onDisconnect?.();
        });

        this.socket.on('connect_error', (error: Error) => {
          console.error('Socket.io connection error:', error);
          this.isConnecting = false;
          this.eventHandlers.onError?.(error);
          reject(error);
        });

        this.socket.on('send_message', (data: StreamMessageResponse) => {
          console.log('Received message from socket:', data);
          this.eventHandlers.onMessage?.(data);
        });

        this.socket.on('typing', (data: { isTyping: boolean; userId?: string }) => {
          console.log('Received typing event:', data);
          this.eventHandlers.onTyping?.(data);
        });

        this.socket.on('get_all_message', (data: { messages: Message[] }) => {
          console.log('Received all messages:', data);
          this.eventHandlers.onAllMessages?.(data.messages);
        });
      } catch (error) {
        console.error('Error creating socket connection:', error);
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
  }

  sendMessage(message: string): void {
    if (this.socket?.connected) {
      this.socket.emit('send_message', { message });
    } else {
      console.warn('Socket not connected, cannot send message');
    }
  }

  sendTyping(isTyping: boolean): void {
    if (this.socket?.connected) {
      this.socket.emit('typing', { isTyping });
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
