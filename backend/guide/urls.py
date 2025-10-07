from django.urls import path
from .views import (
    get_clients, get_client, get_crisis_alerts, get_analytics,
    contact_client, get_client_contacts, schedule_follow_up,
    get_follow_ups, update_client, assign_client, unassign_client
)

urlpatterns = [
    # Client management
    path('clients/', get_clients, name='get-clients'),
    path('clients/<int:client_id>/', get_client, name='get-client'),
    path('clients/<int:client_id>/update/', update_client, name='update-client'),
    path('clients/<int:client_id>/assign/', assign_client, name='assign-client'),
    path('clients/<int:client_id>/unassign/', unassign_client, name='unassign-client'),
    
    # Crisis management
    path('crisis-alerts/', get_crisis_alerts, name='get-crisis-alerts'),
    
    # Analytics
    path('analytics/', get_analytics, name='get-analytics'),
    
    # Contact management
    path('client-contact/', contact_client, name='contact-client'),
    path('clients/<int:client_id>/contacts/', get_client_contacts, name='get-client-contacts'),
    
    # Follow-ups
    path('follow-ups/', get_follow_ups, name='get-follow-ups'),
    path('follow-ups/schedule/', schedule_follow_up, name='schedule-follow-up'),
]
