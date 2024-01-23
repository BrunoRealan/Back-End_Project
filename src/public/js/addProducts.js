// Then, when making requests, use SERVER_URL:
fetch(`${window.SERVER_URL}/login`, {
  // Your fetch options...
})

const addToCartButtons = document.getElementsByClassName("addToCartButton");

const buttonsArray = Array.from(addToCartButtons);
// Agrega un controlador de eventos a cada botón
buttonsArray.forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.productId;
    const cartId = button.dataset.cartId;
    // Realiza la solicitud POST
    fetch(`http://${window.SERVER_URL}/api/carts/${cartId}/products/${productId}`, {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            Swal.fire({
              title: "Operación no autorizada",
              text: "No tienes permisos para agregar productos al carrito",
              icon: "error",
              showConfirmButton: true,
            });
          } else {
            throw new Error("No se pudo agregar el producto al carrito");
          }
        } else {
          Swal.fire({
            title: "Producto agregado",
            text: "Producto agregado satisfactoriamente en tu carrito",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
          return response;
        }
      })
      .catch((error) => {
        console.error("Error al agregar el producto al carrito:", error);
      });
  });
});
