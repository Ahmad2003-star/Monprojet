import { useState, useEffect } from 'react'
import api from '../../services/api'
import { PlusCircle, Trash2, Save, X, Edit, Search } from 'lucide-react'

const ROLES = ['admin', 'enseignant', 'etudiant']
const emptyForm = {
  username: '', first_name: '', last_name: '', email: '',
  role: 'etudiant', password: '', matricule: '', niveau: '', option: ''
}

const roleColors = {
  admin: { bg: '#f3f0ff', color: '#7c3aed' },
  enseignant: { bg: '#e8f0fe', color: '#0b3d91' },
  etudiant: { bg: '#f0fdf4', color: '#16a34a' },
}

export default function GererUtilisateurs() {
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [niveaux, setNiveaux] = useState([])
  const [options, setOptions] = useState([])
  const [optionsFiltrees, setOptionsFiltrees] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('tous')
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => { chargerDonnees() }, [])

  useEffect(() => {
    let result = users
    if (search) result = result.filter(u =>
      `${u.first_name} ${u.last_name} ${u.username} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    )
    if (roleFilter !== 'tous') result = result.filter(u => u.role === roleFilter)
    setFiltered(result)
  }, [users, search, roleFilter])

  useEffect(() => {
    if (form.niveau) {
      const opts = options.filter(o => o.niveau === parseInt(form.niveau))
      setOptionsFiltrees(opts)
      if (opts.length === 0) setForm(f => ({ ...f, option: '' }))
    } else {
      setOptionsFiltrees([])
      setForm(f => ({ ...f, option: '' }))
    }
  }, [form.niveau, options])

  const chargerDonnees = async () => {
    const [usersRes, niveauxRes, optionsRes] = await Promise.all([
      api.get('/auth/utilisateurs/'),
      api.get('/academique/niveaux/'),
      api.get('/academique/options/'),
    ])
    setUsers(usersRes.data)
    setNiveaux(niveauxRes.data)
    setOptions(optionsRes.data)
  }

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = { ...form }
      if (!data.password) delete data.password
      if (!data.option) delete data.option
      if (!data.niveau) delete data.niveau
      if (!data.matricule) delete data.matricule

      if (editUser) {
        await api.patch(`/auth/utilisateurs/${editUser.id}/`, data)
        showMsg('Utilisateur modifié avec succès !')
      } else {
        await api.post('/auth/utilisateurs/creer/', data)
        showMsg('Utilisateur créé avec succès !')
      }
      await chargerDonnees()
      handleCancel()
    } catch (err) {
      const errors = err.response?.data
      const msg = errors ? Object.values(errors).flat().join(' ') : "Erreur lors de l'enregistrement."
      showMsg(msg, 'error')
    }
  }

  const handleEdit = (user) => {
    setEditUser(user)
    setForm({
      username: user.username, first_name: user.first_name,
      last_name: user.last_name, email: user.email, role: user.role,
      password: '', matricule: user.matricule || '',
      niveau: user.niveau || '', option: user.option || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/auth/utilisateurs/${id}/`)
      showMsg('Utilisateur supprimé.')
      await chargerDonnees()
      setConfirmDelete(null)
    } catch {
      showMsg('Erreur lors de la suppression.', 'error')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditUser(null)
    setForm(emptyForm)
  }

  const counts = {
    tous: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    enseignant: users.filter(u => u.role === 'enseignant').length,
    etudiant: users.filter(u => u.role === 'etudiant').length,
  }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }

  // Grouper les étudiants par niveau
  const etudiantsParNiveau = {}
  users.filter(u => u.role === 'etudiant').forEach(u => {
    const key = u.niveau_nom || 'Non assigné'
    if (!etudiantsParNiveau[key]) etudiantsParNiveau[key] = []
    etudiantsParNiveau[key].push(u)
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0b3d91', margin: '0 0 4px' }}>Gestion des utilisateurs</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>{users.length} utilisateurs · {counts.etudiant} étudiants · {counts.enseignant} enseignants</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', backgroundColor: '#0b3d91', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 'bold' }}>
            <PlusCircle size={18} /> Nouvel utilisateur
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
        <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: '4px solid #0b3d91' }}>
          <h3 style={{ color: '#0b3d91', margin: '0 0 20px', fontSize: 16 }}>
            {editUser ? '✏️ Modifier l\'utilisateur' : '➕ Nouvel utilisateur'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Prénom</label>
                <input type="text" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} required style={inputStyle} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={labelStyle}>Nom</label>
                <input type="text" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} required style={inputStyle} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={labelStyle}>Nom d'utilisateur</label>
                <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required={form.role !== 'etudiant'} style={inputStyle} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                {form.role === 'etudiant' && (
                <p style={{ fontSize: 11, color: '#6b7280', margin: '4px 0 0', fontStyle: 'italic' }}>
                💡 L'étudiant définira son identifiant lors de l'inscription avec son matricule
                </p>
                 )}
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={labelStyle}>Rôle</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value, niveau: '', option: '' })} style={inputStyle}>
                  {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>
                  Mot de passe {editUser && <span style={{ color: '#9ca3af', fontWeight: 400 }}>(laisser vide pour ne pas changer)</span>}
                </label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!editUser && form.role !== 'etudiant'} minLength={form.role !== 'etudiant' ? 0 : 8} style={inputStyle} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>

              {/* Champs spécifiques aux étudiants */}
              {form.role === 'etudiant' && (
                <>
                  <div>
                    <label style={labelStyle}>Matricule</label>
                    <input type="text" value={form.matricule} onChange={e => setForm({ ...form, matricule: e.target.value.toUpperCase() })} placeholder="Ex: FAST2024001" style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: 1 }} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Niveau (Filière + Année)</label>
                    <select value={form.niveau} onChange={e => setForm({ ...form, niveau: e.target.value, option: '' })} style={inputStyle}>
                      <option value="">-- Sélectionner --</option>
                      {niveaux.map(n => (
                        <option key={n.id} value={n.id}>{n.filiere_nom} — {n.code}</option>
                      ))}
                    </select>
                  </div>
                  {optionsFiltrees.length > 0 && (
                    <div>
                      <label style={labelStyle}>Option (L3 uniquement)</label>
                      <select value={form.option} onChange={e => setForm({ ...form, option: e.target.value })} style={inputStyle}>
                        <option value="">-- Sélectionner --</option>
                        {optionsFiltrees.map(o => (
                          <option key={o.id} value={o.id}>{o.nom}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}
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

      {/* Filtres */}
      <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input type="text" placeholder="Rechercher un utilisateur..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['tous', 'admin', 'enseignant', 'etudiant'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', backgroundColor: roleFilter === r ? '#0b3d91' : '#f3f4f6', color: roleFilter === r ? 'white' : '#6b7280' }}>
              {r.charAt(0).toUpperCase() + r.slice(1)} ({counts[r]})
            </button>
          ))}
        </div>
      </div>

      {/* Vue groupée par niveau pour les étudiants */}
      {roleFilter === 'etudiant' && (
        <div style={{ marginBottom: 20 }}>
          {Object.entries(etudiantsParNiveau).map(([niveau, etudiants]) => (
            <div key={niveau} style={{ backgroundColor: 'white', borderRadius: 12, marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div style={{ padding: '12px 20px', backgroundColor: '#e8f0fe', borderBottom: '1px solid #c7d7f8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, color: '#0b3d91', fontSize: 14, fontWeight: 'bold' }}>📚 {niveau}</h3>
                <span style={{ fontSize: 12, color: '#6b7280' }}>{etudiants.length} étudiant(s)</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    {['Nom complet', 'Matricule', 'Option', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {etudiants.map((u, i) => (
                    <tr key={u.id} style={{ borderTop: '1px solid #f3f4f6', backgroundColor: i % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '10px 16px', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#e8f0fe', color: '#0b3d91', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 12 }}>
                            {`${u.first_name?.[0] || ''}${u.last_name?.[0] || ''}`.toUpperCase()}
                          </div>
                          {u.first_name} {u.last_name}
                        </div>
                      </td>
                      <td style={{ padding: '10px 16px', color: '#6b7280', fontFamily: 'monospace' }}>{u.matricule || '—'}</td>
                      <td style={{ padding: '10px 16px', color: '#6b7280' }}>{u.option_nom || '—'}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => handleEdit(u)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', backgroundColor: '#e8f0fe', color: '#0b3d91', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                            <Edit size={13} /> Modifier
                          </button>
                          <button onClick={() => setConfirmDelete(u.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', backgroundColor: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                            <Trash2 size={13} /> Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Tableau général */}
      {roleFilter !== 'etudiant' && (
        <div style={{ backgroundColor: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ backgroundColor: '#0b3d91' }}>
                {['Nom complet', 'Nom d\'utilisateur', 'Email', 'Rôle', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'white', fontWeight: 600, fontSize: 13 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Aucun utilisateur trouvé</td></tr>
              ) : filtered.map((u, i) => (
                <tr key={u.id} style={{ borderTop: '1px solid #f3f4f6', backgroundColor: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: roleColors[u.role]?.bg || '#f3f4f6', color: roleColors[u.role]?.color || '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 13 }}>
                        {`${u.first_name?.[0] || ''}${u.last_name?.[0] || ''}`.toUpperCase()}
                      </div>
                      {u.first_name} {u.last_name}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{u.username}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{u.email || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, backgroundColor: roleColors[u.role]?.bg || '#f3f4f6', color: roleColors[u.role]?.color || '#6b7280' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEdit(u)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', backgroundColor: '#e8f0fe', color: '#0b3d91', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                        <Edit size={13} /> Modifier
                      </button>
                      <button onClick={() => setConfirmDelete(u.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', backgroundColor: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                        <Trash2 size={13} /> Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 28, maxWidth: 400, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ color: '#111827', margin: '0 0 8px', fontSize: 18 }}>Confirmer la suppression</h3>
            <p style={{ color: '#6b7280', margin: '0 0 24px' }}>Cette action est irréversible. Voulez-vous vraiment supprimer cet utilisateur ?</p>
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
