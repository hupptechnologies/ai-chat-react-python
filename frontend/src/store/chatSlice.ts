import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChatState, Message, AppStatus } from '../types/chat';
import { apiService } from '../services/apiService';

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchChatHistory',
  async (_, { rejectWithValue }) => {
    try {
      const messages = await apiService.fetchChatHistory();
      return messages;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load chat history'
      );
    }
  }
);

export const addUserMessage = createAsyncThunk(
  'chat/addUserMessage',
  async (content: string, { dispatch }) => {
    const userMessage: Message = {
      id: Date.now(),
      content,
      role: 'user',
      created_at: new Date().toISOString(),
    };
    dispatch(addMessage(userMessage));
    return userMessage;
  }
);

const initialState: ChatState = {
  messages: [],
  status: 'idle',
  error: null,
  isConnected: false,
};

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
      const message = state.messages.find((msg) => String(msg.id) === messageId);
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
    loadChatHistory: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
      state.status = 'idle';
      state.error = null;
    },
    setLoadingHistory: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    updateStreamingAIMessage: (state, action: PayloadAction<{ content: string }>) => {
      const lastAI = [...state.messages]
        .reverse()
        .find((msg) => msg.role === 'ai' && msg.isStreaming);
      if (!lastAI) {
        const newMsg = {
          id: Date.now(),
          content: action.payload.content,
          role: 'ai' as const,
          created_at: new Date().toISOString(),
          isStreaming: true,
        };
        state.messages.push(newMsg);
      } else {
        lastAI.content = action.payload.content;
      }
    },
    completeStreamingAIMessage: (state) => {
      const lastAI = [...state.messages]
        .reverse()
        .find((msg) => msg.role === 'ai' && msg.isStreaming);
      if (lastAI) {
        lastAI.isStreaming = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.status = 'error';
        state.error = (action.payload as string) || 'Failed to load chat history';
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
  loadChatHistory,
  setLoadingHistory,
  updateStreamingAIMessage,
  completeStreamingAIMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
