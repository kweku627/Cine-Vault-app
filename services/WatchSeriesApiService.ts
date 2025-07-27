import { SeriesInfo, Season, Episode } from '@/types/series';
import { getApiUrl } from './config';

// Define the new API series interface to match the provided JSON structure
interface ApiSeries {
  id: number;
  name: string;
  overview: string;
  status: string;
  type: string;
  genres: string[];
  networks: string[];
  poster_path: string;
  video_link: string;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  vote_count: number;
  number_of_seasons: number;
  number_of_episodes: number;
}

export class SeriesApiService {
  private static async fetchData<T>(endpoint: string): Promise<T> {
    const url = getApiUrl(`external-series/${endpoint}`);
    console.log('Fetching series data from:', url);
    
    try {
      const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
    } catch (error) {
      console.error('Failed to fetch series data:', error);
      throw error;
    }
  }

  static async getSeriesDetails(seriesId: string): Promise<{ seriesInfo: SeriesInfo; seasons: Season[] }> {
    try {
      const data = await this.fetchData<any>(`${seriesId}`);
      
      console.log('Raw series data received:', JSON.stringify(data));
      
      // Handle the nested structure where series data is under 'series' property
      const seriesData = data.series || data;
      
      if (!seriesData) {
        console.error('No series data found in response');
        throw new Error('No series data found');
      }
    
    // Transform the API data to match the frontend structure
    const seriesInfo: SeriesInfo = {
        id: seriesData.id?.toString() || seriesId,
        title: seriesData.name || 'Unknown Series',
        description: seriesData.overview || 'No description available',
        poster: seriesData.poster_path?.startsWith('http') ? seriesData.poster_path : `https://image.tmdb.org/t/p/w500${seriesData.poster_path || ''}`,
        backdrop: seriesData.poster_path?.startsWith('http') ? seriesData.poster_path : `https://image.tmdb.org/t/p/w1280${seriesData.poster_path || ''}`,
        year: seriesData.first_air_date ? new Date(seriesData.first_air_date).getFullYear() : new Date().getFullYear(),
        rating: seriesData.vote_average || 0,
        genre: seriesData.genres?.[0] || 'Unknown',
        totalSeasons: seriesData.number_of_seasons || 1,
    };

      console.log('Transformed series info:', seriesInfo);

    // Create mock seasons and episodes since the new API doesn't provide episode data
      const seasons: Season[] = this.createMockSeasons(seriesData);

    return { seriesInfo, seasons };
    } catch (error) {
      console.error('Error in getSeriesDetails:', error);
      throw error;
    }
  }

  private static createMockSeasons(seriesData: any): Season[] {
    const totalSeasons = seriesData.number_of_seasons || 1;
    const episodesPerSeason = Math.ceil((seriesData.number_of_episodes || 10) / totalSeasons);
    const seriesName = seriesData.name || 'Unknown Series';
    const firstAirDate = seriesData.first_air_date || new Date().toISOString().split('T')[0];
    const seriesId = seriesData.id || 'unknown';
    
    console.log(`Creating ${totalSeasons} seasons with ${episodesPerSeason} episodes each for series: ${seriesName}`);
    
    const seasons: Season[] = [];
    
    for (let seasonNum = 1; seasonNum <= totalSeasons; seasonNum++) {
      const seasonEpisodes: Episode[] = [];
      
      for (let episodeNum = 1; episodeNum <= episodesPerSeason; episodeNum++) {
        const episodeId = `${seasonNum}-${episodeNum}`;
        const videoUrl = seriesData.video_link ? 
          `${seriesData.video_link}/${seasonNum}/${episodeNum}` : 
          `https://vidsrc.to/embed/tv/${seriesId}/${seasonNum}/${episodeNum}`;
        
        seasonEpisodes.push({
          id: episodeId,
          title: `Episode ${episodeNum}`,
          uri: videoUrl,
          description: `Episode ${episodeNum} of ${seriesName}`,
          duration: 2700, // Default 45 minutes
          thumbnail: seriesData.poster_path?.startsWith('http') ? 
            seriesData.poster_path : 
            `https://image.tmdb.org/t/p/w500${seriesData.poster_path || ''}`,
          airDate: firstAirDate,
          episodeNumber: episodeNum,
        });
      }
      
      seasons.push({
        season: seasonNum,
        title: `Season ${seasonNum}`,
        year: new Date(firstAirDate).getFullYear() + (seasonNum - 1),
        description: `Season ${seasonNum} of ${seriesName}`,
        episodes: seasonEpisodes,
      });
    }
    
    console.log(`Created ${seasons.length} seasons with total ${seasons.reduce((acc, s) => acc + s.episodes.length, 0)} episodes`);
    return seasons;
  }
}