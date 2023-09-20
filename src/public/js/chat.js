const socket = io();

const text = document.getElementById("text");
const chatContainer = document.getElementById("chat-container");

let chatUser = "";
Swal.fire({
  title: "Ingresa tu E-Mail",
  input: "email",
  inputAttributes: {
    autocapitalize: "off",
  },
  confirmButtonText: "Ingresar",
  showLoaderOnConfirm: true,
}).then((result) => {
  chatUser = result.value;
});

// Evento keydown para enviar el mensaje al presionar Enter
text.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Evitar el salto de línea en el campo de entrada
    socket.emit("message", { user: chatUser, message: e.target.value });
    e.target.value = "";
  }
});

socket.on("updateChat", (messages) => {
  let chatsHTML = "";

  messages.map((message) => {
    const messageHTML = `
      <p>El usuario: ${message.user}</p>
      <p>Dijo: ${message.message}</p>
      <br /><br />
    `;
    chatsHTML += messageHTML;
  });

  chatContainer.innerHTML = chatsHTML;
});
