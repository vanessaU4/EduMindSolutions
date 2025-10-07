import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, Users, MessageCircle, Clock, 
  CheckCircle, Loader2, UserPlus 
} from 'lucide-react';
import { communityService, PeerSupportMatch } from '@/services/communityService';
import { useToast } from '@/hooks/use-toast';

const PeerSupport: React.FC = () => {
  const [matches, setMatches] = useState<PeerSupportMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await communityService.getPeerSupportMatches();
      setMatches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load peer support matches:', error);
      setMatches([]);
      toast({
        title: 'Error',
        description: 'Failed to load peer support matches',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSupport = async () => {
    try {
      await communityService.createPeerSupportRequest({
        preferred_topics: ['anxiety', 'stress'],
        preferred_age_range: '18-23',
        preferred_gender: '',
      });
      toast({
        title: 'Success',
        description: 'Support request submitted. We\'ll match you with a peer soon!',
      });
      loadMatches();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit support request',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-healthcare-primary" />
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
        <div className="mb-8 mt-4 sm:mt-6 md:mt-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Peer Support</h1>
          <p className="text-gray-600 text-sm sm:text-base">Connect with peers who understand what you're going through</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-600" />
                <span className="text-3xl font-bold text-gray-900">{matches.length}</span>
              </div>
              <p className="text-sm text-gray-600">Total Matches</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <MessageCircle className="w-8 h-8 text-green-600" />
                <span className="text-3xl font-bold text-gray-900">
                  {matches.filter(m => m.status === 'active').length}
                </span>
              </div>
              <p className="text-sm text-gray-600">Active Connections</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-orange-600" />
                <span className="text-3xl font-bold text-gray-900">
                  {matches.filter(m => m.status === 'pending').length}
                </span>
              </div>
              <p className="text-sm text-gray-600">Pending Matches</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-healthcare-primary" />
              Request Peer Support
            </CardTitle>
            <CardDescription>
              Get matched with someone who understands your experiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="bg-healthcare-primary hover:bg-blue-700"
              onClick={handleRequestSupport}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Request a Match
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Peer Support Connections</CardTitle>
          </CardHeader>
          <CardContent>
            {matches.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No peer support matches yet</p>
                <p className="text-sm text-gray-500 mt-2">Request a match to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">Peer Support Match</h3>
                        <Badge className={getStatusColor(match.status)}>
                          {match.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Topics: {match.preferred_topics.join(', ')}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Created: {new Date(match.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {match.status === 'active' && (
                      <Button variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PeerSupport;
