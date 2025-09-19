import { Link, NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="logo">JanSetu</div>
        <nav className="side-nav">
          <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/my-reports" className={({isActive}) => isActive ? 'active' : ''}>My Reports</NavLink>
          <NavLink to="/map" className={({isActive}) => isActive ? 'active' : ''}>Map View</NavLink>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Admin Dashboard</NavLink>
        </nav>
        <div className="side-actions">
          <button className="btn secondary">Profile</button>
          <button className="btn danger">Logout</button>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="menu">
            <Link to="/">Home</Link>
            <Link to="/my-reports">My Reports</Link>
            <Link to="/map">Map View</Link>
            <Link to="/dashboard">Admin Dashboard</Link>
          </div>
          <div className="actions">
            <button className="link">Notifications</button>
            <button className="link">User Profile</button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
        <footer className="footer">
          <div>Quick Links</div>
          <div>Resources</div>
          <div>Legal</div>
        </footer>
      </div>
    </div>
  )
}
