import { useAuth } from '../context/AuthContext'
import { Bell, User, Menu } from 'lucide-react'

const roleLabels = {
  admin: 'Administrateur',
  enseignant: 'Enseignant',
  etudiant: 'Étudiant',
}

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth()

  return (
    <header style={{
      height: 60,
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Bouton hamburger */}
        <button
          onClick={onMenuClick}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0b3d91', display: 'flex', alignItems: 'center', padding: 4 }}
          className="hamburger-btn"
        >
          <Menu size={24} />
        </button>
        <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }} className="nav-title">
          <span style={{ color: '#0b3d91', fontWeight: 600 }}>FAST</span> — Gestion Académique
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
          <Bell size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', backgroundColor: '#f9fafb', borderRadius: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#0b3d91', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={14} color="white" />
          </div>
          <div className="user-info">
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#374151' }}>{user?.first_name} {user?.last_name}</p>
            <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>{roleLabels[user?.role]}</p>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .hamburger-btn { display: none !important; }
        }
        @media (max-width: 480px) {
          .user-info { display: none; }
          .nav-title { display: none; }
        }
      `}</style>
    </header>
  )
}
