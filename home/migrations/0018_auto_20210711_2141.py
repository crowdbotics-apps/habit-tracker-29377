# Generated by Django 3.0.5 on 2021-07-11 21:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0017_userhabit_type'),
    ]

    operations = [
        migrations.RenameField(
            model_name='score',
            old_name='user',
            new_name='user_id',
        ),
        migrations.AddField(
            model_name='habit',
            name='date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='usercategory',
            name='date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='userhabit',
            name='date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='usersubcategoryjournal',
            name='date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
