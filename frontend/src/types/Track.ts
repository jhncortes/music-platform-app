export interface Track {
  id: number;
  title: string;
  description: string;
  genre: string;
  url: string;
}

export interface TrackData {
  image: File | null;
  title: string;
  description: string;
  genre: string;
}
