import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, TrendingUp, Users, AlertTriangle, 
  Calendar, Brain, Heart, Target, Activity
} from 'lucide-react';
import { RoleGuard } from '@/components/RoleGuard';

interface AnalyticsData {
  clientEngagement: {
    totalClients: number;
    activeClients: number;
    assessmentsCompleted: number;
    averageEngagement: number;
  };
  riskAssessment: {
    lowRisk: number;
    mediumRisk: number;
    highRisk: number;
    criticalRisk: number;
  };
  interventions: {
    totalInterventions: number;
    successfulInterventions: number;
    escalations: number;
    averageResponseTime: number;
  };
  trends: {
    weeklyEngagement: number[];
    monthlyAssessments: number[];
    riskTrends: number[];
  };
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data - replace with real API call
  useEffect(() => {
    const mockData: AnalyticsData = {
      clientEngagement: {
        totalClients: 12,
        activeClients: 9,
        assessmentsCompleted: 47,
        averageEngagement: 78
      },
      riskAssessment: {
        lowRisk: 6,
        mediumRisk: 4,
        highRisk: 2,
        criticalRisk: 0
      },
      interventions: {
        totalInterventions: 23,
        successfulInterventions: 19,
        escalations: 2,
        averageResponseTime: 45
      },
      trends: {
        weeklyEngagement: [65, 72, 68, 75, 82, 78, 85],
        monthlyAssessments: [12, 15, 18, 22, 19, 25, 28, 31, 29, 33, 35, 38],
        riskTrends: [2, 1, 3, 2, 1, 2, 0]
      }
    };
    
    setTimeout(() => {
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-primary"></div>
      </div>
    );
  }

  if (!analyticsData) return null;

  const engagementStats = [
    { 
      label: 'Total Clients', 
      value: analyticsData.clientEngagement.totalClients, 
      icon: Users, 
      color: 'text-blue-600',
      change: '+2 this month'
    },
    { 
      label: 'Active Clients', 
      value: analyticsData.clientEngagement.activeClients, 
      icon: TrendingUp, 
      color: 'text-green-600',
      change: '+12% vs last month'
    },
    { 
      label: 'Assessments Completed', 
      value: analyticsData.clientEngagement.assessmentsCompleted, 
      icon: Brain, 
      color: 'text-purple-600',
      change: '+8 this week'
    },
    { 
      label: 'Avg Engagement', 
      value: `${analyticsData.clientEngagement.averageEngagement}%`, 
      icon: Target, 
      color: 'text-orange-600',
      change: '+5% improvement'
    },
  ];

  const riskStats = [
    { 
      label: 'Low Risk', 
      value: analyticsData.riskAssessment.lowRisk, 
      color: 'bg-green-100 text-green-800',
      percentage: (analyticsData.riskAssessment.lowRisk / analyticsData.clientEngagement.totalClients * 100).toFixed(0)
    },
    { 
      label: 'Medium Risk', 
      value: analyticsData.riskAssessment.mediumRisk, 
      color: 'bg-yellow-100 text-yellow-800',
      percentage: (analyticsData.riskAssessment.mediumRisk / analyticsData.clientEngagement.totalClients * 100).toFixed(0)
    },
    { 
      label: 'High Risk', 
      value: analyticsData.riskAssessment.highRisk, 
      color: 'bg-red-100 text-red-800',
      percentage: (analyticsData.riskAssessment.highRisk / analyticsData.clientEngagement.totalClients * 100).toFixed(0)
    },
    { 
      label: 'Critical Risk', 
      value: analyticsData.riskAssessment.criticalRisk, 
      color: 'bg-red-600 text-white',
      percentage: (analyticsData.riskAssessment.criticalRisk / analyticsData.clientEngagement.totalClients * 100).toFixed(0)
    },
  ];

  const interventionStats = [
    { 
      label: 'Total Interventions', 
      value: analyticsData.interventions.totalInterventions, 
      icon: Heart, 
      color: 'text-blue-600'
    },
    { 
      label: 'Successful', 
      value: analyticsData.interventions.successfulInterventions, 
      icon: Target, 
      color: 'text-green-600'
    },
    { 
      label: 'Escalations', 
      value: analyticsData.interventions.escalations, 
      icon: AlertTriangle, 
      color: 'text-red-600'
    },
    { 
      label: 'Avg Response Time', 
      value: `${analyticsData.interventions.averageResponseTime}min`, 
      icon: Calendar, 
      color: 'text-purple-600'
    },
  ];

  return (
    <RoleGuard requireGuide>
      <div className="container mx-auto px-4 py-8 pt-16 sm:pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 mt-4 sm:mt-6 md:mt-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base">Track client progress and intervention effectiveness</p>
          </div>

          {/* Time Range Selector */}
          <div className="flex justify-end mb-6">
            <div className="flex space-x-2">
              {['7d', '30d', '90d', '1y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    timeRange === range 
                      ? 'bg-healthcare-primary text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
                </button>
              ))}
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
              <TabsTrigger value="interventions">Interventions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {engagementStats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-xs text-green-600">{stat.change}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {riskStats.map((risk, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className={risk.color}>{risk.label}</Badge>
                            <span className="text-sm text-gray-600">{risk.percentage}%</span>
                          </div>
                          <span className="font-semibold">{risk.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Intervention Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {Math.round((analyticsData.interventions.successfulInterventions / analyticsData.interventions.totalInterventions) * 100)}%
                      </div>
                      <p className="text-gray-600 mb-4">Success Rate</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Successful: {analyticsData.interventions.successfulInterventions}</span>
                          <span>Total: {analyticsData.interventions.totalInterventions}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(analyticsData.interventions.successfulInterventions / analyticsData.interventions.totalInterventions) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Engagement Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {analyticsData.trends.weeklyEngagement.map((value, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div 
                          className="bg-blue-500 rounded-t"
                          style={{ 
                            height: `${(value / 100) * 200}px`,
                            width: '30px'
                          }}
                        ></div>
                        <span className="text-xs text-gray-600">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                        </span>
                        <span className="text-xs font-semibold">{value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {riskStats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                        <Badge className={stat.color}>{stat.label}</Badge>
                        <p className="text-sm text-gray-600 mt-2">{stat.percentage}% of clients</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="interventions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {interventionStats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                      </div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </RoleGuard>
  );
};

export default Analytics;
