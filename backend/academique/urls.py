from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NoteViewSet, MatiereViewSet, EmploiDuTempsViewSet, SemestreViewSet,
    stats_dashboard, generer_releve_pdf, EmploiDuTempsExamenViewSet,
    FiliereViewSet, NiveauViewSet, OptionViewSet
)

router = DefaultRouter()
router.register('notes', NoteViewSet, basename='note')
router.register('matieres', MatiereViewSet, basename='matiere')
router.register('emplois-du-temps', EmploiDuTempsViewSet, basename='emploi')
router.register('semestres', SemestreViewSet, basename='semestre')
router.register('examens', EmploiDuTempsExamenViewSet, basename='examen')
router.register('filieres', FiliereViewSet, basename='filiere')
router.register('niveaux', NiveauViewSet, basename='niveau')
router.register('options', OptionViewSet, basename='option')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', stats_dashboard, name='stats'),
    path('releve/<int:etudiant_id>/', generer_releve_pdf, name='releve-pdf'),
]