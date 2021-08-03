import jwt
import datetime
import json
from allauth.socialaccount.providers.facebook.views import \
    FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.contrib.auth import get_user_model
from django.db.models import Q
from home.api.v1.serializers import (AppleSocialLoginSerializer,
                                     CategorySerializer, CustomTextSerializer,
                                     HomePageSerializer, QuotesSerializer, UserHabitPostSerializer,
                                     ScorePostSerializer, ScoreSerializer,
                                     ScoringSerializer, SignupSerializer,
                                     SocialSerializer, UserSubCategorySerializer,
                                     UserAreaCategorySerializer, UserCustomSubCategorySerializer,
                                     UserAreaSerializer, UserSubCategoryPostSerializer,
                                     UserCategoryPostSerializer, HabitSerializer,
                                     UserCategorySerializer, UserSerializer,
                                     UserSettingSerializer, UserHabitSerializer, UserCategoryJournalSerializer,
                                     UserSubCategoryJournalSerializer, UserAreaJournalSerializer,
                                     UserScoreJournalSerializer, AreaWeightSerializer, CategoryWeightSerializer,
                                     SubCategoryWeightSerializer, CustomCategorySerializer, CustomSubCategorySerializer,
                                     SubCategorySerializer, HabitWeightSerializer
                                     )
from home.api.v1.user_utils import UserUtils
from home.models import (Area, Category, CustomText, HomePage, Quote, Range, Score,
                         Scoring, UserArea, UserCategory, Value, UserSubCategory, Habit,
                         UserScoreJournal, UserSubCategoryJournal, UserCategoryJournal,
                         UserAreaJournal, AreaWeight, CategoryWeight, SubCategoryWeight, UserHabit,
                         HabitWeight, SubCategory)
from home.utils import convert_base64_to_file
from rest_auth.registration.views import SocialLoginView
from rest_framework import authentication, status
from rest_framework.authentication import (SessionAuthentication,
                                           TokenAuthentication)
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.decorators import action
from rest_framework import serializers
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet
from users.models import Coaching, Settings
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK
)
from itertools import chain
from django.http import HttpResponse

User = get_user_model()


class SignupViewSet(ModelViewSet):
    serializer_class = SignupSerializer
    http_method_names = ["post"]


class LoginViewSet(ViewSet):
    """Based on rest_framework.authtoken.views.ObtainAuthToken"""

    serializer_class = AuthTokenSerializer

    def create(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)
        return Response({"token": token.key, "user": user_serializer.data})

    @action(detail=False, methods=['post'])
    def create_super_user(self, request):
        _ = User.objects.create_superuser(
            username=request.data['username'], password=request.data['password'], email=request.data['email'])
        return Response("Superuser created")


class CustomTextViewSet(ModelViewSet):
    serializer_class = CustomTextSerializer
    queryset = CustomText.objects.all()
    authentication_classes = (SessionAuthentication, TokenAuthentication)
    permission_classes = [IsAdminUser]
    http_method_names = ["get", "put", "patch"]


class HomePageViewSet(ModelViewSet):
    serializer_class = HomePageSerializer
    queryset = HomePage.objects.all()
    authentication_classes = (SessionAuthentication, TokenAuthentication)
    permission_classes = [IsAdminUser]
    http_method_names = ["get", "put", "patch"]


class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = "https://arootah-app.firebaseapp.com/__/auth/handler"


class AppleLogin(ViewSet):
    serializer_class = SocialSerializer

    def create(self, request):
        social_serializer = SocialSerializer(data=request.data)
        social_serializer.is_valid(raise_exception=True)
        res_status = UserUtils.verify_apple_details(
            request.data["access_token"])
        if res_status.status_code != 200:
            return Response({
                'success': False,
                'result': "Invalid Token!",
            }, status=status.HTTP_400_BAD_REQUEST)
        user_info = res_status.json()
        id_token = user_info.get('id_token', None)  # request.data["id_token"]
        response_data = {}
        if id_token:
            decoded = jwt.decode(id_token, '', verify=False)
            response_data.update(
                {'email': decoded['email'] if 'email' in decoded else None})
            response_data.update(
                {'id': decoded['sub']}) if 'sub' in decoded else None
            response_data.update(
                {'name': request.data['name'] if 'name' in request.data else None})
        user = SocialSerializer(context={"request": request}). \
            social_login(response_data, "Apple")

        return Response({
            'success': True,
            'result': UserSerializer(user).data,
            'type': 'apple',
            'token': Token.objects.get(user=user).key
        }, status=status.HTTP_200_OK)


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def get_queryset(self):
        query = self.request.query_params.get('query')
        user_type = self.request.query_params.get('user_type')
        exclude_self = self.request.query_params.get('exclude_self')
        users = User.objects.all().exclude(is_superuser=True, is_coach=False)
        if exclude_self and exclude_self.lower() == 'true':
            users = users.exclude(id=self.request.user.id)
        if user_type == 'coach':
            users = users.filter(is_coach=True)
        if query:
            users = users.filter(Q(first_name__icontains=query) | Q(
                last_name__icontains=query) | Q(name__icontains=query))
        return users

    @action(detail=False, methods=['get'])
    def get_user_profile(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def get_coach(self, request):
        coaches = [
            obj.coach
            for obj in Coaching.objects.filter(user=request.GET['user_id'])
        ]

        serializer = self.get_serializer(coaches, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def get_assignees(self, request):
        assignees = [
            obj.user
            for obj in Coaching.objects.filter(coach=request.GET['user_id'])
        ]

        serializer = self.get_serializer(assignees, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def toggle_coach(self, request):
        user = User.objects.get(id=request.data['user_id'])
        user.is_coach = not user.is_coach
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def assign_coach(self, request):
        user = User.objects.get(id=request.data['user_id'])
        for working_id in request.data['coach_id']:
            coach = User.objects.get(id=working_id)
            _ = Coaching.objects.create(coach=coach, user=user)
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def assign_user(self, request):
        coach = User.objects.get(id=request.data['coach_id'])
        for working_id in request.data['user_id']:
            user = User.objects.get(id=working_id)
            _ = Coaching.objects.create(coach=coach, user=user)
        serializer = self.get_serializer(coach)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def list_coach(self, request):
        coaches = User.objects.filter(is_coach=True)
        serializer = self.get_serializer(coaches, many=True)
        return Response(serializer.data)

    @action(methods=['post'], detail=False)
    def set_profile_picture(self, request, pk=None):
        image = request.data['image']
        request.user.profile_picture = convert_base64_to_file(image)
        request.user.save()
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def update_settings(self, request):
        fetched_data = {**request.data}
        id = fetched_data.pop('id')
        Settings.objects.filter(id=id).update(**fetched_data)
        _ = Settings.objects.get(id=id).user
        return Response(self.get_serializer(request.user).data)

    @action(detail=False, methods=['post'])


    def update_weights(self, request):
        """Returns the user selected categories
        `start` and `end`: start date to get the scores for that range
        format: yyyy-mm-dd
        """
        fetched_data = {**request.data}
        type = fetched_data.get('type')
        weights = fetched_data.get('weights')
        start_date = fetched_data.get('start_date')
        end_date = fetched_data.get('end_date')

        start_date = datetime.datetime.strptime(start_date+" 00:00:00", "%Y-%m-%d %H:%M:%S")
        end_date = datetime.datetime.strptime(end_date+" 00:00:00", "%Y-%m-%d %H:%M:%S")

        try:

            if type == "category":
                for weight in weights:
                    custom_category = UserCategory.objects.filter(id=weight['id'])
                    CategoryWeight.objects.filter(user=self.request.user, customcategory=custom_category[0]).update(weight=weight['weight'], start_date=start_date, end_date=end_date)
                #return Response(CategoryWeightSerializer(CategoryWeight.objects.filter(user=self.request.user, customcategory=custom_category[0]), many=True).data)

            if type == "subcategory":
                for weight in weights:
                    custom_subcategory = UserSubCategory.objects.filter(id=weight['id'])
                    SubCategoryWeight.objects.filter(user=self.request.user, customsubcategory=custom_subcategory[0]).update(weight=weight['weight'], start_date=start_date, end_date=end_date)
                #return Response(SubCategoryWeightSerializer(CategoryWeight.objects.filter(user=self.request.user, customsubcategory=custom_subcategory[0]), many=True).data)

            if type == "habit":
                for weight in weights:
                    habit = UserHabit.objects.filter(id=weight['id'])
                    HabitWeight.objects.filter(user=self.request.user, user_habit=habit[0]).update(weight=weight['weight'], start_date=start_date, end_date=end_date)
                #return Response(HabitWeightSerializer(HabitWeight.objects.filter(user=self.request.user, user_habit=habit[0]), many=True).data)

            if type == "area":
                for weight in weights:
                    area = UserArea.objects.filter(id=weight['id'])
                    AreaWeight.objects.filter(user=self.request.user, area=area[0]).update(weight=weight['weight'], start_date=start_date, end_date=end_date)
                #return Response(AreaWeightSerializer(AreaWeight.objects.filter(user=self.request.user, area=area[0]), many=True).data)

        except Exception as e:
            msg = {'error': str(e)}
            return Response(msg, status=500)

        return Response({
            'weights': weights,
            'type': type
        })

class AreaViewSet(ModelViewSet):
    serializer_class = UserAreaSerializer
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        areas = UserArea.objects.filter(user=self.request.user)
        user = self.request.user
        start_date = self.request.GET.get('start_date')
        end_date = self.request.GET.get('end_date')

        start_date = datetime.datetime.strptime(start_date+" 00:00:00", "%Y-%m-%d %H:%M:%S")
        end_date = datetime.datetime.strptime(end_date+" 00:00:00", "%Y-%m-%d %H:%M:%S")

        #sub_categories = UserSubCategory.objects.filter(user=user)
        if not areas:
            areas = UserArea.create_areas(self.request.user, start_date=start_date, end_date=end_date)
        return areas

    @action(detail=True, methods=['get'])
    def get_categories(self, request, pk):
        area = self.get_object()
        categories = Category.objects.filter(area=area.area)
        return Response(CategorySerializer(categories, many=True).data)

    @action(detail=False, methods=['get'])
    def get_selected(self, request):
        """Returns the user selected categories
        `start` and `end`: start date to get the scores for that range
        format: yyyy-mm-dd
        """
        start = request.GET.get('start')
        end = request.GET.get('end')
        areas = UserArea.objects.filter(user=self.request.user)
        if not areas:
            areas = UserArea.create_areas(self.request.user, date__range=(start, end))
        return Response(UserAreaCategorySerializer(areas, many=True, context={'start': start, 'end': end}).data)

    @action(detail=False, methods=['post'])
    def change_weight(self, request):
        weight_id_list = request.data['weight_id_list']
        area_list = []
        for weight_id in weight_id_list:
            area = UserArea.objects.get(id=weight_id['id'])
            area.weight = weight_id['weight']
            area.save()
            area_list.append(area)
        serializer = self.get_serializer(area_list, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def get_journal(self, request):
        """Returns the journals
        `start` and `end`: start date to get the scores/journal for that range
        format: yyyy-mm-dd
        """
        start = request.GET.get('start')
        end = request.GET.get('end')
        scores = Score.objects.filter(
            user_id=request.user, date_time__gte=start, date_time__lte=end)
        return Response(ScoreSerializer(scores, many=True).data)


class SubCategoryViewSet(ModelViewSet):

    serializer_class = SubCategorySerializer
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == 'POST':
            return SubCategorySerializer
        return SubCategorySerializer

    def get_queryset(self):
        return SubCategory.objects.filter()

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=False, methods=['get'])
    def get_selected(self, request):
        """Returns the user selected categories
        `start` and `end`: start date to get the scores for that range
        format: yyyy-mm-dd
        """
        start = request.GET.get('start')
        end = request.GET.get('end')
        user_subcategory = UserSubCategory.objects.filter(user=self.request.user, date__range=(start, end))
        return Response(UserSubCategorySerializer(user_subcategory, many=True, context={'start': start, 'end': end}).data)

class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == 'POST':
            return UserCategoryPostSerializer
        return CategorySerializer

    def get_queryset(self):
        return Category.objects.filter()


    def perform_create(self, serializer):
        serializer.save()

class HabitViewSet(ModelViewSet):
    serializer_class = HabitSerializer
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == 'POST':
            return UserHabitPostSerializer
        return HabitSerializer

    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def get_selected(self, request):
        """Returns the user selected categories
        `start` and `end`: start date to get the scores for that range
        format: yyyy-mm-dd
        """
        start = request.GET.get('start')
        end = request.GET.get('end')
        habit = Habit.objects.filter(user=self.request.user, date__range=(start, end))
        return Response(HabitSerializer(habit, many=True, context={'start': start, 'end': end}).data)

class UserHabitViewSet(ModelViewSet):
    serializer_class = UserHabitSerializer
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == 'POST':
            return UserHabitPostSerializer
        return UserHabitSerializer

    def get_queryset(self):
        return UserHabit.objects.filter(user=self.request.user)

    def create(self, request):
        request_data = request.data.copy()
        request_data["user"] = request.user.id
        weight = request_data['weight']

        start_date = request_data['start_date']
        start_date = datetime.datetime.strptime(start_date+" 00:00:00", "%Y-%m-%d %H:%M:%S")

        end_date = request_data['end_date']
        end_date = datetime.datetime.strptime(end_date+" 00:00:00", "%Y-%m-%d %H:%M:%S")

        serializer = UserHabitSerializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        # custom_category = CustomSubCategory.objects.get(id=serializer.data['id'])
        request_data_weight = {"user_habit": serializer.data['id'], "weight": weight, "user": request.user.id,
            "start_date": start_date, "end_date": end_date}
        serializer_weight = HabitWeightSerializer(data=request_data_weight)
        serializer_weight.is_valid(raise_exception=True)
        serializer_weight.save()
        return Response({
            "success": True,
            "habit": serializer.data,
            "weight": serializer_weight.data
        })
    def update(self, request, pk, format=None):
        obj = self.get_object(pk)
        serializer = UserHabitSerializer(
            obj,
            data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'result': serializer.data
            }, status=HTTP_200_OK)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk, format=None):
        obj = self.get_object(pk)
        obj.delete()
        return Response({
            'success': True,
            'result': "successfully deleted!"},
            status=HTTP_200_OK
        )
    @action(detail=False, methods=['get'])
    def get_selected(self, request):
        """Returns the user selected categories
        `start` and `end`: start date to get the scores for that range
        format: yyyy-mm-dd
        """
        print(self.request.user)
        start = request.GET.get('start')
        end = request.GET.get('end')
        user_habit = UserHabit.objects.filter(user=self.request.user, date__range=(start, end))
        return Response(UserHabitSerializer(user_habit, many=True, context={'start': start, 'end': end}).data)




class UserSettingsViewSet(ModelViewSet):
    serializer_class = UserSettingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Settings.object.filter(user=self.request.user)


class QuotesViewSet(ModelViewSet):
    serializer_class = QuotesSerializer
    queryset = Quote.objects.filter(visible=True)

class CustomCategoryViewSet(ViewSet):

    serializer_class = CustomCategorySerializer
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return UserCategory.objects.get(pk=pk)
        except UserCategory.DoesNotExist:
            raise serializers.ValidationError({
                'success': 'false',
                'error': 'Custom Category does not exist'
            })

    def create(self, request):
        request_data = request.data.copy()
        request_data["user"] = request.user.id
        weight = request_data['weight']
        start_date = request_data['start_date']
        start_date = datetime.datetime.strptime(start_date+" 00:00:00", "%Y-%m-%d %H:%M:%S")
        print ('STARTTT', start_date)

        end_date = request_data['end_date']
        end_date = datetime.datetime.strptime(end_date+" 00:00:00", "%Y-%m-%d %H:%M:%S")

        serializer = CustomCategorySerializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        custom_category = UserCategory.objects.get(id=serializer.data['id'])
        request_data_weight = {"customcategory": custom_category.id, "weight": weight,
            "user": request.user.id, "start_date": start_date, "end_date": end_date}
        serializer_weight = CategoryWeightSerializer(data=request_data_weight)
        serializer_weight.is_valid(raise_exception=True)
        serializer_weight.save()
        return Response({
            "success": True,
            "category": serializer.data,
            "weight": serializer_weight.data
        })

    def list(self, request):
        queryset = UserCategory.objects.filter(user=request.user.id)
        serializer = CustomCategorySerializer(queryset, many=True)
        return Response({
            "success": True,
            "response": serializer.data
        })

    def update(self, request, pk, format=None):
        obj = self.get_object(pk)
        serializer = CustomCategorySerializer(
            obj,
            data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'result': serializer.data
            }, status=HTTP_200_OK)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk, format=None):
        obj = self.get_object(pk)
        obj.delete()
        return Response({
            'success': True,
            'result': "successfully deleted!"},
            status=HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def get_selected(self, request):
        """Returns the user selected categories
        `start` and `end`: start date to get the scores for that range
        format: yyyy-mm-dd
        """
        user_subcategory = UserCategory.objects.filter(user=self.request.user)
        return Response(UserCustomSubCategorySerializer(user_subcategory, many=True).data)

class CustomSubCategoryViewSet(ViewSet):

    serializer_class = UserCustomSubCategorySerializer
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return UserSubCategory.objects.get(pk=pk)
        except UserSubCategory.DoesNotExist:
            raise serializers.ValidationError({
                'success': 'false',
                'error': 'calendar does not exist'
            })

    def create(self, request):
        request_data = request.data.copy()
        request_data["user"] = request.user.id
        weight = request_data['weight']

        start_date = request_data['start_date']
        start_date = datetime.datetime.strptime(start_date+" 00:00:00", "%Y-%m-%d %H:%M:%S")

        end_date = request_data['end_date']
        end_date = datetime.datetime.strptime(end_date+" 00:00:00", "%Y-%m-%d %H:%M:%S")

        serializer = CustomSubCategorySerializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        # custom_category = CustomSubCategory.objects.get(id=serializer.data['id'])
        request_data_weight = {"customsubcategory": serializer.data['id'], "weight": weight, "user": request.user.id,
            "start_date": start_date, "end_date": end_date}
        serializer_weight = SubCategoryWeightSerializer(data=request_data_weight)
        serializer_weight.is_valid(raise_exception=True)
        serializer_weight.save()
        return Response({
            "success": True,
            "subcategory": serializer.data,
            "weight": serializer_weight.data
        })

    def list(self, request):
        queryset = UserSubCategory.objects.filter(user=request.user.id)
        serializer = UserCustomSubCategorySerializer(queryset, many=True)
        return Response({
            "success": True,
            "response": serializer.data
        })

    def update(self, request, pk, format=None):
        obj = self.get_object(pk)
        serializer = UserCustomSubCategorySerializer(
            obj,
            data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'result': serializer.data
            }, status=HTTP_200_OK)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk, format=None):
        obj = self.get_object(pk)
        obj.delete()
        return Response({
            'success': True,
            'result': "successfully deleted!"},
            status=HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def get_selected(self, request):
        """Returns the user selected categories
        `start` and `end`: start date to get the scores for that range
        format: yyyy-mm-dd
        """
        user_subcategory = UserSubCategory.objects.filter(user=self.request.user)
        return Response(UserCustomSubCategorySerializer(user_subcategory, many=True).data)


class UserScoreJournalViewSet(ViewSet):

    serializer_class = UserScoreJournalSerializer
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return UserScoreJournal.objects.get(pk=pk)
        except UserScoreJournal.DoesNotExist:
            raise serializers.ValidationError({
                'success': 'false',
                'error': 'User Score Journal does not exist'
            })

    def create(self, request):
        request_data = request.data.copy()
        request_data["user"] = request.user.id
        serializer = UserScoreJournalSerializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "response": serializer.data
        })

    def list(self, request):
        queryset = UserScoreJournal.objects.filter(user=request.user)
        serializer = UserScoreJournalSerializer(queryset, many=True)
        return Response({
            "success": True,
            "response": serializer.data
        })

    def update(self, request, pk, format=None):
        obj = self.get_object(pk)
        serializer = UserScoreJournalSerializer(
            obj,
            data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'result': serializer.data
            }, status=HTTP_200_OK)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk, format=None):
        obj = self.get_object(pk)
        obj.delete()
        return Response({
            'success': True,
            'result': "successfully deleted!"},
            status=HTTP_200_OK
        )

class ScoreViewSet(ViewSet):

    serializer_class = ScoreSerializer
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Score.objects.get(pk=pk)
        except Score.DoesNotExist:
            raise serializers.ValidationError({
                'success': 'false',
                'error': 'User Score Journal does not exist'
            })

    def create(self, request):
        fetched_data = {**request.data}
        scores = fetched_data.get('Scores')
        start_date = fetched_data.get('start_date')
        end_date = fetched_data.get('end_date')

        start_date = datetime.datetime.strptime(start_date + " 00:00:00", "%Y-%m-%d %H:%M:%S")
        end_date = datetime.datetime.strptime(end_date + " 00:00:00", "%Y-%m-%d %H:%M:%S")

        request_data = request.data.copy()
        request_data["user"] = request.user.id

        for score in scores:
            score['start_date'] = start_date
            score['end_date'] = end_date

            serializer = ScoreSerializer(data=score)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return Response({
            "success": True
        })

    def list(self, request):
        queryset = Score.objects.filter(user=request.user)
        serializer = ScoreSerializer(queryset, many=True)
        return Response({
            "success": True,
            "response": serializer.data
        })

    def update(self, request, pk, format=None):
        obj = self.get_object(pk)
        serializer = ScoreSerializer(
            obj,
            data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'result': serializer.data
            }, status=HTTP_200_OK)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class UserAreaJournalViewSet(ViewSet):

    serializer_class = UserAreaJournalSerializer
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return UserAreaJournal.objects.get(pk=pk)
        except UserAreaJournal.DoesNotExist:
            raise serializers.ValidationError({
                'success': 'false',
                'error': 'User Area Journal does not exist'
            })

    def create(self, request):
        request_data = request.data.copy()
        request_data["user"] = request.user.id
        serializer = UserAreaJournalSerializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "response": serializer.data
        })

    def list(self, request):
        queryset = UserAreaJournal.objects.filter(user=request.user)
        serializer = UserAreaJournalSerializer(queryset, many=True)
        return Response({
            "success": True,
            "response": serializer.data
        })

    def update(self, request, pk, format=None):
        obj = self.get_object(pk)
        serializer = UserAreaJournalSerializer(
            obj,
            data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'result': serializer.data
            }, status=HTTP_200_OK)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk, format=None):
        obj = self.get_object(pk)
        obj.delete()
        return Response({
            'success': True,
            'result': "successfully deleted!"},
            status=HTTP_200_OK
        )

class UserCategoryJournalViewSet(ViewSet):

    serializer_class = UserCategoryJournal
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return UserCategoryJournal.objects.get(pk=pk)
        except UserCategoryJournal.DoesNotExist:
            raise serializers.ValidationError({
                'success': 'false',
                'error': 'User Category Journal does not exist'
            })

    def create(self, request):
        request_data = request.data.copy()
        request_data["user"] = request.user.id
        serializer = UserCategoryJournalSerializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "response": serializer.data
        })

    def list(self, request):
        queryset = UserCategoryJournal.objects.filter(user=request.user)
        serializer = UserCategoryJournalSerializer(queryset, many=True)
        return Response({
            "success": True,
            "response": serializer.data
        })

    def update(self, request, pk, format=None):
        obj = self.get_object(pk)
        serializer = UserCategoryJournalSerializer(
            obj,
            data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'result': serializer.data
            }, status=HTTP_200_OK)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk, format=None):
        obj = self.get_object(pk)
        obj.delete()
        return Response({
            'success': True,
            'result': "successfully deleted!"},
            status=HTTP_200_OK
        )

class UserSubCategoryJournalViewSet(ViewSet):

    serializer_class = UserSubCategoryJournalSerializer
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return UserSubCategoryJournal.objects.get(pk=pk)
        except UserSubCategoryJournal.DoesNotExist:
            raise serializers.ValidationError({
                'success': 'false',
                'error': 'User SubCategory Journal does not exist'
            })

    def create(self, request):
        request_data = request.data.copy()
        request_data["user"] = request.user.id
        serializer = UserSubCategoryJournalSerializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "response": serializer.data
        })

    def list(self, request):
        queryset = UserSubCategoryJournal.objects.filter(user=request.user)
        serializer = UserSubCategoryJournalSerializer(queryset, many=True)
        return Response({
            "success": True,
            "response": serializer.data
        })

    def update(self, request, pk, format=None):
        obj = self.get_object(pk)
        serializer = UserSubCategoryJournalSerializer(
            obj,
            data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'result': serializer.data
            }, status=HTTP_200_OK)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk, format=None):
        obj = self.get_object(pk)
        obj.delete()
        return Response({
            'success': True,
            'result': "successfully deleted!"},
            status=HTTP_200_OK
        )
    @action(detail=False, methods=['get'])
    def get_selected(self, request):
        """Returns the user selected categories
        `start` and `end`: start date to get the scores for that range
        format: yyyy-mm-dd
        """
        start = request.GET.get('start')
        end = request.GET.get('end')
        user_subcategory = UserSubCategory.objects.filter(user=self.request.user, date__range=(start, end))
        return Response(UserSubCategorySerializer(user_subcategory, many=True, context={'start': start, 'end': end}).data)


class AreaWeightViewSet(ViewSet):

    serializer_class = AreaWeightSerializer
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return AreaWeight.objects.get(pk=pk)
        except AreaWeight.DoesNotExist:
            raise serializers.ValidationError({
                'success': 'false',
                'error': 'Area Weight does not exist'
            })

    def create(self, request):
        request_data = request.data.copy()
        request_data["user"] = request.user.id
        serializer = AreaWeightSerializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "response": serializer.data
        })

    def list(self, request):
        queryset = AreaWeight.objects.filter(user=request.user)
        serializer = AreaWeightSerializer(queryset, many=True)
        return Response({
            "success": True,
            "response": serializer.data
        })

    def update(self, request, pk, format=None):
        obj = self.get_object(pk)
        serializer = AreaWeightSerializer(
            obj,
            data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'result': serializer.data
            }, status=HTTP_200_OK)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk, format=None):
        obj = self.get_object(pk)
        obj.delete()
        return Response({
            'success': True,
            'result': "successfully deleted!"},
            status=HTTP_200_OK
        )


class CategoryWeightViewSet(ViewSet):

    serializer_class = CategoryWeightSerializer
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return CategoryWeight.objects.get(pk=pk)
        except CategoryWeight.DoesNotExist:
            raise serializers.ValidationError({
                'success': 'false',
                'error': 'Category Weight does not exist'
            })

    def create(self, request):
        request_data = request.data.copy()
        request_data["user"] = request.user.id
        serializer = CategoryWeightSerializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "response": serializer.data
        })

    def list(self, request):
        queryset = CategoryWeight.objects.filter(user=request.user)
        serializer = CategoryWeightSerializer(queryset, many=True)
        return Response({
            "success": True,
            "response": serializer.data
        })

    def update(self, request, pk, format=None):
        obj = self.get_object(pk)
        serializer = CategoryWeightSerializer(
            obj,
            data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'result': serializer.data
            }, status=HTTP_200_OK)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk, format=None):
        obj = self.get_object(pk)
        obj.delete()
        return Response({
            'success': True,
            'result': "successfully deleted!"},
            status=HTTP_200_OK
        )


class SubCategoryWeightViewSet(ViewSet):

    serializer_class = SubCategoryWeightSerializer
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return SubCategoryWeight.objects.get(pk=pk)
        except SubCategoryWeight.DoesNotExist:
            raise serializers.ValidationError({
                'success': 'false',
                'error': 'Sub Category Weight does not exist'
            })

    def create(self, request):
        request_data = request.data.copy()
        request_data["user"] = request.user.id
        serializer = SubCategoryWeightSerializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "response": serializer.data
        })

    def list(self, request):
        queryset = SubCategoryWeight.objects.filter(user=request.user)
        serializer = SubCategoryWeightSerializer(queryset, many=True)
        return Response({
            "success": True,
            "response": serializer.data
        })

    def update(self, request, pk, format=None):
        obj = self.get_object(pk)
        serializer = SubCategoryWeightSerializer(
            obj,
            data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'result': serializer.data
            }, status=HTTP_200_OK)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk, format=None):
        obj = self.get_object(pk)
        obj.delete()
        return Response({
            'success': True,
            'result': "successfully deleted!"},
            status=HTTP_200_OK
        )


class UserInfoViewSet(ViewSet):

    serializer_class = SubCategoryWeightSerializer
    authentication_classes = (
        authentication.TokenAuthentication,
    )
    permission_classes = [IsAuthenticated]


    def list(self, request):
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        areas = UserArea.objects.filter(user=request.user)
        start_date = datetime.datetime.strptime(start_date + " 00:00:00", "%Y-%m-%d %H:%M:%S")
        end_date = datetime.datetime.strptime(end_date + " 00:00:00", "%Y-%m-%d %H:%M:%S")
        data = {}
        custom_data = []
        for i, area in enumerate(UserAreaSerializer(areas, many=True).data):
            area_weight = AreaWeightSerializer(AreaWeight.objects.filter(area=area['id'], start_date__gte=start_date, end_date__lte=end_date), many=True).data
            area_weight = area_weight[0] if area_weight else []
            area.update(area_weight)
            custom_data.append(area)

            custom_category_data = []
            data['userArea'] = custom_data

            for j, category in enumerate(UserCategorySerializer(UserCategory.objects.filter(parent_area=area['id']), many=True).data):
                category_weight = CategoryWeightSerializer(CategoryWeight.objects.filter(customcategory=category['id'], start_date__gte=start_date, end_date__lte=end_date), many=True).data
                category_weight = category_weight[0] if category_weight else []
                category.update(category_weight)
                custom_category_data.append(category)
                data['userArea'][i]["userCategories"] = custom_category_data
                custom_subcategory_data = []

                for k, subcategory in enumerate(UserSubCategorySerializer(UserSubCategory.objects.filter(parent_category=category['id']),
                                                       many=True).data):
                    subcategory_weight = SubCategoryWeightSerializer(
                        SubCategoryWeight.objects.filter(customsubcategory=subcategory['id'], start_date__gte=start_date, end_date__lte=end_date), many=True).data
                    subcategory_weight = subcategory_weight[0] if subcategory_weight else []
                    subcategory.update(subcategory_weight)
                    custom_subcategory_data.append(subcategory)

                    data['userArea'][i]["userCategories"][j]['userSubCategories'] = custom_subcategory_data
                    custom_habit_data = []

                    for l, habit in enumerate(UserHabitSerializer(UserHabit.objects.filter(parent_subcategory=subcategory['id']),
                                                           many=True).data):
                        habit_weight = HabitWeightSerializer(
                            HabitWeight.objects.filter(user_habit=habit['id'], start_date__gte=start_date, end_date__lte=end_date), many=True).data
                        habit_weight = habit_weight[0] if habit_weight else []
                        habit.update(habit_weight)
                        custom_habit_data.append(habit)

                        data['userArea'][i]["userCategories"][j]['userSubCategories'][k]['userHabits'] = custom_habit_data
                        custom_score_data = []

                        for score in ScoreSerializer(Score.objects.filter(user_habit=habit['id'], start_date__gte=start_date, end_date__lte=end_date),
                                                         many=True).data:
                            custom_score_data.append(score)

                            data['userArea'][i]["userCategories"][j]['userSubCategories'][k][
                                'userHabits'][l]['scores'] = custom_score_data


                        data['userArea'][i]["userCategories"][j]['userSubCategories'][k][
                            'userHabits'][l]['scores'] = [] if 'scores' not in \
                                                               data['userArea'][i]["userCategories"][j][
                                                                   'userSubCategories'][k][
                                                                   'userHabits'][l] else custom_score_data

                    data['userArea'][i]["userCategories"][j]['userSubCategories'][k]['userHabits'] = [] if 'userHabits' not in \
                                                                                          data['userArea'][i]["userCategories"][j]['userSubCategories'][k] else custom_habit_data

                data['userArea'][i]["userCategories"][j]['userSubCategories'] = [] if 'userSubCategories' not in \
                                                                                      data['userArea'][i]["userCategories"][j] else custom_subcategory_data

            data['userArea'][i]["userCategories"] = [] if 'userCategories' not in data['userArea'][i] else custom_category_data

            # data['userArea'][i]["userCategory"] = custom_category_data
        return Response({
            "success": True,
            "results": data
        })
