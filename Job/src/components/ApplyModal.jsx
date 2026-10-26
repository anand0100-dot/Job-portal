import { useState, useEffect } from 'react';
import { applyJob } from '../api';

export default function ApplyModal({
  job,
  currentUser,
  authToken,
  isOpen,
  onClose,
  onSubmitSuccess,
  onRequireLogin,
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '1-3 years',
    coverNote: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  // Pre-fill with current user details when opened
  useEffect(() => {
    if (job) {
      setFormData({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: '',
        experience: '1-3 years',
        coverNote: '',
      });
      setErrors({});
      setApiError('');
      setApiSuccess('');
    }
  }, [job, currentUser]);

  if (!isOpen || !job) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !authToken) {
      setApiError('You must be logged in to apply for this job.');
      return;
    }

    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Full Name is required.';
    if (!formData.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setApiError('');
    setApiSuccess('');

    try {
      const res = await applyJob(job.id, authToken);
      setApiSuccess(res.message || 'Job application submitted successfully!');
      setLoading(false);

      if (onSubmitSuccess) {
        onSubmitSuccess({
          id: job.id,
          job_id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          skills: job.skills,
          applied_at: new Date().toISOString(),
          status: 'Applied',
        });
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setLoading(false);
      if (err.status === 409 || (err.message && err.message.toLowerCase().includes('already'))) {
        setApiError('You have already submitted an application for this position.');
      } else if (err.status === 401) {
        setApiError('Your session has expired. Please log in again to apply.');
      } else {
        setApiError(err.message || 'Failed to submit application.');
      }
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-primary text-white p-4">
            <div>
              <span className="badge bg-white text-primary px-2 py-1 mb-1">Applying for Position</span>
              <h4 className="modal-title fw-bold text-white mb-0">{job.title}</h4>
              <small className="text-white-50">
                {job.company} · {job.location || 'Remote'} · {job.salary || 'Best in Industry'}
              </small>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
              disabled={loading}
            />
          </div>

          <div className="modal-body p-4 p-md-5">
            {/* Case: Not logged in */}
            {!currentUser && (
              <div className="text-center py-4">
                <i className="bi bi-box-arrow-in-right text-primary fs-1 mb-3 d-block" />
                <h5 className="fw-bold">Login Required to Apply</h5>
                <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '420px' }}>
                  Please sign in or register an account before applying for <strong>{job.title}</strong> at {job.company}.
                </p>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-3"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <a
                    href="#login"
                    className="btn btn-primary px-4"
                    onClick={() => {
                      onClose();
                      if (onRequireLogin) onRequireLogin();
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right me-1" /> Log In Now
                  </a>
                </div>
              </div>
            )}

            {/* Case: Logged in */}
            {currentUser && (
              <>
                {apiSuccess && (
                  <div className="alert alert-success d-flex align-items-center mb-4 shadow-sm">
                    <i className="bi bi-check-circle-fill fs-5 me-2" />
                    <div>{apiSuccess}</div>
                  </div>
                )}

                {apiError && (
                  <div className="alert alert-danger d-flex align-items-center mb-4 shadow-sm">
                    <i className="bi bi-exclamation-triangle-fill fs-5 me-2" />
                    <div>{apiError}</div>
                  </div>
                )}

                <div className="card bg-light border-0 rounded-3 p-3 mb-4">
                  <div className="row g-2 small">
                    <div className="col-sm-6">
                      <strong>Required Skills:</strong> {job.skills || 'Not specified'}
                    </div>
                    <div className="col-sm-6">
                      <strong>Compensation:</strong> {job.salary || 'Competitive'}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Years of Experience</label>
                      <select
                        name="experience"
                        className="form-select"
                        value={formData.experience}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option>Fresher (0 years)</option>
                        <option>1-3 years</option>
                        <option>3-5 years</option>
                        <option>5+ years</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Cover Note / Brief Pitch</label>
                      <textarea
                        name="coverNote"
                        rows="3"
                        className="form-control"
                        placeholder="Why are you a great match for this position?"
                        value={formData.coverNote}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4 d-flex align-items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" />
                          Submitting to MySQL...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill" /> Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
