const logout = document.getElementById("logoutButton");

logout.addEventListener("click", () => {
  fetch("http://localhost:8080/logout", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo desloguear al usuario");
      }
      alert("Te haz deslogueado.");
      //Redirigir a login
      window.location.href = "/login";
    })
    .catch((error) => {
      console.error("Error al desloguear al usuario:", error);
    });
});
