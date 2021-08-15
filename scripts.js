import AnimatedCharacter from "css-animated-character/scripts/AnimatedCharacter";
import AnimatedDogCharacter from "css-animated-character/scripts/AnimatedDogCharacter";

export default function() {
    window.onload = () => {
        const character = new AnimatedCharacter(document.getElementById('character'));
        const dog = new AnimatedDogCharacter(document.getElementById('dog'));
        const world = document.querySelector('.world');
        const ground = document.querySelector('.ground .box');
        const sky = document.querySelector('.sky');

        setTimeout(() => {
            requestAnimationFrame(() => {
                character.walk();
                dog.walk();
                world.classList.add('moving');
            });
        }, 1000);

        ground.addEventListener('animationiteration', () => {
            requestAnimationFrame(() => {
                sky.classList.toggle('night');
            });
        });

        document.addEventListener('click', (event) => {
            const element = event.target;
            const handlers = {
                'zoomOut': () => {
                    requestAnimationFrame(() => {
                        world.classList.add('zoomed-out');
                    });
                },
                'zoomIn': () => {
                    requestAnimationFrame(() => {
                        world.classList.remove('zoomed-out');
                    });
                }
            };
            if(handlers[element.id] != null) {
                handlers[element.id]();
            }
        });
    };
};
