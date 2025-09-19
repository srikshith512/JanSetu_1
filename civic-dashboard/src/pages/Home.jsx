import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-panel">
        <div className="hero-content">
          <h1>Welcome to JanSetu</h1>
          <p className="hero-subtitle">Bridging the gap between citizens and government services through seamless communication and efficient issue resolution</p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn primary">Admin Dashboard</Link>
            <Link to="/map" className="btn outline">View Map</Link>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="panel">
        <h2>Our Vision</h2>
        <div className="about-grid">
          <div className="about-card">
            <h3>For Citizens</h3>
            <p>Easily report issues, track progress, and engage with local governance. Your voice matters in building better communities.</p>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <span>Simple reporting through mobile app</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔄</span>
                <span>Real-time status updates</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🗺️</span>
                <span>Interactive map view</span>
              </div>
            </div>
          </div>
          
          <div className="about-card">
            <h3>For Government</h3>
            <p>Streamline service delivery with our comprehensive administration tools designed for efficient governance.</p>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Centralized dashboard</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Quick issue assignment</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📈</span>
                <span>Performance analytics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Quick Actions */}
      <section className="panel">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/dashboard/issues" className="action-card primary">
            <span>📋</span>
            <span>Manage Issues</span>
          </Link>
          <Link to="/dashboard/analytics" className="action-card">
            <span>📊</span>
            <span>View Analytics</span>
          </Link>
          <Link to="/dashboard/users" className="action-card">
            <span>👥</span>
            <span>User Management</span>
          </Link>
          <Link to="/dashboard/settings" className="action-card">
            <span>⚙️</span>
            <span>System Settings</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
