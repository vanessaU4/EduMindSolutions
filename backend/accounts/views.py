
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    LoginSerializer, RegisterSerializer, UserSerializer,
    UserProfileSerializer, GuideProfileSerializer, UserPublicSerializer,
    OnboardingSerializer
)
from .models import User

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        username = request.data.get('username')

        # Check if email or username already exists
        if User.objects.filter(email=email).exists() or User.objects.filter(username=username).exists():
            return Response(
                {"detail": "An account with this email or username already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate and save the new user
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Account created successfully.", "user": serializer.data},
                status=status.HTTP_201_CREATED
            )

        # Return any serializer validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            tokens = get_tokens_for_user(user)

            # Use UserSerializer for complete user data
            user_serializer = UserSerializer(user)

            return Response({
                "detail": "Login successful.",
                "token": tokens,
                "user": user_serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            "detail": "Invalid email or password.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.user.is_guide():
            return GuideProfileSerializer
        return UserProfileSerializer

class UserDetailView(generics.RetrieveAPIView):
    """Get current user details"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class OnboardingView(APIView):
    """Complete user onboarding"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = OnboardingSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(onboarding_completed=True)
            return Response({
                "detail": "Onboarding completed successfully.",
                "user": UserSerializer(request.user).data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListView(generics.ListAPIView):
    """List users for community features (guides only)"""
    serializer_class = UserPublicSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only guides can see user lists
        if not self.request.user.is_guide() and not self.request.user.is_staff:
            return User.objects.none()
        return User.objects.filter(is_active=True)


class AdminUserListView(generics.ListCreateAPIView):
    """Admin view for managing all users"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only admins can see all users
        if not (self.request.user.role == 'admin' or self.request.user.is_staff):
            return User.objects.none()
        return User.objects.all().order_by('-date_joined')
    
    def perform_create(self, serializer):
        # Only admins can create users
        if not (self.request.user.role == 'admin' or self.request.user.is_staff):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only admins can create users")
        serializer.save()


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin view for managing individual users"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only admins can manage users
        if not (self.request.user.role == 'admin' or self.request.user.is_staff):
            return User.objects.none()
        return User.objects.all()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def debug_user_info(request):
    """Debug endpoint to check user permissions and data"""
    user = request.user
    total_users = User.objects.count()
    
    return Response({
        "current_user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        },
        "permissions": {
            "can_see_admin_users": user.role == 'admin' or user.is_staff,
            "can_moderate": user.can_moderate(),
            "is_guide": user.is_guide(),
        },
        "database_stats": {
            "total_users": total_users,
            "admin_users": User.objects.filter(role='admin').count(),
            "guide_users": User.objects.filter(role='guide').count(),
            "regular_users": User.objects.filter(role='user').count(),
            "active_users": User.objects.filter(is_active=True).count(),
        }
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_mood_checkin(request):
    """Update user's last mood check-in timestamp"""
    user = request.user
    user.last_mood_checkin = timezone.now()
    user.save(update_fields=['last_mood_checkin'])

    return Response({
        "detail": "Mood check-in updated successfully.",
        "last_mood_checkin": user.last_mood_checkin
    }, status=status.HTTP_200_OK)

class PasswordResetRequestView(APIView):
    """Request password reset email"""

    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response({
                "detail": "Email address is required."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email, is_active=True)

            # Generate password reset token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            # Create reset link (in production, use your domain)
            reset_link = f"http://localhost:3001/reset-password/{uid}/{token}/"

            # Send email (in development, just log it)
            subject = "EduMindSolutions - Password Reset Request"
            message = f"""
            Hello {user.first_name},

            You have requested a password reset for your EduMindSolutions account.

            Click the link below to reset your password:
            {reset_link}

            This link will expire in 1 hour for security reasons.

            If you did not request this password reset, please ignore this email.

            Best regards,
            EduMindSolutions Healthcare Team
            """

            # In development, print to console
            print(f"Password reset email for {email}:")
            print(f"Reset link: {reset_link}")

            # In production, uncomment this:
            # send_mail(
            #     subject,
            #     message,
            #     settings.DEFAULT_FROM_EMAIL,
            #     [email],
            #     fail_silently=False,
            # )

            return Response({
                "detail": "Password reset email sent successfully."
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            # Don't reveal if email exists or not for security
            return Response({
                "detail": "Password reset email sent successfully."
            }, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    """Confirm password reset with token"""

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not all([uid, token, new_password]):
            return Response({
                "detail": "UID, token, and new password are required."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode user ID
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id, is_active=True)

            # Verify token
            if default_token_generator.check_token(user, token):
                # Set new password
                user.set_password(new_password)
                user.save()

                return Response({
                    "detail": "Password reset successfully."
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "detail": "Invalid or expired reset token."
                }, status=status.HTTP_400_BAD_REQUEST)

        except (User.DoesNotExist, ValueError, TypeError):
            return Response({
                "detail": "Invalid reset link."
            }, status=status.HTTP_400_BAD_REQUEST)
            