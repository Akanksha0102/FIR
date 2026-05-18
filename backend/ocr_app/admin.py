from django.contrib import admin
from .models import UserUploadedFile, Result


# 🔵 UserUploadedFile Admin
class UserUploadedFileAdmin(admin.ModelAdmin):
    list_display = ('id', 'file', 'uploaded_at')   # columns shown
    list_filter = ('uploaded_at',)                 # filter sidebar
    search_fields = ('file',)                      # search bar


# 🔵 Result Admin
class ResultAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'file',
        'section_identified',
        'offence_detected',
        'court',
        'is_cognizable',
        'is_bailable'
    )

    list_filter = ('is_cognizable', 'is_bailable', 'court')

    search_fields = (
        'section_identified',
        'offence_detected',
        'court'
    )


# 🔥 Register with customization
admin.site.register(UserUploadedFile, UserUploadedFileAdmin)
admin.site.register(Result, ResultAdmin)









#Actual code 

# from django.contrib import admin
# from .models import *
# # Register your models here.

# admin.site.register(UserUploadedFile)
# admin.site.register(Result)