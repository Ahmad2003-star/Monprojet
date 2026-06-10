import { useState, useEffect } from 'react'
import api from '../../services/api'
import { CheckCircle, ChevronDown, ChevronUp, Award, AlertCircle } from 'lucide-react'

export default function ValiderReleves() {
  const [etudiants, setEtudiants] = useState([])
  const [notes, setNotes] = useState([])
  const [semestres, setSemestres] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => { chargerDonnees() }, [])

  const chargerDonnees = async () => {
    const [etudiantsRes, notesRes, semestresRes] = await Promise.all([
      api.get('/auth/etudiants/'),
      api.get('/academique/notes/'),
      api.get('/academique/semestres/'),
    ])
    setEtudiants(etudiantsRes.data)
    setNotes(notesRes.data)
    setSemestres(semestresRes.data)
  }

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const getNotesEtudiant = (id) => notes.filter(n => n.etudiant === id)
  const getMoyenne = (id) => {
    const n = getNotesEtudiant(id).filter(n => n.note_finale !== null)
    if (!n.length) return null
    return (n.reduce((s, x) => s + parseFloat(x.note_finale), 0) / n.length).toFixed(2)
  }
  const toutesValidees = (id) => {
    const n = getNotesEtudiant(id)
    return n.length > 0 && n.every(x => x.valide)
  }

  const handleValider = async (id) => {
    try {
      const n = getNotesEtudiant(id).filter(x => !x.valide)
      await Promise.all(n.map(x => api.patch(`/academique/notes/${x.id}/`, { valide: true })))
      showMessage('Relevé validé avec succès !')
      await chargerDonnees()
    } catch {
      showMessage('Erreur lors de la validation.', 'error')
    }
  }

  const getSemestre = (id) => semestres.find(s => s.id === id)?.nom || '—'

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0b3d91', margin: '0 0 4px' }}>Validation des relevés</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>{etudiants.length} étudiants · {notes.filter(n => n.valide).length} relevés validés</p>
      </div>

      {message.text && (
        <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 8, backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4', color: message.type === 'error' ? '#dc2626' : '#16a34a', fontSize: 14 }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {etudiants.map(etudiant => {
          const notesEtudiant = getNotesEtudiant(etudiant.id)
          const moyenne = getMoyenne(etudiant.id)
          const valide = toutesValidees(etudiant.id)
          const isExpanded = expanded === etudiant.id
          const initials = `${etudiant.first_name?.[0] || ''}${etudiant.last_name?.[0] || ''}`.toUpperCase()

          return (
            <div key={etudiant.id} style={{ backgroundColor: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer' }}
                onClick={() => setExpanded(isExpanded ? null : etudiant.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#0b3d91', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16 }}>
                    {initials}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: '#111827' }}>{etudiant.first_name} {etudiant.last_name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>{etudiant.username} · {notesEtudiant.length} note(s)</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {moyenne && (
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>Moyenne</p>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: 18, color: parseFloat(moyenne) >= 10 ? '#16a34a' : '#dc2626' }}>
                        {moyenne}/20
                      </p>
                    </div>
                  )}
                  {valide ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                      <CheckCircle size={16} /> Validé
                    </span>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleValider(etudiant.id) }}
                      disabled={notesEtudiant.length === 0}
                      style={{ padding: '6px 16px', backgroundColor: '#0b3d91', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Valider
                    </button>
                  )}
                  {isExpanded ? <ChevronUp size={18} color="#9ca3af" /> : <ChevronDown size={18} color="#9ca3af" />}
                </div>
              </div>

              {isExpanded && (
                <div style={{ borderTop: '1px solid #f3f4f6' }}>
                  {notesEtudiant.length === 0 ? (
                    <p style={{ padding: '16px 20px', color: '#9ca3af', fontSize: 14 }}>Aucune note enregistrée.</p>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f9fafb' }}>
                          {['Matière', 'Semestre', 'CC', 'Examen', 'Moyenne', 'Statut'].map(h => (
                            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: 12 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {notesEtudiant.map(n => (
                          <tr key={n.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '10px 16px', fontWeight: 500 }}>{n.matiere_nom}</td>
                            <td style={{ padding: '10px 16px', color: '#6b7280' }}>{getSemestre(n.semestre)}</td>
                            <td style={{ padding: '10px 16px' }}>{n.note_cc ?? '—'}</td>
                            <td style={{ padding: '10px 16px' }}>{n.note_examen ?? '—'}</td>
                            <td style={{ padding: '10px 16px', fontWeight: 'bold' }}>{n.note_finale ?? '—'}</td>
                            <td style={{ padding: '10px 16px' }}>
                              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: n.note_finale >= 10 ? '#f0fdf4' : '#fef2f2', color: n.note_finale >= 10 ? '#16a34a' : '#dc2626' }}>
                                {n.note_finale >= 10 ? 'Admis' : 'Ajourné'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
