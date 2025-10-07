from django.contrib import admin
from .models import (
    ContentCategory, Article, Video, AudioContent, MentalHealthResource
)


@admin.register(ContentCategory)
class ContentCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent_category', 'is_active', 'order']
    list_filter = ['is_active', 'parent_category']
    search_fields = ['name', 'description']
    ordering = ['order', 'name']


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'difficulty_level', 'is_published', 'view_count', 'published_at']
    list_filter = ['category', 'difficulty_level', 'is_published', 'is_featured', 'published_at']
    search_fields = ['title', 'content', 'author__username']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['view_count', 'like_count', 'created_at', 'updated_at']
    ordering = ['-published_at']


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'difficulty_level', 'duration_seconds', 'is_published', 'view_count']
    list_filter = ['category', 'difficulty_level', 'is_published', 'is_featured']
    search_fields = ['title', 'description', 'author__username']
    readonly_fields = ['view_count', 'like_count', 'created_at', 'updated_at']
    ordering = ['-published_at']


@admin.register(AudioContent)
class AudioContentAdmin(admin.ModelAdmin):
    list_display = ['title', 'audio_type', 'category', 'author', 'duration_seconds', 'is_published', 'play_count']
    list_filter = ['audio_type', 'category', 'is_published']
    search_fields = ['title', 'description', 'author__username']
    readonly_fields = ['play_count', 'like_count', 'created_at', 'updated_at']
    ordering = ['-published_at']


@admin.register(MentalHealthResource)
class MentalHealthResourceAdmin(admin.ModelAdmin):
    list_display = ['name', 'resource_type', 'city', 'state', 'cost_level', 'is_verified', 'rating']
    list_filter = ['resource_type', 'cost_level', 'is_verified', 'is_24_7', 'state']
    search_fields = ['name', 'description', 'city', 'state']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-rating', 'name']
    