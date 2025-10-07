import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smile, Meh, Frown, TrendingUp, Calendar } from 'lucide-react';

const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { id: 'great', label: 'Great', icon: Smile, color: 'bg-green-100 text-green-600 hover:bg-green-200' },
    { id: 'good', label: 'Good', icon: Smile, color: 'bg-blue-100 text-blue-600 hover:bg-blue-200' },
    { id: 'okay', label: 'Okay', icon: Meh, color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' },
    { id: 'bad', label: 'Bad', icon: Frown, color: 'bg-orange-100 text-orange-600 hover:bg-orange-200' },
    { id: 'terrible', label: 'Terrible', icon: Frown, color: 'bg-red-100 text-red-600 hover:bg-red-200' },
  ];

  const handleSaveMood = () => {
    if (selectedMood) {
      console.log('Saving mood:', selectedMood);
      // API call would go here
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mood Tracker</h1>
          <p className="text-gray-600">Track your daily emotions and identify patterns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4 mb-6">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                      selectedMood === mood.id ? mood.color + ' ring-2 ring-offset-2 ring-healthcare-primary' : mood.color
                    }`}
                  >
                    <mood.icon className="w-8 h-8" />
                    <span className="text-sm font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>
              <Button 
                className="w-full bg-healthcare-primary hover:bg-blue-700"
                onClick={handleSaveMood}
                disabled={!selectedMood}
              >
                Save Mood
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Mood Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No mood data yet</p>
                <p className="text-sm text-gray-500 mt-2">Start tracking to see your mood patterns</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle>Why Track Your Mood?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-healthcare-primary mt-1">•</span>
                <span>Identify patterns and triggers in your emotional well-being</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-healthcare-primary mt-1">•</span>
                <span>Track progress over time and celebrate improvements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-healthcare-primary mt-1">•</span>
                <span>Share insights with your mental health professional</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MoodTracker;
