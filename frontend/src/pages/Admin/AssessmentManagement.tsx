import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ClipboardList, Users, TrendingUp, Activity, 
  Loader2, AlertCircle, CheckCircle2, AlertTriangle 
} from 'lucide-react';
import { assessmentService, Assessment, AssessmentType } from '@/services/assessmentService';
import { RoleGuard } from '@/components/RoleGuard';
import { useToast } from '@/hooks/use-toast';

const AssessmentManagement: React.FC = () => {
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([]);
  const [recentAssessments, setRecentAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssessments: 0,
    thisWeek: 0,
    highRisk: 0,
    averageScore: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const types = await assessmentService.getAssessmentTypes();
      setAssessmentTypes(types);
      
      // Note: This would need a proper admin endpoint to get all assessments
      // For now, we're just showing the structure
      setStats({
        totalAssessments: 0,
        thisWeek: 0,
        highRisk: 0,
        averageScore: 0,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load assessment data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'minimal':
        return 'bg-green-100 text-green-800';
      case 'mild':
        return 'bg-blue-100 text-blue-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderately_severe':
        return 'bg-orange-100 text-orange-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'minimal':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'mild':
      case 'moderate':
        return <AlertCircle className="w-4 h-4" />;
      case 'moderately_severe':
      case 'severe':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-healthcare-primary" />
      </div>
    );
  }

  return (
    <RoleGuard requireModeration>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Assessment Management</h1>
            <p className="text-gray-600">Monitor and manage mental health assessments</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Assessments</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalAssessments}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <ClipboardList className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">This Week</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.thisWeek}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">High Risk Cases</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.highRisk}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assessment Types */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Available Assessment Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {assessmentTypes.map((type) => (
                  <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{type.display_name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{type.total_questions} questions</span>
                        <span>•</span>
                        <span>Max score: {type.max_score}</span>
                        <span>•</span>
                        <Badge variant={type.is_active ? 'default' : 'secondary'}>
                          {type.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
                {assessmentTypes.length === 0 && (
                  <div className="text-center py-12">
                    <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No assessment types available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Assessments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAssessments.length === 0 && (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No recent assessments</p>
                    <p className="text-sm text-gray-500 mt-2">Assessment data will appear here once users start taking assessments</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </RoleGuard>
  );
};

export default AssessmentManagement;
