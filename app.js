document.addEventListener("DOMContentLoaded", function() {

    const navigationLinks = document.querySelectorAll('.nav');

    let filter = document.querySelectorAll('.filter');
    let items = document.querySelectorAll('.image-wrapper, .description');

    const imageWrapper = document.querySelector('.image-wrapper');
    const thumbImages = document.querySelectorAll('.thumb');
    let secondaryImages = document.querySelectorAll('img.secondary');
    const lightbox = imageWrapper.querySelector('.lightbox');
    const closeButton = lightbox.querySelector('.close-button');
    const imageGallery = document.querySelector('.image-gallery');
    // const prevButton = document.querySelector('#prev-btn');
    // const nextButton = document.querySelector('#next-btn');

    // Lazy Loading
    // Get all img elements
    const images = document.querySelectorAll('img');

    // Loop through each image and add the lazy loading attribute
    images.forEach(image => {
        image.setAttribute('loading', 'lazy');
    });

    // JSON for gallery
    const galleryDivs = document.querySelectorAll('.image');

    galleryDivs.forEach(function(galleryDiv) {
        const dataset = galleryDiv.dataset.set;

        fetch('gallery.json')
            .then(response => response.json())
            .then(data => {
                const datasetData = data[dataset];

                const titleElement = galleryDiv.querySelector('[data-title]');
                const descriptionElement = galleryDiv.querySelector('[data-description]');
                const imageThumbElement = galleryDiv.querySelector('[data-imagethumb-path]');
                const imageSecondaryElements = galleryDiv.querySelectorAll('img.secondary');

                titleElement.textContent = datasetData.title;
                descriptionElement.innerHTML = datasetData.description.replace(/\n/g, '<br>'); // Insert line break replacement
                imageThumbElement.src = datasetData.imageThumbPath;

                imageSecondaryElements.forEach((element, index) => {
                    element.src = datasetData.secondaryImages[index];
                });
            })
            .catch(error => console.log(error));
    });



    // Navigation
    // Remove the 'active' class from all navigation links
    function removeActiveClass() {
        navigationLinks.forEach(link => {
            link.classList.remove('active');
        });
    }

    // Add the 'active' class to the selected navigation link
    function setActiveClass(link) {
        removeActiveClass();
        link.classList.add('active');
    }

    // Scroll to the target section when a navigation link is clicked
    function scrollToSection(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const offsetTop = targetSection.offsetTop;

        setActiveClass(this);

        // Scroll to the target section smoothly
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    // Attach click event listeners to navigation links
    navigationLinks.forEach(link => {
        link.addEventListener('click', scrollToSection);
    });

    // Filter
    for (let i = 0; i < filter.length; i++) {
        filter[i].addEventListener('click', function() {
            for (let j = 0; j < filter.length; j++) {
                filter[j].classList.remove('active');
            }
            this.classList.add('active');

            console.log("clicked!");

            let dataFilter = this.getAttribute('data-filter');

            for (let k = 0; k < items.length; k++) {
                items[k].classList.remove('active');
                items[k].classList.add('hide');

                if (dataFilter === "view-all") {
                    if (items[k].classList.contains('image-wrapper')) {
                        items[k].classList.remove('hide');
                        setTimeout(function() {
                            items[k].classList.add('active');
                        }, 10);
                    }
                } else {
                    if (items[k].getAttribute('data-item') === dataFilter) {
                        items[k].classList.remove('hide');
                        setTimeout(function() {
                            items[k].classList.add('active');
                        }, 10);
                    }
                }
            }
        });
    }

    // Initially show all images and hide non-"View All" descriptions
    for (let i = 0; i < items.length; i++) {
        if (items[i].classList.contains('image-wrapper')) {
            setTimeout(function() {
                items[i].classList.remove('hide');
                items[i].classList.add('active');
            }, 10);
        } else {
            items[i].classList.add('hide');
        }
    }

    //Lightbox
    // Function to disable scrolling
    function disableScroll() {
        // Get the current scroll position
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        // Save the current scroll position as a CSS style on the body
        document.body.style.top = `-${scrollPosition}px`;
        // Add 'fixed' position and overflow hidden to the body
        document.body.style.position = 'fixed';
        document.body.style.overflow = 'hidden';
    }

    // Function to enable scrolling
    function enableScroll() {
        // Retrieve the saved scroll position from the body style
        const scrollPosition = parseInt(document.body.style.top, 10) || 0;
        // Remove the saved scroll position style from the body
        document.body.style.top = '';
        // Remove 'fixed' position and overflow hidden from the body
        document.body.style.position = '';
        document.body.style.overflow = '';
        // Restore the scroll position
        window.scrollTo(0, -scrollPosition);
    }

    // Attach event listeners to each thumbnail image
    thumbImages.forEach(thumbImage => {
        thumbImage.addEventListener('click', openLightbox);
    });

    // Event delegation for close button click event
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('close-button')) {
            const lightbox = event.target.closest('.lightbox');
            closeLightbox(lightbox);
        }
    });

    // Function to show the current image in the lightbox
    function showImage(thumbImage) {
        const imageWrapper = thumbImage.closest('.image-wrapper');
        const lightbox = imageWrapper.querySelector('.lightbox');
        const dataset = thumbImage.parentElement.dataset.set;
        const datasetData = data[dataset];
        const secondaryImages = lightbox.querySelectorAll('.image-gallery img.secondary');
        let currentIndex = Array.from(secondaryImages).indexOf(thumbImage);

        const titleElement = lightbox.querySelector('[data-title]');
        const descriptionElement = lightbox.querySelector('[data-description]');
        const imageSecondaryElements = lightbox.querySelectorAll('.image-gallery img.secondary');

        titleElement.textContent = datasetData.title;
        descriptionElement.innerHTML = datasetData.description.replace(/\n/g, '<br>'); // Insert line break replacement

        // Hide all secondary images
        secondaryImages.forEach(image => (image.style.display = 'none'));

        // Show the current secondary image
        thumbImage.style.display = 'block';
        thumbImage.src = datasetData.secondaryImages[currentIndex];

        // Attach event listeners to the navigation buttons
        const prevButton = lightbox.querySelector('#prev-btn');
        const nextButton = lightbox.querySelector('#next-btn');

        prevButton.addEventListener('click', () => {
            showPrevImage();
        });

        nextButton.addEventListener('click', () => {
            showNextImage();
        });
    }

    // Open lightbox function
    function openLightbox() {
        // Disable scrolling
        disableScroll();

        // Show the lightbox with a transition
        const lightbox = this.parentElement.querySelector('.lightbox');
        lightbox.style.opacity = '0';
        lightbox.style.display = 'flex';
        setTimeout(() => {
            lightbox.style.opacity = '1';
            showImage(this);

            // Attach event listener to the close button
            const closeButton = lightbox.querySelector('.close-button');
            closeButton.addEventListener('click', closeLightbox.bind(null, lightbox)); // Pass lightbox reference to closeLightbox
        }, 10);
    }

    // Close lightbox function
    function closeLightbox(lightbox) {
        // Hide the lightbox with a transition
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.display = 'none';
            // Enable scrolling
            enableScroll();
        }, 300);
    }

    // Attach event listeners
    thumbImages.forEach(thumbImage => {
        thumbImage.addEventListener('click', openLightbox);
        const closeButton = thumbImage.closest('.lightbox').querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            const lightbox = thumbImage.closest('.lightbox');
            closeLightbox(lightbox);
        });
    });

    // Event listener for overlay close
    const lightboxes = document.querySelectorAll('.lightbox');
    lightboxes.forEach(lightbox => {
        lightbox.addEventListener('click', event => {
            if (event.target === lightbox) {
                closeLightbox(lightbox);
            }
        });
    });

    // Grabbing scroll through secondary images - center align content if no scroll
});