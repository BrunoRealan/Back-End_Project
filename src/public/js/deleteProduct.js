const deleteButtons = document.getElementsByClassName("deleteButton");

const buttonsArray = Array.from(deleteButtons);
// Agrega un controlador de eventos a cada botón
buttonsArray.forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.productId;
    const cartId = button.dataset.cartId;
    // Realiza la solicitud POST
    fetch(`${window.SERVER_URL}/api/carts/${cartId}/products/${productId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo borrar el producto del carrito");
        }
        // Use swal here to show success message
        Swal.fire({
          title: "Producto borrado del carrito",
          text: "Recarga la página para ver los cambios",
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        });
        return response;
      })
      .catch((error) => {
        console.error("Error al borrar el producto del carrito:", error);
        // Use swal here to show error message
        Swal.fire({
          title: "Error",
          text: "Hubo un error al borrar el producto del carrito",
          icon: "error",
          showConfirmButton: false,
          timer: 3000,
        });
      });
  });
});
