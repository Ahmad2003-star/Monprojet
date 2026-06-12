from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import HttpResponse # <-- Ligne ajoutée

# Petite fonction de secours pour Render
def home(request):
    return HttpResponse("API FAST Natitingou en ligne", content_type="text/plain")

urlpatterns = [
    path('', home), # <-- Ligne ajoutée pour la racine
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('authentification.urls')),
    path('api/academique/', include('academique.urls')),
]