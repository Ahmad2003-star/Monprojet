import CalendrierExamens from './views/etudiant/CalendrierExamens'
import Inscription from './views/Inscription'
import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Accueil from './views/Accueil'
import Login from './views/Login'
import AdminDashboard from './views/admin/AdminDashboard'
import GererUtilisateurs from './views/admin/GererUtilisateurs'
import ValiderReleves from './views/admin/ValiderReleves'
import EnseignantDashboard from './views/enseignant/EnseignantDashboard'
import SaisieNotes from './views/enseignant/SaisieNotes'
import EmploiDuTempsEnseignant from './views/enseignant/EmploiDuTempsEnseignant'
import EtudiantDashboard from './views/etudiant/EtudiantDashboard'
import ConsulterNotes from './views/etudiant/ConsulterNotes'
import EmploiDuTemps from './views/etudiant/EmploiDuTemps'
import GererExamens from './views/admin/GererExamens'
import ListeEtudiants from './views/admin/ListeEtudiants'
function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main style={{ padding: 20, flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#0b3d91' }}>
      Chargement…
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to={`/${user.role}`} replace />
  return <Outlet />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route element={<ProtectedRoute roles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/utilisateurs" element={<GererUtilisateurs />} />
                <Route path="/admin/releves" element={<ValiderReleves />} />
                <Route path="/admin/examens" element={<GererExamens />} />
                <Route path="/admin/notes" element={<SaisieNotes />} />
                <Route path="/admin/etudiants" element={<ListeEtudiants/>} />
              </Route>
              <Route element={<ProtectedRoute roles={['enseignant']} />}>
                <Route path="/enseignant" element={<EnseignantDashboard />} />
                <Route path="/enseignant/notes" element={<SaisieNotes />} />
                <Route path="/enseignant/emploi" element={<EmploiDuTempsEnseignant />} />
              </Route>
              <Route element={<ProtectedRoute roles={['etudiant']} />}>
                <Route path="/etudiant/examens" element={<CalendrierExamens />} />
                <Route path="/etudiant" element={<EtudiantDashboard />} />
                <Route path="/etudiant/notes" element={<ConsulterNotes />} />
                <Route path="/etudiant/emploi" element={<EmploiDuTemps />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
