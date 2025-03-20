import React, { useState } from 'react';
import './UsersSection.css';
import { getAuthHeader } from '../../utils/authUtils';

const UsersSection = ({ users, isLoading, error }) => {
  const [actionStatus, setActionStatus] = useState({ message: '', isError: false });

  // Function to promote user to admin
  const promoteToAdmin = async (userId) => {
    try {
      setActionStatus({ message: 'Promoting user...', isError: false });

      const response = await fetch(`/api/admin/users/${userId}/promote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to promote user. Status: ${response.status}`);
      }

      const data = await response.json();
      setActionStatus({ message: data.message || 'User promoted successfully', isError: false });

      // Refresh the page after successful promotion
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Error promoting user:', error);
      setActionStatus({ message: error.message, isError: true });
    }
  };

  // Function to demote admin to regular user
  const demoteAdmin = async (userId) => {
    try {
      setActionStatus({ message: 'Demoting user...', isError: false });

      const response = await fetch(`/api/admin/users/${userId}/demote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to demote user. Status: ${response.status}`);
      }

      const data = await response.json();
      setActionStatus({ message: data.message || 'User demoted successfully', isError: false });

      // Refresh the page after successful demotion
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Error demoting user:', error);
      setActionStatus({ message: error.message, isError: true });
    }
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h1>Users Management</h1>
      </div>

      {actionStatus.message && (
        <div className={`action-status ${actionStatus.isError ? 'error' : 'success'}`}>
          {actionStatus.message}
        </div>
      )}

      {isLoading && <div className="loading-message">Loading users...</div>}

      {error && (
        <div className="error-message">
          <p>Error loading users: {error}</p>
          <p>Please check your server connection and try again.</p>
        </div>
      )}

      {!isLoading && !error && users.length === 0 && (
        <div className="no-data-message">
          <p>No users found in the database.</p>
        </div>
      )}

      {!isLoading && !error && users.length > 0 && (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                {/* <th>Admin</th>
                <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.username || `user_${user.id}`}</td>
                  <td>{user.email}</td>
                  {/* <td>{user.admin ? 'Yes' : 'No'}</td>
                  <td>
                    {user.admin ? (
                      <button 
                        className="demote-button"
                        onClick={() => demoteAdmin(user.id)}
                      >
                        Remove Admin
                      </button>
                    ) : (
                      <button 
                        className="promote-button"
                        onClick={() => promoteToAdmin(user.id)}
                      >
                        Make Admin
                      </button>
                    )}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersSection;