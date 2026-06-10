/**
 * Tests Frontend React — FAST Natitingou
 * Fichier : frontend/src/__tests__/tests_frontend.test.jsx
 * Usage : npm test
 * Installation : npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom
 */
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// ── MOCKS ─────────────────────────────────────────────────
vi.mock('../services/authService', () => ({
  login: vi.fn(),
  getProfil: vi.fn(),
  logout: vi.fn(),
}))

vi.mock('../services/noteService', () => ({
  getNotes: vi.fn(() => Promise.resolve({ data: [] })),
  getMatieres: vi.fn(() => Promise.resolve({ data: [] })),
  getSemestres: vi.fn(() => Promise.resolve({ data: [] })),
  getEmploiDuTemps: vi.fn(() => Promise.resolve({ data: [] })),
}))

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    patch: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({})),
  }
}))

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, username: 'admin', first_name: 'Admin', last_name: 'Test', role: 'admin' },
    setUser: vi.fn(),
    loading: false,
  })),
  AuthProvider: ({ children }) => children,
}))

// ── IMPORTS COMPOSANTS ────────────────────────────────────
import Login from '../views/Login'
import AdminDashboard from '../views/admin/AdminDashboard'
import EtudiantDashboard from '../views/etudiant/EtudiantDashboard'
import ConsulterNotes from '../views/etudiant/ConsulterNotes'

// ── HELPER ────────────────────────────────────────────────
const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  )
}

// ── TESTS LOGIN ───────────────────────────────────────────
describe('Page de connexion', () => {
  it('affiche le formulaire de connexion', () => {
    renderWithRouter(<Login />)
    expect(screen.getByPlaceholderText(/identifiant/i)).toBeTruthy()
    expect(screen.getByPlaceholderText(/mot de passe/i)).toBeTruthy()
  })

  it('affiche le bouton Se connecter', () => {
    renderWithRouter(<Login />)
    expect(screen.getByText(/se connecter/i)).toBeTruthy()
  })

  it('affiche le nom de la plateforme', () => {
    renderWithRouter(<Login />)
    expect(
    screen.getByRole('heading', { name: /FAST Natitingou/i })
    ).toBeInTheDocument()
   })

  it('affiche le lien vers la page d\'inscription', () => {
    renderWithRouter(<Login />)
    expect(screen.getByText(/créer mon compte/i)).toBeTruthy()
  })

  it('affiche une erreur avec mauvais identifiants', async () => {
    const { login } = await import('../services/authService')
    login.mockRejectedValueOnce(new Error('401'))

    renderWithRouter(<Login />)
    fireEvent.change(screen.getByPlaceholderText(/identifiant/i), { target: { value: 'mauvais' } })
    fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), { target: { value: 'mauvais' } })
    fireEvent.click(screen.getByText(/se connecter/i))

    await waitFor(() => {
      expect(screen.getByText(/identifiants incorrects/i)).toBeTruthy()
    })
  })
})

// ── TESTS DASHBOARD ADMIN ─────────────────────────────────
describe('Dashboard Administrateur', () => {
  beforeEach(() => {
  api.get = vi.fn().mockResolvedValue({
    data: {
      total_etudiants: 15,
      total_enseignants: 4,
      total_notes: 120,
      notes_validees: 95,
      taux_reussite: 82.5,
    },
  })
})
  it('affiche le titre du tableau de bord', async () => {
    renderWithRouter(<AdminDashboard />)
    await waitFor(() => {
      expect(screen.getByText(/tableau de bord/i)).toBeTruthy()
    })
  })

  it('affiche le message de bienvenue', async () => {
    renderWithRouter(<AdminDashboard />)
    await waitFor(() => {
      expect(screen.getByText(/bienvenue/i)).toBeTruthy()
    })
  })
})

// ── TESTS ESPACE ÉTUDIANT ─────────────────────────────────
describe('Dashboard Étudiant', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: {
        id: 2,
        username: 'etu1',
        first_name: 'Amidou',
        last_name: 'MANSA',
        role: 'etudiant'
      },
      setUser: vi.fn(),
      loading: false,
    })
  })
  it('affiche l\'espace étudiant', async () => {
    renderWithRouter(<EtudiantDashboard />)
    await waitFor(() => {
      expect(screen.getByText(/espace étudiant/i)).toBeTruthy()
    })
  })

  it('affiche le bouton de téléchargement du relevé', async () => {
    renderWithRouter(<EtudiantDashboard />)
    await waitFor(() => {
      expect(screen.getByText(/relevé pdf/i)).toBeTruthy()
    })
  })
})

// ── TESTS CONSULTER NOTES ─────────────────────────────────
describe('Page Consulter Notes', () => {
  it('affiche le titre Mes Notes', async () => {
    renderWithRouter(<ConsulterNotes />)
    await waitFor(() => {
      expect(screen.getByText(/mes notes/i)).toBeTruthy()
    })
  })

  it('affiche message quand aucune note', async () => {
    renderWithRouter(<ConsulterNotes />)
    await waitFor(() => {
      expect(screen.getByText(/aucune note/i)).toBeTruthy()
    })
  })
  it('affiche les notes quand elles existent', async () => {
    const { getNotes } = await import('../services/noteService')
    getNotes.mockResolvedValueOnce({
      data: [
        { id: 1, matiere_nom: 'Analyse Math', note_cc: 14, note_examen: 16, note_finale: 15.2, etudiant: 2 }
      ]
    })

    renderWithRouter(<ConsulterNotes />)
    await waitFor(() => {
      expect(screen.getByText('Analyse Math')).toBeTruthy()
    })
  })
})

// ── TESTS CALCUL MOYENNE ──────────────────────────────────
describe('Calcul de moyenne', () => {
  const calculerMoyenne = (cc, examen, avec_cc = true) => {
    if (!avec_cc) return parseFloat(examen)
    return parseFloat(cc) * 0.4 + parseFloat(examen) * 0.6
  }

  it('calcule correctement avec CC', () => {
    expect(calculerMoyenne(14, 16, true)).toBeCloseTo(15.2)
    expect(calculerMoyenne(10, 10, true)).toBeCloseTo(10.0)
    expect(calculerMoyenne(0, 20, true)).toBeCloseTo(12.0)
  })

  it('calcule correctement sans CC', () => {
    expect(calculerMoyenne(0, 15, false)).toBe(15)
    expect(calculerMoyenne(0, 10, false)).toBe(10)
  })

  it('note >= 10 est validée', () => {
    expect(calculerMoyenne(12, 14, true) >= 10).toBe(true)
  })

  it('note < 10 est ajournée', () => {
    expect(calculerMoyenne(5, 7, true) < 10).toBe(true)
  })

  it('calcul avec coefficients', () => {
    const notes = [
      { note: 14, credits: 6 },
      { note: 12, credits: 2 },
      { note: 8,  credits: 4 },
    ]
    const totalCredits = notes.reduce((s, n) => s + n.credits, 0)
    const totalPoints = notes.reduce((s, n) => s + n.note * n.credits, 0)
    const moyenne = totalPoints / totalCredits
    expect(moyenne).toBeCloseTo(11.67, 1)
  })
})

// ── TESTS VALIDATION CRÉDITS ──────────────────────────────
describe('Validation par crédits', () => {
  const validerAnnee = (creditsObtenus, niveau) => {
    const seuils = { L1: 48, L2_plein: 36, L3: 60 }
    if (niveau === 'L1') return creditsObtenus >= seuils.L1
    if (niveau === 'L2') return creditsObtenus >= seuils.L2_plein
    if (niveau === 'L3') return creditsObtenus >= seuils.L3
    return false
  }

  it('L1 validée avec 48 crédits', () => {
    expect(validerAnnee(48, 'L1')).toBe(true)
    expect(validerAnnee(60, 'L1')).toBe(true)
  })

  it('L1 non validée avec 47 crédits', () => {
    expect(validerAnnee(47, 'L1')).toBe(false)
  })

  it('L2 validée avec 36 crédits (si L1 complète)', () => {
    expect(validerAnnee(36, 'L2')).toBe(true)
  })

  it('L3 validée seulement avec 60 crédits', () => {
    expect(validerAnnee(60, 'L3')).toBe(true)
    expect(validerAnnee(59, 'L3')).toBe(false)
  })
})
