import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react'

const API = import.meta.env.VITE_API_URL

export default function Inscription() {
  const navigate = useNavigate()
  const [etape, setEtape] = useState(1)
  const [matricule, setMatricule] = useState('')
  const [form, setForm] = useState({ first_name: '', last_name: '', username: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const verifierMatricule = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/auth/verifier-matricule/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ matricule }),
      })
      const text = await res.text()
      const data = JSON.parse(text)
      if (!res.ok) throw new Error(data.error)
      setEtape(2)
    } catch (err) {
      setError(err.message || 'Erreur de connexion au serveur.')
    } finally {
      setLoading(false)
    }
  }

  const creerCompte = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/auth/inscription/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ matricule, ...form }),
      })
      const text = await res.text()
      const data = JSON.parse(text)
      if (!res.ok) throw new Error(data.error)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Erreur de connexion au serveur.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
    borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 40, maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ width: 70, height: 70, borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={36} color="#16a34a" />
          </div>
          <h2 style={{ color: '#0b3d91', margin: '0 0 10px', fontSize: 22 }}>Compte créé avec succès !</h2>
          <p style={{ color: '#6b7280', margin: '0 0 24px' }}>Vous pouvez maintenant vous connecter avec votre nom d'utilisateur et mot de passe.</p>
          <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '12px', backgroundColor: '#0b3d91', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 'bold', cursor: 'pointer' }}>
            Se connecter
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/images/img_logoFAST-NATI.jpg" alt="FAST" style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'contain', marginBottom: 12 }} />
          <h1 style={{ fontSize: 22, fontWeight: 'bold', color: '#0b3d91', margin: '0 0 4px' }}>Création de compte</h1>
          <p style={{ color: '#6b7280', margin: 0, fontSize: 14 }}>FAST Natitingou — Espace Étudiant</p>
        </div>

        {/* Indicateur d'étapes */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          {[1, 2].map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14, backgroundColor: etape >= step ? '#0b3d91' : '#e5e7eb', color: etape >= step ? 'white' : '#9ca3af' }}>
                  {etape > step ? '✓' : step}
                </div>
                <span style={{ fontSize: 13, color: etape >= step ? '#0b3d91' : '#9ca3af', fontWeight: etape >= step ? 600 : 400 }}>
                  {step === 1 ? 'Vérification matricule' : 'Informations personnelles'}
                </span>
              </div>
              {i < 1 && <div style={{ flex: 1, height: 2, backgroundColor: etape > 1 ? '#0b3d91' : '#e5e7eb', margin: '0 12px' }} />}
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: 8, marginBottom: 20, fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          {etape === 1 && (
            <form onSubmit={verifierMatricule}>
              <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 20px' }}>
                Entrez votre numéro matricule fourni par l'administration de la FAST.
              </p>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Numéro matricule</label>
                <input
                  type="text"
                  value={matricule}
                  onChange={e => setMatricule(e.target.value.toUpperCase())}
                  placeholder="Ex: FAST2024001"
                  required
                  style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 'bold', fontSize: 16 }}
                  onFocus={e => e.target.style.borderColor = '#0b3d91'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#6b93c4' : '#0b3d91', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? 'Vérification…' : <><span>Vérifier</span> <ArrowRight size={18} /></>}
              </button>
            </form>
          )}

          {etape === 2 && (
            <form onSubmit={creerCompte}>
              <div style={{ backgroundColor: '#f0fdf4', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={16} /> Matricule <strong>{matricule}</strong> vérifié avec succès
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Prénom</label>
                  <input type="text" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} required style={inputStyle} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <div>
                  <label style={labelStyle}>Nom</label>
                  <input type="text" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} required style={inputStyle} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Nom d'utilisateur</label>
                <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required style={inputStyle} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Email <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optionnel)</span></label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={8} style={{ ...inputStyle, paddingRight: 44 }} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Confirmer le mot de passe</label>
                <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required style={inputStyle} onFocus={e => e.target.style.borderColor = '#0b3d91'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => { setEtape(1); setError('') }} style={{ padding: '12px 20px', border: '1.5px solid #e5e7eb', borderRadius: 8, backgroundColor: 'white', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ArrowLeft size={16} /> Retour
                </button>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', backgroundColor: loading ? '#6b93c4' : '#0b3d91', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 'bold', cursor: 'pointer' }}>
                  {loading ? 'Création…' : 'Créer mon compte'}
                </button>
              </div>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          Vous avez déjà un compte ?{' '}
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#0b3d91', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>
            Se connecter
          </button>
        </p>
      </div>
    </div>
  )
}
