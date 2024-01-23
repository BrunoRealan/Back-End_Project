const deleteUserButtons = document.getElementsByClassName("deleteUserButton");

const buttonsArray = Array.from(deleteUserButtons);
// Add an event listener to each button
buttonsArray.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const userId = button.dataset.userId;
    // Make the DELETE request
    Swal.fire({
      title: "¿Estás seguro/a?",
      text: "¿Ésta acción no se puede deshacer y eliminará el usuario",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, borralo!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Make the DELETE request
        fetch(`${window.SERVER_URL}/api/users/${userId}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              if (response.status === 401) {
                Swal.fire({
                  title: "Operación no autorizada",
                  text: "No tienes permisos para eliminar este usuario",
                  icon: "error",
                  showConfirmButton: true,
                });
              } else {
                throw new Error("No se pudo eliminar el usuario");
              }
            } else {
              Swal.fire({
                title: "Usuario eliminado",
                text: "Usuario eliminado satisfactoriamente",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
              });
              return response;
            }
          })
          .catch((error) => {
            console.error("Error al eliminar el usuario:", error);
          });
      }
    });
  });
});
