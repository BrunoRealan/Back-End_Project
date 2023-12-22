import chai from "chai";
import supertest from "supertest";
import logger from "../../../src/services/logger.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");
let productId;

describe("Test de crear un producto y luego borrarlo", () => {
  afterEach(async () => {
    if (productId) {
      // Borrar el producto creado después de cada test
      try {
        const response = await requester.delete(`/api/products/${productId}`);
        if (response.status !== 200) {
          throw new Error(
            `Failed to delete product with ID ${productId}: ${response.status}`
          );
        }
        productId = null; // Reset productId
      } catch (error) {
        logger.error(error);
        productId = null; // Reset productId
      }
    }
  });

  it("Debería crear un producto", async () => {
    const productMock = {
      title: "Test product",
      description: "Test description",
      price: 1234,
      thumbnail: ["Test thumbnail"],
      code: "1234" + Math.floor(Math.random() * 10000),
      stock: 1234,
      status: true,
      category: "Test category",
    };

    const response = await requester.post("/api/products").send(productMock);
    const { statusCode, ok, _body } = response;
    productId = _body._id; // Gravar el ID del producto creado para borrarlo después

    expect(statusCode).eql(200);
    expect(ok).eql(true);
    expect(_body).to.be.an("object");
    expect(_body).to.have.property("title").to.be.equal(productMock.title);
    expect(_body)
      .to.have.property("description")
      .to.be.equal(productMock.description);
    expect(_body).to.have.property("price").to.be.equal(productMock.price);
    expect(_body)                                
      .to.have.property("thumbnail")
      .to.be.eql(productMock.thumbnail);
    expect(_body).to.have.property("stock").to.be.equal(productMock.stock);
    expect(_body)
      .to.have.property("category")
      .to.be.equal(productMock.category);
    expect(_body).to.have.property("owner").to.be.equal("admin");
  });
});
