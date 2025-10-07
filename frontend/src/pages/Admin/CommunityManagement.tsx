import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, Users, Flag, Lock, Pin, Trash2, 
  Eye, Search, Loader2, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { communityService, ForumPost, ForumCategory } from '@/services/communityService';
import { RoleGuard } from '@/components/RoleGuard';
import { useToast } from '@/hooks/use-toast';

const CommunityManagement: React.FC = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, postsData] = await Promise.all([
        communityService.getForumCategories(),
        communityService.getForumPosts(),
      ]);
      setCategories(categoriesData);
      setPosts(postsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load community data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePinPost = async (id: number) => {
    try {
      await communityService.pinForumPost(id);
      await loadData();
      toast({
        title: 'Success',
        description: 'Post pinned successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to pin post',
        variant: 'destructive',
      });
    }
  };

  const handleLockPost = async (id: number) => {
    try {
      await communityService.lockForumPost(id);
      await loadData();
      toast({
        title: 'Success',
        description: 'Post locked successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to lock post',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await communityService.deleteForumPost(id);
      setPosts(posts.filter(p => p.id !== id));
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-healthcare-primary" />
      </div>
    );
  }

  return (
    <RoleGuard requireModeration>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Management</h1>
              <p className="text-gray-600">Moderate forums, posts, and community interactions</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Posts</p>
                    <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Categories</p>
                    <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Reports</p>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                  </div>
                  <Flag className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="posts">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="posts">
                <MessageSquare className="w-4 h-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="categories">
                <Users className="w-4 h-4 mr-2" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="reports">
                <Flag className="w-4 h-4 mr-2" />
                Reports
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts">
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                            {post.is_pinned && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                <Pin className="w-3 h-3 mr-1" />
                                Pinned
                              </Badge>
                            )}
                            {post.is_locked && (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                <Lock className="w-3 h-3 mr-1" />
                                Locked
                              </Badge>
                            )}
                            {!post.is_approved && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>By {post.author_display_name}</span>
                            <span>•</span>
                            <span>{post.view_count} views</span>
                            <span>•</span>
                            <span>{post.like_count} likes</span>
                            <span>•</span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePinPost(post.id)}
                          >
                            <Pin className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLockPost(post.id)}
                          >
                            <Lock className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredPosts.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">No posts found</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories">
              <div className="grid gap-4">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                          <p className="text-gray-600">{category.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={category.is_active ? 'default' : 'secondary'}>
                            {category.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {categories.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">No categories found</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports">
              <Card>
                <CardContent className="p-12 text-center">
                  <Flag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No pending reports</p>
                  <p className="text-sm text-gray-500 mt-2">Reported content will appear here for moderation</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </RoleGuard>
  );
};

export default CommunityManagement;
