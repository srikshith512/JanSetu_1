export default function MapView(){
  return (
    <div className="page">
      <h1 className="page-title">Interactive Issue Map</h1>

      <div className="grid two-70-30">
        <section className="panel">
          <div className="map-placeholder">Map view placeholder</div>
        </section>
        <aside className="panel sticky">
          <h3>Filter Issues</h3>
          <div className="grid one">
            <label>
              <span>Category</span>
              <select>
                <option>All Categories</option>
                <option>Roads</option>
                <option>Sanitation</option>
                <option>Water Supply</option>
                <option>Electricity</option>
              </select>
            </label>
            <label>
              <span>Priority</span>
              <select>
                <option>All Priorities</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
            <label>
              <span>Status</span>
              <select>
                <option>All Statuses</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Rejected</option>
              </select>
            </label>
            <button className="btn primary">Apply Filters</button>
          </div>

          <div className="panel mt">
            <h3>Issue Distribution</h3>
            <div className="chart-placeholder">Chart placeholder</div>
          </div>
        </aside>
      </div>
    </div>
  )
}
