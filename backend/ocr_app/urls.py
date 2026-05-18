from django.urls import path
from .views import FileUploadView, UserUploadedFileView

urlpatterns = [
    path("upload/", FileUploadView.as_view()),
    path("file/<int:file_id>/", UserUploadedFileView.as_view()),
]