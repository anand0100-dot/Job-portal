import { useState } from 'react';
import { loginUser } from '../api';

export default function LoginForm({ currentUser, onLogin, onLogout }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password) {
      setStatus({ loading: false, error: 'Please enter both email and password.', success: '' });
      return;
    }

    setStatus({ loading: true, error: '', success: '' });

    try {
      const data = await loginUser({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      setStatus({
        loading: false,
        error: '',
        success: `Welcome back, ${data.user.name}!`,
      });

      if (onLogin) {
        onLogin(data.user, data.token);
      }
    } catch (err) {
      setStatus({
        loading: false,
        error: err.message || 'Login failed. Please check your credentials.',
        success: '',
      });
    }
  };

  if (currentUser) {
    return (
      <section id="login" className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-7 col-lg-5">
              <div className="card login-card border-0 shadow-sm text-center p-4 p-lg-5">
                <div className="login-icon mx-auto mb-3">
                  <i className="bi bi-person-check-fill text-success" />
                </div>
                <h3 className="h4">You are logged in</h3>
                <p className="text-secondary mb-3">
                  Signed in as <strong>{currentUser.name}</strong> ({currentUser.email})
                </p>
                <div className="d-flex justify-content-center gap-2">
                  <a href="#jobs" className="btn btn-primary">Browse Jobs</a>
                  <button className="btn btn-outline-danger" onClick={onLogout}>
                    <i className="bi bi-box-arrow-right me-1" /> Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="login" className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="card login-card border-0 shadow-sm">
              <div className="card-body p-4 p-lg-5">
                <div className="text-center mb-4">
                  <div className="login-icon">
                    <i className="bi bi-person-circle" />
                  </div>
                  <h2 className="h3 mt-3">Welcome back</h2>
                  <p className="text-secondary mb-0">Log in to manage your job search.</p>
                </div>

                {status.success && (
                  <div className="alert alert-success d-flex align-items-center mb-3">
                    <i className="bi bi-check-circle-fill me-2" />
                    <div>{status.success}</div>
                  </div>
                )}

                {status.error && (
                  <div className="alert alert-danger d-flex align-items-center mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-2" />
                    <div>{status.error}</div>
                  </div>
                )}

                <form noValidate onSubmit={submit}>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      className="form-control"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      disabled={status.loading}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Password</label>
                    <input
                      className="form-control"
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Enter your password"
                      disabled={status.loading}
                    />
                  </div>

                  <button
                    className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                    type="submit"
                    disabled={status.loading}
                  >
                    {status.loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </button>
                </form>

                <p className="text-center text-secondary small mt-4 mb-0">
                  New here? <a href="#register" className="text-primary fw-semibold">Create an account</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
