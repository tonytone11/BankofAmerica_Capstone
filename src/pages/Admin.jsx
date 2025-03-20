import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';

// Import components
import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';
import UsersSection from '../components/admin/UsersSection';
import MessagesSection from '../components/admin/MessagesSection';
// Import auth utilities
import { getAuthHeader, isAdmin } from '../utils/authUtils';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  // State for active section
  const [activeSection, setActiveSection] = useState('users');

  // State for user management
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);

  // State for messages from contact form
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from the backend - updated to use new API endpoint
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const response = await fetch('https://bankofamerica-capstone.onrender.com/api/admin/users', {
          headers: getAuthHeader() // Use auth header from authUtils
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          throw new Error('Invalid data structure received from server');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setUsersError(err.message);
      } finally {
        setUsersLoading(false);
      }
    };

    if (activeSection === 'users') {
      fetchUsers();
    }
  }, [activeSection]);

  // Fetch messages from the backend - updated to use new API endpoint
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://bankofamerica-capstone.onrender.com/api/admin/messages', {
          headers: getAuthHeader() // Use auth header from authUtils
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.messages)) {
          const formattedMessages = data.messages.map(msg => ({
            id: msg.id,
            adultName: msg.adultName,
            childName: msg.childName || '',
            email: msg.email,
            subject: msg.subject || 'No Subject',
            message: msg.message,
            date: msg.date || new Date().toISOString().split('T')[0],
            readMessages: msg.readMessages || false
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
      (message.subject && message.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (message.adultName && message.adultName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (message.email && message.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (message.childName && message.childName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus =
      filterStatus === '' ||
      (filterStatus === 'read' && (message.readMessages || message.read)) ||
      (filterStatus === 'unread' && !(message.readMessages || message.read));

    return matchesSearch && matchesStatus;
  });

  // Mark message as read - updated to use new API endpoint
  const markAsRead = async (id) => {
    try {
      console.log(`Marking message ${id} as read...`);

      // First update the UI immediately for better user experience
      setMessages(messages.map(msg =>
        msg.id === id ? { ...msg, readMessages: true } : msg
      ));

      // Then make the API call with auth header
      const response = await fetch(`https://bankofamerica-capstone.onrender.com/api/admin/messages/${id}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader() // Include auth header
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // Check if user is admin - if not, redirect to login
  if (!isAdmin()) {
    return <Navigate to="/login" />;
  }

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
            <UsersSection
              users={users}
              isLoading={usersLoading}
              error={usersError}
            />
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