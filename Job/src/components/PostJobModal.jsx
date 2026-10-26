import { useState, useEffect } from 'react';
import { createJob } from '../api';

export default function PostJobModal({
  isOpen,
  onClose,
  currentUser,
  authToken,
  onJobCreated,
  onRequireLogin,
}) {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    skills: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm({
        title: '',
        company: currentUser?.role === 'employer' ? currentUser.name : '',
        location: '',
        salary: '',
        skills: '',
        description: '',
      });
      setError('');
      setSuccess('');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const isEmployer = currentUser && currentUser.role === 'employer';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !authToken) {
      setError('You must be logged in as an employer to post a job.');
      return;
    }

    if (currentUser.role !== 'employer') {
      setError('Access Denied: Only accounts registered with the Employer role can post jobs.');
      return;
    }

    if (!form.title.trim() || !form.company.trim() || !form.description.trim()) {
      setError('Job Title, Company Name, and Description are required fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim() || 'Remote',
        description: form.description.trim(),
        salary: form.salary.trim() || 'Best in Industry',
        skills: form.skills.trim() || 'General',
      };

      const res = await createJob(payload, authToken);

      setSuccess('Job posted successfully! Your listing is now live.');
      setLoading(false);

      if (onJobCreated) {
        onJobCreated({
          id: res.jobId || Date.now(),
          ...payload,
          created_at: new Date().toISOString(),
        });
      }

      // Reset form after short delay and close modal
      setTimeout(() => {
        setForm({
          title: '',
          company: '',
          location: '',
          salary: '',
          skills: '',
          description: '',
        });
        setSuccess('');
        onClose();
      }, 1200);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to post job. Please verify your permissions and try again.');
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
          <div className="modal-header bg-dark text-white p-4">
            <div>
              <span className="badge bg-primary px-2 py-1 mb-1">Employer Portal</span>
              <h4 className="modal-title fw-bold text-white mb-0">Post a New Job Opportunity</h4>
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
            {/* Case 1: Unauthenticated */}
            {!currentUser && (
              <div className="text-center py-4">
                <i className="bi bi-lock-fill text-warning fs-1 mb-3 d-block" />
                <h5 className="fw-bold">Employer Login Required</h5>
                <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '420px' }}>
                  You must be signed in with an <strong>Employer</strong> account to publish job openings to the portal.
                </p>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-3"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <a
                    href="#login"
                    className="btn btn-primary px-4"
                    onClick={() => {
                      onClose();
                      if (onRequireLogin) onRequireLogin();
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right me-1" /> Log In
                  </a>
                </div>
              </div>
            )}

            {/* Case 2: Authenticated but Role is Jobseeker */}
            {currentUser && !isEmployer && (
              <div className="text-center py-4">
                <i className="bi bi-shield-x text-danger fs-1 mb-3 d-block" />
                <h5 className="fw-bold text-danger">Employer Authorization Required</h5>
                <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '450px' }}>
                  Your current account (<strong>{currentUser.email}</strong>) is registered as a{' '}
                  <span className="badge bg-secondary">Job Seeker</span>. Only verified employers can create job postings.
                </p>
                <p className="small text-muted mb-4">
                  To post jobs, please register or log in with an <strong>Employer</strong> account.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={onClose}
                >
                  Understood
                </button>
              </div>
            )}

            {/* Case 3: Authenticated Employer */}
            {isEmployer && (
              <>
                {success && (
                  <div className="alert alert-success d-flex align-items-center mb-4 shadow-sm">
                    <i className="bi bi-check-circle-fill fs-5 me-2" />
                    <div>{success}</div>
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4 shadow-sm">
                    <i className="bi bi-exclamation-triangle-fill fs-5 me-2" />
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Job Title *</label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="e.g. Senior Backend Engineer"
                        value={form.title}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Company Name *</label>
                      <input
                        type="text"
                        name="company"
                        className="form-control"
                        placeholder="e.g. Tech Solutions Pvt Ltd"
                        value={form.company}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Location</label>
                      <input
                        type="text"
                        name="location"
                        className="form-control"
                        placeholder="e.g. Chandigarh, Mohali, Remote"
                        value={form.location}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Salary Range</label>
                      <input
                        type="text"
                        name="salary"
                        className="form-control"
                        placeholder="e.g. 6-10 LPA"
                        value={form.salary}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Required Skills</label>
                      <input
                        type="text"
                        name="skills"
                        className="form-control"
                        placeholder="e.g. Node.js, Express, MySQL, REST APIs"
                        value={form.skills}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <small className="text-secondary">Separate skills with commas</small>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Job Description *</label>
                      <textarea
                        name="description"
                        rows="4"
                        className="form-control"
                        placeholder="Describe key responsibilities, role expectations, and technical qualifications..."
                        value={form.description}
                        onChange={handleChange}
                        required
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
                          Publishing to MySQL...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill" /> Publish Job Listing
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
