from django.contrib import admin
from .models import ClientAssignment, ClientContact, FollowUp

@admin.register(ClientAssignment)
class ClientAssignmentAdmin(admin.ModelAdmin):
    list_display = ['guide', 'client', 'assigned_date', 'is_active']
    list_filter = ['is_active', 'assigned_date']
    search_fields = ['guide__username', 'client__username']

@admin.register(ClientContact)
class ClientContactAdmin(admin.ModelAdmin):
    list_display = ['guide', 'client', 'contact_type', 'outcome', 'timestamp']
    list_filter = ['contact_type', 'outcome', 'timestamp']
    search_fields = ['guide__username', 'client__username']

@admin.register(FollowUp)
class FollowUpAdmin(admin.ModelAdmin):
    list_display = ['guide', 'client', 'scheduled_date', 'completed']
    list_filter = ['completed', 'scheduled_date']
    search_fields = ['guide__username', 'client__username']
    