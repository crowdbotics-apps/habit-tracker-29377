# Generated by Django 2.2.19 on 2021-03-11 19:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0005_score'),
    ]

    operations = [
        migrations.AlterField(
            model_name='score',
            name='date_time',
            field=models.DateTimeField(),
        ),
    ]