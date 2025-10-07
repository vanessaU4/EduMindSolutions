import { apiClient } from './apiClient';

export interface ContentCategory {
  id: number;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  parent_category?: number;
  order: number;
  is_active: boolean;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: number;
  tags: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  author: number;
  author_name?: string;
  featured_image?: string;
  estimated_read_time: number;
  view_count: number;
  like_count: number;
  is_published: boolean;
  is_featured: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_image?: string;
  duration_seconds: number;
  category: number;
  tags: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  author: number;
  author_name?: string;
  view_count: number;
  like_count: number;
  is_published: boolean;
  is_featured: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AudioContent {
  id: number;
  title: string;
  description: string;
  audio_type: 'meditation' | 'breathing' | 'podcast' | 'affirmation' | 'story';
  audio_file?: string;
  audio_url?: string;
  duration_seconds: number;
  category: number;
  tags: string[];
  author: number;
  author_name?: string;
  thumbnail_image?: string;
  play_count: number;
  like_count: number;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MentalHealthResource {
  id: number;
  name: string;
  description: string;
  resource_type: 'clinic' | 'hospital' | 'psychologist' | 'psychiatrist' | 'counselor' | 'support_group' | 'crisis_line' | 'online_service';
  phone_number?: string;
  email?: string;
  website?: string;
  address?: string;
  city: string;
  state: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  services_offered: string[];
  specializations: string[];
  age_groups_served: string[];
  languages: string[];
  hours_of_operation: Record<string, string>;
  is_24_7: boolean;
  accepts_walk_ins: boolean;
  cost_level: 'free' | 'low_cost' | 'insurance' | 'private_pay';
  insurance_accepted: string[];
  is_verified: boolean;
  verification_date?: string;
  rating?: number;
  review_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class ContentService {
  // Categories
  async getContentCategories(): Promise<ContentCategory[]> {
    return apiClient.get<ContentCategory[]>('/content/categories/');
  }

  async createContentCategory(data: Partial<ContentCategory>): Promise<ContentCategory> {
    return apiClient.post<ContentCategory>('/content/categories/', data);
  }

  async updateContentCategory(id: number, data: Partial<ContentCategory>): Promise<ContentCategory> {
    return apiClient.patch<ContentCategory>(`/content/categories/${id}/`, data);
  }

  async deleteContentCategory(id: number): Promise<void> {
    return apiClient.delete<void>(`/content/categories/${id}/`);
  }

  // Articles
  async getArticles(params?: { category?: number; featured?: boolean; published?: boolean }): Promise<Article[]> {
    let endpoint = '/content/articles/manage/';
    const queryParams = new URLSearchParams();
    
    if (params?.category) queryParams.append('category', params.category.toString());
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.published !== undefined) queryParams.append('published', params.published.toString());
    
    const query = queryParams.toString();
    if (query) endpoint += `?${query}`;
    
    return apiClient.get<Article[]>(endpoint);
  }

  async getArticle(id: number): Promise<Article> {
    return apiClient.get<Article>(`/content/articles/manage/${id}/`);
  }

  async createArticle(data: Partial<Article>): Promise<Article> {
    return apiClient.post<Article>('/content/articles/manage/', data);
  }

  async updateArticle(id: number, data: Partial<Article>): Promise<Article> {
    return apiClient.patch<Article>(`/content/articles/manage/${id}/`, data);
  }

  async deleteArticle(id: number): Promise<void> {
    return apiClient.delete<void>(`/content/articles/manage/${id}/`);
  }

  async likeArticle(id: number): Promise<void> {
    return apiClient.post<void>(`/content/articles/manage/${id}/like/`);
  }

  // Videos
  async getVideos(params?: { category?: number; featured?: boolean; published?: boolean }): Promise<Video[]> {
    let endpoint = '/content/videos/manage/';
    const queryParams = new URLSearchParams();
    
    if (params?.category) queryParams.append('category', params.category.toString());
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.published !== undefined) queryParams.append('published', params.published.toString());
    
    const query = queryParams.toString();
    if (query) endpoint += `?${query}`;
    
    return apiClient.get<Video[]>(endpoint);
  }

  async getVideo(id: number): Promise<Video> {
    return apiClient.get<Video>(`/content/videos/manage/${id}/`);
  }

  async createVideo(data: Partial<Video>): Promise<Video> {
    return apiClient.post<Video>('/content/videos/manage/', data);
  }

  async updateVideo(id: number, data: Partial<Video>): Promise<Video> {
    return apiClient.patch<Video>(`/content/videos/manage/${id}/`, data);
  }

  async deleteVideo(id: number): Promise<void> {
    return apiClient.delete<void>(`/content/videos/manage/${id}/`);
  }

  // Audio Content
  async getAudioContent(params?: { category?: number; type?: string; published?: boolean }): Promise<AudioContent[]> {
    let endpoint = '/content/audio/manage/';
    const queryParams = new URLSearchParams();
    
    if (params?.category) queryParams.append('category', params.category.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.published !== undefined) queryParams.append('published', params.published.toString());
    
    const query = queryParams.toString();
    if (query) endpoint += `?${query}`;
    
    return apiClient.get<AudioContent[]>(endpoint);
  }

  async getAudio(id: number): Promise<AudioContent> {
    return apiClient.get<AudioContent>(`/content/audio/manage/${id}/`);
  }

  async createAudio(data: Partial<AudioContent>): Promise<AudioContent> {
    return apiClient.post<AudioContent>('/content/audio/manage/', data);
  }

  async updateAudio(id: number, data: Partial<AudioContent>): Promise<AudioContent> {
    return apiClient.patch<AudioContent>(`/content/audio/manage/${id}/`, data);
  }

  async deleteAudio(id: number): Promise<void> {
    return apiClient.delete<void>(`/content/audio/manage/${id}/`);
  }

  // Mental Health Resources
  async getResources(params?: { type?: string; city?: string; verified?: boolean }): Promise<MentalHealthResource[]> {
    let endpoint = '/content/resources/';
    const queryParams = new URLSearchParams();
    
    if (params?.type) queryParams.append('type', params.type);
    if (params?.city) queryParams.append('city', params.city);
    if (params?.verified !== undefined) queryParams.append('verified', params.verified.toString());
    
    const query = queryParams.toString();
    if (query) endpoint += `?${query}`;
    
    return apiClient.get<MentalHealthResource[]>(endpoint);
  }

  async getResource(id: number): Promise<MentalHealthResource> {
    return apiClient.get<MentalHealthResource>(`/content/resources/${id}/`);
  }

  async createResource(data: Partial<MentalHealthResource>): Promise<MentalHealthResource> {
    return apiClient.post<MentalHealthResource>('/content/resources/', data);
  }

  async updateResource(id: number, data: Partial<MentalHealthResource>): Promise<MentalHealthResource> {
    return apiClient.patch<MentalHealthResource>(`/content/resources/${id}/`, data);
  }

  async deleteResource(id: number): Promise<void> {
    return apiClient.delete<void>(`/content/resources/${id}/`);
  }
}

export const contentService = new ContentService();
export default contentService;
