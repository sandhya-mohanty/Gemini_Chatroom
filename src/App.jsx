

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, Moon, Sun } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import Toast from './components/Toast';
import OTPLogin from './components/OTPLogin';
import {
  userActions,
  chatroomActions,
  messageActions,
  uiActions,
} from './redux/slices';

const App = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { currentChatroom, list: chatroomList } = useSelector((state) => state.chatrooms);
  const { byRoomId: messages } = useSelector((state) => state.messages);
  const { darkMode, toast } = useSelector((state) => state.ui);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Persist user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Persist chatrooms
  useEffect(() => {
    localStorage.setItem('chatrooms', JSON.stringify(chatroomList));
  }, [chatroomList]);

  // Persist messages
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  const handleLogout = () => {
    dispatch(userActions.logout());
    dispatch(chatroomActions.setChatrooms([]));
    dispatch(chatroomActions.setCurrentChatroom(null));
    dispatch(messageActions.setMessages({ roomId: null, messages: [] }));
    localStorage.clear();
  };

  if (!currentUser) return <OTPLogin />;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {toast && <Toast {...toast} onClose={() => dispatch(uiActions.clearToast())} />}

      <header className={`fixed top-0 left-0 right-0 z-40 p-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <MessageSquare className="text-white" size={20} />
            </div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Gemini Chat
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(uiActions.setDarkMode(!darkMode))}
              className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}
            >
              {darkMode ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-gray-600" size={20} />}
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {currentUser?.phone}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-red-500 border border-red-500 rounded-lg hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {currentChatroom ? <ChatInterface /> : <Dashboard />}
      </main>
    </div>
  );
};

export default App;
