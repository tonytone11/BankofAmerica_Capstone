import React from 'react';
import './UsersSection.css';

const UsersSection = ({ users }) => {
    return (
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
        </div>
    );
};

export default UsersSection;