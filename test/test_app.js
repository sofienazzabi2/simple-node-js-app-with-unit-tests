// test/test_app.js
const expect = require("chai").expect;
const helloWorld = require("../app");

describe("helloWorld function", function () {
  it('should return "Hello, World!"', function () {
    expect(helloWorld()).to.equal("Hello, World!");
  });
});
