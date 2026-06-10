import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Calendar, Clock, MapPin, BookOpen } from 'lucide-react'

const typeColors = {
  partiel: { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  examen: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
}

const typeLabels = {
  partiel: 'Partiel / CC',
  examen: 'Examen Final',
}

export default function CalendrierExamens() {
  const [examens, setExamens] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState('tous')

  useEffect(() => {
    api.get('/academique/examens/')
      .then(({ data }) => setExamens(data))
      .finally(() => setLoading(false))
  }, [])

  const examensFiltrés = filtre === 'tous' ? examens : examens.filter(e => e.type_examen === filtre)

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  const isUpcoming = (dateStr) => new Date(dateStr) >= new Date()

  const prochains = examens.filter(e => isUpcoming(e.date)).length

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0b3d91', margin: '0 0 4px' }}>Calendrier des examens</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>{prochains} examen(s) à venir</p>
      </div>

      {/* Résumé */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total examens', value: examens.length, icon: BookOpen, color: '#0b3d91', bg: '#e8f0fe' },
          { label: 'À venir', value: prochains, icon: Calendar, color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Partiels', value: examens.filter(e => e.type_examen === 'partiel').length, icon: Clock, color: '#ea580c', bg: '#fff7ed' },
          { label: 'Examens finaux', value: examens.filter(e => e.type_examen === 'examen').length, icon: MapPin, color: '#dc2626', bg: '#fef2f2' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{ backgroundColor: 'white', borderRadius: 10, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 12, borderLeft: `4px solid ${color}` }}>
            <div style={{ backgroundColor: bg, borderRadius: 8, padding: 10 }}><Icon size={20} color={color} /></div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: '#6b7280', textTransform: 'uppercase' }}>{label}</p>
              <p style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 'bold', color }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { key: 'tous', label: 'Tous' },
          { key: 'partiel', label: 'Partiels' },
          { key: 'examen', label: 'Examens finaux' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltre(key)}
            style={{ padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', backgroundColor: filtre === key ? '#0b3d91' : '#f3f4f6', color: filtre === key ? 'white' : '#6b7280' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Liste des examens */}
      {loading ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>Chargement…</p>
      ) : examensFiltrés.length === 0 ? (
        <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 40, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <Calendar size={40} color="#e5e7eb" style={{ marginBottom: 12 }} />
          <p style={{ color: '#9ca3af' }}>Aucun examen programmé</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {examensFiltrés.map(examen => {
            const colors = typeColors[examen.type_examen]
            const upcoming = isUpcoming(examen.date)
            return (
              <div key={examen.id} style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 20, borderLeft: `4px solid ${colors.color}`, opacity: upcoming ? 1 : 0.6 }}>

                {/* Date */}
                <div style={{ textAlign: 'center', minWidth: 60, backgroundColor: colors.bg, borderRadius: 10, padding: '10px 8px' }}>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 'bold', color: colors.color }}>
                    {new Date(examen.date).getDate()}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: colors.color, textTransform: 'uppercase' }}>
                    {new Date(examen.date).toLocaleDateString('fr-FR', { month: 'short' })}
                  </p>
                </div>

                {/* Infos */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 'bold', color: '#111827' }}>{examen.matiere_nom}</h3>
                    <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: colors.bg, color: colors.color, border: `1px solid ${colors.border}` }}>
                      {typeLabels[examen.type_examen]}
                    </span>
                    {!upcoming && <span style={{ fontSize: 11, color: '#9ca3af' }}>Passé</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
                    📅 {formatDate(examen.date)}
                  </p>
                  {examen.observations && (
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>{examen.observations}</p>
                  )}
                </div>

                {/* Heure & Salle */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <Clock size={14} /> {examen.heure_debut} – {examen.heure_fin}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <MapPin size={13} /> {examen.salle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
