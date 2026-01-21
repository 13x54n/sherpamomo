const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Import Firebase auth for admin authentication
import { getAuth } from 'firebase/auth';
import firebaseApp from '@/lib/firebase';

interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { requiresAuth = false, ...fetchOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  // Add Firebase authentication headers if user is logged in
  try {
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

    if (user) {
      headers['x-firebase-uid'] = user.uid;
      headers['x-user-email'] = user.email || '';
      headers['x-user-name'] = user.displayName || '';
    }
  } catch (error) {
    // Silently fail if Firebase is not available
    console.warn('Firebase not available for admin API requests');
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export default apiRequest;