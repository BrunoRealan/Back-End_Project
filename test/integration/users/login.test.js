import chai from "chai";
import supertest from "supertest";
import sinon from "sinon";
import passport from "passport";
import { ObjectId } from "mongodb";

const { expect } = chai;
const request = supertest("http://localhost:8080");

describe("Test de logueo de usuario", () => {
  it("deberia redirigir a login en caso de fallo", async () => {
    // Stub con sinon para reemplazar la función authenticate de passport
    const authenticate = sinon
      .stub(passport, "authenticate")
      .callsFake((strategy, options) => {
        return (req, res, next) => {
          next(new Error("Login failed"));
        };
      });

    const response = await request
      .post("/api/users/login")
      .send({ email: "wrong", password: "wrong" });

    const { statusCode, ok, headers } = response;

    authenticate.restore(); // Restaura la función original

    expect(statusCode).to.equal(302);
    expect(ok).to.equal(false);
    expect(headers.location).to.equal("/login");
  });

  it("debria redirigir a profile en caso de exito", async () => {
    const authenticate = sinon
      .stub(passport, "authenticate")
      .callsFake((strategy, options) => {
        return (req, res, next) => {
          req.user = {
            _id: ObjectId("658b8cb929dc4e57af32e416"),
            first_name: "Jacinto",
            last_name: "De las Mercedes",
            email: "ejemplo@gmail.com",
            age: 39,
            cart: "1234",
            role: "user",
          };

          req.session = {
            passport: {
              user: req.user._id,
            },
          };

          next();
        };
      });

    const response = await request
      .post("/api/users/login")
      .send({ email: "ejemplo@gmail.com", password: "pass" });

    const { statusCode, ok, headers } = response;

    authenticate.restore(); // Restaura la función original

    expect(statusCode).to.equal(302);
    expect(headers.location).to.equal("/profile");
    expect(headers["set-cookie"]).to.be.an("array").lengthOf(1);
    expect(headers["set-cookie"][0]).to.include("connect.sid");
    expect(headers["set-cookie"][0]).to.include("HttpOnly");
    expect(headers["set-cookie"][0]).to.include("Path=/");
  });
});
