export default function StatCard({ title, value, subtitle, icon, onClick }) {
  return (
    <div className="card stat" onClick={onClick} role="button">
      <div className="stat-top">
        <div className="stat-title">{title}</div>
        {icon ? <div className="stat-icon">{icon}</div> : null}
      </div>
      <div className="stat-value">{value}</div>
      {subtitle ? <div className="stat-sub">{subtitle}</div> : null}
      <button className="text-link">View Details</button>
    </div>
  )
}
