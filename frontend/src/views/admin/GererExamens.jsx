import { useState, useEffect } from 'react'
import api from '../../services/api'
import { PlusCircle, Trash2, Save, X, Edit, Calendar, Clock, MapPin } from 'lucide-react'

const typeColors = {
  partiel: { bg: '#fff7ed', color: '#ea580c' },
  examen: { bg: '#fef2f2', color: '#dc2626' },
}

const emptyForm = {
  matiere: '', semestre: '', type_examen: 'examen',
  date: '', heure_debut: '', heure_fin: '', salle: '', observations: ''
}

export default function GererExamens() {
  const [examens, setExamens] = useState([])
  const [matieres, setMatieres] = useState([])
  const [semestres, setSemestres] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editExamen, setEditExamen] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => { chargerDonnees() }, [])

  const chargerDonnees = async () => {
    const [examensRes, matieresRes, semestresRes] = await Promise.all([
      api.get('/academique/examens/'),
      api.get('/academique/matieres/'),
      api.get('/academique/semestres/'),
    ])
    setExamens(examensRes.data)
    setMatieres(matieresRes.data)
    setSemestres(semestresRes.data)
  }

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editExamen) {
        await api.patch(`/academique/examens/${editExamen.id}/`, form)
        showMsg('Examen modifié avec succès !')
      } else {
        await api.post('/academique/examens/', form)
        showMsg('Examen ajouté avec succès !')
      }
      await chargerDonnees()
      handleCancel()
    } catch {
      showMsg('Erreur lors de l\'enregistrement.', 'error')
    }
  }

  const handleEdit = (examen) => {
    setEditExamen(examen)
    setForm({
      matiere: examen.matiere,
      semestre: examen.semestre,
      type_examen: examen.type_examen,
      date: examen.date,
      heure_debut: examen.heure_debut,
      heure_fin: examen.heure_fin,
      salle: examen.salle,
      observations: examen.observations || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/academique/examens/${id}/`)
      showMsg('Examen supprimé.')
      await chargerDonnees()
      setConfirmDelete(null)
    } catch {
      showMsg('Erreur lors de la suppression.', 'error')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditExamen(null)
    setForm(emptyForm)
  }

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
  const isUpcoming = (dateStr) => new Date(dateStr) >= new Date()

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0b3d91', margin: '0 0 4px' }}>Calendrier des examens</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>{examens.length} examen(s) programmé(s)</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', backgroundColor: '#0b3d91', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 'bold' }}>
            <PlusCircle size={18} /> Ajouter un examen
          </button>
        )}
      </div>

      {message.text && (
        <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 8, backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4', color: message.type === 'error' ? '#dc2626' : '#16a34a', fontSize: 14 }}>
          {message.text}
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ color: '#0b3d91', margin: '0 0 20px', fontSize: 16 }}>
            {editExamen ? '✏️ Modifier l\'examen' : '➕ Nouvel examen'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Matière</label>
                <select value={form.matiere} onChange={e => setForm({ ...form, matiere: e.target.value })} required style={inputStyle}>
                  <option value="">-- Sélectionner --</option>
                  {matieres.map(m => <option key={m.id} value={m.id}>{m.nom} ({m.code})</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Semestre</label>
                <select value={form.semestre} onChange={e => setForm({ ...form, semestre: e.target.value })} required style={inputStyle}>
                  <option value="">-- Sélectionner --</option>
                  {semestres.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Type d'examen</label>
                <select value={form.type_examen} onChange={e => setForm({ ...form, type_examen: e.target.value })} style={inputStyle}>
                  <option value="examen">Examen Final</option>
                  <option value="partiel">Partiel / CC</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Heure début</label>
                <input type="time" value={form.heure_debut} onChange={e => setForm({ ...form, heure_debut: e.target.value })} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Heure fin</label>
                <input type="time" value={form.heure_fin} onChange={e => setForm({ ...form, heure_fin: e.target.value })} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Salle</label>
                <input type="text" value={form.salle} onChange={e => setForm({ ...form, salle: e.target.value })} required placeholder="Ex: Amphi A" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Observations <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optionnel)</span></label>
                <input type="text" value={form.observations} onChange={e => setForm({ ...form, observations: e.target.value })} placeholder="Ex: Apporter calculatrice" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: '1.5px solid #e5e7eb', borderRadius: 8, backgroundColor: 'white', cursor: 'pointer', fontSize: 14 }}>
                <X size={16} /> Annuler
              </button>
              <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', backgroundColor: '#0b3d91', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 'bold' }}>
                <Save size={16} /> Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des examens */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {examens.length === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 40, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <Calendar size={40} color="#e5e7eb" style={{ marginBottom: 12 }} />
            <p style={{ color: '#9ca3af' }}>Aucun examen programmé</p>
          </div>
        ) : examens.map(examen => {
          const colors = typeColors[examen.type_examen]
          const upcoming = isUpcoming(examen.date)
          return (
            <div key={examen.id} style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 20, borderLeft: `4px solid ${colors.color}`, opacity: upcoming ? 1 : 0.7 }}>
              <div style={{ textAlign: 'center', minWidth: 56, backgroundColor: colors.bg, borderRadius: 10, padding: '10px 8px' }}>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 'bold', color: colors.color }}>{new Date(examen.date).getDate()}</p>
                <p style={{ margin: 0, fontSize: 11, color: colors.color, textTransform: 'uppercase' }}>{new Date(examen.date).toLocaleDateString('fr-FR', { month: 'short' })}</p>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 'bold', color: '#111827' }}>{examen.matiere_nom}</h3>
                  <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: colors.bg, color: colors.color }}>
                    {examen.type_examen === 'examen' ? 'Examen Final' : 'Partiel / CC'}
                  </span>
                  {!upcoming && <span style={{ fontSize: 11, color: '#9ca3af' }}>Passé</span>}
                </div>
                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>📅 {formatDate(examen.date)}</p>
                {examen.observations && <p style={{ margin: '3px 0 0', fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>{examen.observations}</p>}
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                  <Clock size={13} /> {examen.heure_debut} – {examen.heure_fin}
                </p>
                <p style={{ margin: '3px 0 0', fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                  <MapPin size={13} /> {examen.salle}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => handleEdit(examen)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', backgroundColor: '#e8f0fe', color: '#0b3d91', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  <Edit size={13} /> Modifier
                </button>
                <button onClick={() => setConfirmDelete(examen.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', backgroundColor: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  <Trash2 size={13} /> Supprimer
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal confirmation suppression */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 28, maxWidth: 400, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ color: '#111827', margin: '0 0 8px', fontSize: 18 }}>Confirmer la suppression</h3>
            <p style={{ color: '#6b7280', margin: '0 0 24px' }}>Voulez-vous vraiment supprimer cet examen ?</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: '8px 20px', border: '1.5px solid #e5e7eb', borderRadius: 8, backgroundColor: 'white', cursor: 'pointer', fontSize: 14 }}>Annuler</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ padding: '8px 20px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 'bold' }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
