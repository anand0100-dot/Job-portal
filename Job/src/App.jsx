import { useState, useEffect, useCallback, useMemo } from 'react';
import { jobs as initialJobs } from './data/jobs';
import {
  fetchJobs,
  fetchMyApplications,
  checkBackendHealth,
  getStoredToken,
  getStoredUser,
  saveAuthData,
  clearAuthData,
} from './api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import JobListings from './components/JobListings';
import Applications from './components/Applications';
import ApplyModal from './components/ApplyModal';
import PostJobModal from './components/PostJobModal';
import './App.css';

export default function App() {
  const [jobsList, setJobsList] = useState(initialJobs);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [applyingJob, setApplyingJob] = useState(null);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [appsRefreshTrigger, setAppsRefreshTrigger] = useState(0);

  // Authentication State loaded from localStorage
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [authToken, setAuthToken] = useState(() => getStoredToken());

  // Applications State loaded from backend or local fallback
  const [applications, setApplications] = useState([]);

  const showNotice = (msg) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(''), 4500);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Monitor backend connectivity
  useEffect(() => {
    let isMounted = true;
    const verifyStatus = async () => {
      const online = await checkBackendHealth();
      if (isMounted) setIsBackendOnline(online);
    };
    verifyStatus();
    const interval = setInterval(verifyStatus, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Fetch Jobs from backend with query parameters support
  const loadJobs = useCallback(async (params = {}) => {
    setJobsLoading(true);
    try {
      const data = await fetchJobs(params);
      if (Array.isArray(data)) {
        if (data.length > 0 || Object.keys(params).some((k) => params[k])) {
          setJobsList(data);
        } else {
          // If fresh install with empty DB, fallback to initialJobs
          setJobsList(initialJobs);
        }
      }
    } catch {
      // Keep existing jobs on error
    } finally {
      setJobsLoading(false);
    }
  }, []);

  // Initial jobs load
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Fetch user applications whenever authToken changes
  useEffect(() => {
    let isMounted = true;
    if (authToken && currentUser) {
      fetchMyApplications(authToken)
        .then((apps) => {
          if (isMounted && Array.isArray(apps)) {
            setApplications(apps);
          }
        })
        .catch(() => {
          // Keep applications array on error
        });
    } else {
      setApplications([]);
    }
    return () => {
      isMounted = false;
    };
  }, [authToken, currentUser, appsRefreshTrigger]);

  // Set of job IDs already applied to by the current user
  const appliedJobIds = useMemo(() => {
    const ids = new Set();
    applications.forEach((app) => {
      if (app.job_id) ids.add(Number(app.job_id));
      if (app.id) ids.add(Number(app.id));
    });
    return ids;
  }, [applications]);

  const handleLogin = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    saveAuthData(user, token);
    setAppsRefreshTrigger((prev) => prev + 1);
    showNotice(`Welcome back, ${user.name}! Logged in as ${user.role}.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    setApplications([]);
    clearAuthData();
    showNotice('You have been logged out successfully.');
  };

  const handleRegistered = () => {
    showNotice('Account created successfully! Please log in with your credentials.');
    scrollToSection('login');
  };

  // Open the Apply Details modal
  const handleOpenApplyModal = (job) => {
    if (!currentUser || !authToken) {
      showNotice('Please log in first to submit a job application.');
      scrollToSection('login');
      return;
    }

    if (appliedJobIds.has(job.id)) {
      showNotice(`You have already applied for "${job.title}".`);
      return;
    }
    setApplyingJob(job);
  };

  // Submit Job Application callback
  const handleApplicationSubmitted = (applicationData) => {
    setAppsRefreshTrigger((prev) => prev + 1);
    showNotice(`Application submitted for "${applicationData.title}"! Tracking in MySQL.`);
  };

  // Post a new job callback
  const handleJobCreated = (newJob) => {
    loadJobs();
    showNotice(`Job "${newJob.title}" posted successfully to MySQL database!`);
  };

  return (
    <>
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        isBackendOnline={isBackendOnline}
        onRequireLogin={() => scrollToSection('login')}
      />

      <main>
        <Hero />

        {notice && (
          <div
            className="toast-alert alert alert-success shadow-lg border-0 d-flex align-items-center gap-2"
            style={{
              position: 'fixed',
              top: '80px',
              right: '24px',
              zIndex: 1090,
              minWidth: '320px',
            }}
          >
            <i className="bi bi-check-circle-fill fs-5" />
            <div className="flex-grow-1">{notice}</div>
            <button
              type="button"
              className="btn-close ms-2"
              onClick={() => setNotice('')}
            />
          </div>
        )}

        {/* Dashboard Strip */}
        <Dashboard
          jobCount={jobsList.length}
          applicationCount={applications.length}
          currentUser={currentUser}
        />

        {/* Job Listings with Search & Filter */}
        <JobListings
          jobs={jobsList}
          appliedJobIds={appliedJobIds}
          onApply={handleOpenApplyModal}
          onOpenPostJob={() => setIsPostJobOpen(true)}
          onSearch={loadJobs}
          loading={jobsLoading}
          currentUser={currentUser}
        />

        {/* User Profile Page */}
        <Profile
          currentUser={currentUser}
          onLogout={handleLogout}
          onRequireLogin={() => scrollToSection('login')}
        />

        {/* My Applications Page */}
        <Applications
          currentUser={currentUser}
          authToken={authToken}
          onRequireLogin={() => scrollToSection('login')}
          onLogout={handleLogout}
          refreshTrigger={appsRefreshTrigger}
        />

        {/* Registration Form */}
        <RegistrationForm onRegistered={handleRegistered} />

        {/* Login Form */}
        <LoginForm
          currentUser={currentUser}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </main>

      {/* Job Application Modal */}
      <ApplyModal
        job={applyingJob}
        currentUser={currentUser}
        authToken={authToken}
        isOpen={Boolean(applyingJob)}
        onClose={() => setApplyingJob(null)}
        onSubmitSuccess={handleApplicationSubmitted}
        onRequireLogin={() => scrollToSection('login')}
      />

      {/* Post a Job Modal (Employer Only) */}
      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        currentUser={currentUser}
        authToken={authToken}
        onJobCreated={handleJobCreated}
        onRequireLogin={() => scrollToSection('login')}
      />

      <footer className="footer py-4 bg-dark text-white-50 mt-5">
        <div className="container d-flex flex-column flex-sm-row gap-2 justify-content-between align-items-center">
          <span className="text-white fw-bold">
            <i className="bi bi-briefcase-fill me-2 text-primary" />
            JobPortal
          </span>
          <span>© 2026 JobPortal. Complete Full-Stack Solution for Experiment 6.</span>
        </div>
      </footer>
    </>
  );
}
