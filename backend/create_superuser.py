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
    # Forcer la mise à jour du mot de passe
    user = Utilisateur.objects.get(username='directeur')
    user.set_password('Nati2026!')
    user.is_superuser = True
    user.is_staff = True
    user.is_active = True
    user.role = 'admin'
    user.save()
    print("Mot de passe mis à jour !")