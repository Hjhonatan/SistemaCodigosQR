// Selección de elementos del DOM por su ID
const nombreInput = document.getElementById('nombre');
const textoInput = document.getElementById('texto');
const btnGenerar = document.getElementById('btn-generar');
const btnDescargar = document.getElementById('btn-descargar');
const canvas = document.getElementById('qrcode');
const resultadoTexto = document.getElementById('resultadoTexto');

// Función que valida si ambos campos tienen texto ingresado
function validarCampos() {
  const nombreValido = nombreInput.value.trim() !== ''; // Verifica que el campo no esté vacío
  const textoValido = textoInput.value.trim() !== '';   // Verifica que el campo no esté vacío
  btnGenerar.disabled = !(nombreValido && textoValido); // Habilita o deshabilita el botón según el estado
}

// Listeners para ejecutar la validación cada vez que el usuario escribe algo
nombreInput.addEventListener('input', validarCampos);
textoInput.addEventListener('input', validarCampos);

// Función que muestra el nombre del QR en pantalla
function mostrarTexto() {
  const input = nombreInput.value.trim();
  resultadoTexto.textContent = input; // Inserta el texto en el elemento de vista previa
}

// Función que genera el código QR en el canvas
function generarQR() {
  const texto = textoInput.value.trim(); // Obtiene el texto (enlace)
  const color = document.querySelector('input[name="color"]:checked').value; // Obtiene el color seleccionado

  if (!texto) return; // Si no hay texto, no se genera el QR

  mostrarTexto(); // Muestra el nombre del código QR

  // Genera el código QR usando la librería QRCode
  QRCode.toCanvas(canvas, texto, {
    color: {
      dark: color,       // Color del QR
      light: '#ffffff'   // Color de fondo
    },
    width: 200,          // Ancho del canvas
    margin: 2            // Margen alrededor del QR
  }, function (error) {
    if (error) console.error(error);  // Muestra error si hay
    else btnDescargar.disabled = false; // Habilita botón de descarga si fue exitoso
  });
}

// Función que descarga el QR como imagen PNG
function descargarQR() {
  const contenedor = document.querySelector('.qr-container'); // Elemento que contiene el QR
  const nombreQR = nombreInput.value.trim() || 'codigoQR';   // Nombre del archivo

  // Usa html2canvas para capturar el contenedor como imagen
  html2canvas(contenedor).then(captura => {
    const enlace = document.createElement('a');       // Crea un enlace temporal
    enlace.download = `${nombreQR}.png`;              // Nombre del archivo
    enlace.href = captura.toDataURL();                // Obtiene la imagen en formato base64
    enlace.click();                                   // Simula el clic para descargar
  }).catch(error => {
    console.error('Error al capturar el contenedor:', error); // Manejo de errores
  });
}

// Función que limpia el formulario y reinicia el estado de la app
function reiniciarFormulario() {
  nombreInput.value = '';
  textoInput.value = '';
  document.querySelector('input[name="color"][value="#000000"]').checked = true; // Reinicia el color

  const contexto = canvas.getContext('2d');       // Obtiene el contexto del canvas
  contexto.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas

  resultadoTexto.textContent = '';                // Limpia el texto mostrado
  btnGenerar.disabled = true;                     // Desactiva el botón de generar
  btnDescargar.disabled = true;                   // Desactiva el botón de descargar
  nombreInput.focus();                            // Coloca el cursor en el campo nombre
}
