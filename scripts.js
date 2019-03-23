document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('click', event => {
        const element = event.target;

        if(element.matches('[data-image-slide-thumb]')){
            showImage(element);
        }
    });
});

function showImage(thumb){
    const imageNumber = thumb.dataset['imageSlideThumb'];
    const imageThumbs = document.querySelectorAll('[data-image-slide-thumb]');
    const imageSlides = document.querySelectorAll('[data-image-slide]');
    const imageToShow = imageSlides[imageNumber - 1];

    Array.from(imageThumbs).forEach(thumb => { thumb.classList.remove('selected')});
    Array.from(imageSlides).forEach(slide => { slide.classList.remove('active')});

    thumb.classList.add('selected');
    imageToShow.classList.add('active');
}