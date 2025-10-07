from django.urls import path
from .views import (
    WellnessCenterView, MoodEntryListView, MoodEntryDetailView, MoodStatsView,
    DailyChallengeListView, CompleteChallengeView, UserChallengeCompletionListView,
    AchievementListView, UserAchievementListView, WellnessTipListView,
    DailyWellnessTipView, MarkTipHelpfulView, AdminDailyChallengeView,
    AdminDailyChallengeDetailView, AdminAchievementView, AdminAchievementDetailView,
    AdminWellnessTipView, AdminWellnessTipDetailView, WellnessStatsView
)

urlpatterns = [
    # Wellness center dashboard
    path('', WellnessCenterView.as_view(), name='wellness-center'),
    path('stats/', WellnessStatsView.as_view(), name='wellness-stats'),
    
    # Mood tracking endpoints
    path('mood-entries/', MoodEntryListView.as_view(), name='mood-entries'),
    path('mood-entries/<int:pk>/', MoodEntryDetailView.as_view(), name='mood-entry-detail'),
    path('mood-stats/', MoodStatsView.as_view(), name='mood-stats'),
    
    # Daily challenges endpoints
    path('challenges/', DailyChallengeListView.as_view(), name='daily-challenges'),
    path('challenges/<int:challenge_id>/complete/', CompleteChallengeView.as_view(), name='complete-challenge'),
    path('challenge-completions/', UserChallengeCompletionListView.as_view(), name='challenge-completions'),
    
    # Achievements endpoints
    path('achievements/', AchievementListView.as_view(), name='achievements'),
    path('user-achievements/', UserAchievementListView.as_view(), name='user-achievements'),
    
    # Wellness tips endpoints
    path('tips/', WellnessTipListView.as_view(), name='wellness-tips'),
    path('daily-tip/', DailyWellnessTipView.as_view(), name='daily-wellness-tip'),
    path('tips/<int:tip_id>/helpful/', MarkTipHelpfulView.as_view(), name='mark-tip-helpful'),
    
    # Admin endpoints
    path('admin/challenges/', AdminDailyChallengeView.as_view(), name='admin-daily-challenges'),
    path('admin/challenges/<int:pk>/', AdminDailyChallengeDetailView.as_view(), name='admin-daily-challenge-detail'),
    path('admin/achievements/', AdminAchievementView.as_view(), name='admin-achievements'),
    path('admin/achievements/<int:pk>/', AdminAchievementDetailView.as_view(), name='admin-achievement-detail'),
    path('admin/tips/', AdminWellnessTipView.as_view(), name='admin-wellness-tips'),
    path('admin/tips/<int:pk>/', AdminWellnessTipDetailView.as_view(), name='admin-wellness-tip-detail'),
]
