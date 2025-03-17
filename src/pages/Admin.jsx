import React, { useState } from 'react';
import '../styles/Admin.css';

// Import components
import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';
import UsersSection from '../components/admin/UsersSection';
import MessagesSection from '../components/admin/MessagesSection';

const Admin = () => {
  // State for active section
  const [activeSection, setActiveSection] = useState('users');
  
  // State for user management
  const [users, setUsers] = useState([
    { id: 1, name: 'John Smith', username: 'johnsmith', email: 'john@example.com' },
    { id: 2, name: 'Emily Johnson', username: 'emilyjohn', email: 'emily@example.com' },
    { id: 3, name: 'Michael Williams', username: 'mikewill', email: 'michael@example.com' },
    { id: 4, name: 'Sarah Davis', username: 'sarahdavis', email: 'sarah@example.com' },
    { id: 5, name: 'David Miller', username: 'davemiller', email: 'david@example.com' }
  ]);
  
  // State for messages from contact form
  const [messages, setMessages] = useState([
    { id: 1, adultName: 'Jake Wilson', email: 'jake@example.com', minorName: 'Tommy Wilson', subject: 'Question about training videos', date: '2024-03-10', read: false },
    { id: 2, adultName: 'Sophia Parker', email: 'sophia@example.com', minorName: '', subject: 'Account upgrade request', date: '2024-03-08', read: true },
    { id: 3, adultName: 'Oliver Brown', email: 'oliver@example.com', minorName: 'Emma Brown', subject: 'Feature suggestion', date: '2024-03-05', read: true },
    { id: 4, adultName: 'Emma Thompson', email: 'emma@example.com', minorName: '', subject: 'Technical issue report', date: '2024-03-01', read: false },
    { id: 5, adultName: 'Noah Garcia', email: 'noah@example.com', minorName: 'Lily Garcia', subject: 'Partnership opportunity', date: '2024-02-25', read: true }
  ]);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };
  
  // Filter messages based on search term and filter status
  const filteredMessages = messages.filter(message => {
    // Search term filter (case insensitive)
    const matchesSearch = searchTerm === '' || 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.adultName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.minorName && message.minorName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter
    const matchesStatus = 
      filterStatus === '' || 
      (filterStatus === 'read' && message.read) || 
      (filterStatus === 'unread' && !message.read);
    
    return matchesSearch && matchesStatus;
  });
  
  // Mark message as read
  const markAsRead = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? {...msg, read: true} : msg
    ));
  };

  
  return (
    <div className="admin-container">
      <AdminHeader />
      
      <div className="admin-content">
        <AdminSidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
        
        <main className="admin-main">
          {activeSection === 'users' && (
            <UsersSection users={users} />
          )}
          
          {activeSection === 'messages' && (
            <MessagesSection 
              messages={messages}
              searchTerm={searchTerm}
              filterStatus={filterStatus}
              handleSearchChange={handleSearchChange}
              handleFilterChange={handleFilterChange}
              filteredMessages={filteredMessages}
              markAsRead={markAsRead}
              setSearchTerm={setSearchTerm}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;