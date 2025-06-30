import type { SocketEventHandlers } from '../types/index';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.71:8000';
const WS_URL = `${baseUrl.replace('http', 'ws')}/ws/chat`;

class SocketService {
  private socket: WebSocket | null = null;
  private eventHandlers: SocketEventHandlers = {};
  private isConnecting = false;

  connect(handlers: SocketEventHandlers = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }
      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }
      this.isConnecting = true;
      this.eventHandlers = handlers;
      try {
        this.socket = new WebSocket(WS_URL);
        this.socket.onopen = () => {
          this.isConnecting = false;
          this.eventHandlers.onConnect?.();
          resolve();
        };
        this.socket.onclose = () => {
          this.eventHandlers.onDisconnect?.();
        };
        this.socket.onerror = (event) => {
          console.error('[WebSocket] Error', event);
          this.isConnecting = false;
          this.eventHandlers.onError?.(new Error('WebSocket error'));
          reject(new Error('WebSocket error'));
        };
        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (
              data.role === 'ai' &&
              typeof data.content === 'string' &&
              typeof data.loading === 'boolean'
            ) {
              if (data.loading) {
                this.eventHandlers.onStreamingAIMessage?.(data.content);
              } else {
                this.eventHandlers.onStreamingAIMessage?.(data.content);
                this.eventHandlers.onCompleteStreamingAIMessage?.();
              }
            }
          } catch (err) {
            console.error('[WebSocket] Invalid JSON', err);
          }
        };
      } catch (error) {
        console.error('[WebSocket] Exception', error);
        this.isConnecting = false;
        this.eventHandlers.onError?.(error as Error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnecting = false;
  }

  sendMessage(message: string): void {
    if (
      this.socket &&
      this.socket.readyState === WebSocket.OPEN &&
      typeof message === 'string' &&
      message.trim() !== ''
    ) {
      this.socket.send(JSON.stringify({ type: 'content', content: message }));
    }
  }

  sendTyping(isTyping: boolean): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'typing', isTyping }));
    }
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  getSocket(): WebSocket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
