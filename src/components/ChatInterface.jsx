
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, Image, Copy, ArrowLeft } from 'lucide-react';
import { sendMessageAsync, messageActions, uiActions } from '../redux/slices';
import Toast from './Toast';

const PAGE_SIZE = 20;

const ChatInterface = () => {
  const dispatch = useDispatch();
  const { currentChatroom } = useSelector(state => state.chatrooms);
  const { byRoomId: messages, isTyping } = useSelector(state => state.messages);
  const { darkMode, toast } = useSelector(state => state.ui);

  const [newMessage, setNewMessage] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const chatroomMessages = messages[currentChatroom?.id] || [];

  // Load next "page" of messages
  const loadMoreMessages = useCallback(() => {
    const nextIndex = startIndex + PAGE_SIZE;
    const newVisible = chatroomMessages.slice(-nextIndex).slice(0, PAGE_SIZE);
    setVisibleMessages(prev => [...newVisible.reverse(), ...prev]);
    setStartIndex(nextIndex);
    if (nextIndex >= chatroomMessages.length) setHasMore(false);
  }, [startIndex, chatroomMessages]);

  // Initial load and reset on room change
  useEffect(() => {
    if (currentChatroom) {
      const slice = chatroomMessages.slice(-PAGE_SIZE).reverse();
      setVisibleMessages(slice);
      setStartIndex(PAGE_SIZE);
      setHasMore(chatroomMessages.length > PAGE_SIZE);
    }
  }, [currentChatroom?.id, chatroomMessages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatroomMessages.length, isTyping]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    dispatch(sendMessageAsync({ roomId: currentChatroom.id, message: newMessage }));
    setNewMessage('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageMessage = {
        id: Date.now(),
        content: event.target.result,
        sender: 'user',
        timestamp: new Date().toISOString(),
        type: 'image',
      };
      dispatch(messageActions.addMessage({ roomId: currentChatroom.id, message: imageMessage }));
      dispatch(uiActions.setToast({ message: 'Image uploaded!', type: 'success' }));
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    dispatch(uiActions.setToast({ message: 'Copied to clipboard!', type: 'success' }));
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    if (messagesContainerRef.current.scrollTop === 0 && hasMore) {
      const previousHeight = messagesContainerRef.current.scrollHeight;
      loadMoreMessages();
      setTimeout(() => {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight - previousHeight;
      }, 100); // delay ensures DOM update
    }
  };

  if (!currentChatroom) return null;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {toast && <Toast {...toast} onClose={() => dispatch(uiActions.clearToast())} />}

      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center gap-4 bg-opacity-50 backdrop-blur sticky top-0 z-10">
          <button
            onClick={() => dispatch({ type: 'chatrooms/setCurrentChatroom', payload: null })}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-xl font-semibold truncate">{currentChatroom.title}</h2>
        </div>

          {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
          {chatroomMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`relative max-w-[75%] md:max-w-sm rounded-2xl p-3 shadow-md group transition ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                {msg.type === 'image' ? (
                  <img
                    src={msg.content}
                    alt="Uploaded"
                    className="rounded-xl w-full object-cover max-h-60"
                  />
                ) : (
                  <div className="relative">
                    <p className="pr-6">{msg.content}</p>
                    <button
                      onClick={() => copyToClipboard(msg.content)}
                      className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-200 dark:text-white"
                      title="Copy"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                )}
                <span className="text-xs mt-1 block text-right opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-2xl text-sm italic animate-pulse text-gray-600 dark:text-gray-300">
                Gemini is typing...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t flex items-center gap-2 bg-white dark:bg-gray-800">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <Image />
          </button>
          <button
            onClick={handleSendMessage}
            className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition"
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
