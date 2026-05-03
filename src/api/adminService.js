import { BASE_URL } from './config';

export const adminService = {
    getLatestUsers: async () => {
        try {
            // Fetch latest users
            const response = await fetch(`${BASE_URL}api/admin/get_latest_users.php?limit=5`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Auth token for admin verification
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });

            // Check for successful response
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Server error');
            }

            // Parse JSON response
            const data = await response.json();
            return data; 

        } catch (error) {
            console.error("Fetch Error:", error);
            throw error;
        }
    }
};