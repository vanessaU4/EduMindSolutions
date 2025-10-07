from rest_framework import serializers
from .models import (
    ForumCategory, ForumPost, ForumComment, ChatRoom, 
    ChatMessage, PeerSupportMatch, ModerationReport
)
from accounts.models import User


class ForumCategorySerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ForumCategory
        fields = ['id', 'name', 'description', 'icon', 'color', 'is_active', 'order', 'post_count']
    
    def get_post_count(self, obj):
        return obj.posts.filter(is_approved=True).count()


class ForumPostSerializer(serializers.ModelSerializer):
    author_display_name = serializers.ReadOnlyField()
    comment_count = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = ForumPost
        fields = [
            'id', 'title', 'content', 'author', 'author_display_name',
            'category', 'category_name', 'is_anonymous', 'is_pinned', 
            'is_locked', 'view_count', 'like_count', 'author_mood',
            'created_at', 'updated_at', 'last_activity', 'comment_count'
        ]
        read_only_fields = ['author', 'view_count', 'like_count', 'created_at', 'updated_at', 'last_activity']
    
    def get_comment_count(self, obj):
        return obj.comments.filter(is_approved=True).count()
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class ForumCommentSerializer(serializers.ModelSerializer):
    author_display_name = serializers.ReadOnlyField()
    
    class Meta:
        model = ForumComment
        fields = [
            'id', 'post', 'author', 'author_display_name', 'content',
            'parent_comment', 'is_anonymous', 'like_count', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['author', 'like_count', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class ChatRoomSerializer(serializers.ModelSerializer):
    active_participants = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = [
            'id', 'name', 'description', 'topic', 'max_participants',
            'is_active', 'is_moderated', 'active_participants', 'created_at'
        ]
    
    def get_active_participants(self, obj):
        # In a real implementation, this would track active WebSocket connections
        return 0


class ChatMessageSerializer(serializers.ModelSerializer):
    author_display_name = serializers.ReadOnlyField()
    
    class Meta:
        model = ChatMessage
        fields = [
            'id', 'room', 'author', 'author_display_name', 'content',
            'is_anonymous', 'is_system_message', 'created_at'
        ]
        read_only_fields = ['author', 'created_at']
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class PeerSupportMatchSerializer(serializers.ModelSerializer):
    requester_name = serializers.CharField(source='requester.display_name', read_only=True)
    supporter_name = serializers.CharField(source='supporter.display_name', read_only=True)
    
    class Meta:
        model = PeerSupportMatch
        fields = [
            'id', 'requester', 'requester_name', 'supporter', 'supporter_name',
            'preferred_topics', 'preferred_age_range', 'preferred_gender',
            'status', 'matched_at', 'completed_at', 'created_at'
        ]
        read_only_fields = ['requester', 'matched_at', 'completed_at', 'created_at']
    
    def create(self, validated_data):
        validated_data['requester'] = self.context['request'].user
        return super().create(validated_data)


class ModerationReportSerializer(serializers.ModelSerializer):
    reporter_name = serializers.CharField(source='reporter.display_name', read_only=True)
    moderator_name = serializers.CharField(source='moderator.display_name', read_only=True)
    
    class Meta:
        model = ModerationReport
        fields = [
            'id', 'reporter', 'reporter_name', 'report_type', 'description',
            'reported_post', 'reported_comment', 'reported_user',
            'status', 'moderator', 'moderator_name', 'moderator_notes',
            'action_taken', 'created_at', 'resolved_at'
        ]
        read_only_fields = ['reporter', 'created_at', 'resolved_at']
    
    def create(self, validated_data):
        validated_data['reporter'] = self.context['request'].user
        return super().create(validated_data)
        