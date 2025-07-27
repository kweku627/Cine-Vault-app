// ProfileApiService.ts

// Simple interface for what we actually need from the API
interface ApiUserResponse {
  id: string;
  username: string;
  email: string;
}

// Frontend user profile with hardcoded values
interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string; // hardcoded in frontend
  name: string;   // derived from username
}

export class ProfileApiService {
  private static baseUrl = 'http://10.133.19.135:8080';

  private static async fetchData<T>(endpoint: string): Promise<T> {
    try {
      const url = `${this.baseUrl}/${endpoint}`;
      console.log('📡 Fetching URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('📡 Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📡 Response data:', data);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching from ${endpoint}:`, error);
      throw error;
    }
  }

  // Get user profile using the existing /users/profile endpoint with JWT token
  static async getUserProfile(userId: string, authToken?: string): Promise<UserProfile> {
    try {
      console.log('🔍 Fetching user profile...');
      
      // If we have an auth token, use the /users/profile endpoint
      if (authToken) {
        try {
          console.log('🔑 Using authenticated profile endpoint');
          const apiData = await this.fetchDataWithAuth<ApiUserResponse>('users/profile', authToken);
          return this.transformUser(apiData);
        } catch (error) {
          console.log('❌ Authenticated profile endpoint failed, trying other methods...');
        }
      }
      
      // Fallback: try to get user by ID
      if (userId) {
        try {
          console.log('🔄 Trying to fetch by user ID:', userId);
          const apiData = await this.fetchData<ApiUserResponse>(`users/${userId}`);
          return this.transformUser(apiData);
        } catch (error) {
          console.log('❌ Specific user endpoint failed, trying to find in all users...');
        }
      }
      
      // Final fallback: get all users and find the one we want
      const users = await this.getAllUsers();
      if (users.length > 0) {
        // If we don't have a specific user, just use the first one for demo
        const user = userId ? users.find(u => u.id.toString() === userId) : users[0];
        
        if (!user) {
          throw new Error(`User with ID ${userId} not found`);
        }
        
        return this.transformUser(user);
      }
      
      throw new Error('No users found');
    } catch (error) {
      console.error('❌ Error in getUserProfile:', error);
      throw error;
    }
  }

  private static async fetchDataWithAuth<T>(endpoint: string, authToken: string): Promise<T> {
    try {
      const url = `${this.baseUrl}/${endpoint}`;
      console.log('📡 Fetching URL with auth:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('📡 Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📡 Response data:', data);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching from ${endpoint}:`, error);
      throw error;
    }
  }

  private static transformUser(apiData: ApiUserResponse): UserProfile {
    return {
      id: apiData.id,
      username: apiData.username,
      email: apiData.email,
      // Hardcoded avatar - you can change this URL
      avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      // Derive name from username or use username as name
      name: apiData.username.charAt(0).toUpperCase() + apiData.username.slice(1),
    };
  }

  // Alternative: Get all users and find by email (if needed)
  static async getAllUsers(): Promise<ApiUserResponse[]> {
    try {
      const data = await this.fetchData<ApiUserResponse[]>('users');
      return data;
    } catch (error) {
      console.error('❌ Error in getAllUsers:', error);
      throw error;
    }
  }

  // Find user by email from all users
  static async findUserByEmail(email: string): Promise<UserProfile | null> {
    try {
      console.log('🔍 Finding user by email:', email);
      const users = await this.getAllUsers();
      const apiUser = users.find((u: ApiUserResponse) => u.email === email);
      
      if (!apiUser) {
        console.log('❌ User not found with email:', email);
        return null;
      }
      
      // Transform to frontend format
      const userProfile: UserProfile = {
        id: apiUser.id,
        username: apiUser.username,
        email: apiUser.email,
        avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        name: apiUser.username.charAt(0).toUpperCase() + apiUser.username.slice(1),
      };
      
      console.log('✅ Found and transformed user by email:', userProfile);
      return userProfile;
    } catch (error) {
      console.error('❌ Error in findUserByEmail:', error);
      throw error;
    }
  }

  // Test connection
  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl);
      return response.status < 500;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }
}

export type { UserProfile, ApiUserResponse };