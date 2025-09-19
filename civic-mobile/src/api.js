import axios from 'axios'
import { API_URL } from './constants'

const api = axios.create({ baseURL: API_URL, withCredentials: true })

export async function submitIssue(payload, images = []) {
  const form = new FormData()
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    if (typeof v === 'object') form.append(k, JSON.stringify(v))
    else form.append(k, String(v))
  })

  images.forEach((img, idx) => {
    const file = {
      uri: img.uri,
      name: img.fileName || `image_${idx}.jpg`,
      type: img.mimeType || 'image/jpeg',
    }
    form.append('images', file)
  })

  const { data } = await api.post('/api/issues', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function listIssues(params = {}) {
  const { page = 1, limit = 5, status, category, priority, q } = params
  const { data } = await api.get('/api/issues', { params: { page, limit, status, category, priority, q } })
  return data
}
