from django.urls import path
from .views import (
    EducationCenterView, ResourceDirectoryView,
    ArticleListView, ArticleDetailView, VideoListView, VideoDetailView,
    AudioContentListView, AudioContentDetailView, ContentCategoryListView,
    AdminContentApprovalView, AdminContentCategoryView, AdminContentCategoryDetailView,
    ContentEngagementView, UserBookmarkView, ContentStatsView,
    ArticleListCreateView, VideoListCreateView, AudioContentListCreateView,
    MentalHealthResourceListView
)

urlpatterns = [
    # Dashboard and overview
    path('', EducationCenterView.as_view(), name='education-center'),
    path('stats/', ContentStatsView.as_view(), name='content-stats'),
    
    # Articles - Public endpoints
    path('articles/', ArticleListView.as_view(), name='articles'),
    path('articles/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),
    
    # Articles - Management endpoints (for frontend content service)
    path('articles/manage/', ArticleListCreateView.as_view(), name='articles-manage'),
    path('articles/manage/<int:pk>/', ArticleDetailView.as_view(), name='article-manage-detail'),
    path('articles/manage/<int:pk>/like/', ContentEngagementView.as_view(), name='article-like'),
    
    # Videos - Public endpoints
    path('videos/', VideoListView.as_view(), name='videos'),
    path('videos/<int:pk>/', VideoDetailView.as_view(), name='video-detail'),
    
    # Videos - Management endpoints (for frontend content service)
    path('videos/manage/', VideoListCreateView.as_view(), name='videos-manage'),
    path('videos/manage/<int:pk>/', VideoDetailView.as_view(), name='video-manage-detail'),
    
    # Audio content - Public endpoints
    path('audio/', AudioContentListView.as_view(), name='audio'),
    path('audio/<int:pk>/', AudioContentDetailView.as_view(), name='audio-detail'),
    
    # Audio content - Management endpoints (for frontend content service)
    path('audio/manage/', AudioContentListCreateView.as_view(), name='audio-manage'),
    path('audio/manage/<int:pk>/', AudioContentDetailView.as_view(), name='audio-manage-detail'),
    
    # Categories
    path('categories/', ContentCategoryListView.as_view(), name='categories'),
    
    # Content engagement
    path('engage/', ContentEngagementView.as_view(), name='content-engagement'),
    path('bookmarks/', UserBookmarkView.as_view(), name='user-bookmarks'),
    
    # Admin endpoints
    path('admin/approve/<str:content_type>/<int:content_id>/', AdminContentApprovalView.as_view(), name='admin-content-approval'),
    path('admin/categories/', AdminContentCategoryView.as_view(), name='admin-categories'),
    path('admin/categories/<int:pk>/', AdminContentCategoryDetailView.as_view(), name='admin-category-detail'),
    
    # Resource directory
    path('resources/', MentalHealthResourceListView.as_view(), name='resource-directory'),
]
