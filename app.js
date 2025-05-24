const nombreInput = document.getElementById('nombre');
const textoInput = document.getElementById('texto');
const btnGenerar = document.getElementById('btn-generar');
const btnDescargar = document.getElementById('btn-descargar');
const canvas = document.getElementById('qrcode');
const resultadoTexto = document.getElementById('resultadoTexto');

// Función que valida si los campos están llenos
function validarCampos() {
  const nombreValido = nombreInput.value.trim() !== '';
  const textoValido = textoInput.value.trim() !== '';
  btnGenerar.disabled = !(nombreValido && textoValido);
}

// Eventos para activar el botón cuando los campos se llenen
nombreInput.addEventListener('input', validarCampos);
textoInput.addEventListener('input', validarCampos);

// Función que muestra el texto ingresado
function mostrarTexto() {
  const input = nombreInput.value.trim();
  resultadoTexto.textContent = input;
}

// Función que genera el QR
function generarQR() {
  const texto = textoInput.value.trim();
  const color = document.querySelector('input[name="color"]:checked').value;

  if (!texto) return;

  mostrarTexto(); // Mostrar nombre en el contenedor

  QRCode.toCanvas(canvas, texto, {
    color: {
      dark: color,
      light: '#ffffff'
    },
    width: 200,
    margin: 2
  }, function (error) {
    if (error) console.error(error);
    else btnDescargar.disabled = false;
  });
}

function descargarQR() {
  const contenedor = document.querySelector('.qr-container');
  const nombreQR = nombreInput.value.trim() || 'codigoQR';

  html2canvas(contenedor).then(captura => {
    const enlace = document.createElement('a');
    enlace.download = `${nombreQR}.png`;
    enlace.href = captura.toDataURL();
    enlace.click();
  }).catch(error => {
    console.error('Error al capturar el contenedor:', error);
  });
}

// Función que reinicia el formulario y limpia todo
function reiniciarFormulario() {
  nombreInput.value = '';
  textoInput.value = '';
  document.querySelector('input[name="color"][value="#000000"]').checked = true;

  const contexto = canvas.getContext('2d');
  contexto.clearRect(0, 0, canvas.width, canvas.height);

  resultadoTexto.textContent = '';
  btnGenerar.disabled = true;
  btnDescargar.disabled = true;
  nombreInput.focus();
}
