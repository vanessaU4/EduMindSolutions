import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ClipboardList, TrendingUp, Brain, Heart, Shield, 
  ArrowRight, Loader2, CheckCircle, Info 
} from 'lucide-react';
import { assessmentService, AssessmentType, Assessment } from '@/services/assessmentService';
import { useToast } from '@/hooks/use-toast';
import { RoleBasedActionButtons } from '@/components/Assessments';

const AssessmentCenter: React.FC = () => {
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([]);
  const [recentAssessments, setRecentAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [types, history] = await Promise.all([
        assessmentService.getAssessmentTypes(),
        assessmentService.getAssessmentHistory(),
      ]);
      setAssessmentTypes(Array.isArray(types) ? types : []);
      setRecentAssessments(Array.isArray(history) ? history.slice(0, 3) : []);
    } catch (error) {
      console.error('Failed to load assessments:', error);
      setAssessmentTypes([]);
      setRecentAssessments([]);
      toast({
        title: 'Error',
        description: 'Failed to load assessments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getAssessmentIcon = (name: string) => {
    switch (name) {
      case 'PHQ9':
        return <Brain className="w-8 h-8 text-blue-600" />;
      case 'GAD7':
        return <Heart className="w-8 h-8 text-purple-600" />;
      case 'PCL5':
        return <Shield className="w-8 h-8 text-green-600" />;
      default:
        return <ClipboardList className="w-8 h-8 text-gray-600" />;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-healthcare-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-16 sm:pt-20 md:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 mt-4 sm:mt-6 md:mt-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Assessment Center</h1>
          <p className="text-gray-600 text-sm sm:text-base">Evidence-based mental health assessments and screening tools</p>
        </div>

        {/* Role-based Action Buttons */}
        <RoleBasedActionButtons variant="card" className="mb-8" />

        {/* Important Notice */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            These assessments are screening tools and not diagnostic instruments. Results should be discussed with a mental health professional.
          </AlertDescription>
        </Alert>

        {/* Available Assessments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(assessmentTypes) && assessmentTypes.map((assessment) => (
              <Card key={assessment.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    {getAssessmentIcon(assessment.name)}
                    <Badge variant="secondary">{assessment.total_questions} questions</Badge>
                  </div>
                  <CardTitle className="text-xl">{assessment.display_name}</CardTitle>
                  <CardDescription>{assessment.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-healthcare-primary hover:bg-blue-700"
                    onClick={() => navigate(`/assessments/take/${assessment.id}`)}
                  >
                    Start Assessment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Assessments */}
        {recentAssessments.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Recent Assessments</h2>
              <Button 
                variant="outline" 
                onClick={() => navigate('/assessments/history')}
              >
                View All History
              </Button>
            </div>
            <div className="grid gap-4">
              {recentAssessments.map((assessment) => (
                <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {assessment.assessment_type.display_name}
                          </h3>
                          <Badge className={getRiskLevelColor(assessment.risk_level)}>
                            {assessment.risk_level.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{assessment.interpretation}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Score: {assessment.total_score}/{assessment.assessment_type.max_score}</span>
                          <span>•</span>
                          <span>{new Date(assessment.completed_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/assessments/results/${assessment.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Features Info */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle>Why Take Assessments?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Track Progress</h3>
                  <p className="text-sm text-gray-600">Monitor your mental health over time with regular assessments</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Get Recommendations</h3>
                  <p className="text-sm text-gray-600">Receive personalized resources based on your results</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Evidence-Based</h3>
                  <p className="text-sm text-gray-600">Clinically validated screening tools used by professionals</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AssessmentCenter;
