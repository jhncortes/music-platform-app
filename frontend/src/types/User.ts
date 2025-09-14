export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  imageUrl: string;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  imageUrl: string;
  bio: string;
}

export interface UserProfileData {
  bio: string;
  imageFile: File | null;
}
