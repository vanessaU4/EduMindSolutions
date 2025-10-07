import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Video as VideoIcon, Music, FileText, Search, 
  Clock, Eye, Heart, Loader2, Play 
} from 'lucide-react';
import { contentService, Article, Video as VideoType, AudioContent } from '@/services/contentService';
import { useToast } from '@/hooks/use-toast';

const EducationCenter: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [audioContent, setAudioContent] = useState<AudioContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const [articlesData, videosData, audioData] = await Promise.all([
        contentService.getArticles({ published: true }),
        contentService.getVideos({ published: true }),
        contentService.getAudioContent({ published: true }),
      ]);
      setArticles(Array.isArray(articlesData) ? articlesData : []);
      setVideos(Array.isArray(videosData) ? videosData : []);
      setAudioContent(Array.isArray(audioData) ? audioData : []);
    } catch (error) {
      console.error('Failed to load educational content:', error);
      setArticles([]);
      setVideos([]);
      setAudioContent([]);
      toast({
        title: 'Error',
        description: 'Failed to load educational content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLikeArticle = async (id: number) => {
    try {
      await contentService.likeArticle(id);
      loadContent();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to like article',
        variant: 'destructive',
      });
    }
  };

  const filteredArticles = Array.isArray(articles) ? articles.filter(a =>
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const filteredVideos = Array.isArray(videos) ? videos.filter(v =>
    v.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const filteredAudio = Array.isArray(audioContent) ? audioContent.filter(a =>
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
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
        {/* Header */}
        <div className="mb-8 mt-4 sm:mt-6 md:mt-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Education Center</h1>
          <p className="text-gray-600 text-sm sm:text-base">Learn about mental health through articles, videos, and audio content</p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search educational content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="articles">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="articles">
              <FileText className="w-4 h-4 mr-2" />
              Articles ({Array.isArray(articles) ? articles.length : 0})
            </TabsTrigger>
            <TabsTrigger value="videos">
              <VideoIcon className="w-4 h-4 mr-2" />
              Videos ({Array.isArray(videos) ? videos.length : 0})
            </TabsTrigger>
            <TabsTrigger value="audio">
              <Music className="w-4 h-4 mr-2" />
              Audio ({Array.isArray(audioContent) ? audioContent.length : 0})
            </TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    {article.featured_image && (
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getDifficultyColor(article.difficulty_level)}>
                        {article.difficulty_level}
                      </Badge>
                      {article.is_featured && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.estimated_read_time} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {article.view_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {article.like_count}
                      </span>
                    </div>
                    <Button className="w-full" variant="outline">
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {filteredArticles.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No articles found</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="relative">
                      {video.thumbnail_image && (
                        <img
                          src={video.thumbnail_image}
                          alt={video.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-50 rounded-full p-4">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getDifficultyColor(video.difficulty_level)}>
                        {video.difficulty_level}
                      </Badge>
                      {video.is_featured && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {video.view_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {video.like_count}
                      </span>
                    </div>
                    <Button className="w-full" variant="outline">
                      Watch Video
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {filteredVideos.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <VideoIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No videos found</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Audio Tab */}
          <TabsContent value="audio">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAudio.map((audio) => (
                <Card key={audio.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    {audio.thumbnail_image && (
                      <img
                        src={audio.thumbnail_image}
                        alt={audio.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <Badge variant="outline" className="mb-2 w-fit">
                      {audio.audio_type.replace('_', ' ')}
                    </Badge>
                    <CardTitle className="text-lg">{audio.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{audio.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.floor(audio.duration_seconds / 60)}:{(audio.duration_seconds % 60).toString().padStart(2, '0')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        {audio.play_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {audio.like_count}
                      </span>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Play className="w-4 h-4 mr-2" />
                      Play Audio
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {filteredAudio.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Music className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No audio content found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default EducationCenter;
