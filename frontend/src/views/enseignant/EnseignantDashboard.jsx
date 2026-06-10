import { useState, useEffect } from 'react'
import { BookOpen, Calendar, Users, TrendingUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getNotes, getMatieres } from '../../services/noteService'
export default function EnseignantDashboard() {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [matieres, setMatieres] = useState([])

  useEffect(() => {
    getNotes().then(({ data }) => setNotes(data))
    getMatieres().then(({ data }) => setMatieres(data))
  }, [])

  const mesMatieres = matieres.filter(m => m.enseignant === user?.id)
  const totalNotes = notes.length
  const admis = notes.filter(n => n.note_finale >= 10).length
  const taux = totalNotes > 0 ? Math.round((admis / totalNotes) * 100) : 0

  const cards = [
    { label: 'Mes matières', value: mesMatieres.length, icon: BookOpen, color: '#0b3d91', bg: '#e8f0fe' },
    { label: 'Notes saisies', value: totalNotes, icon: TrendingUp, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Étudiants admis', value: admis, icon: Users, color: '#7c3aed', bg: '#f3f0ff' },
    { label: 'Taux de réussite', value: `${taux}%`, icon: Calendar, color: '#d97706', bg: '#fffbeb' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0b3d91', margin: '0 0 4px' }}>
          Espace Enseignant
        </h2>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Bienvenue, <strong>{user?.first_name} {user?.last_name}</strong>
        </p>
      </div>

      {/* Cartes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{
            backgroundColor: 'white', borderRadius: 12, padding: 20,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderLeft: `4px solid ${color}`,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{ backgroundColor: bg, borderRadius: 10, padding: 12 }}>
              <Icon size={24} color={color} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</p>
              <p style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 'bold', color }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mes matières */}
      <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 24 }}>
        <h3 style={{ color: '#0b3d91', margin: '0 0 16px', fontSize: 16 }}>📚 Mes matières</h3>
        {mesMatieres.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>Aucune matière assignée pour l'instant.</p>
        ) : (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {mesMatieres.map(m => (
              <div key={m.id} style={{ backgroundColor: '#e8f0fe', borderRadius: 8, padding: '10px 16px', borderLeft: '3px solid #0b3d91' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#0b3d91' }}>{m.nom}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>
                  {m.code} · Coeff. {m.coefficient} · {m.avec_cc ? 'CC + Examen' : 'Examen seul'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h3 style={{ color: '#0b3d91', margin: '0 0 16px', fontSize: 16 }}>⚡ Actions rapides</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/enseignant/notes" style={{ padding: '10px 20px', backgroundColor: '#0b3d91', color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 'bold' }}>
            📝 Saisir des notes
          </a>
          <a href="/enseignant/emploi" style={{ padding: '10px 20px', backgroundColor: '#16a34a', color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 'bold' }}>
            📅 Mon emploi du temps
          </a>
        </div>
      </div>
    </div>
  )
}
