import React from 'react';
import './MessageCard.css';

const MessageCard = ({ message, markAsRead }) => {
  // Check for either readMessages or read property
  const isRead = message.readMessages || message.read;
  
  return (
    <div className={`message-card ${isRead ? 'read' : 'unread'}`}>
      <div className="message-header">
        <h3>{message.subject || 'No Subject'}</h3>
        <div className="message-meta">
          <span className="message-date">{message.date || 'No date'}</span>
          {!isRead && <span className="unread-badge">New</span>}
        </div>
      </div>
      <div className="sender-info">
        <span className="sender-name"><strong>From:</strong> {message.adultName}</span>
        <span className="sender-email"> ({message.email})</span>
        <div>
          {message.childName && (
            <span className="minor-name"><strong>Child's Name:</strong> {message.childName}</span>
          )}
        </div>
      </div>
      <p className="message-preview">
        {message.message ? `${message.message}` : 'No message content'}
      </p>
      <div className="message-actions">
        {!isRead && (
          <button className="mark-read-btn" onClick={() => markAsRead(message.id)}>
            Mark as Read
          </button>
        )}
        <a 
          href={`mailto:${message.email}?subject=Re: ${message.subject || 'Your message'}`}
          className="reply-btn"
        >
          Reply
        </a>
      </div>
    </div>
  );
};

export default MessageCard;