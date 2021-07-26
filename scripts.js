import data from './data';

window.onload = () => {
    const imageListDialog = new ImageListDialog(data);
    const iframeDialog = new IframeDialog(document.querySelector('.iframe_dialog'));

    document.addEventListener('click', event => {
        const element = event.target;

        if (element.matches('#musoraImageList') || element.matches('#junoImageList')) {
            imageListDialog.openDialog(element);
        }

        if(element.matches('.close_dialog, .dialog_background')) {
            imageListDialog.closeDialog();
            iframeDialog.closeDialog();
        }

        if(element.matches('[data-open-iframe]')) {
            iframeDialog.openDialog(element.dataset['openIframe']);
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
};

class IframeDialog {
    constructor(element) {
        this.element = element;
        this.iframe = element.querySelector('iframe');
    }

    openDialog(source) {
        document.body.classList.add('no-scroll');
        this.iframe.src = source;
        this.element.classList.add('active');
        this.iframe.classList.remove('hidden');
    }

    closeDialog() {
        document.body.classList.remove('no-scroll');
        this.element.classList.remove('active');
        this.iframe.classList.add('hidden');
        this.iframe.src = '';
    }
}

class ImageListDialog {
    constructor(data){
        this.data = data;
        this.imageDialog = document.querySelector('.image_dialog');
        this.imageSlide = document.querySelector('.image_slide');
        this.imageSlideImage = this.imageSlide.querySelector('img');
        this.cdnUrl = 'https://res.cloudinary.com/dloxgdltu/image/upload/q_auto:eco';
        this.dialogActive = false;
        this.activeListId = null;
        this.dialogSlides = [];
        this.currentSlide = 0;

        this.imageType = this.getImageTypeByBreakpoint();

        // Re initialize the lists if the window is resized to a different orientation/breakpoint
        window.addEventListener('resize', () => {
            const oldImageType = this.imageType;
            this.imageType = this.getImageTypeByBreakpoint();

            if(oldImageType !== this.imageType) {
                if(this.activeListId != null){
                    this.getSlides(this.activeListId);
                }
            }
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
        document.body.classList.add('no-scroll');
        this.imageDialog.classList.add('active');
        this.dialogActive = true;
        this.activeListId = listItem.getAttribute('id');
        this.currentSlide = 0;

        this.getSlides();
    }

    closeDialog() {
        document.body.classList.remove('no-scroll');
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

        this.preloadSlides(this.dialogSlides.filter(slide => slide !== currentSlide));
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

