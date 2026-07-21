import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuration.settings')
django.setup()

from authentification.models import Utilisateur

if not Utilisateur.objects.filter(username='directeur').exists():
    Utilisateur.objects.create_superuser(
        username='directeur',
        email='directeur@fast.bj',
        password='Nati2026!',
        role='admin'
    )
    print("Superutilisateur créé !")
else:
    print("Superutilisateur existe déjà.")