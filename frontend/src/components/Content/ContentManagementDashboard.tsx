import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Plus, FileText, Video, Music, Image, Eye, Edit, Trash2, 
  CheckCircle, XCircle, Clock, Search, Filter, Upload
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { RoleGuard } from '@/components/RoleGuard';
import ContentUploadForm from './ContentUploadForm';

interface ContentItem {
  id: number;
  title: string;
  description: string;
  author_name: string;
  category_name: string;
  is_published: boolean;
  view_count: number;
  like_count: number;
  created_at: string;
  featured_image?: string;
  thumbnail_image?: string;
}

interface ContentStats {
  total_articles: number;
  published_articles: number;
  total_videos: number;
  published_videos: number;
  total_audio: number;
  published_audio: number;
  pending_approval?: number;
}

export const ContentManagementDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [videos, setVideos] = useState<ContentItem[]>([]);
  const [audioContent, setAudioContent] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadForm, setShowUploadForm] = useState<'article' | 'video' | 'audio' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const statsResponse = await fetch('/api/content/stats/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch content
      const [articlesRes, videosRes, audioRes, categoriesRes] = await Promise.all([
        fetch('/api/content/articles/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        }),
        fetch('/api/content/videos/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        }),
        fetch('/api/content/audio/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        }),
        fetch('/api/content/categories/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        })
      ]);

      if (articlesRes.ok) {
        const articlesData = await articlesRes.json();
        setArticles(articlesData.results || articlesData);
      }

      if (videosRes.ok) {
        const videosData = await videosRes.json();
        setVideos(videosData.results || videosData);
      }

      if (audioRes.ok) {
        const audioData = await audioRes.json();
        setAudioContent(audioData.results || audioData);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.results || categoriesData);
      }

    } catch (error) {
      console.error('Error fetching content data:', error);
      setMessage({ type: 'error', text: 'Failed to load content data' });
    } finally {
      setLoading(false);
    }
  };

  const handleContentUpload = async (formData: FormData, contentType: 'article' | 'video' | 'audio') => {
    try {
      const response = await fetch(`/api/content/${contentType}s/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const message = user?.role === 'admin' 
          ? 'Content uploaded and published successfully!' 
          : 'Content uploaded successfully! It will be reviewed by an admin before publishing.';
        
        setMessage({ type: 'success', text: message });
        setShowUploadForm(null);
        fetchData();
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Failed to upload content' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    }
  };

  const handleContentAction = async (contentType: string, contentId: number, action: 'approve' | 'reject' | 'delete') => {
    try {
      let endpoint = '';
      let method = 'POST';

      if (action === 'delete') {
        endpoint = `/api/content/${contentType}s/${contentId}/`;
        method = 'DELETE';
      } else {
        endpoint = `/api/content/admin/approve/${contentType}/${contentId}/`;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: action !== 'delete' ? JSON.stringify({ action }) : undefined,
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Content ${action}d successfully!` });
        fetchData();
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || `Failed to ${action} content` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    }
  };

  const getStatusBadge = (isPublished: boolean) => {
    return isPublished ? (
      <Badge variant="default" className="bg-green-500">
        <CheckCircle className="h-3 w-3 mr-1" />
        Published
      </Badge>
    ) : (
      <Badge variant="secondary">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const renderContentList = (items: ContentItem[], contentType: string, icon: React.ReactNode) => {
    const filteredItems = items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-lg font-semibold capitalize">{contentType}s</h3>
            <Badge variant="outline">{filteredItems.length}</Badge>
          </div>
          
          <RoleGuard allowedRoles={['guide', 'admin']}>
            <Button 
              onClick={() => setShowUploadForm(contentType as 'article' | 'video' | 'audio')}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add {contentType}
            </Button>
          </RoleGuard>
        </div>

        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No {contentType}s found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      {(item.featured_image || item.thumbnail_image) && (
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          <Image className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{item.title}</h4>
                          {getStatusBadge(item.is_published)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>By {item.author_name}</span>
                          <span>{item.category_name}</span>
                          <span>{item.view_count} views</span>
                          <span>{item.like_count} likes</span>
                          <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <RoleGuard allowedRoles={['guide', 'admin']}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </RoleGuard>

                      <RoleGuard requireAdmin>
                        {!item.is_published && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleContentAction(contentType, item.id, 'approve')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleContentAction(contentType, item.id, 'reject')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleContentAction(contentType, item.id, 'delete')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </RoleGuard>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage articles, videos, and audio content</p>
        </div>
        
        <RoleGuard allowedRoles={['guide', 'admin']}>
          <div className="flex gap-2">
            <Button onClick={() => setShowUploadForm('article')} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Add Article
            </Button>
            <Button onClick={() => setShowUploadForm('video')} variant="outline">
              <Video className="h-4 w-4 mr-2" />
              Add Video
            </Button>
            <Button onClick={() => setShowUploadForm('audio')} variant="outline">
              <Music className="h-4 w-4 mr-2" />
              Add Audio
            </Button>
          </div>
        </RoleGuard>
      </div>

      {message && (
        <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.published_articles}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total_articles} total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.published_videos}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total_videos} total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Audio Content</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.published_audio}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total_audio} total
              </p>
            </CardContent>
          </Card>
          
          <RoleGuard requireAdmin>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending_approval || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting review
                </p>
              </CardContent>
            </Card>
          </RoleGuard>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          {renderContentList(articles, 'article', <FileText className="h-5 w-5" />)}
        </TabsContent>

        <TabsContent value="videos">
          {renderContentList(videos, 'video', <Video className="h-5 w-5" />)}
        </TabsContent>

        <TabsContent value="audio">
          {renderContentList(audioContent, 'audio', <Music className="h-5 w-5" />)}
        </TabsContent>
      </Tabs>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <ContentUploadForm
          contentType={showUploadForm}
          categories={categories}
          onSubmit={(formData) => handleContentUpload(formData, showUploadForm)}
          onCancel={() => setShowUploadForm(null)}
        />
      )}
    </div>
  );
};

export default ContentManagementDashboard;
