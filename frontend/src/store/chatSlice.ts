import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  ChatState,
  Message,
  AppStatus,
  SendMessageRequest,
  StreamMessageResponse,
} from '../types/chat';
import { chatApi } from '../services/chatApi';

const initialState: ChatState = {
  messages: [],
  status: 'idle',
  error: null,
  isConnected: false,
};

// Async thunk for sending messages
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (request: SendMessageRequest, { dispatch }) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: request.message,
      role: 'user',
      timestamp: new Date(),
    };

    // Add user message immediately
    dispatch(addMessage(userMessage));

    // Create AI message placeholder
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isStreaming: true,
    };

    dispatch(addMessage(aiMessage));

    // Start streaming response
    await chatApi.streamMessage(request.message, (streamData: StreamMessageResponse) => {
      dispatch(
        updateStreamingMessage({
          messageId: streamData.messageId,
          content: streamData.content,
          isComplete: streamData.isComplete,
        })
      );
    });

    return aiMessage;
  }
);

// Async thunk for loading conversation history
export const loadConversationHistory = createAsyncThunk('chat/loadHistory', async () => {
  const response = await chatApi.getConversationHistory();
  return response.messages;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateStreamingMessage: (
      state,
      action: PayloadAction<{
        messageId: string;
        content: string;
        isComplete: boolean;
      }>
    ) => {
      const { messageId, content, isComplete } = action.payload;
      const message = state.messages.find((msg) => msg.id === messageId);
      if (message) {
        message.content = content;
        message.isStreaming = !isComplete;
      }
    },
    setStatus: (state, action: PayloadAction<AppStatus>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.status = action.payload ? 'error' : 'idle';
    },
    clearError: (state) => {
      state.error = null;
      state.status = 'idle';
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Failed to send message';
      })
      .addCase(loadConversationHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadConversationHistory.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(loadConversationHistory.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Failed to load conversation history';
      });
  },
});

export const {
  addMessage,
  updateStreamingMessage,
  setStatus,
  setError,
  clearError,
  setConnectionStatus,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
