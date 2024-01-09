const addToCartButtons = document.getElementsByClassName("addToCartButton");

const buttonsArray = Array.from(addToCartButtons);
// Agrega un controlador de eventos a cada botón
buttonsArray.forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.productId;
    const cartId =  button.dataset.cartId;
    // Realiza la solicitud POST
    fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo agregar el producto al carrito");
        }
        return response;
      })
      .catch((error) => {
        console.error("Error al agregar el producto al carrito:", error);
      });
  });
});
