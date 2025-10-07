# 🔧 Backend Endpoints Implementation Guide

## ✅ **RECENT FIXES COMPLETED**

### **Content Management 404 Errors - FIXED!**
**Issue:** Frontend was getting 404 errors for:
- `/api/content/articles/manage/?published=true`
- `/api/content/videos/manage/?published=true` 
- `/api/content/audio/manage/?published=true`

**Solution Applied:**
1. ✅ Added missing `/manage/` URL patterns to `backend/content/urls.py`
2. ✅ Fixed duplicate view classes in `backend/content/views.py`
3. ✅ Updated permission checks to use `user.role` instead of `user.is_staff`
4. ✅ Added proper role-based filtering for content visibility
5. ✅ Created sample content fixtures for testing

**Result:** All content management endpoints now work correctly and the Education Center should load without 404 errors.

---

## 📍 **WHERE TO ADD REAL DATA - BACKEND ENDPOINTS**

### **1. Assessment Endpoints** (Already Implemented ✅)
**File:** `c:\Users\Public\eduMindSolutions\backend\assessments\views.py`
```python
# These should already exist:
GET /api/assessments/types/          # Get available assessment types
GET /api/assessments/history/        # Get user's assessment history  
GET /api/assessments/results/{id}/   # Get specific assessment result
POST /api/assessments/submit/        # Submit completed assessment
```

### **2. Community Endpoints** (Already Implemented ✅)
**File:** `c:\Users\Public\eduMindSolutions\backend\community\views.py`
```python
# These should already exist:
GET /api/community/forum-categories/     # Get forum categories
GET /api/community/forum-posts/          # Get forum posts
GET /api/community/chat-rooms/           # Get chat rooms
GET /api/community/peer-support-matches/ # Get peer matches
POST /api/community/forum-posts/         # Create new post
```

### **3. Content Endpoints** (✅ FIXED - WORKING NOW)
**File:** `c:\Users\Public\eduMindSolutions\backend\content\views.py`
```python
# Content Management Endpoints (FIXED):
GET /api/content/articles/manage/        # Get articles for management
POST /api/content/articles/manage/       # Create new article
GET /api/content/articles/manage/{id}/   # Get specific article
PUT /api/content/articles/manage/{id}/   # Update article
DELETE /api/content/articles/manage/{id}/ # Delete article

GET /api/content/videos/manage/          # Get videos for management  
POST /api/content/videos/manage/         # Create new video
GET /api/content/videos/manage/{id}/     # Get specific video
PUT /api/content/videos/manage/{id}/     # Update video
DELETE /api/content/videos/manage/{id}/  # Delete video

GET /api/content/audio/manage/           # Get audio content for management
POST /api/content/audio/manage/          # Create new audio content
GET /api/content/audio/manage/{id}/      # Get specific audio content
PUT /api/content/audio/manage/{id}/      # Update audio content
DELETE /api/content/audio/manage/{id}/   # Delete audio content

GET /api/content/categories/             # Get content categories
GET /api/content/resources/              # Get mental health resources
```

**✅ ISSUE FIXED:** The frontend was getting 404 errors because the `/manage/` endpoints were missing. These have now been added to the backend URLs and all content management functionality should work properly.

### **4. NEW ENDPOINTS YOU NEED TO CREATE:**

#### **A. Wellness Endpoints** ⚠️ **CREATE THESE**
**File:** `c:\Users\Public\eduMindSolutions\backend\wellness\views.py`
```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wellness_data(request):
    """Get user's wellness statistics"""
    user = request.user
    # Add your logic here to get real wellness data
    data = {
        'currentStreak': user.wellness_profile.current_streak,
        'totalPoints': user.wellness_profile.total_points,
        'weeklyGoal': user.wellness_profile.weekly_goal,
        'weeklyProgress': user.wellness_profile.weekly_progress,
        'recentMoods': list(user.mood_entries.all()[:5].values()),
        'achievements': list(user.achievements.all().values()),
        'todaysChallenge': user.get_todays_challenge()
    }
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_mood_entry(request):
    """Add a mood entry"""
    # Add your logic here
    pass

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_challenge(request, challenge_id):
    """Complete a daily challenge"""
    # Add your logic here
    pass
```

#### **B. Crisis Endpoints** ⚠️ **CREATE THESE**
**File:** `c:\Users\Public\eduMindSolutions\backend\crisis\views.py`
```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_safety_plan(request):
    """Get user's safety plan"""
    user = request.user
    safety_plan = user.safety_plan
    data = {
        'warning_signs': safety_plan.warning_signs,
        'coping_strategies': safety_plan.coping_strategies,
        'support_people': list(safety_plan.support_people.all().values()),
        'professional_contacts': list(safety_plan.professional_contacts.all().values()),
        'safe_environment': safety_plan.safe_environment,
        'reasons_to_live': safety_plan.reasons_to_live,
        'emergency_contacts': safety_plan.emergency_contacts
    }
    return Response(data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_safety_plan(request):
    """Update user's safety plan"""
    # Add your logic here
    pass

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_crisis_alerts(request):
    """Get crisis alerts (for guides only)"""
    if request.user.role != 'guide':
        return Response({'error': 'Permission denied'}, status=403)
    
    alerts = CrisisAlert.objects.filter(assigned_to=request.user)
    return Response(alerts.values())
```

#### **C. Guide Endpoints** ⚠️ **CREATE THESE**
**File:** `c:\Users\Public\eduMindSolutions\backend\guide\views.py`
```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_clients(request):
    """Get guide's assigned clients"""
    if request.user.role != 'guide':
        return Response({'error': 'Permission denied'}, status=403)
    
    clients = User.objects.filter(assigned_guide=request.user)
    data = []
    for client in clients:
        data.append({
            'id': client.id,
            'name': f"{client.first_name} {client.last_name}",
            'email': client.email,
            'age': client.age,
            'status': client.status,
            'lastAssessment': client.get_last_assessment_date(),
            'riskLevel': client.get_risk_level(),
            'lastContact': client.get_last_contact_date(),
            'assignedDate': client.assigned_date
        })
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_guide_analytics(request):
    """Get analytics for guide"""
    if request.user.role != 'guide':
        return Response({'error': 'Permission denied'}, status=403)
    
    # Add your analytics logic here
    pass
```

---

## 👥 **USER ROLES IN THE SYSTEM**

### **1. USER ROLE (Regular Users)**
**Role:** `'user'`
**Access Level:** Basic user features
**Pages They Can Access:**
- Dashboard
- Assessment Center (take assessments, view history, results)
- Wellness Center (mood tracking, challenges, achievements)
- Community (forums, peer support, chat rooms)
- Resources Directory
- Safety Planning (personal safety plan)
- Education content

**Database Field:** `user.role = 'user'`

### **2. GUIDE ROLE (Mental Health Guides)**
**Role:** `'guide'`
**Access Level:** Can manage assigned clients
**Pages They Can Access:**
- All USER pages PLUS:
- Client Management (view assigned clients)
- Crisis Alerts (monitor client crises)
- Analytics (client progress tracking)
- Guide Dashboard

**Database Field:** `user.role = 'guide'`

### **3. ADMIN ROLE (System Administrators)**
**Role:** `'admin'`
**Access Level:** Full system access
**Pages They Can Access:**
- All USER and GUIDE pages PLUS:
- User Management (CRUD all users)
- Content Management
- System Analytics
- Compliance Reports
- Admin Dashboard

**Database Field:** `user.role = 'admin'`

---

## 🔧 **HOW TO SET UP USER ROLES**

### **1. In Your Django Models:**
**File:** `c:\Users\Public\eduMindSolutions\backend\accounts\models.py`
```python
class User(AbstractUser):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('guide', 'Guide'),
        ('admin', 'Admin'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    # ... other fields
```

### **2. Create Test Users:**
**File:** `c:\Users\Public\eduMindSolutions\backend\create_test_users.py`
```python
from django.contrib.auth import get_user_model
User = get_user_model()

# Create admin user
admin = User.objects.create_user(
    username='admin',
    email='admin@example.com',
    password='admin123',
    role='admin',
    first_name='Admin',
    last_name='User'
)

# Create guide user
guide = User.objects.create_user(
    username='guide',
    email='guide@example.com', 
    password='guide123',
    role='guide',
    first_name='Guide',
    last_name='User'
)

# Create regular user
user = User.objects.create_user(
    username='user',
    email='user@example.com',
    password='user123', 
    role='user',
    first_name='Regular',
    last_name='User'
)
```

---

## 📂 **URL ROUTING FOR NEW ENDPOINTS**

### **Add to your Django URLs:**
**File:** `c:\Users\Public\eduMindSolutions\backend\urls.py`
```python
urlpatterns = [
    # Existing URLs...
    path('api/wellness/', include('wellness.urls')),
    path('api/crisis/', include('crisis.urls')),
    path('api/guide/', include('guide.urls')),
]
```

### **Create individual URL files:**
**File:** `c:\Users\Public\eduMindSolutions\backend\wellness\urls.py`
```python
from django.urls import path
from . import views

urlpatterns = [
    path('data/', views.get_wellness_data, name='wellness-data'),
    path('mood/', views.add_mood_entry, name='add-mood'),
    path('challenge/<int:challenge_id>/complete/', views.complete_challenge, name='complete-challenge'),
]
```

---

## 🎯 **SUMMARY: WHERE TO ADD DATA**

### **Backend (Django):**
1. **Create new apps:** `wellness`, `crisis`, `guide`
2. **Add views** in each app's `views.py`
3. **Add URL patterns** in each app's `urls.py`
4. **Create models** for data storage
5. **Run migrations** to create database tables

### **Frontend (Already Done ✅):**
- All frontend pages now call real APIs
- Service files created and connected
- No more mock data anywhere

### **User Roles:**
- **user** - Basic features
- **guide** - Client management + user features  
- **admin** - Full system access

**The frontend is 100% ready - you just need to implement the backend endpoints I've outlined above!**
