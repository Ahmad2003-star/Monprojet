from django.contrib.auth.models import AbstractUser
from django.db import models

class Utilisateur(AbstractUser):
    ROLES = [
        ('admin', 'Administrateur'),
        ('enseignant', 'Enseignant'),
        ('etudiant', 'Étudiant'),
    ]

    niveau = models.ForeignKey('academique.Niveau', on_delete=models.SET_NULL, null=True, blank=True, related_name='etudiants')
    option = models.ForeignKey('academique.Option', on_delete=models.SET_NULL, null=True, blank=True, related_name='etudiants')
    matricule = models.CharField(max_length=20, unique=True, null=True, blank=True)
    is_registered = models.BooleanField(default=False)
    role = models.CharField(max_length=20, choices=ROLES, default='etudiant')
    telephone = models.CharField(max_length=20, blank=True)
    photo = models.ImageField(upload_to='profils/', blank=True, null=True)

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"