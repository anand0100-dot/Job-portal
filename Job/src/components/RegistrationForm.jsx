import { useState } from 'react';
import { registerUser } from '../api';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'jobseeker',
};

export default function RegistrationForm({ onRegistered }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setStatus({ ...status, error: '', success: '' });
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};

    if (!form.name.trim()) next.name = 'Full name is required.';
    if (!form.email.trim()) {
      next.email = 'Email address is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = 'Enter a valid email address.';
    }
    if (!form.password) {
      next.password = 'Password is required.';
    } else if (form.password.length < 6) {
      next.password = 'Password must be at least 6 characters.';
    }
    if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Passwords do not match.';
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus({ loading: true, error: '', success: '' });

    try {
      const data = await registerUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      });

      setStatus({
        loading: false,
        error: '',
        success: data.message || 'Account created successfully! You can now log in.',
      });

      if (onRegistered) {
        onRegistered({ email: form.email, password: form.password });
      }

      setForm(emptyForm);
    } catch (err) {
      setStatus({
        loading: false,
        error: err.message || 'Failed to create account.',
        success: '',
      });
    }
  };

  return (
    <section id="register" className="py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="section-heading text-center mb-4">
              <span className="text-primary fw-semibold">CREATE YOUR ACCOUNT</span>
              <h2 className="mt-2">Your career journey begins here</h2>
              <p className="text-secondary">Register in a minute and start finding meaningful work.</p>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-lg-5">
                {status.success && (
                  <div className="alert alert-success d-flex align-items-center mb-4">
                    <i className="bi bi-check-circle-fill fs-5 me-2" />
                    <div>
                      {status.success}{' '}
                      <a href="#login" className="fw-bold text-success text-decoration-underline ms-1">
                        Go to Login &rarr;
                      </a>
                    </div>
                  </div>
                )}

                {status.error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4">
                    <i className="bi bi-exclamation-triangle-fill fs-5 me-2" />
                    <div>{status.error}</div>
                  </div>
                )}

                <form noValidate onSubmit={submit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="reg-name">Full Name</label>
                      <input
                        id="reg-name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={change}
                        placeholder="e.g. Rahul Sharma"
                        disabled={status.loading}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label" htmlFor="reg-email">Email Address</label>
                      <input
                        id="reg-email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={change}
                        placeholder="e.g. rahul@example.com"
                        disabled={status.loading}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label" htmlFor="reg-password">Password</label>
                      <input
                        id="reg-password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={change}
                        placeholder="At least 6 characters"
                        disabled={status.loading}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label" htmlFor="reg-confirmPassword">Confirm Password</label>
                      <input
                        id="reg-confirmPassword"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={change}
                        placeholder="Repeat your password"
                        disabled={status.loading}
                      />
                      {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label d-block">Account Type</label>
                      <div className="d-flex gap-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="role"
                            id="role-jobseeker"
                            value="jobseeker"
                            checked={form.role === 'jobseeker'}
                            onChange={change}
                            disabled={status.loading}
                          />
                          <label className="form-check-label" htmlFor="role-jobseeker">
                            Job Seeker
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="role"
                            id="role-employer"
                            value="employer"
                            checked={form.role === 'employer'}
                            onChange={change}
                            disabled={status.loading}
                          />
                          <label className="form-check-label" htmlFor="role-employer">
                            Employer (Hire Talent)
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 mt-4">
                      <button
                        className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                        type="submit"
                        disabled={status.loading}
                      >
                        {status.loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Create Account <i className="bi bi-arrow-right ms-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                <p className="text-center text-secondary small mt-4 mb-0">
                  Already have an account? <a href="#login" className="text-primary fw-semibold">Log in here</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
