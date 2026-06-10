# 🎓 Plateforme Web de Gestion Académique — FAST Natitingou

[![Django](https://img.shields.io/badge/Django-4.2-green)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![JWT](https://img.shields.io/badge/Auth-JWT-orange)](https://jwt.io)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> Plateforme fullstack de gestion académique développée pour la Faculté des Sciences et Techniques de Natitingou (FAST-NATI) — UNSTIM, Bénin.

---

## 📋 Table des matières

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Tests](#tests)
- [Comptes de test](#comptes-de-test)
- [Technologies](#technologies)
- [Auteur](#auteur)

---

## 📖 Présentation

Cette plateforme web permet la gestion complète des activités académiques de la FAST Natitingou :
gestion des étudiants par filière et niveau, saisie des notes, calcul automatique des moyennes,
génération de relevés PDF, gestion des emplois du temps et calendrier des examens.

### Filières gérées
- **MI** — Mathématiques-Informatique (L1, L2, L3)
  - L3 : options Mathématiques Fondamentales, Statistique, Informatique
- **PC** — Physique-Chimie (L1, L2, L3)
  - L3 : options Physique, Chimie

### Système de validation (LMD)
| Niveau | Crédits requis pour passer |
|--------|---------------------------|
| L1 | ≥ 48 / 60 crédits |
| L2 (si L1 = 60/60) | ≥ 36 / 60 crédits |
| L2 (si L1 < 60/60) | 60 / 60 crédits |
| L3 | 60 / 60 crédits (Licence) |

---

## ✨ Fonctionnalités

### 👨‍💼 Espace Administrateur
- Tableau de bord avec statistiques en temps réel
- Gestion des utilisateurs (CRUD) avec assignation filière/niveau/option
- Inscription des étudiants par matricule
- Validation des relevés de notes
- Gestion du calendrier des examens
- Liste des étudiants par classe

### 👨‍🏫 Espace Enseignant
- Saisie des notes CC et Examen (filtrées par niveau étudiant)
- Calcul automatique des moyennes (CC×40% + Examen×60%)
- Emploi du temps personnel

### 🎓 Espace Étudiant
- Consultation des notes avec mention
- Téléchargement du relevé de notes officiel (PDF)
- Emploi du temps hebdomadaire
- Calendrier des examens
- Inscription via matricule (système en deux étapes)

---

## 🏗️ Architecture

```
Monprojet/
├── backend/                  # API REST Django
│   ├── authentification/     # Gestion utilisateurs, rôles, matricules
│   ├── academique/           # Notes, matières, filières, niveaux, examens
│   └── configuration/        # Settings, URLs, JWT
│
├── frontend/                 # Interface React
│   └── src/
│       ├── views/
│       │   ├── admin/        # Dashboard, utilisateurs, relevés, examens
│       │   ├── enseignant/   # Saisie notes, emploi du temps
│       │   └── etudiant/     # Notes, emploi du temps, examens
│       ├── components/       # Sidebar, Navbar
│       ├── services/         # API calls (Axios)
│       └── context/          # AuthContext (JWT)
│
└── documents/                # Rapport et livrables
```

---

## 📦 Prérequis

- **Python** 3.10+
- **Node.js** 18+
- **npm** 9+

---

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/monprojet.git
cd monprojet
```

### 2. Backend Django

```bash
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer (Windows)
venv\Scripts\activate

# Activer (Linux/Mac)
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Créer les tables
python manage.py makemigrations
python manage.py migrate

# Créer le superutilisateur
python manage.py createsuperuser

# Peupler la base avec des données de test (optionnel)
python manage.py shell < populate_db.py

# Lancer le serveur
python manage.py runserver
```

### 3. Frontend React

```bash
cd frontend

# Installer les dépendances
npm install

# Configurer l'URL de l'API
# Vérifier frontend/.env : VITE_API_URL=http://localhost:8000/api

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur **http://localhost:5173**

---

## 💻 Utilisation

### Accès à l'application
- **Interface web** : http://localhost:5173
- **API Django** : http://localhost:8000/api
- **Admin Django** : http://localhost:8000/admin

### Workflow typique

1. **Admin** crée les filières, niveaux et options
2. **Admin** inscrit les étudiants avec leur matricule et niveau
3. **Admin** crée les matières associées aux niveaux
4. **Enseignant** saisit les notes pour ses étudiants
5. **Étudiant** consulte ses notes et télécharge son relevé PDF
6. **Admin** valide les relevés et consulte les statistiques

---

## 📁 Structure du projet

```
backend/
├── manage.py
├── requirements.txt
├── .env
├── populate_db.py          # Script de peuplement BDD
├── configuration/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── authentification/
│   ├── models.py           # Modèle Utilisateur (rôles, matricule, niveau)
│   ├── views.py            # Profil, inscription, liste utilisateurs
│   ├── serializers.py
│   └── urls.py
└── academique/
    ├── models.py           # Filiere, Niveau, Option, Matiere, Note, EDT
    ├── views.py            # ViewSets + stats + PDF
    ├── serializers.py
    ├── admin.py
    ├── urls.py
    └── tests.py            # Tests unitaires

frontend/
├── package.json
├── vite.config.js
├── vitest.config.js        # Configuration tests
├── .env
└── src/
    ├── App.jsx             # Routes protégées par rôle
    ├── main.jsx
    ├── assets/
    ├── components/
    │   ├── Sidebar.jsx     # Navigation responsive
    │   └── Navbar.jsx
    ├── context/
    │   └── AuthContext.jsx # Gestion JWT globale
    ├── services/
    │   ├── api.js          # Axios + intercepteurs JWT
    │   ├── authService.js
    │   └── noteService.js
    ├── views/
    │   ├── Accueil.jsx
    │   ├── Login.jsx
    │   ├── Inscription.jsx # Inscription par matricule
    │   ├── admin/
    │   ├── enseignant/
    │   └── etudiant/
    └── __tests__/
        ├── setup.js
        └── tests_frontend.test.jsx
```

---

## 🧪 Tests

### Tests backend
```bash
cd backend
python manage.py test academique
```

### Tests frontend
```bash
cd frontend
npm test
```

### Peuplement de la base de test
```bash
cd backend
python manage.py shell < populate_db.py
```

---

## 👤 Comptes de test

| Rôle | Nom d'utilisateur | Mot de passe |
|------|-------------------|--------------|
| Administrateur | admin | (défini à la création) |
| Enseignant Maths | prof_math | prof1234 |
| Enseignant Info | prof_info | prof1234 |
| Étudiant MI-L1 | amansa | etudiant123 |
| Étudiant MI-L2 | floko | etudiant123 |
| Étudiant PC-L1 | iorou | etudiant123 |

---

## 🛠️ Technologies

### Backend
| Technologie | Version | Rôle |
|-------------|---------|------|
| Django | 4.2+ | Framework web Python |
| Django REST Framework | 3.14+ | API REST |
| SimpleJWT | 5.3+ | Authentification JWT |
| django-cors-headers | 4.3+ | Gestion CORS |
| ReportLab | Latest | Génération PDF |
| Pillow | Latest | Traitement images |
| SQLite / PostgreSQL | - | Base de données |

### Frontend
| Technologie | Version | Rôle |
|-------------|---------|------|
| React | 18 | Interface utilisateur |
| Vite | 5 | Build tool |
| React Router | 6 | Navigation |
| Axios | 1.6+ | Requêtes HTTP |
| Lucide React | 0.383 | Icônes |
| Tailwind CSS | 3.4 | Styles utilitaires |

---

## 📄 Variables d'environnement

### Backend (.env)
```env
SECRET_KEY=votre-clé-secrète
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 👨‍💻 Auteur

**FOUSSENI Ahamadou**
- Licence 3 Mathématiques-Informatique
- FAST Natitingou — UNSTIM, Bénin
- Année académique : 2024-2025

**Encadreur :** M. Bio Mourou Orou Bouyagui

---

## 📝 Licence

Ce projet est développé dans le cadre d'un projet académique à la FAST Natitingou.

© 2025 FOUSSENI Ahamadou — FAST Natitingou, UNSTIM
