import request from "supertest";
import app from "../app.js";
import { expect } from "chai";


describe("User Management API", () => {
  let userId;

  it("should create a new user", async () => {
    const res = await request(app).post("/users").send({
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    });
    expect(res.status).to.equal(200);
    expect(res.text).to.equal("User added successfully!");
    userId = res.body.id; // Store user ID for further tests
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
