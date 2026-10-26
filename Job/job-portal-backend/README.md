# Job Portal Backend

Node.js, Express.js, and MySQL backend with JWT authentication, job management, and application tracking.

## Project Structure

```text
job-portal-backend/
├── config/
│   └── db.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── jobs.js
│   └── applications.js
├── .env
├── .gitignore
├── database.sql
├── package.json
└── server.js
```

## Setup & Installation

### 1. Database Setup
Import and run `database.sql` in MySQL Workbench or the MySQL command line:
```bash
mysql -u root -p < database.sql
```

### 2. Configure Environment Variables
Update `.env` with your MySQL credentials:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=job_portal
JWT_SECRET=job_portal_secret_change_this
```

### 3. Run the Server
Install dependencies (if not already done):
```bash
npm install
```

Start development server with nodemon:
```bash
npm run dev
```

Or production start:
```bash
npm start
```

## REST API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user (`jobseeker` or `employer`) | No |
| POST | `/api/auth/login` | Login and receive JWT token | No |
| GET | `/api/jobs` | Retrieve all jobs (supports `search`, `location`, `skills` query params) | No |
| GET | `/api/jobs/:id` | Get job details by ID | No |
| POST | `/api/jobs` | Create a job listing | Employer JWT |
| POST | `/api/applications` | Submit application for a job (`job_id`) | JWT |
| GET | `/api/applications/my` | View logged-in user's applications | JWT |
