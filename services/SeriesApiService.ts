import { Content } from '@/types/content';
import { getApiUrl } from './config';

// Define the new API response structure based on the provided JSON
interface ApiSeriesResponse {
  success: boolean;
  popular_count: number;
  page: number;
  results: ApiSeries[];
  trending_count: number;
  total_results: number;
}

// Define the new ApiSeries interface to match the new API structure
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
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  // Unified transform function
  private static transformToContent(apiData: any): any {
    if (!apiData || typeof apiData !== 'object') {
      console.error('Invalid apiData provided to transformToContent:', apiData);
      return null;
    }

    try {
    const poster = apiData.poster_path?.startsWith('http') ? apiData.poster_path : `https://image.tmdb.org/t/p/w500${apiData.poster_path || ''}`;
    const backdrop = apiData.poster_path?.startsWith('http') ? apiData.poster_path : `https://image.tmdb.org/t/p/w1280${apiData.poster_path || ''}`;
      
    return {
      id: apiData.id?.toString() || '',
        title: apiData.title || apiData.name || 'Unknown Series',
      posterPath: poster,
      backdropPath: backdrop,
      voteAverage: apiData.vote_average || 0,
      releaseDate: apiData.release_date || apiData.first_air_date || '',
        genre: apiData.genre || (Array.isArray(apiData.genres) ? apiData.genres[0] : 'Unknown'),
      duration: 45, // Default for series
      type: apiData.type || 'series',
        description: apiData.overview || 'No description available',
      videoUrl: apiData.video_link || '',
    };
    } catch (error) {
      console.error('Error in transformToContent:', error, apiData);
      return null;
    }
  }

  // Transform API series to Content format
  static transformApiSeriesToContent(apiSeries: ApiSeries): Content {
    if (!apiSeries || typeof apiSeries !== 'object') {
      console.error('Invalid apiSeries provided to transformApiSeriesToContent:', apiSeries);
      throw new Error('Invalid series data');
    }

    try {
    const poster = apiSeries.poster_path?.startsWith('http') ? apiSeries.poster_path : `https://image.tmdb.org/t/p/w500${apiSeries.poster_path || ''}`;
    const backdrop = apiSeries.poster_path?.startsWith('http') ? apiSeries.poster_path : `https://image.tmdb.org/t/p/w1280${apiSeries.poster_path || ''}`;
    
    // Extract year from first_air_date
    let year = new Date().getFullYear();
    if (apiSeries.first_air_date) {
      year = new Date(apiSeries.first_air_date).getFullYear();
    }
    
    return {
        id: apiSeries.id?.toString() || '',
        title: apiSeries.name || 'Unknown Series',
      poster: poster,
      backdrop: backdrop,
        rating: apiSeries.vote_average || 0,
        year: year,
        genre: apiSeries.genres?.[0] || 'Unknown',
      duration: 45, // Default for series
      type: 'series',
        description: apiSeries.overview || 'No description available',
        videoUri: apiSeries.video_link || '',
    };
    } catch (error) {
      console.error('Error in transformApiSeriesToContent:', error, apiSeries);
      throw error;
    }
  }

  // Get content by type (for series, this returns all series)
  static async getContentByType(type: string): Promise<{ content: ApiSeries[] }> {
    try {
    if (type === 'SERIES') {
      const data = await this.fetchData<ApiSeriesResponse>('popular');
        console.log('Series data received:', data);
        
        if (data && data.results && Array.isArray(data.results)) {
          console.log(`Found ${data.results.length} series`);
          return { content: data.results };
        } else {
          console.log('No results array found in response');
          return { content: [] };
        }
    }
    return { content: [] };
    } catch (error) {
      console.error('Error in getContentByType:', error);
      return { content: [] };
    }
  }

  // Get all genres from series
  static async getAllGenres(): Promise<string[]> {
    try {
      const data = await this.fetchData<ApiSeriesResponse>('popular');
      const allGenres = new Set<string>();
      
      if (data && data.results && Array.isArray(data.results)) {
        data.results.forEach(series => {
          if (series && series.genres && Array.isArray(series.genres)) {
            series.genres.forEach(genre => {
              if (genre && typeof genre === 'string') {
                allGenres.add(genre);
              }
            });
          }
        });
      }
      
      console.log('Extracted genres:', Array.from(allGenres));
      return Array.from(allGenres);
    } catch (error) {
      console.error('Failed to fetch genres:', error);
      return [];
    }
  }

  static async getFeaturedContent(): Promise<any[]> {
    try {
    const data = await this.fetchData<any>('popular');
      console.log('Featured content data:', data);
      
      if (data && data.results && Array.isArray(data.results)) {
        console.log(`Processing ${data.results.length} featured series`);
        return data.results.map((item: any) => {
          try {
            return this.transformToContent(item);
          } catch (transformError) {
            console.error('Error transforming series item:', transformError, item);
            return null;
          }
        }).filter(Boolean); // Remove null items
      } else {
        console.log('No results array found for featured content');
        return [];
      }
    } catch (error) {
      console.error('Error in getFeaturedContent:', error);
      return [];
    }
  }

  static async getCategories(): Promise<any[]> {
    const data = await this.fetchData<{ genres: { id: number; name: string }[] }>('genres');
    return data.genres.map(genre => ({ id: genre.id.toString(), name: genre.name, content: [] }));
  }

  static async getAllSeries(): Promise<any[]> {
    try {
    const data = await this.fetchData<any>('popular');
      console.log('All series data:', data);
      
      if (data && data.results && Array.isArray(data.results)) {
        console.log(`Processing ${data.results.length} series`);
        return data.results.map((item: any) => {
          try {
            return this.transformToContent(item);
          } catch (transformError) {
            console.error('Error transforming series item:', transformError, item);
            return null;
          }
        }).filter(Boolean); // Remove null items
      } else {
        console.log('No results array found for all series');
        return [];
      }
    } catch (error) {
      console.error('Error in getAllSeries:', error);
      return [];
    }
  }

  static async getSeriesById(id: string | number): Promise<any | null> {
    try {
    const data = await this.fetchData<any>(`${id}`);
      console.log('Raw series data received:', JSON.stringify(data));
      
      // Handle the nested structure where series data is under 'series' property
      const seriesData = data.series || data;
      
      if (!seriesData) {
        console.error('No series data found in response');
        return null;
      }
      
      return this.transformToContent(seriesData);
    } catch (error) {
      console.error('Error in getSeriesById:', error);
      return null;
    }
  }

  static async getSeriesWithEpisodes(id: string | number): Promise<any | null> {
    try {
    const data = await this.fetchData<any>(`${id}`);
      console.log('Raw series with episodes data received:', JSON.stringify(data));
      
      // Handle the nested structure where series data is under 'series' property
      const seriesData = data.series || data;
      
      if (!seriesData) {
        console.error('No series data found in response');
        return null;
      }
      
      return this.transformToContent(seriesData);
    } catch (error) {
      console.error('Error in getSeriesWithEpisodes:', error);
      return null;
    }
  }
}