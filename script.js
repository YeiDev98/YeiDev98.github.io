const textArea = document.querySelector(".text_area");
const mensaje = document.querySelector(".text_area_2");
const mensajeDefault1 = document.getElementById("mensaje1");
const mensajeDefault2 = document.getElementById("mensaje2");

// La letra "e" es convertida para "enter"
// La letra "i" es convertida para "imes"
// La letra "a" es convertida para "ai"
// La letra "o" es convertida para "ober"
// La letra "u" es convertida para "ufat"
function encriptar(stringEncriptado) {
    let matrizCodigo = [ ['e', 'enter'], ['i', 'imes'], ['a', 'ai'], ['o', 'ober'], ['u', 'ufat'] ];
    stringEncriptado = stringEncriptado.toLowerCase();
    for (let i = 0; i < matrizCodigo.length; i++) {
        if (stringEncriptado.includes(matrizCodigo[i][0])) {
            stringEncriptado = stringEncriptado.replaceAll(matrizCodigo[i][0], matrizCodigo[i][1]);
        }
    }
    return stringEncriptado;
}

function btnEncriptar() {
    const textoEncriptado = encriptar(textArea.value);
    mensaje.value = textoEncriptado;
    mensaje.style.backgroundImage= 'none';
    textArea.value = '';
    mensajeDefault1.textContent = '¡Texto encriptado correctamente!';
    mensajeDefault2.textContent = '';
}

function desencriptar(stringDesencriptado) {
    let matrizCodigo = [ ['e', 'enter'], ['i', 'imes'], ['a', 'ai'], ['o', 'ober'], ['u', 'ufat'] ];
    stringDesencriptado = stringDesencriptado.toLowerCase();
    for (let i = 0; i < matrizCodigo.length; i++) {
        if (stringDesencriptado.includes(matrizCodigo[i] [1])) {
            stringDesencriptado = stringDesencriptado.replaceAll(matrizCodigo [i] [1], matrizCodigo [i] [0]);
        }
    }
    return stringDesencriptado;
}

function btnDesencriptar() {
    const textoEncriptado = desencriptar(textArea.value);
    mensaje.value = textoEncriptado;
    textArea.value = '';
    mensajeDefault1.textContent = '¡Texto desencriptado correctamente!';
    mensajeDefault2.textContent = '';
    mensaje.style.backgroundImage= 'none';
}


function copiarTexto() {
    const textArea = document.querySelector('.text_area_2');
    textArea.select();
    document.execCommand('copy'); 
    mensajeDefault2.textContent = '¡Texto copiado al portapapeles!';
    mensaje.value = '';
}
