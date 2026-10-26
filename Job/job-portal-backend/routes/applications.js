const express = require("express");
const db = require("../config/db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { job_id } = req.body;

    if (!job_id) {
      return res.status(400).json({
        message: "Job ID is required"
      });
    }

    const [job] = await db.query(
      "SELECT id FROM jobs WHERE id = ?",
      [job_id]
    );

    if (!job.length) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    const [existing] = await db.query(
      `SELECT id FROM applications
WHERE user_id = ? AND job_id = ?`,
      [req.user.id, job_id]
    );

    if (existing.length) {
      return res.status(409).json({
        message: "Application already submitted"
      });
    }

    await db.query(
      `INSERT INTO applications (user_id,job_id)
VALUES (?,?)`,
      [req.user.id, job_id]
    );

    res.status(201).json({
      message: "Job application submitted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/my", authenticateToken, async (req, res) => {
  try {
    const [applications] = await db.query(
      `SELECT a.id, a.job_id, a.status, a.applied_at,
j.title, j.company, j.location, j.salary, j.skills
FROM applications a
JOIN jobs j ON a.job_id = j.id
WHERE a.user_id = ?
ORDER BY a.applied_at DESC`,
      [req.user.id]
    );

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
