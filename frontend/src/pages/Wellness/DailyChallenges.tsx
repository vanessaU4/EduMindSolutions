import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle, Clock, Flame } from 'lucide-react';

const DailyChallenges: React.FC = () => {
  const challenges = [
    {
      id: 1,
      title: '5-Minute Meditation',
      description: 'Take a mindful break with guided meditation',
      category: 'Mindfulness',
      points: 10,
      completed: false,
      difficulty: 'Easy',
    },
    {
      id: 2,
      title: 'Gratitude Journal',
      description: 'Write down 3 things you\'re grateful for today',
      category: 'Reflection',
      points: 15,
      completed: false,
      difficulty: 'Easy',
    },
    {
      id: 3,
      title: 'Connect with a Friend',
      description: 'Reach out to someone you care about',
      category: 'Social',
      points: 20,
      completed: false,
      difficulty: 'Medium',
    },
    {
      id: 4,
      title: 'Physical Activity',
      description: 'Get 30 minutes of movement or exercise',
      category: 'Physical',
      points: 25,
      completed: false,
      difficulty: 'Medium',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Daily Challenges</h1>
          <p className="text-gray-600">Complete wellness activities and build healthy habits</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-blue-600" />
                <span className="text-3xl font-bold text-gray-900">0/4</span>
              </div>
              <p className="text-sm text-gray-600">Challenges Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Flame className="w-8 h-8 text-orange-600" />
                <span className="text-3xl font-bold text-gray-900">0</span>
              </div>
              <p className="text-sm text-gray-600">Day Streak</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-purple-600" />
                <span className="text-3xl font-bold text-gray-900">0</span>
              </div>
              <p className="text-sm text-gray-600">Points Earned</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Today's Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>0 of 4 challenges completed</span>
                <span>0%</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                      <Badge variant="outline">{challenge.category}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{challenge.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {challenge.points} points
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Today
                      </span>
                    </div>
                  </div>
                  <Button
                    variant={challenge.completed ? 'outline' : 'default'}
                    className={challenge.completed ? '' : 'bg-healthcare-primary hover:bg-blue-700'}
                  >
                    {challenge.completed ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      'Complete'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DailyChallenges;
