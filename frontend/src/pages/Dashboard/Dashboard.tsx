import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Shield,
  Users,
  BookOpen,
  Phone,
  TrendingUp,
  Clock,
  Award,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    // Redirect authenticated users to their appropriate dashboard
    if (user?.role === 'guide') {
      window.location.href = '/guide';
      return null;
    } else if (user?.role === 'admin') {
      window.location.href = '/admin';
      return null;
    } else {
      window.location.href = '/dashboard';
      return null;
    }
  }

  const features = [
    {
      icon: Shield,
      title: 'Clinical Assessments',
      description: 'Evidence-based mental health screenings including PHQ-9, GAD-7, and PCL-5',
      href: '/assessments',
      color: 'bg-blue-500',
    },
    {
      icon: Users,
      title: 'Peer Support Community',
      description: 'Connect with others in a safe, moderated environment',
      href: '/community',
      color: 'bg-green-500',
    },
    {
      icon: Heart,
      title: 'Wellness Tools',
      description: 'Mood tracking, daily challenges, and self-care resources',
      href: '/wellness',
      color: 'bg-purple-500',
    },
    {
      icon: BookOpen,
      title: 'Educational Resources',
      description: 'Learn about mental health, coping strategies, and recovery',
      href: '/education',
      color: 'bg-orange-500',
    },
    {
      icon: Phone,
      title: 'Crisis Support',
      description: '24/7 crisis intervention and safety planning resources',
      href: '/crisis',
      color: 'bg-red-500',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your mental health journey with personalized insights',
      href: '/progress',
      color: 'bg-indigo-500',
    },
  ];



  return (
    <div className="min-h-screen bg-healthcare-bg">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24 sm:pt-28 md:pt-32 lg:pt-36">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full backdrop-blur-sm">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              EduMindSolutions
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-blue-100">
              Mental Health Platform for Youth
            </p>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 text-blue-200 max-w-3xl mx-auto px-4">
              A comprehensive, HIPAA-compliant platform providing evidence-based mental health 
              assessments, peer support, and crisis intervention services for youth aged 13-23.
            </p>
            
            {/* Compliance Badges */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-4">
              <Badge className="bg-green-600 text-white px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                HIPAA Compliant
              </Badge>
              <Badge className="bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                WCAG 2.1 AA
              </Badge>
              <Badge className="bg-purple-600 text-white px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Evidence-Based
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button size="lg" asChild className="bg-white text-blue-700 hover:bg-gray-100 text-sm sm:text-base">
                <Link to="/register">
                  Get Started Today
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </Button>
              
            </div>

     
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Mental Health Support
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides a full spectrum of mental health services designed specifically for youth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="healthcare-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild className="w-full">
                    <Link to={feature.href}>
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
