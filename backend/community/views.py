from rest_framework import generics, status, filters, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q, Count, F
from .models import (
    ForumCategory, ForumPost, ForumComment, ChatRoom, 
    ChatMessage, PeerSupportMatch, ModerationReport, PostLike, CommentLike
)
from .serializers import (
    ForumCategorySerializer, ForumPostSerializer, ForumCommentSerializer,
    ChatRoomSerializer, ChatMessageSerializer, PeerSupportMatchSerializer,
    ModerationReportSerializer
)


class CommunityHubView(generics.GenericAPIView):
    """Community hub overview"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'message': 'Welcome to the Community Hub',
            'features': [
                'Peer Support Groups',
                'Discussion Forums',
                'Chat Rooms',
                'Community Events'
            ],
            'user': request.user.username
        })


class ForumCategoryListView(generics.ListAPIView):
    """List all forum categories"""
    permission_classes = [IsAuthenticated]
    serializer_class = ForumCategorySerializer
    queryset = ForumCategory.objects.filter(is_active=True)


class ForumPostListView(generics.ListCreateAPIView):
    """List and create forum posts"""
    permission_classes = [IsAuthenticated]
    serializer_class = ForumPostSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'last_activity', 'like_count']
    ordering = ['-last_activity']

    def get_queryset(self):
        queryset = ForumPost.objects.filter(is_approved=True)
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category_id=category)
        return queryset


class ForumPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a forum post"""
    permission_classes = [IsAuthenticated]
    serializer_class = ForumPostSerializer
    queryset = ForumPost.objects.filter(is_approved=True)

    def get_object(self):
        obj = super().get_object()
        # Increment view count
        obj.view_count += 1
        obj.save(update_fields=['view_count'])
        return obj


class ForumCommentListView(generics.ListCreateAPIView):
    """List and create comments for a post"""
    permission_classes = [IsAuthenticated]
    serializer_class = ForumCommentSerializer

    def get_queryset(self):
        post_id = self.request.query_params.get('post', None)
        queryset = ForumComment.objects.filter(is_approved=True)
        if post_id:
            queryset = queryset.filter(post_id=post_id)
        return queryset


class ChatRoomListView(generics.ListAPIView):
    """List available chat rooms"""
    permission_classes = [IsAuthenticated]
    serializer_class = ChatRoomSerializer
    queryset = ChatRoom.objects.filter(is_active=True)


class ChatRoomDetailView(generics.RetrieveAPIView):
    """Detailed view of a specific chat room"""
    permission_classes = [IsAuthenticated]
    serializer_class = ChatRoomSerializer
    queryset = ChatRoom.objects.filter(is_active=True)


class PeerSupportView(generics.ListCreateAPIView):
    """Peer support matching requests"""
    permission_classes = [IsAuthenticated]
    serializer_class = PeerSupportMatchSerializer

    def get_queryset(self):
        return PeerSupportMatch.objects.filter(requester=self.request.user)

# COMPREHENSIVE COMMUNITY API ENDPOINTS

class PostLikeView(APIView):
    """Like/unlike a forum post"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, post_id):
        try:
            post = ForumPost.objects.get(id=post_id, is_approved=True)
            like, created = PostLike.objects.get_or_create(
                user=request.user, 
                post=post
            )
            
            if not created:
                # Unlike if already liked
                like.delete()
                post.like_count = F('like_count') - 1
                post.save(update_fields=['like_count'])
                return Response({'liked': False, 'message': 'Post unliked'})
            else:
                # Like the post
                post.like_count = F('like_count') + 1
                post.save(update_fields=['like_count'])
                return Response({'liked': True, 'message': 'Post liked'})
                
        except ForumPost.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

class CommentLikeView(APIView):
    """Like/unlike a forum comment"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, comment_id):
        try:
            comment = ForumComment.objects.get(id=comment_id, is_approved=True)
            like, created = CommentLike.objects.get_or_create(
                user=request.user, 
                comment=comment
            )
            
            if not created:
                like.delete()
                comment.like_count = F('like_count') - 1
                comment.save(update_fields=['like_count'])
                return Response({'liked': False, 'message': 'Comment unliked'})
            else:
                comment.like_count = F('like_count') + 1
                comment.save(update_fields=['like_count'])
                return Response({'liked': True, 'message': 'Comment liked'})
                
        except ForumComment.DoesNotExist:
            return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

class ModerationReportView(generics.ListCreateAPIView):
    """Create and view moderation reports"""
    permission_classes = [IsAuthenticated]
    serializer_class = ModerationReportSerializer
    
    def get_queryset(self):
        if self.request.user.role in ['guide', 'admin']:
            return ModerationReport.objects.all()
        return ModerationReport.objects.filter(reporter=self.request.user)

class AdminModerationView(APIView):
    """Admin/Guide moderation actions"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, report_id):
        if request.user.role not in ['guide', 'admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            report = ModerationReport.objects.get(id=report_id)
            action = request.data.get('action')
            moderator_notes = request.data.get('moderator_notes', '')
            
            if action == 'resolve':
                report.status = 'resolved'
                report.moderator = request.user
                report.moderator_notes = moderator_notes
                report.resolved_at = timezone.now()
                report.save()
                
                return Response({'message': 'Report resolved successfully'})
            elif action == 'dismiss':
                report.status = 'dismissed'
                report.moderator = request.user
                report.moderator_notes = moderator_notes
                report.resolved_at = timezone.now()
                report.save()
                
                return Response({'message': 'Report dismissed'})
            else:
                return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
                
        except ModerationReport.DoesNotExist:
            return Response({'error': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)

class AdminForumCategoryView(generics.ListCreateAPIView):
    """Admin can manage forum categories"""
    serializer_class = ForumCategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        return ForumCategory.objects.all()
    
    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        serializer.save()

class AdminForumCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin can update/delete forum categories"""
    serializer_class = ForumCategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        return ForumCategory.objects.all()

class AdminChatRoomView(generics.ListCreateAPIView):
    """Admin can manage chat rooms"""
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        return ChatRoom.objects.all()
    
    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        serializer.save()

class AdminChatRoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin can update/delete chat rooms"""
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        return ChatRoom.objects.all()

class CommunityStatsView(APIView):
    """Community statistics for dashboard"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user_role = request.user.role
        
        # Basic stats for all users
        stats = {
            'total_posts': ForumPost.objects.filter(is_approved=True).count(),
            'total_comments': ForumComment.objects.filter(is_approved=True).count(),
            'active_chat_rooms': ChatRoom.objects.filter(is_active=True).count(),
            'user_posts': ForumPost.objects.filter(author=request.user, is_approved=True).count(),
        }
        
        # Additional stats for guides and admins
        if user_role in ['guide', 'admin']:
            stats.update({
                'pending_reports': ModerationReport.objects.filter(status='pending').count(),
                'total_reports': ModerationReport.objects.count(),
                'active_peer_matches': PeerSupportMatch.objects.filter(status='active').count(),
            })
        
        # Admin-only stats
        if user_role == 'admin':
            stats.update({
                'total_categories': ForumCategory.objects.count(),
                'total_users_active': ForumPost.objects.values('author').distinct().count(),
                'posts_this_week': ForumPost.objects.filter(
                    created_at__gte=timezone.now() - timezone.timedelta(days=7)
                ).count(),
            })
        
        return Response(stats)

class UserForumActivityView(APIView):
    """Get user's forum activity"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user_posts = ForumPost.objects.filter(
            author=request.user, 
            is_approved=True
        ).order_by('-created_at')[:5]
        
        user_comments = ForumComment.objects.filter(
            author=request.user,
            is_approved=True
        ).order_by('-created_at')[:5]
        
        return Response({
            'recent_posts': ForumPostSerializer(user_posts, many=True).data,
            'recent_comments': ForumCommentSerializer(user_comments, many=True).data,
            'total_posts': ForumPost.objects.filter(author=request.user, is_approved=True).count(),
            'total_comments': ForumComment.objects.filter(author=request.user, is_approved=True).count(),
        })

class PeerSupportMatchingView(APIView):
    """Handle peer support matching"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Create a new peer support request"""
        serializer = PeerSupportMatchSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            match = serializer.save()
            
            # Simple matching logic - find available supporters
            # In a real system, this would be more sophisticated
            available_supporters = PeerSupportMatch.objects.filter(
                status='pending',
                supporter__isnull=True
            ).exclude(requester=request.user)
            
            return Response({
                'message': 'Peer support request created successfully',
                'match_id': match.id,
                'status': match.status
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, match_id):
        """Accept or complete a peer support match"""
        try:
            match = PeerSupportMatch.objects.get(id=match_id)
            action = request.data.get('action')
            
            if action == 'accept' and match.supporter is None:
                match.supporter = request.user
                match.status = 'active'
                match.matched_at = timezone.now()
                match.save()
                
                return Response({'message': 'Peer support match accepted'})
            
            elif action == 'complete' and match.supporter == request.user:
                match.status = 'completed'
                match.completed_at = timezone.now()
                
                # Handle ratings if provided
                if 'rating' in request.data:
                    match.supporter_rating = request.data['rating']
                if 'feedback' in request.data:
                    match.feedback = request.data['feedback']
                
                match.save()
                return Response({'message': 'Peer support match completed'})
            
            else:
                return Response({'error': 'Invalid action or permission'}, status=status.HTTP_400_BAD_REQUEST)
                
        except PeerSupportMatch.DoesNotExist:
            return Response({'error': 'Match not found'}, status=status.HTTP_404_NOT_FOUND)
            