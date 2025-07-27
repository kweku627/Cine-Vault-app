export interface Profile {
  id: string;
  name: string;
  avatar: string;
  isKids?: boolean;
}

let mockProfiles: Profile[] = [
  { id: '1', name: 'John', avatar: 'person-circle', isKids: false },
  { id: '2', name: 'Jane', avatar: 'person-circle-outline', isKids: true },
];

export const profileService = {
  async getAllProfiles(): Promise<Profile[]> {
    // Simulate API call
    return new Promise(resolve => setTimeout(() => resolve([...mockProfiles]), 300));
  },
  async createProfile(profile: Omit<Profile, 'id'>): Promise<Profile> {
    const newProfile = { ...profile, id: Date.now().toString() };
    mockProfiles.push(newProfile);
    return new Promise(resolve => setTimeout(() => resolve(newProfile), 300));
  },
  async updateProfile(id: string, updates: Partial<Omit<Profile, 'id'>>): Promise<Profile | null> {
    const idx = mockProfiles.findIndex(p => p.id === id);
    if (idx === -1) return null;
    mockProfiles[idx] = { ...mockProfiles[idx], ...updates };
    return new Promise(resolve => setTimeout(() => resolve(mockProfiles[idx]), 300));
  },
  async deleteProfile(id: string): Promise<boolean> {
    const initialLength = mockProfiles.length;
    mockProfiles = mockProfiles.filter(p => p.id !== id);
    return new Promise(resolve => setTimeout(() => resolve(mockProfiles.length < initialLength), 300));
  },
}; 