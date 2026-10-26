export default function Dashboard({ jobCount = 0, applicationCount = 0, currentUser }) {
  const isEmployer = currentUser?.role === 'employer';

  const cards = [
    {
      icon: 'bi-person-badge',
      label: 'Account Status',
      value: currentUser
        ? `${currentUser.name} (${currentUser.role})`
        : 'Guest / Not Signed In',
      link: currentUser ? '#profile' : '#login',
      linkText: currentUser ? 'View Profile' : 'Sign In',
      color: 'primary',
    },
    {
      icon: 'bi-briefcase-fill',
      label: 'Open Roles in Database',
      value: `${jobCount} active opportunities`,
      link: '#jobs',
      linkText: 'Search Roles',
      color: 'success',
    },
    {
      icon: isEmployer ? 'bi-building-check' : 'bi-send-check-fill',
      label: isEmployer ? 'Employer Dashboard' : 'My Applications',
      value: isEmployer
        ? 'Post & Manage Job Openings'
        : currentUser
        ? `${applicationCount} submitted`
        : 'Sign in to track',
      link: isEmployer ? '#jobs' : '#applications',
      linkText: isEmployer ? 'Post a Job' : 'View Tracker',
      color: 'warning',
    },
  ];

  return (
    <section className="dashboard-strip py-5 bg-white border-bottom">
      <div className="container">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end mb-4 gap-2">
          <div>
            <span className="text-primary fw-semibold small text-uppercase">
              {currentUser ? `Welcome Back, ${currentUser.name}` : 'CAREER DASHBOARD'}
            </span>
            <h2 className="h3 mb-0 mt-1 fw-bold">Keep Your Career Moving Forward</h2>
          </div>
          <a href="#jobs" className="small text-decoration-none fw-semibold">
            Explore Open Roles <i className="bi bi-arrow-right" />
          </a>
        </div>

        <div className="row g-3">
          {cards.map((card) => (
            <div className="col-md-4" key={card.label}>
              <div className="summary-card card h-100 border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3">
                <div
                  className={`summary-icon rounded-4 p-3 text-${card.color} bg-${card.color}-subtle d-flex align-items-center justify-content-center`}
                  style={{ width: '56px', height: '56px' }}
                >
                  <i className={`bi ${card.icon} fs-4`} />
                </div>
                <div className="flex-grow-1">
                  <span className="text-secondary small d-block">{card.label}</span>
                  <strong className="d-block text-dark mt-1 text-truncate" style={{ maxWidth: '200px' }}>
                    {card.value}
                  </strong>
                  <a href={card.link} className={`small text-${card.color} text-decoration-none fw-semibold mt-1 d-inline-block`}>
                    {card.linkText} &rarr;
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
