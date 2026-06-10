from rest_framework import serializers
from .models import Utilisateur

class UtilisateurSerializer(serializers.ModelSerializer):
    niveau_nom = serializers.CharField(source='niveau.__str__', read_only=True)
    option_nom = serializers.CharField(source='option.nom', read_only=True)

    class Meta:
        model = Utilisateur
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'telephone', 'matricule', 'is_registered',
            'niveau', 'niveau_nom', 'option', 'option_nom'
        ]
        read_only_fields = ['id']

class UtilisateurCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, required=False)

    class Meta:
        model = Utilisateur
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'role', 'password', 'matricule', 'niveau', 'option'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = Utilisateur(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user