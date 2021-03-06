# Generated by Django 3.0.5 on 2021-07-12 20:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0018_auto_20210711_2141'),
    ]

    operations = [
        migrations.AddField(
            model_name='usercategory',
            name='name',
            field=models.CharField(default='custom', max_length=200),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userhabit',
            name='custom_category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_habit', to='home.CustomCategory'),
        ),
        migrations.AddField(
            model_name='userhabit',
            name='custom_subcategory',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_habit', to='home.CustomSubCategory'),
        ),
        migrations.AddField(
            model_name='usersubcategory',
            name='name',
            field=models.CharField(default='name', max_length=200),
            preserve_default=False,
        ),
    ]
