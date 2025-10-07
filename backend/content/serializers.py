from rest_framework import serializers
from .models import (
    ContentCategory, Article, Video, AudioContent, MentalHealthResource
)


class ContentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentCategory
        fields = ['id', 'name', 'description', 'icon', 'color', 'parent_category', 'order', 'is_active']


class ArticleSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.display_name', read_only=True)
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'category', 'category_name',
            'tags', 'difficulty_level', 'author', 'author_name', 'featured_image',
            'estimated_read_time', 'view_count', 'like_count', 'is_published',
            'is_featured', 'published_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['author', 'view_count', 'like_count', 'created_at', 'updated_at']


class VideoSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.display_name', read_only=True)
    
    class Meta:
        model = Video
        fields = [
            'id', 'title', 'description', 'video_url', 'thumbnail_image',
            'duration_seconds', 'category', 'category_name', 'tags',
            'difficulty_level', 'author', 'author_name', 'view_count',
            'like_count', 'is_published', 'is_featured', 'published_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['author', 'view_count', 'like_count', 'created_at', 'updated_at']


class AudioContentSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.display_name', read_only=True)
    
    class Meta:
        model = AudioContent
        fields = [
            'id', 'title', 'description', 'audio_type', 'audio_file',
            'audio_url', 'duration_seconds', 'category', 'category_name',
            'tags', 'author', 'author_name', 'thumbnail_image',
            'play_count', 'like_count', 'is_published', 'published_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['author', 'play_count', 'like_count', 'created_at', 'updated_at']


class MentalHealthResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentalHealthResource
        fields = [
            'id', 'name', 'description', 'resource_type', 'phone_number',
            'email', 'website', 'address', 'city', 'state', 'zip_code',
            'latitude', 'longitude', 'services_offered', 'specializations',
            'age_groups_served', 'languages', 'hours_of_operation', 'is_24_7',
            'accepts_walk_ins', 'cost_level', 'insurance_accepted', 'is_verified',
            'rating', 'created_at', 'updated_at'
        ]
        