import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getIssue, updateIssue } from '../api/client.js'

export default function IssueDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const [issue, setIssue] = useState(null)
  const [form, setForm] = useState({})
  const [files, setFiles] = useState({ images: null, audioNote: null })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const data = await getIssue(id)
      setIssue(data)
      setForm({
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo || '',
        category: data.category,
        description: data.description,
        location: data.location || null,
        contactInfo: data.contactInfo || null,
        reportedBy: data.reportedBy || '',
      })
    }
    load()
  }, [id])

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function onSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form }
      if (payload.location && typeof payload.location !== 'string') payload.location = JSON.stringify(payload.location)
      if (payload.contactInfo && typeof payload.contactInfo !== 'string') payload.contactInfo = JSON.stringify(payload.contactInfo)
      const updated = await updateIssue(id, payload, files)
      setIssue(updated)
      alert('Saved')
    } catch (e) {
      alert('Failed to save: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  if (!issue) return <div>Loading...</div>

  return (
    <div className="page">
      <button onClick={() => nav(-1)}>&larr; Back</button>
      <h2>Issue {issue.trackingId}</h2>
      <form className="detail-form" onSubmit={onSave}>
        <label>
          Status
          <select value={form.status} onChange={(e) => setField('status', e.target.value)}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
        <label>
          Priority
          <select value={form.priority} onChange={(e) => setField('priority', e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label>
          Assigned To
          <input value={form.assignedTo} onChange={(e) => setField('assignedTo', e.target.value)} />
        </label>
        <label>
          Category
          <input value={form.category} onChange={(e) => setField('category', e.target.value)} />
        </label>
        <label>
          Reported By
          <input value={form.reportedBy} onChange={(e) => setField('reportedBy', e.target.value)} />
        </label>
        <label>
          Description
          <textarea rows={4} value={form.description} onChange={(e) => setField('description', e.target.value)} />
        </label>
        <label>
          Location (JSON)
          <textarea rows={3} value={typeof form.location === 'string' ? form.location : JSON.stringify(form.location || {})}
            onChange={(e) => setField('location', e.target.value)} />
        </label>
        <label>
          Contact Info (JSON)
          <textarea rows={3} value={typeof form.contactInfo === 'string' ? form.contactInfo : JSON.stringify(form.contactInfo || {})}
            onChange={(e) => setField('contactInfo', e.target.value)} />
        </label>

        <div className="uploads">
          <label>
            Add Images
            <input type="file" multiple accept="image/*" onChange={(e) => setFiles((f) => ({ ...f, images: e.target.files }))} />
          </label>
          <label>
            Audio Note
            <input type="file" accept="audio/*" onChange={(e) => setFiles((f) => ({ ...f, audioNote: e.target.files[0] }))} />
          </label>
        </div>

        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </form>

      <section>
        <h3>Images</h3>
        <div className="gallery">
          {(issue.images || []).map((img, i) => (
            <a key={i} href={img.url} target="_blank">
              <img src={img.url} alt="uploaded" />
            </a>
          ))}
        </div>
        {issue.audioNote && (
          <div>
            <h3>Audio Note</h3>
            <audio controls src={issue.audioNote} />
          </div>
        )}
      </section>
    </div>
  )
}
