import "./libs/webaudiocontrols.js";

const getBaseURL = () => {
    return new URL('.', import.meta.url);
};

export class webaudio_controls extends HTMLElement {

    source = [];
    currentTrackIndex = 0;
    acceleration = 1.0; 

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
    
        p {
            font-size: 18px;
            margin-bottom: 10px;
        }
    
        button {
            font-size: 16px;
            padding: 10px 20px;
            margin: 5px;
            cursor: pointer;
            border: none;
            border-radius: 8px;
            transition: background-color 0.3s ease, transform 0.2s ease;
        }
    
        .recule, .avance {
            background-color: #e74c3c;
            color: #fff;
        }
    
        .recule:hover, .avance:hover {
            background-color: #c0392b;
            transform: scale(1.05);
        }
    
        .speed-controls {
            margin-top: 10px;
        }
    
        .decrease-speed, .increase-speed {
            background-color: #3498db;
            color: #fff;
        }
    
        .decrease-speed:hover, .increase-speed:hover {
            background-color: #2980b9;
            transform: scale(1.05);
        }
    
        #accelerationValue {
            font-size: 18px;
            margin: 0 10px;
        }
    
        .volume-controls {
            margin-top: 10px;
        }
    </style>
    

            <div class="container">
                <p>Avance/Recule</p>
                <button class="recule" id="recule">-5 sec</button>
                <button class="avance" id="avance">+5 sec</button>
                <br>
                <div class="speed-controls">
                    <p>Vitesse de lecture</p>
                    <button class="decrease-speed" id="decreaseSpeed">-</button>
                    <span id="accelerationValue">${this.acceleration}</span> <!-- Affichage de la valeur d'accélération -->
                    <button class="increase-speed" id="increaseSpeed">+</button>
                    <br>
                    <div class="volume-controls">
                        <p>Volume</p>
                        <webaudio-knob id="knob1"  src="./images/knobs/LittlePhatty.png" 
                            value="50" step="1" diameter="64"
                            tooltip="Knob1 tooltip %d">
                        </webaudio-knob>
                    </div>
                </div>
            </div>
        `;

        this.src = this.getAttribute('playlist');
        console.log(this.src);

        this.baseURL = getBaseURL();

        console.log(getBaseURL());
        this.audioSource = null;
    }

    connectedCallback() {
        this.changeRelativeURLsToAbsolute();
        this.defineListeners();
    }

    setAudioSource(src) {
        this.audioSource = src;
    }

    changeRelativeURLsToAbsolute() {
        let elements = this.shadowRoot.querySelectorAll('img, webaudio-knob, webaudio-switch');

        elements.forEach((e) => {
            let elementPath = e.getAttribute('src');
            if (elementPath.indexOf('://') === -1)
                e.src = getBaseURL() + '/' + elementPath;
        });
    }

    defineListeners() {
        this.shadowRoot.querySelector('#knob1').addEventListener('input', (event) => {
            this.audioSource.volume = event.target.value / 100;
        });

        this.shadowRoot.querySelector('#avance').addEventListener('click', () => {
            this.avance();
        });

        this.shadowRoot.querySelector('#recule').addEventListener('click', () => {
            this.recule();
        });

        this.shadowRoot.querySelector('#increaseSpeed').addEventListener('click', () => {
            this.increaseSpeed();
        });

        this.shadowRoot.querySelector('#decreaseSpeed').addEventListener('click', () => {
            this.decreaseSpeed();
        });
    }

    avance() {
        this.audioSource.currentTime += 5;
        console.log("test");
    }

    recule() {
        this.audioSource.currentTime -= 5;
    }

    increaseSpeed() {
        this.acceleration += 0.1;
        this.updateAccelerationValue();
        this.changePlaybackRate(0.1);
    }

    decreaseSpeed() {
        this.acceleration -= 0.1;
        this.updateAccelerationValue();
        this.changePlaybackRate(-0.1);
    }

    updateAccelerationValue() {
        const accelerationValueElement = this.shadowRoot.querySelector('#accelerationValue');
        if (accelerationValueElement) {
            accelerationValueElement.textContent = this.acceleration.toFixed(1);
        }
    }

    changePlaybackRate(acceleration) {
        const player = this.audioSource;
        player.playbackRate += acceleration;

        if (player.playbackRate < 0.5) {
            player.playbackRate = 0.5;
        } else if (player.playbackRate > 2) {
            player.playbackRate = 2;
        }
    }
}

customElements.define('my-controls', webaudio_controls);
