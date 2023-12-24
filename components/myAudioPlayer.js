import "./libs/webaudiocontrols.js";
import "./webaudio_controls.js";
//import "./butterchurn_visualizer.js";
//import * as Butterchurn from '../node_modules/butterchurn/lib/butterchurn.js';

const getBaseURL = () => {
    return new URL('.', import.meta.url);
};

export class myAudioPlayer extends HTMLElement {

    source = [];
    currentTrackIndex = 0;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const playlistAttr = this.getAttribute('playlist');
        this.source = playlistAttr.split(',').map(src => src.trim());

        this.shadowRoot.innerHTML = `
        
        <style>
        .container {
            font-family: 'Arial', sans-serif;
            background-color: #2c3e50;
            color: #ecf0f1;
            padding: 20px;
            border-radius: 10px;
            width: 300px;
            margin: auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }
        
        .player-container {
            margin-bottom: 15px;
        }
        
        .progress {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 10px;
        }
        
        #progress {
            width: 100%;
            height: 10px; /* Hauteur de la barre de progression */
            background-color: #ddd; /* Couleur de fond de la barre de progression */
            border-radius: 5px; /* Coins arrondis pour un aspect plus doux */
            position: relative;
            overflow: hidden;
        }
        
        #progress::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 0%;
            background-color: #4caf50; /* Couleur de la barre de progression remplie */
            border-radius: 5px; /* Coins arrondis correspondants */
            transition: width 0.3s ease; /* Animation de transition */
        }
        
        
        
        #timer {
            margin-top: 10px;
            font-size: 20px; /* Taille de police plus grande */
            font-weight: bold; /* Police plus imposante */
            color: #FFFFF; /* Couleur du texte, ajustez selon vos préférences */
        }
        
        .controls {
            display: flex;
            flex-direction: column;
        }
        
        .controls button {
            background-color: #3498db;
            color: #ecf0f1;
            border: none;
            padding: 10px 15px;
            margin: 8px;
            cursor: pointer;
            border-radius: 4px;
            transition: background-color 0.3s ease;
        }
        
        .controls button:hover {
            background-color: #2980b9;
        }
        
        #play {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .play-icon,
        .pause-icon {
            width: 40px;
            height: auto;
            cursor: pointer;
        }
        
        .pause-icon {
            display: none;
        }
        
        #previous,
        #next,
        #play {  
            background-color: #e74c3c;
            color: #ecf0f1;
            border: none;
            padding: 10px 15px;
            margin: 8px;
            cursor: pointer;
            border-radius: 4px;
            transition: background-color 0.3s ease;
        }
        
        #previous:hover,
        #next:hover,
        #play:hover {  
            background-color: #c0392b;
        }
        
        /* Alignement côte à côte */
        #previous,
        #next,
        #play {  
            margin-right: 5px;
        }
        
        /* Code SVG pour l'icône play */
        .play-icon::before {
            content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-play-fill' viewBox='0 0 16 16'%3E%3Cpath d='m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z'/%3E%3C/svg%3E");
        }
        
        /* Code SVG pour l'icône pause */
        .pause-icon::before {
            content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pause-fill' viewBox='0 0 16 16'%3E%3Cpath d='M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z'/%3E%3C/svg%3E");
        }
        
        </style>
        

            
        <div class="container">
        
        <div class="player-container">
        <audio src = '#' id= "player">
        </div>
        <div class="progress">
        <progress id="progress" value="0" max="100"></progress>
        <span id="timer">0:00 / 0:00</span>
        </div>
        <div class="controls">
        <button class="previous" id="previous">Previous</button>
        

        <div id="play">
        <i class="play-icon" id="play-icon"></i>
        <i class="pause-icon" id="pause-icon" style="display: none;"></i>
    </div>


        <button class="next" id="next">Next</button>
        <br>
        <button class="pause" id="pause">Pause</button>
        <button class="reset" id="reset">Reset</button>
        <button class="stop" id="stop">Stop</button>
        <br>


        </div>
        </div>
        <my-controls id="audioControls"
        playlist = player></my-controls>



        </div>
        </div>
        `;

        this.src = this.getAttribute('playlist');
        console.log(this.src);

        this.baseURL = getBaseURL();

        console.log(getBaseURL());

        const player = this.shadowRoot.querySelector('#player');
        const audioControls = this.shadowRoot.querySelector('#audioControls');
        audioControls.setAudioSource(player);

        const butterchurn = this.shadowRoot.querySelector('#visualizer-container');
    
    }

    connectedCallback() {
        this.changeRelativeURLsToAbsolute();
        this.loadTrack(this.currentTrackIndex);
        this.defineListeners();

        this.initializeButterchurn();

    }

    initializeButterchurn() {
        const visualizerContainer = this.shadowRoot.querySelector('#visualizer-container');
        const butterchurnVisualizer = document.createElement('butterchurn-visualizer');
        butterchurnVisualizer.setAudioElement(this.shadowRoot.querySelector('#player'));
        visualizerContainer.appendChild(butterchurnVisualizer);
    }


    changeRelativeURLsToAbsolute() {
        let elements = this.shadowRoot.querySelectorAll('img, webaudio-knob, webaudio-switch');

        elements.forEach((e) => {
            let elementPath = e.getAttribute('src');
            // if the image path isn't already absolute, make it absolute
            if (elementPath.indexOf('://') === -1)
                e.src = getBaseURL() + '/' + elementPath;
        });

    }

    defineListeners() {


        const player = this.shadowRoot.querySelector('#player');

        player.addEventListener('ended', () => {
            this.playNextTrack();
        });


        this.shadowRoot.querySelector('#play').addEventListener('click', () => {
            const playIcon = this.shadowRoot.querySelector('#play-icon');
            const pauseIcon = this.shadowRoot.querySelector('#pause-icon');

            if (playIcon.style.display !== 'none') {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'inline-block';
                this.play();
            } else {
                playIcon.style.display = 'inline-block';
                pauseIcon.style.display = 'none';
                this.pause();
            }
        });

        this.shadowRoot.querySelector('#pause').addEventListener('click', () => {
            const playIcon = this.shadowRoot.querySelector('#play-icon');
            const pauseIcon = this.shadowRoot.querySelector('#pause-icon');

            playIcon.style.display = 'inline-block';
            pauseIcon.style.display = 'none';
            this.pause();
        });
        this.shadowRoot.querySelector('#reset').addEventListener('click', () => {
            this.reset();
        });
        this.shadowRoot.querySelector('#stop').addEventListener('click', () => {
            this.stop();
        });

        this.shadowRoot.querySelector('#player').addEventListener('timeupdate', () => {
            this.progress();
        });
        const progress = this.shadowRoot.querySelector('#progress');

        progress.addEventListener('mousedown', (event) => {
            this.handleProgressClick(event);
        });

        progress.addEventListener('mousemove', (event) => {
            this.handleProgressMove(event);
        });

        progress.addEventListener('mouseup', () => {
            this.handleProgressRelease();
        });
        this.updateTimer();

        this.shadowRoot.querySelector('#previous').addEventListener('click', () => {
            this.playPreviousTrack();
        });

        this.shadowRoot.querySelector('#next').addEventListener('click', () => {
            this.playNextTrack();
        });
    }


    loadTrack(index) {
        if (index >= 0 && index < this.source.length) {
            const player = this.shadowRoot.querySelector('#player');
            player.src = this.source[index];
            console.log(this.source[index]);
            player.load();
        }
    }

    playNextTrack() {
        this.currentTrackIndex++;
        if (this.currentTrackIndex < this.source.length) {
            this.loadTrack(this.currentTrackIndex);
            this.play();
        } else {
            this.currentTrackIndex = 0;
            this.loadTrack(this.currentTrackIndex);
            this.play();
        }
    }

    play() {
        this.shadowRoot.querySelector('#player').play();
    }

    pause() {
        this.shadowRoot.querySelector('#player').pause();
    }

    reset() {
        this.shadowRoot.querySelector('#player').currentTime = 0;
    }
    stop() {
        this.shadowRoot.querySelector('#player').pause();
        this.shadowRoot.querySelector('#player').currentTime = 0;
    }
    avance() {
        this.shadowRoot.querySelector('#player').currentTime += 5;
    }
    recule() {
        this.shadowRoot.querySelector('#player').currentTime -= 5;
    }
    progress() {
        let player = this.shadowRoot.querySelector('#player');
        let progress = this.shadowRoot.querySelector('#progress');
        if (!isNaN(player.duration) && player.duration > 0) {
            progress.value = (player.currentTime / player.duration) * 100;
        }
    }
    updateTimer() {
        const player = this.shadowRoot.querySelector('#player');
        const timer = this.shadowRoot.querySelector('#timer');

        const update = () => {
            const currentTime = player.currentTime;
            const duration = player.duration;

            const currentMinutes = Math.floor(currentTime / 60);
            const currentSeconds = Math.floor(currentTime % 60);
            const durationMinutes = Math.floor(duration / 60);
            const durationSeconds = Math.floor(duration % 60);

            const timerText = `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;
            timer.textContent = timerText;
        };



        setInterval(update, 1000); 

    }

    handleProgressClick(event) {
        const progress = this.shadowRoot.querySelector('#progress');
        const player = this.shadowRoot.querySelector('#player');

        const clickX = event.clientX - progress.getBoundingClientRect().left;
        const percent = (clickX / progress.offsetWidth);
        player.currentTime = player.duration * percent;
    }

    handleProgressMove(event) {
        const progress = this.shadowRoot.querySelector('#progress');
        const player = this.shadowRoot.querySelector('#player');

        if (event.buttons === 1) {
            const moveX = event.clientX - progress.getBoundingClientRect().left;
            const percent = (moveX / progress.offsetWidth);
            player.currentTime = player.duration * percent;
        }
    }

    handleProgressRelease() {
    }

    changePlaybackRate(change) {
        const player = this.shadowRoot.querySelector('#player');
        player.playbackRate += change;

        if (player.playbackRate < 0.5) {
            player.playbackRate = 0.5;
        } else if (player.playbackRate > 2) {
            player.playbackRate = 2;
        }
    }

    playPreviousTrack() {
        this.currentTrackIndex--;
        if (this.currentTrackIndex >= 0) {
            this.loadTrack(this.currentTrackIndex);
            this.play();
        } else {
            this.currentTrackIndex = this.source.length - 1;
            this.loadTrack(this.currentTrackIndex);
            this.play();
        }
    }

    playNextTrack() {
        this.currentTrackIndex++;
        if (this.currentTrackIndex < this.source.length) {
            this.loadTrack(this.currentTrackIndex);
            this.play();
        } else {
            this.currentTrackIndex = 0;
            this.loadTrack(this.currentTrackIndex);
            this.play();
        }
    }

}

customElements.define('my-audio-player', myAudioPlayer);