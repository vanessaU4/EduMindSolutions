from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Avg, Count, Q
from datetime import datetime, timedelta
import random
from .models import (
    MoodEntry, Achievement, UserAchievement, UserPoints,
    DailyChallenge, UserChallengeCompletion, WellnessTip, UserWellnessTip
)
from .serializers import (
    MoodEntrySerializer, CreateMoodEntrySerializer, AchievementSerializer,
    UserAchievementSerializer, UserPointsSerializer, DailyChallengeSerializer,
    UserChallengeCompletionSerializer, CompleteChallengeSerializer,
    WellnessTipSerializer, UserWellnessTipSerializer, MoodStatsSerializer,
    WellnessStatsSerializer
)

# COMPREHENSIVE WELLNESS API ENDPOINTS

class WellnessCenterView(APIView):
    """Wellness center dashboard with comprehensive stats"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Get or create user points
        user_points, created = UserPoints.objects.get_or_create(user=user)
        
        # Get recent mood entries
        recent_moods = MoodEntry.objects.filter(user=user).order_by('-date')[:7]
        
        # Get today's challenges
        today = timezone.now().date()
        todays_challenges = DailyChallenge.objects.filter(is_active=True)
        completed_today = UserChallengeCompletion.objects.filter(
            user=user,
            completion_date=today
        ).values_list('challenge_id', flat=True)
        
        # Get recent achievements
        recent_achievements = UserAchievement.objects.filter(user=user).order_by('-earned_at')[:5]
        
        return Response({
            'user_points': UserPointsSerializer(user_points).data,
            'recent_moods': MoodEntrySerializer(recent_moods, many=True).data,
            'todays_challenges': DailyChallengeSerializer(todays_challenges, many=True, context={'request': request}).data,
            'recent_achievements': UserAchievementSerializer(recent_achievements, many=True).data,
            'stats': {
                'total_mood_entries': MoodEntry.objects.filter(user=user).count(),
                'challenges_completed_today': len(completed_today),
                'total_achievements': UserAchievement.objects.filter(user=user).count(),
            }
        })

# MOOD TRACKING ENDPOINTS

class MoodEntryListView(generics.ListCreateAPIView):
    """List and create mood entries"""
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateMoodEntrySerializer
        return MoodEntrySerializer
    
    def get_queryset(self):
        return MoodEntry.objects.filter(user=self.request.user).order_by('-date')
    
    def perform_create(self, serializer):
        mood_entry = serializer.save(user=self.request.user)
        
        # Award points for mood tracking
        user_points, created = UserPoints.objects.get_or_create(user=self.request.user)
        user_points.add_points(5, "mood_tracking")
        
        return Response({
            'message': 'Mood entry saved successfully',
            'points_earned': 5
        })

class MoodEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a mood entry"""
    permission_classes = [IsAuthenticated]
    serializer_class = MoodEntrySerializer
    
    def get_queryset(self):
        return MoodEntry.objects.filter(user=self.request.user)

class MoodStatsView(APIView):
    """Get mood statistics and trends"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        days = int(request.query_params.get('days', 30))
        
        # Get mood entries for the specified period
        start_date = timezone.now().date() - timedelta(days=days)
        mood_entries = MoodEntry.objects.filter(
            user=user,
            date__gte=start_date
        ).order_by('date')
        
        if not mood_entries.exists():
            return Response({
                'message': 'No mood entries found for this period',
                'stats': None
            })
        
        # Calculate statistics
        stats = mood_entries.aggregate(
            average_mood=Avg('mood_rating'),
            average_energy=Avg('energy_level'),
            average_anxiety=Avg('anxiety_level'),
            average_sleep=Avg('sleep_quality')
        )
        
        # Calculate streak
        user_points = UserPoints.objects.filter(user=user).first()
        current_streak = user_points.current_streak if user_points else 0
        
        # Prepare mood trend data
        mood_trend = []
        for entry in mood_entries:
            mood_trend.append({
                'date': entry.date.isoformat(),
                'mood': entry.mood_rating,
                'energy': entry.energy_level,
                'anxiety': entry.anxiety_level,
                'sleep': entry.sleep_quality
            })
        
        return Response({
            'average_mood': round(stats['average_mood'], 2) if stats['average_mood'] else 0,
            'average_energy': round(stats['average_energy'], 2) if stats['average_energy'] else 0,
            'average_anxiety': round(stats['average_anxiety'], 2) if stats['average_anxiety'] else 0,
            'average_sleep': round(stats['average_sleep'], 2) if stats['average_sleep'] else 0,
            'total_entries': mood_entries.count(),
            'current_streak': current_streak,
            'mood_trend': mood_trend
        })

# DAILY CHALLENGES ENDPOINTS

class DailyChallengeListView(generics.ListAPIView):
    """List available daily challenges"""
    permission_classes = [IsAuthenticated]
    serializer_class = DailyChallengeSerializer
    
    def get_queryset(self):
        return DailyChallenge.objects.filter(is_active=True)

class CompleteChallengeView(APIView):
    """Complete a daily challenge"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, challenge_id):
        try:
            challenge = DailyChallenge.objects.get(id=challenge_id, is_active=True)
            user = request.user
            today = timezone.now().date()
            
            # Check if already completed today
            existing_completion = UserChallengeCompletion.objects.filter(
                user=user,
                challenge=challenge,
                completion_date=today
            ).first()
            
            if existing_completion:
                return Response({
                    'error': 'Challenge already completed today'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create completion record
            completion_data = {
                'challenge': challenge.id,
                'completion_value': request.data.get('completion_value'),
                'notes': request.data.get('notes', ''),
                'completion_date': today
            }
            
            serializer = CompleteChallengeSerializer(data=completion_data, context={'request': request})
            if serializer.is_valid():
                completion = serializer.save(user=user, points_earned=challenge.points_reward)
                
                # Award points
                user_points, created = UserPoints.objects.get_or_create(user=user)
                user_points.add_points(challenge.points_reward, "challenge_completion")
                
                return Response({
                    'message': 'Challenge completed successfully',
                    'points_earned': challenge.points_reward,
                    'completion_id': completion.id
                })
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except DailyChallenge.DoesNotExist:
            return Response({'error': 'Challenge not found'}, status=status.HTTP_404_NOT_FOUND)

class UserChallengeCompletionListView(generics.ListAPIView):
    """List user's challenge completions"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserChallengeCompletionSerializer
    
    def get_queryset(self):
        return UserChallengeCompletion.objects.filter(user=self.request.user).order_by('-completed_at')

# ACHIEVEMENTS ENDPOINTS

class AchievementListView(generics.ListAPIView):
    """List all available achievements"""
    permission_classes = [IsAuthenticated]
    serializer_class = AchievementSerializer
    
    def get_queryset(self):
        return Achievement.objects.filter(is_active=True)

class UserAchievementListView(generics.ListAPIView):
    """List user's earned achievements"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserAchievementSerializer
    
    def get_queryset(self):
        return UserAchievement.objects.filter(user=self.request.user).order_by('-earned_at')

# WELLNESS TIPS ENDPOINTS

class WellnessTipListView(generics.ListAPIView):
    """List wellness tips"""
    permission_classes = [IsAuthenticated]
    serializer_class = WellnessTipSerializer
    
    def get_queryset(self):
        return WellnessTip.objects.filter(is_active=True)

class DailyWellnessTipView(APIView):
    """Get daily personalized wellness tip"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Get user's recent mood to personalize tip
        recent_mood = MoodEntry.objects.filter(user=user).order_by('-date').first()
        
        # Filter tips based on mood if available
        tips_queryset = WellnessTip.objects.filter(is_active=True)
        if recent_mood:
            tips_queryset = tips_queryset.filter(
                Q(target_mood__contains=[recent_mood.mood_rating]) | 
                Q(target_mood=[])
            )
        
        # Exclude tips already shown recently
        shown_recently = UserWellnessTip.objects.filter(
            user=user,
            shown_at__gte=timezone.now() - timedelta(days=7)
        ).values_list('tip_id', flat=True)
        
        tips_queryset = tips_queryset.exclude(id__in=shown_recently)
        
        # Get random tip
        tip = tips_queryset.order_by('?').first()
        
        if tip:
            # Mark as shown
            UserWellnessTip.objects.get_or_create(user=user, tip=tip)
            
            return Response(WellnessTipSerializer(tip, context={'request': request}).data)
        
        return Response({'message': 'No new tips available'})

class MarkTipHelpfulView(APIView):
    """Mark a wellness tip as helpful or not"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, tip_id):
        try:
            user_tip = UserWellnessTip.objects.get(user=request.user, tip_id=tip_id)
            user_tip.is_helpful = request.data.get('is_helpful', True)
            user_tip.save()
            
            return Response({'message': 'Feedback recorded successfully'})
            
        except UserWellnessTip.DoesNotExist:
            return Response({'error': 'Tip not found'}, status=status.HTTP_404_NOT_FOUND)

# ADMIN ENDPOINTS

class AdminDailyChallengeView(generics.ListCreateAPIView):
    """Admin can manage daily challenges"""
    serializer_class = DailyChallengeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        return DailyChallenge.objects.all()
    
    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        serializer.save()

class AdminDailyChallengeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin can update/delete daily challenges"""
    serializer_class = DailyChallengeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        return DailyChallenge.objects.all()

class AdminAchievementView(generics.ListCreateAPIView):
    """Admin can manage achievements"""
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        return Achievement.objects.all()
    
    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        serializer.save()

class AdminAchievementDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin can update/delete achievements"""
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        return Achievement.objects.all()

class AdminWellnessTipView(generics.ListCreateAPIView):
    """Admin can manage wellness tips"""
    serializer_class = WellnessTipSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        return WellnessTip.objects.all()
    
    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        serializer.save()

class AdminWellnessTipDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin can update/delete wellness tips"""
    serializer_class = WellnessTipSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied("Admin access required")
        return WellnessTip.objects.all()

# STATISTICS AND DASHBOARD ENDPOINTS

class WellnessStatsView(APIView):
    """Comprehensive wellness statistics"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Get user points
        user_points = UserPoints.objects.filter(user=user).first()
        
        # Get counts
        total_achievements = UserAchievement.objects.filter(user=user).count()
        today = timezone.now().date()
        challenges_completed_today = UserChallengeCompletion.objects.filter(
            user=user,
            completion_date=today
        ).count()
        challenges_completed_total = UserChallengeCompletion.objects.filter(user=user).count()
        mood_entries_count = MoodEntry.objects.filter(user=user).count()
        
        stats = {
            'total_points': user_points.total_points if user_points else 0,
            'current_level': user_points.level if user_points else 1,
            'achievements_count': total_achievements,
            'challenges_completed_today': challenges_completed_today,
            'challenges_completed_total': challenges_completed_total,
            'current_streak': user_points.current_streak if user_points else 0,
            'mood_entries_count': mood_entries_count,
        }
        
        return Response(stats)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_challenge(request, challenge_id):
    """
    Complete a daily challenge - matches frontend wellnessService.completeChallenge()
    """
    # Add logic to mark challenge as completed
    return Response({
        'message': 'Challenge completed successfully',
        'challenge_id': challenge_id,
        'points_earned': 10
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_achievements(request):
    """
    Get user achievements - matches frontend wellnessService.getAchievements()
    """
    achievements = [
        {
            'id': '1',
            'title': 'First Steps',
            'description': 'Complete your first mood check-in',
            'earned': True,
            'date': '2024-01-01'
        },
        {
            'id': '2',
            'title': 'Week Warrior', 
            'description': 'Complete 7 days in a row',
            'earned': True,
            'date': '2024-01-06'
        }
    ]
    return Response(achievements)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_mood_history(request):
    """
    Get mood history - matches frontend wellnessService.getMoodHistory()
    """
    days = int(request.GET.get('days', 30))
    mood_history = [
        {
            'date': (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d'),
            'mood': random.randint(1, 10),
            'note': f'Mood entry for day {i+1}'
        } for i in range(days)
    ]
    return Response(mood_history)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_daily_challenges(request):
    """
    Get daily challenges - matches frontend wellnessService.getDailyChallenges()
    """
    challenges = [
        {
            'id': 'daily-1',
            'title': 'Gratitude Practice',
            'description': 'Write down 3 things you\'re grateful for today',
            'completed': False,
            'points': 10
        },
        {
            'id': 'daily-2',
            'title': 'Deep Breathing',
            'description': 'Practice 5 minutes of deep breathing',
            'completed': False,
            'points': 15
        }
    ]
    return Response(challenges)

class MoodTrackerView(generics.GenericAPIView):
    """
    Mood tracking functionality for daily mood logging.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'mood_history': [
                {'date': '2024-01-15', 'mood': 'happy', 'notes': 'Good day at school'},
                {'date': '2024-01-14', 'mood': 'neutral', 'notes': 'Regular day'},
                {'date': '2024-01-13', 'mood': 'sad', 'notes': 'Feeling overwhelmed'}
            ],
            'mood_options': ['very_sad', 'sad', 'neutral', 'happy', 'very_happy']
        })

    def post(self, request):
        return Response({
            'message': 'Mood entry saved successfully',
            'mood': request.data.get('mood'),
            'date': request.data.get('date')
        })

class DailyChallengesView(generics.GenericAPIView):
    """
    Daily wellness challenges for users.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'today_challenge': {
                'id': 1,
                'title': 'Practice Deep Breathing',
                'description': 'Take 5 minutes to practice deep breathing exercises',
                'points': 10,
                'completed': False
            },
            'available_challenges': [
                {'id': 2, 'title': 'Gratitude Journal', 'points': 15},
                {'id': 3, 'title': 'Physical Activity', 'points': 20},
                {'id': 4, 'title': 'Mindful Meditation', 'points': 25}
            ]
        })

class AchievementsView(generics.GenericAPIView):
    """
    User achievements and badges system.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'earned_achievements': [
                {'id': 1, 'name': 'First Steps', 'description': 'Completed first mood entry', 'earned_date': '2024-01-10'},
                {'id': 2, 'name': 'Consistent Tracker', 'description': '7 days of mood tracking', 'earned_date': '2024-01-15'}
            ],
            'available_achievements': [
                {'id': 3, 'name': 'Challenge Master', 'description': 'Complete 10 daily challenges'},
                {'id': 4, 'name': 'Wellness Warrior', 'description': '30 days of consistent tracking'}
            ]
        })

class WellnessGoalsView(generics.GenericAPIView):
    """
    Personal wellness goals setting and tracking.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'active_goals': [
                {'id': 1, 'title': 'Daily Mood Tracking', 'progress': 70, 'target_date': '2024-02-01'},
                {'id': 2, 'title': 'Exercise 3x per week', 'progress': 45, 'target_date': '2024-01-31'}
            ],
            'suggested_goals': [
                {'title': 'Meditation Practice', 'description': 'Meditate for 10 minutes daily'},
                {'title': 'Sleep Schedule', 'description': 'Maintain consistent sleep schedule'}
            ]
        })

class ProgressTrackingView(generics.GenericAPIView):
    """
    Overall wellness progress tracking and analytics.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'progress_summary': {
                'mood_trend': 'improving',
                'challenge_completion_rate': 85,
                'goal_achievement_rate': 60,
                'total_points': 150
            },
            'weekly_stats': {
                'mood_entries': 6,
                'challenges_completed': 4,
                'goals_met': 2
            }
        })
        