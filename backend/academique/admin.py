from django.contrib import admin
from .models import Semestre, Matiere, Note, EmploiDuTemps, EmploiDuTempsExamen, Filiere, Niveau, Option

@admin.register(Filiere)
class FiliereAdmin(admin.ModelAdmin):
    list_display = ['code', 'nom']
    fields = ['code', 'nom']

@admin.register(Niveau)
class NiveauAdmin(admin.ModelAdmin):
    list_display = ['filiere', 'code', 'credits_requis', 'credits_requis_passage']
    list_filter = ['filiere']

@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ['niveau', 'code', 'nom']
    list_filter = ['niveau']

@admin.register(Matiere)
class MatiereAdmin(admin.ModelAdmin):
    list_display = ['code', 'nom', 'niveau', 'option', 'credits', 'coefficient', 'avec_cc', 'enseignant']
    list_filter = ['niveau', 'option']
    list_editable = ['avec_cc']

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['etudiant', 'matiere', 'semestre', 'note_cc', 'note_examen', 'note_finale', 'valide']
    readonly_fields = ['note_finale']

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if obj and obj.matiere and not obj.matiere.avec_cc:
            form.base_fields['note_cc'].required = False
            form.base_fields['note_cc'].disabled = True
        return form

    def save_model(self, request, obj, form, change):
        if obj.matiere and not obj.matiere.avec_cc:
            obj.note_cc = None
        super().save_model(request, obj, form, change)

admin.site.register(Semestre)
admin.site.register(EmploiDuTemps)

@admin.register(EmploiDuTempsExamen)
class EmploiDuTempsExamenAdmin(admin.ModelAdmin):
    list_display = ['matiere', 'type_examen', 'date', 'heure_debut', 'heure_fin', 'salle', 'semestre']
    list_filter = ['type_examen', 'semestre', 'date']
    ordering = ['date', 'heure_debut']