import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, MessageSquare, Heart, Video, 
  TrendingUp, Shield, ArrowRight 
} from 'lucide-react';

const CommunityHub: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Discussion Forums',
      description: 'Share experiences and connect with peers in moderated forums',
      icon: MessageSquare,
      color: 'bg-blue-100 text-blue-600',
      path: '/community/forums',
    },
    {
      title: 'Peer Support',
      description: 'Get matched with peers for one-on-one support',
      icon: Heart,
      color: 'bg-pink-100 text-pink-600',
      path: '/community/peer-support',
    },
    {
      title: 'Chat Rooms',
      description: 'Join real-time conversations in safe spaces',
      icon: Video,
      color: 'bg-purple-100 text-purple-600',
      path: '/community/chat',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Hub</h1>
          <p className="text-gray-600">Connect with others who understand your journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(feature.path)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Explore
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Safe & Supportive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                All community spaces are moderated by trained professionals to ensure a safe, 
                supportive environment for everyone.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-teal-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Active Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Join thousands of young people sharing their experiences, offering support, 
                and building connections.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default CommunityHub;
