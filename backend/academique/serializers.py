from rest_framework import serializers
from .models import Note, Matiere, EmploiDuTemps, Semestre, Filiere, Niveau, Option, EmploiDuTempsExamen

class FiliereSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filiere
        fields = '__all__'

class NiveauSerializer(serializers.ModelSerializer):
    filiere_nom = serializers.CharField(source='filiere.nom', read_only=True)

    class Meta:
        model = Niveau
        fields = '__all__'

class OptionSerializer(serializers.ModelSerializer):
    niveau_nom = serializers.CharField(source='niveau.__str__', read_only=True)

    class Meta:
        model = Option
        fields = '__all__'

class SemestreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semestre
        fields = '__all__'

class MatiereSerializer(serializers.ModelSerializer):
    niveau_nom = serializers.CharField(source='niveau.__str__', read_only=True)
    option_nom = serializers.CharField(source='option.nom', read_only=True)

    class Meta:
        model = Matiere
        fields = ['id', 'code', 'nom', 'coefficient', 'credits', 'avec_cc', 'enseignant', 'niveau', 'niveau_nom', 'option', 'option_nom']

class NoteSerializer(serializers.ModelSerializer):
    matiere_nom = serializers.CharField(source='matiere.nom', read_only=True)
    etudiant_nom = serializers.CharField(source='etudiant.get_full_name', read_only=True)
    credits = serializers.IntegerField(source='matiere.credits', read_only=True)

    class Meta:
        model = Note
        fields = [
            'id', 'etudiant', 'etudiant_nom', 'matiere', 'matiere_nom',
            'semestre', 'note_cc', 'note_examen', 'note_finale', 'valide', 'credits'
        ]
        read_only_fields = ['note_finale']

    def validate(self, data):
        matiere = data.get('matiere')
        note_cc = data.get('note_cc')
        if matiere and matiere.avec_cc and note_cc is None:
            raise serializers.ValidationError({'note_cc': 'Cette matière requiert une note CC.'})
        return data

class EmploiDuTempsSerializer(serializers.ModelSerializer):
    matiere_nom = serializers.CharField(source='matiere.nom', read_only=True)

    class Meta:
        model = EmploiDuTemps
        fields = '__all__'

class EmploiDuTempsExamenSerializer(serializers.ModelSerializer):
    matiere_nom = serializers.CharField(source='matiere.nom', read_only=True)
    semestre_nom = serializers.CharField(source='semestre.nom', read_only=True)

    class Meta:
        model = EmploiDuTempsExamen
        fields = '__all__'