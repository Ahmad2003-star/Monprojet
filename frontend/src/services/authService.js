import api from './api'
import axios from 'axios' // <-- On ajoute l'importation manquante d'axios brut

export const login = async (username, password) => {
  // On utilise axios brut avec l'adresse absolue exacte de votre serveur Render
  const { data } = await axios.post('https://onrender.com', { username, password })

  localStorage.setItem('access_token', data.access)
  localStorage.setItem('refresh_token', data.refresh)
  return data
}

export const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

// L'instance api gère le reste des appels avec la bonne URL de base
export const getProfil = () => api.get('/auth/profil/')