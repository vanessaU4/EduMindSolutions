import { apiClient } from './apiClient';
import { MockDataService } from './mockDataService';

export interface ForumCategory {
  id: number;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  order: number;
  created_at: string;
}

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: number;
  author_display_name: string;
  category: number;
  is_anonymous: boolean;
  is_pinned: boolean;
  is_locked: boolean;
  is_approved: boolean;
  view_count: number;
  like_count: number;
  author_mood?: string;
  created_at: string;
  updated_at: string;
  last_activity: string;
  comment_count?: number;
}

export interface ForumComment {
  id: number;
  post: number;
  author: number;
  author_display_name: string;
  content: string;
  parent_comment?: number;
  is_anonymous: boolean;
  is_approved: boolean;
  like_count: number;
  created_at: string;
  updated_at: string;
  replies?: ForumComment[];
}

export interface ChatRoom {
  id: number;
  name: string;
  description: string;
  topic?: string;
  max_participants: number;
  is_active: boolean;
  is_moderated: boolean;
  created_at: string;
  active_users?: number;
}

export interface ChatMessage {
  id: number;
  room: number;
  author: number;
  author_display_name: string;
  content: string;
  is_anonymous: boolean;
  is_system_message: boolean;
  created_at: string;
}

export interface PeerSupportMatch {
  id: number;
  requester: number;
  supporter?: number;
  preferred_topics: string[];
  preferred_age_range?: string;
  preferred_gender?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  matched_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  category: number;
  is_anonymous?: boolean;
  author_mood?: string;
}

export interface CreateCommentData {
  post: number;
  content: string;
  parent_comment?: number;
  is_anonymous?: boolean;
}

class CommunityService {
  // Forum Categories
  async getForumCategories(): Promise<ForumCategory[]> {
    try {
      return await apiClient.get<ForumCategory[]>('/community/categories/');
    } catch (error) {
      console.warn('Backend not available, using mock data for forum categories');
      return MockDataService.getForumCategories();
    }
  }

  async createForumCategory(data: Partial<ForumCategory>): Promise<ForumCategory> {
    return apiClient.post<ForumCategory>('/community/categories/', data);
  }

  async updateForumCategory(id: number, data: Partial<ForumCategory>): Promise<ForumCategory> {
    return apiClient.patch<ForumCategory>(`/community/categories/${id}/`, data);
  }

  async deleteForumCategory(id: number): Promise<void> {
    return apiClient.delete<void>(`/community/categories/${id}/`);
  }

  // Forum Posts
  async getForumPosts(categoryId?: number): Promise<ForumPost[]> {
    try {
      const endpoint = categoryId 
        ? `/community/posts/?category=${categoryId}` 
        : '/community/posts/';
      return await apiClient.get<ForumPost[]>(endpoint);
    } catch (error) {
      console.warn('Backend not available, using mock data for forum posts');
      return MockDataService.getForumPosts();
    }
  }

  async getForumPost(id: number): Promise<ForumPost> {
    return apiClient.get<ForumPost>(`/community/posts/${id}/`);
  }

  async createForumPost(data: CreatePostData): Promise<ForumPost> {
    return apiClient.post<ForumPost>('/community/posts/', data);
  }

  async updateForumPost(id: number, data: Partial<CreatePostData>): Promise<ForumPost> {
    return apiClient.patch<ForumPost>(`/community/posts/${id}/`, data);
  }

  async deleteForumPost(id: number): Promise<void> {
    return apiClient.delete<void>(`/community/posts/${id}/`);
  }

  async likeForumPost(id: number): Promise<void> {
    return apiClient.post<void>(`/community/posts/${id}/like/`);
  }

  async pinForumPost(id: number): Promise<ForumPost> {
    return apiClient.post<ForumPost>(`/community/posts/${id}/pin/`);
  }

  async lockForumPost(id: number): Promise<ForumPost> {
    return apiClient.post<ForumPost>(`/community/posts/${id}/lock/`);
  }

  // Forum Comments
  async getPostComments(postId: number): Promise<ForumComment[]> {
    return apiClient.get<ForumComment[]>(`/community/posts/${postId}/comments/`);
  }

  async createComment(data: CreateCommentData): Promise<ForumComment> {
    return apiClient.post<ForumComment>('/community/comments/', data);
  }

  async updateComment(id: number, data: Partial<CreateCommentData>): Promise<ForumComment> {
    return apiClient.patch<ForumComment>(`/community/comments/${id}/`, data);
  }

  async deleteComment(id: number): Promise<void> {
    return apiClient.delete<void>(`/community/comments/${id}/`);
  }

  async likeComment(id: number): Promise<void> {
    return apiClient.post<void>(`/community/comments/${id}/like/`);
  }

  // Chat Rooms
  async getChatRooms(): Promise<ChatRoom[]> {
    try {
      return await apiClient.get<ChatRoom[]>('/community/chatrooms/');
    } catch (error) {
      console.warn('Backend not available, using mock data for chat rooms');
      return MockDataService.getChatRooms();
    }
  }

  async getChatRoom(id: number): Promise<ChatRoom> {
    return apiClient.get<ChatRoom>(`/community/chatrooms/${id}/`);
  }

  async createChatRoom(data: Partial<ChatRoom>): Promise<ChatRoom> {
    return apiClient.post<ChatRoom>('/community/chatrooms/', data);
  }

  async getChatMessages(roomId: number): Promise<ChatMessage[]> {
    return apiClient.get<ChatMessage[]>(`/community/chatrooms/${roomId}/messages/`);
  }

  async sendChatMessage(roomId: number, content: string, isAnonymous: boolean = true): Promise<ChatMessage> {
    return apiClient.post<ChatMessage>(`/community/chatrooms/${roomId}/messages/`, {
      content,
      is_anonymous: isAnonymous,
    });
  }

  // Peer Support
  async getPeerSupportMatches(): Promise<PeerSupportMatch[]> {
    try {
      return await apiClient.get<PeerSupportMatch[]>('/community/peer-support/');
    } catch (error) {
      console.warn('Backend not available, using mock data for peer support matches');
      return MockDataService.getPeerSupportMatches();
    }
  }

  async createPeerSupportRequest(data: Partial<PeerSupportMatch>): Promise<PeerSupportMatch> {
    return apiClient.post<PeerSupportMatch>('/community/peer-support/', data);
  }

  async updatePeerSupportMatch(id: number, data: Partial<PeerSupportMatch>): Promise<PeerSupportMatch> {
    return apiClient.patch<PeerSupportMatch>(`/community/peer-support/${id}/`, data);
  }
}

export const communityService = new CommunityService();
export default communityService;
