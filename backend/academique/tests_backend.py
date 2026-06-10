"""
Tests unitaires backend — FAST Natitingou
Fichier : backend/academique/tests.py
Usage : python manage.py test academique
"""

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from authentification.models import Utilisateur
from academique.models import Filiere, Niveau, Option, Matiere, Semestre, Note
from decimal import Decimal


class TestModeles(TestCase):
    """Tests des modèles Django"""

    def setUp(self):
        self.mi = Filiere.objects.create(code='MI', nom='Mathématiques-Informatique')
        self.mi_l1 = Niveau.objects.create(filiere=self.mi, code='L1', credits_requis=60, credits_requis_passage=48)
        self.semestre = Semestre.objects.create(nom='S1 2024/2025', date_debut='2024-10-01', date_fin='2025-01-31', actif=True)
        self.enseignant = Utilisateur.objects.create_user(username='prof1', password='prof1234', role='enseignant', first_name='Prof', last_name='Test')
        self.etudiant = Utilisateur.objects.create_user(username='etu1', password='etu1234', role='etudiant', first_name='Étudiant', last_name='Test', niveau=self.mi_l1)
        self.matiere_cc = Matiere.objects.create(code='M001', nom='Analyse', coefficient=3, credits=6, avec_cc=True, niveau=self.mi_l1, enseignant=self.enseignant)
        self.matiere_sans_cc = Matiere.objects.create(code='M002', nom='Anglais', coefficient=1, credits=2, avec_cc=False, niveau=self.mi_l1, enseignant=self.enseignant)

    def test_calcul_moyenne_avec_cc(self):
        """Test calcul : CC×40% + Examen×60%"""
        note = Note.objects.create(
            etudiant=self.etudiant, matiere=self.matiere_cc,
            semestre=self.semestre, note_cc=Decimal('14'), note_examen=Decimal('16')
        )
        expected = Decimal('14') * Decimal('0.4') + Decimal('16') * Decimal('0.6')
        self.assertAlmostEqual(float(note.note_finale), float(expected), places=1)

    def test_calcul_moyenne_sans_cc(self):
        """Test : matière sans CC → note finale = note examen"""
        note = Note.objects.create(
            etudiant=self.etudiant, matiere=self.matiere_sans_cc,
            semestre=self.semestre, note_examen=Decimal('15')
        )
        self.assertEqual(float(note.note_finale), 15.0)

    def test_note_validee(self):
        """Test : note >= 10 → validée"""
        note = Note.objects.create(
            etudiant=self.etudiant, matiere=self.matiere_sans_cc,
            semestre=self.semestre, note_examen=Decimal('12')
        )
        self.assertTrue(float(note.note_finale) >= 10)

    def test_note_ajournee(self):
        """Test : note < 10 → ajournée"""
        note = Note.objects.create(
            etudiant=self.etudiant, matiere=self.matiere_sans_cc,
            semestre=self.semestre, note_examen=Decimal('8')
        )
        self.assertTrue(float(note.note_finale) < 10)

    def test_filiere_creation(self):
        """Test création filière"""
        self.assertEqual(self.mi.code, 'MI')
        self.assertEqual(str(self.mi), 'MI - Mathématiques-Informatique')

    def test_niveau_creation(self):
        """Test création niveau"""
        self.assertEqual(str(self.mi_l1), 'MI - L1')
        self.assertEqual(self.mi_l1.credits_requis_passage, 48)

    def test_credits_validation_l1(self):
        """Test : L1 nécessite 48 crédits pour passer"""
        self.assertEqual(self.mi_l1.credits_requis_passage, 48)

    def test_unique_together_note(self):
        """Test : un étudiant ne peut pas avoir deux notes pour la même matière/semestre"""
        Note.objects.create(
            etudiant=self.etudiant, matiere=self.matiere_cc,
            semestre=self.semestre, note_examen=Decimal('14')
        )
        from django.db import IntegrityError
        with self.assertRaises(Exception):
            Note.objects.create(
                etudiant=self.etudiant, matiere=self.matiere_cc,
                semestre=self.semestre, note_examen=Decimal('12')
            )


class TestAPI(TestCase):
    """Tests des endpoints API REST"""

    def setUp(self):
        self.client = APIClient()
        self.admin = Utilisateur.objects.create_superuser(username='admin_test', password='admin1234', email='admin@test.bj')
        self.mi = Filiere.objects.create(code='MI', nom='Mathématiques-Informatique')
        self.mi_l1 = Niveau.objects.create(filiere=self.mi, code='L1', credits_requis=60, credits_requis_passage=48)
        self.semestre = Semestre.objects.create(nom='S1', date_debut='2024-10-01', date_fin='2025-01-31', actif=True)
        self.enseignant = Utilisateur.objects.create_user(username='prof_test', password='prof1234', role='enseignant', first_name='Prof', last_name='Test')
        self.etudiant = Utilisateur.objects.create_user(username='etu_test', password='etu1234', role='etudiant', first_name='Etu', last_name='Test', niveau=self.mi_l1)
        self.matiere = Matiere.objects.create(code='T001', nom='Test', coefficient=2, credits=4, avec_cc=False, niveau=self.mi_l1, enseignant=self.enseignant)

    def get_token(self, username, password):
        response = self.client.post('/api/token/', {'username': username, 'password': password})
        return response.data['access']

    def test_connexion_admin(self):
        """Test connexion admin et obtention token"""
        response = self.client.post('/api/token/', {'username': 'admin_test', 'password': 'admin1234'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_connexion_mauvais_mdp(self):
        """Test connexion avec mauvais mot de passe"""
        response = self.client.post('/api/token/', {'username': 'admin_test', 'password': 'mauvais'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_acces_notes_sans_token(self):
        """Test : accès API sans token → 401"""
        response = self.client.get('/api/academique/notes/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_acces_notes_avec_token(self):
        """Test : accès API avec token → 200"""
        token = self.get_token('admin_test', 'admin1234')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/academique/notes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_creation_note_par_admin(self):
        """Test : admin peut créer une note"""
        token = self.get_token('admin_test', 'admin1234')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        data = {
            'etudiant': self.etudiant.id,
            'matiere': self.matiere.id,
            'semestre': self.semestre.id,
            'note_examen': '14.00'
        }
        response = self.client.post('/api/academique/notes/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_etudiant_ne_peut_pas_creer_note(self):
        """Test : étudiant ne peut pas créer une note"""
        token = self.get_token('etu_test', 'etu1234')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        data = {
            'etudiant': self.etudiant.id,
            'matiere': self.matiere.id,
            'semestre': self.semestre.id,
            'note_examen': '14.00'
        }
        response = self.client.post('/api/academique/notes/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_etudiant_voit_seulement_ses_notes(self):
        """Test : étudiant ne voit que ses propres notes"""
        Note.objects.create(etudiant=self.etudiant, matiere=self.matiere, semestre=self.semestre, note_examen=Decimal('14'))
        token = self.get_token('etu_test', 'etu1234')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/academique/notes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for note in response.data:
            self.assertEqual(note['etudiant'], self.etudiant.id)

    def test_liste_filieres(self):
        """Test : liste des filières accessible"""
        token = self.get_token('admin_test', 'admin1234')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/academique/filieres/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_inscription_matricule_valide(self):
        """Test : vérification matricule valide"""
        self.etudiant.matricule = 'TEST001'
        self.etudiant.is_registered = False
        self.etudiant.save()
        response = self.client.post('/api/auth/verifier-matricule/', {'matricule': 'TEST001'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_inscription_matricule_invalide(self):
        """Test : vérification matricule inexistant"""
        response = self.client.post('/api/auth/verifier-matricule/', {'matricule': 'INEXISTANT'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)