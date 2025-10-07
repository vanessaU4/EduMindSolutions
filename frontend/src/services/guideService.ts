import { apiClient } from './apiClient';
import { CrisisAlert } from './crisisService';

export interface Client {
  id: number;
  name: string;
  email: string;
  age: number;
  status: 'active' | 'at_risk' | 'inactive';
  lastAssessment: string;
  riskLevel: 'low' | 'medium' | 'high';
  lastContact: string;
  assignedDate: string;
  phone?: string;
  emergency_contact?: string;
  notes?: string;
}

export interface AnalyticsData {
  totalClients: number;
  activeClients: number;
  atRiskClients: number;
  assessmentsThisWeek: number;
  interventionsThisMonth: number;
  clientEngagement: {
    high: number;
    medium: number;
    low: number;
  };
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  monthlyTrends: {
    month: string;
    assessments: number;
    interventions: number;
  }[];
  interventionSuccess: {
    successful: number;
    ongoing: number;
    needsEscalation: number;
  };
}

export interface ClientContact {
  id: number;
  client_id: number;
  contact_type: 'phone' | 'email' | 'in_person' | 'video';
  notes: string;
  timestamp: string;
  outcome: 'positive' | 'neutral' | 'concerning';
}

class GuideService {
  async getClients(): Promise<Client[]> {
    try {
      const response = await apiClient.get('/guide/clients/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      throw error;
    }
  }

  async getClient(clientId: number): Promise<Client> {
    try {
      const response = await apiClient.get(`/guide/clients/${clientId}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch client:', error);
      throw error;
    }
  }

  async updateClient(clientId: number, updates: Partial<Client>): Promise<Client> {
    try {
      const response = await apiClient.put(`/guide/clients/${clientId}/`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update client:', error);
      throw error;
    }
  }

  async getCrisisAlerts(): Promise<CrisisAlert[]> {
    try {
      const response = await apiClient.get('/guide/crisis-alerts/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch crisis alerts:', error);
      throw error;
    }
  }

  async getAnalytics(timeRange: string = '30d'): Promise<AnalyticsData> {
    try {
      const response = await apiClient.get(`/guide/analytics/?range=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      throw error;
    }
  }

  async contactClient(clientId: number, contactData: Omit<ClientContact, 'id' | 'timestamp'>): Promise<void> {
    try {
      await apiClient.post('/guide/client-contact/', {
        ...contactData,
        client_id: clientId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log client contact:', error);
      throw error;
    }
  }

  async getClientContacts(clientId: number): Promise<ClientContact[]> {
    try {
      const response = await apiClient.get(`/guide/clients/${clientId}/contacts/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch client contacts:', error);
      throw error;
    }
  }

  async assignClient(clientId: number): Promise<void> {
    try {
      await apiClient.post(`/guide/clients/${clientId}/assign/`);
    } catch (error) {
      console.error('Failed to assign client:', error);
      throw error;
    }
  }

  async unassignClient(clientId: number, reason: string): Promise<void> {
    try {
      await apiClient.post(`/guide/clients/${clientId}/unassign/`, { reason });
    } catch (error) {
      console.error('Failed to unassign client:', error);
      throw error;
    }
  }

  async scheduleFollowUp(clientId: number, followUpDate: string, notes: string): Promise<void> {
    try {
      await apiClient.post('/guide/follow-ups/', {
        client_id: clientId,
        scheduled_date: followUpDate,
        notes: notes
      });
    } catch (error) {
      console.error('Failed to schedule follow-up:', error);
      throw error;
    }
  }

  async getFollowUps(): Promise<any[]> {
    try {
      const response = await apiClient.get('/guide/follow-ups/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch follow-ups:', error);
      throw error;
    }
  }
}

export const guideService = new GuideService();
