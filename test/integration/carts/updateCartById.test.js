import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de actualizar un carrito por ID", () => {
  let cartId;

  beforeEach(async () => {
    // Create a cart before each test
    const createResponse = await requester.post("/api/carts");
    cartId = createResponse._body.newCart._id;
  });

  afterEach(async () => {
    // Delete the cart after each test
    if (cartId) {
      await requester.delete(`/api/carts/${cartId}`);
      cartId = null;
    }
  });

  it("Debería actualizar un carrito por ID", async () => {
    const products = [{ productId: "someProductId", quantity: 2 }];
    const response = await requester
      .put(`/api/carts/${cartId}`)
      .send({ products });
    const { statusCode, ok, _body } = response;
    expect(statusCode).eql(200);
    expect(ok).eql(true);
    expect(_body).to.be.an("object");
    expect(_body).to.have.property("status").to.be.equal("success");
    expect(_body).to.have.property("cartUpdated").to.be.an("object").empty;
  });
});
