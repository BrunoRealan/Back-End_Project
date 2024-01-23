document.addEventListener("DOMContentLoaded", () => {
  const deleteAllButton = document.getElementById("deleteAllProductsButton");
  if (deleteAllButton) {
    deleteAllButton.addEventListener("click", () => {
      const cartId = deleteAllButton.dataset.cartId;
      console.log(cartId);

      Swal.fire({
        title: "Borrar productos del carrito",
        text: "Esta seguro que desea borrar todos los productos del carrito?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`http://${window.SERVER_URL}/api/carts/${cartId}`, {
            method: "DELETE",
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("No se pudo borrar los productos del carrito");
              }
              Swal.fire({
                icon: "success",
                title: "Borrados!",
                html: "Todos los productos fueron borrados del carrito.<br>Recarga la página para ver los cambios.",
              });
            })
            .catch((error) => {
              console.error(
                "Error al borrar los productos del carrito:",
                error
              );
              Swal.fire("Error!", "Failed to delete the cart.", "error");
            });
        }
      });
    });
  }
});
