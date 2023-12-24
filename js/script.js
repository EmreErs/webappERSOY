window.onload = init;

let player;
function init() {
    console.log('page chargée');
    
    player = document.querySelector('#player');

    // on récupère les boutons play et pause
    const play = document.querySelector('#playBtn');
    const pause = document.querySelector('#pauseBtn');

    // on ajoute les listeners sur les boutons
    play.onclick = () => {
        player.play();
    }

    pause.onclick = () => {
        player.pause();
    }


}