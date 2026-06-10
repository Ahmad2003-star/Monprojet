import { useState, useEffect } from 'react'
import { getNotes, createNote, updateNote, getMatieres, getSemestres } from '../../services/noteService'
import api from '../../services/api'
import { PlusCircle, Save, X, Edit, BookOpen, Users, TrendingUp } from 'lucide-react'

export default function SaisieNotes() {
  const [notes, setNotes] = useState([])
  const [matieres, setMatieres] = useState([])
  const [matieresFiltrees, setMatieresFiltrees] = useState([])
  const [semestres, setSemestres] = useState([])
  const [etudiants, setEtudiants] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editNote, setEditNote] = useState(null)
  const [matiereSelectionnee, setMatiereSelectionnee] = useState(null)
  const [etudiantSelectionne, setEtudiantSelectionne] = useState(null)
  const [filtreNiveau, setFiltreNiveau] = useState('')
  const [niveaux, setNiveaux] = useState([])
  const [form, setForm] = useState({
    etudiant: '', matiere: '', semestre: '', note_cc: '', note_examen: '',
  })
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => { chargerDonnees() }, [])

  // Filtrer les matières selon le niveau de l'étudiant sélectionné
  useEffect(() => {
    if (etudiantSelectionne?.niveau) {
      const filtered = matieres.filter(m => m.niveau === etudiantSelectionne.niveau)
      setMatieresFiltrees(filtered)
    } else {
      setMatieresFiltrees(matieres)
    }
    setForm(f => ({ ...f, matiere: '', note_cc: '' }))
    setMatiereSelectionnee(null)
  }, [etudiantSelectionne, matieres])

  const chargerDonnees = async () => {
    const [notesRes, matieresRes, semestresRes, etudiantsRes, niveauxRes] = await Promise.all([
      getNotes(),
      getMatieres(),
      getSemestres(),
      api.get('/auth/etudiants/'),
      api.get('/academique/niveaux/'),
    ])
    setNotes(notesRes.data)
    setMatieres(matieresRes.data)
    setMatieresFiltrees(matieresRes.data)
    setSemestres(semestresRes.data)
    setEtudiants(etudiantsRes.data)
    setNiveaux(niveauxRes.data)
  }

  const handleEtudiantChange = (e) => {
    const etudiantId = parseInt(e.target.value)
    const etudiant = etudiants.find(et => et.id === etudiantId)
    setEtudiantSelectionne(etudiant || null)
    setForm({ ...form, etudiant: e.target.value, matiere: '', note_cc: '' })
  }

  const handleMatiereChange = (e) => {
    const matiereId = parseInt(e.target.value)
    const matiere = matieresFiltrees.find(m => m.id === matiereId)
    setMatiereSelectionnee(matiere || null)
    setForm({ ...form, matiere: e.target.value, note_cc: '' })
  }

  const calculerMoyenne = (cc, examen) => {
    if (examen === '') return '—'
    if (matiereSelectionnee && !matiereSelectionnee.avec_cc) {
      return parseFloat(examen).toFixed(2)
    }
    if (cc === '' || examen === '') return '—'
    const moy = parseFloat(cc) * 0.4 + parseFloat(examen) * 0.6
    return Math.round(moy * 100) / 100
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = { ...form }
      if (matiereSelectionnee && !matiereSelectionnee.avec_cc) data.note_cc = null
      if (editNote) {
        await updateNote(editNote.id, data)
        setMessage({ text: 'Note mise à jour avec succès !', type: 'success' })
      } else {
        await createNote(data)
        setMessage({ text: 'Note ajoutée avec succès !', type: 'success' })
      }
      await chargerDonnees()
      handleCancel()
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch {
      setMessage({ text: "Erreur lors de l'enregistrement.", type: 'error' })
    }
  }

  const handleEdit = (note) => {
    const matiere = matieres.find(m => m.id === note.matiere)
    const etudiant = etudiants.find(e => e.id === note.etudiant)
    setEditNote(note)
    setEtudiantSelectionne(etudiant || null)
    setMatiereSelectionnee(matiere || null)
    setForm({
      etudiant: note.etudiant, matiere: note.matiere,
      semestre: note.semestre, note_cc: note.note_cc ?? '',
      note_examen: note.note_examen ?? ''
    })
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditNote(null)
    setMatiereSelectionnee(null)
    setEtudiantSelectionne(null)
    setForm({ etudiant: '', matiere: '', semestre: '', note_cc: '', note_examen: '' })
  }

  // Filtrer les notes par niveau
  const notesFiltrees = filtreNiveau
    ? notes.filter(n => {
        const etudiant = etudiants.find(e => e.id === n.etudiant)
        return etudiant?.niveau === parseInt(filtreNiveau)
      })
    : notes

  const admis = notesFiltrees.filter(n => n.note_finale >= 10).length
  const moyenne = notesFiltrees.length
    ? (notesFiltrees.reduce((s, n) => s + parseFloat(n.note_finale || 0), 0) / notesFiltrees.length).toFixed(2)
    : '—'

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }

  return (
    <div>
      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0b3d91', margin: '0 0 4px' }}>Saisie des notes</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>{notes.length} note(s) enregistrée(s)</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', backgroundColor: '#0b3d91', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 'bold' }}>
            <PlusCircle size={18} /> Ajouter une note
          </button>
        )}
      </div>

      {/* Cartes statistiques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Notes saisies', value: notesFiltrees.length, icon: BookOpen, color: '#0b3d91', bg: '#e8f0fe' },
          { label: 'Étudiants admis', value: admis, icon: Users, color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Moyenne classe', value: moyenne, icon: TrendingUp, color: '#d97706', bg: '#fffbeb' },
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

      {/* Message */}
      {message.text && (
        <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 8, backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4', color: message.type === 'error' ? '#dc2626' : '#16a34a', fontSize: 14 }}>
          {message.text}
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: '4px solid #0b3d91' }}>
          <h3 style={{ color: '#0b3d91', margin: '0 0 20px', fontSize: 16, fontWeight: 'bold' }}>
            {editNote ? '✏️ Modifier la note' : '➕ Nouvelle note'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>

              <div>
                <label style={labelStyle}>Étudiant</label>
                <select value={form.etudiant} onChange={handleEtudiantChange} required style={inputStyle} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
                  <option value="">-- Sélectionner --</option>
                  {etudiants.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.first_name} {e.last_name} {e.niveau_nom ? `(${e.niveau_nom})` : ''}
                    </option>
                  ))}
                </select>
                {etudiantSelectionne?.niveau_nom && (
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: '#0b3d91' }}>
                    📚 Niveau : {etudiantSelectionne.niveau_nom}
                    {etudiantSelectionne.option_nom ? ` — Option : ${etudiantSelectionne.option_nom}` : ''}
                  </p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Matière {etudiantSelectionne?.niveau ? '(filtrée par niveau)' : ''}</label>
                <select value={form.matiere} onChange={handleMatiereChange} required style={inputStyle} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
                  <option value="">-- Sélectionner --</option>
                  {matieresFiltrees.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.nom} ({m.code}) — {m.credits} cr. {m.avec_cc ? '| CC+Exam' : '| Exam seul'}
                    </option>
                  ))}
                </select>
                {matiereSelectionnee && (
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: '#0b3d91' }}>
                    {matiereSelectionnee.avec_cc ? '📝 CC (40%) + Examen (60%)' : '📋 Examen uniquement'}
                    {' — '}{matiereSelectionnee.credits} crédits
                  </p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Semestre</label>
                <select value={form.semestre} onChange={e => setForm({ ...form, semestre: e.target.value })} required style={inputStyle} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
                  <option value="">-- Sélectionner --</option>
                  {semestres.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                </select>
              </div>

              {matiereSelectionnee?.avec_cc && (
                <div>
                  <label style={labelStyle}>Note CC (40%)</label>
                  <input type="number" min="0" max="20" step="0.25" value={form.note_cc} onChange={e => setForm({ ...form, note_cc: e.target.value })} placeholder="0 — 20" style={inputStyle} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
              )}

              <div>
                <label style={labelStyle}>Note Examen {matiereSelectionnee?.avec_cc ? '(60%)' : '(100%)'}</label>
                <input type="number" min="0" max="20" step="0.25" value={form.note_examen} onChange={e => setForm({ ...form, note_examen: e.target.value })} placeholder="0 — 20" required style={inputStyle} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ width: '100%', padding: 16, backgroundColor: '#e8f0fe', borderRadius: 10, textAlign: 'center', border: '2px dashed #0b3d91' }}>
                  <p style={{ margin: '0 0 4px', fontSize: 12, color: '#6b7280' }}>Moyenne calculée</p>
                  <p style={{ margin: 0, fontSize: 26, fontWeight: 'bold', color: '#0b3d91' }}>
                    {calculerMoyenne(form.note_cc, form.note_examen)} <span style={{ fontSize: 14 }}>/ 20</span>
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: '1.5px solid #e5e7eb', borderRadius: 8, backgroundColor: 'white', cursor: 'pointer', fontSize: 14 }}>
                <X size={16} /> Annuler
              </button>
              <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px', backgroundColor: '#0b3d91', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 'bold' }}>
                <Save size={16} /> Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtre par niveau */}
      <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Filtrer par niveau :</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => setFiltreNiveau('')} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', backgroundColor: filtreNiveau === '' ? '#0b3d91' : '#f3f4f6', color: filtreNiveau === '' ? 'white' : '#6b7280' }}>
            Tous
          </button>
          {niveaux.map(n => (
            <button key={n.id} onClick={() => setFiltreNiveau(String(n.id))} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', backgroundColor: filtreNiveau === String(n.id) ? '#0b3d91' : '#f3f4f6', color: filtreNiveau === String(n.id) ? 'white' : '#6b7280' }}>
              {n.filiere_nom?.split('-')[0].trim()} {n.code}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div style={{ backgroundColor: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ margin: 0, color: '#0b3d91', fontSize: 15, fontWeight: 'bold' }}>📋 Liste des notes ({notesFiltrees.length})</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ backgroundColor: '#0b3d91' }}>
                {['Étudiant', 'Niveau', 'Matière', 'Crédits', 'CC (40%)', 'Examen', 'Moyenne', 'Statut', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'white', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notesFiltrees.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                    Aucune note enregistrée
                  </td>
                </tr>
              ) : notesFiltrees.map((n, i) => {
                const etudiant = etudiants.find(e => e.id === n.etudiant)
                return (
                  <tr key={n.id} style={{ borderTop: '1px solid #f3f4f6', backgroundColor: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#e8f0fe', color: '#0b3d91', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 12, flexShrink: 0 }}>
                          {n.etudiant_nom?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        {n.etudiant_nom}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, backgroundColor: '#e8f0fe', color: '#0b3d91' }}>
                        {etudiant?.niveau_nom || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>{n.matiere_nom}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#0b3d91' }}>{n.credits || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{n.note_cc ?? <span style={{ color: '#d1d5db' }}>—</span>}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{n.note_examen ?? '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: 15, color: parseFloat(n.note_finale) >= 10 ? '#16a34a' : '#dc2626' }}>
                        {n.note_finale ?? '—'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, backgroundColor: n.note_finale >= 10 ? '#f0fdf4' : '#fef2f2', color: n.note_finale >= 10 ? '#16a34a' : '#dc2626' }}>
                        {n.note_finale >= 10 ? '✓ Validé' : '✗ Ajourné'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => handleEdit(n)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', backgroundColor: '#e8f0fe', color: '#0b3d91', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                        <Edit size={13} /> Modifier
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
