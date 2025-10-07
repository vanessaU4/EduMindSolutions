from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ClientAssignment(models.Model):
    """
    Model to track guide-client assignments
    """
    guide = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_clients')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_guide')
    assigned_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ['guide', 'client']

class ClientContact(models.Model):
    """
    Model to track guide-client contact history
    """
    CONTACT_TYPES = [
        ('phone', 'Phone Call'),
        ('email', 'Email'),
        ('in_person', 'In Person'),
        ('video', 'Video Call'),
    ]
    
    OUTCOMES = [
        ('positive', 'Positive'),
        ('neutral', 'Neutral'),
        ('concerning', 'Concerning'),
    ]

    guide = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_contacts')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='guide_contacts')
    contact_type = models.CharField(max_length=20, choices=CONTACT_TYPES)
    notes = models.TextField()
    outcome = models.CharField(max_length=20, choices=OUTCOMES)
    timestamp = models.DateTimeField(auto_now_add=True)

class FollowUp(models.Model):
    """
    Model to track scheduled follow-ups
    """
    guide = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follow_ups')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scheduled_follow_ups')
    scheduled_date = models.DateTimeField()
    notes = models.TextField()
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    