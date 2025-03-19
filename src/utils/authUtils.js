// utils/authUtils.js

// Function to get the authentication header with JWT token
export function getAuthHeader() {
  const token = localStorage.getItem('token');
  
  if (token) {
    return {
      'Authorization': `Bearer ${token}`
    };
  }
  
  return {};
}

// Function to check if user is authenticated
export function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}

// New function to check if user is an admin
export function isAdmin() {
  const user = getCurrentUser();
  if (!user) return false;
  
  console.log('User for admin check:', user);
  console.log('Admin status value:', user.isAdmin);
  console.log('Admin status type:', typeof user.isAdmin);
  
  // Handle different possible formats of the admin value
  return user.isAdmin === true || 
         user.isAdmin === 1 || 
         user.isAdmin === '1' || 
         user.isAdmin === 'true';
}

// Function to log out the user
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Redirect to login page
  window.location.href = '/login';
}

// Function to get the current user
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Error parsing user data", e);
      return null;
    }
  }
  return null;
}