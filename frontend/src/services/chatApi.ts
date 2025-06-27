import type {
  SendMessageRequest,
  SendMessageResponse,
  StreamMessageResponse,
  Message,
} from '../types/chat';

// Use environment utility for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ChatApi {
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async streamMessage(
    message: string,
    onChunk: (data: StreamMessageResponse) => void
  ): Promise<void> {
    // Mock streaming implementation for frontend-only demo
    const mockResponse = `This is a mock response to: "${message}". I'm simulating a streaming response that would normally come from an AI backend. The response is being streamed token by token to demonstrate the real-time functionality of the chat interface.`;

    const messageId = Date.now().toString();
    let currentContent = '';

    // Simulate streaming by sending chunks
    for (let i = 0; i < mockResponse.length; i += 3) {
      const chunk = mockResponse.slice(i, i + 3);
      currentContent += chunk;

      onChunk({
        content: currentContent,
        messageId,
        isComplete: i + 3 >= mockResponse.length,
      });

      // Add delay to simulate real streaming
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  async getConversationHistory(): Promise<{ messages: Message[] }> {
    return {
      messages: [],
    };
  }
}

export const chatApi = new ChatApi();
