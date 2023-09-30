const logout = document.getElementById("logoutButton");

logout.addEventListener("click", () => {
  // Realiza la solicitud POST
  fetch("http://localhost:8080/logout", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo agregar desloguear al usuario");
      }
      return response;
    })
    .catch((error) => {
      console.error("Error al desloguear al usuario:", error);
    });
});
