import data from './data';

window.onload = () => {
    const imageListDialog = new ImageListDialog(data);

    document.addEventListener('click', event => {
        const element = event.target;

        if(element.matches('.image_list li')) {
            imageListDialog.openDialog(element);
        }

        if(element.matches('.close_dialog, .dialog_background')) {
            imageListDialog.closeDialog();
        }

        if(element.matches('.next_image')) {
            imageListDialog.nextSlide();
        }

        if(element.matches('.previous_image')) {
            imageListDialog.previousSlide();
        }

        if(element.matches('.color_mode_button')) {
            document.body.classList.toggle('light_mode');
        }

        if(element.matches('.desktop_button')) {
            imageListDialog.imageType = 'desktop';
            imageListDialog.getSlides();
        }

        if(element.matches('.tablet_button')) {
            imageListDialog.imageType = 'tablet';
            imageListDialog.getSlides();
        }

        if(element.matches('.mobile_button')) {
            imageListDialog.imageType = 'mobile';
            imageListDialog.getSlides();
        }
    });

    const animatedBackgrounds = document.querySelectorAll('.background_polygon:not(.child_polygon)');
    let isScrolling = false;
    setInterval(() => {
        if(isScrolling) {
            animatedBackgrounds.forEach(background => background.classList.add('paused'));
        } else {
            animatedBackgrounds.forEach(background => background.classList.remove('paused'));
        }
    });
    let scrollingInterval = setInterval(() => {
        isScrolling = false;
    }, 250);
    window.addEventListener('scroll', function() {
        clearInterval(scrollingInterval);
        isScrolling = true;
        scrollingInterval = setInterval(() => {
            isScrolling = false;
        }, 250);
    });
};

class ImageListDialog {
    constructor(data){
        const imageLists = document.querySelectorAll('.image_list');
        this.data = data;
        this.imageDialog = document.querySelector('.image_dialog');
        this.imageSlide = document.querySelector('.image_slide');
        this.imageSlideImage = this.imageSlide.querySelector('img');
        this.cdnUrl = 'https://res.cloudinary.com/dloxgdltu/image/upload';
        this.dialogActive = false;
        this.activeListId = null;
        this.dialogSlides = [];
        this.currentSlide = 0;

        this.imageType = this.getImageTypeByBreakpoint();
        this.initLists(imageLists);

        // Re initialize the lists if the window is resized to a different orientation/breakpoint
        window.addEventListener('resize', () => {
            const oldImageType = this.imageType;
            this.imageType = this.getImageTypeByBreakpoint();

            if(oldImageType !== this.imageType) {
                this.initLists(imageLists);

                if(this.activeListId != null){
                    this.getSlides(this.activeListId);
                }
            }
        });
    }

    initLists(lists) {
        Array.from(lists).forEach((list) => {
            const listId = list.getAttribute('id');
            const data = this.data[listId] || {};
            const images = data[this.imageType];

            // Clear the list if it has items already
            list.innerHTML = '';

            images.forEach((image) => {
                const item = document.createElement('li');
                item.dataset['listId'] = listId;
                item.innerHTML = `<img src="${this.getThumb(image)}" alt="Musora Screenshot Thumbnail" />`;

                list.appendChild(item);
            });
        });
    }

    getThumb(image) {
        const baseUrl = `${this.cdnUrl}/ar_1:1,c_fill,g_auto,w_250`;
        return `${baseUrl}/${image}`;
    }

    getImageTypeByBreakpoint() {
        if (window.matchMedia('(orientation: landscape)').matches) {
            return 'desktop';
        }

        if (
            window.matchMedia('(min-width: 760px)').matches &&
            window.matchMedia('(orientation: portrait)').matches
        ) {
            return 'tablet';
        }

        return 'mobile';
    }

    openDialog(listItem) {
        this.imageDialog.classList.add('active');
        this.dialogActive = true;
        this.activeListId = listItem.dataset['listId'];
        this.currentSlide = Array.from(listItem.parentElement.children).indexOf(listItem);

        this.getSlides();
    }

    closeDialog() {
        this.imageDialog.classList.remove('active');
        this.dialogActive = false;
    }

    getSlides() {
        this.dialogSlides = data[this.activeListId][this.imageType];
        const currentSlide = this.dialogSlides[this.currentSlide];

        this.activeSlide = this.getSlideUrl(currentSlide);

        this.imageDialog.classList.remove('desktop', 'mobile', 'tablet');
        this.imageDialog.classList.add(this.imageType);
        this.imageSlideImage.src = this.activeSlide;

        this.imageSlideImage.onload = () => {
            this.preloadSlides(this.dialogSlides.filter(slide => slide !== currentSlide));
        };
    }

    preloadSlides(slides = []) {
        slides.forEach(slide => {
            const image = new Image();
            image.src = this.getSlideUrl(slide);
        });
    }

    getSlideUrl(slide) {
        return `${this.cdnUrl}/${slide}`;
    }

    nextSlide() {
        this.currentSlide += 1;

        if(this.currentSlide >= this.dialogSlides.length) {
            this.currentSlide = 0;
        }

        this.activeSlide = this.getSlideUrl(this.dialogSlides[this.currentSlide]);
        this.imageSlideImage.src = this.activeSlide;
    }

    previousSlide() {
        this.currentSlide -= 1;

        if(this.currentSlide < 0) {
            this.currentSlide = this.dialogSlides.length - 1;
        }

        this.activeSlide = this.getSlideUrl(this.dialogSlides[this.currentSlide]);
        this.imageSlideImage.src = this.activeSlide;
    }
}

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
}

