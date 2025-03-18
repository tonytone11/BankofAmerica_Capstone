import React, { useState, useEffect } from 'react';
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

  // State for messages from contact form - now empty array as we'll fetch from API
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch messages from the backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3003/admin/users/messages');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.messages)) {
          // Transform the data to match your component's expected structure
          const formattedMessages = data.messages.map(msg => ({
            id: msg.id,
            adultName: msg.adultName,
            childName: msg.childName || '',
            email: msg.email,
            subject: msg.subject || 'No Subject',
            message: msg.message,
            // Adding a date property since your MessageCard expects it
            date: msg.date || new Date().toISOString().split('T')[0], // Use date from server or current date as fallback
            readMessages: msg.readMessages || false // Default to unread since your backend might not have this field yet
          }));
          
          setMessages(formattedMessages);
        } else {
          throw new Error('Invalid data structure received from server');
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (activeSection === 'messages') {
      fetchMessages();
    }
  }, [activeSection]);

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
      (message.childName && message.childName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus =
      filterStatus === '' ||
      (filterStatus === 'read' && (message.readMessages || message.read)) ||
      (filterStatus === 'unread' && !(message.readMessages || message.read));

    return matchesSearch && matchesStatus;
  });

  // Mark message as read - updated to call API
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:3003/admin/messages/${id}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Update local state to reflect the change
      setMessages(messages.map(msg =>
        msg.id === id ? { ...msg, readMessages: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
      // You could add UI feedback here for error handling
    }
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
              isLoading={isLoading}
              error={error}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;