const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

// Import auth functions - we'll need to get Firebase auth state
import { getAuth } from 'firebase/auth';
import firebaseApp from '@/lib/firebase';

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get Firebase auth headers if user is authenticated
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };

    // Add Firebase authentication headers if user is logged in
    if (user) {
        headers['x-firebase-uid'] = user.uid;
        headers['x-user-email'] = user.email || '';
        headers['x-user-name'] = user.displayName || '';
    }

    const config: RequestInit = {
        headers,
        ...options,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Network error' }));
            throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(0, 'Network error');
    }
}

export { apiRequest, ApiError };
export default apiRequest;