# Generated by Django 2.2.23 on 2021-06-14 18:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0012_auto_20210613_1846'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usersubcategory',
            name='area',
        ),
        migrations.AddField(
            model_name='usersubcategory',
            name='category',
            field=models.ForeignKey(default=5, on_delete=django.db.models.deletion.CASCADE, related_name='usersubcategory_category', to='home.Category'),
            preserve_default=False,
        ),
    ]
