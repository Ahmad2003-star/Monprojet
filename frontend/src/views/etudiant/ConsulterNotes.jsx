import { useState, useEffect } from 'react'
import { getNotes } from '../../services/noteService'
import { useAuth } from '../../context/AuthContext'
import { Download, TrendingUp, Award, AlertCircle } from 'lucide-react'

export default function ConsulterNotes() {
  const [notes, setNotes] = useState([])
  const { user } = useAuth()

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
    const url = `http://localhost:8000/api/academique/releve/${user.id}/`
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.blob())
      .then(blob => {
        const pdfUrl = window.URL.createObjectURL(blob)
        window.open(pdfUrl, '_blank')
      })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0b3d91', margin: '0 0 4px' }}>Mes Notes</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>Résultats académiques du semestre en cours</p>
        </div>
        <button
          onClick={telechargerReleve}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', backgroundColor: '#0b3d91', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 'bold' }}
        >
          <Download size={18} /> Télécharger relevé PDF
        </button>
      </div>

      {/* Résumé */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Moyenne générale', value: moyenne ? `${moyenne}/20` : '—', icon: TrendingUp, color: '#0b3d91', bg: '#e8f0fe' },
          { label: 'Matières admises', value: admis, icon: Award, color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Matières ajournées', value: ajournes, icon: AlertCircle, color: '#dc2626', bg: '#fef2f2' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{ backgroundColor: 'white', borderRadius: 10, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 12, borderLeft: `4px solid ${color}` }}>
            <div style={{ backgroundColor: bg, borderRadius: 8, padding: 10 }}><Icon size={20} color={color} /></div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: '#6b7280', textTransform: 'uppercase' }}>{label}</p>
              <p style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 'bold', color }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tableau des notes */}
      <div style={{ backgroundColor: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ margin: 0, color: '#0b3d91', fontSize: 16 }}>📋 Détail des notes</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ backgroundColor: '#0b3d91' }}>
              {['Matière', 'CC (40%)', 'Examen (60%)', 'Moyenne', 'Statut'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'white', fontWeight: 600, fontSize: 13 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {notes.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Aucune note disponible</td></tr>
            ) : notes.map((n, i) => (
              <tr key={n.id} style={{ borderTop: '1px solid #f3f4f6', backgroundColor: i % 2 === 0 ? 'white' : '#fafafa' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{n.matiere_nom}</td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{n.note_cc ?? '—'}</td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{n.note_examen ?? '—'}</td>
                <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#0b3d91', fontSize: 15 }}>{n.note_finale ?? '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, backgroundColor: n.note_finale >= 10 ? '#f0fdf4' : '#fef2f2', color: n.note_finale >= 10 ? '#16a34a' : '#dc2626' }}>
                    {n.note_finale >= 10 ? '✓ Admis' : '✗ Ajourné'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
