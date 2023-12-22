import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de actualizar un producto", () => {
  let productId;
  let productMock;

  beforeEach(async () => {
    // Crea un producto antes de cada test
    productMock = {
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
    productId = response._body._id;
  });

  afterEach(async () => {
    // Borra el producto creado después de cada test
    if (productId) {
      await requester.delete(`/api/products/${productId}`);
      productId = null;
    }
  });

  it("Debería actualizar un producto", async () => {
    const updatedProduct = {
      title: "Updated product",
      description: "Updated description",
      price: 4321,
      thumbnail: ["Updated thumbnail"],
      code: "4321",
      stock: 4321,
      status: false,
      category: "Updated category",
    };

    const response = await requester
      .put(`/api/products/${productId}`)
      .send(updatedProduct);
    const { statusCode, ok, _body } = response;
    expect(statusCode).eql(200);
    expect(ok).eql(true);
    expect(_body).to.be.an("object");
    expect(_body).to.have.property("status").to.be.equal("success");
    expect(_body)
      .to.have.property("message")
      .to.be.equal("Producto actualizado correctamente");

    // Fetch de las propiedades del producto actualizado
    const fetchResponse = await requester.get(`/api/products/${productId}`);
    const fetchedProduct = fetchResponse._body;

    expect(fetchedProduct)
      .to.have.property("title")
      .to.be.equal(updatedProduct.title);
    expect(fetchedProduct)
      .to.have.property("description")
      .to.be.equal(updatedProduct.description);
    expect(fetchedProduct)
      .to.have.property("price")
      .to.be.equal(updatedProduct.price);
    expect(fetchedProduct)
      .to.have.property("thumbnail")
      .to.be.eql(updatedProduct.thumbnail);
    expect(fetchedProduct)
      .to.have.property("stock")
      .to.be.equal(updatedProduct.stock);
    expect(fetchedProduct)
      .to.have.property("category")
      .to.be.equal(updatedProduct.category);
    expect(fetchedProduct).to.have.property("owner").to.be.equal("admin");
  });
});
