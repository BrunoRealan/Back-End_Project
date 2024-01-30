document.addEventListener("DOMContentLoaded", () => {
  const purchaseButton = document.getElementById("purchaseButton");
  if (purchaseButton) {
    const cartId = purchaseButton.dataset.cartId;
    purchaseButton.addEventListener("click", function () {
      Swal.fire({
        title: "Confirmar compra",
        text: "¿Está seguro que desea confirmar la compra?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`${window.SERVER_URL}/api/carts/${cartId}/purchase`, {
            method: "POST",
          })
            .then((response) => {
              console.log(response);
              if (!response.ok) {
                throw new Error("No se pudo crear el ticket de compra");
              }
              setTimeout(() => {
                window.location.href = "/products";
              }, 3000);
            })
            .catch((error) => {
              console.error("Error al crear ticket de compra:", error);
            });
        }
      });
    });
  }
});
