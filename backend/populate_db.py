"""
Script de peuplement de la base de données — FAST Natitingou
Usage : python manage.py shell < populate_db.py
"""

from authentification.models import Utilisateur
from academique.models import (
    Filiere, Niveau, Option, Matiere, Semestre, Note,
    EmploiDuTemps, EmploiDuTempsExamen
)
from datetime import date, time

print("🚀 Démarrage du peuplement de la base de données...")

# ── NETTOYAGE ──────────────────────────────────────────────
Note.objects.all().delete()
EmploiDuTemps.objects.all().delete()
EmploiDuTempsExamen.objects.all().delete()
Matiere.objects.all().delete()
Option.objects.all().delete()
Niveau.objects.all().delete()
Filiere.objects.all().delete()
Semestre.objects.all().delete()
Utilisateur.objects.filter(is_superuser=False).delete()
print("✅ Base nettoyée")

# ── FILIÈRES ───────────────────────────────────────────────
mi = Filiere.objects.create(code='MI', nom='Mathématiques-Informatique')
pc = Filiere.objects.create(code='PC', nom='Physique-Chimie')
print("✅ Filières créées")

# ── NIVEAUX ────────────────────────────────────────────────
mi_l1 = Niveau.objects.create(filiere=mi, code='L1', credits_requis=60, credits_requis_passage=48)
mi_l2 = Niveau.objects.create(filiere=mi, code='L2', credits_requis=60, credits_requis_passage=36)
mi_l3 = Niveau.objects.create(filiere=mi, code='L3', credits_requis=60, credits_requis_passage=60)
pc_l1 = Niveau.objects.create(filiere=pc, code='L1', credits_requis=60, credits_requis_passage=48)
pc_l2 = Niveau.objects.create(filiere=pc, code='L2', credits_requis=60, credits_requis_passage=36)
pc_l3 = Niveau.objects.create(filiere=pc, code='L3', credits_requis=60, credits_requis_passage=60)
print("✅ Niveaux créés")

# ── OPTIONS ────────────────────────────────────────────────
opt_math = Option.objects.create(niveau=mi_l3, code='MATH_FOND', nom='Mathématiques Fondamentales')
opt_stat = Option.objects.create(niveau=mi_l3, code='STAT', nom='Statistique')
opt_info = Option.objects.create(niveau=mi_l3, code='INFO', nom='Informatique')
opt_phy  = Option.objects.create(niveau=pc_l3, code='PHYSIQUE', nom='Physique')
opt_chi  = Option.objects.create(niveau=pc_l3, code='CHIMIE', nom='Chimie')
print("✅ Options créées")

# ── SEMESTRES ─────────────────────────────────────────────
s1 = Semestre.objects.create(nom='Semestre 1 — 2024/2025', date_debut=date(2024, 10, 1), date_fin=date(2025, 1, 31), actif=True)
s2 = Semestre.objects.create(nom='Semestre 2 — 2024/2025', date_debut=date(2025, 2, 1), date_fin=date(2025, 6, 30), actif=False)
print("✅ Semestres créés")

# ── ENSEIGNANTS ───────────────────────────────────────────
ens1 = Utilisateur.objects.create_user(username='prof_math', password='prof1234', first_name='Koffi', last_name='ADANDE', role='enseignant', email='adande@fast.bj')
ens2 = Utilisateur.objects.create_user(username='prof_info', password='prof1234', first_name='Sékou', last_name='BIOKOU', role='enseignant', email='biokou@fast.bj')
ens3 = Utilisateur.objects.create_user(username='prof_ang', password='prof1234', first_name='Marie', last_name='DOSSOU', role='enseignant', email='dossou@fast.bj')
ens4 = Utilisateur.objects.create_user(username='prof_phy', password='prof1234', first_name='Paul', last_name='HOUNTON', role='enseignant', email='hounton@fast.bj')
print("✅ Enseignants créés")

# ── MATIÈRES MI-L1 ────────────────────────────────────────
m_analyse = Matiere.objects.create(code='MI101', nom='Analyse Mathématique 1', coefficient=3, credits=6, avec_cc=True, niveau=mi_l1, enseignant=ens1)
m_algebre = Matiere.objects.create(code='MI102', nom='Algèbre 1', coefficient=3, credits=6, avec_cc=True, niveau=mi_l1, enseignant=ens1)
m_algo    = Matiere.objects.create(code='MI103', nom='Algorithmique', coefficient=2, credits=4, avec_cc=True, niveau=mi_l1, enseignant=ens2)
m_prog    = Matiere.objects.create(code='MI104', nom='Programmation Python', coefficient=2, credits=4, avec_cc=True, niveau=mi_l1, enseignant=ens2)
m_ang1    = Matiere.objects.create(code='MI105', nom='Anglais Scientifique 1', coefficient=1, credits=2, avec_cc=False, niveau=mi_l1, enseignant=ens3)
m_phys1   = Matiere.objects.create(code='MI106', nom='Physique Générale', coefficient=2, credits=4, avec_cc=True, niveau=mi_l1, enseignant=ens4)
m_info1   = Matiere.objects.create(code='MI107', nom='Introduction à l\'Informatique', coefficient=1, credits=2, avec_cc=False, niveau=mi_l1, enseignant=ens2)
m_stat1   = Matiere.objects.create(code='MI108', nom='Statistiques Descriptives', coefficient=2, credits=4, avec_cc=True, niveau=mi_l1, enseignant=ens1)
m_log     = Matiere.objects.create(code='MI109', nom='Logique Mathématique', coefficient=2, credits=4, avec_cc=True, niveau=mi_l1, enseignant=ens1)
m_expres  = Matiere.objects.create(code='MI110', nom='Expression et Communication', coefficient=1, credits=2, avec_cc=False, niveau=mi_l1, enseignant=ens3)

# ── MATIÈRES MI-L2 ────────────────────────────────────────
m_analyse2 = Matiere.objects.create(code='MI201', nom='Analyse Mathématique 2', coefficient=3, credits=6, avec_cc=True, niveau=mi_l2, enseignant=ens1)
m_algebre2 = Matiere.objects.create(code='MI202', nom='Algèbre 2', coefficient=3, credits=6, avec_cc=True, niveau=mi_l2, enseignant=ens1)
m_proba    = Matiere.objects.create(code='MI203', nom='Probabilités', coefficient=2, credits=4, avec_cc=True, niveau=mi_l2, enseignant=ens1)
m_bdd      = Matiere.objects.create(code='MI204', nom='Bases de Données', coefficient=2, credits=4, avec_cc=True, niveau=mi_l2, enseignant=ens2)
m_web      = Matiere.objects.create(code='MI205', nom='Développement Web', coefficient=2, credits=4, avec_cc=True, niveau=mi_l2, enseignant=ens2)
m_ang2     = Matiere.objects.create(code='MI206', nom='Anglais Scientifique 2', coefficient=1, credits=2, avec_cc=False, niveau=mi_l2, enseignant=ens3)
m_reseau   = Matiere.objects.create(code='MI207', nom='Réseaux Informatiques', coefficient=2, credits=4, avec_cc=True, niveau=mi_l2, enseignant=ens2)
m_analyse3 = Matiere.objects.create(code='MI208', nom='Analyse Numérique', coefficient=2, credits=4, avec_cc=True, niveau=mi_l2, enseignant=ens1)
m_optim    = Matiere.objects.create(code='MI209', nom='Optimisation', coefficient=2, credits=4, avec_cc=True, niveau=mi_l2, enseignant=ens1)
m_sys      = Matiere.objects.create(code='MI210', nom='Systèmes d\'exploitation', coefficient=1, credits=2, avec_cc=False, niveau=mi_l2, enseignant=ens2)

# ── MATIÈRES PC-L1 ────────────────────────────────────────
m_meca   = Matiere.objects.create(code='PC101', nom='Mécanique du Point', coefficient=3, credits=6, avec_cc=True, niveau=pc_l1, enseignant=ens4)
m_elec   = Matiere.objects.create(code='PC102', nom='Électricité 1', coefficient=3, credits=6, avec_cc=True, niveau=pc_l1, enseignant=ens4)
m_chim1  = Matiere.objects.create(code='PC103', nom='Chimie Générale', coefficient=3, credits=6, avec_cc=True, niveau=pc_l1, enseignant=ens4)
m_math1  = Matiere.objects.create(code='PC104', nom='Mathématiques pour Physiciens', coefficient=2, credits=4, avec_cc=True, niveau=pc_l1, enseignant=ens1)
m_ang_pc = Matiere.objects.create(code='PC105', nom='Anglais Scientifique', coefficient=1, credits=2, avec_cc=False, niveau=pc_l1, enseignant=ens3)
m_thermo = Matiere.objects.create(code='PC106', nom='Thermodynamique 1', coefficient=2, credits=4, avec_cc=True, niveau=pc_l1, enseignant=ens4)
m_optiq  = Matiere.objects.create(code='PC107', nom='Optique Géométrique', coefficient=2, credits=4, avec_cc=True, niveau=pc_l1, enseignant=ens4)
m_chim2  = Matiere.objects.create(code='PC108', nom='Chimie Organique 1', coefficient=2, credits=4, avec_cc=True, niveau=pc_l1, enseignant=ens4)
m_info_pc= Matiere.objects.create(code='PC109', nom='Informatique Appliquée', coefficient=1, credits=2, avec_cc=False, niveau=pc_l1, enseignant=ens2)
m_exppc  = Matiere.objects.create(code='PC110', nom='Expression et Communication', coefficient=1, credits=2, avec_cc=False, niveau=pc_l1, enseignant=ens3)
print("✅ Matières créées")

# ── ÉTUDIANTS MI-L1 ───────────────────────────────────────
etudiants_mi_l1 = [
    ('FAST2024001', 'Amidou', 'MANSA', 'amansa'),
    ('FAST2024002', 'Brice', 'AKPAGLO', 'bakpaglo'),
    ('FAST2024003', 'Clarisse', 'DOVI', 'cdovi'),
    ('FAST2024004', 'Damien', 'HOUETO', 'dhoueto'),
    ('FAST2024005', 'Estelle', 'KEKE', 'ekeke'),
]
ets_mi_l1 = []
for mat, prenom, nom, username in etudiants_mi_l1:
    u = Utilisateur.objects.create_user(
        username=username, password='etudiant123',
        first_name=prenom, last_name=nom,
        role='etudiant', matricule=mat,
        niveau=mi_l1, is_registered=True, is_active=True
    )
    ets_mi_l1.append(u)

# ── ÉTUDIANTS MI-L2 ───────────────────────────────────────
etudiants_mi_l2 = [
    ('FAST2023001', 'Fabrice', 'LOKO', 'floko'),
    ('FAST2023002', 'Grace', 'MEDENOU', 'gmedenou'),
    ('FAST2023003', 'Hervé', 'NOUDEKE', 'hnoudeke'),
]
ets_mi_l2 = []
for mat, prenom, nom, username in etudiants_mi_l2:
    u = Utilisateur.objects.create_user(
        username=username, password='etudiant123',
        first_name=prenom, last_name=nom,
        role='etudiant', matricule=mat,
        niveau=mi_l2, is_registered=True, is_active=True
    )
    ets_mi_l2.append(u)

# ── ÉTUDIANTS PC-L1 ───────────────────────────────────────
etudiants_pc_l1 = [
    ('FAST2024006', 'Ibrahim', 'OROU', 'iorou'),
    ('FAST2024007', 'Judith', 'PADONOU', 'jpadonou'),
    ('FAST2024008', 'Kader', 'QUENUM', 'kquenum'),
]
ets_pc_l1 = []
for mat, prenom, nom, username in etudiants_pc_l1:
    u = Utilisateur.objects.create_user(
        username=username, password='etudiant123',
        first_name=prenom, last_name=nom,
        role='etudiant', matricule=mat,
        niveau=pc_l1, is_registered=True, is_active=True
    )
    ets_pc_l1.append(u)

print("✅ Étudiants créés")

# ── NOTES MI-L1 ───────────────────────────────────────────
import random
random.seed(42)

matieres_mi_l1 = [m_analyse, m_algebre, m_algo, m_prog, m_ang1, m_phys1, m_info1, m_stat1, m_log, m_expres]

for etudiant in ets_mi_l1:
    for matiere in matieres_mi_l1:
        note_examen = round(random.uniform(6, 19), 2)
        note_cc = round(random.uniform(8, 18), 2) if matiere.avec_cc else None
        Note.objects.create(
            etudiant=etudiant, matiere=matiere,
            semestre=s1, note_examen=note_examen,
            note_cc=note_cc, valide=True
        )

# ── NOTES MI-L2 ───────────────────────────────────────────
matieres_mi_l2 = [m_analyse2, m_algebre2, m_proba, m_bdd, m_web, m_ang2, m_reseau, m_analyse3, m_optim, m_sys]

for etudiant in ets_mi_l2:
    for matiere in matieres_mi_l2:
        note_examen = round(random.uniform(7, 18), 2)
        note_cc = round(random.uniform(9, 17), 2) if matiere.avec_cc else None
        Note.objects.create(
            etudiant=etudiant, matiere=matiere,
            semestre=s1, note_examen=note_examen,
            note_cc=note_cc, valide=True
        )

# ── NOTES PC-L1 ───────────────────────────────────────────
matieres_pc_l1 = [m_meca, m_elec, m_chim1, m_math1, m_ang_pc, m_thermo, m_optiq, m_chim2, m_info_pc, m_exppc]

for etudiant in ets_pc_l1:
    for matiere in matieres_pc_l1:
        note_examen = round(random.uniform(5, 18), 2)
        note_cc = round(random.uniform(7, 16), 2) if matiere.avec_cc else None
        Note.objects.create(
            etudiant=etudiant, matiere=matiere,
            semestre=s1, note_examen=note_examen,
            note_cc=note_cc, valide=True
        )

print("✅ Notes créées")

# ── EMPLOIS DU TEMPS MI-L1 ────────────────────────────────
emplois = [
    (m_analyse, 'lun', time(8,0), time(10,0), 'Amphi A'),
    (m_algebre, 'lun', time(10,0), time(12,0), 'Amphi A'),
    (m_algo, 'mar', time(8,0), time(10,0), 'Salle 1'),
    (m_prog, 'mar', time(10,0), time(12,0), 'Labo Info'),
    (m_phys1, 'mer', time(8,0), time(10,0), 'Salle 2'),
    (m_stat1, 'mer', time(10,0), time(12,0), 'Salle 1'),
    (m_log, 'jeu', time(8,0), time(10,0), 'Amphi A'),
    (m_ang1, 'jeu', time(10,0), time(12,0), 'Salle 3'),
    (m_info1, 'ven', time(8,0), time(10,0), 'Labo Info'),
    (m_expres, 'ven', time(10,0), time(12,0), 'Salle 2'),
]
for mat, jour, hdebut, hfin, salle in emplois:
    EmploiDuTemps.objects.create(matiere=mat, semestre=s1, jour=jour, heure_debut=hdebut, heure_fin=hfin, salle=salle)

print("✅ Emplois du temps créés")

# ── EXAMENS ───────────────────────────────────────────────
examens = [
    (m_analyse, 'examen', date(2026, 1, 15), time(8,0), time(11,0), 'Amphi A'),
    (m_algebre, 'examen', date(2026, 1, 17), time(8,0), time(11,0), 'Amphi A'),
    (m_algo, 'examen', date(2026, 1, 20), time(8,0), time(10,0), 'Salle 1'),
    (m_prog, 'examen', date(2026, 1, 22), time(8,0), time(10,0), 'Labo Info'),
    (m_analyse, 'partiel', date(2025, 11, 20), time(10,0), time(12,0), 'Amphi A'),
    (m_algebre, 'partiel', date(2025, 11, 22), time(10,0), time(12,0), 'Amphi A'),
]
for mat, type_exam, d, hdebut, hfin, salle in examens:
    EmploiDuTempsExamen.objects.create(
        matiere=mat, semestre=s1, type_examen=type_exam,
        date=d, heure_debut=hdebut, heure_fin=hfin, salle=salle
    )

print("✅ Examens créés")

print("\n🎉 Base de données peuplée avec succès !")
print(f"   - 2 filières, 6 niveaux, 5 options")
print(f"   - 4 enseignants")
print(f"   - {len(ets_mi_l1) + len(ets_mi_l2) + len(ets_pc_l1)} étudiants")
print(f"   - {Matiere.objects.count()} matières")
print(f"   - {Note.objects.count()} notes")
print(f"   - {EmploiDuTemps.objects.count()} créneaux")
print(f"   - {EmploiDuTempsExamen.objects.count()} examens")
print("\n📋 Comptes de test :")
print("   Enseignants : prof_math, prof_info, prof_ang, prof_phy (mdp: prof1234)")
print("   Étudiants MI-L1 : amansa, bakpaglo, cdovi, dhoueto, ekeke (mdp: etudiant123)")
print("   Étudiants MI-L2 : floko, gmedenou, hnoudeke (mdp: etudiant123)")
print("   Étudiants PC-L1 : iorou, jpadonou, kquenum (mdp: etudiant123)")
