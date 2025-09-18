import { useState } from 'react'
import { api } from '../api/client'

export default function SubmitReport(){
  const [form, setForm] = useState({ category: '', description: '', priority: 'medium', location: '', contactInfo: '' })
  const [files, setFiles] = useState({ images: [], audioNote: null })
  const [saving, setSaving] = useState(false)

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function onSubmit(e){
    e.preventDefault()
    setSaving(true)
    try {
      const data = new FormData()
      data.append('category', form.category)
      data.append('description', form.description)
      data.append('priority', form.priority)
      if (form.location) data.append('location', form.location)
      if (form.contactInfo) data.append('contactInfo', form.contactInfo)
      Array.from(files.images || []).forEach((f) => data.append('images', f))
      if (files.audioNote) data.append('audioNote', files.audioNote)
      await api.post('/api/issues', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      alert('Report submitted')
      setForm({ category: '', description: '', priority: 'medium', location: '', contactInfo: '' })
      setFiles({ images: [], audioNote: null })
    } catch (e) {
      alert(e.response?.data?.message || e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page submit">
      <h1 className="page-title">Report a New Civic Issue</h1>

      <form className="grid-vertical" onSubmit={onSubmit}>
        <section className="panel">
          <div className="panel-head">
            <h2>Issue Details</h2>
          </div>
          <div className="grid two">
            <label>
              <span>Category</span>
              <select value={form.category} onChange={(e)=>setField('category', e.target.value)}>
                <option value="">Select an issue category</option>
                <option>Roads</option>
                <option>Sanitation</option>
                <option>Water Supply</option>
                <option>Electricity</option>
                <option>Public Park</option>
              </select>
            </label>
            <label>
              <span>Priority</span>
              <select value={form.priority} onChange={(e)=>setField('priority', e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="full">
              <span>Description</span>
              <textarea rows={5} placeholder="Please describe the issue..." value={form.description} onChange={(e)=>setField('description', e.target.value)} />
            </label>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Attach Media</h2>
          </div>
          <div className="grid two">
            <div className="uploader">
              <div className="hint">Upload Photos</div>
              <input type="file" accept="image/*" multiple onChange={(e)=>setFiles((p)=>({ ...p, images: e.target.files }))} />
            </div>
            <div className="uploader">
              <div className="hint">Record Voice Note</div>
              <input type="file" accept="audio/*" onChange={(e)=>setFiles((p)=>({ ...p, audioNote: e.target.files[0] }))} />
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Location</h2>
          </div>
          <label className="full">
            <span>Location (JSON) – optional</span>
            <textarea rows={3} placeholder='{"lat":12.9,"lng":77.6}' value={form.location} onChange={(e)=>setField('location', e.target.value)} />
          </label>
          <div className="actions-right">
            <button type="button" className="btn ghost" onClick={()=>alert('Using current location is not implemented in this demo.')}>Use Current Location</button>
          </div>
        </section>

        <div className="actions-right">
          <button type="button" className="btn ghost" onClick={()=>window.history.back()}>Cancel</button>
          <button className="btn primary" disabled={saving}>{saving ? 'Submitting…' : 'Submit Complaint'}</button>
        </div>
      </form>
    </div>
  )
}
