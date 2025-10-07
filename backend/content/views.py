from rest_framework import generics, status, filters, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.utils import timezone
from accounts.permissions import IsGuideOrAdmin
from .models import (
    ContentCategory, Article, Video, AudioContent, MentalHealthResource,
    ContentEngagement, UserBookmark
)
from .serializers import (
    ContentCategorySerializer, ArticleSerializer, VideoSerializer,
    AudioContentSerializer, MentalHealthResourceSerializer
)

class EducationCenterView(generics.GenericAPIView):
    """
    Education center with mental health resources and learning materials.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'message': 'Welcome to the Education Center',
            'categories': [
                'Mental Health Basics',
                'Coping Strategies',
                'Self-Care Techniques',
                'Crisis Management',
                'Healthy Relationships'
            ],
            'featured_content': [
                {'id': 1, 'title': 'Understanding Anxiety', 'type': 'article'},
                {'id': 2, 'title': 'Breathing Exercises', 'type': 'video'},
                {'id': 3, 'title': 'Mindfulness Guide', 'type': 'toolkit'}
            ]
        })

class ResourceDirectoryView(generics.GenericAPIView):
    """
    Directory of mental health resources and external links.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'resource_categories': [
                {
                    'name': 'Crisis Resources',
                    'resources': [
                        {'name': 'National Suicide Prevention Lifeline', 'phone': '988', 'available': '24/7'},
                        {'name': 'Crisis Text Line', 'text': 'HOME to 741741', 'available': '24/7'}
                    ]
                }
            ]
        })

# COMPREHENSIVE CONTENT MANAGEMENT API ENDPOINTS

class ArticleListView(generics.ListCreateAPIView):
    """List and create articles"""
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'tags']
    ordering_fields = ['created_at', 'published_at', 'view_count', 'like_count']
    ordering = ['-published_at']
    
    def get_queryset(self):
        # Regular users see only published articles
        if self.request.user.role == 'user':
            return Article.objects.filter(is_published=True)
        # Guides and admins see all articles
        return Article.objects.all()
    
    def perform_create(self, serializer):
        # Only guides and admins can create articles
        if self.request.user.role not in ['guide', 'admin']:
            raise permissions.PermissionDenied("Only guides and admins can create articles")
        
        article = serializer.save(author=self.request.user)
        
        # Auto-publish for admins, require approval for guides
        if self.request.user.role == 'admin':
            article.is_published = True
            article.published_at = timezone.now()
            article.save()

class ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete an article"""
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'user':
            return Article.objects.filter(is_published=True)
        return Article.objects.all()
    
    def get_object(self):
        obj = super().get_object()
        # Increment view count for published articles
        if obj.is_published and self.request.method == 'GET':
            obj.view_count += 1
            obj.save(update_fields=['view_count'])
        return obj
    
    def perform_update(self, serializer):
        # Only author, guides, and admins can update
        if (self.request.user != serializer.instance.author and 
            self.request.user.role not in ['guide', 'admin']):
            raise permissions.PermissionDenied("Permission denied")
        serializer.save()
    
    def perform_destroy(self, instance):
        # Only author and admins can delete
        if (self.request.user != instance.author and 
            self.request.user.role != 'admin'):
            raise permissions.PermissionDenied("Permission denied")
        instance.delete()

class VideoListView(generics.ListCreateAPIView):
    """List and create videos with upload capability"""
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'tags']
    ordering = ['-published_at']
    
    def get_queryset(self):
        if self.request.user.role == 'user':
            return Video.objects.filter(is_published=True)
        return Video.objects.all()
    
    def perform_create(self, serializer):
        if self.request.user.role not in ['guide', 'admin']:
            raise permissions.PermissionDenied("Only guides and admins can create videos")
        
        video = serializer.save(author=self.request.user)
        
        if self.request.user.role == 'admin':
            video.is_published = True
            video.published_at = timezone.now()
            video.save()

class VideoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a video"""
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        if self.request.user.role == 'user':
            return Video.objects.filter(is_published=True)
        return Video.objects.all()
    
    def get_object(self):
        obj = super().get_object()
        if obj.is_published and self.request.method == 'GET':
            obj.view_count += 1
            obj.save(update_fields=['view_count'])
        return obj
    
    def perform_update(self, serializer):
        if (self.request.user != serializer.instance.author and 
            self.request.user.role not in ['guide', 'admin']):
            raise permissions.PermissionDenied("Permission denied")
        serializer.save()
    
    def perform_destroy(self, instance):
        if (self.request.user != instance.author and 
            self.request.user.role != 'admin'):
            raise permissions.PermissionDenied("Permission denied")
        instance.delete()

class AudioContentListView(generics.ListCreateAPIView):
    """List and create audio content with upload capability"""
    serializer_class = AudioContentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'tags']
    ordering = ['-published_at']
    
    def get_queryset(self):
        audio_type = self.request.query_params.get('type')
        queryset = AudioContent.objects.filter(is_published=True) if self.request.user.role == 'user' else AudioContent.objects.all()
        
        if audio_type:
            queryset = queryset.filter(audio_type=audio_type)
        
        return queryset
    
    def perform_create(self, serializer):
        if self.request.user.role not in ['guide', 'admin']:
            raise permissions.PermissionDenied("Only guides and admins can create audio content")
        
        audio = serializer.save(author=self.request.user)
        
        if self.request.user.role == 'admin':
            audio.is_published = True
            audio.published_at = timezone.now()
            audio.save()

class AudioContentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete audio content"""
    serializer_class = AudioContentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        if self.request.user.role == 'user':
            return AudioContent.objects.filter(is_published=True)
        return AudioContent.objects.all()
    
    def get_object(self):
        obj = super().get_object()
        if obj.is_published and self.request.method == 'GET':
            obj.play_count += 1
            obj.save(update_fields=['play_count'])
        return obj
    
    def perform_update(self, serializer):
        if (self.request.user != serializer.instance.author and 
            self.request.user.role not in ['guide', 'admin']):
            raise permissions.PermissionDenied("Permission denied")
        serializer.save()
    
    def perform_destroy(self, instance):
        if (self.request.user != instance.author and 
            self.request.user.role != 'admin'):
            raise permissions.PermissionDenied("Permission denied")
        instance.delete()

# ADMIN CONTENT MANAGEMENT

class AdminContentApprovalView(APIView):
    """Admin can approve/reject content"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, content_type, content_id):
        if request.user.role != 'admin':
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        
        action = request.data.get('action')  # 'approve' or 'reject'
        
        try:
            if content_type == 'article':
                content = Article.objects.get(id=content_id)
            elif content_type == 'video':
                content = Video.objects.get(id=content_id)
            elif content_type == 'audio':
                content = AudioContent.objects.get(id=content_id)
            else:
                return Response({'error': 'Invalid content type'}, status=status.HTTP_400_BAD_REQUEST)
            
            if action == 'approve':
                content.is_published = True
                content.published_at = timezone.now()
                content.save()
                return Response({'message': f'{content_type.title()} approved and published'})
            elif action == 'reject':
                content.is_published = False
                content.published_at = None
                content.save()
                return Response({'message': f'{content_type.title()} rejected'})
            else:
                return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
                
        except (Article.DoesNotExist, Video.DoesNotExist, AudioContent.DoesNotExist):
            return Response({'error': 'Content not found'}, status=status.HTTP_404_NOT_FOUND)

class ContentCategoryListView(generics.ListCreateAPIView):
    """List and create content categories"""
    serializer_class = ContentCategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ContentCategory.objects.filter(is_active=True)
    
    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        serializer.save()

class AdminContentCategoryView(generics.ListCreateAPIView):
    """Admin management of content categories"""
    serializer_class = ContentCategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        return ContentCategory.objects.all()
    
    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        serializer.save()

class AdminContentCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin can update/delete content categories"""
    serializer_class = ContentCategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        return ContentCategory.objects.all()

# CONTENT ENGAGEMENT

class ContentEngagementView(APIView):
    """Track content engagement (likes, bookmarks, etc.)"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        content_type = request.data.get('content_type')
        content_id = request.data.get('content_id')
        action_type = request.data.get('action_type')
        
        if not all([content_type, content_id, action_type]):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create or update engagement record
        engagement, created = ContentEngagement.objects.get_or_create(
            user=request.user,
            content_type=content_type,
            content_id=content_id,
            action_type=action_type
        )
        
        if action_type == 'like':
            # Update like count on content
            try:
                if content_type == 'article':
                    content = Article.objects.get(id=content_id)
                    if created:
                        content.like_count += 1
                    else:
                        engagement.delete()
                        content.like_count = max(0, content.like_count - 1)
                    content.save()
                elif content_type == 'video':
                    content = Video.objects.get(id=content_id)
                    if created:
                        content.like_count += 1
                    else:
                        engagement.delete()
                        content.like_count = max(0, content.like_count - 1)
                    content.save()
                elif content_type == 'audio':
                    content = AudioContent.objects.get(id=content_id)
                    if created:
                        content.like_count += 1
                    else:
                        engagement.delete()
                        content.like_count = max(0, content.like_count - 1)
                    content.save()
                
                return Response({
                    'liked': created,
                    'message': 'Content liked' if created else 'Like removed'
                })
                
            except (Article.DoesNotExist, Video.DoesNotExist, AudioContent.DoesNotExist):
                return Response({'error': 'Content not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'message': 'Engagement recorded'})

class UserBookmarkView(generics.ListCreateAPIView):
    """User bookmarks for content"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserBookmark.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# CONTENT STATISTICS

class ContentStatsView(APIView):
    """Content management statistics"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user_role = request.user.role
        
        if user_role not in ['guide', 'admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        stats = {
            'total_articles': Article.objects.count(),
            'published_articles': Article.objects.filter(is_published=True).count(),
            'total_videos': Video.objects.count(),
            'published_videos': Video.objects.filter(is_published=True).count(),
            'total_audio': AudioContent.objects.count(),
            'published_audio': AudioContent.objects.filter(is_published=True).count(),
        }
        
        if user_role == 'admin':
            stats.update({
                'pending_approval': (
                    Article.objects.filter(is_published=False).count() +
                    Video.objects.filter(is_published=False).count() +
                    AudioContent.objects.filter(is_published=False).count()
                ),
                'total_categories': ContentCategory.objects.count(),
                'total_engagements': ContentEngagement.objects.count(),
            })
        
        return Response(stats)


# Additional Views for Content Management

class MentalHealthResourceListView(generics.ListAPIView):
    """List mental health resources"""
    permission_classes = [IsAuthenticated]
    serializer_class = MentalHealthResourceSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'city', 'state']
    ordering_fields = ['name', 'rating']
    ordering = ['-rating']

    def get_queryset(self):
        queryset = MentalHealthResource.objects.filter(is_verified=True)
        resource_type = self.request.query_params.get('type', None)
        city = self.request.query_params.get('city', None)
        
        if resource_type:
            queryset = queryset.filter(resource_type=resource_type)
        if city:
            queryset = queryset.filter(city__icontains=city)
        
        return queryset

# Full CRUD Views for Content Management

class ArticleListCreateView(generics.ListCreateAPIView):
    """List all articles or create new article"""
    serializer_class = ArticleSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['created_at', 'view_count', 'like_count']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsGuideOrAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Article.objects.all()
        
        # Filter by published status for regular users
        if self.request.user.role == 'user':
            queryset = queryset.filter(is_published=True)
        
        # Optional filters
        category = self.request.query_params.get('category', None)
        featured = self.request.query_params.get('featured', None)
        published = self.request.query_params.get('published', None)
        
        if category:
            queryset = queryset.filter(category=category)
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')
        if published is not None:
            queryset = queryset.filter(is_published=published.lower() == 'true')
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete article"""
    serializer_class = ArticleSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsGuideOrAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.role in ['guide', 'admin']:
            return Article.objects.all()
        return Article.objects.filter(is_published=True)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.view_count += 1
        instance.save(update_fields=['view_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class VideoListCreateView(generics.ListCreateAPIView):
    """List all videos or create new video"""
    serializer_class = VideoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'view_count', 'like_count']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsGuideOrAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Video.objects.all()
        
        # Filter by published status for regular users
        if self.request.user.role == 'user':
            queryset = queryset.filter(is_published=True)
        
        # Optional filters
        category = self.request.query_params.get('category', None)
        featured = self.request.query_params.get('featured', None)
        published = self.request.query_params.get('published', None)
        
        if category:
            queryset = queryset.filter(category=category)
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')
        if published is not None:
            queryset = queryset.filter(is_published=published.lower() == 'true')
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class VideoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete video"""
    serializer_class = VideoSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsGuideOrAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.role in ['guide', 'admin']:
            return Video.objects.all()
        return Video.objects.filter(is_published=True)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.view_count += 1
        instance.save(update_fields=['view_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class AudioContentListCreateView(generics.ListCreateAPIView):
    """List all audio content or create new audio"""
    serializer_class = AudioContentSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'play_count', 'like_count']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsGuideOrAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = AudioContent.objects.all()
        
        # Filter by published status for regular users
        if self.request.user.role == 'user':
            queryset = queryset.filter(is_published=True)
        
        # Optional filters
        category = self.request.query_params.get('category', None)
        audio_type = self.request.query_params.get('type', None)
        published = self.request.query_params.get('published', None)
        
        if category:
            queryset = queryset.filter(category=category)
        if audio_type:
            queryset = queryset.filter(audio_type=audio_type)
        if published is not None:
            queryset = queryset.filter(is_published=published.lower() == 'true')
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class AudioContentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete audio content"""
    serializer_class = AudioContentSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsGuideOrAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.role in ['guide', 'admin']:
            return AudioContent.objects.all()
        return AudioContent.objects.filter(is_published=True)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment play count
        instance.play_count += 1
        instance.save(update_fields=['play_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
        