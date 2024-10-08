// app.js
import express from "express";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import dotenv from "dotenv";

const app = express();
const port = 4000;
dotenv.config();

// Middleware for parsing JSON data
app.use(bodyParser.json());

// MySQL connection setup
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
  await pool.query(sql, [name, email, age]);
  res.json({ message: "User added successfully!" }); // Changed to JSON response
});

// Retrieve all users
app.get("/users", async (req, res) => {
  const sql = "SELECT * FROM users";
  const [results] = await pool.query(sql);
  res.json(results);
});

// Update a user
app.put("/users/:id", async (req, res) => {
  const { name, email, age } = req.body;
  const { id } = req.params;
  const sql = "UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?";
  await pool.query(sql, [name, email, age, id]);
  res.json({ message: "User updated successfully!" });
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";
  await pool.query(sql, [id]);
  res.json({ message: "User deleted successfully!" });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Function to close the server
// Function to close the server
const closeServer = () => {
  return new Promise((resolve) => {
    server.close((err) => {
      if (err) {
        console.error("Error closing server:", err);
      } else {
        console.log("Server closed.");
      }
      resolve();
    });
  });
};

// Export the server, pool, and close function
export { server, pool, closeServer };
export default app;
