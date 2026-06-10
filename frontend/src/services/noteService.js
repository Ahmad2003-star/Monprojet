import api from './api'
export const getNotes = () => api.get('/academique/notes/')
export const createNote = (data) => api.post('/academique/notes/', data)
export const updateNote = (id, data) => api.patch(`/academique/notes/${id}/`, data)
export const getMatieres = () => api.get('/academique/matieres/')
export const getSemestres = () => api.get('/academique/semestres/')
export const getEmploiDuTemps = () => api.get('/academique/emplois-du-temps/')
