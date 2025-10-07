from rest_framework import serializers
from .models import (
    AssessmentType, AssessmentQuestion, Assessment, 
    AssessmentResponse, AssessmentRecommendation, AssessmentRequest, ClientAssessmentAssignment
)
from django.contrib.auth import get_user_model

User = get_user_model()

class AssessmentQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentQuestion
        fields = ['id', 'question_number', 'question_text', 'options', 'is_reverse_scored']

class AssessmentTypeSerializer(serializers.ModelSerializer):
    questions = AssessmentQuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = AssessmentType
        fields = [
            'id', 'name', 'display_name', 'description', 'instructions',
            'total_questions', 'max_score', 'is_active', 'questions'
        ]

class AssessmentResponseSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    
    class Meta:
        model = AssessmentResponse
        fields = ['question', 'question_text', 'selected_option_index', 'score']

class AssessmentSerializer(serializers.ModelSerializer):
    responses = AssessmentResponseSerializer(many=True, read_only=True)
    assessment_type_name = serializers.CharField(source='assessment_type.display_name', read_only=True)
    percentage_score = serializers.ReadOnlyField(source='get_percentage_score')
    
    class Meta:
        model = Assessment
        fields = [
            'id', 'assessment_type', 'assessment_type_name', 'total_score', 
            'percentage_score', 'risk_level', 'interpretation', 'recommendations',
            'completed_at', 'responses'
        ]
        read_only_fields = ['id', 'completed_at', 'total_score', 'risk_level', 'interpretation']

class TakeAssessmentSerializer(serializers.Serializer):
    """Serializer for taking an assessment"""
    assessment_type_id = serializers.IntegerField()
    responses = serializers.ListField(
        child=serializers.DictField(
            child=serializers.IntegerField()
        )
    )
    
    def validate_assessment_type_id(self, value):
        try:
            assessment_type = AssessmentType.objects.get(id=value, is_active=True)
        except AssessmentType.DoesNotExist:
            raise serializers.ValidationError("Invalid assessment type.")
        return value
    
    def validate_responses(self, value):
        if not value:
            raise serializers.ValidationError("Responses are required.")
        
        # Validate response format
        for response in value:
            if 'question_id' not in response or 'selected_option_index' not in response:
                raise serializers.ValidationError(
                    "Each response must have 'question_id' and 'selected_option_index'."
                )
        
        return value

class AssessmentRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentRecommendation
        fields = [
            'id', 'assessment_type', 'risk_level', 'title', 'description',
            'action_items', 'resources', 'priority'
        ]

class AssessmentHistorySerializer(serializers.ModelSerializer):
    """Simplified serializer for assessment history"""
    assessment_type_name = serializers.CharField(source='assessment_type.display_name', read_only=True)
    percentage_score = serializers.ReadOnlyField(source='get_percentage_score')
    
    class Meta:
        model = Assessment
        fields = [
            'id', 'assessment_type_name', 'total_score', 'percentage_score',
            'risk_level', 'completed_at'
        ]

class AssessmentRequestSerializer(serializers.ModelSerializer):
    """Serializer for assessment requests"""
    requester_name = serializers.CharField(source='requester.get_full_name', read_only=True)
    target_assessment_name = serializers.CharField(source='target_assessment.display_name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True)
    
    class Meta:
        model = AssessmentRequest
        fields = [
            'id', 'requester', 'requester_name', 'request_type', 'title', 'description',
            'justification', 'target_assessment', 'target_assessment_name', 'proposed_questions',
            'expected_outcomes', 'status', 'admin_notes', 'reviewed_by', 'reviewed_by_name',
            'created_at', 'updated_at', 'reviewed_at'
        ]
        read_only_fields = ['id', 'requester', 'created_at', 'updated_at', 'reviewed_at']

class CreateAssessmentRequestSerializer(serializers.ModelSerializer):
    """Serializer for creating assessment requests"""
    
    class Meta:
        model = AssessmentRequest
        fields = [
            'request_type', 'title', 'description', 'justification',
            'target_assessment', 'proposed_questions', 'expected_outcomes'
        ]

class ClientAssessmentAssignmentSerializer(serializers.ModelSerializer):
    """Serializer for client assessment assignments"""
    guide_name = serializers.CharField(source='guide.get_full_name', read_only=True)
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    assessment_type_name = serializers.CharField(source='assessment_type.display_name', read_only=True)
    
    class Meta:
        model = ClientAssessmentAssignment
        fields = [
            'id', 'guide', 'guide_name', 'client', 'client_name', 'assessment_type',
            'assessment_type_name', 'assigned_date', 'due_date', 'priority', 'notes',
            'is_completed', 'completed_at', 'reminder_sent'
        ]
        read_only_fields = ['id', 'guide', 'assigned_date', 'completed_at']

class CreateAssignmentSerializer(serializers.ModelSerializer):
    """Serializer for creating assessment assignments"""
    
    class Meta:
        model = ClientAssessmentAssignment
        fields = ['client', 'assessment_type', 'due_date', 'priority', 'notes']
        