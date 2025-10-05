
        let isPlaying = false;
        let currentTrack = 0;
        let currentTime = 0;
        let actualDuration = 0;
        let currentLyricIndex = 0;
        let displayMode = 'lyrics';
        let currentTheme = 'neon';
        let isExpanded = false;
        let audioFiles = [];

        const songs = [
            {
                title: "Mi niña bonita",
                artist: "Chino y nacho",
                duration: 0,
                audioSrc: "music/Mi niña bonita.mp3",
                lyrics: [
                    { time: 0, text: "♪ Mi niña bonita ♪" },
                    { time: 10, text: "Hola mi niña :3" },
                    { time: 15, text: "Te quiero mucho jsjsjs" },
                ]
            },
            {
                title: "Te Quiero Tanto",
                artist: "Kevin Kaarl",
                duration: 0,
                audioSrc: "music/Te Quiero Tanto.mp3", 
                lyrics: [
                    { time: 0, text: "♪ Te Quiero Tanto ♪" },
                    { time: 5, text: "Debes de hacer caso eh :3" },
                    { time: 10, text: "Asi que debes de" },
                    { time: 15, text: "Tenerme siempre presente :c" },
                ]
            },
            {
                title: "Perfect",
                artist: "Ed Sheeran",
                duration: 0,
                audioSrc: "music/Perfect.mp3", 
                lyrics: [
                    { time: 0, text: "♪ Perfect ♪" },
                    { time: 8, text: "Haii mi niña :3" },
                    { time: 14, text: "Como dice la cancion" },
                    { time: 18, text: "Somos perfectos juntos mi niña :3" },
                ]
            }
            
            // Canciones
        ];
        

        // Cargar archivos reales
function loadAudioFiles(event) {
    const files = Array.from(event.target.files);
    
    files.forEach((file) => {
        if (file.type.startsWith('audio/')) {
            const url = URL.createObjectURL(file);
            const fileName = file.name.replace(/\.[^/.]+$/, "");
            
            // Siempre agregar nueva canción al final (no reemplazar)
            songs.push({
                title: fileName,
                artist: "Desde Mi Corazon",
                duration: 0, // Se actualizará cuando se cargue
                audioSrc: url,
                lyrics: [
                    { time: 0, text: `♪ ${fileName} ♪` },
                    { time: 10, text: "Mira, esta es una prueba" },
                    { time: 20, text: "aqui iria mi dedicatoria" },
                    { time: 30, text: "y si quiero cambiarlo" },
                    { time: 40, text: "lo haria desde el codigo" },
                    { time: 50, text: "O puedes crear una opcion para " },
                    { time: 60, text: "escribir el texto y este se muestre aqui" }
                ]
            });
        }
    });
    
    //Hola mi niña :3
    //Quiero decirte que
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    updatePlaylist();
    
    // Auto selecciona la primera canción cargada si hay archivos
    if (files.length > 0) {
        const firstNewSongIndex = songs.length - files.filter(f => f.type.startsWith('audio/')).length;
        selectTrack(firstNewSongIndex);
        
        // Scroll automático a la nueva canción en la playlist
        setTimeout(() => {
            const activeItem = document.querySelector('.playlist-item.active');
            if (activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }
    
    // Limpiar el input para permitir cargar el mismo archivo otra vez
    event.target.value = '';
}

// Función para eliminar canción de la playlist
function removeTrack(index) {
    if (songs.length > 1 && index >= 4) { // No permitir eliminar las canciones que subì
        // Si estamos reproduciendo la canción que se va a eliminar
        if (currentTrack === index) {
            // Cambiar a la anterior o siguiente
            const newIndex = index > 0 ? index - 1 : 0;
            selectTrack(newIndex);
        } else if (currentTrack > index) {
            // Ajustar índice actual si estaba después de la eliminada
            currentTrack--;
        }
        
        // Eliminar la canción
        songs.splice(index, 1);
        updatePlaylist();
    }
}

function updatePlaylist() {
    const playlist = document.querySelector('.playlist');
    playlist.innerHTML = '';
    
    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = `playlist-item ${index === currentTrack ? 'active' : ''}`;
        item.onclick = () => selectTrack(index);
        
        // Diferentes iconos para diferentes tipos
        let icon = '🎮'; // Demo
        if (song.audioSrc) {
            icon = '🎵'; // Archivo local
        }
        
        const status = song.audioSrc ? '' : ' (Demo)';
        const itemText = `${icon} ${song.title}${status}`;
        
        // Crear contenedor para el texto y botón eliminar
        const textSpan = document.createElement('span');
        textSpan.textContent = itemText;
        textSpan.style.flex = '1';
        
        item.appendChild(textSpan);
        
        // Agregar botón eliminar solo para archivos locales (no demos)
        if (song.audioSrc && index >= 4) {
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '×';
            deleteBtn.style.cssText = `
                background: rgba(255,0,0,0.7);
                border: none;
                border-radius: 3px;
                color: white;
                width: 20px;
                height: 20px;
                cursor: pointer;
                margin-left: 8px;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            deleteBtn.onclick = (e) => {
                e.stopPropagation(); // Evitar que seleccione la canción
                removeTrack(index);
            };
            deleteBtn.title = 'Eliminar canción';
            
            item.appendChild(deleteBtn);
            item.style.display = 'flex';
            item.style.alignItems = 'center';
        }
        
        playlist.appendChild(item);
    });
    
    // Scroll automático al item activo si está fuera de vista
    setTimeout(() => {
        const activeItem = document.querySelector('.playlist-item.active');
        if (activeItem) {
            const playlist = document.querySelector('.playlist');
            const playlistRect = playlist.getBoundingClientRect();
            const activeRect = activeItem.getBoundingClientRect();
            
            // Si el item activo está fuera de vista, hacer scroll
            if (activeRect.top < playlistRect.top || activeRect.bottom > playlistRect.bottom) {
                activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, 50);
}


function toggleExpanded() {
    isExpanded = !isExpanded;
    const container = document.getElementById('playerContainer');
    const expandBtn = document.getElementById('expandBtn');
    const indicator = document.getElementById('modeIndicator');
    
    if (isExpanded) {
        container.className = 'player-container expanded';
        expandBtn.textContent = '⛶';
        expandBtn.title = 'Modo Compacto';
        indicator.textContent = ' ';
        updateDedicationPanel(); 
    } else {
        container.className = 'player-container compact';
        expandBtn.textContent = '⛶';
        expandBtn.title = '';
        indicator.textContent = '';
    }
}


        function updateLyricsPanel() {
    updateDedicationPanel();
}


        function getCurrentLyricIndex() {
            const song = songs[currentTrack];
            let index = -1;
            for (let i = 0; i < song.lyrics.length; i++) {
                if (currentTime >= song.lyrics[i].time) {
                    index = i;
                }
            }
            return index;
        }

        function seekTo(event) {
            const progressBar = event.currentTarget;
            const rect = progressBar.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const percentage = clickX / rect.width;
            
            const audioPlayer = document.getElementById('audioPlayer');
            if (audioPlayer.src) {
                audioPlayer.currentTime = percentage * audioPlayer.duration;
            } else {
                const song = songs[currentTrack];
                currentTime = Math.floor(percentage * song.duration);
                updateProgress();
                updateLyrics();
                if (isExpanded) updateLyricsPanel();
            }
        }

        function changeVolume() {
            const volumeSlider = document.getElementById('volumeSlider');
            const audioPlayer = document.getElementById('audioPlayer');
            audioPlayer.volume = volumeSlider.value / 100;
        }

        function onAudioLoaded() {
            const audioPlayer = document.getElementById('audioPlayer');
            actualDuration = audioPlayer.duration;
            songs[currentTrack].duration = actualDuration;
            updateDisplay();
        }

        function onTimeUpdate() {
    const audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer.src) {
        currentTime = audioPlayer.currentTime;
        updateProgress();
        updateLyrics();
        if (isExpanded) updateDedicationPanel();
        animateVisualizer();
    }
}


        function onSongEnd() {
            nextTrack();
        }

        function initPlayer() {
    initVisualizer();
    updateDisplay();
    updateProgress();
    updateLyrics();
    updatePlaylist();
    loadSavedDedications();
}


        function initVisualizer() {
    const visualizer = document.getElementById('visualizer');
    visualizer.innerHTML = '';
    const symbols = ['♥', '♪', '♥', '♫', '♥', '♬', '♥', '♪', '♥', '♫', '♥', '♬', '♥'];
    
    symbols.forEach((symbol, i) => {
        const element = document.createElement('div');
        element.className = 'music-symbol';
        element.textContent = symbol;
        element.style.animationDelay = `${i * 0.1}s`;
        visualizer.appendChild(element);
    });
}





        function changeTheme(theme) {
            currentTheme = theme;
            const player = document.getElementById('mp3Player');
            const panel = document.getElementById('lyricsPanel');
            player.className = `mp3-player ${theme}`;
            panel.className = `lyrics-panel ${theme}`;
        }

        function updateDisplay() {
            const song = songs[currentTrack];
            document.getElementById('songTitle').textContent = song.title;
            document.getElementById('artistName').textContent = song.artist;
            document.getElementById('totalTime').textContent = formatTime(song.duration);
        }

        function updateLyrics() {
    const song = songs[currentTrack];
    const lyricsContainer = document.getElementById('lyricsContainer');
    
    let currentIndex = getCurrentLyricIndex();

    lyricsContainer.innerHTML = '';
    
    // Solo mostrar una línea actual 
    if (currentIndex >= 0 && song.lyrics[currentIndex]) {
        const line = document.createElement('div');
        line.className = 'lyrics-line current';
        line.textContent = song.lyrics[currentIndex].text;
        lyricsContainer.appendChild(line);
    } else {
        // Si no hay línea actual, mostrar mensaje de espera
        const placeholder = document.createElement('div');
        placeholder.className = 'lyrics-line';
        placeholder.textContent = '♪ Escuchando... ♪';
        lyricsContainer.appendChild(placeholder);
    }
}


        function togglePlay() {
            const audioPlayer = document.getElementById('audioPlayer');
            isPlaying = !isPlaying;
            const playBtn = document.getElementById('playBtn');
            const bars = document.querySelectorAll('.bar');
            
            if (isPlaying) {
                playBtn.textContent = '⏸';
                bars.forEach(bar => {
                    bar.style.animationPlayState = 'running';
                });
                
                if (audioPlayer.src) {
                    audioPlayer.play();
                } else {
                    startTimer();
                }
            } else {
                playBtn.textContent = '▶';
                bars.forEach(bar => {
                    bar.style.animationPlayState = 'paused';
                });
                
                if (audioPlayer.src) {
                    audioPlayer.pause();
                } else {
                    stopTimer();
                }
            }
        }

        function selectTrack(index) {
            document.querySelectorAll('.playlist-item').forEach(item => {
                item.classList.remove('active');
            });
            
            document.querySelectorAll('.playlist-item')[index].classList.add('active');
            
            currentTrack = index;
            currentTime = 0;
            
            const audioPlayer = document.getElementById('audioPlayer');
            const song = songs[currentTrack];
            
            if (song.audioSrc) {
                audioPlayer.src = song.audioSrc;
                audioPlayer.load();
            } else {
                audioPlayer.src = "";
            }
            
            updateDisplay();
            updateProgress();
            updateLyrics();
            
            //
            if (isExpanded) updateDedicationPanel();
            
            if (isPlaying) {
                stopTimer();
                isPlaying = false;
                togglePlay();
            }
        }
        

        function nextTrack() {
            const nextIndex = (currentTrack + 1) % songs.length;
            selectTrack(nextIndex);
        }

        function previousTrack() {
            const prevIndex = currentTrack === 0 ? songs.length - 1 : currentTrack - 1;
            selectTrack(prevIndex);
        }

        function cycleDisplayMode() {
            const modes = ['lyrics', 'visualizer', 'info'];
            const currentIndex = modes.indexOf(displayMode);
            displayMode = modes[(currentIndex + 1) % modes.length];
            
            const indicator = document.getElementById('modeIndicator');
            if (!isExpanded) {
                switch(displayMode) {
                    case 'lyrics':
                        indicator.textContent = '';
                        break;
                    case 'visualizer':
                        indicator.textContent = '';
                        break;
                    case 'info':
                        indicator.textContent = '';
                        break;
                }
            }
        }

        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        function updateProgress() {
            const song = songs[currentTrack];
            const duration = actualDuration || song.duration;
            const progress = (currentTime / duration) * 100;
            document.getElementById('progressFill').style.width = `${progress}%`;
            document.getElementById('currentTime').textContent = formatTime(currentTime);
        }

        let timer;
        function startTimer() {
    timer = setInterval(() => {
        const song = songs[currentTrack];
        currentTime++;
        
        if (currentTime >= song.duration) {
            nextTrack();
            if (isPlaying) {
                setTimeout(() => togglePlay(), 100);
            }
        }
        
        updateProgress();
        updateLyrics();
        if (isExpanded) updateDedicationPanel();
        animateVisualizer();
    }, 1000);
}


        function stopTimer() {
            clearInterval(timer);
        }

        function animateVisualizer() {
    const elements = document.querySelectorAll('.music-symbol');
    elements.forEach((element, index) => {
        // Cambiar ligeramente el timing para crear variación
        const randomDelay = Math.random() * 0.3;
        element.style.animationDelay = `${(index * 0.1) + randomDelay}s`;
        
        // Variar ocasionalmente la duración de la animación
        const randomDuration = 1.2 + (Math.random() * 0.6); // 1.2s y 1.8s
        element.style.animationDuration = `${randomDuration}s`;
    });
}
// Sistema de dedicatoria con timing automático
// Sistema de dedicatorias individuales por canción
let songDedications = {}; // Objeto que almacenará dedicatorias por ID de canción

// Función para generar ID único de canción
function getSongId(song) {
    // Usar título + artista + (audioSrc si existe) para crear ID único
    return `${song.title}_${song.artist}_${song.audioSrc || 'demo'}`.replace(/[^a-zA-Z0-9]/g, '_');
}

const fixedDedications = {
    "Mi_ni_a_bonita_Chino_y_nacho_music_Mi_ni_a_bonita_mp3": {
        title: "Para mi niña bonita :3",
        subtitle: "Desde mi corazon eh :c",
        lines: [
            "♪ Mi Niña Bonita ♪",
            "Hola mi niña :3",
            "Muy bonita cancion la verdad jsjsjs,",
            "Sabes, cuando nos conocimos",
            "estaba pasando por unos problemas :c",
            "No sabía qué hacer,",
            "estaba mel... todos los días,",
            "y ni pasar tiempo con amigos",
            "lograba solucionarlo :c",
            "Pensaba en rendirme con todo :c",
            "pero llegaste tú,",
            "con tu sonrisa de maniaca jsjsjs",
            "y cambiaste todo :o",
            "Aunque no nos conozcamos en persona,",
            "solo por esas fotitos que me envías,",
            "con tu carita toda bonita jsjsjs",
            "y tus bailes todos raros jsjsjs",
            "(pero me gustan ehhh jsjs :3)",
            "me haces feliz de una manera",
            "que ni yo entiendo.",
            "Así que ya sabes mi niña,",
            "si quieres mandar fotitos o videos,",
            "no hay problema eh jsjs",
            "porque me encantan :3",
            "tu y tus bailes jsjsjs",
            "espero que me mandes como 100 al día jsjsjs",
            "para tenerte cerquita aunque sea en la pantalla :3",
            "Sé que pasas tiempo con tus amigos y tal,",
            "y me pone bastante celoso la verdad :c",
            "pero espero que no hagas nada malo :c",
            "porque el único en tu vida debo ser yo eh 😤",
            "porque para mí tú eres mi única niña bonita :3",
            "Sé que aún no te conozco en persona,",
            "pero no hace falta para saber",
            "que eres especial para mí.",
            "Cada mensaje tuyo, cada foto,",
            "cada todo jsjsjs",
            "me hacen quererte más :c",
            "Asi que no seas tan mala conmigo :c ",
            "Porque me pone triste la verdad :c",
            "Te quiero mucho mi niña bonita :3",
        ]
    },
    
    "Te_Quiero_Tanto_Kevin_Kaarl_music_Te_Quiero_Tanto_mp3": {
        title: "Te Quiero Tanto",
        subtitle: "Para mi niña especial",
        lines: [
            "♪ Te Quiero Tanto ♪",
            "Esta canción es muy bonita, no? :c",
            "Creo que deberías de hacerle caso a lo que dice :c",
            "Así que no puedes decir que te quieres ir :c",
            "Si ya sabes cómo me pongo",
            "cuando me dejas unos segundos jsjsjs",
            "Si me dices que te vas para siempre…",
            "voy y te busco ehhh jsjsjs",
            "Espero que aunque no estemos juntos :c",
            "me lleves contigo a todos lados,",
            "mientras me pienses",
            "o escuches la canción que te canté jsjsjs",
            "estaré contigo mi niña :c",
            "Yo no sé si pueda dejarte de querer,",
            "porque cada vez que pienso en ti",
            "mi mundo se calma, mi corazón late más fuerte :O",
            "espero sea por ti y no por problemas de corazon jsjsjs",
            "Espero lo tengas en cuenta y no me ignores por horas :c",
            "Eres como esa canción",
            "que nunca quiero que termine jsjsjs",
            "espero que seas aquella persona que me acompañe",
            "aun cuando todo se ponga gris :c",
            "Aunque la distancia nos separe",
            "y aunque no pueda abrazarte todavía,",
            "quiero que sepas que te pienso,",
            "te extraño y te quiero tanto, tanto, tanto",
            "que ni yo entiendo cómo cabe en mí.",
            "Mi niña bonita, mi razón y mi paz,",
            "no importa dónde estés",
            "en mi corazón siempre habrá un lugar",
            "que es solo para ti.",
            "Así que cuando escuches esta canción,",
            "piensa en mí,",
            "cierra los ojos,",
            "y siente que estoy ahí contigo,",
            "susurrándote bajito:",
            "te quiero mucho mi niña :3"
        ]
    },
    
    "Perfect_Ed_Sheeran_music_Perfect_mp3": {
        title: "Perfect",
        subtitle: "Perfecta para mi :3",
        lines: [
            "♪ Perfect ♪",
            "Weno, el como nos conocimos :o",
            "La verdad, no se porque te uniste ese día jsjsjs",
            "Estaba solito jugando :c",
            "Y se unió una personita :o",
            "Esa eras tu, mi niña :3",
            "Fue bastante raro el que te unieras jsjs",
            "No nos conocíamos mucho :c",
            "Creo que jugamos solo 1 vez :o",
            "Con esa sonrisita que me mostraste :3",
            "Que curiosa me pareciste jsjsjs",
            "A partir de ahí",
            "Empezamos a pasar mas tiempo juntos :3",
            "Aunque no tanto como yo quiero :c",
            "Se que tienes amigos(ratas) jsjsjs",
            "Y a veces me enfada que les escribas",
            "Cuando me escribes a mi :c",
            "Espero me perdones por eso mi niña :c",
            "Pero tu también",
            "Deja de escribirles cuando estes conmigo :c",
            "Porque me pongo celoso jsjsjs",
            "Asique ya sabes 😤",
            "A veces es difícil la verdad",
            "Estamos separados por la distancia :c",
            "Y eso me hace sentir triste :c",
            "Quisiera poder verte cuando quiera",
            "Abrazarte cuando quiera mi niña :c",
            "Ya no sigo que me pongo triste jsjsj",
            "A pesar de todo eso mi niña",
            "Quiero que sepas que te quiero mucho :3",
            "Aunque a veces me enfade",
            "O tu te enfades :c",
            "Perdón por eso eh jsjs",
            "La verdad es que",
            "Aunque parezca enfadado 😤",
            "Solo espero a que",
            "Me envíes un mensaje, audio, fotito :c",
            "Así que no me dejes de escribir por horas 🥺",
            "Porque me pongo triste :c",
            "Mala jsjsjs",
            "Te quiero mucho mi niña :c",
            "Espero podamos seguir",
            "Juntos para siempre :3",
            "Te amo :3",
            "Mi princesa hermosa :3"
        ]
    }
};



// Función para obtener dedicatoria fija (no editable)
function getCurrentDedication() {
    const songId = getSongId(songs[currentTrack]);
    
    
    // Si existe dedicatoria fija, usarla
    if (fixedDedications[songId]) {
        return fixedDedications[songId];
    }
    
    // Para canciones subidas por el usuario, usar dedicatoria genérica
    const currentSong = songs[currentTrack];
    return {
        title: `♪ ${currentSong.title} ♪`,
        subtitle: "Una canción especial",
        lines: [
            `♪ ${currentSong.title} ♪`,
            "Esta canción también es especial",
            "porque la escuchamos juntos",
            "y cada momento contigo",
            "se vuelve único",
            "Gracias por compartir",
            "tu música conmigo",
            "♪ Con cariño ♪"
        ]
    };
}




// Función para calcular timing automático según duración de canción
function calculateDedicationTiming() {
    const song = songs[currentTrack];
    const totalDuration = actualDuration || song.duration;
    const dedication = getCurrentDedication();
    const totalLines = dedication.lines.length;
    
    if (totalLines === 0) return [];
    
    const timePerLine = totalDuration / totalLines;
    
    const dedicationTiming = dedication.lines.map((line, index) => ({
        time: Math.floor(index * timePerLine),
        text: line
    }));
    
    return dedicationTiming;
}

// Función para obtener la línea actual de dedicatoria
function getCurrentDedicationIndex() {
    const timing = calculateDedicationTiming();
    let index = -1;
    
    for (let i = 0; i < timing.length; i++) {
        if (currentTime >= timing[i].time) {
            index = i;
        }
    }
    return index;
}


// Actualizar panel de dedicatoria con sincronización
function updateDedicationPanel() {
    if (!isExpanded) return;
    
    const dedication = getCurrentDedication();
    
    // Actualizar título y subtítulo para la canción actual
    document.getElementById('dedicationTitle').value = dedication.title;
    document.querySelector('.dedication-subtitle').textContent = dedication.subtitle;
    
    // Calcular timing
    const timing = calculateDedicationTiming();
    const currentDedicationIndex = getCurrentDedicationIndex();
    
    // Actualizar líneas con estado
    const linesContainer = document.getElementById('dedicationLines');
    linesContainer.innerHTML = '';
    
    timing.forEach((item, index) => {
        const lineElement = document.createElement('div');
        lineElement.className = 'dedication-line';
        lineElement.textContent = item.text;
        
        // Agregar clases según el estado
        if (index < currentDedicationIndex) {
            lineElement.classList.add('passed');
        } else if (index === currentDedicationIndex) {
            lineElement.classList.add('current');
        } else if (index === currentDedicationIndex + 1) {
            lineElement.classList.add('next');
        }
        
        // Mostrar tiempo estimado
        const timeSpan = document.createElement('span');
        timeSpan.className = 'dedication-time';
        timeSpan.textContent = formatTime(item.time);
        lineElement.appendChild(timeSpan);
        
        linesContainer.appendChild(lineElement);
    });
    
    // Auto-scroll a la línea actual
    const currentLine = document.querySelector('.dedication-line.current');
    if (currentLine) {
        currentLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}


function editDedication() {
    const currentSong = songs[currentTrack];
    const dedication = getCurrentDedication();
    const duration = actualDuration || currentSong.duration;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;
    
    const form = document.createElement('div');
    form.style.cssText = `
        background: linear-gradient(145deg, #1a1a1a, #2c2c2c);
        padding: 30px;
        border-radius: 20px;
        border: 2px solid #00ffff;
        box-shadow: 0 0 30px rgba(0,255,255,0.3);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        color: #00ffff;
    `;
    
    form.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px;">✏️ Dedicatoria para: "${currentSong.title}"</h3>
        
        <div style="background: rgba(0,255,255,0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <strong>Información:</strong><br>
            Canción: ${currentSong.title}<br>
            Artista: ${currentSong.artist}<br>
            Duración: ${formatTime(duration)}<br>
            Frases actuales: ${dedication.lines.length}<br>
            Tiempo por frase: ~${Math.round(duration / Math.max(dedication.lines.length, 1))}s
        </div>
        
        <div style="background: rgba(255,215,0,0.1); padding: 10px; border-radius: 8px; margin-bottom: 15px; font-size: 12px;">
            <strong>Nota:</strong> Esta dedicatoria es exclusiva para "${currentSong.title}". Cada canción puede tener su propia dedicatoria personalizada.
        </div>
        
        <label style="display: block; margin: 10px 0 5px;">Título de la Dedicatoria:</label>
        <input type="text" id="editTitle" value="${dedication.title}" style="width: 100%; padding: 8px; border: 1px solid #00ffff; background: rgba(0,0,0,0.5); color: #00ffff; border-radius: 5px;">
        
        <label style="display: block; margin: 15px 0 5px;">Subtítulo:</label>
        <input type="text" id="editSubtitle" value="${dedication.subtitle}" style="width: 100%; padding: 8px; border: 1px solid #00ffff; background: rgba(0,0,0,0.5); color: #00ffff; border-radius: 5px;">
        
        <label style="display: block; margin: 15px 0 5px;">Frases de amor (una por línea):</label>
        <textarea id="editLines" placeholder="Personaliza tu mensaje para esta canción específica:
        
♪ Esta canción es especial ♪
Porque me recuerda el día que te conocí
Cada vez que la escucho
Pienso en tu sonrisa
En cómo iluminas mi mundo
Eres mi melodía favorita
♪ Te amo más cada día ♪" style="width: 100%; height: 200px; padding: 8px; border: 1px solid #00ffff; background: rgba(0,0,0,0.5); color: #00ffff; border-radius: 5px; resize: vertical; font-family: inherit; line-height: 1.4;">${dedication.lines.join('\n')}</textarea>
        
        <div style="text-align: center; margin-top: 20px;">
            <button onclick="saveDedication()" style="padding: 12px 25px; margin: 0 10px; background: #4CAF50; color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 14px;">💾 Guardar para "${currentSong.title}"</button>
            <button onclick="closeDedicationModal()" style="padding: 12px 25px; margin: 0 10px; background: #f44336; color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 14px;">❌ Cancelar</button>
        </div>
    `;
    
    modal.appendChild(form);
    document.body.appendChild(modal);
    modal.id = 'dedicationModal';
}


function saveDedication() {
    const title = document.getElementById('editTitle').value.trim();
    const subtitle = document.getElementById('editSubtitle').value.trim();
    const lines = document.getElementById('editLines').value.split('\n').filter(line => line.trim());
    
    if (title && lines.length > 0) {
        const songId = getSongId(songs[currentTrack]);
        
        // Guardar dedicatoria específica para esta canción
        songDedications[songId] = {
            title: title,
            subtitle: subtitle,
            lines: lines
        };
        
        // Guardar todas las dedicatorias en localStorage
        localStorage.setItem('allSongDedications', JSON.stringify(songDedications));
        
        // Actualizar la pantalla
        updateDedicationPanel();
        
        // Cerrar modal
        closeDedicationModal();
        
        alert(`💕 Dedicatoria guardada para "${songs[currentTrack].title}"!\n\nCada canción ahora puede tener su propia dedicatoria única.`);
    } else {
        alert('⚠️ Por favor completa al menos el título y una frase.');
    }
}


function closeDedicationModal() {
    const modal = document.getElementById('dedicationModal');
    if (modal) {
        modal.remove();
    }
}


function loadSavedDedications() {
    const saved = localStorage.getItem('allSongDedications');
    if (saved) {
        songDedications = JSON.parse(saved);
    }
}






        window.onload = initPlayer;
