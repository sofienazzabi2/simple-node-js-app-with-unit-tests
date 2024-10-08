import request from "supertest";
import app from "../app.js";
import { expect } from "chai";
import mysql from "mysql2/promise"; // Import mysql2 for connection pooling

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

describe("User Management API", () => {
  let userId;
  let connection;

  before(async () => {
    connection = await pool.getConnection(); // Get a connection from the pool
  });

  beforeEach(async () => {
    // Start a transaction
    await connection.beginTransaction();
  });

  afterEach(async () => {
    // Roll back the transaction after each test
    await connection.rollback();
  });

  after(async () => {
    connection.release(); // Release the connection back to the pool
  });

  it("should create a new user", async () => {
    const res = await request(app).post("/users").send({
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    });

    expect(res.status).to.equal(200);
    expect(res.text).to.equal("User added successfully!");
    userId = res.body.id; // Store user ID for further tests

    // Verify that the user was actually created
    const verifyRes = await request(app).get(`/users/${userId}`);
    expect(verifyRes.status).to.equal(200);
    expect(verifyRes.body.id).to.equal(userId);
  });

  it("should retrieve all users", async () => {
    const res = await request(app).get("/users");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array").that.is.not.empty;
  });

  it("should update the user", async () => {
    const res = await request(app).put(`/users/${userId}`).send({
      name: "Jane Doe",
      email: "jane@example.com",
      age: 25,
    });

    expect(res.status).to.equal(200);
    expect(res.text).to.equal("User updated successfully!");
  });

  it("should delete the user", async () => {
    const res = await request(app).delete(`/users/${userId}`);
    expect(res.status).to.equal(200);
    expect(res.text).to.equal("User deleted successfully!");
  });
});
