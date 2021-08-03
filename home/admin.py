from django.contrib import admin

from home.models import Area, Category, Quote, SubCategory, \
    UserSubCategory, UserHabit, UserAreaJournal, UserCategoryJournal, UserSubCategoryJournal, UserScoreJournal, Score, UserCategory, \
    AreaWeight, CategoryWeight, SubCategoryWeight, UserArea, Scoring, HabitWeight, Habit


class UserAreaAdmin(admin.ModelAdmin):
    list_display = ('system_area_name', 'user')


class UserAreaWeightAdmin(admin.ModelAdmin):
    list_display = ('area', 'user', 'weight', 'start_date', 'end_date')

class AreaAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')


# Register your models here.

admin.site.register(Area, AreaAdmin)
admin.site.register(UserArea, UserAreaAdmin)
admin.site.register(Category)
admin.site.register(Habit)
admin.site.register(Quote)
admin.site.register(SubCategory)
admin.site.register(UserSubCategory)
admin.site.register(UserHabit)
admin.site.register(UserAreaJournal)
admin.site.register(UserCategoryJournal)
admin.site.register(UserSubCategoryJournal)
admin.site.register(AreaWeight, UserAreaWeightAdmin)
admin.site.register(CategoryWeight)
admin.site.register(SubCategoryWeight)
admin.site.register(HabitWeight)
admin.site.register(UserScoreJournal)
admin.site.register(Score)
admin.site.register(Scoring)
admin.site.register(UserCategory)

