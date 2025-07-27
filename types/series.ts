export interface SeriesInfo {
  id: string;
  title: string;
  description: string;
  poster: string;
  backdrop: string;
  year: number;
  rating: number;
  genre: string;
  totalSeasons: number;
}

export interface Season {
  season: number;
  title: string;
  year: number;
  description: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  uri: string;
  description: string;
  duration: number;
  thumbnail: string;
  airDate: string;
  episodeNumber: number;
}