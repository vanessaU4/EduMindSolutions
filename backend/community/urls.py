from django.urls import path
from .views import (
    CommunityHubView, ForumCategoryListView, ForumPostListView, 
    ForumPostDetailView, ForumCommentListView, PeerSupportView, 
    ChatRoomListView, ChatRoomDetailView, PostLikeView, CommentLikeView,
    ModerationReportView, AdminModerationView, AdminForumCategoryView,
    AdminForumCategoryDetailView, AdminChatRoomView, AdminChatRoomDetailView,
    CommunityStatsView, UserForumActivityView, PeerSupportMatchingView
)

urlpatterns = [
    # Community hub
    path('', CommunityHubView.as_view(), name='community-hub'),
    
    # Forum categories
    path('categories/', ForumCategoryListView.as_view(), name='forum-category-list'),
    
    # Forum posts
    path('posts/', ForumPostListView.as_view(), name='forum-post-list'),
    path('posts/<int:pk>/', ForumPostDetailView.as_view(), name='forum-post-detail'),
    
    # Forum comments
    path('comments/', ForumCommentListView.as_view(), name='forum-comment-list'),
    
    # Peer support
    path('peer-support/', PeerSupportView.as_view(), name='peer-support'),
    
    # Chat rooms
    path('chatrooms/', ChatRoomListView.as_view(), name='chat-room-list'),
    path('chatrooms/<int:pk>/', ChatRoomDetailView.as_view(), name='chat-room-detail'),
    
    # Engagement (likes)
    path('posts/<int:post_id>/like/', PostLikeView.as_view(), name='post-like'),
    path('comments/<int:comment_id>/like/', CommentLikeView.as_view(), name='comment-like'),
    
    # Moderation
    path('reports/', ModerationReportView.as_view(), name='moderation-reports'),
    path('reports/<int:report_id>/moderate/', AdminModerationView.as_view(), name='admin-moderation'),
    
    # Statistics and activity
    path('stats/', CommunityStatsView.as_view(), name='community-stats'),
    path('activity/', UserForumActivityView.as_view(), name='user-forum-activity'),
    
    # Enhanced peer support
    path('peer-support/matching/', PeerSupportMatchingView.as_view(), name='peer-support-matching'),
    path('peer-support/matching/<int:match_id>/', PeerSupportMatchingView.as_view(), name='peer-support-match-action'),
    
    # Admin endpoints
    path('admin/categories/', AdminForumCategoryView.as_view(), name='admin-forum-categories'),
    path('admin/categories/<int:pk>/', AdminForumCategoryDetailView.as_view(), name='admin-forum-category-detail'),
    path('admin/chatrooms/', AdminChatRoomView.as_view(), name='admin-chat-rooms'),
    path('admin/chatrooms/<int:pk>/', AdminChatRoomDetailView.as_view(), name='admin-chat-room-detail'),
]
