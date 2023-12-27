import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de obtener un carrito por ID", () => {
  let cartId;

  beforeEach(async () => {
    // Crea un carrito antes de cada test
    const createResponse = await requester.post("/api/carts");
    cartId = createResponse._body.newCart._id;
  });

  afterEach(async () => {
    // Borra el carrito creado después de cada test
    if (cartId) {
      await requester.delete(`/api/carts/${cartId}`);
      cartId = null;
    }
  });

  it("Debería obtener un carrito por ID", async () => {
    const response = await requester.get(`/api/carts/${cartId}`);
    const { statusCode, ok, _body } = response;

    expect(statusCode).eql(200);
    expect(ok).eql(true);
    expect(_body).to.be.an("object");
    expect(_body).to.have.property("status").to.be.equal("success");
    expect(_body).to.have.property("cart").to.be.an("object");
    expect(_body.cart).to.have.property("_id").to.be.equal(cartId);
    expect(_body.cart).to.have.property("products").to.be.an("array").empty;
  });

  it("Debería devolver un error 404 si el carrito no existe", async () => {
    const response = await requester.get("/api/carts/658b9396b03fe37c93d8f679");
    const { statusCode, ok, _body } = response;

    expect(statusCode).eql(404);
    expect(ok).eql(false);
    expect(_body).to.be.an("object");
    expect(_body).to.have.property("status").to.be.equal("failure");
    expect(_body).to.have.property("message").to.be.equal("Cart not found");
  });
});
