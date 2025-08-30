let puzzleContainer = document.getElementById("puzzle");
let mensaje = document.getElementById("mensaje");
let timeDisplay = document.getElementById("time");
let movesDisplay = document.getElementById("moves");
let progressFill = document.getElementById("progressFill");
let progressText = document.getElementById("progressText");

// piezas de el rompe
let piezas = [
    "split-1.jpeg", "split-2.jpeg", "split-3.jpeg", "split-4.jpeg",
    "split-5.jpeg", "split-6.jpeg", "split-7.jpeg", "split-8.jpeg",
    "split-9.jpeg", "split-10.jpeg", "split-11.jpeg", "split-12.jpeg",
    "split-13.jpeg", "split-14.jpeg", "split-15.jpeg", ""
];

let estado = [];
let timer;
let timeLeft = 180; // 3 minutos
let moves = 0;
let gameStarted = false;
let gamePaused = false;
let hintUsed = false;

// para los efectos
function initParticles() {
    const particlesContainer = document.getElementById("particles");
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 6 + "s";
        particle.style.animationDuration = (6 + Math.random() * 4) + "s";
        particlesContainer.appendChild(particle);
    }
}

function triggerLightning() {
    const lightning = document.getElementById("lightning");
    lightning.classList.add("active");
    setTimeout(() => {
        lightning.classList.remove("active");
    }, 300);
}

// Función para mezclar las piezas
function mezclar(array) {
    let copia = [...array];
    let intentos = 0;
    
    do {
        // Mezclar usando algoritmo Fisher-Yates
        for (let i = copia.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [copia[i], copia[j]] = [copia[j], copia[i]];
        }
        intentos++;
    } while (JSON.stringify(copia) === JSON.stringify(array) && intentos < 100);
    
    return copia;
}

// Dibuja el rompe
function dibujar() {
    puzzleContainer.innerHTML = "";
    
    estado.forEach((valor, i) => {
        let celda = document.createElement("div");
        celda.classList.add("celda");
        celda.setAttribute("data-index", i);
        
        if (valor === "") {
            celda.classList.add("vacio");
        } else {
            let img = document.createElement("img");
            img.src = `image/${valor}`;
            img.alt = `Pieza ${valor}`;
            img.onload = function() {
                celda.style.opacity = "1";
            };
            celda.appendChild(img);
            celda.addEventListener("click", () => mover(i));
            
            // Verificar si la pieza está en posición correcta
            if (piezas[i] === valor) {
                celda.classList.add("correct-position");
            }
        }
        
        puzzleContainer.appendChild(celda);
    });
    
    actualizarProgreso();
}

// mueve las piezas
function mover(indice) {
    if (gamePaused) return;
    
    if (!gameStarted) {
        gameStarted = true;
        iniciarTemporizador();
    }
    
    let vacio = estado.indexOf("");
    let filas = 4;
    let col = indice % filas;
    let fila = Math.floor(indice / filas);
    let colVacio = vacio % filas;
    let filaVacio = Math.floor(vacio / filas);
    
    // Verificar si es adyacente
    if (
        (Math.abs(col - colVacio) === 1 && fila === filaVacio) ||
        (Math.abs(fila - filaVacio) === 1 && col === colVacio)
    ) {
        // Añadir efecto visual de movimiento
        let celda = document.querySelector(`[data-index="${indice}"]`);
        celda.classList.add("moving");
        
        setTimeout(() => {
            celda.classList.remove("moving");
        }, 400);
        
        // Intercambiar piezas
        [estado[indice], estado[vacio]] = [estado[vacio], estado[indice]];
        
        // Incrementar contador de movimientos
        moves++;
        movesDisplay.textContent = moves;
        movesDisplay.classList.add("updated");
        setTimeout(() => {
            movesDisplay.classList.remove("updated");
        }, 500);
        
        // Efectos de sonido simulados
        playMoveSound();
        
        setTimeout(() => {
            dibujar();
            verificar();
        }, 200);
    } else {
        // Efecto de negación
        let celda = document.querySelector(`[data-index="${indice}"]`);
        celda.style.transform = "scale(0.95) rotateZ(-2deg)";
        celda.style.borderColor = "rgba(255, 100, 100, 0.8)";
        setTimeout(() => {
            celda.style.transform = "";
            celda.style.borderColor = "";
        }, 200);
    }
}

// Verificar victoria con celebración épica
function verificar() {
    if (JSON.stringify(estado) === JSON.stringify(piezas)) {
        clearInterval(timer);
        gameStarted = false;
        
        // Efectos de victoria
        triggerVictory();
        
        setTimeout(() => {
            mostrarModalVictoria();
        }, 1000);
    }
}

// Efectos de victoria
function triggerVictory() {
    mensaje.classList.add("victory");
    mensaje.textContent = "Lo lograste Felicidades";
    
    // Efectos de rayos múltiples
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            triggerLightning();
        }, i * 200);
    }
    
    // Animar todas las piezas
    document.querySelectorAll(".celda:not(.vacio)").forEach((celda, index) => {
        setTimeout(() => {
            celda.style.animation = "correctPiece 1s ease";
        }, index * 50);
    });
}

// Mostrar modal de victoria
function mostrarModalVictoria() {
    const modal = document.getElementById("victoryModal");
    const finalTime = document.getElementById("finalTime");
    const finalMoves = document.getElementById("finalMoves");
    
    finalTime.textContent = formatTime(180 - timeLeft);
    finalMoves.textContent = moves;
    
    modal.classList.add("show");
}

// Cerrar modal de victoria
function cerrarModal() {
    const modal = document.getElementById("victoryModal");
    modal.classList.remove("show");
    reiniciar();
}

// Temporizador con efectos visuales
function iniciarTemporizador() {
    timer = setInterval(() => {
        timeLeft--;
        
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timeDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Advertencia de tiempo
        if (timeLeft <= 30) {
            timeDisplay.classList.add("warning");
            if (timeLeft <= 10) {
                triggerLightning();
            }
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            gameStarted = false;
            mensaje.textContent = "Tiempo agotado";
            setTimeout(() => {
                if (confirm("Intentalo de nuevo")) {
                    reiniciar();
                }
            }, 1000);
        }
    }, 1000);
}

// Actualizar barra de progreso
function actualizarProgreso() {
    let piezasCorrectas = 0;
    for (let i = 0; i < 15; i++) {
        if (piezas[i] === estado[i]) {
            piezasCorrectas++;
        }
    }
    
    let porcentaje = Math.round((piezasCorrectas / 15) * 100);
    progressFill.style.width = porcentaje + "%";
    progressText.textContent = porcentaje + "%";
}

// Formatear tiempo
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Reiniciar juego
function reiniciar() {
    clearInterval(timer);
    gameStarted = false;
    gamePaused = false;
    moves = 0;
    timeLeft = 180;
    hintUsed = false;
    
    // Resetear displays
    movesDisplay.textContent = "0";
    timeDisplay.textContent = "03:00";
    timeDisplay.classList.remove("warning");
    mensaje.textContent = "Usa tus sentidos aracnidos para resolver el rompecabezas";
    mensaje.classList.remove("victory");
    
    // Resetear botón de pausa
    document.getElementById("pauseText").textContent = "Pausar";
    
    // Mezclar y dibujar
    estado = mezclar(piezas);
    dibujar();
    
    // Efecto de reinicio
    triggerLightning();
}

// Mostrar pista
function mostrarPista() {
    if (hintUsed) {
        mensaje.textContent = "Ya has usado tu pista aracnida";
        return;
    }
    
    hintUsed = true;
    
    // Mostrar brevemente las piezas correctas
    document.querySelectorAll(".celda").forEach((celda, index) => {
        if (piezas[index] === estado[index] && estado[index] !== "") {
            celda.style.border = "3px solid #00ff88";
            celda.style.boxShadow = "0 0 20px rgba(0, 255, 136, 0.8)";
            
            setTimeout(() => {
                celda.style.border = "";
                celda.style.boxShadow = "";
            }, 3000);
        }
    });
    
    mensaje.textContent = "Pista activada Las piezas correctas brillan en verde";
    
    setTimeout(() => {
        mensaje.textContent = "Sigue usando tus sentidos aracnidos";
    }, 3000);
}

// Pausar/reanudar juego
function pausarJuego() {
    if (!gameStarted) return;
    
    gamePaused = !gamePaused;
    const pauseText = document.getElementById("pauseText");
    
    if (gamePaused) {
        clearInterval(timer);
        pauseText.textContent = "Reanudar";
        mensaje.textContent = "Juego Pausado";
        
        // Ocultar puzzle mientras está pausado
        puzzleContainer.style.filter = "blur(10px)";
        puzzleContainer.style.pointerEvents = "none";
    } else {
        iniciarTemporizador();
        pauseText.textContent = "Pausar";
        mensaje.textContent = "De vuelta a la accion";
        
        // Mostrar puzzle
        puzzleContainer.style.filter = "";
        puzzleContainer.style.pointerEvents = "";
    }
}

// Efectos de sonido simulados
function playMoveSound() {
    // Crear elemento de audio temporal para simular sonido
    const soundEffect = document.createElement("div");
    soundEffect.style.position = "fixed";
    soundEffect.style.top = "50%";
    soundEffect.style.left = "50%";
    soundEffect.style.width = "1px";
    soundEffect.style.height = "1px";
    soundEffect.style.background = "rgba(0, 255, 136, 0.8)";
    soundEffect.style.borderRadius = "50%";
    soundEffect.style.animation = "soundPulse 0.3s ease-out";
    soundEffect.style.pointerEvents = "none";
    
    document.body.appendChild(soundEffect);
    
    setTimeout(() => {
        document.body.removeChild(soundEffect);
    }, 300);
}

// Añadir animación para efecto de sonido
const soundPulseCSS = `
@keyframes soundPulse {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(100); opacity: 0; }
}
`;

// Insertar CSS para animaciones adicionales
const style = document.createElement("style");
style.textContent = soundPulseCSS;
document.head.appendChild(style);

// Event listeners para atajos de teclado
document.addEventListener("keydown", function(e) {
    switch(e.key) {
        case 'r':
        case 'R':
            reiniciar();
            break;
        case 'h':
        case 'H':
            mostrarPista();
            break;
        case ' ':
            e.preventDefault();
            pausarJuego();
            break;
    }
});

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    initParticles();
    reiniciar();
    
    // Mensaje de bienvenida
    setTimeout(() => {
        mensaje.textContent = "Bienvenido al rompecabezas";
    }, 1000);
    
    // Efectos adicionales cada cierto tiempo
    setInterval(() => {
        if (Math.random() < 0.3 && gameStarted && !gamePaused) {
            triggerLightning();
        }
    }, 15000);
});

// Prevenir clic derecho en las imágenes
document.addEventListener("contextmenu", function(e) {
    if (e.target.tagName === "IMG") {
        e.preventDefault();
    }
});

// Optimización para dispositivos móviles
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, {passive: true});
}