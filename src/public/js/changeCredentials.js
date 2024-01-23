const changeCradentialsButtons = document.getElementsByClassName("changeCredentialsButton");

const buttonsArray = Array.from(changeCradentialsButtons);
// Agrerga un controlador de eventos a cada botón
buttonsArray.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const userId = button.dataset.userId;
    // Hace la solicitud GET
    fetch(`${window.SERVER_URL}/api/users/premium/${userId}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            Swal.fire({
              title: "Operación no autorizada",
              text: "Tu no tienes permisos para cambiar el rol de los usuarios",
              icon: "error",
              showConfirmButton: true,
            });
          } else {
            throw new Error("Error al cambiar rol de usuario");
          }
        } else {
          Swal.fire({
            title: "Rol de usuario cambiado",
            text: "El rol de usuario ha sido cambiado satisfactoriamente",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
          return response;
        }
      })
      .catch((error) => {
        console.error("Error changing the user credential:", error);
      });
  });
});