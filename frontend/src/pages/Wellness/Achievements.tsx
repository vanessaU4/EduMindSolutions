import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Trophy, Star, Target, Lock } from 'lucide-react';

const Achievements: React.FC = () => {
  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first assessment',
      icon: Star,
      unlocked: false,
      progress: 0,
      total: 1,
    },
    {
      id: 2,
      title: 'Mood Master',
      description: 'Track your mood for 7 consecutive days',
      icon: Target,
      unlocked: false,
      progress: 0,
      total: 7,
    },
    {
      id: 3,
      title: 'Community Builder',
      description: 'Make 5 forum posts',
      icon: Trophy,
      unlocked: false,
      progress: 0,
      total: 5,
    },
    {
      id: 4,
      title: 'Challenge Champion',
      description: 'Complete 10 daily challenges',
      icon: Award,
      unlocked: false,
      progress: 0,
      total: 10,
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Achievements</h1>
          <p className="text-gray-600">Track your progress and celebrate milestones</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <span className="text-3xl font-bold text-gray-900">0</span>
              </div>
              <p className="text-sm text-gray-600">Achievements Unlocked</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-8 h-8 text-blue-600" />
                <span className="text-3xl font-bold text-gray-900">0</span>
              </div>
              <p className="text-sm text-gray-600">Total Points</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-purple-600" />
                <span className="text-3xl font-bold text-gray-900">0%</span>
              </div>
              <p className="text-sm text-gray-600">Completion Rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`hover:shadow-lg transition-shadow ${
                achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                    achievement.unlocked 
                      ? 'bg-yellow-100' 
                      : 'bg-gray-100'
                  }`}>
                    {achievement.unlocked ? (
                      <achievement.icon className="w-8 h-8 text-yellow-600" />
                    ) : (
                      <Lock className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      {achievement.unlocked && (
                        <Badge className="bg-yellow-100 text-yellow-800">Unlocked</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-healthcare-primary h-2 rounded-full transition-all"
                          style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Achievements;
