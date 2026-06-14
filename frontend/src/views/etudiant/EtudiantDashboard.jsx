import { useState, useEffect } from 'react'
import { BookOpen, Calendar, TrendingUp, Award, Download } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getNotes } from '../../services/noteService'

export default function EtudiantDashboard() {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])

  useEffect(() => {
    getNotes().then(({ data }) => setNotes(data))
  }, [])

  const notesAvecFinale = notes.filter(n => n.note_finale !== null)
  const moyenne = notesAvecFinale.length
    ? (notesAvecFinale.reduce((s, n) => s + parseFloat(n.note_finale), 0) / notesAvecFinale.length).toFixed(2)
    : null
  const admis = notes.filter(n => n.note_finale >= 10).length
  const ajournes = notes.filter(n => n.note_finale < 10 && n.note_finale !== null).length

  const telechargerReleve = () => {
  const token = localStorage.getItem('access_token')
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  const url = `${baseUrl}/academique/releve/${user.id}/`
  fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => res.blob())
    .then(blob => {
      const pdfUrl = window.URL.createObjectURL(blob)
      window.open(pdfUrl, '_blank')
    })
}

  const cards = [
    { label: 'Matières', value: notes.length, icon: BookOpen, color: '#0b3d91', bg: '#e8f0fe' },
    { label: 'Moyenne générale', value: moyenne ? `${moyenne}/20` : '—', icon: TrendingUp, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Matières admises', value: admis, icon: Award, color: '#7c3aed', bg: '#f3f0ff' },
    { label: 'Matières ajournées', value: ajournes, icon: Calendar, color: '#dc2626', bg: '#fef2f2' },
  ]

  const mention = () => {
    if (!moyenne) return null
    const m = parseFloat(moyenne)
    if (m >= 16) return { text: 'Très Bien', color: '#16a34a' }
    if (m >= 14) return { text: 'Bien', color: '#16a34a' }
    if (m >= 12) return { text: 'Assez Bien', color: '#0891b2' }
    if (m >= 10) return { text: 'Passable', color: '#d97706' }
    return { text: 'Insuffisant', color: '#dc2626' }
  }

  const m = mention()

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0b3d91', margin: '0 0 4px' }}>
          Mon Espace Étudiant
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
              <p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 'bold', color }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Mention */}
        {m && (
          <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <p style={{ margin: '0 0 8px', color: '#6b7280', fontSize: 14 }}>Mention actuelle</p>
            <p style={{ margin: 0, fontSize: 32, fontWeight: 'bold', color: m.color }}>{m.text}</p>
            <p style={{ margin: '4px 0 0', fontSize: 28, fontWeight: 'bold', color: '#0b3d91' }}>{moyenne} / 20</p>
          </div>
        )}

        {/* Relevé PDF */}
        <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: 14, textAlign: 'center' }}>Téléchargez votre relevé de notes officiel</p>
          <button
            onClick={telechargerReleve}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', backgroundColor: '#0b3d91', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15, fontWeight: 'bold' }}
          >
            <Download size={18} /> Relevé PDF
          </button>
        </div>
      </div>

      {/* Dernières notes */}
      <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h3 style={{ color: '#0b3d91', margin: '0 0 16px', fontSize: 16 }}>📋 Mes dernières notes</h3>
        {notes.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>Aucune note disponible pour l'instant.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                {['Matière', 'CC', 'Examen', 'Moyenne', 'Statut'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notes.slice(0, 5).map(n => (
                <tr key={n.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 500 }}>{n.matiere_nom}</td>
                  <td style={{ padding: '10px 12px', color: '#6b7280' }}>{n.note_cc ?? '—'}</td>
                  <td style={{ padding: '10px 12px', color: '#6b7280' }}>{n.note_examen ?? '—'}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 'bold', color: '#0b3d91' }}>{n.note_finale ?? '—'}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      backgroundColor: n.note_finale >= 10 ? '#f0fdf4' : '#fef2f2',
                      color: n.note_finale >= 10 ? '#16a34a' : '#dc2626',
                    }}>
                      {n.note_finale >= 10 ? 'Admis' : 'Ajourné'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {notes.length > 5 && (
          <a href="/etudiant/notes" style={{ display: 'block', marginTop: 12, textAlign: 'center', color: '#0b3d91', fontSize: 14, textDecoration: 'none', fontWeight: 'bold' }}>
            Voir toutes mes notes →
          </a>
        )}
      </div>
    </div>
  )
}
