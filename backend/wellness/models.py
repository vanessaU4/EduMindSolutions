from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator

class MoodEntry(models.Model):
    """Daily mood check-ins"""
    MOOD_CHOICES = [
        (1, 'Very Low'),
        (2, 'Low'),
        (3, 'Neutral'),
        (4, 'Good'),
        (5, 'Very Good'),
    ]

    ENERGY_CHOICES = [
        (1, 'Very Low'),
        (2, 'Low'),
        (3, 'Moderate'),
        (4, 'High'),
        (5, 'Very High'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mood_entries')
    mood_rating = models.PositiveIntegerField(choices=MOOD_CHOICES)
    energy_level = models.PositiveIntegerField(choices=ENERGY_CHOICES)
    anxiety_level = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="1=Very Low, 5=Very High"
    )
    sleep_quality = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="1=Very Poor, 5=Excellent"
    )

    # Optional fields
    notes = models.TextField(blank=True, max_length=500)
    activities = models.JSONField(default=list, help_text="Activities done today")
    triggers = models.JSONField(default=list, help_text="Potential mood triggers")

    # Timestamps
    date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'wellness_mood_entry'
        unique_together = ['user', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} - {self.date} (Mood: {self.mood_rating})"

class Achievement(models.Model):
    """Available achievements for gamification"""
    CATEGORY_CHOICES = [
        ('engagement', 'Platform Engagement'),
        ('wellness', 'Wellness Activities'),
        ('community', 'Community Participation'),
        ('learning', 'Educational Content'),
        ('milestone', 'Personal Milestones'),
    ]

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    icon = models.CharField(max_length=50, help_text="Icon class name")
    points_reward = models.PositiveIntegerField(default=10)

    # Achievement criteria
    criteria = models.JSONField(help_text="JSON object defining achievement criteria")
    is_repeatable = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'wellness_achievement'
        ordering = ['category', 'name']

    def __str__(self):
        return self.name

class UserAchievement(models.Model):
    """Achievements earned by users"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    points_earned = models.PositiveIntegerField()

    class Meta:
        db_table = 'wellness_user_achievement'
        unique_together = ['user', 'achievement']
        ordering = ['-earned_at']

    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"

class UserPoints(models.Model):
    """User points tracking for gamification"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='points')
    total_points = models.PositiveIntegerField(default=0)
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)

    # Level system
    level = models.PositiveIntegerField(default=1)
    points_to_next_level = models.PositiveIntegerField(default=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'wellness_user_points'

    def __str__(self):
        return f"{self.user.username} - Level {self.level} ({self.total_points} points)"

    def add_points(self, points, activity_type="general"):
        """Add points and update level if necessary"""
        self.total_points += points

        # Update streak
        today = timezone.now().date()
        if self.last_activity_date == today - timezone.timedelta(days=1):
            self.current_streak += 1
        elif self.last_activity_date != today:
            self.current_streak = 1

        if self.current_streak > self.longest_streak:
            self.longest_streak = self.current_streak

        self.last_activity_date = today

        # Check for level up
        while self.total_points >= self.points_to_next_level:
            self.level += 1
            self.points_to_next_level = self.level * 100  # Simple progression

        self.save()

class DailyChallenge(models.Model):
    """Daily wellness challenges"""
    CHALLENGE_TYPES = [
        ('mood_checkin', 'Mood Check-in'),
        ('breathing', 'Breathing Exercise'),
        ('gratitude', 'Gratitude Practice'),
        ('physical', 'Physical Activity'),
        ('social', 'Social Connection'),
        ('learning', 'Educational Content'),
        ('mindfulness', 'Mindfulness Practice'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    challenge_type = models.CharField(max_length=20, choices=CHALLENGE_TYPES)
    instructions = models.TextField()
    points_reward = models.PositiveIntegerField(default=5)

    # Challenge parameters
    target_value = models.PositiveIntegerField(null=True, blank=True, help_text="Target number if applicable")
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'wellness_daily_challenge'
        ordering = ['challenge_type', 'title']

    def __str__(self):
        return self.title

class UserChallengeCompletion(models.Model):
    """Track user completion of daily challenges"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='challenge_completions')
    challenge = models.ForeignKey(DailyChallenge, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)
    completion_date = models.DateField(default=timezone.now)

    # Completion details
    completion_value = models.PositiveIntegerField(null=True, blank=True, help_text="Actual value achieved")
    notes = models.TextField(blank=True, max_length=300)
    points_earned = models.PositiveIntegerField()

    class Meta:
        db_table = 'wellness_user_challenge_completion'
        unique_together = ['user', 'challenge', 'completion_date']
        ordering = ['-completed_at']

    def __str__(self):
        return f"{self.user.username} - {self.challenge.title} ({self.completion_date})"

class WellnessTip(models.Model):
    """Daily wellness tips and affirmations"""
    TIP_TYPES = [
        ('affirmation', 'Positive Affirmation'),
        ('coping_strategy', 'Coping Strategy'),
        ('self_care', 'Self-care Tip'),
        ('mindfulness', 'Mindfulness Practice'),
        ('motivation', 'Motivational Quote'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    tip_type = models.CharField(max_length=20, choices=TIP_TYPES)

    # Targeting
    target_mood = models.JSONField(default=list, help_text="Target mood levels (1-5)")
    target_age_range = models.CharField(max_length=20, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'wellness_tip'
        ordering = ['tip_type', 'title']

    def __str__(self):
        return self.title

class UserWellnessTip(models.Model):
    """Track which tips have been shown to users"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tip = models.ForeignKey(WellnessTip, on_delete=models.CASCADE)
    shown_at = models.DateTimeField(auto_now_add=True)
    is_helpful = models.BooleanField(null=True, blank=True)

    class Meta:
        db_table = 'wellness_user_tip'
        unique_together = ['user', 'tip']
        ordering = ['-shown_at']
        