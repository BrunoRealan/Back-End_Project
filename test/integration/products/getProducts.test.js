import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de obtener productos con un limit de 50", () => {});
it("Debería obtener productos con un limit", async () => {
  const response = await requester.get("/api/products/?limit=50");
  const { statusCode, ok, _body } = response;

  expect(statusCode).eql(200);
  expect(ok).eql(true);
  expect(_body).to.be.an("object");
  expect(_body).to.have.property("status").to.be.equal("success");
  expect(_body).to.have.property("response").to.be.an("object");
  expect(_body.response).to.have.property("status").to.be.equal("success");
  expect(_body.response).to.have.property("payload").to.be.an("array");
  expect(_body.response.payload.length).to.be.equal(50);
  expect(_body.response).to.have.property("totalPages").to.be.a("number");
  expect(_body.response).to.have.property("prevPage").to.be.null;
  expect(_body.response).to.have.property("nextPage").to.be.a("number");
  expect(_body.response).to.have.property("page").to.be.a("number");
  expect(_body.response).to.have.property("hasPrevPage").to.be.a("boolean");
  expect(_body.response).to.have.property("hasNextPage").to.be.a("boolean");
  expect(_body.response).to.have.property("prevLink").to.be.null;
  expect(_body.response).to.have.property("nextLink").to.be.a("string");
});
