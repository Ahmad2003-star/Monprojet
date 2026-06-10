from django.db import models
from authentification.models import Utilisateur


class Semestre(models.Model):
    nom = models.CharField(max_length=50)
    date_debut = models.DateField()
    date_fin = models.DateField()
    actif = models.BooleanField(default=False)

    def __str__(self):
        return self.nom


class Filiere(models.Model):
    code = models.CharField(max_length=5, unique=True)
    nom = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.code} - {self.nom}"


class Niveau(models.Model):
    filiere = models.ForeignKey(Filiere, on_delete=models.CASCADE, related_name='niveaux')
    code = models.CharField(max_length=5)
    credits_requis = models.PositiveSmallIntegerField(default=60)
    credits_requis_passage = models.PositiveSmallIntegerField(default=48)

    class Meta:
        unique_together = ('filiere', 'code')

    def __str__(self):
        return f"{self.filiere.code} - {self.code}"


class Option(models.Model):
    niveau = models.ForeignKey(Niveau, on_delete=models.CASCADE, related_name='options')
    code = models.CharField(max_length=20)
    nom = models.CharField(max_length=100)

    class Meta:
        unique_together = ('niveau', 'code')

    def __str__(self):
        return f"{self.niveau} - {self.nom}"


class Matiere(models.Model):
    avec_cc = models.BooleanField(default=True)
    code = models.CharField(max_length=10, unique=True)
    nom = models.CharField(max_length=100)
    coefficient = models.PositiveSmallIntegerField(default=1)
    credits = models.PositiveSmallIntegerField(default=3, help_text="Nombre de crédits ECTS")
    niveau = models.ForeignKey(Niveau, on_delete=models.SET_NULL, null=True, blank=True, related_name='matieres')
    option = models.ForeignKey(Option, on_delete=models.SET_NULL, null=True, blank=True, related_name='matieres')
    enseignant = models.ForeignKey(
        Utilisateur, on_delete=models.SET_NULL, null=True,
        limit_choices_to={'role': 'enseignant'}, related_name='matieres'
    )

    def __str__(self):
        return f"{self.code} - {self.nom}"


class Note(models.Model):
    etudiant = models.ForeignKey(
        Utilisateur, on_delete=models.CASCADE,
        limit_choices_to={'role': 'etudiant'}, related_name='notes'
    )
    matiere = models.ForeignKey(Matiere, on_delete=models.CASCADE, related_name='notes')
    semestre = models.ForeignKey(Semestre, on_delete=models.CASCADE, related_name='notes')
    note_cc = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    note_examen = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    note_finale = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    valide = models.BooleanField(default=False)

    class Meta:
        unique_together = ('etudiant', 'matiere', 'semestre')

    def save(self, *args, **kwargs):
        from decimal import Decimal, ROUND_HALF_UP, InvalidOperation
        try:
            if self.note_examen is not None:
                examen = Decimal(str(float(self.note_examen))).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                if self.matiere.avec_cc and self.note_cc is not None:
                    cc = Decimal(str(float(self.note_cc))).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                    self.note_finale = (cc * Decimal('0.4') + examen * Decimal('0.6')).quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)
                elif not self.matiere.avec_cc:
                    self.note_finale = examen.quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)
        except InvalidOperation:
            pass
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.etudiant} | {self.matiere} | {self.note_finale}"


class EmploiDuTemps(models.Model):
    JOURS = [
        ('lun', 'Lundi'), ('mar', 'Mardi'), ('mer', 'Mercredi'),
        ('jeu', 'Jeudi'), ('ven', 'Vendredi'), ('sam', 'Samedi'),
    ]
    matiere = models.ForeignKey(Matiere, on_delete=models.CASCADE)
    semestre = models.ForeignKey(Semestre, on_delete=models.CASCADE)
    jour = models.CharField(max_length=3, choices=JOURS)
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()
    salle = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.matiere} — {self.jour} {self.heure_debut}-{self.heure_fin}"


class EmploiDuTempsExamen(models.Model):
    TYPES = [
        ('partiel', 'Partiel / CC'),
        ('examen', 'Examen Final'),
    ]
    matiere = models.ForeignKey(Matiere, on_delete=models.CASCADE, related_name='examens')
    semestre = models.ForeignKey(Semestre, on_delete=models.CASCADE, related_name='examens')
    type_examen = models.CharField(max_length=20, choices=TYPES, default='examen')
    date = models.DateField()
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()
    salle = models.CharField(max_length=50)
    observations = models.TextField(blank=True)

    class Meta:
        ordering = ['date', 'heure_debut']

    def __str__(self):
        return f"{self.matiere} — {self.type_examen} — {self.date}"
