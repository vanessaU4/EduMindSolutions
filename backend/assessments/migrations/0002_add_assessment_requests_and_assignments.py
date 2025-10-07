# Generated manually for assessment requests and client assignments

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assessments', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AssessmentRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('request_type', models.CharField(choices=[('new_assessment', 'New Assessment Type'), ('modify_assessment', 'Modify Existing Assessment'), ('add_questions', 'Add Questions to Assessment'), ('modify_scoring', 'Modify Scoring System')], max_length=20)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('justification', models.TextField(help_text='Why is this assessment needed?')),
                ('proposed_questions', models.JSONField(default=list, help_text='Proposed questions and options')),
                ('expected_outcomes', models.TextField()),
                ('status', models.CharField(choices=[('pending', 'Pending Review'), ('approved', 'Approved'), ('rejected', 'Rejected'), ('in_progress', 'In Progress'), ('completed', 'Completed')], default='pending', max_length=15)),
                ('admin_notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('reviewed_at', models.DateTimeField(blank=True, null=True)),
                ('requester', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assessment_requests', to=settings.AUTH_USER_MODEL)),
                ('reviewed_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reviewed_requests', to=settings.AUTH_USER_MODEL)),
                ('target_assessment', models.ForeignKey(blank=True, help_text='For modifications to existing assessments', null=True, on_delete=django.db.models.deletion.CASCADE, to='assessments.assessmenttype')),
            ],
            options={
                'db_table': 'assessments_request',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='ClientAssessmentAssignment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assigned_date', models.DateTimeField(auto_now_add=True)),
                ('due_date', models.DateTimeField(blank=True, null=True)),
                ('priority', models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='medium', max_length=10)),
                ('notes', models.TextField(blank=True)),
                ('is_completed', models.BooleanField(default=False)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('reminder_sent', models.BooleanField(default=False)),
                ('assessment_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='assessments.assessmenttype')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assessment_assignments', to=settings.AUTH_USER_MODEL)),
                ('guide', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assigned_assessments', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'assessments_assignment',
                'ordering': ['-assigned_date'],
            },
        ),
        migrations.AddConstraint(
            model_name='clientassessmentassignment',
            constraint=models.UniqueConstraint(fields=('guide', 'client', 'assessment_type'), name='unique_guide_client_assessment'),
        ),
    ]
    