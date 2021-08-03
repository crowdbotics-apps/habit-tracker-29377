from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter

from home.api.v1.viewsets import (
    SignupViewSet,
    LoginViewSet,
    HomePageViewSet,
    CustomTextViewSet,
    FacebookLogin,
    GoogleLogin,
    AppleLogin,
    UserViewSet,
    AreaViewSet,
    CategoryViewSet,
    UserSettingsViewSet,
    QuotesViewSet,
    SubCategoryViewSet,
    CustomSubCategoryViewSet,
    UserScoreJournalViewSet,
    UserAreaJournalViewSet,
    UserCategoryJournalViewSet,
    UserSubCategoryJournalViewSet,
    AreaWeightViewSet,
    CategoryWeightViewSet,
    SubCategoryWeightViewSet,
    HabitViewSet,
    UserHabitViewSet,
    CustomCategoryViewSet,
    UserInfoViewSet,
    ScoreViewSet
)

router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")
router.register("customtext", CustomTextViewSet)
router.register("login/apple", AppleLogin, basename="apple_login")
router.register("homepage", HomePageViewSet)
router.register("user", UserViewSet, basename='user')
router.register("area", AreaViewSet, basename='area')
router.register("category", CategoryViewSet, basename='category')
router.register("subcategory", SubCategoryViewSet, basename='subcategory')
router.register("habit", HabitViewSet, basename='habit')
router.register("userhabit", UserHabitViewSet, basename='userhabit')
router.register("customsubcategory", CustomSubCategoryViewSet, basename='customsubcategory')
router.register("customcategory", CustomCategoryViewSet, basename='customsubcategory')
router.register("settings", UserSettingsViewSet, basename='settings')
router.register("quotes", QuotesViewSet, basename='quotes')
router.register("userscorejournal", UserScoreJournalViewSet, basename='userscorejournal')
router.register("score", ScoreViewSet, basename='score')
router.register("userareajournal", UserAreaJournalViewSet, basename='userareajournal')
router.register("usercategoryjournal", UserCategoryJournalViewSet, basename='usercategoryjournal')
router.register("usersubcategoryjournal", UserSubCategoryJournalViewSet, basename='usersubcategoryjournal')
router.register("areaweight", AreaWeightViewSet, basename='areaweight')
router.register("categoryweight", CategoryWeightViewSet, basename='categoryweight')
router.register("subcategoryweight", SubCategoryWeightViewSet, basename='subcategoryweight')
router.register("userinfo", UserInfoViewSet, basename='userinfo')

urlpatterns = [
    path("", include(router.urls)),
    re_path(r'^login/facebook/$', FacebookLogin.as_view(), name='fb_login'),
    re_path(r'^login/google/$', GoogleLogin.as_view(), name='google_login'),
]
