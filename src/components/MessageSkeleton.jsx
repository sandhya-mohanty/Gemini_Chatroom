import React from 'react';

const MessageSkeleton = () => (
  <div className="flex gap-3 p-4 animate-pulse">
    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

export default MessageSkeleton;
