export default function Profile({ currentUser, onLogout, onRequireLogin }) {
  if (!currentUser) {
    return (
      <section id="profile" className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 text-center p-5 bg-light">
                <i className="bi bi-person-x-fill fs-1 text-primary mb-3" />
                <h3 className="h4 fw-bold">User Profile</h3>
                <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '420px' }}>
                  You are not currently logged in. Please sign in to view your user profile, role credentials, and account details.
                </p>
                <div>
                  <a
                    href="#login"
                    className="btn btn-primary px-4 py-2"
                    onClick={onRequireLogin}
                  >
                    <i className="bi bi-box-arrow-in-right me-1" /> Log In to View Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const initials = (currentUser.name || 'User')
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isEmployer = currentUser.role === 'employer';

  return (
    <section id="profile" className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="profile-card card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-dark text-white p-4 d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-primary-subtle small text-uppercase fw-semibold">Authenticated Account</span>
                  <h3 className="h4 mb-0 text-white mt-1">User Profile</h3>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm px-3"
                  onClick={onLogout}
                  title="Sign out of JobPortal"
                >
                  <i className="bi bi-box-arrow-right me-1" /> Log Out
                </button>
              </div>

              <div className="card-body p-4 p-lg-5">
                <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
                  <div
                    className="profile-avatar text-white fw-bold d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{
                      width: '84px',
                      height: '84px',
                      fontSize: '2rem',
                      background: isEmployer
                        ? 'linear-gradient(135deg, #0d6efd, #0dcaf0)'
                        : 'linear-gradient(135deg, #198754, #20c997)',
                    }}
                  >
                    {initials}
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                      <h2 className="h3 mb-0 fw-bold">{currentUser.name}</h2>
                      <span
                        className={`badge ${
                          isEmployer ? 'bg-primary' : 'bg-success'
                        } text-capitalize px-3 py-1 rounded-pill`}
                      >
                        <i className={`bi ${isEmployer ? 'bi-building' : 'bi-person'} me-1`} />
                        {isEmployer ? 'Employer (Recruiter)' : 'Job Seeker'}
                      </span>
                    </div>

                    <div className="text-secondary d-flex flex-wrap gap-4 mt-2">
                      <span className="d-flex align-items-center gap-1">
                        <i className="bi bi-envelope text-primary" />
                        <strong>Email:</strong> {currentUser.email}
                      </span>
                      <span className="d-flex align-items-center gap-1">
                        <i className="bi bi-shield-check text-success" />
                        <strong>JWT Authenticated:</strong> Active
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <span className="text-secondary small text-uppercase fw-semibold d-block mb-1">
                        Account Role & Permissions
                      </span>
                      <strong className="d-block mb-1 text-capitalize">
                        {currentUser.role}
                      </strong>
                      <p className="text-secondary small mb-0">
                        {isEmployer
                          ? 'You are authorized to publish new job listings and manage applicant pipelines.'
                          : 'You are authorized to search roles, view detailed job descriptions, and submit applications.'}
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <span className="text-secondary small text-uppercase fw-semibold d-block mb-1">
                        Account Actions
                      </span>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        <a href="#jobs" className="btn btn-outline-primary btn-sm">
                          <i className="bi bi-briefcase me-1" /> View Jobs
                        </a>
                        {!isEmployer && (
                          <a href="#applications" className="btn btn-outline-success btn-sm">
                            <i className="bi bi-send me-1" /> Track Applications
                          </a>
                        )}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={onLogout}
                        >
                          <i className="bi bi-box-arrow-right me-1" /> Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
