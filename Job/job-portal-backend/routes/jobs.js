const express = require("express");
const db = require("../config/db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can create jobs"
      });
    }

    const {
      title,
      company,
      location,
      description,
      salary,
      skills
    } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({
        message: "Title, company and description are required"
      });
    }

    const [result] = await db.query(
      `INSERT INTO jobs
(title,company,location,description,salary,skills,created_by)
VALUES (?,?,?,?,?,?,?)`,
      [
        title,
        company,
        location || null,
        description,
        salary || null,
        skills || null,
        req.user.id
      ]
    );

    res.status(201).json({
      message: "Job created successfully",
      jobId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { search, location, skills } = req.query;
    let sql = "SELECT * FROM jobs WHERE 1=1";
    const params = [];

    if (search) {
      sql += ` AND (title LIKE ? OR company LIKE ?
OR description LIKE ? OR skills LIKE ?)`;
      const value = `%${search}%`;
      params.push(value, value, value, value);
    }

    if (location) {
      sql += " AND location LIKE ?";
      params.push(`%${location}%`);
    }

    if (skills) {
      sql += " AND skills LIKE ?";
      params.push(`%${skills}%`);
    }

    sql += " ORDER BY created_at DESC";

    const [jobs] = await db.query(sql, params);
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [jobs] = await db.query(
      "SELECT * FROM jobs WHERE id = ?",
      [req.params.id]
    );

    if (!jobs.length) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(jobs[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
