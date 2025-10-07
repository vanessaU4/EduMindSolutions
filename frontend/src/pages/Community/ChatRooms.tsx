import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, Users, Lock, Globe, 
  ArrowRight, Loader2 
} from 'lucide-react';
import { communityService, ChatRoom } from '@/services/communityService';
import { useToast } from '@/hooks/use-toast';

const ChatRooms: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadChatRooms();
  }, []);

  const loadChatRooms = async () => {
    try {
      setLoading(true);
      const data = await communityService.getChatRooms();
      setChatRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
      setChatRooms([]);
      toast({
        title: 'Error',
        description: 'Failed to load chat rooms',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = (roomId: number) => {
    toast({
      title: 'Joining chat room',
      description: 'Real-time chat functionality will be available soon',
    });
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Chat Rooms</h1>
          <p className="text-gray-600 text-sm sm:text-base">Join real-time conversations in safe, moderated spaces</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatRooms.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-12 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No chat rooms available</p>
                <p className="text-sm text-gray-500 mt-2">Check back soon for active chat rooms</p>
              </CardContent>
            </Card>
          ) : (
            chatRooms.map((room) => (
              <Card key={room.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    {room.is_moderated ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Lock className="w-3 h-3 mr-1" />
                        Moderated
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Globe className="w-3 h-3 mr-1" />
                        Open
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{room.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>0 / {room.max_participants} online</span>
                    </div>
                    {room.topic && (
                      <Badge variant="outline">{room.topic}</Badge>
                    )}
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => handleJoinRoom(room.id)}
                    disabled={!room.is_active}
                  >
                    Join Room
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle>Chat Room Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-healthcare-primary mt-1">•</span>
                <span>Be respectful and supportive of all participants</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-healthcare-primary mt-1">•</span>
                <span>Keep conversations focused on mental health support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-healthcare-primary mt-1">•</span>
                <span>Respect privacy - don't share personal information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-healthcare-primary mt-1">•</span>
                <span>Report any concerning behavior to moderators</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChatRooms;
