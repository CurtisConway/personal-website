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
        this.imageElement = this.dialogElement.querySelector('img');
        this.imageSlides = [];
        this.currentSlide = 0;
    }

    open(thumb){
        const imageThumbs = thumb.parentElement.querySelectorAll('[data-image-slide-thumb]');
        const imageToShow = thumb.querySelector('img').getAttribute('src');

        this.getSlides(imageThumbs);

        this.currentSlide = this.imageSlides.indexOf(imageToShow);

        this.dialogElement.classList.add('active');
        this.setImage();
    }

    close(){
        this.dialogElement.classList.remove('active');
    }

    nextSlide(){
        this.currentSlide++;
        this.setImage(this.currentSlide);
    }

    previousSlide(){
        this.currentSlide--;
        this.setImage(this.currentSlide);
    }

    getSlides(thumbs){
        this.imageSlides = Array.from(thumbs).map(thumb => {
            return thumb.querySelector('img').getAttribute('src');
        });
    }

    setImage(slide){
        if(slide === this.imageSlides.length) this.currentSlide = 0;
        
        if(slide < 0) this.currentSlide = this.imageSlides.length - 1;

        this.imageElement.setAttribute('src', this.imageSlides[this.currentSlide]);
    }
}

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
}

