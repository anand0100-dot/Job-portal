import { useState } from 'react';
import JobCard from './JobCard';

export default function JobListings({
  jobs,
  appliedJobIds = new Set(),
  onApply,
  onOpenPostJob,
  onSearch,
  loading = false,
  currentUser,
}) {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (onSearch) {
      onSearch({
        search: search.trim(),
        location: location.trim(),
        skills: skills.trim(),
      });
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setSkills('');
    if (onSearch) {
      onSearch({ search: '', location: '', skills: '' });
    }
  };

  const hasActiveFilters = Boolean(search.trim() || location.trim() || skills.trim());

  return (
    <section id="jobs" className="py-5 bg-light">
      <div className="container">
        <div className="section-heading text-center mb-4">
          <span className="text-primary fw-semibold">FIND YOUR FIT</span>
          <h2 className="mt-2 fw-bold">Explore Open Opportunities</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
            Discover active job openings directly synced with our backend database. Filter by keyword, location, or required technical skills.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="filter-bar card border-0 shadow-sm mb-4 rounded-4">
          <div className="card-body p-3 p-lg-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="row g-2 align-items-center">
                {/* Search Keyword */}
                <div className="col-12 col-md-4">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-search text-primary" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Title, company, or description..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Location Filter */}
                <div className="col-12 col-sm-6 col-md-3">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-geo-alt text-danger" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Location (e.g. Remote, Mohali)..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Skills Filter */}
                <div className="col-12 col-sm-6 col-md-3">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-tools text-success" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Skills (e.g. React, MySQL)..."
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="col-12 col-md-2 d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" />
                    ) : (
                      <i className="bi bi-funnel-fill" />
                    )}
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Sub-bar with count, Clear Filters, and Post Job button */}
              <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 pt-3 border-top gap-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="text-secondary small">
                    Showing <strong>{jobs.length}</strong> {jobs.length === 1 ? 'job opportunity' : 'job opportunities'}
                  </span>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="btn btn-link btn-sm text-decoration-none p-0 text-danger ms-2"
                      onClick={handleClearFilters}
                    >
                      <i className="bi bi-x-circle me-1" /> Clear Filters
                    </button>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                    onClick={onOpenPostJob}
                  >
                    <i className="bi bi-plus-circle-fill" />
                    <span>{currentUser?.role === 'employer' ? 'Post a New Job' : 'Post a Job (Employers)'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading jobs...</span>
            </div>
            <p className="text-secondary small mt-2">Searching jobs from database...</p>
          </div>
        )}

        {/* Job Cards Grid */}
        {!loading && jobs.length > 0 && (
          <div className="row g-4">
            {jobs.map((job) => (
              <div className="col-md-6 col-xl-4" key={job.id}>
                <JobCard
                  job={job}
                  applied={appliedJobIds.has(job.id)}
                  onApply={onApply}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm mt-3 p-4">
            <i className="bi bi-search fs-1 text-secondary mb-2 d-block" />
            <h3 className="h5 fw-bold mt-2">No Matching Jobs Found</h3>
            <p className="text-secondary mb-3 mx-auto" style={{ maxWidth: '440px' }}>
              We couldn&apos;t find any open positions matching your search filters. Try using different keywords, broader locations, or clear filters.
            </p>
            <button
              type="button"
              className="btn btn-outline-primary px-4"
              onClick={handleClearFilters}
            >
              <i className="bi bi-arrow-counterclockwise me-1" /> Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
