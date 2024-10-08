import express from "express";
import { createConnection } from "mysql2";
import bodyParser from "body-parser";
import dotenv from "dotenv";

const app = express();
const port = 4000;
dotenv.config();

// Middleware for parsing JSON data
app.use(bodyParser.json());

// MySQL connection setup
const db = createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "user_db",
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// Create a new user
app.post("/users", (req, res) => {
  const { name, email, age } = req.body;
  const sql = "INSERT INTO users (name, email, age) VALUES (?, ?, ?)";
  db.query(sql, [name, email, age], (err, result) => {
    if (err) throw err;
    res.send("User added successfully!");
  });
});

// Retrieve all users
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update a user
app.put("/users/:id", (req, res) => {
  const { name, email, age } = req.body;
  const { id } = req.params;
  const sql = "UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?";
  db.query(sql, [name, email, age, id], (err, result) => {
    if (err) throw err;
    res.send("User updated successfully!");
  });
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send("User deleted successfully!");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
