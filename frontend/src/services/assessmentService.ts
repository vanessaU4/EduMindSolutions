import { apiClient } from './apiClient';

export interface AssessmentType {
  id: number;
  name: string;
  display_name: string;
  description: string;
  instructions: string;
  total_questions: number;
  max_score: number;
  is_active: boolean;
  questions?: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: number;
  question_number: number;
  question_text: string;
  options: Array<{ text: string; score: number }>;
  is_reverse_scored: boolean;
}

export interface Assessment {
  id: number;
  user: number;
  assessment_type: AssessmentType;
  total_score: number;
  risk_level: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';
  interpretation: string;
  recommendations: any[];
  completed_at: string;
  percentage_score?: number;
}

export interface AssessmentResponse {
  question_id: number;
  selected_option_index: number;
}

export interface TakeAssessmentData {
  assessment_type_id: number;
  responses: AssessmentResponse[];
}

class AssessmentService {
  /**
   * Get all available assessment types
   */
  async getAssessmentTypes(): Promise<AssessmentType[]> {
    return apiClient.get<AssessmentType[]>('/assessments/types/');
  }

  /**
   * Get specific assessment type with questions
   */
  async getAssessmentType(id: number): Promise<AssessmentType> {
    return apiClient.get<AssessmentType>(`/assessments/types/${id}/`);
  }

  /**
   * Submit assessment responses
   */
  async submitAssessment(data: TakeAssessmentData): Promise<Assessment> {
    return apiClient.post<Assessment>('/assessments/submit/', data);
  }

  /**
   * Get user's assessment history
   */
  async getAssessmentHistory(): Promise<Assessment[]> {
    return apiClient.get<Assessment[]>('/assessments/history/');
  }

  /**
   * Get specific assessment result
   */
  async getAssessmentResult(id: number): Promise<Assessment> {
    return apiClient.get<Assessment>(`/assessments/results/${id}/`);
  }

  /**
   * Get recommendations for assessment type and risk level
   */
  async getRecommendations(assessmentType: string, riskLevel: string): Promise<any[]> {
    return apiClient.get<any[]>(
      `/assessments/recommendations/?assessment_type=${assessmentType}&risk_level=${riskLevel}`
    );
  }
}

export const assessmentService = new AssessmentService();
export default assessmentService;
