import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuration.settings')
django.setup()

from authentification.models import Utilisateur # Adaptez si votre modèle personnalisé est ailleurs

# On vérifie si l'admin existe déjà pour ne pas créer de doublon
if not Utilisateur.objects.filter(username='admin').exists():
    Utilisateur.objects.create_superuser(username='admin', email='admin@example.com', password='motdepass')
    print("Superutilisateur créé avec succès !")
else:
    print("L'admin existe déjà.")