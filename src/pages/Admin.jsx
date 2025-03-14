// src/pages/Admin.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers } from "react-icons/fa";
import { IoIosMail } from "react-icons/io"
import '../styles/Admin.css';

const Admin = () => {
  // State for active section
  const [activeSection, setActiveSection] = useState('users');
  
  // State for user management
  const [users, setUsers] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', joinDate: '2024-03-01'},
    { id: 2, name: 'Emily Johnson', email: 'emily@example.com', joinDate: '2024-02-15' },
    { id: 3, name: 'Michael Williams', email: 'michael@example.com', joinDate: '2024-03-05'},
    { id: 4, name: 'Sarah Davis', email: 'sarah@example.com', joinDate: '2024-01-10' },
    { id: 5, name: 'David Miller', email: 'david@example.com', joinDate: '2024-02-28' }
  ]);
  
  // State for messages from contact form
  const [messages, setMessages] = useState([
    { id: 1, name: 'Jake Wilson', email: 'jake@example.com', subject: 'Question about training videos', date: '2024-03-10', read: false },
    { id: 2, name: 'Sophia Parker', email: 'sophia@example.com', subject: 'Account upgrade request', date: '2024-03-08', read: true },
    { id: 3, name: 'Oliver Brown', email: 'oliver@example.com', subject: 'Feature suggestion', date: '2024-03-05', read: true },
    { id: 4, name: 'Emma Thompson', email: 'emma@example.com', subject: 'Technical issue report', date: '2024-03-01', read: false },
    { id: 5, name: 'Noah Garcia', email: 'noah@example.com', subject: 'Partnership opportunity', date: '2024-02-25', read: true }
  ]);
  
  // Mark message as read
  const markAsRead = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? {...msg, read: true} : msg
    ));
  };

  
  return (
    <div className="admin-container">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="logo">
          <span className="admin-badge">Admin</span>
        </div>
        <div className="admin-profile">
          <div className="notifications">
            {/* <span className="badge"></span> */}
          </div>
          <div className="profile">
            <div className="avatar">A</div>
            <span>Cherub</span>
          </div>
        </div>
      </header>
      
      <div className="admin-content">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <nav>
            <ul>
              <li className={activeSection === 'users' ? 'active' : ''}>
                <button onClick={() => setActiveSection('users')}>
                  <span className="icon"><FaUsers /></span> Users
                </button>
              </li>
              <li className={activeSection === 'messages' ? 'active' : ''}>
                <button onClick={() => setActiveSection('messages')}>
                  <span className="icon"><IoIosMail /></span> Messages
                </button>
              </li>
            </ul>
          </nav>
          
          <div className="admin-logout">
            <Link to="/login" className="logout-btn">
              <span className="icon"></span> Logout
            </Link>
          </div>
        </aside>
        
        {/* Main Content Area */}
        <main className="admin-main">
          {/* Users Management Section */}
          {activeSection === 'users' && (
            <div className="admin-section">
              <div className="section-header">
                <h1>Users Management</h1>
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Join Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.joinDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Messages Section */}
          {activeSection === 'messages' && (
            <div className="admin-section">
              <h1>Contact Messages</h1>
              
              <div className="data-controls">
                <div className="search-bar">
                  <input type="text" placeholder="Search messages..." />
                  <button>🔍</button>
                </div>
                
                <div className="filters">
                  <select defaultValue="">
                    <option value="">All Messages</option>
                    <option value="read">Read</option>
                    <option value="unread">Unread</option>
                  </select>
                </div>
              </div>
              
              <div className="messages-list">
                {messages.map(message => (
                  <div key={message.id} className={`message-card ${message.read ? 'read' : 'unread'}`}>
                    <div className="message-header">
                      <h3>{message.subject}</h3>
                      <div className="message-meta">
                        <span className="message-date">{message.date}</span>
                        {!message.read && <span className="unread-badge">New</span>}
                      </div>
                    </div>
                    <div className="sender-info">
                      <span className="sender-name">From: {message.name}</span>
                      <span className="sender-email">({message.email})</span>
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
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;