document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('joiner-form');
  const input = document.getElementById('profile-url');
  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  const SERVER_URL = "https://backend-hermanos-gang.onrender.com/api/join";

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const urlValue = input.value.trim();

    if (!urlValue) {
      status.textContent = "Por favor ingresa un enlace válido.";
      status.style.color = "#ff4444";
      return;
    }

    status.textContent = "Enviando datos...";
    status.style.color = "#a1a1aa";
    submitBtn.disabled = true; // Deshabilita el botón mientras envía

    try {
      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ profileUrl: urlValue })
      });

      if (response.ok) {
        input.value = ""; // Limpia el cuadro de texto
        input.disabled = true; // Deshabilita el cuadro de texto
        iniciarTemporizador(2 * 60 * 60); // Inicia el temporizador de 2 horas (en segundos)
      } else {
        status.textContent = "Error al enviar. Inténtalo de nuevo.";
        status.style.color = "#ff4444";
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      status.textContent = "Error de conexión con el servidor.";
      status.style.color = "#ff4444";
      submitBtn.disabled = false;
    }
  });

  // Función para manejar la cuenta regresiva de 2 horas
  function iniciarTemporizador(duracionSegundos) {
    let tiempoRestante = duracionSegundos;
    status.style.color = "#44ff44";

    const intervalo = setInterval(() => {
      const horas = Math.floor(tiempoRestante / 3600);
      const minutos = Math.floor((tiempoRestante % 3600) / 60);
      const segundos = tiempoRestante % 60;

      // Formatear a dos dígitos (ej: 02:00:00)
      const hStr = String(horas).padStart(2, '0');
      const mStr = String(minutos).padStart(2, '0');
      const sStr = String(segundos).padStart(2, '0');

      status.textContent = `Procesando... Tiempo restante: ${hStr}:${mStr}:${sStr}`;

      if (tiempoRestante <= 0) {
        clearInterval(intervalo);
        status.textContent = "¡Proceso completado!";
        input.disabled = false;
        submitBtn.disabled = false;
      }

      tiempoRestante--;
    }, 1000);
  }
});
