from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinLengthValidator, MinValueValidator, MaxValueValidator

class ForumCategory(models.Model):
    """Categories for organizing forum discussions"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True, help_text="Icon class name")
    color = models.CharField(max_length=7, default="#3B82F6", help_text="Hex color code")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'community_forum_category'
        verbose_name = 'Forum Category'
        verbose_name_plural = 'Forum Categories'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

class ForumPost(models.Model):
    """Main forum posts/topics"""
    MOOD_CHOICES = [
        ('struggling', 'Struggling'),
        ('neutral', 'Neutral'),
        ('hopeful', 'Hopeful'),
        ('positive', 'Positive'),
    ]

    title = models.CharField(max_length=200, validators=[MinLengthValidator(5)])
    content = models.TextField(validators=[MinLengthValidator(10)])
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='forum_posts')
    category = models.ForeignKey(ForumCategory, on_delete=models.CASCADE, related_name='posts')

    # Privacy and moderation
    is_anonymous = models.BooleanField(default=True)
    is_pinned = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True)

    # Engagement tracking
    view_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)

    # Mood context
    author_mood = models.CharField(max_length=20, choices=MOOD_CHOICES, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_activity = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'community_forum_post'
        ordering = ['-last_activity']

    def __str__(self):
        return self.title

    @property
    def author_display_name(self):
        if self.is_anonymous:
            return f"Anonymous User {self.author.id}"
        return self.author.display_name

class ForumComment(models.Model):
    """Comments/replies to forum posts"""
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='forum_comments')
    content = models.TextField(validators=[MinLengthValidator(5)])
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')

    # Privacy and moderation
    is_anonymous = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=True)

    # Engagement
    like_count = models.PositiveIntegerField(default=0)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'community_forum_comment'
        ordering = ['created_at']

    def __str__(self):
        return f"Comment on {self.post.title}"

    @property
    def author_display_name(self):
        if self.is_anonymous:
            return f"Anonymous User {self.author.id}"
        return self.author.display_name

class PostLike(models.Model):
    """Track likes on posts"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'community_post_like'
        unique_together = ['user', 'post']

class CommentLike(models.Model):
    """Track likes on comments"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.ForeignKey(ForumComment, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'community_comment_like'
        unique_together = ['user', 'comment']

class PeerSupportMatch(models.Model):
    """Peer-to-peer support matching system"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    requester = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='support_requests'
    )
    supporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='support_provided',
        null=True, blank=True
    )

    # Matching criteria
    preferred_topics = models.JSONField(default=list, help_text="Topics user wants support with")
    preferred_age_range = models.CharField(max_length=20, blank=True)
    preferred_gender = models.CharField(max_length=20, blank=True)

    # Status and tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    matched_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    # Feedback
    requester_rating = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    supporter_rating = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    feedback = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'community_peer_support_match'
        ordering = ['-created_at']

    def __str__(self):
        return f"Support match: {self.requester.username} - {self.status}"

class ModerationReport(models.Model):
    """Reports for inappropriate content"""
    REPORT_TYPES = [
        ('inappropriate_content', 'Inappropriate Content'),
        ('harassment', 'Harassment'),
        ('spam', 'Spam'),
        ('self_harm', 'Self-harm Content'),
        ('crisis', 'Crisis Situation'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('reviewed', 'Reviewed'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed'),
    ]

    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reports_made')
    report_type = models.CharField(max_length=30, choices=REPORT_TYPES)
    description = models.TextField()

    # Content being reported (one of these will be filled)
    reported_post = models.ForeignKey(ForumPost, on_delete=models.CASCADE, null=True, blank=True)
    reported_comment = models.ForeignKey(ForumComment, on_delete=models.CASCADE, null=True, blank=True)
    reported_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name='reports_against'
    )

    # Moderation
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    moderator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='moderated_reports'
    )
    moderator_notes = models.TextField(blank=True)
    action_taken = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'community_moderation_report'
        ordering = ['-created_at']

    def __str__(self):
        return f"Report: {self.report_type} - {self.status}"

class ChatRoom(models.Model):
    """Real-time chat rooms for peer support"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    topic = models.CharField(max_length=100, blank=True)
    max_participants = models.PositiveIntegerField(default=10)
    is_active = models.BooleanField(default=True)
    is_moderated = models.BooleanField(default=True)

    moderators = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='moderated_chatrooms',
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'community_chat_room'
        ordering = ['name']

    def __str__(self):
        return self.name

class ChatMessage(models.Model):
    """Messages in chat rooms"""
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(validators=[MinLengthValidator(1)])
    is_anonymous = models.BooleanField(default=True)
    is_system_message = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'community_chat_message'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.room.name}: {self.content[:50]}"

    @property
    def author_display_name(self):
        if self.is_system_message:
            return "System"
        if self.is_anonymous:
            return f"Anonymous User {self.author.id}"
        return self.author.display_name
        