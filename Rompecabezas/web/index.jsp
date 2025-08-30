<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spiderman Rompecabezas</title>
    <link rel="stylesheet" href="./css/estilo.css">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
</head>
<body>

    <!-- Sombreado del fondo -->
    <div class="particles" id="particles"></div>
    
    <!-- Efectos de fusion  -->
    <div class="lightning" id="lightning"></div>

    <div class="game-container">
        <h1 class="main-title">Spiderman Rompecabezas</h1>
        <p class="subtitle">Desafia tus sentidos aracnidos</p>
        
        <!-- Barra de datos -->
        <div class="stats-bar">
            <div class="stat-item">
                <div class="stat-label">Movimientos</div>
                <div class="stat-value" id="moves">0</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Tiempo</div>
                <div class="timer" id="time">03:00</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Nivel</div>
                <div class="stat-value">Pro</div>
            </div>
        </div>

        <!-- Área principal del juego -->
        <div class="game-area">
            <div class="reference-section">
                <div class="reference-image">
                    <img src="image/Spiderman.jpg" alt="Spiderman Original" id="referenceImg">
                    <div class="image-overlay">
                        <span>Objetivo</span>
                    </div>
                </div>
                <div class="reference-label">Imagen Original</div>
            </div>

            <div class="puzzle-section">
                <div class="puzzle-header">
                    <h3>ROMPECABEZAS</h3>
                    <div class="difficulty-indicator">
                        <span class="difficulty-text">Dificultad: Intermedio</span>
                    </div>
                </div>
                <div id="puzzle" class="puzzle"></div>
            </div>
        </div>

        <div id="mensaje" class="mensaje"></div>

        <!-- Controles del juego -->
        <div class="game-controls">
            <button class="epic-button restart-btn" onclick="reiniciar()">
                <span class="button-text">Reiniciar</span>
                <div class="button-glow"></div>
            </button>
            <button class="epic-button hint-btn" onclick="mostrarPista()">
                <span class="button-text">Pista</span>
                <div class="button-glow"></div>
            </button>
            <button class="epic-button pause-btn" onclick="pausarJuego()">
                <span class="button-text" id="pauseText">Pausar</span>
                <div class="button-glow"></div>
            </button>
        </div>

        <!-- Indicador de progreso -->
        <div class="progress-container">
            <div class="progress-label">Tu progreso</div>
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill"></div>
                <div class="progress-text" id="progressText">0%</div>
            </div>
        </div>
    </div>

    <!-- Indica la victoria -->
    <div id="victoryModal" class="victory-modal">
        <div class="victory-content">
            <div class="victory-title">MISIÓN CUMPLIDA</div>
            <div class="victory-message">
                Has demostrado tener verdaderos poderes aracnidos
            </div>
            <div class="victory-stats">
                <div class="victory-stat">
                    <span>Tiempo: <span id="finalTime"></span></span>
                </div>
                <div class="victory-stat">
                    <span>Movimientos: <span id="finalMoves"></span></span>
                </div>
            </div>
            <button class="epic-button victory-btn" onclick="cerrarModal()">
                <div class="button-glow"></div>
            </button>
        </div>
    </div>

    <div class="sound-effects" id="soundEffects"></div>
            <script src="./js/script.js"></script>

</body>
</html>