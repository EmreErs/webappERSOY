import Butterchurn from '../node_modules/butterchurn/lib/butterchurn.js';

const butterchurnInstance = new Butterchurn();

butterchurnInstance.connectAudio(yourAudioElement);

class ButterchurnVisualizer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.audioElement = null;
        this.butterchurn = null;
    }

    connectedCallback() {
        this.render();
        this.initializeButterchurn();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                #visualizer-container {
                    width: 100%;
                    height: 300px; /* Adjust the height as needed */
                }
            </style>
            <div id="visualizer-container"></div>
        `;
    }
    initializeButterchurn() {
        const visualizerContainer = this.shadowRoot.querySelector('#visualizer-container');
    
        this.butterchurn = new Butterchurn();
    
        visualizerContainer.appendChild(this.butterchurn.canvas);
    
        if (this.audioElement) {
            this.butterchurn.connectAudio(this.audioElement);
        }
    }

    setAudioElement(audioElement) {
        this.audioElement = audioElement;
        if (this.butterchurn) {
            this.butterchurn.connectAudio(this.audioElement);
        }
    }
}

customElements.define('butterchurn-visualizer', ButterchurnVisualizer);
