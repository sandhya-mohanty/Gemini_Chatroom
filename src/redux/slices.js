
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Get data from localStorage
const savedUser = localStorage.getItem('user');
const savedChatrooms = localStorage.getItem('chatrooms');
const savedMessages = localStorage.getItem('messages');

// User Slice
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: !!savedUser,
    loading: false,
    error: null
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

// Chatroom Slice
export const chatroomSlice = createSlice({
  name: 'chatrooms',
  initialState: {
    list: savedChatrooms ? JSON.parse(savedChatrooms) : [],
    currentChatroom: null,
    loading: false,
    error: null
  },
  reducers: {
    setChatrooms: (state, action) => {
      state.list = action.payload;
    },
    addChatroom: (state, action) => {
      state.list.push(action.payload);
    },
    deleteChatroom: (state, action) => {
      state.list = state.list.filter(room => room.id !== action.payload);
    },
    setCurrentChatroom: (state, action) => {
      state.currentChatroom = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

// Message Slice
export const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    byRoomId: savedMessages ? JSON.parse(savedMessages) : {},
    isTyping: false,
    loading: false,
    error: null
  },
  reducers: {
    setMessages: (state, action) => {
      const { roomId, messages } = action.payload;
      state.byRoomId[roomId] = messages;
    },
    addMessage: (state, action) => {
      const { roomId, message } = action.payload;
      if (!state.byRoomId[roomId]) {
        state.byRoomId[roomId] = [];
      }
      state.byRoomId[roomId].push(message);
    },
    setIsTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

// UI Slice
export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: localStorage.getItem('theme') === 'dark',
    toast: null,
    showCreateModal: false,
    searchTerm: ''
  },
  reducers: {
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('theme', action.payload ? 'dark' : 'light');
    },
    setToast: (state, action) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
    setShowCreateModal: (state, action) => {
      state.showCreateModal = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    }
  }
});

// Thunks
export const sendMessageAsync = createAsyncThunk(
  'messages/sendMessage',
  async ({ roomId, message }, { dispatch }) => {
    const userMessage = {
      id: Date.now(),
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    dispatch(messageSlice.actions.addMessage({ roomId, message: userMessage }));
    dispatch(uiSlice.actions.setToast({ message: 'Message sent!', type: 'success' }));

    dispatch(messageSlice.actions.setIsTyping(true));

    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

    const responses = [
      "That's an interesting question! Let me think...",
      "I understand. Here's what I think...",
      "Based on my knowledge...",
      "Let me help you with that...",
    ];

    const aiMessage = {
      id: Date.now() + 1,
      content: responses[Math.floor(Math.random() * responses.length)] + " " + message.split(' ').reverse().join(' '),
      sender: 'ai',
      timestamp: new Date().toISOString()
    };

    dispatch(messageSlice.actions.addMessage({ roomId, message: aiMessage }));
    dispatch(messageSlice.actions.setIsTyping(false));
    return aiMessage;
  }
);

export const createChatroomAsync = createAsyncThunk(
  'chatrooms/createChatroom',
  async (title, { dispatch }) => {
    const newChatroom = {
      id: Date.now(),
      title,
      createdAt: new Date().toISOString(),
      lastMessage: null
    };
    dispatch(chatroomSlice.actions.addChatroom(newChatroom));
    dispatch(uiSlice.actions.setToast({ message: 'Chatroom created!', type: 'success' }));
    dispatch(uiSlice.actions.setShowCreateModal(false));
    return newChatroom;
  }
);

// Export actions
export const userActions = userSlice.actions;
export const chatroomActions = chatroomSlice.actions;
export const messageActions = messageSlice.actions;
export const uiActions = uiSlice.actions;
