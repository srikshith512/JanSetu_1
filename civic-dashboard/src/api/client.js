import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

export async function listIssues(params = {}) {
  const { data } = await api.get('/api/issues', { params })
  return data
}

export async function getIssue(id) {
  const { data } = await api.get(`/api/issues/${id}`)
  return data
}

export async function getStats() {
  const { data } = await api.get('/api/issues/stats')
  return data
}

export async function updateIssue(id, payload, files) {
  if (!files) {
    const { data } = await api.put(`/api/issues/${id}`, payload)
    return data
  }
  const form = new FormData()
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    if (typeof v === 'object') form.append(k, JSON.stringify(v))
    else form.append(k, v)
  })
  if (files.images) Array.from(files.images).forEach((f) => form.append('images', f))
  if (files.audioNote) form.append('audioNote', files.audioNote)
  const { data } = await api.put(`/api/issues/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
