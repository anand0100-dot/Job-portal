import { useState } from 'react';

export default function Navbar({ currentUser, onLogout, isBackendOnline }) {
  const [showServerModal, setShowServerModal] = useState(false);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom py-3">
        <div className="container">
          <a className="navbar-brand fw-bold text-primary fs-4" href="#home">
            <i className="bi bi-briefcase-fill me-2" />JobPortal
          </a>

          {/* Backend Status Indicator */}
          <div className="d-flex align-items-center me-auto ms-2">
            <button
              type="button"
              className={`btn btn-sm py-1 px-2 border-0 rounded-pill d-flex align-items-center gap-1 ${
                isBackendOnline
                  ? 'bg-success-subtle text-success'
                  : 'bg-warning-subtle text-dark'
              }`}
              style={{ fontSize: '0.78rem', cursor: 'pointer' }}
              onClick={() => setShowServerModal(true)}
              title="Click for Server Status & Antigravity background guide"
            >
              <span
                className={`spinner-grow spinner-grow-sm ${isBackendOnline ? 'text-success' : 'text-warning'}`}
                style={{ width: '7px', height: '7px' }}
              />
              <span>{isBackendOnline ? 'MySQL Backend Connected' : 'Offline Mode'}</span>
              <i className="bi bi-info-circle ms-1" style={{ fontSize: '0.75rem' }} />
            </button>
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              <li className="nav-item"><a className="nav-link" href="#home">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#jobs">Jobs</a></li>
              <li className="nav-item"><a className="nav-link" href="#profile">Profile</a></li>
              <li className="nav-item"><a className="nav-link" href="#applications">Applications</a></li>

              {currentUser ? (
                <li className="nav-item d-flex align-items-center gap-2 ms-lg-3 mt-2 mt-lg-0">
                  <span className="badge bg-light text-dark border px-3 py-2 d-flex align-items-center gap-1">
                    <i className="bi bi-person-check-fill text-success" />
                    <span>{currentUser.name}</span>
                    <span className="text-secondary small">({currentUser.role})</span>
                  </span>
                  <button
                    className="btn btn-outline-danger btn-sm px-3"
                    onClick={onLogout}
                    title="Log out"
                  >
                    <i className="bi bi-box-arrow-right me-1" /> Logout
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item ms-lg-2">
                    <a className="btn btn-outline-primary px-3 mt-2 mt-lg-0" href="#login">
                      Login
                    </a>
                  </li>
                  <li className="nav-item ms-lg-1">
                    <a className="btn btn-primary px-3 mt-2 mt-lg-0" href="#register">
                      Register
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Server Status & Help Modal */}
      {showServerModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowServerModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center gap-2">
                  <i className="bi bi-hdd-network-fill text-primary" />
                  Backend Server Information
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowServerModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className={`alert ${isBackendOnline ? 'alert-success' : 'alert-warning'} mb-3`}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <i className={`bi ${isBackendOnline ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} fs-5`} />
                    <strong>
                      Status: {isBackendOnline ? 'Backend Online (Port 5000)' : 'Backend Offline (Running in Offline Mode)'}
                    </strong>
                  </div>
                  <p className="small mb-0">
                    {isBackendOnline
                      ? 'Express server and MySQL database are active. All data syncs directly with MySQL.'
                      : 'Antigravity close hone par terminal server stop ho jata hai. App offline mode me local storage ke sath smoothly chal rhi hai.'}
                  </p>
                </div>

                <h6 className="fw-bold mt-3 mb-2">
                  Antigravity close hone ke baad bhi server kaise chalayein?
                </h6>
                <p className="small text-secondary mb-2">
                  Aap terminal me background runner script chala sakte hain, jisse Antigravity band karne par bhi server chalta rahega:
                </p>

                <div className="bg-dark text-light p-3 rounded font-monospace small mb-3">
                  <div className="text-secondary mb-1"># Background me Backend + Frontend start karne ke liye:</div>
                  <div className="text-warning">npm run start:bg</div>
                  <div className="text-secondary mt-2 mb-1"># Status check karne ke liye:</div>
                  <div className="text-info">npm run status</div>
                  <div className="text-secondary mt-2 mb-1"># Stop karne ke liye:</div>
                  <div className="text-danger">npm run stop:bg</div>
                </div>

                <div className="small text-muted">
                  <i className="bi bi-lightbulb-fill text-warning me-1" />
                  <strong>Tip:</strong> Ab app offline mode me bhi register/login/apply support karti hai, isliye kabhi bhi <code>Failed to fetch</code> error screen par show nahi hoga.
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowServerModal(false)}
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
