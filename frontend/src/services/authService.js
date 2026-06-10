import api from './api'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL

export const login = async (username, password) => {
  const { data } = await axios.post(`${BASE}/token/`, { username, password })
  localStorage.setItem('access_token', data.access)
  localStorage.setItem('refresh_token', data.refresh)
  return data
}

export const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const getProfil = () => api.get('/auth/profil/')
