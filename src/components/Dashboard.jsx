import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2, Search, MessageSquare } from 'lucide-react';
import { chatroomActions, uiActions, userActions, createChatroomAsync } from '../redux/slices';
import Toast from './Toast';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { list: chatrooms } = useSelector(state => state.chatrooms);
  const { darkMode, toast, showCreateModal, searchTerm } = useSelector(state => state.ui);
  const [newChatroomTitle, setNewChatroomTitle] = useState('');

  const filteredChatrooms = chatrooms.filter(room =>
    room.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateChatroom = () => {
    if (!newChatroomTitle.trim()) return;
    dispatch(createChatroomAsync(newChatroomTitle));
    setNewChatroomTitle('');
  };

  const handleDeleteChatroom = (id) => {
    dispatch(chatroomActions.deleteChatroom(id));
    dispatch(uiActions.setToast({ message: 'Chatroom deleted!', type: 'success' }));
  };

  const handleSelectChatroom = (chatroom) => {
    dispatch(chatroomActions.setCurrentChatroom(chatroom));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      {toast && <Toast {...toast} onClose={() => dispatch(uiActions.clearToast())} />}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>My Chatrooms</h1>
          <button
            onClick={() => dispatch(uiActions.setShowCreateModal(true))}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition"
          >
            <Plus size={20} /> New Chat
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => dispatch(uiActions.setSearchTerm(e.target.value))}
            placeholder="Search chatrooms..."
            className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm transition focus:outline-none focus:ring-2 ${
              darkMode
                ? 'bg-gray-800 border-gray-600 text-white focus:ring-blue-500'
                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400'
            }`}
          />
        </div>

        {/* Chatroom Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChatrooms.map(chatroom => (
            <div
              key={chatroom.id}
              onClick={() => handleSelectChatroom(chatroom)}
              className={`group p-6 rounded-2xl shadow-md transition transform hover:scale-[1.02] cursor-pointer ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow">
                  <MessageSquare className="text-white" size={24} />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChatroom(chatroom.id);
                  }}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <h3 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {chatroom.title}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Created on {new Date(chatroom.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* No Chatrooms */}
        {filteredChatrooms.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No chatrooms found</p>
            <p className={`mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Create a new one to get started
            </p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className={`fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50 transition ${darkMode ? 'bg-gray-800' : 'bg-gray-400'}`}>
          <div
            className={`rounded-2xl p-6 w-full max-w-md shadow-xl animate-fade-in ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Create Chatroom</h2>
            <input
              type="text"
              value={newChatroomTitle}
              onChange={(e) => setNewChatroomTitle(e.target.value)}
              placeholder="Enter title"
              className={`w-full px-4 py-3 border rounded-lg mb-4 transition focus:outline-none focus:ring-2 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400'
              }`}
            />
            <div className="flex gap-4">
              <button
                onClick={handleCreateChatroom}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:opacity-90 transition"
              >
                Create
              </button>
              <button
                onClick={() => dispatch(uiActions.setShowCreateModal(false))}
                className={`flex-1 py-3 rounded-lg transition ${
                  darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
