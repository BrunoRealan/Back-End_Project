import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de crear y eliminar un carrito", () => {
  let cartId;

  afterEach(async () => {
    // Delete the cart after each test
    if (cartId) {
      await requester.delete(`/api/carts/${cartId}`);
      cartId = null;
    }
  });

  it("Debería crear un carrito y luego eliminarlo", async () => {
    // Create a cart
    const createResponse = await requester.post("/api/carts");
    const {
      statusCode: createStatusCode,
      ok: createOk,
      _body: createBody,
    } = createResponse;

    expect(createStatusCode).eql(200);
    expect(createOk).eql(true);
    expect(createBody).to.be.an("object");
    expect(createBody).to.have.property("status").to.be.equal("success");
    expect(createBody).to.have.property("newCart").to.be.an("object");

    cartId = createBody.newCart._id; // Save the cart ID for deletion

    // Delete the cart
    const deleteResponse = await requester.delete(`/api/carts/${cartId}`);
    const {
      statusCode: deleteStatusCode,
      ok: deleteOk,
      _body: deleteBody,
    } = deleteResponse;

    expect(deleteStatusCode).eql(200);
    expect(deleteOk).eql(true);
    expect(deleteBody).to.be.an("object");
    expect(deleteBody).to.have.property("status").to.be.equal("success");
  });
});
