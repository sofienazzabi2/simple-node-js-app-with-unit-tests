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
});
