document.addEventListener("DOMContentLoaded", (event) => {
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      Swal.fire({
        title: "¿Estás seguro/a?",
        text: "¿Estás seguro/a que deseas desloguearte?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, deslogueame!",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch`http://${window.SERVER_URL}/logout`, {
            method: "POST",
          }
            .then((response) => {
              if (!response.ok) {
                throw new Error("No se pudo desloguear al usuario");
              }
              Swal.fire({
                title: "Deslogueado!",
                text: "El usuario ha sido deslogueado.",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
              });
              setTimeout(() => {
                window.location.href = "/login";
              }, 2000);
            })
            .catch((error) => {
              console.error("Error al desloguear al usuario:", error);
            });
        }
      });
    });
  }
});
