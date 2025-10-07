import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Upload, Video, Music, FileText, Image } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ContentUploadFormProps {
  contentType: 'article' | 'video' | 'audio';
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  categories: Array<{ id: number; name: string }>;
}

export const ContentUploadForm: React.FC<ContentUploadFormProps> = ({
  contentType,
  onSubmit,
  onCancel,
  categories
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    difficulty_level: 'beginner',
    estimated_read_time: '',
    duration_seconds: '',
    audio_type: 'meditation'
  });
  
  const [files, setFiles] = useState<{
    main_file?: File;
    thumbnail?: File;
    featured_image?: File;
  }>({});
  
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (file: File, type: 'main_file' | 'thumbnail' | 'featured_image') => {
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file, 'main_file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const submitData = new FormData();
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          submitData.append(key, value);
        }
      });
      
      // Add tags as array
      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map(tag => tag.trim());
        submitData.append('tags', JSON.stringify(tagsArray));
      }
      
      // Add files
      if (files.main_file) {
        if (contentType === 'video') {
          submitData.append('video_url', ''); // For uploaded files, we'll handle URL separately
        } else if (contentType === 'audio') {
          submitData.append('audio_file', files.main_file);
        }
      }
      
      if (files.thumbnail) {
        submitData.append('thumbnail_image', files.thumbnail);
      }
      
      if (files.featured_image && contentType === 'article') {
        submitData.append('featured_image', files.featured_image);
      }

      await onSubmit(submitData);
      setMessage({ type: 'success', text: 'Content uploaded successfully!' });
      
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload content' });
    } finally {
      setLoading(false);
    }
  };

  const getFileTypeIcon = () => {
    switch (contentType) {
      case 'video': return <Video className="h-8 w-8" />;
      case 'audio': return <Music className="h-8 w-8" />;
      case 'article': return <FileText className="h-8 w-8" />;
      default: return <Upload className="h-8 w-8" />;
    }
  };

  const getAcceptedFileTypes = () => {
    switch (contentType) {
      case 'video': return 'video/*';
      case 'audio': return 'audio/*';
      case 'article': return 'image/*';
      default: return '*/*';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileTypeIcon()}
              <div>
                <CardTitle>Upload {contentType.charAt(0).toUpperCase() + contentType.slice(1)}</CardTitle>
                <CardDescription>
                  Create new {contentType} content for the platform
                  {user?.role === 'guide' && (
                    <Badge variant="outline" className="ml-2">Requires Admin Approval</Badge>
                  )}
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {message && (
            <Alert className={`mb-4 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
              <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter content title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your content"
                rows={4}
                required
              />
            </div>

            {/* Content-specific fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty_level">Difficulty Level</Label>
                <Select value={formData.difficulty_level} onValueChange={(value) => handleInputChange('difficulty_level', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {contentType === 'article' && (
                <div className="space-y-2">
                  <Label htmlFor="estimated_read_time">Estimated Read Time (minutes)</Label>
                  <Input
                    id="estimated_read_time"
                    type="number"
                    value={formData.estimated_read_time}
                    onChange={(e) => handleInputChange('estimated_read_time', e.target.value)}
                    placeholder="5"
                  />
                </div>
              )}

              {(contentType === 'video' || contentType === 'audio') && (
                <div className="space-y-2">
                  <Label htmlFor="duration_seconds">Duration (seconds)</Label>
                  <Input
                    id="duration_seconds"
                    type="number"
                    value={formData.duration_seconds}
                    onChange={(e) => handleInputChange('duration_seconds', e.target.value)}
                    placeholder="300"
                  />
                </div>
              )}

              {contentType === 'audio' && (
                <div className="space-y-2">
                  <Label htmlFor="audio_type">Audio Type</Label>
                  <Select value={formData.audio_type} onValueChange={(value) => handleInputChange('audio_type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meditation">Guided Meditation</SelectItem>
                      <SelectItem value="breathing">Breathing Exercise</SelectItem>
                      <SelectItem value="podcast">Podcast Episode</SelectItem>
                      <SelectItem value="affirmation">Affirmations</SelectItem>
                      <SelectItem value="story">Calming Story</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="anxiety, coping, mindfulness"
              />
            </div>

            {/* File Upload Areas */}
            {(contentType === 'video' || contentType === 'audio') && (
              <div className="space-y-4">
                <Label>Main File *</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {files.main_file ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        {getFileTypeIcon()}
                        <span className="font-medium">{files.main_file.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {(files.main_file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFiles(prev => ({ ...prev, main_file: undefined }))}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {getFileTypeIcon()}
                      <p>Drag and drop your {contentType} file here, or click to browse</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={getAcceptedFileTypes()}
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'main_file')}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Thumbnail Upload */}
            <div className="space-y-4">
              <Label>Thumbnail Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {files.thumbnail ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Image className="h-6 w-6" />
                      <span className="font-medium">{files.thumbnail.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFiles(prev => ({ ...prev, thumbnail: undefined }))}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Image className="h-6 w-6 mx-auto" />
                    <p className="text-sm">Upload thumbnail image</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => thumbnailInputRef.current?.click()}
                    >
                      Choose Image
                    </Button>
                  </div>
                )}
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'thumbnail')}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !formData.title || !formData.description || !formData.category}
              >
                {loading ? 'Uploading...' : `Upload ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentUploadForm;
