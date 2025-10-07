import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, TrendingUp, Calendar, Brain, 
  AlertTriangle, CheckCircle, Heart, Phone,
  FileText, ExternalLink
} from 'lucide-react';
import { Assessment, assessmentService } from '@/services/assessmentService';
import { useToast } from '@/hooks/use-toast';

const AssessmentResults: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessmentResult();
  }, [id]);

  const loadAssessmentResult = async () => {
    try {
      setLoading(true);
      const data = await assessmentService.getAssessmentResult(parseInt(id || '1'));
      setAssessment(data);
    } catch (error) {
      console.error('Failed to load assessment result:', error);
      toast({
        title: 'Error',
        description: 'Failed to load assessment result',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'minimal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'mild':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'moderately_severe':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'minimal':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'mild':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'moderate':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'moderately_severe':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'severe':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  const getScorePercentage = () => {
    if (!assessment) return 0;
    return (assessment.total_score / assessment.assessment_type.max_score) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-primary"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="container mx-auto px-4 py-8 pt-16 sm:pt-20 md:pt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Assessment Not Found</h1>
          <Button onClick={() => navigate('/assessments/history')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Button>
        </div>
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
        <Button
          variant="ghost"
          onClick={() => navigate('/assessments/history')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Assessment History
        </Button>

        <div className="mb-8 mt-4 sm:mt-6 md:mt-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Assessment Results</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Detailed results from your {assessment.assessment_type.display_name}
          </p>
        </div>

        {/* Score Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-healthcare-primary" />
              {assessment.assessment_type.display_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {assessment.total_score}
                </div>
                <div className="text-sm text-gray-600">
                  out of {assessment.assessment_type.max_score}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(getScorePercentage())}% of maximum
                </div>
              </div>
              
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getRiskLevelColor(assessment.risk_level)}`}>
                  {getRiskLevelIcon(assessment.risk_level)}
                  <span className="font-semibold capitalize">
                    {assessment.risk_level.replace('_', ' ')} Level
                  </span>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(assessment.completed_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Assessment Date
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Score Progress</span>
                <span>{assessment.total_score}/{assessment.assessment_type.max_score}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    assessment.risk_level === 'minimal' ? 'bg-green-500' :
                    assessment.risk_level === 'mild' ? 'bg-blue-500' :
                    assessment.risk_level === 'moderate' ? 'bg-yellow-500' :
                    assessment.risk_level === 'moderately_severe' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${getScorePercentage()}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interpretation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-healthcare-primary" />
              What Your Results Mean
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {assessment.interpretation}
            </p>
          </CardContent>
        </Card>

        {/* Crisis Alert */}
        {(assessment.risk_level === 'severe' || assessment.risk_level === 'moderately_severe') && (
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Important:</strong> Your results indicate significant symptoms that may benefit from professional support. 
              Consider reaching out to a mental health professional or crisis support service.
              <div className="mt-2 flex gap-2">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                  <Phone className="w-4 h-4 mr-2" />
                  Crisis Support: 988
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-healthcare-primary" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assessment.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-healthcare-primary" />
              Helpful Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="font-semibold text-gray-900 mb-2">Find a Therapist</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Connect with licensed mental health professionals in your area
                </p>
                <Button variant="outline" size="sm" onClick={() => navigate('/resources')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Resources
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="font-semibold text-gray-900 mb-2">Wellness Tools</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Access mood tracking, coping strategies, and self-care tools
                </p>
                <Button variant="outline" size="sm" onClick={() => navigate('/wellness')}>
                  <Heart className="w-4 h-4 mr-2" />
                  Wellness Center
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate('/assessments')}>
                Take Another Assessment
              </Button>
              <Button variant="outline" onClick={() => navigate('/assessments/history')}>
                View Assessment History
              </Button>
              <Button variant="outline" onClick={() => navigate('/community')}>
                Connect with Community
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AssessmentResults;
