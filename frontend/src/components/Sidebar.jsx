import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logout } from '../services/authService'
import { LogOut, Home, Users, BookOpen, Calendar, CheckSquare, ChevronRight, X, Menu,GraduationCap} from 'lucide-react'

const navItems = {
  admin: [
    { to: '/admin', label: 'Tableau de bord', icon: Home },
    { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
    { to: '/admin/releves', label: 'Valider relevés', icon: CheckSquare },
    { to: '/admin/examens', label:'Calendrier examens', icon: Calendar},
    { to: '/admin/notes', label: 'Saisie des notes', icon: BookOpen },
    { to: '/admin/etudiants', label: 'Liste des étudiants', icon: GraduationCap },
  ],
  enseignant: [
    { to: '/enseignant', label: 'Tableau de bord', icon: Home },
    { to: '/enseignant/notes', label: 'Saisie des notes', icon: BookOpen },
    { to: '/enseignant/emploi', label: 'Emploi du temps', icon: Calendar },
  ],
  etudiant: [
    { to: '/etudiant', label: 'Tableau de bord', icon: Home },
    { to: '/etudiant/notes', label: 'Mes notes', icon: BookOpen },
    { to: '/etudiant/emploi', label: 'Emploi du temps', icon: Calendar },
    { to: '/etudiant/examens', label: 'Calendrier examens', icon: Calendar },
  ],
}

const roleLabels = {
  admin: 'Administrateur',
  enseignant: 'Enseignant',
  etudiant: 'Étudiant',
}

const roleColors = {
  admin: '#c8a951',
  enseignant: '#60a5fa',
  etudiant: '#34d399',
}

export default function Sidebar({ isOpen, onClose }) {
  const { user, setUser } = useAuth()
  const location = useLocation()
  const items = navItems[user?.role] || []

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  const initials = `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase() || user?.username?.[0]?.toUpperCase()

  const sidebarContent = (
    <aside style={{
      width: 260,
      height: '100%',
      backgroundColor: '#0b3d91',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
    }}>
      {/* Logo + bouton fermer sur mobile */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/images/img_logoFAST-NATI.jpg" alt="FAST" style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'contain' }} />
          <div>
            <p style={{ margin: 0, color: 'white', fontWeight: 'bold', fontSize: 14 }}>FAST Natitingou</p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>Gestion Académique</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <X size={20} />
        </button>
      </div>

      {/* Profil */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: roleColors[user?.role] || '#c8a951', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 15, color: '#0b3d91', flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <p style={{ margin: 0, color: 'white', fontWeight: '600', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.first_name} {user?.last_name}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: roleColors[user?.role] || '#c8a951' }}>
            {roleLabels[user?.role] || user?.role}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
        <p style={{ margin: '0 0 8px 8px', fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.5 }}>Navigation</p>
        {items.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, marginBottom: 4,
                textDecoration: 'none',
                backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                fontWeight: isActive ? '600' : '400',
                fontSize: 14,
              }}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{label}</span>
              {isActive && <ChevronRight size={14} />}
            </Link>
          )
        })}
      </nav>

      {/* Déconnexion */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', backgroundColor: 'rgba(220,38,38,0.15)', color: '#fca5a5', cursor: 'pointer', fontSize: 14 }}
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop — sidebar fixe */}
      <div style={{ display: 'none' }} className="desktop-sidebar">
        {sidebarContent}
      </div>

      {/* Mobile/Tablette — sidebar en overlay */}
      {isOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}
          onClick={onClose}
        >
          {/* Fond sombre */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
          {/* Sidebar */}
          <div style={{ position: 'relative', zIndex: 201, height: '100%' }} onClick={e => e.stopPropagation()}>
            {sidebarContent}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-sidebar { display: block !important; min-height: 100vh; }
        }
      `}</style>
    </>
  )
}
