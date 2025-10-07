import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, Users, AlertTriangle, MessageSquare, 
  BarChart3, FileText, ArrowRight 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { RoleBasedActionButtons } from '@/components/Assessments';
import { ContentActionButtons } from '@/components/Content';

const GuideDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Client Management',
      description: 'View and manage clients',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      path: '/guide/clients',
    },
    {
      title: 'Crisis Alerts',
      description: 'Monitor urgent cases',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-600',
      path: '/guide/crisis-alerts',
    },
    {
      title: 'Content Moderation',
      description: 'Review community posts',
      icon: MessageSquare,
      color: 'bg-purple-100 text-purple-600',
      path: '/guide/moderation',
    },
    {
      title: 'Analytics',
      description: 'View insights & reports',
      icon: BarChart3,
      color: 'bg-green-100 text-green-600',
      path: '/guide/analytics',
    },
  ];

  const stats = [
    { label: 'Active Clients', value: '0', icon: Users, color: 'text-blue-600' },
    { label: 'Pending Reviews', value: '0', icon: FileText, color: 'text-purple-600' },
    { label: 'Crisis Alerts', value: '0', icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Community Reports', value: '0', icon: MessageSquare, color: 'text-orange-600' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-16 sm:pt-20 md:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Section */}
        <div className="mb-8 mt-4 sm:mt-6 md:mt-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome, {user?.first_name || user?.username}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Professional dashboard for mental health guides</p>
        </div>

        {/* Assessment Management Actions */}
        <RoleBasedActionButtons variant="default" className="mb-4" />
        
        {/* Content Management Actions */}
        <ContentActionButtons variant="default" className="mb-8" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(action.path)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Professional Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Professional Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Access clinical guidelines, best practices, and professional development materials
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                View Resources
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Analytics & Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Review client progress, engagement metrics, and outcome data
              </p>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => navigate('/guide/analytics')}
              >
                View Analytics
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default GuideDashboard;
