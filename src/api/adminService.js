import { BASE_URL } from './config';
export const adminService = {
    getLatestUsers: async () => {
        try {
            // بنبعت طلب GET باستخدام Fetch
            const response = await fetch(`${BASE_URL}api/admin/get_latest_users.php?limit=5`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // بنبعت التوكن في الهيدر عشان الـ PHP يتأكد إنك أدمن
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // التأكد إن الـ Request نجح (status 200-299)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'حدث خطأ في السيرفر');
            }

            // تحويل الرد لـ JSON
            const data = await response.json();
            return data; 

        } catch (error) {
            console.error("Fetch Error:", error);
            throw error;
        }
    }
};