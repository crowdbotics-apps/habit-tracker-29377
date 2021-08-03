from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _


class User(AbstractUser):
    # WARNING!
    """
    Some officially supported features of Crowdbotics Dashboard depend on the initial
    state of this User model (Such as the creation of superusers using the CLI
    or password reset in the dashboard). Changing, extending, or modifying this model
    may lead to unexpected bugs and or behaviors in the automated flows provided
    by Crowdbotics. Change it at your own risk.


    This model represents the User instance of the system, login system and
    everything that relates with an `User` is represented by this model.
    """

    # First Name and Last Name do not cover name patterns
    # around the globe.
    name = models.CharField(_("Name of User"), blank=True, null=True, max_length=255)
    phone = models.CharField(max_length=50, blank=True, null=True)
    is_coach = models.BooleanField(default=False)
    profile_picture = models.ImageField(blank=True, null=True)

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})
    

    def get_settings(self):
        try:
            settings = self.settings
        except User.settings.RelatedObjectDoesNotExist:
            settings = Settings.objects.create(user=self)
        return settings
        

class Coaching(models.Model):
    coach = models.ForeignKey('User', related_name='assignee', on_delete=models.CASCADE)
    user = models.ForeignKey('User', related_name='coaches', on_delete=models.CASCADE)


class Settings(models.Model):
    NOTIFICATION_FREQUENCY = (
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly')
    )
    DISPLAY_VALUES = (
        ('graph_only', 'Graph Only'),
    )
    user = models.OneToOneField(User, related_name='settings', on_delete=models.CASCADE)
    notifications = models.CharField(choices=NOTIFICATION_FREQUENCY, max_length=50, default=NOTIFICATION_FREQUENCY[0][0])
    display_values = models.CharField(choices=DISPLAY_VALUES, max_length=50, default=DISPLAY_VALUES[0][0])
