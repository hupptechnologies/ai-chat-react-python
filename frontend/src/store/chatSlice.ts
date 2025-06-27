import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChatState, Message, AppStatus } from '../types/chat';

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
