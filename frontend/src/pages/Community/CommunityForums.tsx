import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MessageSquare, Users, Heart, TrendingUp, 
  Plus, Search, Clock, Eye, ThumbsUp, 
  Shield, Pin, Lock, Flame
} from 'lucide-react';
import { communityService } from '@/services/communityService';
import { useToast } from '@/hooks/use-toast';

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
    isAnonymous: boolean;
  };
  category: string;
  replies: number;
  views: number;
  likes: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  lastActivity: string;
  tags: string[];
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  postCount: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CommunityForums: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    isAnonymous: false
  });

  useEffect(() => {
    loadForumData();
  }, []);

  const loadForumData = async () => {
    try {
      setLoading(true);
      const [categoriesData, postsData] = await Promise.all([
        communityService.getForumCategories(),
        communityService.getForumPosts()
      ]);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error('Failed to load forum data:', error);
      setCategories([]);
      setPosts([]);
      toast({
        title: 'Error',
        description: 'Failed to load forum data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreatePost = () => {
    if (newPost.title && newPost.content && newPost.category) {
      const userId = user?.id ? (typeof user.id === 'string' ? parseInt(user.id, 10) : user.id) : 0;
      const post: ForumPost = {
        id: posts.length + 1,
        title: newPost.title,
        content: newPost.content,
        author: {
          id: userId,
          name: newPost.isAnonymous ? 'Anonymous User' : (user?.first_name || user?.username || 'User'),
          isAnonymous: newPost.isAnonymous
        },
        category: newPost.category,
        replies: 0,
        views: 0,
        likes: 0,
        isPinned: false,
        isLocked: false,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        tags: []
      };

      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '', category: '', isAnonymous: false });
      setIsCreatePostOpen(false);
    }
  };

  const handleLikePost = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-primary"></div>
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Community Forums</h1>
          <p className="text-gray-600 text-sm sm:text-base">Connect with others, share experiences, and find support</p>
        </div>

        {/* Community Guidelines */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Community Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
              <div>• Be respectful and supportive</div>
              <div>• No medical advice or diagnosis</div>
              <div>• Maintain privacy and confidentiality</div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === category.id ? 'ring-2 ring-healthcare-primary' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="p-4 text-center">
                <category.icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                <Badge className={category.color} variant="secondary">
                  {category.postCount} posts
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
            <DialogTrigger asChild>
              <Button className="bg-healthcare-primary hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    placeholder="What's on your mind?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="Share your thoughts..."
                    rows={6}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={newPost.isAnonymous}
                    onChange={(e) => setNewPost({...newPost, isAnonymous: e.target.checked})}
                  />
                  <label htmlFor="anonymous" className="text-sm">Post anonymously</label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePost}>
                    Create Post
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setSelectedCategory('all')}>All Posts</TabsTrigger>
            <TabsTrigger value="trending">
              <Flame className="w-4 h-4 mr-1" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="pinned">
              <Pin className="w-4 h-4 mr-1" />
              Pinned
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>
                      {post.author.isAnonymous ? '?' : post.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {post.isPinned && <Pin className="w-4 h-4 text-blue-600" />}
                      {post.isLocked && <Lock className="w-4 h-4 text-gray-600" />}
                      <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 cursor-pointer">
                        {post.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>by {post.author.name}</span>
                        <span>•</span>
                        <span>{getTimeAgo(post.createdAt)}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {categories.find(c => c.id === post.category)?.name}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.replies}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </div>
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className="flex items-center space-x-1 hover:text-red-600 transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Be the first to start a discussion!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CommunityForums;
