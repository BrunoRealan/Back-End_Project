const socket = io();
let products = [];

// Escucha el evento "updateProducts" desde el servidor WebSocket
socket.on("updateProducts", async (data) => {
  // Actualiza la vista de productos en función de la acción recibida (add, modify, delete)
  if (data.action === "add") {
    // Agrega el nuevo producto a la lista de productos
    products.push(data.newProduct);
  } else if (data.action === "modify") {
    // Encuentra y actualiza el producto existente
    const productIndex = products.findIndex(
      (product) => product.id === data.updatedProduct.id
    );
    if (productIndex !== -1) {
      products[productIndex] = data.updatedProduct;
    }
  } else if (data.action === "delete") {
    // Elimina el producto de la lista
    products = products.filter((product) => product.id !== data.productId);
  }

  // Llama a una función para renderizar la vista actualizada
  renderProductsView(products);
});

const productsTemplate = `
{{#each products}}
    <p>ID: {{this.id}}</p>
    <p>Nombre: {{this.title}}</p>
    <p>Descripción: {{this.description}}</p>
    <p>Código: {{this.code}}</p>
    <p>Precio: {{this.price}}</p>
    <p>Status: {{this.status}}</p>
    <p>Stock: {{this.stock}}</p>
    <p>Categoría: {{this.category}}</p>
    <br />
    <br />
  {{/each}}
`;

// Función para renderizar la vista de productos
function renderProductsView(productsData) {
  const template = Handlebars.compile(productsTemplate);
  const renderedHTML = template({ products: productsData });
  document.getElementById("products-container").innerHTML = renderedHTML;
}
