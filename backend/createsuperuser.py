import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuration.settings')
django.setup()

from authentification.models import Utilisateur

# On remplace 'admin' par 'admin2'
if not Utilisateur.objects.filter(username='admin2').exists():
    Utilisateur.objects.create_superuser(username='admin2', email='admin2@example.com', password='motdepass')
    print("Superutilisateur admin2 créé avec succès !")
else:
    print("L'admin2 existe déjà.")
