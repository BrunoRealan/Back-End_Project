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
              if (!response.ok) {
                throw new Error("No se pudo crear el ticket de compra");
              }
              console.log(response);
              Swal.fire({
                title: "Compra realizada correctamente",
                text: `El ticket de compra ${response}ha sido creado, te contactaremos para el envio del producto.`,
                icon: "success",
                showConfirmButton: false,
                /* timer: 3000, */
              });
/*               setTimeout(() => {
                window.location.href = "/products";
              }, 3000); */
            })
            .catch((error) => {
              console.error("Error al crear ticket de compra:", error);
            });
        }
      });
    });
  }
});
