import React from 'react';
import './MessageCard.css';

const MessageCard = ({ message, markAsRead }) => {
    return (
        <div className={`message-card ${message.read ? 'read' : 'unread'}`}>
            <div className="message-header">
                <h3>{message.subject}</h3>
                <div className="message-meta">
                    <span className="message-date">{message.date}</span>
                    {!message.read && <span className="unread-badge">New</span>}
                </div>
            </div>
            <div className="sender-info">
                <span className="sender-name"> <strong> From:</strong> {message.adultName}</span>
                <span className="sender-email"> ({message.email})</span>
                <div>
                    {message.childName && (
                        <span className="minor-name"> <strong>Child's Name: </strong>  {message.childName}</span>
                    )}
                </div>
            </div>
            <p className="message-preview">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies ultrices...
            </p>
            <div className="message-actions">
                {!message.read && (
                    <button className="mark-read-btn" onClick={() => markAsRead(message.id)}>
                        Mark as Read
                    </button>
                )}
                <a
                    href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                    className="reply-btn"
                >
                    Reply
                </a>
            </div>
        </div>
    );
};

export default MessageCard;