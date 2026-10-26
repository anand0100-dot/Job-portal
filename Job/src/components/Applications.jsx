import { useState, useEffect, useCallback } from 'react';
import { fetchMyApplications } from '../api';

export default function Applications({
  currentUser,
  authToken,
  onRequireLogin,
  onLogout,
  refreshTrigger,
}) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  const loadApplications = useCallback(async () => {
    if (!authToken || !currentUser) {
      setApplications([]);
      setError('');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchMyApplications(authToken);
      setApplications(data);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        setError('Your session has expired or is invalid. Please log in again.');
        if (onLogout) onLogout();
      } else {
        setError(err.message || 'Unable to load applications from server.');
      }
    } finally {
      setLoading(false);
    }
  }, [authToken, currentUser, onLogout]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications, refreshTrigger]);

  const getStatusBadge = (status) => {
    const s = (status || 'Applied').toLowerCase();
    if (s.includes('select')) return 'bg-success';
    if (s.includes('review')) return 'bg-warning text-dark';
    if (s.includes('reject')) return 'bg-danger';
    return 'bg-primary';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="applications" className="py-5">
      <div className="container">
        <div className="section-heading mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-end gap-3">
          <div>
            <span className="text-primary fw-semibold">MY APPLICATIONS</span>
            <h2 className="mt-2 mb-0">Your Application Tracker</h2>
            <p className="text-secondary mb-0">
              Track the roles you have applied for, interview stages, and statuses directly from the database.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            {currentUser && (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                onClick={loadApplications}
                disabled={loading}
                title="Refresh application statuses"
              >
                <i className={`bi bi-arrow-clockwise ${loading ? 'spinner-border spinner-border-sm' : ''}`} />
                <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            )}
            {currentUser && applications.length > 0 && (
              <span className="badge bg-primary fs-6 px-3 py-2 rounded-pill">
                {applications.length} {applications.length === 1 ? 'Application' : 'Applications'}
              </span>
            )}
          </div>
        </div>

        {/* Not Logged In State */}
        {!currentUser && (
          <div className="card border-0 shadow-sm rounded-4 text-center p-5 bg-light">
            <i className="bi bi-shield-lock-fill fs-1 text-primary mb-3" />
            <h3 className="h4 fw-bold">Login Required</h3>
            <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '480px' }}>
              Your applications are secured. Please log in with your JobPortal account to view your application history and statuses.
            </p>
            <div>
              <a
                href="#login"
                className="btn btn-primary px-4 py-2"
                onClick={onRequireLogin}
              >
                <i className="bi bi-box-arrow-in-right me-1" /> Log In to Track Applications
              </a>
            </div>
          </div>
        )}

        {/* Logged in: Error State */}
        {currentUser && error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center rounded-3 mb-4 shadow-sm">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill fs-5" />
              <span>{error}</span>
            </div>
            <button className="btn btn-outline-danger btn-sm" onClick={loadApplications}>
              Try Again
            </button>
          </div>
        )}

        {/* Logged in: Loading State */}
        {currentUser && loading && !applications.length && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-secondary small">Fetching your latest applications from database...</p>
          </div>
        )}

        {/* Logged in: Has Applications */}
        {currentUser && applications.length > 0 && (
          <div className="row g-4">
            {applications.map((app) => (
              <div className="col-md-6 col-lg-4" key={app.id}>
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden application-card p-3">
                  <div className="d-flex align-items-start gap-3">
                    <div className="company-mark flex-shrink-0">
                      {app.company ? app.company[0].toUpperCase() : 'J'}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h3 className="h6 fw-bold mb-1 text-truncate" style={{ maxWidth: '170px' }}>
                          {app.title}
                        </h3>
                        <span className={`badge ${getStatusBadge(app.status)}`}>
                          {app.status || 'Applied'}
                        </span>
                      </div>
                      <p className="text-secondary small mb-2">
                        {app.company} · {app.location || 'Remote'}
                      </p>

                      {app.salary && (
                        <div className="text-secondary small mb-1">
                          <i className="bi bi-cash-stack me-1 text-success" />
                          <span>{app.salary}</span>
                        </div>
                      )}

                      {app.skills && (
                        <div className="text-secondary small mb-2 text-truncate" title={app.skills}>
                          <i className="bi bi-tools me-1 text-primary" />
                          <span>{app.skills}</span>
                        </div>
                      )}

                      <div className="d-flex justify-content-between align-items-center text-muted small mt-3 pt-2 border-top">
                        <span>
                          <i className="bi bi-calendar3 me-1" />
                          {formatDate(app.applied_at)}
                        </span>
                        <span className="badge bg-light text-secondary border">
                          App #{app.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Logged in: Empty State */}
        {currentUser && !loading && !error && applications.length === 0 && (
          <div className="empty-applications text-center rounded-4 p-5 bg-light">
            <i className="bi bi-send-check fs-1 text-primary" />
            <h3 className="h5 mt-3 fw-bold">No Applications Yet</h3>
            <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '440px' }}>
              You haven&apos;t applied to any job postings yet. Find a role that matches your skills and submit your application today.
            </p>
            <a href="#jobs" className="btn btn-primary px-4">
              <i className="bi bi-search me-1" /> Browse Available Jobs
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
