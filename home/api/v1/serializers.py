from django.contrib.auth import get_user_model
from django.conf import settings
from django.http import HttpRequest
from django.utils.translation import ugettext_lazy as _
from allauth.account import app_settings as allauth_settings
from allauth.account.forms import ResetPasswordForm
from allauth.utils import email_address_exists, generate_unique_username
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from allauth.socialaccount.helpers import complete_social_login
from rest_framework import serializers
from rest_auth.serializers import PasswordResetSerializer
from rest_auth.registration.serializers import SocialLoginSerializer
from rest_framework.authtoken.models import Token
from allauth.account.utils import complete_signup

from home.models import(CustomText, HomePage, Area,
                        Quote, Range, Score, Scoring,
                        UserArea, Category, UserCategory,
                        Value, SubCategory, UserSubCategory,
                        Habit, UserHabit, UserScoreJournal,
                        UserCategoryJournal, UserAreaJournal,
                        UserSubCategoryJournal, AreaWeight,
                        CategoryWeight, SubCategoryWeight, HabitWeight
                        )
from home.api.v1.user_utils import UserUtils
from users.models import Coaching, Settings

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password')
        extra_kwargs = {
            'password': {
                'write_only': True,
                'style': {
                    'input_type': 'password'
                }
            },
            'email': {
                'required': True,
                'allow_blank': False,
            }
        }

    def _get_request(self):
        request = self.context.get('request')
        if request and not isinstance(request, HttpRequest) and hasattr(request, '_request'):
            request = request._request
        return request

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def create(self, validated_data):
        user = User(
            email=validated_data.get('email'),
            name=validated_data.get('name'),
            username=generate_unique_username([
                validated_data.get('name'),
                validated_data.get('email'),
                'user'
            ])
        )
        user.set_password(validated_data.get('password'))
        user.save()
        request = self._get_request()
        setup_user_email(request, user, [])
        complete_signup(
            request, user, settings.ACCOUNT_EMAIL_VERIFICATION, "/")
        return user

    def save(self, request=None):
        """rest_auth passes request so we must override to accept it"""
        return super().save()


class CustomTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomText
        fields = '__all__'


class HomePageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePage
        fields = '__all__'


class UserSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        exclude = ['user']


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'is_superuser',
                  'is_coach', 'profile_picture', 'phone', 'first_name', 'last_name']

class UserSerializer(serializers.ModelSerializer):
    settings = serializers.SerializerMethodField()
    coaches = serializers.SerializerMethodField()
    assignees = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'is_superuser',
                  'is_coach', 'profile_picture', 'phone', 'settings', 'first_name', 'last_name', 'coaches',
                  'assignees']
    
    def get_settings(self, obj):
        return UserSettingSerializer(obj.get_settings()).data
    
    def get_coaches(self, obj):
        return SimpleUserSerializer([temp.coach for temp in Coaching.objects.filter(user=obj)], many=True).data
    
    def get_assignees(self, obj):
        return SimpleUserSerializer([temp.user for temp in Coaching.objects.filter(coach=obj)], many=True).data


class PasswordSerializer(PasswordResetSerializer):
    """Custom serializer for rest_auth to solve reset password error"""
    password_reset_form_class = ResetPasswordForm


class AppleSocialLoginSerializer(SocialLoginSerializer):
    def validate(self, attrs):
        view = self.context.get('view')
        request = self._get_request()

        if not view:
            raise serializers.ValidationError(
                _('View is not defined, pass it as a context variable')
            )

        adapter_class = getattr(view, 'adapter_class', None)
        if not adapter_class:
            raise serializers.ValidationError(
                _('Define adapter_class in view'))

        adapter = adapter_class(request)
        # app = adapter.get_provider().get_app(request)
        app = settings.SOCIALACCOUNT_PROVIDERS.get('apple')['APP']

        # More info on code vs access_token
        # http://stackoverflow.com/questions/8666316/facebook-oauth-2-0-code-and-token

        # Case 1: We received the access_token
        if attrs.get('access_token'):
            access_token = attrs.get('access_token')
            token = {'access_token': access_token}

        # Case 2: We received the authorization code
        elif attrs.get('code'):
            self.callback_url = getattr(view, 'callback_url', None)
            self.client_class = getattr(view, 'client_class', None)

            if not self.callback_url:
                raise serializers.ValidationError(
                    _('Define callback_url in view')
                )
            if not self.client_class:
                raise serializers.ValidationError(
                    _('Define client_class in view')
                )

            code = attrs.get('code')

            provider = adapter.get_provider()
            scope = provider.get_scope(request)
            client = self.client_class(
                request,
                app['client_id'],
                app['secret'],
                adapter.access_token_method,
                adapter.access_token_url,
                self.callback_url,
                scope,
                key=app['key'],
                cert=app['certificate_key'],
            )
            token = client.get_access_token(code)
            access_token = token['access_token']

        else:
            raise serializers.ValidationError(
                _('Incorrect input. access_token or code is required.'))

        # The important change is here.
        social_token = adapter.parse_token(token)
        social_token.app = app

        try:
            login = self.get_social_login(
                adapter, app, social_token, access_token)
            complete_social_login(request, login)
        except Exception:
            raise serializers.ValidationError(_('Incorrect value'))

        if not login.is_existing:
            # We have an account already signed up in a different flow
            # with the same email address: raise an exception.
            # This needs to be handled in the frontend. We can not just
            # link up the accounts due to security constraints
            if allauth_settings.UNIQUE_EMAIL:
                # Do we have an account already with this email address?
                if get_user_model().objects.filter(email=login.user.email).exists():
                    raise serializers.ValidationError(
                        _('E-mail already registered using different signup method.'))

            login.lookup()
            login.save(request, connect=True)

        attrs['user'] = login.account.user
        return attrs


class SocialSerializer(serializers.Serializer):
    access_token = serializers.CharField()

    def social_login(self, user_info, social_platform):
        social_id = user_info.pop("id")
        request = self.context.get("request")
        profile = UserUtils.get_profle_meta_details(request.META,
                                                    social_id=str(social_id),
                                                    social_platform=social_platform,
                                                    user_info=user_info
                                                    )
        update_data = {"is_active": True, "profile": profile}
        if "name" in user_info and user_info['name']:
            update_data.update({
                "name": user_info['name']
            })
        try:
            user = User.objects.get(username__iexact=user_info["email"])
            try:
                if user.profile.profile_image.file:
                    del update_data['profile']['profile_image']
            except:
                pass
        except User.DoesNotExist:
            user_dict = UserUtils.get_user_social_dict(user_info)
            user = UserSerializer().create(user_dict)
            token = Token.objects.create(user=user)
        except KeyError:
            raise serializers.ValidationError("Email not found")
        user = UserSerializer().update(instance=user,
                                       validated_data=update_data)

        return user


class SubCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = SubCategory
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class AreaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Area
        fields = '__all__'
        depth = 2


class UserAreaSerializer(serializers.ModelSerializer):
    system_area_name = AreaSerializer()

    class Meta:
        model = UserArea
        fields = '__all__'


class ScoreSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = '__all__'


class ValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Value
        fields = '__all__'


class RangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Range
        fields = '__all__'


class ScoringSerializer(serializers.ModelSerializer):
    values = ValueSerializer(many=True)
    ranges = RangeSerializer(many=True)
    class Meta:
        model = Scoring
        fields = '__all__'


class UserCategorySerializer(serializers.ModelSerializer):
    # parent_area = UserAreaSerializer()
    # system_category_name = CategorySerializer()

    class Meta:
        model = UserCategory
        fields = '__all__'


class UserSubCategorySerializer(serializers.ModelSerializer):

    # system_subcategory_name = SubCategorySerializer()
    # user_category = UserCategorySerializer()

    class Meta:
        model = UserSubCategory
        fields = '__all__'


class UserCategoryPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserCategory
        exclude = ['user']


class UserHabitPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCategory
        exclude = ['user']


class UserSubCategoryPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserSubCategory
        exclude = ['user']



class UserAreaCategorySerializer(serializers.ModelSerializer):
    area = AreaSerializer()

    class Meta:
        model = UserArea
        fields = '__all__'

    def get_categories(self, obj):
        categories = UserCategory.objects.filter(parent_area=obj)
        return UserCategorySerializer(categories, many=True, context={'start': self.context.get('start'), 'end': self.context.get('end')}).data



class ScorePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        exclude = ['user']


class QuotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = '__all__'


class CustomCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = UserCategory
        fields = '__all__'

class CustomSubCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = UserSubCategory
        fields = '__all__'


class UserCustomSubCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = UserSubCategory
        fields = '__all__'


class UserScoreJournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserScoreJournal
        fields = '__all__'


class UserCategoryJournalSerializer(serializers.ModelSerializer):
    category = UserCategorySerializer()
    user = UserSerializer()
    class Meta:
        model = UserCategoryJournal
        fields = '__all__'


class UserAreaJournalSerializer(serializers.ModelSerializer):
    area = AreaSerializer()
    user = UserSerializer()
    class Meta:
        model = UserAreaJournal
        fields = '__all__'


class UserSubCategoryJournalSerializer(serializers.ModelSerializer):
    category = UserSubCategorySerializer()
    user = UserSerializer()
    class Meta:
        model = UserSubCategoryJournal
        fields = '__all__'


class AreaWeightSerializer(serializers.ModelSerializer):

    class Meta:
        model = AreaWeight
        fields = '__all__'

class HabitWeightSerializer(serializers.ModelSerializer):

    class Meta:
        model = HabitWeight
        fields = '__all__'

class CategoryWeightSerializer(serializers.ModelSerializer):

    class Meta:
        model = CategoryWeight
        fields = '__all__'


class SubCategoryWeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategoryWeight
        fields = '__all__'


class HabitSerializer(serializers.ModelSerializer):

    class Meta:
        model = Habit
        fields = '__all__'


class UserHabitSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserHabit
        fields = '__all__'

    #custom_subcategory = CustomSubCategorySerializer()


class ScoreSerializer(serializers.ModelSerializer):
    # user_habit = UserHabitSerializer()

    class Meta:
        model = Score
        fields = '__all__'