import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import IssueList from './pages/IssueList.jsx'
import IssueDetail from './pages/IssueDetail.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MyReports from './pages/MyReports.jsx'
import MapView from './pages/MapView.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}> 
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/map" element={<MapView />} />

        {/* Existing admin views */}
        <Route path="/issues" element={<IssueList />} />
        <Route path="/issues/:id" element={<IssueDetail />} />
      </Route>
    </Routes>
  )
}
