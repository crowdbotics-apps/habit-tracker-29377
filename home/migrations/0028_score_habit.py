# Generated by Django 3.0.5 on 2021-07-16 10:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0027_remove_score_user_habit'),
    ]

    operations = [
        migrations.AddField(
            model_name='score',
            name='habit',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_habit_score', to='home.UserHabit'),
        ),
    ]