export interface Track {
  id?: number;
  creatorId?: number;
  creator?: string;
  creatorImageUrl?: string;
  title?: string;
  description?: string;
  genre?: string;
  imageUrl?: string;
  audioUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrackData {
  image: File | null;
  audio: File | null;
  title: string;
  description: string;
  genre: string;
}
