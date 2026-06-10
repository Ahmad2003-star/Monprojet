import { useState, useEffect } from 'react'
import { Users, BookOpen, CheckSquare, TrendingUp, GraduationCap, Activity } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { getNotes, getMatieres } from '../../services/noteService'


export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    api.get('/academique/stats/')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Étudiants inscrits', value: stats?.total_etudiants ?? 0, icon: GraduationCap, color: '#0b3d91', bg: '#e8f0fe' },
    { label: 'Enseignants', value: stats?.total_enseignants ?? 0, icon: Users, color: '#7c3aed', bg: '#f3f0ff' },
    { label: 'Notes saisies', value: stats?.total_notes ?? 0, icon: BookOpen, color: '#0891b2', bg: '#e0f7fa' },
    { label: 'Relevés validés', value: stats?.notes_validees ?? 0, icon: CheckSquare, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Taux de réussite', value: `${stats?.taux_reussite ?? 0}%`, icon: TrendingUp, color: '#d97706', bg: '#fffbeb' },
  ]

  return (
    <div>
      {/* En-tête */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0b3d91', margin: '0 0 4px' }}>
          Tableau de bord
        </h2>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Bienvenue, <strong>{user?.first_name || user?.matricule}</strong> — Vue d'ensemble de la plateforme
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>
          <Activity size={32} style={{ marginBottom: 12 }} />
          <p>Chargement des statistiques…</p>
        </div>
      ) : (
        <>
          {/* Cartes statistiques */}
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

          {/* Barre de progression taux de réussite */}
          <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 24 }}>
            <h3 style={{ color: '#0b3d91', margin: '0 0 16px', fontSize: 16 }}>📊 Taux de réussite global</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1, backgroundColor: '#f3f4f6', borderRadius: 20, height: 16, overflow: 'hidden' }}>
                <div style={{
                  width: `${stats?.taux_reussite ?? 0}%`,
                  height: '100%',
                  backgroundColor: stats?.taux_reussite >= 50 ? '#16a34a' : '#dc2626',
                  borderRadius: 20,
                  transition: 'width 1s ease',
                }} />
              </div>
              <span style={{ fontWeight: 'bold', fontSize: 18, color: stats?.taux_reussite >= 50 ? '#16a34a' : '#dc2626', minWidth: 50 }}>
                {stats?.taux_reussite ?? 0}%
              </span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: '#9ca3af' }}>
              {stats?.total_notes} notes enregistrées · {stats?.notes_validees} relevés validés
            </p>
          </div>

          {/* Actions rapides */}
          <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h3 style={{ color: '#0b3d91', margin: '0 0 16px', fontSize: 16 }}>⚡ Actions rapides</h3>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[
                    { label: '➕ Ajouter un utilisateur', path: '/admin/utilisateurs', color: '#0b3d91' },
                    { label: '📝 Saisir des notes', path: '/admin/notes', color: '#0891b2' },
                    { label: '✅ Valider les relevés', path: '/admin/releves', color: '#16a34a' },
                  ].map(({ label, path, color }) => (
                    <a
                      key={path}
                      href={path}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: color,
                        color: 'white',
                        borderRadius: 8,
                        textDecoration: 'none',
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}
                    >
                      {label}
                    </a>
                  ))}

                  <button
                    onClick={() => window.open('http://127.0.0.1:8000/admin/', '_blank')}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}
                  >
                    ⚙️ Modifier les données
                  </button>
                </div>
          </div>
        </>
      )}
    </div>
  )
}
