from django.urls import path
from .views import (
    ProfilView, CreerUtilisateurView, ListeUtilisateursView,
    ListeEtudiantsView, ModifierSupprimerUtilisateurView,
    verifier_matricule, inscription_etudiant
)

urlpatterns = [
    path('profil/', ProfilView.as_view(), name='profil'),
    path('etudiants/', ListeEtudiantsView.as_view(), name='liste-etudiants'),
    path('utilisateurs/', ListeUtilisateursView.as_view(), name='liste-utilisateurs'),
    path('utilisateurs/creer/', CreerUtilisateurView.as_view(), name='creer-utilisateur'),
    path('utilisateurs/<int:pk>/', ModifierSupprimerUtilisateurView.as_view(), name='modifier-utilisateur'),
    path('verifier-matricule/', verifier_matricule, name='verifier-matricule'),
    path('inscription/', inscription_etudiant, name='inscription'),
]