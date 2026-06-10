from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from rest_framework import viewsets, permissions
from .models import Note, Matiere, EmploiDuTemps, Semestre
from .serializers import NoteSerializer, MatiereSerializer, EmploiDuTempsSerializer, SemestreSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from authentification.models import Utilisateur
from .models import Note
from .models import EmploiDuTempsExamen
from .serializers import EmploiDuTempsExamenSerializer
from .models import Filiere, Niveau, Option
from .serializers import FiliereSerializer, NiveauSerializer, OptionSerializer

class FiliereViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Filiere.objects.all()
    serializer_class = FiliereSerializer
    permission_classes = [permissions.IsAuthenticated]

class NiveauViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Niveau.objects.all()
    serializer_class = NiveauSerializer
    permission_classes = [permissions.IsAuthenticated]

class OptionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer
    permission_classes = [permissions.IsAuthenticated]

class EmploiDuTempsExamenViewSet(viewsets.ModelViewSet):
    queryset = EmploiDuTempsExamen.objects.all()
    serializer_class = EmploiDuTempsExamenSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]
@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def stats_dashboard(request):
    total_etudiants = Utilisateur.objects.filter(role='etudiant').count()
    total_enseignants = Utilisateur.objects.filter(role='enseignant').count()
    total_notes = Note.objects.count()
    notes_validees = Note.objects.filter(valide=True).count()
    admis = Note.objects.filter(note_finale__gte=10).count()
    ajournes = Note.objects.filter(note_finale__lt=10).count()
    taux = round((admis / total_notes * 100), 1) if total_notes > 0 else 0

    return Response({
        'total_etudiants': total_etudiants,
        'total_enseignants': total_enseignants,
        'total_notes': total_notes,
        'notes_validees': notes_validees,
        'taux_reussite': taux,
    })
class IsEnseignantOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ('enseignant', 'admin')

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'etudiant':
            return Note.objects.filter(etudiant=user)
        return Note.objects.all()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEnseignantOrAdmin()]
        return [permissions.IsAuthenticated()]

class MatiereViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Matiere.objects.all()
    serializer_class = MatiereSerializer
    permission_classes = [permissions.IsAuthenticated]

class EmploiDuTempsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EmploiDuTemps.objects.all()
    serializer_class = EmploiDuTempsSerializer
    permission_classes = [permissions.IsAuthenticated]

class SemestreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Semestre.objects.all()
    serializer_class = SemestreSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def generer_releve_pdf(request, etudiant_id):
    user = request.user
    if user.role == 'etudiant' and user.id != etudiant_id:
        return Response({'error': 'Accès refusé.'}, status=403)

    try:
        etudiant = Utilisateur.objects.get(id=etudiant_id, role='etudiant')
    except Utilisateur.DoesNotExist:
        return Response({'error': 'Étudiant non trouvé.'}, status=404)

    notes = Note.objects.filter(etudiant=etudiant).select_related('matiere', 'semestre')

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="releve_{etudiant.username}.pdf"'

    doc = SimpleDocTemplate(response, pagesize=A4, topMargin=2*cm, bottomMargin=2*cm)
    elements = []

    titre_style = ParagraphStyle('titre', fontSize=16, fontName='Helvetica-Bold', alignment=1, spaceAfter=0.3*cm)
    sous_titre_style = ParagraphStyle('sous_titre', fontSize=12, fontName='Helvetica', alignment=1, spaceAfter=0.5*cm)
    normal = ParagraphStyle('normal', fontSize=10, fontName='Helvetica', spaceAfter=0.2*cm)

    elements.append(Paragraph("UNIVERSITÉ NATIONALE DES SCIENCES, TECHNOLOGIES", titre_style))
    elements.append(Paragraph("INGÉNIERIE ET MATHÉMATIQUES — UNSTIM", titre_style))
    elements.append(Paragraph("Faculté des Sciences et Techniques — FAST", sous_titre_style))
    elements.append(Spacer(1, 0.5*cm))
    elements.append(Paragraph("RELEVÉ DE NOTES OFFICIEL", ParagraphStyle('rel', fontSize=14, fontName='Helvetica-Bold', alignment=1, spaceAfter=0.5*cm, textColor=colors.HexColor('#1e3a5f'))))
    elements.append(Spacer(1, 0.3*cm))
    elements.append(Paragraph(f"<b>Nom :</b> {etudiant.last_name.upper()} {etudiant.first_name}", normal))
    elements.append(Paragraph(f"<b>Matricule :</b> {etudiant.username}", normal))
    elements.append(Paragraph(f"<b>Email :</b> {etudiant.email}", normal))
    elements.append(Spacer(1, 0.5*cm))

    semestres = {}
    for note in notes:
        sem = note.semestre.nom if note.semestre else 'Sans semestre'
        semestres.setdefault(sem, []).append(note)

    for sem_nom, sem_notes in semestres.items():
        elements.append(Paragraph(f"<b>{sem_nom}</b>", ParagraphStyle('sem', fontSize=11, fontName='Helvetica-Bold', spaceAfter=0.3*cm, textColor=colors.HexColor('#1e3a5f'))))
        data = [['Matière', 'Coeff.', 'CC (40%)', 'Examen (60%)', 'Moyenne', 'Statut']]
        total_coeff = 0
        total_points = 0

        for n in sem_notes:
            statut = 'Admis' if n.note_finale and n.note_finale >= 10 else 'Ajourné'
            coeff = n.matiere.coefficient
            data.append([
                n.matiere.nom, str(coeff),
                str(n.note_cc) if n.note_cc else '—',
                str(n.note_examen) if n.note_examen else '—',
                str(n.note_finale) if n.note_finale else '—',
                statut
            ])
            if n.note_finale:
                total_coeff += coeff
                total_points += float(n.note_finale) * coeff

        moy_gen = round(total_points / total_coeff, 2) if total_coeff > 0 else 0
        data.append(['', '', '', 'Moyenne générale', str(moy_gen), 'Admis' if moy_gen >= 10 else 'Ajourné'])

        table = Table(data, colWidths=[5.5*cm, 1.5*cm, 2.5*cm, 3*cm, 2.5*cm, 2*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e3a5f')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -2), 0.5, colors.grey),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#f0f4ff')),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('ROWBACKGROUNDS', (0, 1), (-1, -2), [colors.white, colors.HexColor('#f8f9fa')]),
        ]))
        elements.append(table)
        elements.append(Spacer(1, 0.5*cm))

    doc.build(elements)
    return response