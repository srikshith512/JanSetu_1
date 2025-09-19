import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStats, listIssues } from '../api/client'
import StatCard from '../components/StatCard'

export default function Dashboard() {
  const [stats, setStats] = useState({ byStatus: [], byCategory: [] })
  const [recent, setRecent] = useState([])

  useEffect(() => {
    async function load() {
      const s = await getStats()
      setStats(s)
      const res = await listIssues({ page: 1, limit: 5, sort: 'createdAt', order: 'DESC' })
      setRecent(res.data)
    }
    load()
  }, [])

  const total = stats.byStatus.reduce((a, b) => a + (b.count || 0), 0)

  const statusCount = (key) => stats.byStatus.find((s) => s.status === key)?.count || 0

  return (
    <div className="dashboard">
      <h1 className="page-title">Admin Dashboard</h1>

      <section className="stats-grid">
        <StatCard title="Total Complaints" value={total || '—'} subtitle="Overall issues reported" />
        <StatCard title="Pending Review" value={statusCount('pending')} subtitle="Issues awaiting action" />
        <StatCard title="Resolved Issues" value={statusCount('resolved')} subtitle="Completed and closed" />
        <StatCard title="High Priority" value={0} subtitle="Urgent attention required" />
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Recent Complaints</h2>
          <Link to="/issues" className="text-link">View All</Link>
        </div>
        <div className="table-wrap">
          <table className="table light">
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Location</th>
                <th>Reported On</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((it) => (
                <tr key={it.id}>
                  <td>{it.trackingId}</td>
                  <td><span className="pill neutral">{it.category}</span></td>
                  <td><span className={`pill ${pillByStatus(it.status)}`}>{labelByStatus(it.status)}</span></td>
                  <td><span className={`pill ${pillByPriority(it.priority)}`}>{labelByPriority(it.priority)}</span></td>
                  <td>{it.location?.name || '-'}</td>
                  <td>{new Date(it.createdAt).toISOString().slice(0,10)}</td>
                  <td>{it.assignedTo || 'N/A'}</td>
                  <td><Link to={`/issues/${it.id}`} className="text-link">Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function pillByStatus(s){
  switch(s){
    case 'pending': return 'warn'
    case 'in_progress': return 'info'
    case 'resolved': return 'success'
    case 'rejected': return 'danger'
    default: return 'neutral'
  }
}
function labelByStatus(s){
  return s === 'in_progress' ? 'In Progress' : s?.charAt(0).toUpperCase() + s?.slice(1)
}
function pillByPriority(p){
  switch(p){
    case 'high': return 'danger'
    case 'medium': return 'warn'
    case 'low': return 'success'
    default: return 'neutral'
  }
}
function labelByPriority(p){
  return p?.charAt(0).toUpperCase() + p?.slice(1)
}
