
import { configureStore } from '@reduxjs/toolkit';
import { userSlice, chatroomSlice, messageSlice, uiSlice } from './slices';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    chatrooms: chatroomSlice.reducer,
    messages: messageSlice.reducer,
    ui: uiSlice.reducer,
  },
});

