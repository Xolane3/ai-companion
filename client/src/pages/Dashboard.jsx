import React from "react";

export default function Dashboard() {
  // Example stats, you can replace with actual data from API or context
  const stats = [
    { title: "Total Notes Summarized", value: 128, icon: "📝", bg: "primary" },
    { title: "Active Users", value: 54, icon: "👥", bg: "success" },
    { title: "API Uptime", value: "99.9%", icon: "⚡", bg: "warning" },
    { title: "Pending Requests", value: 7, icon: "⏳", bg: "danger" },
  ];

  return (
    <div className="container mt-5">
      <header className="mb-4 text-center">
        <h1 className="display-4 fw-bold">Welcome Back!</h1>
        <p className="lead text-secondary">Manage your AI Study Companion tools here</p>
      </header>

      {/* Stats Cards */}
      <div className="row mb-4">
        {stats.map(({ title, value, icon, bg }, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-md-3 mb-3">
            <div className={`card text-white bg-${bg} h-100 shadow`}>
              <div className="card-body d-flex align-items-center">
                <div className="me-3 fs-2">{icon}</div>
                <div>
                  <h5 className="card-title">{title}</h5>
                  <h3 className="card-text">{value}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <section className="mb-4">
        <h3 className="mb-3">Quick Actions</h3>
        <div className="d-flex flex-wrap gap-3">
          <button className="btn btn-primary px-4 py-2 shadow-sm">Summarize Notes</button>
          <button className="btn btn-success px-4 py-2 shadow-sm">Chat with Tutor</button>
          <button className="btn btn-warning px-4 py-2 shadow-sm">View History</button>
          <button className="btn btn-info px-4 py-2 shadow-sm text-white">Settings</button>
        </div>
      </section>

      {/* Recent Activity Placeholder */}
      <section>
        <h3 className="mb-3">Recent Activity</h3>
        <div className="card shadow-sm p-3" style={{ minHeight: "150px" }}>
          <p className="text-muted fst-italic">
            No recent activity to show. Start summarizing your notes or chatting with your tutor!
          </p>
        </div>
      </section>
    </div>
  );
}
