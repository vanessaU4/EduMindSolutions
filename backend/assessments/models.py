from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import json

class AssessmentType(models.Model):
    """Types of mental health assessments available"""
    ASSESSMENT_CHOICES = [
        ('PHQ9', 'Patient Health Questionnaire-9 (Depression)'),
        ('GAD7', 'Generalized Anxiety Disorder-7'),
        ('PCL5', 'PTSD Checklist for DSM-5'),
    ]

    name = models.CharField(max_length=10, choices=ASSESSMENT_CHOICES, unique=True)
    display_name = models.CharField(max_length=100)
    description = models.TextField()
    instructions = models.TextField()
    total_questions = models.PositiveIntegerField()
    max_score = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'assessments_type'
        verbose_name = 'Assessment Type'
        verbose_name_plural = 'Assessment Types'

    def __str__(self):
        return self.display_name

class AssessmentQuestion(models.Model):
    """Individual questions for each assessment type"""
    assessment_type = models.ForeignKey(AssessmentType, on_delete=models.CASCADE, related_name='questions')
    question_number = models.PositiveIntegerField()
    question_text = models.TextField()
    options = models.JSONField(help_text="JSON array of answer options with scores")
    is_reverse_scored = models.BooleanField(default=False)

    class Meta:
        db_table = 'assessments_question'
        unique_together = ['assessment_type', 'question_number']
        ordering = ['assessment_type', 'question_number']

    def __str__(self):
        return f"{self.assessment_type.name} Q{self.question_number}"

class Assessment(models.Model):
    """Individual assessment instances taken by users"""
    RISK_LEVELS = [
        ('minimal', 'Minimal'),
        ('mild', 'Mild'),
        ('moderate', 'Moderate'),
        ('moderately_severe', 'Moderately Severe'),
        ('severe', 'Severe'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessments')
    assessment_type = models.ForeignKey(AssessmentType, on_delete=models.CASCADE)
    total_score = models.PositiveIntegerField()
    risk_level = models.CharField(max_length=20, choices=RISK_LEVELS)
    interpretation = models.TextField()
    recommendations = models.JSONField(default=list)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'assessments_assessment'
        ordering = ['-completed_at']

    def __str__(self):
        return f"{self.user.username} - {self.assessment_type.name} ({self.completed_at.date()})"

    def get_percentage_score(self):
        """Calculate percentage score"""
        return round((self.total_score / self.assessment_type.max_score) * 100, 1)

class AssessmentResponse(models.Model):
    """Individual responses to assessment questions"""
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey(AssessmentQuestion, on_delete=models.CASCADE)
    selected_option_index = models.PositiveIntegerField()
    score = models.PositiveIntegerField()

    class Meta:
        db_table = 'assessments_response'
        unique_together = ['assessment', 'question']

    def __str__(self):
        return f"{self.assessment} - Q{self.question.question_number}: {self.score}"

class AssessmentRecommendation(models.Model):
    """Predefined recommendations based on assessment results"""
    assessment_type = models.ForeignKey(AssessmentType, on_delete=models.CASCADE, related_name='recommendations')
    risk_level = models.CharField(max_length=20, choices=Assessment.RISK_LEVELS)
    title = models.CharField(max_length=200)
    description = models.TextField()
    action_items = models.JSONField(default=list)
    resources = models.JSONField(default=list)
    priority = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = 'assessments_recommendation'
        ordering = ['assessment_type', 'priority']

    def __str__(self):
        return f"{self.assessment_type.name} - {self.risk_level}: {self.title}"

class AssessmentRequest(models.Model):
    """Model for guides to request new assessments or modifications"""
    REQUEST_TYPES = [
        ('new_assessment', 'New Assessment Type'),
        ('modify_assessment', 'Modify Existing Assessment'),
        ('add_questions', 'Add Questions to Assessment'),
        ('modify_scoring', 'Modify Scoring System'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessment_requests')
    request_type = models.CharField(max_length=20, choices=REQUEST_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    justification = models.TextField(help_text="Why is this assessment needed?")
    target_assessment = models.ForeignKey(AssessmentType, on_delete=models.CASCADE, null=True, blank=True, 
                                        help_text="For modifications to existing assessments")
    proposed_questions = models.JSONField(default=list, help_text="Proposed questions and options")
    expected_outcomes = models.TextField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, 
                                  related_name='reviewed_requests')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'assessments_request'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"

class ClientAssessmentAssignment(models.Model):
    """Model for guides to assign specific assessments to clients"""
    guide = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assigned_assessments')
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessment_assignments')
    assessment_type = models.ForeignKey(AssessmentType, on_delete=models.CASCADE)
    assigned_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=True, blank=True)
    priority = models.CharField(max_length=10, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='medium')
    notes = models.TextField(blank=True)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    reminder_sent = models.BooleanField(default=False)

    class Meta:
        db_table = 'assessments_assignment'
        unique_together = ['guide', 'client', 'assessment_type']
        ordering = ['-assigned_date']

    def __str__(self):
        return f"{self.client.username} - {self.assessment_type.name} (by {self.guide.username})"
        