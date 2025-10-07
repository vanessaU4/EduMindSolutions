import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { assessmentService } from '@/services/assessmentService';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  text: string;
  options: { value: number; label: string }[];
}

interface Assessment {
  id: string;
  name: string;
  title: string;
  description: string;
  questions: Question[];
}

const TakeAssessment: React.FC = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadAssessment();
  }, [type]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      const data = await assessmentService.getAssessmentType(type || 'anxiety');
      setAssessment(data);
    } catch (error) {
      console.error('Failed to load assessment:', error);
      toast({
        title: 'Error',
        description: 'Failed to load assessment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (assessment && currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeAssessment = () => {
    setIsCompleted(true);
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, value) => sum + value, 0);
  };

  const getScoreInterpretation = (score: number) => {
    if (assessment?.id === 'gad7') {
      if (score <= 4) return { level: 'Minimal', color: 'text-green-600', description: 'Minimal anxiety' };
      if (score <= 9) return { level: 'Mild', color: 'text-yellow-600', description: 'Mild anxiety' };
      if (score <= 14) return { level: 'Moderate', color: 'text-orange-600', description: 'Moderate anxiety' };
      return { level: 'Severe', color: 'text-red-600', description: 'Severe anxiety' };
    } else {
      if (score <= 4) return { level: 'Minimal', color: 'text-green-600', description: 'Minimal depression' };
      if (score <= 9) return { level: 'Mild', color: 'text-yellow-600', description: 'Mild depression' };
      if (score <= 14) return { level: 'Moderate', color: 'text-orange-600', description: 'Moderate depression' };
      return { level: 'Severe', color: 'text-red-600', description: 'Severe depression' };
    }
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
          <Button onClick={() => navigate('/assessments')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessments
          </Button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const score = calculateScore();
    const interpretation = getScoreInterpretation(score);
    
    return (
      <div className="container mx-auto px-4 py-8 pt-16 sm:pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Assessment Complete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{assessment.title}</h3>
                <div className="text-3xl font-bold mb-2">
                  Score: {score}/{assessment.questions.length * 3}
                </div>
                <div className={`text-lg font-semibold ${interpretation.color}`}>
                  {interpretation.level} - {interpretation.description}
                </div>
              </div>

              {score >= 10 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Your score indicates you may benefit from speaking with a mental health professional. 
                    Consider reaching out for support.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/assessments')}>
                  View All Assessments
                </Button>
                <Button variant="outline" onClick={() => navigate('/assessments/history')}>
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQ = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;
  const currentAnswer = answers[currentQ.id];

  return (
    <div className="container mx-auto px-4 py-8 pt-16 sm:pt-20 md:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/assessments')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Assessments
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-healthcare-primary" />
              <div>
                <CardTitle className="text-xl">{assessment.title}</CardTitle>
                <p className="text-sm text-gray-600">{assessment.description}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Question {currentQuestion + 1} of {assessment.questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Over the last 2 weeks, how often have you been bothered by:
              </h3>
              <p className="text-gray-900 font-medium">{currentQ.text}</p>
            </div>

            <div className="space-y-3">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQ.id, option.value)}
                  className={`w-full p-4 text-left border rounded-lg transition-colors ${
                    currentAnswer === option.value
                      ? 'border-healthcare-primary bg-blue-50 text-healthcare-primary'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      currentAnswer === option.value
                        ? 'border-healthcare-primary bg-healthcare-primary'
                        : 'border-gray-300'
                    }`}>
                      {currentAnswer === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentAnswer === undefined}
                className="bg-healthcare-primary hover:bg-blue-700"
              >
                {currentQuestion === assessment.questions.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TakeAssessment;
