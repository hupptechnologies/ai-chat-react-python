import type { Message } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.71:8000';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async fetchChatHistory(): Promise<Message[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.messages || data || [];
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
