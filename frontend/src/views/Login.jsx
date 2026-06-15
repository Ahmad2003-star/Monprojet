import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, getProfil } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.username, form.password)
      const { data } = await getProfil()
      setUser(data)
      navigate(`/${data.role}`)
    } catch {
      setError('Identifiants incorrects. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      fontFamily: 'Arial, sans-serif',
    }}>

      {/* Panneau gauche — masqué sur mobile */}
      {!isMobile && (
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #0b3d91 0%, #082c6c 60%, #051a45 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          color: 'white',
        }}>
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 30 }}>
              <img src="/images/0 2.png" alt="UNSTIM" style={{ width: 90, height: 90, objectFit: 'contain', backgroundColor: 'white', borderRadius: 12, padding: 6 }} />
              <img src="/images/img_logoFAST-NATI.jpg" alt="FAST" style={{ width: 90, height: 90, objectFit: 'contain', borderRadius: 12 }} />
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 15 }}>FAST Natitingou</h1>
            <p style={{ fontSize: 18, opacity: 0.9, marginBottom: 40 }}>Plateforme Web de Gestion Académique</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { emoji: '🎓', text: 'Consultation des notes et relevés' },
                { emoji: '📅', text: 'Emploi du temps en temps réel' },
                { emoji: '📊', text: 'Suivi académique personnalisé' },
                { emoji: '🔒', text: 'Accès sécurisé par rôle' },
              ].map(({ emoji, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: 10 }}>
                  <span style={{ fontSize: 22 }}>{emoji}</span>
                  <span style={{ fontSize: 14, opacity: 0.9 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Panneau droit — formulaire */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f7fa',
        padding: isMobile ? 20 : 40,
        minHeight: isMobile ? '100vh' : 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Logos sur mobile */}
          {isMobile && (
            <div style={{ textAlign: 'center', marginBottom: 24, padding: '20px', background: 'linear-gradient(135deg, #0b3d91, #082c6c)', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <img src="/images/0 2.png" alt="UNSTIM" style={{ width: 60, height: 60, objectFit: 'contain', backgroundColor: 'white', borderRadius: 8, padding: 4 }} />
                <img src="/images/img_logoFAST-NATI.jpg" alt="FAST" style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8 }} />
              </div>
              <h1 style={{ color: 'white', margin: 0, fontSize: 20, fontWeight: 'bold' }}>FAST Natitingou</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: '4px 0 0', fontSize: 13 }}>Plateforme Web de Gestion Académique</p>
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0b3d91', margin: '0 0 6px' }}>Connexion</h2>
            <p style={{ color: '#666', margin: 0, fontSize: 14 }}>Accédez à votre espace personnel</p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 6 }}>
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="Entrez votre identifiant"
                required
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#0b3d91'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 6 }}>
                Mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Entrez votre mot de passe"
                  required
                  style={{ width: '100%', padding: '12px 46px 12px 16px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#0b3d91'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', backgroundColor: loading ? '#6b93c4' : '#0b3d91',
                color: 'white', border: 'none', borderRadius: 8, fontSize: 16,
                fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 20, height: 20, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Connexion en cours…
                </>
              ) : (
                <><LogIn size={20} /> Se connecter</>
              )}
            </button>
          </form>

          <div style={{ marginTop: 16, textAlign: 'center', padding: '14px', backgroundColor: '#f0f4ff', borderRadius: 8 }}>
            <p style={{ margin: '0 0 8px', fontSize: 14, color: '#6b7280' }}>Première connexion ?</p>
            <button
              onClick={() => navigate('/inscription')}
              style={{ background: 'none', border: '2px solid #0b3d91', color: '#0b3d91', cursor: 'pointer', fontSize: 14, fontWeight: 'bold', padding: '8px 20px', borderRadius: 8 }}
            >
              🎓 Créer mon compte étudiant
            </button>
          </div>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', color: '#0b3d91', cursor: 'pointer', fontSize: 14, textDecoration: 'underline' }}
            >
              ← Retour à l'accueil
            </button>
          </div>

          <p style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#9ca3af' }}>
            © 2026 FAST Natitingou — UNSTIM
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
