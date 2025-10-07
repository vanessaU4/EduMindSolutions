from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import URLValidator

class ContentCategory(models.Model):
    """Categories for organizing educational content"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, default="#3B82F6")
    parent_category = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'content_category'
        verbose_name = 'Content Category'
        verbose_name_plural = 'Content Categories'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

class Article(models.Model):
    """Educational articles and blog posts"""
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    excerpt = models.TextField(max_length=300, help_text="Brief summary for previews")
    content = models.TextField()

    # Categorization
    category = models.ForeignKey(ContentCategory, on_delete=models.CASCADE, related_name='articles')
    tags = models.JSONField(default=list, help_text="List of tags for filtering")
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='beginner')

    # Metadata
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='authored_articles')
    featured_image = models.ImageField(upload_to='articles/', blank=True, null=True)
    estimated_read_time = models.PositiveIntegerField(help_text="Estimated reading time in minutes")

    # Engagement
    view_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)

    # Publishing
    is_published = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'content_article'
        ordering = ['-published_at']

    def __str__(self):
        return self.title

class Video(models.Model):
    """Educational videos"""
    title = models.CharField(max_length=200)
    description = models.TextField()

    # Video details
    video_url = models.URLField(help_text="YouTube, Vimeo, or other video platform URL")
    thumbnail_image = models.ImageField(upload_to='video_thumbnails/', blank=True, null=True)
    duration_seconds = models.PositiveIntegerField(help_text="Video duration in seconds")

    # Categorization
    category = models.ForeignKey(ContentCategory, on_delete=models.CASCADE, related_name='videos')
    tags = models.JSONField(default=list)
    difficulty_level = models.CharField(max_length=20, choices=Article.DIFFICULTY_CHOICES, default='beginner')

    # Metadata
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='authored_videos')

    # Engagement
    view_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)

    # Publishing
    is_published = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'content_video'
        ordering = ['-published_at']

    def __str__(self):
        return self.title

class AudioContent(models.Model):
    """Audio content like guided meditations, podcasts"""
    AUDIO_TYPES = [
        ('meditation', 'Guided Meditation'),
        ('breathing', 'Breathing Exercise'),
        ('podcast', 'Podcast Episode'),
        ('affirmation', 'Affirmations'),
        ('story', 'Calming Story'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    audio_type = models.CharField(max_length=20, choices=AUDIO_TYPES)

    # Audio details
    audio_file = models.FileField(upload_to='audio/', blank=True, null=True)
    audio_url = models.URLField(blank=True, help_text="External audio URL if not uploaded")
    duration_seconds = models.PositiveIntegerField()

    # Categorization
    category = models.ForeignKey(ContentCategory, on_delete=models.CASCADE, related_name='audio_content')
    tags = models.JSONField(default=list)

    # Metadata
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='authored_audio')
    thumbnail_image = models.ImageField(upload_to='audio_thumbnails/', blank=True, null=True)

    # Engagement
    play_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)

    # Publishing
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'content_audio'
        ordering = ['-published_at']

    def __str__(self):
        return self.title

class MentalHealthResource(models.Model):
    """Directory of mental health services and resources"""
    RESOURCE_TYPES = [
        ('clinic', 'Mental Health Clinic'),
        ('hospital', 'Hospital'),
        ('psychologist', 'Psychologist'),
        ('psychiatrist', 'Psychiatrist'),
        ('counselor', 'Counselor'),
        ('support_group', 'Support Group'),
        ('crisis_line', 'Crisis Hotline'),
        ('online_service', 'Online Service'),
    ]

    COST_LEVELS = [
        ('free', 'Free'),
        ('low_cost', 'Low Cost'),
        ('insurance', 'Insurance Accepted'),
        ('private_pay', 'Private Pay'),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField()
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES)

    # Contact Information
    phone_number = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)

    # Location
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    # Service Details
    services_offered = models.JSONField(default=list, help_text="List of services offered")
    specializations = models.JSONField(default=list, help_text="Areas of specialization")
    age_groups_served = models.JSONField(default=list, help_text="Age groups served")
    languages = models.JSONField(default=list, help_text="Languages spoken")

    # Availability
    hours_of_operation = models.JSONField(default=dict, help_text="Operating hours by day")
    is_24_7 = models.BooleanField(default=False)
    accepts_walk_ins = models.BooleanField(default=False)

    # Cost and Insurance
    cost_level = models.CharField(max_length=20, choices=COST_LEVELS)
    insurance_accepted = models.JSONField(default=list, help_text="Insurance providers accepted")

    # Quality and Verification
    is_verified = models.BooleanField(default=False)
    verification_date = models.DateTimeField(null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    review_count = models.PositiveIntegerField(default=0)

    # Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'content_mental_health_resource'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.get_resource_type_display()})"

class ContentEngagement(models.Model):
    """Track user engagement with content"""
    CONTENT_TYPES = [
        ('article', 'Article'),
        ('video', 'Video'),
        ('audio', 'Audio'),
    ]

    ACTION_TYPES = [
        ('view', 'Viewed'),
        ('like', 'Liked'),
        ('share', 'Shared'),
        ('bookmark', 'Bookmarked'),
        ('complete', 'Completed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='content_engagements')
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    content_id = models.PositiveIntegerField()
    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)

    # Engagement details
    duration_seconds = models.PositiveIntegerField(null=True, blank=True, help_text="Time spent on content")
    completion_percentage = models.PositiveIntegerField(null=True, blank=True, help_text="Percentage completed")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'content_engagement'
        unique_together = ['user', 'content_type', 'content_id', 'action_type']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} {self.action_type} {self.content_type} {self.content_id}"

class UserBookmark(models.Model):
    """User bookmarks for content"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookmarks')
    content_type = models.CharField(max_length=20, choices=ContentEngagement.CONTENT_TYPES)
    content_id = models.PositiveIntegerField()
    notes = models.TextField(blank=True, max_length=500)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'content_user_bookmark'
        unique_together = ['user', 'content_type', 'content_id']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} bookmarked {self.content_type} {self.content_id}"
        