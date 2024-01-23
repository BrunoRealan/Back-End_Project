document.addEventListener("DOMContentLoaded", () => {
  const deleteOldUsers = document.getElementById("deleteOldUsersButton");
  if (deleteOldUsers) {
    deleteOldUsers.addEventListener("click", (e) => {
      e.preventDefault();
      // Make the DELETE request
      Swal.fire({
        title: "¿Estás seguro/a?",
        text: "¿Ésta acción no se puede deshacer y eliminará los usuarios que no han conectado en los últimos 2 días",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, borralo!",
      })
        .then((result) => {
          if (result.isConfirmed) {
            // Make the DELETE request
            return fetch(`${window.SERVER_URL}/api/users`, {
              method: "DELETE",
            });
          }
        })
        .then((response) => {
          if (response && !response.ok) {
            throw new Error("No se pudo borrar todos los usuarios");
          }
          return Swal.fire({
            title: "Usuarios eliminados",
            text: "Los usuarios que tenían más de 2 días sin conectarse han sido eliminados satisfactoriamente",
            icon: "success",
            showConfirmButton: false,
            timer: 3000,
          });
        })
        .catch((error) => {
          console.error("Error al crear ticket de compra:", error);
        });
    });
  }
});
