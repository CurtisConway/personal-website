import AnimatedCharacter from "css-animated-character/scripts/AnimatedCharacter";
import 'css-animated-character/styles/character.scss';
import './style.scss';

window.onload = () => {
    const character = new AnimatedCharacter(document.getElementById('character'));
    const viewport = document.querySelector('.viewport');
    const props = document.querySelectorAll('.prop');
    const sky = document.querySelector('.sky');
    sky.addEventListener('animationiteration', () => {
        requestAnimationFrame(() => {
            sky.classList.toggle('night');
        });
    });
    character.walk();

    // const intersectionObserver = new IntersectionObserver((entries) => {
    //     entries.forEach(entry => {
    //         // console.log(entry);
    //         if(entry.isIntersecting) {
    //             entry.target.classList.remove('offscreen');
    //         } else {
    //             entry.target.classList.add('offscreen');
    //         }
    //     });
    // }, {
    //     root: viewport,
    //     rootMargin: '10%',
    //     threshold: 0.01,
    // });
    //
    // props.forEach((prop) => {
    //     intersectionObserver.observe(prop);
    // });
};
