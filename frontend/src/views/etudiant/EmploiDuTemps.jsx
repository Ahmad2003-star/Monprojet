import { useState, useEffect } from 'react'
import { getEmploiDuTemps } from '../../services/noteService'
import { Clock, MapPin } from 'lucide-react'

const JOURS = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam']
const LABELS = { lun: 'Lundi', mar: 'Mardi', mer: 'Mercredi', jeu: 'Jeudi', ven: 'Vendredi', sam: 'Samedi' }
const COLORS = ['#0b3d91', '#7c3aed', '#0891b2', '#16a34a', '#d97706', '#dc2626']

export default function EmploiDuTemps() {
  const [emploi, setEmploi] = useState([])

  useEffect(() => {
    getEmploiDuTemps().then(({ data }) => setEmploi(data))
  }, [])

  const totalCours = emploi.length

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0b3d91', margin: '0 0 4px' }}>Emploi du temps</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>{totalCours} cours programmés cette semaine</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {JOURS.map((jour, idx) => {
          const cours = emploi.filter(e => e.jour === jour)
          return (
            <div key={jour} style={{ backgroundColor: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div style={{ backgroundColor: COLORS[idx], padding: '12px 16px' }}>
                <h3 style={{ margin: 0, color: 'white', fontSize: 15, fontWeight: 'bold' }}>{LABELS[jour]}</h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{cours.length} cours</p>
              </div>
              <div style={{ padding: 12 }}>
                {cours.length === 0 ? (
                  <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>Pas de cours</p>
                ) : cours.map(c => (
                  <div key={c.id} style={{ padding: '10px 12px', borderRadius: 8, backgroundColor: '#f9fafb', marginBottom: 8, borderLeft: `3px solid ${COLORS[idx]}` }}>
                    <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 14, color: '#111827' }}>{c.matiere_nom}</p>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}>
                        <Clock size={12} /> {c.heure_debut} – {c.heure_fin}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}>
                        <MapPin size={12} /> {c.salle}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
