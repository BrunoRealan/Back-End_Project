document.addEventListener("DOMContentLoaded", () => {
  const purchaseButton = document.getElementById("purchaseButton");
  if (purchaseButton) {
    const cartId = purchaseButton.dataset.cartId;
    purchaseButton.addEventListener("click", function () {
      fetch(`http://${window.SERVER_URL}/api/carts/${cartId}/purchase`, {
        method: "POST",
      }).then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo crear el ticket de compra");
        }
        Swal.fire({
          title: "Compra realizada correctamente",
          text: "El ticket de compra ha sido creado, te contactaremos para el envio del producto.",
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        });
        setTimeout(() => {
          window.location.href = "/products";
        }, 3000).catch((error) => {
          console.error("Error al crear ticket de compra:", error);
        });
      });
    });
  }
});
