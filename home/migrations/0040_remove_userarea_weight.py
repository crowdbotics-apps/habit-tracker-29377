# Generated by Django 3.0.5 on 2021-07-21 20:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0039_auto_20210720_2103'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userarea',
            name='weight',
        ),
    ]
