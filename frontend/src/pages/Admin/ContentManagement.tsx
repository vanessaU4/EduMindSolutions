import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, Star, Search, FileText, 
  Video as VideoIcon, Music, AlertTriangle, Loader2, CheckCircle 
} from 'lucide-react';
import { contentService, Article, Video as VideoType, AudioContent } from '@/services/contentService';
import { RoleGuard } from '@/components/RoleGuard';
import { useToast } from '@/hooks/use-toast';

const ContentManagement: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [audioContent, setAudioContent] = useState<AudioContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('articles');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const [articlesData, videosData, audioData] = await Promise.all([
        contentService.getArticles(),
        contentService.getVideos(),
        contentService.getAudioContent(),
      ]);
      setArticles(articlesData);
      setVideos(videosData);
      setAudioContent(audioData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: 'article' | 'video' | 'audio', id: number) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      if (type === 'article') {
        await contentService.deleteArticle(id);
        setArticles(articles.filter(a => a.id !== id));
      } else if (type === 'video') {
        await contentService.deleteVideo(id);
        setVideos(videos.filter(v => v.id !== id));
      } else {
        await contentService.deleteAudio(id);
        setAudioContent(audioContent.filter(a => a.id !== id));
      }
      
      toast({
        title: 'Success',
        description: 'Content deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete content',
        variant: 'destructive',
      });
    }
  };

  const handleTogglePublish = async (type: 'article' | 'video' | 'audio', id: number, currentStatus: boolean) => {
    try {
      if (type === 'article') {
        const updated = await contentService.updateArticle(id, { is_published: !currentStatus });
        setArticles(articles.map(a => a.id === id ? updated : a));
      } else if (type === 'video') {
        const updated = await contentService.updateVideo(id, { is_published: !currentStatus });
        setVideos(videos.map(v => v.id === id ? updated : v));
      } else {
        const updated = await contentService.updateAudio(id, { is_published: !currentStatus });
        setAudioContent(audioContent.map(a => a.id === id ? updated : a));
      }
      
      toast({
        title: 'Success',
        description: `Content ${!currentStatus ? 'published' : 'unpublished'} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update content',
        variant: 'destructive',
      });
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAudio = audioContent.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.description.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="container mx-auto px-4 py-8 pt-16 sm:pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 mt-4 sm:mt-6 md:mt-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Content Management</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage educational articles, videos, and audio content</p>
            </div>
            <Button className="bg-healthcare-primary hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Content
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="articles">
                <FileText className="w-4 h-4 mr-2" />
                Articles ({articles.length})
              </TabsTrigger>
              <TabsTrigger value="videos">
                <VideoIcon className="w-4 h-4 mr-2" />
                Videos ({videos.length})
              </TabsTrigger>
              <TabsTrigger value="audio">
                <Music className="w-4 h-4 mr-2" />
                Audio ({audioContent.length})
              </TabsTrigger>
            </TabsList>

            {/* Articles Tab */}
            <TabsContent value="articles">
              <div className="grid gap-4">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{article.title}</h3>
                            {article.is_featured && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {article.is_published ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                Draft
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{article.excerpt}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{article.estimated_read_time} min read</span>
                            <span>•</span>
                            <span>{article.view_count} views</span>
                            <span>•</span>
                            <span>{article.like_count} likes</span>
                            <span>•</span>
                            <Badge variant="outline">{article.difficulty_level}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTogglePublish('article', article.id, article.is_published)}
                          >
                            {article.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete('article', article.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredArticles.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">No articles found</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos">
              <div className="grid gap-4">
                {filteredVideos.map((video) => (
                  <Card key={video.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{video.title}</h3>
                            {video.is_featured && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {video.is_published ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                Draft
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{video.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}</span>
                            <span>•</span>
                            <span>{video.view_count} views</span>
                            <span>•</span>
                            <span>{video.like_count} likes</span>
                            <span>•</span>
                            <Badge variant="outline">{video.difficulty_level}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTogglePublish('video', video.id, video.is_published)}
                          >
                            {video.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete('video', video.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredVideos.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <VideoIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">No videos found</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Audio Tab */}
            <TabsContent value="audio">
              <div className="grid gap-4">
                {filteredAudio.map((audio) => (
                  <Card key={audio.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{audio.title}</h3>
                            {audio.is_published ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                Draft
                              </Badge>
                            )}
                            <Badge variant="outline">{audio.audio_type}</Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{audio.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{Math.floor(audio.duration_seconds / 60)}:{(audio.duration_seconds % 60).toString().padStart(2, '0')}</span>
                            <span>•</span>
                            <span>{audio.play_count} plays</span>
                            <span>•</span>
                            <span>{audio.like_count} likes</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTogglePublish('audio', audio.id, audio.is_published)}
                          >
                            {audio.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete('audio', audio.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredAudio.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Music className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">No audio content found</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </RoleGuard>
  );
};

export default ContentManagement;
