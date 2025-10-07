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
  Star,
  UserCheck,
  Activity,
} from 'lucide-react';

const Home: React.FC = () => {
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

  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Youth Supported',
      color: 'text-blue-600',
    },
    {
      icon: UserCheck,
      value: '500+',
      label: 'Licensed Professionals',
      color: 'text-green-600',
    },
    {
      icon: Activity,
      value: '50,000+',
      label: 'Assessments Completed',
      color: 'text-purple-600',
    },
    {
      icon: Star,
      value: '4.9/5',
      label: 'User Satisfaction',
      color: 'text-orange-600',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      age: 19,
      quote: 'EduMindSolutions helped me understand my anxiety and connect with others who truly get it.',
      rating: 5,
    },
    {
      name: 'Alex T.',
      age: 21,
      quote: 'The crisis support feature was there when I needed it most. This platform saved my life.',
      rating: 5,
    },
    {
      name: 'Jordan K.',
      age: 17,
      quote: 'Finally, a mental health platform that speaks our language and respects our privacy.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-healthcare-bg">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              EduMindSolutions
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-blue-100">
              Mental Health Platform for Youth
            </p>
            <p className="text-lg mb-8 text-blue-200 max-w-3xl mx-auto">
              A comprehensive, HIPAA-compliant platform providing evidence-based mental health 
              assessments, peer support, and crisis intervention services for youth aged 13-23.
            </p>
            
            {/* Compliance Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-green-600 text-white px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                HIPAA Compliant
              </Badge>
              <Badge className="bg-blue-600 text-white px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                WCAG 2.1 AA
              </Badge>
              <Badge className="bg-purple-600 text-white px-4 py-2">
                <Heart className="w-4 h-4 mr-2" />
                Evidence-Based
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-blue-700 hover:bg-gray-100">
                <Link to="/register">
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-700">
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>

            {/* Crisis Alert */}
            <div className="mt-8 p-4 bg-red-600/20 border border-red-400/30 rounded-lg backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 text-red-100">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Crisis Support Available 24/7</span>
              </div>
              <p className="text-sm text-red-200 mt-1">
                Call 988 for immediate help or access our crisis resources
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
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

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600">
              Real stories from youth who found support through our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardDescription className="text-lg italic">
                    "{testimonial.quote}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-gray-900">
                    {testimonial.name}, Age {testimonial.age}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-healthcare-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Mental Health Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of youth who have found support, community, and healing through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-blue-700 hover:bg-gray-100">
              <Link to="/register">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-700">
              <Link to="/guide/verification">
                Join as Professional
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-blue-200">
            <p>Free to use • HIPAA Compliant • Available 24/7</p>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-8 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-xl font-bold">Crisis Support Available Now</h3>
          </div>
          <p className="mb-4">
            If you're experiencing a mental health crisis, help is available immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <div>
              <strong>National Suicide Prevention Lifeline:</strong> 988
            </div>
            <div>
              <strong>Crisis Text Line:</strong> Text HOME to 741741
            </div>
            <div>
              <strong>Emergency:</strong> 911
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
