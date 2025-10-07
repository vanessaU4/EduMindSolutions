import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, FileText, Video, Music, Edit, Eye, Upload,
  BookOpen, Library, Headphones, PlayCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface ContentActionButtonsProps {
  variant?: 'default' | 'compact' | 'card';
  className?: string;
}

export const ContentActionButtons: React.FC<ContentActionButtonsProps> = ({
  variant = 'default',
  className = '',
}) => {
  const { user, isGuide, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role === 'user') {
    // Regular users see content consumption buttons
    const userActions = [
      {
        icon: BookOpen,
        label: 'Browse Articles',
        description: 'Read educational articles',
        action: () => navigate('/education'),
        color: 'bg-blue-500 hover:bg-blue-600',
      },
      {
        icon: PlayCircle,
        label: 'Watch Videos',
        description: 'Educational video content',
        action: () => navigate('/education/videos'),
        color: 'bg-purple-500 hover:bg-purple-600',
      },
      {
        icon: Headphones,
        label: 'Listen to Audio',
        description: 'Guided meditations & podcasts',
        action: () => navigate('/wellness/audio'),
        color: 'bg-green-500 hover:bg-green-600',
      },
    ];

    if (variant === 'compact') {
      return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
          {userActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.action}
                size="sm"
                className={action.color}
              >
                <Icon className="h-4 w-4 mr-1" />
                {action.label}
              </Button>
            );
          })}
        </div>
      );
    }

    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2">
          <Library className="h-4 w-4 text-blue-500" />
          <span className="font-medium text-sm">Content Library</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {userActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.action}
                size="sm"
                className={`${action.color} text-white`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  const contentCreatorActions = [
    {
      icon: FileText,
      label: 'Create Article',
      description: 'Write educational articles',
      action: () => navigate('/content/manage'),
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: Video,
      label: 'Upload Video',
      description: 'Share video content',
      action: () => navigate('/content/manage'),
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      icon: Music,
      label: 'Upload Audio',
      description: 'Add audio content',
      action: () => navigate('/content/manage'),
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      icon: Edit,
      label: 'Manage Content',
      description: 'Edit and organize content',
      action: () => navigate('/content/manage'),
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  const adminActions = [
    {
      icon: Eye,
      label: 'Review Content',
      description: 'Approve pending content',
      action: () => navigate('/content/manage'),
      color: 'bg-indigo-500 hover:bg-indigo-600',
    },
    {
      icon: Library,
      label: 'Content Library',
      description: 'Manage all content',
      action: () => navigate('/content/manage'),
      color: 'bg-teal-500 hover:bg-teal-600',
    },
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {(isGuide || isAdmin) && (
          <>
            <Button
              onClick={() => navigate('/content/manage')}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Content
            </Button>
            <Button
              onClick={() => navigate('/content/manage')}
              size="sm"
              className="bg-purple-500 hover:bg-purple-600"
            >
              <Edit className="h-4 w-4 mr-1" />
              Manage Content
            </Button>
          </>
        )}
        {isAdmin && (
          <Button
            onClick={() => navigate('/content/manage')}
            size="sm"
            className="bg-indigo-500 hover:bg-indigo-600"
          >
            <Eye className="h-4 w-4 mr-1" />
            Review Content
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`space-y-4 ${className}`}>
        {(isGuide || isAdmin) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg">Content Creation</CardTitle>
                <Badge variant="secondary">{isGuide ? 'Guide' : 'Admin'}</Badge>
              </div>
              <CardDescription>
                Create and manage educational content
                {isGuide && (
                  <span className="block text-xs text-orange-600 mt-1">
                    Content requires admin approval before publishing
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {contentCreatorActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      onClick={action.action}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted"
                    >
                      <Icon className="h-6 w-6" />
                      <div className="text-center">
                        <div className="font-medium text-sm">{action.label}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-lg">Content Administration</CardTitle>
                <Badge variant="destructive">Admin</Badge>
              </div>
              <CardDescription>
                Administrative tools for content management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {adminActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      onClick={action.action}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted"
                    >
                      <Icon className="h-6 w-6" />
                      <div className="text-center">
                        <div className="font-medium text-sm">{action.label}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Default variant - horizontal button layout
  return (
    <div className={`space-y-4 ${className}`}>
      {(isGuide || isAdmin) && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-sm">Content Creation</span>
            <Badge variant="secondary" className="text-xs">{isGuide ? 'Guide' : 'Admin'}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {contentCreatorActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  onClick={action.action}
                  size="sm"
                  className={`${action.color} text-white`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-indigo-500" />
            <span className="font-medium text-sm">Content Administration</span>
            <Badge variant="destructive" className="text-xs">Admin</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {adminActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  onClick={action.action}
                  size="sm"
                  className={`${action.color} text-white`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentActionButtons;
