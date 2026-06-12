from django.core.management import call_command # <-- LIGNE RAJOUTÉE ICI
from rest_framework import generics, permissions
from .models import Utilisateur
from .serializers import UtilisateurSerializer, UtilisateurCreateSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

# ====================================================================
# FORÇAGE DU PEUPLEMENT DE LA BASE DE DONNÉES (FIXTURE)
# ====================================================================
try:
    # On force Django à charger le fichier de données dans la base PostgreSQL
    call_command('loaddata', 'donnees.json')
    print("--- LA BASE DE DONNÉES A ÉTÉ PEUPLÉE AVEC SUCCÈS ! ---")
except Exception as e:
    print(f"Note sur le peuplement : {e}")
# ====================================================================

# ====================================================================
# TRICHE DE SECOURS : Création automatique de l'administrateur
# ====================================================================
try:
    if not Utilisateur.objects.filter(username='directeur').exists():
        Utilisateur.objects.create_superuser(
            username='directeur',
            email='directeur@example.com',
            password='Nati2026!',  # Votre mot de passe sécurisé
            role='admin',
            is_registered=True,
            is_staff=True,
            is_superuser=True
        )
        print("--- COMPTE DIRECTEUR CRÉÉ AVEC SUCCÈS ! ---")
except Exception as e:
    print(f"Erreur lors de la création automatique : {e}")

class ProfilView(generics.RetrieveUpdateAPIView):
    """Retourne et met à jour le profil de l'utilisateur connecté."""
    serializer_class = UtilisateurSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class CreerUtilisateurView(generics.CreateAPIView):
    """Création d'un utilisateur (admin seulement)."""
    serializer_class = UtilisateurCreateSerializer
    permission_classes = [permissions.IsAdminUser]


class ListeUtilisateursView(generics.ListAPIView):
    """Liste tous les utilisateurs (admin seulement)."""
    serializer_class = UtilisateurSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Utilisateur.objects.all()


class ListeEtudiantsView(generics.ListAPIView):
    """Liste uniquement les étudiants — accessible aux enseignants."""
    serializer_class = UtilisateurSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Utilisateur.objects.filter(role='etudiant')


class ModifierSupprimerUtilisateurView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UtilisateurSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Utilisateur.objects.all()



@api_view(['POST'])
@permission_classes([AllowAny])
def verifier_matricule(request):
    matricule = request.data.get('matricule')
    if not matricule:
        return Response({'error': 'Matricule requis.'}, status=400)

    try:
        etudiant = Utilisateur.objects.get(matricule=matricule, role='etudiant')
        if etudiant.is_registered:
            return Response({'error': 'Ce matricule est déjà associé à un compte.'}, status=400)
        return Response({'success': True, 'message': 'Matricule valide.'})
    except Utilisateur.DoesNotExist:
        return Response({'error': 'Matricule introuvable. Contactez l\'administration.'}, status=404)


@api_view(['POST'])
@permission_classes([AllowAny])
def inscription_etudiant(request):
    matricule = request.data.get('matricule')
    username = request.data.get('username')
    password = request.data.get('password')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    email = request.data.get('email', '')

    if not all([matricule, username, password, first_name, last_name]):
        return Response({'error': 'Tous les champs sont requis.'}, status=400)

    try:
        etudiant = Utilisateur.objects.get(matricule=matricule, role='etudiant')
        if etudiant.is_registered:
            return Response({'error': 'Ce matricule est déjà utilisé.'}, status=400)

        if Utilisateur.objects.filter(username=username).exists():
            return Response({'error': 'Ce nom d\'utilisateur est déjà pris.'}, status=400)

        etudiant.username = username
        etudiant.first_name = first_name
        etudiant.last_name = last_name
        etudiant.email = email
        etudiant.set_password(password)
        etudiant.is_registered = True
        etudiant.is_active = True
        etudiant.save()

        return Response({'success': True, 'message': 'Compte créé avec succès !'})
    except Utilisateur.DoesNotExist:
        return Response({'error': 'Matricule introuvable.'}, status=404)