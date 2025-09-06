export interface Track {
  id: number;
  title: string;
  description: string;
  genre: string;
  imageUrl: string;
  audioUrl: string;
}

export interface TrackData {
  image: File | null;
  audio: File | null;
  title: string;
  description: string;
  genre: string;
}
