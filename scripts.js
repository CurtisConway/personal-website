document.addEventListener('DOMContentLoaded', () => {
    const imageDialog = new ImageDialog(document.querySelector('.image_dialog'));

    document.addEventListener('click', event => {
        const element = event.target;

        if(element.matches('[data-image-slide-thumb]')) imageDialog.open(element);

        if(element.matches('.close_dialog, .dialog_background')) imageDialog.close();

        if(element.matches('.next_image')) imageDialog.nextSlide();

        if(element.matches('.previous_image')) imageDialog.previousSlide();
    });

});

class ImageDialog {
    constructor(element){
        this.dialogElement = element;
        this.activeImageElement = this.dialogElement.querySelector('img.active');
        this.inactiveImageElement = this.dialogElement.querySelector('img.inactive');
        this.imageSlides = [];
        this.currentSlide = 0;
        this.animating = false;

        window.ImageDialogOpen = false;
        document.addEventListener('keyup', event => this.enableKeyboardControls(event));
    }

    open(thumb){
        const imageThumbs = thumb.parentElement.querySelectorAll('[data-image-slide-thumb]');
        const imageToShow = thumb.querySelector('img').dataset['originalSource'];

        this.getSlides(imageThumbs);

        this.currentSlide = this.imageSlides.indexOf(imageToShow);

        window.ImageDialogOpen = true;

        this.dialogElement.classList.add('active');
        this.dialogElement.setAttribute('aria-hidden', 'false');
        this.setImage();
    }

    close(){
        this.dialogElement.classList.remove('active');
        this.dialogElement.setAttribute('aria-hidden', 'true');

        window.ImageDialogOpen = false;
    }

    nextSlide(){
        if(!this.animating){
            this.currentSlide++;
            this.setImage(this.currentSlide);
            this.nextSlideAnimation();
        }
    }

    previousSlide(){
        if(!this.animating) {
            this.currentSlide--;
            this.setImage(this.currentSlide);
            this.previousSlideAnimation();
        }
    }

    nextSlideAnimation(){
        this.activeImageElement.classList.add('enter_left');
        this.inactiveImageElement.classList.add('exit_left');
        this.animating = true;

        setTimeout(() => {
            this.activeImageElement.classList.remove('enter_left');
            this.inactiveImageElement.classList.remove('exit_left');
            this.animating = false;
        }, 600);
    }

    previousSlideAnimation(){
        this.activeImageElement.classList.add('enter_right');
        this.inactiveImageElement.classList.add('exit_right');
        this.animating = true;

        setTimeout(() => {
            this.activeImageElement.classList.remove('enter_right');
            this.inactiveImageElement.classList.remove('exit_right');
            this.animating = false;
        }, 600);
    }

    getSlides(thumbs){
        this.imageSlides = Array.from(thumbs).map(thumb => {
            return thumb.querySelector('img').dataset['originalSource'];
        });
    }

    setImage(slide){
        const activeImageElement = this.activeImageElement;
        const inactiveImageElement = this.inactiveImageElement;
        if(slide === this.imageSlides.length) this.currentSlide = 0;
        if(slide < 0) this.currentSlide = this.imageSlides.length - 1;

        inactiveImageElement.setAttribute('src', this.imageSlides[this.currentSlide]);
        inactiveImageElement.classList.add('active');
        inactiveImageElement.classList.remove('inactive');
        activeImageElement.classList.add('inactive');
        activeImageElement.classList.remove('active');

        this.activeImageElement = inactiveImageElement;
        this.inactiveImageElement = activeImageElement;
    }

    enableKeyboardControls(event){
        if(window.ImageDialogOpen === true){
            if(event.key === 'ArrowRight') this.nextSlide();
            if(event.key === 'ArrowLeft') this.previousSlide();
            if(event.key === 'Escape') this.close();
        }
    }
}

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
}

