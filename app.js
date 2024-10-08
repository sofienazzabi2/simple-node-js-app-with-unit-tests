import express from "express";
import mysql from "mysql2/promise"; // Use promise-based MySQL
import bodyParser from "body-parser";
import dotenv from "dotenv";

const app = express();
const port = 4000;
dotenv.config();

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Database connection pool setup
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "user_db",
});

// Create a new user
app.post("/users", async (req, res) => {
  const { name, email, age } = req.body;
  const sql = "INSERT INTO users (name, email, age) VALUES (?, ?, ?)";

  try {
    const [result] = await pool.query(sql, [name, email, age]);
    res.json({ id: result.insertId, message: "User added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add user." });
  }
});

// Retrieve all users
app.get("/users", async (req, res) => {
  const sql = "SELECT * FROM users";

  try {
    const [results] = await pool.query(sql);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve users." });
  }
});

// Update a user
app.put("/users/:id", async (req, res) => {
  const { name, email, age } = req.body;
  const { id } = req.params;
  const sql = "UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?";

  try {
    await pool.query(sql, [name, email, age, id]);
    res.send("User updated successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user." });
  }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";

  try {
    await pool.query(sql, [id]);
    res.send("User deleted successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Export the server and pool
export { server, pool };
export default app;
