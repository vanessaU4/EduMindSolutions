import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, CheckCircle, Loader2 } from 'lucide-react';
import { userService } from '@/services/userService';
import { loadUserFromStorage } from '@/features/auth/authSlice';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { AppDispatch } from '@/app/store';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    try {
      setIsLoading(true);
      
      // Complete onboarding with minimal data
      await userService.completeOnboarding({
        age: user?.age || 18,
        gender: user?.gender || '',
        bio: user?.bio || '',
        is_anonymous_preferred: true,
        allow_peer_matching: true,
      });

      // Reload user data from storage to get updated onboarding status
      dispatch(loadUserFromStorage());

      toast({
        title: 'Success',
        description: 'Onboarding completed successfully!',
      });

      // Navigate based on role
      if (user?.role === 'guide') {
        navigate('/guide');
      } else if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete onboarding. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-healthcare-bg flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <Card className="healthcare-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-healthcare-primary rounded-full">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome to EduMindSolutions</CardTitle>
            <CardDescription>
              Let's set up your profile and get you started on your mental health journey
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Account created successfully</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Ready to get started</span>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              You're all set! Click below to access your personalized dashboard and begin your mental health journey.
            </p>
            <Button 
              className="healthcare-button-primary"
              onClick={handleContinue}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                'Continue to Dashboard'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
