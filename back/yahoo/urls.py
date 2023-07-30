from django.urls import include, path

from . import views

urlpatterns = [
  path("get_prices/", views.get_prices, name="get_prices"),
  path("reload/", views.reload, name="reload"),
]