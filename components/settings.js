import * as RecorderJS from 'https://cdn.skypack.dev/recorder-js';

class AudioRecorder extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.recorder = null;
    }

    connectedCallback() {
        const recordButton = document.createElement('button');
        recordButton.textContent = 'Record';
        recordButton.addEventListener('click', () => this.toggleRecording());
        this.shadowRoot.appendChild(recordButton);

        const style = document.createElement('style');
        style.textContent = `
            button {
                padding: 10px;
                background-color: #3498db;
                color: #ffffff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
        `;
        this.shadowRoot.appendChild(style);
    }

    initRecorder() {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                this.recorder = stream; // Assign the stream directly
            })
            .catch((error) => {
                console.error('Error initializing recorder:', error);
            });
    }

    toggleRecording() {
        if (!this.recorder) {
            this.initRecorder();
        }

        if (this.recorder && this.recorder.active) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    startRecording() {
        this.recorder && console.log('Recording audio...');
    }

    stopRecording() {
        this.recorder && console.log('Stopping recording...');
    }

    convertToMP3(wavBlob) {
        const lamejs = window.lamejs;
        const wavData = new DataView(wavBlob);

        const samples = new Int16Array(wavData.buffer, 44);

        const wav = lamejs.WavHeader.readHeader(new DataView(wavBlob));

        const mp3Encoder = new lamejs.Mp3Encoder(1, wav.sampleRate, 128);

        const mp3Data = [];
        const maxSamples = 1152;

        for (let i = 0; i < samples.length; i += maxSamples) {
            const leftChunk = samples.subarray(i, i + maxSamples);
            const mp3buf = mp3Encoder.encodeBuffer(leftChunk);
            if (mp3buf.length > 0) {
                mp3Data.push(new Int8Array(mp3buf));
            }
        }

        const mp3buf = mp3Encoder.flush();
        if (mp3buf.length > 0) {
            mp3Data.push(new Int8Array(mp3buf));
        }

        const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' });

        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(mp3Blob);
        downloadLink.download = 'recorded_audio.mp3';
        downloadLink.click();

        // Créer un formulaire avec le fichier MP3
        const formData = new FormData();
        formData.append('audio', mp3Blob, 'recorded_audio.mp3');

        // Envoyer le formulaire au serveur avec Fetch
        fetch('C:\Users\emree\Documents', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log('Enregistrement envoyé au serveur avec succès', data);
            })
            .catch(error => {
                console.error('Erreur lors de l\'envoi de l\'enregistrement au serveur', error);
            });
    }

}

customElements.define('audio-recorder', AudioRecorder);
