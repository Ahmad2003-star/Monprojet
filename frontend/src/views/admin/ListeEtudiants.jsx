import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Users, GraduationCap, TrendingUp, Award } from 'lucide-react'

export default function ListeEtudiants() {
  const [etudiants, setEtudiants] = useState([])
  const [niveaux, setNiveaux] = useState([])
  const [options, setOptions] = useState([])
  const [notes, setNotes] = useState([])
  const [filtreNiveau, setFiltreNiveau] = useState('')
  const [filtreOption, setFiltreOption] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chargerDonnees()
  }, [])

  const chargerDonnees = async () => {
    const [etudiantsRes, niveauxRes, optionsRes, notesRes] = await Promise.all([
      api.get('/auth/etudiants/'),
      api.get('/academique/niveaux/'),
      api.get('/academique/options/'),
      api.get('/academique/notes/'),
    ])
    setEtudiants(etudiantsRes.data)
    setNiveaux(niveauxRes.data)
    setOptions(optionsRes.data)
    setNotes(notesRes.data)
    setLoading(false)
  }

  // Calculer les stats d'un étudiant
  const getStatsEtudiant = (etudiantId) => {
    const notesEtudiant = notes.filter(n => n.etudiant === etudiantId && n.note_finale !== null)
    if (notesEtudiant.length === 0) return { moyenne: null, credits: 0, admis: 0 }

    const totalPoids = notesEtudiant.reduce((s, n) => s + (n.credits || 1), 0)
    const totalPoints = notesEtudiant.reduce((s, n) => s + parseFloat(n.note_finale) * (n.credits || 1), 0)
    const moyenne = totalPoids > 0 ? (totalPoints / totalPoids).toFixed(2) : null
    const credits = notesEtudiant.filter(n => parseFloat(n.note_finale) >= 10).reduce((s, n) => s + (n.credits || 0), 0)
    const admis = notesEtudiant.filter(n => parseFloat(n.note_finale) >= 10).length

    return { moyenne, credits, admis }
  }

  // Filtrer les étudiants
  const etudiantsFiltres = etudiants.filter(e => {
    if (filtreNiveau && e.niveau !== parseInt(filtreNiveau)) return false
    if (filtreOption && e.option !== parseInt(filtreOption)) return false
    return true
  })

  // Grouper par niveau
  const etudiantsGroupes = {}
  etudiantsFiltres.forEach(e => {
    const key = e.niveau_nom || 'Non assigné'
    const subKey = e.option_nom || ''
    const groupKey = subKey ? `${key} — ${subKey}` : key
    if (!etudiantsGroupes[groupKey]) etudiantsGroupes[groupKey] = []
    etudiantsGroupes[groupKey].push(e)
  })

  // Options filtrées selon le niveau sélectionné
  const optionsFiltrees = filtreNiveau
    ? options.filter(o => o.niveau === parseInt(filtreNiveau))
    : options

  const getMention = (moyenne) => {
    if (!moyenne) return null
    const m = parseFloat(moyenne)
    if (m >= 16) return { text: 'Très Bien', color: '#16a34a' }
    if (m >= 14) return { text: 'Bien', color: '#16a34a' }
    if (m >= 12) return { text: 'Assez Bien', color: '#0891b2' }
    if (m >= 10) return { text: 'Passable', color: '#d97706' }
    return { text: 'Insuffisant', color: '#dc2626' }
  }

  const colors = ['#0b3d91', '#7c3aed', '#0891b2', '#16a34a', '#d97706', '#dc2626']

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0b3d91', margin: '0 0 4px' }}>
          Liste des étudiants par classe
        </h2>
        <p style={{ color: '#6b7280', margin: 0 }}>{etudiants.length} étudiant(s) inscrit(s)</p>
      </div>

      {/* Cartes statistiques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total étudiants', value: etudiants.length, icon: Users, color: '#0b3d91', bg: '#e8f0fe' },
          { label: 'Niveaux actifs', value: niveaux.length, icon: GraduationCap, color: '#7c3aed', bg: '#f3f0ff' },
          { label: 'MI', value: etudiants.filter(e => e.niveau_nom?.startsWith('MI')).length, icon: TrendingUp, color: '#16a34a', bg: '#f0fdf4' },
          { label: 'PC', value: etudiants.filter(e => e.niveau_nom?.startsWith('PC')).length, icon: Award, color: '#d97706', bg: '#fffbeb' },
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

      {/* Filtres */}
      <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>Niveau</label>
          <select value={filtreNiveau} onChange={e => { setFiltreNiveau(e.target.value); setFiltreOption('') }} style={{ padding: '8px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none' }}>
            <option value="">Tous les niveaux</option>
            {niveaux.map(n => <option key={n.id} value={n.id}>{n.filiere_nom} — {n.code}</option>)}
          </select>
        </div>
        {optionsFiltrees.length > 0 && (
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>Option</label>
            <select value={filtreOption} onChange={e => setFiltreOption(e.target.value)} style={{ padding: '8px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none' }}>
              <option value="">Toutes les options</option>
              {optionsFiltrees.map(o => <option key={o.id} value={o.id}>{o.nom}</option>)}
            </select>
          </div>
        )}
        {(filtreNiveau || filtreOption) && (
          <button onClick={() => { setFiltreNiveau(''); setFiltreOption('') }} style={{ padding: '8px 16px', backgroundColor: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, marginTop: 20 }}>
            ✕ Réinitialiser
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>Chargement...</p>
      ) : Object.keys(etudiantsGroupes).length === 0 ? (
        <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 40, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <Users size={40} color="#e5e7eb" style={{ marginBottom: 12 }} />
          <p style={{ color: '#9ca3af' }}>Aucun étudiant trouvé</p>
        </div>
      ) : (
        Object.entries(etudiantsGroupes).map(([groupe, etudiantsDuGroupe], idx) => (
          <div key={groupe} style={{ backgroundColor: 'white', borderRadius: 12, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            {/* En-tête groupe */}
            <div style={{ padding: '14px 20px', backgroundColor: colors[idx % colors.length], display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <GraduationCap size={20} color="white" />
                <h3 style={{ margin: 0, color: 'white', fontSize: 15, fontWeight: 'bold' }}>{groupe}</h3>
              </div>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                {etudiantsDuGroupe.length} étudiant(s)
              </span>
            </div>

            {/* Tableau */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  {['#', 'Étudiant', 'Matricule', 'Moyenne', 'Crédits', 'Mention', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {etudiantsDuGroupe.map((etudiant, i) => {
                  const stats = getStatsEtudiant(etudiant.id)
                  const mention = getMention(stats.moyenne)
                  const niveauInfo = niveaux.find(n => n.id === etudiant.niveau)
                  const seuilValidation = niveauInfo?.credits_requis_passage || 48

                  return (
                    <tr key={etudiant.id} style={{ borderTop: '1px solid #f3f4f6', backgroundColor: i % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '12px 16px', color: '#9ca3af', fontWeight: 600 }}>{i + 1}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: colors[idx % colors.length], color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 13, flexShrink: 0 }}>
                            {`${etudiant.first_name?.[0] || ''}${etudiant.last_name?.[0] || ''}`.toUpperCase()}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#111827' }}>{etudiant.first_name} {etudiant.last_name}</p>
                            <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>{etudiant.username}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#6b7280' }}>{etudiant.matricule || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: 16, color: stats.moyenne && parseFloat(stats.moyenne) >= 10 ? '#16a34a' : '#dc2626' }}>
                          {stats.moyenne ? `${stats.moyenne}/20` : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div>
                          <span style={{ fontWeight: 'bold', color: stats.credits >= seuilValidation ? '#16a34a' : '#dc2626' }}>
                            {stats.credits}/60
                          </span>
                          <div style={{ marginTop: 4, width: 80, height: 4, backgroundColor: '#e5e7eb', borderRadius: 4 }}>
                            <div style={{ width: `${Math.min((stats.credits / 60) * 100, 100)}%`, height: '100%', backgroundColor: stats.credits >= seuilValidation ? '#16a34a' : '#dc2626', borderRadius: 4 }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {mention ? (
                          <span style={{ fontSize: 13, fontWeight: 600, color: mention.color }}>{mention.text}</span>
                        ) : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, backgroundColor: stats.credits >= seuilValidation ? '#f0fdf4' : '#fef2f2', color: stats.credits >= seuilValidation ? '#16a34a' : '#dc2626' }}>
                          {stats.credits >= seuilValidation ? '✓ Validé' : '✗ En cours'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  )
}