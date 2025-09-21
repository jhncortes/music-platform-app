export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  imageUrl: string;
  profile: UserProfile;
}

export interface UserProfile {
  id: number;
  username: string;
  name: string;
  imageUrl?: string;
  bio?: string;
}

export interface UserProfileData {
  bio: string;
  image: File | null;
}
