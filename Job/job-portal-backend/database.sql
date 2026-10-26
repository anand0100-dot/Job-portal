CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('jobseeker','employer') NOT NULL DEFAULT 'jobseeker',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  company VARCHAR(150) NOT NULL,
  location VARCHAR(100),
  description TEXT NOT NULL,
  salary VARCHAR(100),
  skills VARCHAR(255),
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  job_id INT NOT NULL,
  status ENUM('Applied','Under Review','Selected','Rejected') NOT NULL DEFAULT 'Applied',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  UNIQUE(user_id, job_id)
);

INSERT INTO jobs
(title, company, location, description, salary, skills)
VALUES
('Backend Developer','Tech Solutions','Chandigarh',
'Develop REST APIs and backend services.','5-8 LPA','Node.js, Express, MySQL'),
('Frontend Developer','Web Innovations','Mohali',
'Develop responsive web applications.','4-7 LPA','React, JavaScript, Bootstrap'),
('Data Analyst','Analytics Corp','Bangalore',
'Analyze business data and prepare dashboards.','5-9 LPA','Python, SQL, Power BI'),
('Full Stack Developer', 'MetaPulse Systems', 'Remote',
'Build end-to-end scalable web applications using modern MERN stack.', '8-14 LPA', 'React, Node.js, Express, MongoDB, Redux'),
('Mobile App Developer (Flutter/React Native)', 'AppStudio Labs', 'Gurugram',
'Design and implement cross-platform iOS and Android mobile apps.', '6-11 LPA', 'Flutter, Dart, React Native, REST APIs'),
('DevOps & Cloud Engineer', 'CloudSphere Infotech', 'Hyderabad',
'Manage CI/CD pipelines, containerization with Docker and Kubernetes on AWS.', '9-16 LPA', 'AWS, Docker, Kubernetes, Linux, CI/CD'),
('UI/UX Product Designer', 'DesignCrafters Studio', 'Pune',
'Create wireframes, prototypes, user journeys and high-fidelity Figma designs.', '6-10 LPA', 'Figma, Adobe XD, Prototyping, User Research'),
('AI / Machine Learning Engineer', 'NeuralAI Labs', 'Bengaluru',
'Develop predictive models, fine-tune LLMs and deploy computer vision pipelines.', '12-20 LPA', 'Python, PyTorch, TensorFlow, Scikit-learn, LLMs'),
('Cyber Security Analyst', 'SafeShield Security', 'Delhi NCR',
'Monitor vulnerability assessments, penetration tests, and secure network perimeters.', '7-12 LPA', 'Network Security, Ethical Hacking, SIEM, Firewalls'),
('Quality Assurance (QA) Automation Engineer', 'TestMasters Corp', 'Noida',
'Write automated end-to-end and API testing suites with Selenium and Cypress.', '5-9 LPA', 'Selenium, Cypress, Java, Jest'),
('Human Resources (HR) Specialist', 'TalentHub Solutions', 'Mumbai',
'Drive tech recruitment, talent acquisition, onboarding and employee relations.', '5-8 LPA', 'Technical Recruitment, HR Operations, Screening'),
('Digital Marketing & SEO Strategist', 'GrowthVibe Media', 'Chandigarh',
'Manage organic search optimization, Google Ads campaigns and content funnels.', '4-7 LPA', 'SEO, Google Analytics, SEM, Content Strategy');
