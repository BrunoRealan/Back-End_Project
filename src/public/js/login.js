document.addEventListener("DOMContentLoaded", (event) => {
  const loginButton = document.getElementById("loginButton");
  if (loginButton) {
    loginButton.addEventListener("click", function () {
      fetch(`${window.SERVER_URL}/login`, {
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("No se pudo redirigir el usuario al login");
          }
          //Redirigir a login
          window.location.href = "/login";
        })
        .catch((error) => {
          console.error("Error al loguear al usuario:", error);
        });
    });
  }
});
