import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from './config';

export class AuthApiService {
  static async login({ email, password }: { email: string; password: string }) {
    console.log('Attempting login with:', { email, password: '***' });
    console.log('Login URL:', getApiUrl('users/login'));
    
    try {
      const response = await fetch(getApiUrl('users/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Login response status:', response.status);
      console.log('Login response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Login error response text:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.log('Failed to parse error response as JSON');
          throw { response: { data: { message: `HTTP ${response.status}: ${errorText}` } } };
        }
        
        // Improved error parsing: handle both message and field errors
        if (typeof errorData === 'object' && errorData !== null) {
          if (errorData.message) {
            throw { response: { data: { message: errorData.message } } };
          } else {
            // Field-specific errors (e.g., { email: 'Email already registered' })
            throw { response: { data: errorData } };
          }
        } else {
          throw { response: { data: { message: 'Invalid credentials' } } };
        }
      }
      
      const data = await response.json();
      console.log('Login success response:', { ...data, token: data.token ? '***' : 'no token' });
      
      const token = data.token;
      if (token) {
        await AsyncStorage.setItem('jwt_token', token);
        console.log('JWT token stored successfully');
      } else {
        console.warn('No JWT token in response');
      }

      // Store user ID if present
      if (data.user && data.user.id) {
        await AsyncStorage.setItem('user_id', String(data.user.id));
        console.log('User ID stored successfully');
      } else if (data.id) {
        await AsyncStorage.setItem('user_id', String(data.id));
        console.log('User ID stored successfully');
      } else {
        console.warn('No user ID in response');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error
        throw { response: { data: { message: 'Network error - please check your connection' } } };
      }
      throw error;
    }
  }

  static async register({ firstName, lastName, email, username, phoneNumber, dateOfBirth, password }: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    phoneNumber?: string;
    dateOfBirth: string;
    password: string;
  }) {
    console.log('Attempting registration with:', { 
      firstName, lastName, email, username, phoneNumber, dateOfBirth, password: '***' 
    });
    console.log('Register URL:', getApiUrl('users/register'));
    
    try {
      // Only send the fields that the backend RegisterRequest DTO expects
      const requestBody = {
        firstName,
        lastName,
        email,
        username,
        dateOfBirth,
        password,
      };
      
      console.log('Registration request body:', { ...requestBody, password: '***' });
      
      const response = await fetch(getApiUrl('users/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Register response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Register error response text:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.log('Failed to parse error response as JSON');
          throw { response: { data: { message: `HTTP ${response.status}: ${errorText}` } } };
        }
        
        // Improved error parsing: handle both message and field errors
        if (typeof errorData === 'object' && errorData !== null) {
          if (errorData.message) {
            throw { response: { data: { message: errorData.message } } };
          } else {
            // Field-specific errors (e.g., { email: 'Email already registered' })
            throw { response: { data: errorData } };
          }
        } else {
          throw { response: { data: { message: 'Registration failed' } } };
        }
      }
      
      const data = await response.json();
      console.log('Register success response:', { ...data, token: data.token ? '***' : 'no token' });
      
      const token = data.token;
      if (token) {
        await AsyncStorage.setItem('jwt_token', token);
        console.log('JWT token stored successfully');
      } else {
        console.warn('No JWT token in response');
      }

      // Store user ID if present
      if (data.user && data.user.id) {
        await AsyncStorage.setItem('user_id', String(data.user.id));
        console.log('User ID stored successfully');
      } else if (data.id) {
        await AsyncStorage.setItem('user_id', String(data.id));
        console.log('User ID stored successfully');
      } else {
        console.warn('No user ID in response');
      }
      
      return data;
    } catch (error) {
      console.error('Register error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error
        throw { response: { data: { message: 'Network error - please check your connection' } } };
      }
      throw error;
    }
  }

  static async sendPasswordResetOtp(email: string) {
    console.log('Attempting password reset for:', email);
    
    try {
      const response = await fetch(getApiUrl('users/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      console.log('Password reset response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Password reset error response text:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.log('Failed to parse error response as JSON');
          throw { response: { data: { message: `HTTP ${response.status}: ${errorText}` } } };
        }
        
        // Improved error parsing: handle both message and field errors
        if (typeof errorData === 'object' && errorData !== null) {
          if (errorData.message) {
            throw { response: { data: { message: errorData.message } } };
          } else {
            // Field-specific errors (e.g., { email: 'Email already registered' })
            throw { response: { data: errorData } };
          }
        } else {
          throw { response: { data: { message: 'Failed to send reset code' } } };
        }
      }
      
      const data = await response.json();
      console.log('Password reset success response:', data);
      return data;
    } catch (error) {
      console.error('Password reset error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error
        throw { response: { data: { message: 'Network error - please check your connection' } } };
      }
      throw error;
    }
  }

  static async getToken() {
    return AsyncStorage.getItem('jwt_token');
  }

  static async getUserId() {
    const id = await AsyncStorage.getItem('user_id');
    return id ? Number(id) : null;
  }

  static async logout() {
    await AsyncStorage.removeItem('jwt_token');
    await AsyncStorage.removeItem('user_id');
    console.log('JWT token removed');
  }
} 