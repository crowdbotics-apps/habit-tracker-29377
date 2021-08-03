from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomText(models.Model):
    """
    Boilerplate model to populate the index homepage to demonstrate that the app was
    successfuly built. All references to it should be removed in order to remove this
    app from the project.
    """

    title = models.CharField(max_length=150)

    def __str__(self):
        return self.title

    @property
    def api(self):
        return f'/api/v1/customtext/{self.id}/'

    @property
    def field(self):
        return 'title'


class HomePage(models.Model):
    """
    Boilerplate model to populate the index homepage to demonstrate that the app was
    successfuly built. All references to it should be removed in order to remove this
    app from the project.
    """
    body = models.TextField()

    @property
    def api(self):
        return f'/api/v1/homepage/{self.id}/'

    @property
    def field(self):
        return 'body'


class Area(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    code = models.CharField(max_length=5, null=True, blank=True)

    def __str__(self) -> str:
        return self.name


class Category(models.Model):

    class Meta:
        verbose_name_plural = 'Categories'

    area = models.ForeignKey(
        'UserArea', related_name='categories', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=5, null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self) -> str:
        return self.name


class UserArea(models.Model):
    system_area_name = models.ForeignKey(
        'Area', related_name='users', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='user_areas', on_delete=models.CASCADE)
    #weight = models.PositiveIntegerField(default=1,
    #                                     validators=[
    #                                         MaxValueValidator(10),
    #                                         MinValueValidator(1)
    #                                     ])
    def __str__(self) -> str:
        return self.system_area_name.name + " - "+ self.user.username

    @staticmethod
    def create_areas(user, start_date=None, end_date=None):
        weight = 1
        areas = Area.objects.all()
        for area in areas:
            new_user_area = UserArea.objects.create(system_area_name=area, user=user)
            if start_date and end_date:
                AreaWeight.objects.create(weight=weight, user=user, area=new_user_area, start_date=start_date, end_date=end_date)
            else:
                AreaWeight.objects.create(weight=weight, user=user, area=new_user_area)
            weight += 1
        return UserArea.objects.filter(user=user)


class AreaWeight(models.Model):
    class Meta:
        verbose_name = "Area Weight"
        verbose_name_plural = "Area Weights"

    area = models.ForeignKey("home.UserArea", on_delete=models.CASCADE)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    weight = models.PositiveIntegerField(default=1,
                                         validators=[
                                             MaxValueValidator(10),
                                             MinValueValidator(1)
                                         ])
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.area.system_area_name.name + " - " + self.user.username

class UserCategory(models.Model):
    class Meta:
        verbose_name = 'UserCategory'
        verbose_name_plural = 'UserCategories'

    user = models.ForeignKey(User, related_name="usercategory", on_delete=models.CASCADE)
    system_category_name = models.ForeignKey(Category, related_name="user_category", on_delete=models.CASCADE, null=True, blank=True)
    custom_category_name = models.CharField(max_length=256, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    parent_area = models.ForeignKey(
        'UserArea', related_name='usercategories', on_delete=models.CASCADE)
    date = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return self.system_category_name.name + " - "+ self.user.username


class Quote(models.Model):
    visible = models.BooleanField(default=True)
    text = models.TextField(null=True, blank=True)
    author = models.CharField(max_length=250, null=True, blank=True)
    topic = models.CharField(max_length=250, null=True, blank=True)

    def __str__(self) -> str:
        return self.text


class SubCategory(models.Model):
    class Meta:
        verbose_name = 'SubCategory'
        verbose_name_plural = 'SubCategories'

    name = models.CharField(max_length=256)
    code = models.CharField(max_length=5, null=True, blank=True)
    category = models.ForeignKey("Category", related_name='subcategories', on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)

    def __str__(self) -> str:
        return self.name

class UserCategoryJournal(models.Model):
    class Meta:
        verbose_name = "User Category Journal"
        verbose_name_plural = "User Category Journals"

    note = models.TextField(null=True, blank=True)
    note_added_date = models.DateTimeField()
    parent_category = models.ForeignKey("home.UserCategory", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class UserAreaJournal(models.Model):
    class Meta:
        verbose_name = "User Area Journal"
        verbose_name_plural = "User Area Journals"

    note = models.TextField(null=True, blank=True)
    note_added_date = models.DateTimeField()
    parent_area = models.ForeignKey("home.UserArea", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class UserSubCategoryJournal(models.Model):
    class Meta:
        verbose_name = "User Sub Category Journal"
        verbose_name_plural = "User Sub Category Journals"

    note = models.TextField(null=True, blank=True)
    note_added_date = models.DateTimeField()
    parent_subcategory = models.ForeignKey("home.UserSubcategory", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(null=True, blank=True)


class Habit(models.Model):
    class Meta:
        verbose_name = 'Habit'
        verbose_name_plural = 'Habits'

    TYPE_CHOICES = (
        (0, 'Good'),
        (1, 'Bad'),
    )

    type = models.PositiveIntegerField(choices=TYPE_CHOICES, default=0)
    name = models.CharField(max_length=250, null=True, blank=True)
    subcategory = models.ForeignKey("SubCategory", related_name="habit", on_delete=models.CASCADE,
                                    null=True, blank=True)
    user = models.ForeignKey(User, related_name="userhabit", on_delete=models.CASCADE)
    date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self) -> str:
        return self.name

class UserSubCategory(models.Model):
    class Meta:
        verbose_name = 'UserSubCategory'
        verbose_name_plural = 'UserSubCategories'

    user = models.ForeignKey(User, related_name="users_sub", on_delete=models.CASCADE)
    system_subcategory_name = models.ForeignKey(SubCategory, related_name="user_subcategory", on_delete=models.CASCADE, null=True, blank=True)
    custom_subcategory_name = models.CharField(max_length=256, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    parent_category = models.ForeignKey("UserCategory", related_name='user_customcategories', on_delete=models.CASCADE, 
        blank=True, null=True)
    date = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return self.system_subcategory_name.name + " - "+ self.user.username


class UserHabit(models.Model):
    class Meta:
        verbose_name = "User Habit"
        verbose_name_plural = "User Habits"

    VALUE = 'value'
    RANGE = 'range'
    SCORING_TYPE = (
        (VALUE, 'Value'),
        (RANGE, 'Range')
    )

    TYPE_CHOICES = (
        (0, 'Good'),
        (1, 'Bad'),
    )

    type = models.PositiveIntegerField(choices=TYPE_CHOICES, default=0)
    parent_subcategory = models.ForeignKey(
        UserSubCategory, related_name='user_habit', on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, related_name='user_habit', on_delete=models.CASCADE, null=True, blank=True)
    system_habit_name = models.ForeignKey(Habit, related_name='user_habit', on_delete=models.CASCADE, null=True, blank=True)
    custom_habit_name = models.TextField(null=True, blank=True)
    monday = models.BooleanField(default=True)
    tuesday = models.BooleanField(default=True)
    wednesday = models.BooleanField(default=True)
    thursday = models.BooleanField(default=True)
    friday = models.BooleanField(default=True)
    saturday = models.BooleanField(default=True)
    sunday = models.BooleanField(default=True)

    duration = models.FloatField(null=True, blank=True)
    starts = models.TimeField(null=True, blank=True)

    note = models.TextField(null=True, blank=True)

    # advanced
    scoring_type = models.CharField(max_length=250, default='Value', null=True, blank=True)
    motivation = models.TextField(null=True, blank=True)
    trigger = models.TextField(null=True, blank=True)
    obstacle = models.TextField(null=True, blank=True)
    date = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return str(self.custom_habit_name) if self.custom_habit_name else self.system_habit_name.name + '-' + self.user.username

class Scoring(models.Model):
    VALUE = 'value'
    RANGE = 'range'
    SCORING_TYPE = (
        (VALUE, 'Value'),
        (RANGE, 'Range')
    )

    type = models.CharField(choices=SCORING_TYPE, max_length=50, default=VALUE)


class Value(models.Model):
    scoring = models.ForeignKey('Scoring', related_name='values', on_delete=models.CASCADE)
    score = models.IntegerField(null=True)
    quantity = models.IntegerField(null=True)
    unit = models.CharField(max_length=150)


class Range(models.Model):
    scoring = models.ForeignKey('Scoring', related_name='ranges', on_delete=models.CASCADE)
    score = models.IntegerField(null=True)
    range_from = models.IntegerField(null=True)
    range_to = models.IntegerField(null=True)
    unit = models.CharField(max_length=150)


class HabitWeight(models.Model):
    class Meta:
        verbose_name = "User Habit Weight"
        verbose_name_plural = "User Habit Weights"

    # category = models.ForeignKey("home.Category", on_delete=models.CASCADE, null=True, blank=True)
    user_habit = models.ForeignKey("home.UserHabit", on_delete=models.CASCADE, null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    weight = models.FloatField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self) -> str:
        return str(self.user_habit.custom_habit_name) + '-' + self.user.username

class CategoryWeight(models.Model):
    class Meta:
        verbose_name = "User Category Weight"
        verbose_name_plural = "User Category Weights"

    # category = models.ForeignKey("home.Category", on_delete=models.CASCADE, null=True, blank=True)
    customcategory = models.ForeignKey("home.UserCategory", on_delete=models.CASCADE, null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    weight = models.PositiveIntegerField(default=1,
                                         validators=[
                                             MaxValueValidator(10),
                                             MinValueValidator(1)
                                         ])
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.customcategory.system_category_name) + '-' + self.user.username

class SubCategoryWeight(models.Model):
    class Meta:
        verbose_name = "Sub Category Weight"
        verbose_name_plural = "Sub Category Weights"

    # subcategory = models.ForeignKey("home.SubCategory", related_name="subcategoryweight", on_delete=models.CASCADE,
    #                                 null=True, blank=True)
    customsubcategory = models.ForeignKey("home.UserSubCategory", related_name="subcategoryweight_custom",
                                          on_delete=models.CASCADE, null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    weight = models.PositiveIntegerField(default=1,
                                         validators=[
                                             MaxValueValidator(10),
                                             MinValueValidator(1)
                                         ])
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.customsubcategory.system_subcategory_name) + '-' + self.user.username

    # def __str__(self) -> str:
    #     return str(self.customsubcategory.custom_subcategory_name)
    # #     return str("Weight")
        # if self.customsubcategory.custom_subcategory_name:
        #     return self.customsubcategory.custom_subcategory_name
        # elif self.customsubcategory.system_subcategory_name:
        #     return self.customsubcategory.system_subcategory_name.name
        # else:
        #     ""


class Score(models.Model):

    class Meta:
        verbose_name = "Score"
        verbose_name_plural = "Scores"

    user = models.ForeignKey(User, related_name='scores', on_delete=models.CASCADE)
    value = models.PositiveIntegerField(null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    day = models.TextField(null=True, blank=True)
    user_habit = models.ForeignKey(UserHabit, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self) -> str:
        return self.user.username + '-' + self.day

class UserScoreJournal(models.Model):
    class Meta:
        verbose_name = "User Score Journal"
        verbose_name_plural = "User Score Journals"

    note = models.TextField(null=True, blank=True)
    note_added_date = models.DateTimeField()
    score_id = models.ForeignKey("home.Score", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

