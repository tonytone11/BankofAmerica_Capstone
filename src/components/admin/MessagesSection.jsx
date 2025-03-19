import React from 'react';
import MessageCard from './MessageCard';
import { FaSearch } from "react-icons/fa";
import './MessagesSection.css';

const MessagesSection = ({ 
  messages, 
  searchTerm, 
  filterStatus, 
  handleSearchChange, 
  handleFilterChange, 
  filteredMessages, 
  markAsRead,
  setSearchTerm,
  isLoading,
  error
}) => {
  // Handle loading state
  if (isLoading) {
    return (
      <div className="admin-section">
        <h1>Contact Messages</h1>
        <div className="loading-indicator">Loading messages...</div>
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="admin-section">
        <h1>Contact Messages</h1>
        <div className="error-message">
          <p>Error loading messages: {error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <h1>Contact Messages</h1>
      
      <div className="data-controls">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search messages..." 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button onClick={() => setSearchTerm('')}>
            {searchTerm ? '✕' : <FaSearch />}
          </button>
        </div>
        
        <div className="filters">
          <select 
            value={filterStatus}
            onChange={handleFilterChange}
          >
            <option value="">All Messages</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>
        </div>
      </div>
      
      <div className="messages-list">
        {filteredMessages.length === 0 ? (
          <div className="no-results">
            <p>No messages found matching your search criteria.</p>
          </div>
        ) : (
          filteredMessages.map(message => (
            <MessageCard 
              key={message.id} 
              message={message} 
              markAsRead={markAsRead} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesSection;