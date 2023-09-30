const addToCartButtons = document.getElementsByClassName("addToCartButton");

const buttonsArray = Array.from(addToCartButtons);
// Agrega un controlador de eventos a cada botón
buttonsArray.forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.productId;
    const cartId = "650b5c8f9c8bbdd684877a34"; //HARDCODE
    console.log(productId);

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
      .then((responseData) => {
        // Aquí puedes manejar la respuesta si es necesario
        console.log(responseData);
      })
      .catch((error) => {
        console.error("Error al agregar el producto al carrito:", error);
      });
  });
});
