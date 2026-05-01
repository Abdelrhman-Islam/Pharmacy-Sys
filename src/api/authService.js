import { BASE_URL } from './config';

export const authService = {
  // Register Function
  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Login Function
  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/auth/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  }
};