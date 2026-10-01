document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('joiner-form');
  const input = document.getElementById('profile-url');
  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  const SERVER_URL = "https://backend-hermanos-gang.onrender.com/api/join";
  const DOS_HORAS_EN_MS = 2 * 60 * 60 * 1000;

  comprobarTemporizadorExistente();

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
    submitBtn.disabled = true;

    try {
      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ profileUrl: urlValue })
      });

      if (response.ok) {
        input.value = "";
        
        const tiempoFin = Date.now() + DOS_HORAS_EN_MS;
        localStorage.setItem('timerEndTime', tiempoFin.toString());

        iniciarTemporizador(tiempoFin);
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

  function comprobarTemporizadorExistente() {
    const tiempoFinGuardado = localStorage.getItem('timerEndTime');
    if (tiempoFinGuardado) {
      const tiempoFin = parseInt(tiempoFinGuardado, 10);
      if (Date.now() < tiempoFin) {
        iniciarTemporizador(tiempoFin);
      } else {
        localStorage.removeItem('timerEndTime');
      }
    }
  }

  function iniciarTemporizador(tiempoFin) {
    input.disabled = true;
    submitBtn.disabled = true;
    status.style.color = "#44ff44";

    const intervalo = setInterval(() => {
      const ahora = Date.now();
      const milisegundosRestantes = tiempoFin - ahora;

      if (milisegundosRestantes <= 0) {
        clearInterval(intervalo);
        localStorage.removeItem('timerEndTime');
        status.textContent = "¡Proceso completado!";
        input.disabled = false;
        submitBtn.disabled = false;
        return;
      }

      const totalSegundos = Math.floor(milisegundosRestantes / 1000);
      const horas = Math.floor(totalSegundos / 3600);
      const minutos = Math.floor((totalSegundos % 3600) / 60);
      const segundos = totalSegundos % 60;

      const hStr = String(horas).padStart(2, '0');
      const mStr = String(minutos).padStart(2, '0');
      const sStr = String(segundos).padStart(2, '0');

      status.textContent = `Procesando... Tiempo restante: ${hStr}:${mStr}:${sStr}`;
    }, 1000);
  }
});
