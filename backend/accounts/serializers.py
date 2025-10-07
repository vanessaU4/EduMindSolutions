from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email', 'username', 'password', 'confirm_password',
            'first_name', 'last_name', 'role', 'age', 'gender', 'bio',
            'is_anonymous_preferred', 'allow_peer_matching', 'crisis_contact_phone',
            'professional_title', 'license_number', 'specializations', 'years_experience'
        ]
        extra_kwargs = {
            'age': {'required': True},
            'professional_title': {'required': False},
            'license_number': {'required': False},
            'specializations': {'required': False},
            'years_experience': {'required': False},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_role(self, value):
        valid_roles = ['user', 'guide', 'admin']
        if value not in valid_roles:
            raise serializers.ValidationError(f"Role must be one of: {', '.join(valid_roles)}")
        return value

    def validate_age(self, value):
        if value and (value < 13 or value > 23):
            raise serializers.ValidationError("Age must be between 13 and 23 for this platform.")
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")

        # Validate guide-specific fields
        if data.get('role') == 'guide':
            if not data.get('professional_title'):
                raise serializers.ValidationError("Professional title is required for guides.")
            if not data.get('years_experience'):
                raise serializers.ValidationError("Years of experience is required for guides.")

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")
    
class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    display_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'full_name', 'display_name',
            'role', 'age', 'gender', 'bio', 'avatar', 'is_anonymous_preferred',
            'allow_peer_matching', 'onboarding_completed', 'last_mood_checkin',
            'professional_title', 'license_number', 'specializations', 'years_experience',
            'is_active', 'date_joined', 'last_active'
        ]
        read_only_fields = ['id', 'date_joined', 'last_active', 'full_name', 'display_name']

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile updates"""

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'bio', 'avatar', 'gender',
            'is_anonymous_preferred', 'allow_peer_matching', 'crisis_contact_phone',
            'notification_preferences'
        ]

class GuideProfileSerializer(serializers.ModelSerializer):
    """Serializer for guide/mentor profile updates"""

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'bio', 'avatar', 'professional_title',
            'license_number', 'specializations', 'years_experience'
        ]

class UserPublicSerializer(serializers.ModelSerializer):
    """Public user information for community features"""
    display_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ['id', 'display_name', 'role', 'avatar', 'bio', 'specializations']

class OnboardingSerializer(serializers.ModelSerializer):
    """Serializer for completing user onboarding"""

    class Meta:
        model = User
        fields = [
            'age', 'gender', 'bio', 'is_anonymous_preferred', 'allow_peer_matching',
            'crisis_contact_phone', 'notification_preferences', 'onboarding_completed'
        ]

    def validate_age(self, value):
        if value and (value < 13 or value > 23):
            raise serializers.ValidationError("Age must be between 13 and 23 for this platform.")
        return value
        