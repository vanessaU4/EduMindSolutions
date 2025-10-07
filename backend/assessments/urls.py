from django.urls import path
from .views import (
    AssessmentTypeListView, AssessmentDetailView, TakeAssessmentView,
    UserAssessmentHistoryView, AssessmentResultView, AssessmentRecommendationsView,
    GuideAssessmentRequestView, AdminAssessmentRequestView, AdminReviewRequestView,
    GuideClientAssignmentView, AdminAssessmentTypeManagementView, AdminAssessmentTypeDetailView,
    GuideAssessmentStatsView, AdminDashboardStatsView
)

urlpatterns = [
    # Assessment types
    path('types/', AssessmentTypeListView.as_view(), name='assessment-types'),
    path('types/<int:pk>/', AssessmentDetailView.as_view(), name='assessment-detail'),
    
    # Taking assessments
    path('take/', TakeAssessmentView.as_view(), name='take-assessment'),
    
    # User assessment history and results
    path('history/', UserAssessmentHistoryView.as_view(), name='assessment-history'),
    path('results/<int:pk>/', AssessmentResultView.as_view(), name='assessment-result'),
    
    # Recommendations
    path('recommendations/', AssessmentRecommendationsView.as_view(), name='assessment-recommendations'),
    
    # Guide role-based endpoints
    path('guide/requests/', GuideAssessmentRequestView.as_view(), name='guide-assessment-requests'),
    path('guide/assignments/', GuideClientAssignmentView.as_view(), name='guide-client-assignments'),
    path('guide/stats/', GuideAssessmentStatsView.as_view(), name='guide-assessment-stats'),
    
    # Admin role-based endpoints
    path('admin/requests/', AdminAssessmentRequestView.as_view(), name='admin-assessment-requests'),
    path('admin/requests/<int:request_id>/review/', AdminReviewRequestView.as_view(), name='admin-review-request'),
    path('admin/types/', AdminAssessmentTypeManagementView.as_view(), name='admin-assessment-types'),
    path('admin/types/<int:pk>/', AdminAssessmentTypeDetailView.as_view(), name='admin-assessment-type-detail'),
    path('admin/stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),
]
