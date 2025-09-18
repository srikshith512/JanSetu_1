import { useEffect, useState } from 'react'
import { listIssues } from '../api/client'

export default function MyReports(){
  const [items, setItems] = useState([])
  useEffect(() => { (async()=>{ const res = await listIssues({ page:1, limit:12 }); setItems(res.data) })() }, [])

  return (
    <div className="page">
      <h1 className="page-title">My Complaints Overview</h1>

      <section className="stats-bar">
        <div className="metric"><div className="k">Total Complaints</div><div className="v">{items.length}</div></div>
        <div className="metric"><div className="k">Pending</div><div className="v">{items.filter(x=>x.status==='pending').length}</div></div>
        <div className="metric"><div className="k">In Progress</div><div className="v">{items.filter(x=>x.status==='in_progress').length}</div></div>
        <div className="metric"><div className="k">Resolved</div><div className="v">{items.filter(x=>x.status==='resolved').length}</div></div>
      </section>

      <h2>My Recent Reports</h2>
      <div className="card-grid">
        {items.map((it)=> (
          <article key={it.id} className="card report">
            <div className="card-head">
              <span className={`pill ${pillByStatus(it.status)}`}>{labelByStatus(it.status)}</span>
              <span className="date">{new Date(it.createdAt).toISOString().slice(0,10)}</span>
            </div>
            <h3 className="title">{it.trackingId}: {it.category}</h3>
            <p className="muted">{it.description}</p>
            <div className="meta">
              <span className="pill neutral">{it.location?.name || '—'}</span>
            </div>
            <div className="progress"><div className={`bar ${barByStatus(it.status)}`} style={{width: pctByStatus(it.status)}} /></div>
            <div className="actions-row">
              <button className="btn ghost">View Details</button>
              <button className="btn primary">Update Report</button>
            </div>
          </article>
        ))}
      </div>
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
function barByStatus(s){
  switch(s){
    case 'pending': return 'warn'
    case 'in_progress': return 'info'
    case 'resolved': return 'success'
    default: return 'neutral'
  }
}
function pctByStatus(s){
  switch(s){
    case 'pending': return '20%'
    case 'in_progress': return '60%'
    case 'resolved': return '100%'
    default: return '0%'
  }
}
