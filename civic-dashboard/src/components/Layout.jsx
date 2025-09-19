import { Link, NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="logo">JanSetu</div>
        <nav className="side-nav">
          <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Home</span>
          </NavLink>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/my-reports" className={({isActive}) => isActive ? 'active' : ''}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>My Reports</span>
          </NavLink>
          <NavLink to="/map" className={({isActive}) => isActive ? 'active' : ''}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
              <line x1="8" y1="2" x2="8" y2="18"></line>
              <line x1="16" y1="6" x2="16" y2="22"></line>
            </svg>
            <span>Map View</span>
          </NavLink>
        </nav>
        
        <div className="user-section">
          <div className="user-info">
            <div className="avatar">UN</div>
            <div>
              <div className="user-name">User Name</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
          <button className="btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="user-actions">
            <button className="btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <div className="divider"></div>
            <div className="user-menu">
              <span className="user-greeting">Hi, User</span>
              <div className="avatar small">UN</div>
            </div>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>

        <footer className="footer">
          <div>© 2025 JanSetu. All rights reserved.</div>
        </footer>
      </div>
    </div>
  )
}
