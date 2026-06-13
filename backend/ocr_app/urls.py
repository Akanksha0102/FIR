from django.urls import path
from .views import FileUploadView, UserUploadedFileView, ResultStatusView

urlpatterns = [
    path("upload/", FileUploadView.as_view()),
    path("file/<int:file_id>/", UserUploadedFileView.as_view()),
    path("result/<int:result_id>/", ResultStatusView.as_view()),
]