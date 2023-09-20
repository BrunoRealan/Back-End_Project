const socket = io();

const productsContainer = document.getElementById("products-container");

socket.on("updateProducts", (products) => {
  let productsHTML = "";

  products.map((product) => {
    const productHTML = `
      <p>ID: ${product._id}</p>
      <p>Nombre: ${product.title}</p>
      <p>Descripción: ${product.description}</p>
      <p>Código: ${product.code}</p>
      <p>Precio: ${product.price}</p>
      <p>Status: ${product.status}</p>
      <p>Stock: ${product.stock}</p>
      <p>Categoría: ${product.category}</p>
      <br /><br />
    `;
    productsHTML += productHTML;
  });

  productsContainer.innerHTML = productsHTML;
});
