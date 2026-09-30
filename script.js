document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('joiner-form');
  const input = document.getElementById('profile-url');
  const status = document.getElementById('form-status');

  const SERVER_URL = "https://backend-hermanos-gang.onrender.com/api/join";

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const urlValue = input.value.trim();

    if (!urlValue) {
      status.textContent = "Por favor ingresa un perfil válido.";
      status.style.color = "#ff4444";
      return;
    }

    status.textContent = "Enviando datos...";
    status.style.color = "#a1a1aa";

    try {
      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ profileUrl: urlValue })
      });

      if (response.ok) {
        status.textContent = "Espera unos minutos";
        status.style.color = "#44ff44";
        input.value = ""; // Limpia el cuadro de texto
      } else {
        status.textContent = "Error al enviar. Inténtalo de nuevo.";
        status.style.color = "#ff4444";
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      status.textContent = "Error de conexión con el servidor.";
      status.style.color = "#ff4444";
    }
  });
});
