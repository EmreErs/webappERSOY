const getBaseURL = () => {
    return new URL('.', import.meta.url);
};

export class Launchpad extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
            .launchpad {
                font-family: 'Arial', sans-serif;
                background-color: #2c3e50;
                color: #ecf0f1;
                padding: 20px;
                border-radius: 10px;
                width: 300px;
                margin: auto;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            }

            #launchpad {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 20px;
            }
        
            #launchpad1,
            #launchpad2,
            #launchpad3 {
                display: flex;
                gap: 10px;
            }
        
            button {
                width: 80px;
                height: 80px;
                background-color: var(--button-color);
                border: 2px solid #fff;
                border-radius: 10px;
                font-size: 14px;
                color: #fff;
                cursor: pointer;
                outline: none;
            }
        
            button:active,
            button.active {
                background-color: var(--button-color-active);
            }
        
            #lg {
                --button-color: blue;
                --button-color-active: lightblue;
            }
        
            #bass1 {
                --button-color: green;
                --button-color-active: lightgreen;
            }
        
            #bass2 {
                --button-color: yellow;
                --button-color-active: lightyellow;
            }
        
            #bass3 {
                --button-color: red;
                --button-color-active: pink;
            }
        
            #dram1 {
                --button-color: purple;
                --button-color-active: violet;
            }
        
            #dram2 {
                --button-color: orange;
                --button-color-active: orangered;
            }
        
            #dram3 {
                --button-color: brown;
                --button-color-active: burlywood;
            }
        </style>
        
            </style>
            <div id="launchpad">
                <div id="launchpad1">
                    <button id="lg"></button>
                    <audio id="lgAudio" src="/audio/launchpad/ok-lets-go.mp3"></audio>
                </div>
                <div id="launchpad2">
                    <button id="bass1"></button>
                    <audio id="bass1Audio" src="/audio/launchpad/bass1.mp3"></audio>
                    <button id="bass2"></button>
                    <audio id="bass2Audio" src="/audio/launchpad/bass2.mp3"></audio>
                    <button id="bass3"></button>
                    <audio id="bass3Audio" src="/audio/launchpad/bass3.mp3"></audio>
                </div>
                <div id="launchpad3">
                    <button id="dram1"></button>
                    <audio id="dram1Audio" src="/audio/launchpad/dram1.mp3"></audio>
                    <button id="dram2"></button>
                    <audio id="dram2Audio" src="/audio/launchpad/dram2.mp3"></audio>
                    <button id="dram3"></button>
                    <audio id="dram3Audio" src="/audio/launchpad/dram3.mp3"></audio>
                </div>
            </div> 
        `;

        this.baseURL = getBaseURL();
    }

    connectedCallback() {
        this.changeRelativeURLsToAbsolute();
        this.defineListeners();
    }

    changeRelativeURLsToAbsolute() {
        let elements = this.shadowRoot.querySelectorAll('img, webaudio-knob, webaudio-switch, audio');

        elements.forEach((e) => {
            let elementPath = e.getAttribute('src');
            if (elementPath.indexOf('://') === -1)
                e.src = getBaseURL() + '/' + elementPath;
        });
    }

    defineListeners() {
        const lgButton = this.shadowRoot.querySelector('#lg');
        const bass1Button = this.shadowRoot.querySelector('#bass1');
        const bass2Button = this.shadowRoot.querySelector('#bass2');
        const bass3Button = this.shadowRoot.querySelector('#bass3');
        const dram1Button = this.shadowRoot.querySelector('#dram1');
        const dram2Button = this.shadowRoot.querySelector('#dram2');
        const dram3Button = this.shadowRoot.querySelector('#dram3');

        lgButton.addEventListener('click', () => this.playSound('lgAudio'));
        bass1Button.addEventListener('click', () => this.playSound('bass1Audio'));
        bass2Button.addEventListener('click', () => this.playSound('bass2Audio'));
        bass3Button.addEventListener('click', () => this.playSound('bass3Audio'));
        dram1Button.addEventListener('click', () => this.playSound('dram1Audio'));
        dram2Button.addEventListener('click', () => this.playSound('dram2Audio'));
        dram3Button.addEventListener('click', () => this.playSound('dram3Audio'));

        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'a':
                case'A':
                    lgButton.click();
                    lgButton.classList.add('active');
                    break;
                case 'z':
                case 'Z':
                    bass1Button.click();
                    bass1Button.classList.add('active');
                    break;
                case 'e':
                case 'E':
                    bass2Button.click();
                    bass2Button.classList.add('active');
                    break;
                case 'r':
                case 'R':
                    bass3Button.click();
                    bass3Button.classList.add('active');
                    break;
                case 'q':
                case 'Q':
                    dram1Button.click();
                    dram1Button.classList.add('active');
                    break;
                case 's':
                case 'S':
                    dram2Button.click();
                    dram2Button.classList.add('active');
                    break;
                case 'd':
                case 'D':
                    dram3Button.click();
                    dram3Button.classList.add('active');
                    break;
            }
        });
    }

    playSound(audioId) {
        const audioPlayer = this.shadowRoot.querySelector(`#${audioId}`);
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    }
}

customElements.define('my-launchpad', Launchpad);
