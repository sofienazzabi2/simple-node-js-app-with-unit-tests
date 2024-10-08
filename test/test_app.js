import request from "supertest";
import app from "../app.js";
import { expect } from "chai";

// User Management API Tests
describe("User Management API", () => {
  let userId;

  // Setup and Cleanup
  beforeEach(async () => {
    // Insert a new user before each test
    const res = await request(app).post("/users").send({
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    });
    userId = res.body.id; // Save user ID for further tests
  });

  afterEach(async () => {
    // Clean up - delete the user after each test
    await request(app).delete(`/users/${userId}`);
  });

  // Test cases
  it("should create a new user", async () => {
    const res = await request(app).post("/users").send({
      name: "Alice Smith",
      email: "alice@example.com",
      age: 28,
    });
    expect(res.status).to.equal(200);
    expect(res.text).to.equal("User added successfully!");
    expect(res.body.id).to.exist;
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
