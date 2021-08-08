import AnimatedCharacter from "css-animated-character/scripts/AnimatedCharacter";
import 'css-animated-character/styles/character.scss';
import './style.scss';

window.onload = () => {
    const character = new AnimatedCharacter(document.getElementById('character'));
    const sky = document.querySelector('.sky');
    sky.addEventListener('animationiteration', () => {
        console.log('hello?');
        sky.classList.toggle('night');
    });
    character.walk();
};
