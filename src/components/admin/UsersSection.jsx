import React from 'react';
import './UsersSection.css';

const UsersSection = ({ users, isLoading, error }) => {
  return (
    <div className="admin-section">
      <div className="section-header">
        <h1>Users Management</h1>
      </div>

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
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.username || `user_${user.id}`}</td>
                  <td>{user.email}</td>
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






