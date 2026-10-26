export default function JobCard({ job, applied, onApply }) {
  const skillsList = job.skills
    ? job.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <article className="job-card card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <span className="company-mark">{job.company ? job.company[0] : 'J'}</span>
          <span className="badge category-badge">{job.category || 'General'}</span>
        </div>

        <h3 className="h5 mt-3 mb-1 fw-bold">{job.title}</h3>
        <p className="text-primary fw-semibold small mb-2">{job.company}</p>

        <div className="job-meta text-secondary small mb-3 d-flex flex-wrap gap-2">
          <span>
            <i className="bi bi-geo-alt me-1 text-danger-emphasis" />
            {job.location}
          </span>
          <span>
            <i className="bi bi-clock me-1 text-info-emphasis" />
            {job.type || 'Full-time'}
          </span>
          <span>
            <i className="bi bi-cash-stack me-1 text-success-emphasis" />
            {job.salary}
          </span>
        </div>

        <p className="text-secondary small flex-grow-1 mb-3">{job.description}</p>

        {skillsList.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {skillsList.slice(0, 3).map((skill) => (
              <span key={skill} className="badge bg-light text-dark border small fw-normal">
                {skill}
              </span>
            ))}
            {skillsList.length > 3 && (
              <span className="badge bg-light text-muted border small fw-normal">
                +{skillsList.length - 3}
              </span>
            )}
          </div>
        )}

        <button
          className={`btn ${applied ? 'btn-success' : 'btn-primary'} w-100 mt-auto`}
          disabled={applied}
          onClick={() => onApply(job)}
        >
          {applied ? (
            <>
              <i className="bi bi-check2 me-1" /> Applied
            </>
          ) : (
            <>
              Apply Now <i className="bi bi-arrow-right ms-1" />
            </>
          )}
        </button>
      </div>
    </article>
  );
}
