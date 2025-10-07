import { apiClient } from './apiClient';

export interface WellnessData {
  currentStreak: number;
  totalPoints: number;
  weeklyGoal: number;
  weeklyProgress: number;
  recentMoods: { date: string; mood: number; note?: string }[];
  achievements: { id: string; title: string; description: string; earned: boolean; date?: string }[];
  todaysChallenge: { id: string; title: string; description: string; completed: boolean };
}

export interface MoodEntry {
  mood: number;
  note?: string;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  date?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  points: number;
}

class WellnessService {
  async getWellnessData(): Promise<WellnessData> {
    try {
      const response = await apiClient.get('/wellness/data/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wellness data:', error);
      throw error;
    }
  }

  async addMoodEntry(moodEntry: MoodEntry): Promise<void> {
    try {
      await apiClient.post('/wellness/mood/', moodEntry);
    } catch (error) {
      console.error('Failed to add mood entry:', error);
      throw error;
    }
  }

  async completeChallenge(challengeId: string): Promise<void> {
    try {
      await apiClient.post(`/wellness/challenge/${challengeId}/complete/`);
    } catch (error) {
      console.error('Failed to complete challenge:', error);
      throw error;
    }
  }

  async getAchievements(): Promise<Achievement[]> {
    try {
      const response = await apiClient.get('/wellness/achievements/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      throw error;
    }
  }

  async getMoodHistory(days: number = 30): Promise<MoodEntry[]> {
    try {
      const response = await apiClient.get(`/wellness/mood/history/?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch mood history:', error);
      throw error;
    }
  }

  async getDailyChallenges(): Promise<Challenge[]> {
    try {
      const response = await apiClient.get('/wellness/challenges/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch daily challenges:', error);
      throw error;
    }
  }

  async updateWellnessGoal(goal: number): Promise<void> {
    try {
      await apiClient.put('/wellness/goal/', { weekly_goal: goal });
    } catch (error) {
      console.error('Failed to update wellness goal:', error);
      throw error;
    }
  }
}

export const wellnessService = new WellnessService();
