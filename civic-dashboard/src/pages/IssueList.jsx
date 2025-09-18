import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listIssues, getStats } from '../api/client.js'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default function IssueList() {
  const [items, setItems] = useState([])
  const [stats, setStats] = useState({ byStatus: [], byCategory: [] })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')
  const [total, setTotal] = useState(0)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit])

  async function load() {
    setLoading(true)
    try {
      const res = await listIssues({ page, limit, q, status, category, priority })
      setItems(res.data)
      setTotal(res.pagination.total)
      const s = await getStats()
      setStats(s)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page, limit])

  function onSearch(e) {
    e.preventDefault()
    setPage(1)
    load()
  }

  async function collectAll() {
    // Pull up to 1000 items with current filters for export
    const res = await listIssues({ page: 1, limit: 1000, q, status, category, priority, sort: 'createdAt', order: 'DESC' })
    return res.data
  }

  function toRows(data){
    return data.map((it) => ([
      it.trackingId,
      it.category,
      it.status === 'in_progress' ? 'In Progress' : (it.status?.[0]?.toUpperCase() + it.status?.slice(1)),
      it.priority?.[0]?.toUpperCase() + it.priority?.slice(1),
      it.location?.name || '',
      new Date(it.createdAt).toISOString().slice(0,10),
      it.assignedTo || '',
      it.description,
    ]))
  }

  async function exportExcel(){
    const data = await collectAll()
    const header = ['Complaint ID','Category','Status','Priority','Location','Reported On','Assigned To','Description']
    const ws = XLSX.utils.aoa_to_sheet([header, ...toRows(data)])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Issues')
    XLSX.writeFile(wb, 'issues_export.xlsx')
  }

  async function exportPDF(){
    const data = await collectAll()
    const doc = new jsPDF({ orientation: 'landscape' })
    doc.setFontSize(14)
    doc.text('Issues Export', 14, 16)
    doc.autoTable({
      startY: 20,
      head: [['Complaint ID','Category','Status','Priority','Location','Reported On','Assigned To','Description']],
      body: toRows(data),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37,99,235] },
      columnStyles: { 7: { cellWidth: 80 } },
      didDrawPage: (d) => {
        const str = 'Generated ' + new Date().toLocaleString()
        doc.setFontSize(8); doc.text(str, d.settings.margin.left, doc.internal.pageSize.getHeight() - 6)
      }
    })
    doc.save('issues_export.pdf')
  }

  return (
    <div className="page">
      <section className="toolbar">
        <form onSubmit={onSearch} className="filters">
          <input placeholder="Search (desc/category/tracking)" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
          <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit">Apply</button>
        </form>
        <div className="actions-right">
          <button className="btn" onClick={exportExcel}>Export Excel</button>
          <button className="btn" onClick={exportPDF}>Export PDF</button>
        </div>
        <div className="stats">
          <strong>By Status:</strong>{' '}
          {stats.byStatus.map((s) => (
            <span key={s.status} className="chip">{s.status}: {s.count}</span>
          ))}
        </div>
      </section>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Tracking</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>{it.trackingId}</td>
                <td>{it.category}</td>
                <td>{it.priority}</td>
                <td>{it.status}</td>
                <td className="ellipsis" title={it.description}>{it.description}</td>
                <td>
                  <Link to={`/issues/${it.id}`}>Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
        <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1) }}>
          {[10, 20, 50].map((n) => <option key={n} value={n}>{n}/page</option>)}
        </select>
      </div>
    </div>
  )
}
