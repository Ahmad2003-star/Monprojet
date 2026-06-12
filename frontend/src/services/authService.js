import api from './api'

export const login = async (username, password) => {
  // On utilise 'api' au lieu de 'axios' brut pour bénéficier de la bonne URL automatiquement
  const { data } = await api.post('/token/', { username, password })
  localStorage.setItem('access_token', data.access)
  localStorage.setItem('refresh_token', data.refresh)
  return data
}

export const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

// L'instance api ajoute déjà "/api" devant, donc on demande "/auth/profil/" pour faire "/api/auth/profil/"
export const getProfil = () => api.get('/auth/profil/')