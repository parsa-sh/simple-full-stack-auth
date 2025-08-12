import { Router } from "express";
import pool from "../utils/db.js";
import bcrypt from "bcrypt";
import cors from "cors";

const router = Router();
router.use(cors());

//Get method

router.get("/", (req, res) => {
  res.send("Hello from express");
});

router.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id,username,email FROM users");
    return res.status(201).json({
      message: "List of all users",
      user: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const result = await pool.query(
      "SELECT id,username,email FROM users WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(201).json({
      message: `Detail of users ${userId}`,
      user: result.rows,
    });
  } catch (error) {
    console.error("Query error:", error);
    return res.status(500).json({ error: "Failed to retrieve user" });
  }
});

//Post method

router.post("/users", async (req, res) => {
  const body = req.body;
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { username, email, password } = body;
  if (!username || !email || !password) {
    res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const hashedPass = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username ,email ,password) VALUES ($1,$2,$3) RETURNING *",
      [username, email, hashedPass]
    );
    if (result.rows && result.rows.length > 0) {
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          id: result.rows[0].id,
          username: result.rows[0].username,
          email: result.rows[0].email,
        },
      });
    } else {
      return res
        .status(500)
        .json({ error: "Insert succeeded but returned no data" });
    }
  } catch (error) {
    console.error("Insert error:", error);
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    return res.status(500).json({ error: "Database insert failed" });
  }
});

//Delete method

router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const body = req.body;
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id=$1 RETURNING *",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(201).json({
      success: true,
      message: "User deleted successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("update error:", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
});

//Put method

router.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const body = req.body;
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { username, email, password } = body;
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  if (!username || !email || !password) {
    res.status(400).json({
      error: "All fields (username, email, password) are required for updating",
    });
  }
  try {
    const result = await pool.query(
      "UPDATE users SET username=$1,email=$2,password=$3 WHERE id =$4 RETURNING *",
      [username, email, password, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("update error:", error);
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    return res.status(500).json({ error: "Database insert failed" });
  }
});

//Login method

router.post("/login", async (req, res) => {
  const body = req.body;
  const { username, password } = body;
  if (!username || !password) {
    res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  try {
    const query = "SELECT * FROM users WHERE username=$1";
    const value = username;
    const result = await pool.query(query, [value]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
