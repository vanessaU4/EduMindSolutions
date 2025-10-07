from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta
import random

User = get_user_model()

# NEW ENDPOINTS - Match frontend guideService calls
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_clients(request):
    """
    Get guide's assigned clients - matches frontend guideService.getClients()
    """
    if request.user.role != 'guide':
        return Response({'error': 'Permission denied'}, status=403)
    
    # Return mock client data (replace with real database query)
    clients = [
        {
            'id': 1,
            'name': 'Alex Johnson',
            'email': 'alex.j@example.com',
            'age': 19,
            'status': 'active',
            'lastAssessment': '2024-01-05',
            'riskLevel': 'low',
            'lastContact': '2024-01-06',
            'assignedDate': '2023-12-01',
            'phone': '555-0123',
            'emergency_contact': 'Parent: 555-0456',
            'notes': 'Making good progress with anxiety management'
        },
        {
            'id': 2,
            'name': 'Sam Chen',
            'email': 'sam.chen@example.com',
            'age': 21,
            'status': 'at_risk',
            'lastAssessment': '2024-01-04',
            'riskLevel': 'high',
            'lastContact': '2024-01-04',
            'assignedDate': '2023-11-15',
            'phone': '555-0789',
            'emergency_contact': 'Sibling: 555-0321',
            'notes': 'Requires immediate attention - expressed suicidal ideation'
        },
        {
            'id': 3,
            'name': 'Jordan Smith',
            'email': 'jordan.s@example.com',
            'age': 18,
            'status': 'active',
            'lastAssessment': '2024-01-03',
            'riskLevel': 'medium',
            'lastContact': '2024-01-05',
            'assignedDate': '2024-01-01',
            'phone': '555-0654',
            'emergency_contact': 'Guardian: 555-0987',
            'notes': 'Responding well to therapy sessions'
        },
        {
            'id': 4,
            'name': 'Taylor Brown',
            'email': 'taylor.b@example.com',
            'age': 20,
            'status': 'inactive',
            'lastAssessment': '2023-12-20',
            'riskLevel': 'low',
            'lastContact': '2023-12-22',
            'assignedDate': '2023-10-10',
            'phone': '555-0147',
            'emergency_contact': 'Parent: 555-0258',
            'notes': 'Completed treatment program successfully'
        }
    ]
    
    return Response(clients)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_client(request, client_id):
    """
    Get specific client details - matches frontend guideService.getClient()
    """
    if request.user.role != 'guide':
        return Response({'error': 'Permission denied'}, status=403)
    
    # Return mock client data (replace with real database query)
    client = {
        'id': client_id,
        'name': 'Alex Johnson',
        'email': 'alex.j@example.com',
        'age': 19,
        'status': 'active',
        'lastAssessment': '2024-01-05',
        'riskLevel': 'low',
        'lastContact': '2024-01-06',
        'assignedDate': '2023-12-01',
        'phone': '555-0123',
        'emergency_contact': 'Parent: 555-0456',
        'notes': 'Making good progress with anxiety management'
    }
    
    return Response(client)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_crisis_alerts(request):
    """
    Get crisis alerts for guide - matches frontend guideService.getCrisisAlerts()
    """
    if request.user.role != 'guide':
        return Response({'error': 'Permission denied'}, status=403)
    
    # Return mock crisis alerts (replace with real database query)
    alerts = [
        {
            'id': 1,
            'clientName': 'Sam Chen',
            'clientId': 2,
            'severity': 'critical',
            'type': 'suicidal_ideation',
            'description': 'Client expressed thoughts of self-harm in recent assessment. Immediate intervention required.',
            'timestamp': '2024-01-06T14:30:00Z',
            'status': 'pending',
            'assignedTo': 'You',
            'lastAction': 'Alert generated',
            'contactAttempts': 0
        },
        {
            'id': 2,
            'clientName': 'Alex Johnson',
            'clientId': 1,
            'severity': 'high',
            'type': 'panic_attack',
            'description': 'Client reported severe panic attacks increasing in frequency over past week.',
            'timestamp': '2024-01-06T12:15:00Z',
            'status': 'in_progress',
            'assignedTo': 'You',
            'lastAction': 'Phone call attempted',
            'contactAttempts': 2
        },
        {
            'id': 3,
            'clientName': 'Jordan Smith',
            'clientId': 3,
            'severity': 'medium',
            'type': 'substance_abuse',
            'description': 'Client disclosed increased alcohol consumption as coping mechanism.',
            'timestamp': '2024-01-05T16:45:00Z',
            'status': 'resolved',
            'assignedTo': 'You',
            'lastAction': 'Follow-up scheduled',
            'contactAttempts': 1
        }
    ]
    
    return Response(alerts)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_analytics(request):
    """
    Get guide analytics - matches frontend guideService.getAnalytics()
    """
    if request.user.role != 'guide':
        return Response({'error': 'Permission denied'}, status=403)
    
    time_range = request.GET.get('range', '30d')
    
    # Return mock analytics data (replace with real database queries)
    analytics = {
        'totalClients': 4,
        'activeClients': 3,
        'atRiskClients': 1,
        'assessmentsThisWeek': 8,
        'interventionsThisMonth': 12,
        'clientEngagement': {
            'high': 2,
            'medium': 1,
            'low': 1
        },
        'riskDistribution': {
            'low': 2,
            'medium': 1,
            'high': 1
        },
        'monthlyTrends': [
            {'month': 'Dec 2023', 'assessments': 15, 'interventions': 8},
            {'month': 'Jan 2024', 'assessments': 18, 'interventions': 12},
            {'month': 'Feb 2024', 'assessments': 22, 'interventions': 15}
        ],
        'interventionSuccess': {
            'successful': 8,
            'ongoing': 3,
            'needsEscalation': 1
        }
    }
    
    return Response(analytics)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def contact_client(request):
    """
    Log client contact - matches frontend guideService.contactClient()
    """
    if request.user.role != 'guide':
        return Response({'error': 'Permission denied'}, status=403)
    
    contact_data = request.data
    # Add logic to save contact log to database
    
    return Response({
        'message': 'Client contact logged successfully',
        'contact_id': random.randint(100, 999),
        'timestamp': datetime.now().isoformat()
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_client_contacts(request, client_id):
    """
    Get client contact history - matches frontend guideService.getClientContacts()
    """
    if request.user.role != 'guide':
        return Response({'error': 'Permission denied'}, status=403)
    
    # Return mock contact history (replace with real database query)
    contacts = [
        {
            'id': 1,
            'client_id': client_id,
            'contact_type': 'phone',
            'notes': 'Discussed coping strategies for anxiety',
            'outcome': 'positive',
            'timestamp': '2024-01-06T10:30:00Z'
        },
        {
            'id': 2,
            'client_id': client_id,
            'contact_type': 'video',
            'notes': 'Weekly check-in session',
            'outcome': 'neutral',
            'timestamp': '2024-01-03T14:00:00Z'
        }
    ]
    
    return Response(contacts)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def schedule_follow_up(request):
    """
    Schedule follow-up - matches frontend guideService.scheduleFollowUp()
    """
    if request.user.role != 'guide':
        return Response({'error': 'Permission denied'}, status=403)
    
    follow_up_data = request.data
    # Add logic to save follow-up to database
    
    return Response({
        'message': 'Follow-up scheduled successfully',
        'follow_up_id': random.randint(100, 999),
        'scheduled_date': follow_up_data.get('scheduled_date')
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_follow_ups(request):
    """
    Get scheduled follow-ups - matches frontend guideService.getFollowUps()
    """
    if request.user.role != 'guide':
        return Response({'error': 'Permission denied'}, status=403)
    
    # Return mock follow-ups (replace with real database query)
    follow_ups = [
        {
            'id': 1,
            'client_id': 2,
            'client_name': 'Sam Chen',
            'scheduled_date': '2024-01-08T10:00:00Z',
            'notes': 'Crisis follow-up - check mental state',
            'completed': False
        },
        {
            'id': 2,
            'client_id': 1,
            'client_name': 'Alex Johnson',
            'scheduled_date': '2024-01-10T14:00:00Z',
            'notes': 'Weekly therapy session',
            'completed': False
        }
    ]
    
    return Response(follow_ups)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_client(request, client_id):
    """
    Update client information - matches frontend guideService.updateClient()
    """
    if request.user.role != 'guide':
        return Response({'error': 'Permission denied'}, status=403)
    
    update_data = request.data
    # Add logic to update client in database
    
    return Response({
        'message': 'Client updated successfully',
        'client_id': client_id,
        'updated_at': datetime.now().isoformat()
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_client(request, client_id):
    """
    Assign client to guide - matches frontend guideService.assignClient()
    """
    if request.user.role != 'guide':
        return Response({'error': 'Permission denied'}, status=403)
    
    # Add logic to assign client to guide
    return Response({
        'message': 'Client assigned successfully',
        'client_id': client_id,
        'guide_id': request.user.id
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unassign_client(request, client_id):
    """
    Unassign client from guide - matches frontend guideService.unassignClient()
    """
    if request.user.role != 'guide':
        return Response({'error': 'Permission denied'}, status=403)
    
    reason = request.data.get('reason', '')
    # Add logic to unassign client from guide
    
    return Response({
        'message': 'Client unassigned successfully',
        'client_id': client_id,
        'reason': reason
    })
    